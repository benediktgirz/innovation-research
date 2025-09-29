// Vercel Serverless Function for Participation Form
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

interface ParticipationData {
  club_name: string;
  role: string;
  email: string;
  innovation: string;
  language: string;
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // CORS headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { club_name, role, email, innovation, language = 'en' }: ParticipationData = request.body;

    // Validate required fields
    if (!club_name || !role || !email || !innovation) {
      return response.status(400).json({
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
      ip_address: request.headers['x-forwarded-for'] || 'unknown'
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

    return response.status(200).json({
      success: true,
      message: 'Participation recorded successfully'
    });

  } catch (error) {
    console.error('Participation submission error:', error);
    return response.status(500).json({
      error: 'Internal server error'
    });
  }
}

async function sendEmail(emailData: { to: string; subject: string; body: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL || 'research@benedikt-girz.com';

  console.log('Sending email:', {
    to: emailData.to,
    subject: emailData.subject,
    service: 'Resend'
  });

  if (apiKey) {
    try {
      const resend = new Resend(apiKey);

      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: [process.env.NOTIFICATION_EMAIL || 'research@benedikt-girz.com'],
        subject: emailData.subject,
        text: emailData.body,
      });

      if (error) {
        console.error('Resend error:', error);
        throw new Error(`Resend API error: ${error.message}`);
      }

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

async function saveParticipation(participation: any) {
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

    // Option 2: Use external database (PostgreSQL, Supabase, etc.)
    if (process.env.DATABASE_URL) {
      // Placeholder for external database integration
      console.log('Would save to external database:', participation.id);
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