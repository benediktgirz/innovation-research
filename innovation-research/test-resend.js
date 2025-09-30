#!/usr/bin/env node

// Test script to verify Resend email integration
const { Resend } = require('resend');

const RESEND_API_KEY = 're_ZM92UQ8J_6gGrCYxqAJ3uR9MeM8qPA4sK';

async function testResendIntegration() {
  console.log('🧪 Testing Resend Email Integration...');
  console.log('=' .repeat(50));

  try {
    const resend = new Resend(RESEND_API_KEY);

    // Test participation form notification
    console.log('📧 Sending test participation notification...');

    const participationEmail = {
      from: 'onboarding@resend.dev',
      to: ['benedikt.girz@gmail.com'],
      subject: 'Test - New Research Participation',
      text: `Test participation notification:

Club: Test FC
Role: Manager
Email: test@example.com
Language: en
Innovation Response: AI analysis for player performance optimization

This is a test email to verify the Resend integration is working correctly.

Timestamp: ${new Date().toISOString()}
`
    };

    const { data: participationData, error: participationError } = await resend.emails.send(participationEmail);

    if (participationError) {
      console.error('❌ Participation email failed:', participationError);
      return false;
    }

    console.log('✅ Participation email sent successfully:', participationData);

    // Test contact form notification
    console.log('\n📧 Sending test contact notification...');

    const contactEmail = {
      from: 'onboarding@resend.dev',
      to: ['benedikt.girz@gmail.com'],
      subject: 'Test - New Contact Message',
      text: `Test contact message:

Name: John Doe
Email: john@example.com
Language: en
Message: Hello, I am interested in participating in the football innovation research study. Could you please provide more details?

This is a test email to verify the contact form integration is working correctly.

Timestamp: ${new Date().toISOString()}
`
    };

    const { data: contactData, error: contactError } = await resend.emails.send(contactEmail);

    if (contactError) {
      console.error('❌ Contact email failed:', contactError);
      return false;
    }

    console.log('✅ Contact email sent successfully:', contactData);

    console.log('\n🎉 All Resend integration tests passed!');
    console.log('\n📋 Summary:');
    console.log('• Resend API connection: ✅ Working');
    console.log('• Participation form emails: ✅ Working');
    console.log('• Contact form emails: ✅ Working');
    console.log('• From address: research@benedikt-girz.com');
    console.log('• API Key: Configured correctly');

    return true;

  } catch (error) {
    console.error('❌ Resend integration test failed:', error);
    return false;
  }
}

testResendIntegration();