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
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        error: 'Missing required fields: name, email, message'
      });
    }

    // Send email notification
    await sendContactEmail({
      to: process.env.NOTIFICATION_EMAIL || 'research@benedikt-girz.com',
      subject: `Contact Form - ${name}`,
      body: `
New contact form submission:

Name: ${name}
Email: ${email}
Message: ${message}

Submitted at: ${new Date().toISOString()}
IP Address: ${req.headers['x-forwarded-for'] || 'unknown'}
      `
    });

    return res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully'
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
};

async function sendContactEmail(emailData) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL || 'research@benedikt-girz.com';

  console.log('Sending contact email:', {
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
      console.log('Contact email sent successfully via Resend:', data);
    } catch (error) {
      console.error('Failed to send contact email:', error);
      throw error;
    }
  } else {
    console.log('Contact email content (no API key configured):', emailData);
    console.log('Note: Set RESEND_API_KEY environment variable to enable email sending');
  }
}