#!/usr/bin/env node

// Test the verified domain with Resend
const { Resend } = require('resend');

const RESEND_API_KEY = 're_ZM92UQ8J_6gGrCYxqAJ3uR9MeM8qPA4sK';

async function testVerifiedDomain() {
  console.log('🧪 Testing Verified Domain: benedikt-girz.com');
  console.log('=' .repeat(50));

  try {
    const resend = new Resend(RESEND_API_KEY);

    const testEmail = {
      from: 'research@benedikt-girz.com',
      to: ['research@benedikt-girz.com'],
      subject: '✅ Domain Verification Test - Research Platform',
      text: `Congratulations! 🎉

Your benedikt-girz.com domain is now verified and working with Resend.

This test email confirms that:
✅ Domain verification successful
✅ DNS records properly configured
✅ Email sending from research@benedikt-girz.com working
✅ Professional email address ready for production

Your innovation research platform can now send emails from your custom domain!

Timestamp: ${new Date().toISOString()}
Test ID: ${Math.random().toString(36).substring(7)}
`
    };

    console.log('📧 Sending test email from verified domain...');

    const { data, error } = await resend.emails.send(testEmail);

    if (error) {
      console.error('❌ Test failed:', error);
      return false;
    }

    console.log('✅ Domain verification test successful!');
    console.log('📧 Email ID:', data.id);
    console.log('\n🎯 Ready for Production:');
    console.log('• From: research@benedikt-girz.com ✅');
    console.log('• To: research@benedikt-girz.com ✅');
    console.log('• Domain: benedikt-girz.com ✅ Verified');
    console.log('• API: Resend ✅ Connected');

    return true;

  } catch (error) {
    console.error('❌ Domain test failed:', error);
    return false;
  }
}

testVerifiedDomain();