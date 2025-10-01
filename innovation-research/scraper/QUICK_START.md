# Quick Start Guide - Email Invitations

## 🚀 Ready to Send!

Everything is set up. Here's how to use it:

### Step 1: Set API Key

```bash
export RESEND_API_KEY='your-resend-api-key'
```

### Step 2: Test Templates

Send yourself 5 test emails (one in each language):

```bash
deno run --allow-net --allow-env scraper/test-email-templates.ts
```

This will send to **benedikt.girz@gmail.com**:
- 🇬🇧 English (Arsenal FC - Premier League)
- 🇩🇪 German (Bayern Munich - Bundesliga)
- 🇪🇸 Spanish (Real Madrid - La Liga)
- 🇮🇹 Italian (Juventus - Serie A)
- 🇫🇷 French (PSG - Ligue 1)

### Step 3: Preview Real Sending

See what would be sent without actually sending:

```bash
deno run --allow-net --allow-read --allow-write --allow-env scraper/send-invitations.ts --dry-run
```

### Step 4: Send for Real

**Start with one league:**

```bash
# Premier League (English)
deno run --allow-net --allow-read --allow-write --allow-env scraper/send-invitations.ts --league="Premier League"

# Bundesliga (German)
deno run --allow-net --allow-read --allow-write --allow-env scraper/send-invitations.ts --league="Bundesliga"

# La Liga (Spanish)
deno run --allow-net --allow-read --allow-write --allow-env scraper/send-invitations.ts --league="La Liga"

# Serie A (Italian)
deno run --allow-net --allow-read --allow-write --allow-env scraper/send-invitations.ts --league="Serie A"

# Ligue 1 (French)
deno run --allow-net --allow-read --allow-write --allow-env scraper/send-invitations.ts --league="Ligue 1"
```

**Or send to all leagues:**

```bash
deno run --allow-net --allow-read --allow-write --allow-env scraper/send-invitations.ts premier-league-contacts.csv
```

## 📊 What Happens

1. Script reads CSV file
2. Extracts best email (press > media > general)
3. Detects league and uses appropriate language
4. Shows preview and asks for confirmation
5. Sends emails with 3-second delays
6. Saves log to `sent-invitations-TIMESTAMP.csv`

## 🎯 Features

✅ **Automatic language detection** by league
✅ **Professional HTML emails** with text fallback
✅ **Rate limiting** (3s delays)
✅ **Personalization** (club name, league)
✅ **Tracking logs** (CSV with timestamps)
✅ **Safety modes** (dry-run, test)

## 📧 Email Content

Each email includes:
- Professional header with branding
- Research question in local language
- Benefits and timeline
- Participation link with club pre-filled
- Your signature with contact info

## 🔍 Checking Results

After sending, check:
1. **Logs**: `scraper/sent-invitations-TIMESTAMP.csv`
2. **Resend Dashboard**: https://resend.com/emails
3. **Your inbox**: Test emails if using `--test`

## 💡 Pro Tips

1. **Test first**: Always run test script before real sending
2. **One league at a time**: Easier to manage and monitor
3. **Spread out**: Send different leagues on different days
4. **Check spam**: First few emails might go to spam
5. **Monitor**: Watch the console for failures

## 🆘 Quick Troubleshooting

**Emails not sending?**
- Check API key is set: `echo $RESEND_API_KEY`
- Verify email addresses in CSV
- Check Resend dashboard for errors

**Wrong language?**
- League is auto-detected from club name
- Check `clubLeagueMap` in send-invitations.ts
- Use --dry-run to preview

**Need help?**
- Read EMAIL_SENDER_README.md for full docs
- Check sent-invitations CSV for error details
- Email: research@benedikt-girz.com

## 📁 Files Created

- `email-templates.ts` - 5 language templates
- `send-invitations.ts` - Main sending script
- `test-email-templates.ts` - Test script
- `EMAIL_SENDER_README.md` - Full documentation
- `QUICK_START.md` - This file

Ready to send? Start with the test script! 🚀
