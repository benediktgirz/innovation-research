const crypto = require('crypto');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { club_name, role, email, innovation, language = 'en' } = req.body;

    // Validate required fields
    if (!club_name || !role || !email || !innovation) {
      return res.status(400).json({
        error: 'Missing required fields: club_name, role, email, innovation'
      });
    }

    // Create participation entry
    const participation = {
      id: crypto.randomUUID(),
      club_name,
      role,
      email,
      innovation,
      language,
      submitted_at: new Date().toISOString(),
      ip_address: req.headers['x-forwarded-for'] || 'unknown'
    };

    // Send email notification
    await sendEmail({
      to: process.env.NOTIFICATION_EMAIL || 'research@benedikt-girz.com',
      subject: `New Research Participation - ${club_name}`,
      body: `
New participation received:

Club: ${club_name}
Role: ${role}
Email: ${email}
Language: ${language}
Innovation Response: ${innovation}

Submitted at: ${participation.submitted_at}
IP Address: ${participation.ip_address}
      `
    });

    // Store in database (using Vercel KV or external service)
    await saveParticipation(participation);

    return res.status(200).json({
      success: true,
      message: 'Participation recorded successfully'
    });

  } catch (error) {
    console.error('Participation submission error:', error);
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
};

async function sendEmail(emailData) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL || 'research@benedikt-girz.com';

  console.log('Sending email:', {
    to: emailData.to,
    subject: emailData.subject,
    service: 'Resend'
  });

  if (apiKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [process.env.NOTIFICATION_EMAIL || 'research@benedikt-girz.com'],
          subject: emailData.subject,
          text: emailData.body,
        }),
      });

      if (!response.ok) {
        throw new Error(`Resend API error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Email sent successfully via Resend:', data);
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  } else {
    console.log('Email content (no API key configured):', emailData);
    console.log('Note: Set RESEND_API_KEY environment variable to enable email sending');
  }
}

async function saveParticipation(participation) {
  try {
    // Option 1: Use Vercel KV (Redis-compatible)
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      // Store individual record with UUID key
      const individualKey = `participation:${participation.id}`;
      await fetch(`${process.env.KV_REST_API_URL}/set/${individualKey}/${encodeURIComponent(JSON.stringify(participation))}`, {
        headers: {
          'Authorization': `Bearer ${process.env.KV_REST_API_TOKEN}`,
        },
      });

      // Add to list for easy retrieval
      await fetch(`${process.env.KV_REST_API_URL}/lpush/participations/${encodeURIComponent(participation.id)}`, {
        headers: {
          'Authorization': `Bearer ${process.env.KV_REST_API_TOKEN}`,
        },
      });

      // Store club index for analytics
      const clubKey = `club:${participation.club_name.toLowerCase().replace(/\s+/g, '-')}`;
      await fetch(`${process.env.KV_REST_API_URL}/incr/${clubKey}`, {
        headers: {
          'Authorization': `Bearer ${process.env.KV_REST_API_TOKEN}`,
        },
      });

      console.log('✅ Successfully saved to Vercel KV:', participation.id);
      return;
    }

    // Fallback: Log to console (development only)
    console.log('📊 Participation data (no database configured):', {
      id: participation.id,
      club: participation.club_name,
      role: participation.role,
      email: participation.email.substring(0, 3) + '***', // Privacy
      innovation_length: participation.innovation.length,
      language: participation.language,
      timestamp: participation.submitted_at
    });

  } catch (error) {
    console.error('❌ Database save error:', error);
    // Don't throw - form should still succeed even if DB fails
  }
}