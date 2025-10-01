# Club Contact Scraper

Web scraper for collecting press/media contact information from football club websites.

## Features

- ✅ Scrapes contact pages from all Premier League clubs
- 📧 Extracts and categorizes emails (press, media, general)
- 🔍 Tries multiple common contact page paths
- ⏱️ Respectful rate limiting (2s delay between requests)
- 💾 Exports to both JSON and CSV formats
- 📊 Provides summary statistics
- 🛡️ Error handling and validation

## Usage

### Run the scraper

```bash
deno run --allow-net --allow-write club-contact-scraper.ts
```

### Output Files

The scraper generates two files:

1. **premier-league-contacts.json** - Detailed JSON format with all data
2. **premier-league-contacts.csv** - CSV format for easy import into spreadsheets

### CSV Columns

- Club name
- Website URL
- Press email (if found)
- Media email (if found)
- General email (if found)
- All emails found (semicolon-separated)
- Status (success/partial/failed)
- Notes
- Timestamp

## How It Works

1. **Club List**: Uses a predefined list of Premier League clubs with their official websites
2. **Path Discovery**: Tries common contact page paths:
   - `/contact`
   - `/contact-us`
   - `/media`
   - `/press`
   - `/media-centre`
   - `/press-office`
   - `/about/contact`
   - `/club/contact`
   - `/info/contact`

3. **Email Extraction**: Uses regex to find email addresses in page HTML
4. **Categorization**: Automatically categorizes emails by type:
   - **Press**: Contains "press" or "pr@"
   - **Media**: Contains "media"
   - **General**: Contains "info@", "contact@", or "enquiries@"
   - **Other**: All other valid emails

5. **Validation**: Filters out test/example emails

## Customization

### Add More Clubs

Edit the `premierLeagueClubs` array to add clubs from other leagues:

```typescript
const clubs: Club[] = [
  { name: "Bayern Munich", website: "https://fcbayern.com", league: "Bundesliga" },
  // ... more clubs
];
```

### Adjust Rate Limiting

Change the `DELAY_MS` constant (default: 2000ms):

```typescript
const DELAY_MS = 3000; // 3 seconds between requests
```

### Add More Contact Paths

Edit the `contactPaths` array:

```typescript
const contactPaths = [
  '/contact',
  '/your-custom-path',
  // ... more paths
];
```

## Next Steps

After collecting contacts:

1. **Review the CSV file** to verify email quality
2. **Manually check** clubs with "failed" or "partial" status
3. **Visit club websites directly** for clubs with no results
4. **Use the contacts** to send research participation invitations

## Notes

- Some clubs may use contact forms instead of displaying emails
- Large clubs often separate press/media contacts from general inquiries
- The scraper respects robots.txt indirectly through rate limiting
- Results may vary based on website structure changes

## All Leagues Scraper

A comprehensive scraper for all top 5 European leagues is also available:

### Run All Leagues

```bash
deno run --allow-net --allow-write all-leagues-scraper.ts
```

This will scrape **96 clubs** across:
- ⚽ Premier League (England) - 20 clubs
- ⚽ Bundesliga (Germany) - 18 clubs
- ⚽ La Liga (Spain) - 20 clubs
- ⚽ Serie A (Italy) - 20 clubs
- ⚽ Ligue 1 (France) - 18 clubs

**Output files:**
- `all-leagues-contacts.json`
- `all-leagues-contacts.csv`

**Estimated time:** ~15-20 minutes (with 2s delays between requests)

The CSV includes an additional "League" column for easy filtering by competition.
