#!/usr/bin/env -S deno run -A

import Server from 'lume/core/server.ts';
import site from './_config.ts';

// Build the site
await site.build();

// Create server
const port = parseInt(Deno.env.get('PORT') || '3000');
const server = new Server({
  port,
  root: site.dest(),
});

// API endpoints for form handling
server.use('/api/participate', async (request, next) => {
  if (request.method === 'POST') {
    try {
      const body = await request.json();

      // Validate required fields
      const { club_name, role, email, innovation, language = 'en' } = body;

      if (!club_name || !role || !email || !innovation) {
        return new Response(JSON.stringify({
          error: 'Missing required fields'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
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
        ip_address: request.headers.get('x-forwarded-for') || 'unknown'
      };

      // Save to JSON file (simple persistence)
      await saveParticipation(participation);

      // Send email notification
      await sendEmail({
        to: 'research@benedikt-girz.com',
        subject: `New Research Participation - ${club_name}`,
        body: `
New participation received:

Club: ${club_name}
Role: ${role}
Email: ${email}
Language: ${language}
Innovation Response: ${innovation}

Submitted at: ${participation.submitted_at}
        `
      });

      return new Response(JSON.stringify({
        success: true,
        message: 'Participation recorded successfully'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });

    } catch (error) {
      console.error('Participation submission error:', error);
      return new Response(JSON.stringify({
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  return next();
});

server.use('/api/contact', async (request, next) => {
  if (request.method === 'POST') {
    try {
      const body = await request.json();

      // Validate required fields
      const { name, email, message, language = 'en' } = body;

      if (!name || !email || !message) {
        return new Response(JSON.stringify({
          error: 'Missing required fields'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Create contact entry
      const contact = {
        id: crypto.randomUUID(),
        name,
        email,
        message,
        language,
        submitted_at: new Date().toISOString(),
        ip_address: request.headers.get('x-forwarded-for') || 'unknown'
      };

      // Save to JSON file (simple persistence)
      await saveContact(contact);

      // Send email notification
      await sendEmail({
        to: 'research@benedikt-girz.com',
        subject: `New Contact Message - ${name}`,
        body: `
New contact message received:

Name: ${name}
Email: ${email}
Language: ${language}
Message: ${message}

Submitted at: ${contact.submitted_at}
        `
      });

      return new Response(JSON.stringify({
        success: true,
        message: 'Message sent successfully'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });

    } catch (error) {
      console.error('Contact submission error:', error);
      return new Response(JSON.stringify({
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  return next();
});

// CORS headers for API requests
server.use('/api/*', (request, next) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }
  return next();
});

// Helper functions
async function saveParticipation(participation: any) {
  const dataDir = './data';
  const filePath = `${dataDir}/participations.json`;

  try {
    await Deno.mkdir(dataDir, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }

  let participations = [];

  try {
    const existing = await Deno.readTextFile(filePath);
    participations = JSON.parse(existing);
  } catch (error) {
    // File might not exist yet
  }

  participations.push(participation);
  await Deno.writeTextFile(filePath, JSON.stringify(participations, null, 2));

  console.log(`Participation saved: ${participation.club_name} (${participation.email})`);
}

async function saveContact(contact: any) {
  const dataDir = './data';
  const filePath = `${dataDir}/contacts.json`;

  try {
    await Deno.mkdir(dataDir, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }

  let contacts = [];

  try {
    const existing = await Deno.readTextFile(filePath);
    contacts = JSON.parse(existing);
  } catch (error) {
    // File might not exist yet
  }

  contacts.push(contact);
  await Deno.writeTextFile(filePath, JSON.stringify(contacts, null, 2));
}

async function sendEmail(emailData: { to: string; subject: string; body: string }) {
  // Get email configuration from environment variables
  const emailService = Deno.env.get('EMAIL_SERVICE'); // 'sendgrid', 'mailgun', 'smtp'
  const apiKey = Deno.env.get('EMAIL_API_KEY');
  const fromEmail = Deno.env.get('FROM_EMAIL') || 'noreply@research.benedikt-girz.com';

  console.log('Sending email:', {
    to: emailData.to,
    subject: emailData.subject,
    service: emailService || 'console'
  });

  if (emailService === 'sendgrid' && apiKey) {
    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: emailData.to }],
            subject: emailData.subject,
          }],
          from: { email: fromEmail },
          content: [{
            type: 'text/plain',
            value: emailData.body,
          }],
        }),
      });

      if (!response.ok) {
        throw new Error(`SendGrid API error: ${response.status}`);
      }

      console.log('Email sent successfully via SendGrid');
    } catch (error) {
      console.error('Failed to send email via SendGrid:', error);
      throw error;
    }
  } else {
    // Fallback: log to console for development/testing
    console.log('Email content:', emailData);
    console.log('Note: Configure EMAIL_SERVICE and EMAIL_API_KEY environment variables for production email sending');
  }
}

// Start server
server.start();

console.log(`Innovation Research server running on http://localhost:${port}`);