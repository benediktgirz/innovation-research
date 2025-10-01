/**
 * Premier League Club Contact Scraper
 *
 * This script scrapes contact information (especially press/media emails)
 * from Premier League club websites.
 */

interface Club {
  name: string;
  website: string;
  league: string;
}

interface ContactInfo {
  club: string;
  website: string;
  emails: string[];
  pressEmail?: string;
  mediaEmail?: string;
  generalEmail?: string;
  phone?: string;
  address?: string;
  scrapedAt: string;
  status: 'success' | 'partial' | 'failed';
  notes?: string;
}

// Premier League clubs with their official websites
const premierLeagueClubs: Club[] = [
  { name: "Arsenal", website: "https://www.arsenal.com", league: "Premier League" },
  { name: "Aston Villa", website: "https://www.avfc.co.uk", league: "Premier League" },
  { name: "Bournemouth", website: "https://www.afcb.co.uk", league: "Premier League" },
  { name: "Brentford", website: "https://www.brentfordfc.com", league: "Premier League" },
  { name: "Brighton", website: "https://www.brightonandhovealbion.com", league: "Premier League" },
  { name: "Chelsea", website: "https://www.chelseafc.com", league: "Premier League" },
  { name: "Crystal Palace", website: "https://www.cpfc.co.uk", league: "Premier League" },
  { name: "Everton", website: "https://www.evertonfc.com", league: "Premier League" },
  { name: "Fulham", website: "https://www.fulhamfc.com", league: "Premier League" },
  { name: "Ipswich Town", website: "https://www.itfc.co.uk", league: "Premier League" },
  { name: "Leicester City", website: "https://www.lcfc.com", league: "Premier League" },
  { name: "Liverpool", website: "https://www.liverpoolfc.com", league: "Premier League" },
  { name: "Manchester City", website: "https://www.mancity.com", league: "Premier League" },
  { name: "Manchester United", website: "https://www.manutd.com", league: "Premier League" },
  { name: "Newcastle United", website: "https://www.nufc.co.uk", league: "Premier League" },
  { name: "Nottingham Forest", website: "https://www.nottinghamforest.co.uk", league: "Premier League" },
  { name: "Southampton", website: "https://www.southamptonfc.com", league: "Premier League" },
  { name: "Tottenham Hotspur", website: "https://www.tottenhamhotspur.com", league: "Premier League" },
  { name: "West Ham United", website: "https://www.whufc.com", league: "Premier League" },
  { name: "Wolverhampton", website: "https://www.wolves.co.uk", league: "Premier League" },
];

// Common paths where contact info might be found
const contactPaths = [
  '/contact',
  '/contact-us',
  '/media',
  '/press',
  '/media-centre',
  '/press-office',
  '/about/contact',
  '/club/contact',
  '/info/contact',
];

// Email regex pattern
const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

// Delay between requests to be respectful
const DELAY_MS = 2000;

/**
 * Delay execution for specified milliseconds
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Extract emails from HTML content
 */
function extractEmails(html: string): string[] {
  const emails = html.match(emailRegex) || [];
  // Remove duplicates and filter out common non-contact emails
  const uniqueEmails = [...new Set(emails)].filter(email => {
    const lower = email.toLowerCase();
    return !lower.includes('example.com') &&
           !lower.includes('yoursite.com') &&
           !lower.includes('test@') &&
           !lower.includes('noreply@');
  });
  return uniqueEmails;
}

/**
 * Categorize emails by type
 */
function categorizeEmail(email: string): 'press' | 'media' | 'general' | 'other' {
  const lower = email.toLowerCase();
  if (lower.includes('press') || lower.includes('pr@')) return 'press';
  if (lower.includes('media')) return 'media';
  if (lower.includes('info@') || lower.includes('contact@') || lower.includes('enquiries@')) return 'general';
  return 'other';
}

/**
 * Fetch page content with error handling
 */
async function fetchPage(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      console.log(`  ⚠️  Failed to fetch ${url}: ${response.status}`);
      return null;
    }

    return await response.text();
  } catch (error) {
    console.log(`  ❌ Error fetching ${url}: ${error.message}`);
    return null;
  }
}

/**
 * Scrape contact information for a single club
 */
async function scrapeClub(club: Club): Promise<ContactInfo> {
  console.log(`\n🔍 Scraping ${club.name}...`);

  const contactInfo: ContactInfo = {
    club: club.name,
    website: club.website,
    emails: [],
    scrapedAt: new Date().toISOString(),
    status: 'failed',
  };

  // Try each contact path
  for (const path of contactPaths) {
    const url = `${club.website}${path}`;
    console.log(`  📄 Trying: ${url}`);

    const html = await fetchPage(url);
    if (html) {
      const emails = extractEmails(html);

      if (emails.length > 0) {
        console.log(`  ✅ Found ${emails.length} email(s): ${emails.join(', ')}`);
        contactInfo.emails.push(...emails);
        contactInfo.status = 'success';
      }
    }

    // Be respectful - wait between requests
    await delay(DELAY_MS);
  }

  // Remove duplicates
  contactInfo.emails = [...new Set(contactInfo.emails)];

  // Categorize emails
  if (contactInfo.emails.length > 0) {
    for (const email of contactInfo.emails) {
      const category = categorizeEmail(email);
      if (category === 'press' && !contactInfo.pressEmail) {
        contactInfo.pressEmail = email;
      } else if (category === 'media' && !contactInfo.mediaEmail) {
        contactInfo.mediaEmail = email;
      } else if (category === 'general' && !contactInfo.generalEmail) {
        contactInfo.generalEmail = email;
      }
    }

    contactInfo.status = contactInfo.pressEmail || contactInfo.mediaEmail ? 'success' : 'partial';
  }

  if (contactInfo.emails.length === 0) {
    console.log(`  ⚠️  No emails found for ${club.name}`);
    contactInfo.notes = 'No emails found on standard contact pages';
  }

  return contactInfo;
}

/**
 * Scrape all clubs
 */
async function scrapeAllClubs(clubs: Club[]): Promise<ContactInfo[]> {
  const results: ContactInfo[] = [];

  console.log(`\n🚀 Starting scraper for ${clubs.length} clubs...\n`);

  for (const club of clubs) {
    const contactInfo = await scrapeClub(club);
    results.push(contactInfo);
  }

  return results;
}

/**
 * Export results to JSON
 */
async function exportToJSON(results: ContactInfo[], filename: string): Promise<void> {
  const json = JSON.stringify(results, null, 2);
  await Deno.writeTextFile(filename, json);
  console.log(`\n💾 Exported to ${filename}`);
}

/**
 * Export results to CSV
 */
async function exportToCSV(results: ContactInfo[], filename: string): Promise<void> {
  const headers = ['Club', 'Website', 'Press Email', 'Media Email', 'General Email', 'All Emails', 'Status', 'Notes', 'Scraped At'];
  const rows = results.map(r => [
    r.club,
    r.website,
    r.pressEmail || '',
    r.mediaEmail || '',
    r.generalEmail || '',
    r.emails.join('; '),
    r.status,
    r.notes || '',
    r.scrapedAt,
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  await Deno.writeTextFile(filename, csv);
  console.log(`💾 Exported to ${filename}`);
}

/**
 * Print summary statistics
 */
function printSummary(results: ContactInfo[]): void {
  const successful = results.filter(r => r.status === 'success').length;
  const partial = results.filter(r => r.status === 'partial').length;
  const failed = results.filter(r => r.status === 'failed').length;
  const withPressEmail = results.filter(r => r.pressEmail).length;
  const withMediaEmail = results.filter(r => r.mediaEmail).length;
  const withGeneralEmail = results.filter(r => r.generalEmail).length;

  console.log('\n' + '='.repeat(60));
  console.log('📊 SCRAPING SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total clubs scraped: ${results.length}`);
  console.log(`Successful: ${successful} ✅`);
  console.log(`Partial: ${partial} ⚠️`);
  console.log(`Failed: ${failed} ❌`);
  console.log(`\nWith press email: ${withPressEmail}`);
  console.log(`With media email: ${withMediaEmail}`);
  console.log(`With general email: ${withGeneralEmail}`);
  console.log('='.repeat(60) + '\n');
}

// Main execution
if (import.meta.main) {
  console.log('⚽ Premier League Club Contact Scraper\n');

  const results = await scrapeAllClubs(premierLeagueClubs);

  // Export results
  await exportToJSON(results, './scraper/premier-league-contacts.json');
  await exportToCSV(results, './scraper/premier-league-contacts.csv');

  // Print summary
  printSummary(results);

  console.log('✅ Scraping complete!\n');
}
