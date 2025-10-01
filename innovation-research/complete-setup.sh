#!/bin/bash

echo "🚀 Complete Vercel Setup - Innovation Research Platform"
echo "======================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}✅ COMPLETED STEPS:${NC}"
echo "✅ Static site deployed to Vercel"
echo "✅ Authentication system working"
echo "✅ Environment variables configured:"
echo "   - NOTIFICATION_EMAIL: research@benedikt-girz.com"
echo "   - FROM_EMAIL: research@benedikt-girz.com"
echo "   - DATA_ACCESS_TOKEN: [Generated securely]"
echo ""

echo -e "${YELLOW}⚠️  REMAINING STEPS (Manual):${NC}"
echo ""

echo "1️⃣  CREATE VERCEL KV DATABASE:"
echo "   → Go to: https://vercel.com/benediktgirzs-projects/innovation-research/stores"
echo "   → Click 'Create Database' → Select 'KV'"
echo "   → Name: 'research-data'"
echo "   → Region: Choose closest to your users"
echo "   → Copy the KV_REST_API_URL and KV_REST_API_TOKEN"
echo ""

echo "2️⃣  GET RESEND API KEY:"
echo "   → Go to: https://resend.com/api-keys"
echo "   → Create account (free tier: 3,000 emails/month)"
echo "   → Generate API key"
echo "   → Copy the key (starts with 're_')"
echo ""

echo "3️⃣  ADD REMAINING ENVIRONMENT VARIABLES:"
echo "   → Go to: https://vercel.com/benediktgirzs-projects/innovation-research/settings/environment-variables"
echo "   → Add these variables for 'Production' environment:"
echo ""
echo "   Variable Name: KV_REST_API_URL"
echo "   Value: [Your KV database URL from step 1]"
echo ""
echo "   Variable Name: KV_REST_API_TOKEN"
echo "   Value: [Your KV database token from step 1]"
echo ""
echo "   Variable Name: RESEND_API_KEY"
echo "   Value: [Your Resend API key from step 2]"
echo ""

echo "4️⃣  REDEPLOY (OPTIONAL):"
echo "   After adding the environment variables, you can redeploy:"
echo "   vercel --prod --yes"
echo ""

echo -e "${GREEN}🎯 WHAT YOU'LL GET:${NC}"
echo "✅ Live form submissions with database storage"
echo "✅ Email notifications for new research participants"
echo "✅ Admin dashboard with real-time analytics"
echo "✅ Data export functionality (CSV/JSON)"
echo "✅ Multi-language support (EN, DE, FR, ES, IT)"
echo "✅ Secure authentication and data protection"
echo ""

echo -e "${GREEN}🔗 IMPORTANT LINKS:${NC}"
echo "Live Site: https://innovation-research-1rnk93yte-benediktgirzs-projects.vercel.app"
echo "Admin Login: https://innovation-research-1rnk93yte-benediktgirzs-projects.vercel.app/admin/login"
echo "Vercel Dashboard: https://vercel.com/benediktgirzs-projects/innovation-research"
echo ""

echo -e "${GREEN}🔐 LOGIN CREDENTIALS:${NC}"
echo "Email: bg@benedikt-girz.com"
echo "Password: Bg2025!!Bg2025!!"
echo ""

echo -e "${YELLOW}💡 PRO TIP:${NC}"
echo "The site works now with static hosting. Adding the KV database and Resend"
echo "API will enable full dynamic functionality for form submissions and emails."
echo ""

echo "Setup script completed! 🎉"