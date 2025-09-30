# Hybrid Deployment Guide - Static Site + Serverless Functions

## Overview
This approach keeps your current static site deployment while adding serverless functions to handle form submissions. The static site serves from your current hosting, while forms are processed by Vercel serverless functions.

## 🚀 Quick Setup Steps

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Initialize Vercel Project
```bash
# In your project directory
vercel login
vercel init
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Set Environment Variables
In Vercel dashboard or via CLI:
```bash
vercel env add RESEND_API_KEY
# Enter: your_resend_api_key (get from https://resend.com/api-keys)

vercel env add FROM_EMAIL
# Enter: research@benedikt-girz.com

vercel env add NOTIFICATION_EMAIL
# Enter: research@benedikt-girz.com
```

### 5. Deploy to Vercel
```bash
vercel --prod
```

### 6. Update Form Actions
Update your form actions to point to the Vercel functions:

**Current:** `/api/participate`
**New:** `https://your-vercel-project.vercel.app/api/participate`

## 📁 Project Structure
```
innovation-research/
├── api/                    # Serverless functions
│   ├── participate.ts     # Participation form handler
│   └── contact.ts         # Contact form handler
├── _site/                 # Built static site
├── public/                # Static files for Vercel
├── content/               # Source content
├── vercel.json           # Vercel configuration
├── package.json          # Node.js dependencies
└── build.js              # Build script
```

## 🔧 Configuration Details

### Environment Variables Required:
- `RESEND_API_KEY`: Your Resend API key (get from https://resend.com/api-keys)
- `FROM_EMAIL`: "research@benedikt-girz.com" (✅ Domain verified)
- `NOTIFICATION_EMAIL`: "research@benedikt-girz.com" (where to receive form submissions)

### Database Options:
1. **Vercel KV** (Redis) - Add `KV_REST_API_URL` and `KV_REST_API_TOKEN`
2. **External Database** - Add `DATABASE_URL`
3. **Log to Console** - Default for testing

## 🌐 Deployment Options

### Option A: Keep Current Hosting + Vercel Functions
1. Deploy functions to Vercel
2. Keep static site on current hosting
3. Update form actions to point to Vercel URLs
4. **Pros:** Minimal changes, works immediately
5. **Cons:** Forms depend on external service

### Option B: Full Vercel Deployment
1. Deploy everything to Vercel
2. Point `research.benedikt-girz.com` to Vercel
3. **Pros:** Everything in one place, easier management
4. **Cons:** Need to change DNS

## 📋 Step-by-Step Implementation

### Step 1: Test Locally
```bash
# Install Vercel CLI and dependencies
npm install -g vercel
npm install

# Run local development server
vercel dev
```

### Step 2: Test Functions
```bash
# Test participation form
curl -X POST http://localhost:3000/api/participate \
  -H "Content-Type: application/json" \
  -d '{"club_name":"Test FC","role":"Manager","email":"test@example.com","innovation":"AI analysis","language":"en"}'
```

### Step 3: Deploy to Vercel
```bash
vercel --prod
```

### Step 4: Update Forms
Change form actions from `/api/participate` to `https://your-project.vercel.app/api/participate`

### Step 5: Set Up Email Service
1. Create SendGrid account
2. Generate API key
3. Add to Vercel environment variables

## 🔍 Testing Checklist

- [ ] Vercel functions deploy successfully
- [ ] Environment variables are set
- [ ] Email notifications work
- [ ] Forms submit without errors
- [ ] Data is being stored
- [ ] CORS headers allow your domain

## 🚨 Important Notes

1. **Current Static Site**: Keep running as-is
2. **Form Actions**: Update to point to Vercel functions
3. **Email Setup**: Required for form notifications
4. **Database**: Start with console logging, upgrade later
5. **Cost**: Vercel free tier supports 100GB bandwidth/month

## 📞 Support

If you encounter issues:
1. Check Vercel function logs
2. Verify environment variables
3. Test with curl commands
4. Check CORS configuration

## 🔄 Migration Path

1. **Phase 1**: Deploy functions, test forms ✅
2. **Phase 2**: Set up database storage
3. **Phase 3**: Add admin dashboard
4. **Phase 4**: Consider full Vercel migration

This hybrid approach gives you working forms immediately while maintaining your current deployment strategy!