# Email Invitation System

Professional email invitation system for football clubs with multilingual support.

## Features

✅ **Multilingual Templates** - Automatic language detection per league:
- 🇬🇧 Premier League → English
- 🇩🇪 Bundesliga → German
- 🇪🇸 La Liga → Spanish
- 🇮🇹 Serie A → Italian
- 🇫🇷 Ligue 1 → French

✅ **Professional HTML Emails** - Beautiful branded templates with text fallback

✅ **Resend API Integration** - Reliable email delivery

✅ **Rate Limiting** - 3-second delay between emails to avoid spam filters

✅ **Tracking** - CSV logs of all sent emails

✅ **Safety Features**:
- Dry-run mode to preview
- Test mode to send to your email
- Confirmation prompt before sending

## Setup

### 1. Set Resend API Key

```bash
export RESEND_API_KEY='re_your_api_key_here'
```

Get your API key from: https://resend.com/api-keys

### 2. Prepare Contact CSV

Ensure your CSV has these columns:
- Club
- Press Email
- Media Email
- General Email
- All Emails

The script will automatically pick the best available email (Press > Media > General).

## Usage

### Dry Run (Preview)

See what emails would be sent without actually sending:

```bash
deno run --allow-net --allow-read --allow-write --allow-env scraper/send-invitations.ts --dry-run
```

### Test Mode

Send all emails to your test address (benedikt.girz@gmail.com):

```bash
deno run --allow-net --allow-read --allow-write --allow-env scraper/send-invitations.ts --test
```

This will send 5 test emails (one in each language) to verify templates.

### Send to Specific League

```bash
# Bundesliga only (German emails)
deno run --allow-net --allow-read --allow-write --allow-env scraper/send-invitations.ts --league="Bundesliga"

# La Liga only (Spanish emails)
deno run --allow-net --allow-read --allow-write --allow-env scraper/send-invitations.ts --league="La Liga"

# Serie A only (Italian emails)
deno run --allow-net --allow-read --allow-write --allow-env scraper/send-invitations.ts --league="Serie A"

# Ligue 1 only (French emails)
deno run --allow-net --allow-read --allow-write --allow-env scraper/send-invitations.ts --league="Ligue 1"

# Premier League only (English emails)
deno run --allow-net --allow-read --allow-write --allow-env scraper/send-invitations.ts --league="Premier League"
```

### Use Different CSV File

```bash
deno run --allow-net --allow-read --allow-write --allow-env scraper/send-invitations.ts all-leagues-contacts.csv
```

### Production Send (Real Emails)

**⚠️ WARNING: This will send real emails to clubs!**

```bash
deno run --allow-net --allow-read --allow-write --allow-env scraper/send-invitations.ts premier-league-contacts.csv
```

The script will:
1. Show statistics and preview
2. Ask for confirmation
3. Send emails with 3-second delays
4. Save a log to `sent-invitations-YYYY-MM-DDTHH-MM-SS.csv`

## Email Templates

All templates are in `scraper/email-templates.ts`. Each language includes:

- Professional HTML email with branded header
- The key research question
- Why it matters (benefits)
- Participation details
- Timeline & roadmap
- Distribution network
- Your signature with LinkedIn
- Plain text fallback

Templates automatically include:
- Club name personalization
- League-specific language
- Participation URL with club pre-filled
- Your contact information

## Tracking

Each run creates a timestamped CSV log:

```
sent-invitations-2025-10-01T12-30-00.csv
```

Columns:
- Club
- Email
- Language
- Status (sent/failed)
- Sent At (timestamp)
- Error (if failed)

## Rate Limiting

- **Delay**: 3 seconds between emails
- **Estimated time**: ~5 minutes per 100 emails
- **Recommended**: Send in batches by league

## Best Practices

### Testing Phase
1. **Dry run first**: `--dry-run` to preview all emails
2. **Test yourself**: `--test` to verify templates in inbox
3. **Start small**: Send to one league first
4. **Check logs**: Review sent-invitations CSV

### Production Phase
1. **One league at a time**: Use `--league="League Name"`
2. **Monitor**: Watch for failures in real-time
3. **Spread out**: Consider sending different leagues on different days
4. **Check spam**: Test emails might go to spam initially

### Follow-up
1. **Wait 7-10 days** before following up
2. **Track responses** in separate spreadsheet
3. **Update CSV** with response status

## Troubleshooting

### "RESEND_API_KEY not set"
```bash
export RESEND_API_KEY='your-key'
```

### Emails going to spam
- Resend domain needs warmup (send gradually)
- Add SPF/DKIM records to your domain
- Start with test mode to check spam score

### Failed emails
- Check CSV log for specific errors
- Verify email addresses are valid
- Check Resend dashboard for delivery status

### Wrong language
- League mapping is in send-invitations.ts
- Update `clubLeagueMap` if needed
- Test with `--dry-run` first

## Examples

```bash
# Preview everything
./scraper/send-invitations.ts --dry-run

# Test all templates
./scraper/send-invitations.ts --test

# Send to Bundesliga (German)
./scraper/send-invitations.ts --league="Bundesliga"

# Send to all from custom CSV
./scraper/send-invitations.ts all-leagues-contacts.csv
```

## Support

For issues or questions:
- Email: research@benedikt-girz.com
- Check Resend dashboard: https://resend.com/emails
- Review error logs in sent-invitations CSV
