#!/usr/bin/env node

/**
 * Database Integration Test Script
 * Tests the participation form submission and data storage
 */

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

async function testParticipationSubmission() {
  console.log('🧪 Testing Participation Form Submission...\n');

  const testData = {
    club_name: 'Test Football Club',
    role: 'Test Coach',
    email: 'test@example.com',
    innovation: 'Testing database integration for the innovation research platform. This is a comprehensive test to ensure data is properly stored and can be retrieved.',
    language: 'en'
  };

  try {
    console.log('📤 Submitting test participation...');
    const response = await fetch(`${BASE_URL}/api/participate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Participation submitted successfully!');
      console.log('Response:', result);
    } else {
      console.log('❌ Participation submission failed:');
      console.log('Status:', response.status);
      console.log('Error:', result);
    }

    return response.ok;

  } catch (error) {
    console.log('❌ Network error during submission:');
    console.log(error.message);
    return false;
  }
}

async function testDataRetrieval() {
  console.log('\n🔍 Testing Data Retrieval...\n');

  const testToken = process.env.DATA_ACCESS_TOKEN || 'research-admin-2024';

  try {
    console.log('📥 Retrieving stored data...');
    const response = await fetch(`${BASE_URL}/api/data?format=json`, {
      headers: {
        'Authorization': `Bearer ${testToken}`,
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Data retrieved successfully!');
      console.log(`Total responses: ${data.total_responses}`);
      console.log(`Export timestamp: ${data.exported_at}`);

      if (data.data && data.data.length > 0) {
        console.log('📊 Latest submission preview:');
        const latest = data.data[0];
        console.log(`- Club: ${latest.club_name}`);
        console.log(`- Role: ${latest.role}`);
        console.log(`- Language: ${latest.language}`);
        console.log(`- Submitted: ${latest.submitted_at}`);
        console.log(`- Innovation length: ${latest.innovation.length} characters`);
      }
    } else {
      const error = await response.json();
      console.log('❌ Data retrieval failed:');
      console.log('Status:', response.status);
      console.log('Error:', error);
    }

    return response.ok;

  } catch (error) {
    console.log('❌ Network error during data retrieval:');
    console.log(error.message);
    return false;
  }
}

async function testAnalytics() {
  console.log('\n📈 Testing Analytics Endpoint...\n');

  const testToken = process.env.DATA_ACCESS_TOKEN || 'research-admin-2024';

  try {
    console.log('📊 Retrieving analytics data...');
    const response = await fetch(`${BASE_URL}/api/data?export_type=analytics`, {
      headers: {
        'Authorization': `Bearer ${testToken}`,
      }
    });

    if (response.ok) {
      const analytics = await response.json();
      console.log('✅ Analytics retrieved successfully!');
      console.log(`Total responses: ${analytics.total_responses}`);
      console.log('Language distribution:', analytics.by_language);
      console.log('Role distribution:', analytics.by_role);
      console.log('Top clubs:', analytics.top_clubs);
      console.log(`Timeline entries: ${analytics.response_timeline.length}`);
      console.log(`Latest submissions: ${analytics.latest_submissions.length}`);
    } else {
      const error = await response.json();
      console.log('❌ Analytics retrieval failed:');
      console.log('Status:', response.status);
      console.log('Error:', error);
    }

    return response.ok;

  } catch (error) {
    console.log('❌ Network error during analytics retrieval:');
    console.log(error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting Database Integration Tests\n');
  console.log(`Testing against: ${BASE_URL}\n`);

  const results = {
    submission: await testParticipationSubmission(),
    retrieval: await testDataRetrieval(),
    analytics: await testAnalytics()
  };

  console.log('\n📋 Test Results Summary:');
  console.log(`📤 Participation Submission: ${results.submission ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`📥 Data Retrieval: ${results.retrieval ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`📈 Analytics: ${results.analytics ? '✅ PASS' : '❌ FAIL'}`);

  const allPassed = Object.values(results).every(result => result);

  console.log(`\n🎯 Overall Result: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);

  if (!allPassed) {
    console.log('\n💡 Troubleshooting Tips:');
    console.log('- Ensure the development server is running');
    console.log('- Check that environment variables are properly configured');
    console.log('- Verify Vercel KV database is set up and accessible');
    console.log('- Check network connectivity and API endpoints');
  }

  process.exit(allPassed ? 0 : 1);
}

// Handle command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Database Integration Test Script

Usage:
  node test-database.js [options]

Options:
  --help, -h          Show this help message

Environment Variables:
  TEST_URL            Base URL for testing (default: http://localhost:3000)
  DATA_ACCESS_TOKEN   Token for data retrieval API (default: research-admin-2024)

Examples:
  node test-database.js
  TEST_URL=https://yoursite.com node test-database.js
  DATA_ACCESS_TOKEN=your-token node test-database.js
`);
  process.exit(0);
}

// Run the tests
runTests().catch(error => {
  console.error('💥 Test runner crashed:', error);
  process.exit(1);
});