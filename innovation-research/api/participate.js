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
    const { club_name, role, email, innovation, effect, language = 'en' } = req.body;

    // Validate required fields
    if (!club_name || !role || !email || !innovation || !effect) {
      return res.status(400).json({
        error: 'Missing required fields: club_name, role, email, innovation, effect'
      });
    }

    // Create participation entry
    const participation = {
      id: crypto.randomUUID(),
      club_name,
      role,
      email,
      innovation,
      effect,
      language,
      submitted_at: new Date().toISOString(),
      ip_address: req.headers['x-forwarded-for'] || 'unknown'
    };

    // Send Telegram notification
    await sendTelegramNotification({
      club_name,
      role,
      email,
      language,
      innovation,
      effect,
      submitted_at: participation.submitted_at,
      ip_address: participation.ip_address
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

async function sendTelegramNotification(data) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.log('Telegram not configured - skipping notification');
    return;
  }

  const message = `🏆 *New Research Participation*

*Club:* ${data.club_name}
*Role:* ${data.role}
*Email:* ${data.email}
*Language:* ${data.language}

*Innovation Response:*
${data.innovation}

*Effect Response:*
${data.effect}

📅 *Submitted:* ${new Date(data.submitted_at).toLocaleString('en-GB', { timeZone: 'Europe/Berlin' })}
🌐 *IP:* ${data.ip_address}`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown'
      }),
    });

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ Telegram notification sent:', result.ok);
  } catch (error) {
    console.error('❌ Failed to send Telegram notification:', error);
    // Don't throw - notification failure shouldn't block the form submission
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
      effect_length: participation.effect.length,
      language: participation.language,
      timestamp: participation.submitted_at
    });

  } catch (error) {
    console.error('❌ Database save error:', error);
    // Don't throw - form should still succeed even if DB fails
  }
}