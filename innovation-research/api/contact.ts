// Vercel Serverless Function for Contact Form
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

interface ContactData {
  name: string;
  email: string;
  message: string;
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
    const { name, email, message, language = 'en' }: ContactData = request.body;

    // Validate required fields
    if (!name || !email || !message) {
      return response.status(400).json({
        error: 'Missing required fields: name, email, message'
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
      ip_address: request.headers['x-forwarded-for'] || 'unknown'
    };

    // Send email notification
    await sendEmail({
      to: process.env.NOTIFICATION_EMAIL || 'research@benedikt-girz.com',
      subject: `New Contact Message from ${name}`,
      body: `
New contact message received:

Name: ${name}
Email: ${email}
Language: ${language}
Message: ${message}

Submitted at: ${contact.submitted_at}
IP Address: ${contact.ip_address}
      `
    });

    // Store in database
    await saveContact(contact);

    return response.status(200).json({
      success: true,
      message: 'Message sent successfully'
    });

  } catch (error) {
    console.error('Contact submission error:', error);
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

async function saveContact(contact: any) {
  // Option 1: Use Vercel KV (Redis-compatible)
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const response = await fetch(`${process.env.KV_REST_API_URL}/lpush/contacts/${JSON.stringify(contact)}`, {
      headers: {
        'Authorization': `Bearer ${process.env.KV_REST_API_TOKEN}`,
      },
    });
    console.log('Saved to Vercel KV');
    return;
  }

  // Option 2: Use external database
  if (process.env.DATABASE_URL) {
    console.log('Would save to database:', contact);
    return;
  }

  // Fallback: Log to console
  console.log('Contact data:', contact);
}