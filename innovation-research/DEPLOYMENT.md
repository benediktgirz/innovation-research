# Innovation Research Platform - Deployment Guide

## Overview
This platform requires a running Deno server to handle form submissions. The current static deployment does not support form functionality.

## Required Changes for Form Submission

### 1. Platform Options

#### Option A: Deno Deploy (Recommended)
- Deploy to https://deno.com/deploy
- Connect your GitHub repository
- Set environment variables in the dashboard
- Entry point: `serve.ts`

#### Option B: Self-hosted VPS
- Install Deno on your server
- Set up reverse proxy (Nginx/Apache)
- Configure SSL certificate
- Set up process manager (PM2/systemd)

#### Option C: Railway/Render/Fly.io
- These platforms support Deno applications
- Easier deployment than VPS
- Built-in SSL and scaling

### 2. Environment Variables

Create a `.env` file or set these in your deployment platform:

```bash
EMAIL_SERVICE=sendgrid
EMAIL_API_KEY=your_sendgrid_api_key
FROM_EMAIL=research@benedikt-girz.com
PORT=3000
ENVIRONMENT=production
```

### 3. Email Setup

#### SendGrid (Recommended)
1. Sign up at https://sendgrid.com
2. Create an API key
3. Verify your sender email
4. Set `EMAIL_SERVICE=sendgrid` and `EMAIL_API_KEY=your_key`

#### Alternative Email Services
- Mailgun: Set `EMAIL_SERVICE=mailgun`
- SMTP: Set `EMAIL_SERVICE=smtp` (requires additional configuration)

### 4. Database Migration (Future)

Currently uses JSON files for data persistence. For production, consider:
- PostgreSQL (recommended)
- SQLite (for smaller scale)
- MongoDB

## Deployment Steps

### For Deno Deploy:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add form handling server"
   git push origin main
   ```

2. **Create Deno Deploy Project**
   - Go to https://dash.deno.com
   - Create new project
   - Connect to GitHub repository
   - Set entry point to `serve.ts`

3. **Configure Environment Variables**
   - In Deno Deploy dashboard, go to Settings > Environment Variables
   - Add all required variables from the list above

4. **Update DNS**
   - Point `research.benedikt-girz.com` to your Deno Deploy URL
   - Or use a subdomain like `research-app.benedikt-girz.com`

### For Current Static Setup (Alternative):

If you prefer to keep the current static setup, consider using:
- **Formspree**: Add form endpoint, handles submissions
- **Netlify Forms**: If migrating to Netlify
- **Google Forms**: Embed or redirect for form handling

## Testing

1. **Local Testing**
   ```bash
   deno task serve-prod
   # Visit http://localhost:3000
   ```

2. **Form Submission Test**
   ```bash
   curl -X POST http://localhost:3000/api/participate \
     -H "Content-Type: application/json" \
     -d '{"club_name":"Test FC","role":"Manager","email":"test@example.com","innovation":"Test innovation","language":"en"}'
   ```

## Current Status

- ✅ Static site with forms (deployed)
- ✅ Centering issues fixed
- ✅ API endpoints implemented
- ❌ Forms not functional in production (static deployment)
- ❌ Email service not configured
- ❌ Database not set up

## Next Steps

1. Choose deployment platform
2. Set up email service (SendGrid recommended)
3. Configure environment variables
4. Deploy the Deno server
5. Update DNS to point to the new server
6. Test form submissions
7. Set up database for production use