#!/bin/bash

echo "🔧 Adding KV Environment Variables to Vercel..."

# Add KV_REST_API_URL
echo "https://kind-firefly-15579.upstash.io" | vercel env add KV_REST_API_URL production

# Add KV_REST_API_TOKEN
echo "ATzbAAIncDI2MDViZjQ5NDEyZmU0M2Y5OGFmYzc0YmRjNTJhODBmM3AyMTU1Nzk" | vercel env add KV_REST_API_TOKEN production

echo ""
echo "✅ KV Environment Variables Added Successfully!"
echo ""
echo "🔐 Added Variables:"
echo "✅ KV_REST_API_URL: https://kind-firefly-15579.upstash.io"
echo "✅ KV_REST_API_TOKEN: [Your Redis token]"
echo ""
echo "🚀 Your database is now fully configured!"
echo "   Form submissions will be stored in Redis"
echo "   Admin dashboard will show real data"
echo ""
echo "💡 Next: Add RESEND_API_KEY for email notifications"