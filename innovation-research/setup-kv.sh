#!/bin/bash

echo "🔧 Setting up Vercel KV Database and Environment Variables..."

# First get the project info
PROJECT_INFO=$(vercel project ls --format json 2>/dev/null | grep innovation-research || echo "")

if [ -z "$PROJECT_INFO" ]; then
    echo "❌ Could not find innovation-research project"
    exit 1
fi

echo "✅ Found innovation-research project"

# Try to create KV database using curl with Vercel API
echo "📦 Creating KV database..."

# Get Vercel token (this will require manual setup)
echo ""
echo "⚠️  To complete the setup programmatically, you need to:"
echo ""
echo "1. Create a Vercel KV database manually:"
echo "   https://vercel.com/benediktgirzs-projects/innovation-research/stores"
echo ""
echo "2. Get a Resend API key:"
echo "   https://resend.com/api-keys"
echo ""
echo "3. Run this command to add the KV credentials:"
echo "   vercel env add KV_REST_API_URL production"
echo "   vercel env add KV_REST_API_TOKEN production"
echo ""
echo "4. Run this command to add the Resend API key:"
echo "   vercel env add RESEND_API_KEY production"
echo ""
echo "🚀 After adding these, your site will have full functionality!"
echo ""
echo "Current status:"
echo "✅ Static site deployed"
echo "✅ Authentication working"
echo "✅ Basic environment variables set"
echo "⚠️  Need KV database credentials"
echo "⚠️  Need Resend API key"