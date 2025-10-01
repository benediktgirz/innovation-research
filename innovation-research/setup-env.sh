#!/bin/bash

# Setup Environment Variables for Vercel Deployment
echo "Setting up environment variables for Vercel deployment..."

# Basic email configuration
echo "research@benedikt-girz.com" | vercel env add NOTIFICATION_EMAIL production
echo "research@benedikt-girz.com" | vercel env add FROM_EMAIL production

# Generate secure token for data access
DATA_TOKEN=$(openssl rand -hex 32)
echo $DATA_TOKEN | vercel env add DATA_ACCESS_TOKEN production

echo "Environment variables configured:"
echo "✅ NOTIFICATION_EMAIL: research@benedikt-girz.com"
echo "✅ FROM_EMAIL: research@benedikt-girz.com"
echo "✅ DATA_ACCESS_TOKEN: $DATA_TOKEN"
echo ""
echo "⚠️  Still needed:"
echo "- KV_REST_API_URL (requires KV database creation)"
echo "- KV_REST_API_TOKEN (requires KV database creation)"
echo "- RESEND_API_KEY (requires Resend service account)"
echo ""
echo "Please create a Vercel KV database from the dashboard:"
echo "https://vercel.com/benediktgirzs-projects/www/stores"