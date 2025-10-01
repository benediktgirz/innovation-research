/**
 * European Football Leagues Contact Scraper
 *
 * Scrapes contact information from clubs across:
 * - Premier League (England)
 * - Bundesliga (Germany)
 * - La Liga (Spain)
 * - Serie A (Italy)
 * - Ligue 1 (France)
 */

interface Club {
  name: string;
  website: string;
  league: string;
  country: string;
}

interface ContactInfo {
  club: string;
  league: string;
  country: string;
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

// Premier League (England) - 20 clubs
const premierLeagueClubs: Club[] = [
  { name: "Arsenal", website: "https://www.arsenal.com", league: "Premier League", country: "England" },
  { name: "Aston Villa", website: "https://www.avfc.co.uk", league: "Premier League", country: "England" },
  { name: "Bournemouth", website: "https://www.afcb.co.uk", league: "Premier League", country: "England" },
  { name: "Brentford", website: "https://www.brentfordfc.com", league: "Premier League", country: "England" },
  { name: "Brighton", website: "https://www.brightonandhovealbion.com", league: "Premier League", country: "England" },
  { name: "Chelsea", website: "https://www.chelseafc.com", league: "Premier League", country: "England" },
  { name: "Crystal Palace", website: "https://www.cpfc.co.uk", league: "Premier League", country: "England" },
  { name: "Everton", website: "https://www.evertonfc.com", league: "Premier League", country: "England" },
  { name: "Fulham", website: "https://www.fulhamfc.com", league: "Premier League", country: "England" },
  { name: "Ipswich Town", website: "https://www.itfc.co.uk", league: "Premier League", country: "England" },
  { name: "Leicester City", website: "https://www.lcfc.com", league: "Premier League", country: "England" },
  { name: "Liverpool", website: "https://www.liverpoolfc.com", league: "Premier League", country: "England" },
  { name: "Manchester City", website: "https://www.mancity.com", league: "Premier League", country: "England" },
  { name: "Manchester United", website: "https://www.manutd.com", league: "Premier League", country: "England" },
  { name: "Newcastle United", website: "https://www.nufc.co.uk", league: "Premier League", country: "England" },
  { name: "Nottingham Forest", website: "https://www.nottinghamforest.co.uk", league: "Premier League", country: "England" },
  { name: "Southampton", website: "https://www.southamptonfc.com", league: "Premier League", country: "England" },
  { name: "Tottenham Hotspur", website: "https://www.tottenhamhotspur.com", league: "Premier League", country: "England" },
  { name: "West Ham United", website: "https://www.whufc.com", league: "Premier League", country: "England" },
  { name: "Wolverhampton", website: "https://www.wolves.co.uk", league: "Premier League", country: "England" },
];

// Bundesliga (Germany) - 18 clubs
const bundesligaClubs: Club[] = [
  { name: "FC Bayern Munich", website: "https://fcbayern.com/en", league: "Bundesliga", country: "Germany" },
  { name: "Borussia Dortmund", website: "https://www.bvb.com/eng", league: "Bundesliga", country: "Germany" },
  { name: "RB Leipzig", website: "https://www.dierotenbullen.com/en", league: "Bundesliga", country: "Germany" },
  { name: "Bayer Leverkusen", website: "https://www.bayer04.de/en", league: "Bundesliga", country: "Germany" },
  { name: "Union Berlin", website: "https://www.fc-union-berlin.de/en", league: "Bundesliga", country: "Germany" },
  { name: "SC Freiburg", website: "https://www.scfreiburg.com", league: "Bundesliga", country: "Germany" },
  { name: "Eintracht Frankfurt", website: "https://www.eintracht.de/en", league: "Bundesliga", country: "Germany" },
  { name: "VfL Wolfsburg", website: "https://www.vfl-wolfsburg.de/en", league: "Bundesliga", country: "Germany" },
  { name: "Borussia Mönchengladbach", website: "https://www.borussia.de/english", league: "Bundesliga", country: "Germany" },
  { name: "FSV Mainz 05", website: "https://www.mainz05.de/en", league: "Bundesliga", country: "Germany" },
  { name: "VfB Stuttgart", website: "https://www.vfb.de/en", league: "Bundesliga", country: "Germany" },
  { name: "Werder Bremen", website: "https://www.werder.de/en", league: "Bundesliga", country: "Germany" },
  { name: "TSG Hoffenheim", website: "https://www.achtzehn99.de/en", league: "Bundesliga", country: "Germany" },
  { name: "FC Augsburg", website: "https://www.fcaugsburg.de/en", league: "Bundesliga", country: "Germany" },
  { name: "VfL Bochum", website: "https://www.vfl-bochum.de/en", league: "Bundesliga", country: "Germany" },
  { name: "FC St. Pauli", website: "https://www.fcstpauli.com/en", league: "Bundesliga", country: "Germany" },
  { name: "Holstein Kiel", website: "https://www.holstein-kiel.de/en", league: "Bundesliga", country: "Germany" },
  { name: "1. FC Heidenheim", website: "https://www.fc-heidenheim.de/en", league: "Bundesliga", country: "Germany" },
];

// La Liga (Spain) - 20 clubs
const laLigaClubs: Club[] = [
  { name: "Real Madrid", website: "https://www.realmadrid.com/en", league: "La Liga", country: "Spain" },
  { name: "FC Barcelona", website: "https://www.fcbarcelona.com/en", league: "La Liga", country: "Spain" },
  { name: "Atlético Madrid", website: "https://en.atleticodemadrid.com", league: "La Liga", country: "Spain" },
  { name: "Sevilla FC", website: "https://www.sevillafc.es/en", league: "La Liga", country: "Spain" },
  { name: "Real Sociedad", website: "https://www.realsociedad.eus/en", league: "La Liga", country: "Spain" },
  { name: "Real Betis", website: "https://www.realbetisbalompie.es/en", league: "La Liga", country: "Spain" },
  { name: "Villarreal CF", website: "https://www.villarrealcf.es/en", league: "La Liga", country: "Spain" },
  { name: "Athletic Bilbao", website: "https://www.athletic-club.eus/en", league: "La Liga", country: "Spain" },
  { name: "Valencia CF", website: "https://www.valenciacf.com/en", league: "La Liga", country: "Spain" },
  { name: "CA Osasuna", website: "https://www.osasuna.es/en", league: "La Liga", country: "Spain" },
  { name: "Celta Vigo", website: "https://www.celtavigo.net/en", league: "La Liga", country: "Spain" },
  { name: "Rayo Vallecano", website: "https://www.rayovallecano.es/en", league: "La Liga", country: "Spain" },
  { name: "RCD Mallorca", website: "https://www.rcdmallorca.es/en", league: "La Liga", country: "Spain" },
  { name: "Getafe CF", website: "https://www.getafecf.com/en", league: "La Liga", country: "Spain" },
  { name: "Deportivo Alavés", website: "https://www.deportivoalaves.com/en", league: "La Liga", country: "Spain" },
  { name: "RCD Espanyol", website: "https://www.rcdespanyol.com/en", league: "La Liga", country: "Spain" },
  { name: "CD Leganés", website: "https://www.cdleganes.com/en", league: "La Liga", country: "Spain" },
  { name: "Girona FC", website: "https://www.gironafc.cat/en", league: "La Liga", country: "Spain" },
  { name: "Las Palmas", website: "https://www.udlaspalmas.es/en", league: "La Liga", country: "Spain" },
  { name: "Real Valladolid", website: "https://www.realvalladolid.es/en", league: "La Liga", country: "Spain" },
];

// Serie A (Italy) - 20 clubs
const serieAClubs: Club[] = [
  { name: "Juventus", website: "https://www.juventus.com/en", league: "Serie A", country: "Italy" },
  { name: "AC Milan", website: "https://www.acmilan.com/en", league: "Serie A", country: "Italy" },
  { name: "Inter Milan", website: "https://www.inter.it/en", league: "Serie A", country: "Italy" },
  { name: "AS Roma", website: "https://www.asroma.com/en", league: "Serie A", country: "Italy" },
  { name: "SSC Napoli", website: "https://www.sscnapoli.it/en", league: "Serie A", country: "Italy" },
  { name: "SS Lazio", website: "https://www.sslazio.it/en", league: "Serie A", country: "Italy" },
  { name: "Atalanta", website: "https://www.atalanta.it/en", league: "Serie A", country: "Italy" },
  { name: "Fiorentina", website: "https://en.violachannel.tv", league: "Serie A", country: "Italy" },
  { name: "Torino FC", website: "https://www.torinofc.it/en", league: "Serie A", country: "Italy" },
  { name: "Bologna FC", website: "https://www.bolognafc.it/en", league: "Serie A", country: "Italy" },
  { name: "Udinese Calcio", website: "https://www.udinese.it/en", league: "Serie A", country: "Italy" },
  { name: "Hellas Verona", website: "https://www.hellasverona.it/en", league: "Serie A", country: "Italy" },
  { name: "Genoa CFC", website: "https://www.genoacfc.it/en", league: "Serie A", country: "Italy" },
  { name: "Cagliari Calcio", website: "https://www.cagliaricalcio.com/en", league: "Serie A", country: "Italy" },
  { name: "Empoli FC", website: "https://www.empolifc.com/en", league: "Serie A", country: "Italy" },
  { name: "US Lecce", website: "https://www.uslecce.it/en", league: "Serie A", country: "Italy" },
  { name: "Parma Calcio", website: "https://www.parmacalcio1913.com/en", league: "Serie A", country: "Italy" },
  { name: "Como 1907", website: "https://www.como1907.com/en", league: "Serie A", country: "Italy" },
  { name: "Venezia FC", website: "https://www.veneziafc.it/en", league: "Serie A", country: "Italy" },
  { name: "Monza", website: "https://www.acmonza.com/en", league: "Serie A", country: "Italy" },
];

// Ligue 1 (France) - 18 clubs
const ligue1Clubs: Club[] = [
  { name: "Paris Saint-Germain", website: "https://en.psg.fr", league: "Ligue 1", country: "France" },
  { name: "Olympique Marseille", website: "https://www.om.fr/en", league: "Ligue 1", country: "France" },
  { name: "Olympique Lyon", website: "https://www.ol.fr/en", league: "Ligue 1", country: "France" },
  { name: "AS Monaco", website: "https://www.asmonaco.com/en", league: "Ligue 1", country: "France" },
  { name: "LOSC Lille", website: "https://www.losc.fr/en", league: "Ligue 1", country: "France" },
  { name: "OGC Nice", website: "https://www.ogcnice.com/en", league: "Ligue 1", country: "France" },
  { name: "Stade Rennais", website: "https://www.staderennais.com/en", league: "Ligue 1", country: "France" },
  { name: "RC Lens", website: "https://www.rclens.fr/en", league: "Ligue 1", country: "France" },
  { name: "RC Strasbourg", website: "https://www.rcstrasbourgalsace.fr/en", league: "Ligue 1", country: "France" },
  { name: "Stade Brestois", website: "https://www.sb29.bzh/en", league: "Ligue 1", country: "France" },
  { name: "Montpellier HSC", website: "https://www.mhscfoot.com/en", league: "Ligue 1", country: "France" },
  { name: "FC Nantes", website: "https://www.fcnantes.com/en", league: "Ligue 1", country: "France" },
  { name: "Stade de Reims", website: "https://www.stade-de-reims.com/en", league: "Ligue 1", country: "France" },
  { name: "Toulouse FC", website: "https://www.tfc.info/en", league: "Ligue 1", country: "France" },
  { name: "AJ Auxerre", website: "https://www.aja.fr/en", league: "Ligue 1", country: "France" },
  { name: "Angers SCO", website: "https://www.angers-sco.fr/en", league: "Ligue 1", country: "France" },
  { name: "Le Havre AC", website: "https://www.hac-foot.com/en", league: "Ligue 1", country: "France" },
  { name: "AS Saint-Étienne", website: "https://www.asse.fr/en", league: "Ligue 1", country: "France" },
];

// All clubs combined
const allClubs: Club[] = [
  ...premierLeagueClubs,
  ...bundesligaClubs,
  ...laLigaClubs,
  ...serieAClubs,
  ...ligue1Clubs,
];

// Common paths where contact info might be found
const contactPaths = [
  '/contact',
  '/contact-us',
  '/contacts',
  '/media',
  '/press',
  '/media-centre',
  '/media-center',
  '/press-office',
  '/about/contact',
  '/club/contact',
  '/info/contact',
  '/en/contact',
  '/en/media',
  '/en/press',
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
           !lower.includes('noreply@') &&
           !lower.includes('no-reply@');
  });
  return uniqueEmails;
}

/**
 * Categorize emails by type
 */
function categorizeEmail(email: string): 'press' | 'media' | 'general' | 'other' {
  const lower = email.toLowerCase();
  if (lower.includes('press') || lower.includes('pr@') || lower.includes('prensa')) return 'press';
  if (lower.includes('media') || lower.includes('medios')) return 'media';
  if (lower.includes('info@') || lower.includes('contact@') || lower.includes('enquiries@') || lower.includes('comunicazione@')) return 'general';
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
      return null;
    }

    return await response.text();
  } catch (error) {
    return null;
  }
}

/**
 * Scrape contact information for a single club
 */
async function scrapeClub(club: Club, index: number, total: number): Promise<ContactInfo> {
  console.log(`\n[${index}/${total}] 🔍 ${club.name} (${club.league})...`);

  const contactInfo: ContactInfo = {
    club: club.name,
    league: club.league,
    country: club.country,
    website: club.website,
    emails: [],
    scrapedAt: new Date().toISOString(),
    status: 'failed',
  };

  // Try each contact path
  for (const path of contactPaths) {
    const url = `${club.website}${path}`;

    const html = await fetchPage(url);
    if (html) {
      const emails = extractEmails(html);

      if (emails.length > 0) {
        console.log(`  ✅ Found ${emails.length} email(s)`);
        contactInfo.emails.push(...emails);
        contactInfo.status = 'success';
        break; // Found emails, no need to try more paths
      }
    }

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
    console.log(`  ⚠️  No emails found`);
    contactInfo.notes = 'No emails found on standard contact pages';
  }

  return contactInfo;
}

/**
 * Scrape all clubs
 */
async function scrapeAllClubs(clubs: Club[]): Promise<ContactInfo[]> {
  const results: ContactInfo[] = [];

  console.log(`\n🚀 Starting scraper for ${clubs.length} clubs across 5 leagues...\n`);

  for (let i = 0; i < clubs.length; i++) {
    const contactInfo = await scrapeClub(clubs[i], i + 1, clubs.length);
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
  const headers = ['Club', 'League', 'Country', 'Website', 'Press Email', 'Media Email', 'General Email', 'All Emails', 'Status', 'Notes', 'Scraped At'];
  const rows = results.map(r => [
    r.club,
    r.league,
    r.country,
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
  const byLeague = {
    'Premier League': results.filter(r => r.league === 'Premier League'),
    'Bundesliga': results.filter(r => r.league === 'Bundesliga'),
    'La Liga': results.filter(r => r.league === 'La Liga'),
    'Serie A': results.filter(r => r.league === 'Serie A'),
    'Ligue 1': results.filter(r => r.league === 'Ligue 1'),
  };

  console.log('\n' + '='.repeat(70));
  console.log('📊 SCRAPING SUMMARY - ALL LEAGUES');
  console.log('='.repeat(70));
  console.log(`Total clubs scraped: ${results.length}`);
  console.log(`Successful: ${results.filter(r => r.status === 'success').length} ✅`);
  console.log(`Partial: ${results.filter(r => r.status === 'partial').length} ⚠️`);
  console.log(`Failed: ${results.filter(r => r.status === 'failed').length} ❌`);

  console.log('\n' + '-'.repeat(70));
  console.log('BY LEAGUE:');
  console.log('-'.repeat(70));

  for (const [league, clubs] of Object.entries(byLeague)) {
    const success = clubs.filter(c => c.status === 'success').length;
    const partial = clubs.filter(c => c.status === 'partial').length;
    const failed = clubs.filter(c => c.status === 'failed').length;
    console.log(`\n${league}: ${clubs.length} clubs`);
    console.log(`  Success: ${success}, Partial: ${partial}, Failed: ${failed}`);
  }

  console.log('\n' + '-'.repeat(70));
  console.log('EMAIL TYPES FOUND:');
  console.log('-'.repeat(70));
  console.log(`Press emails: ${results.filter(r => r.pressEmail).length}`);
  console.log(`Media emails: ${results.filter(r => r.mediaEmail).length}`);
  console.log(`General emails: ${results.filter(r => r.generalEmail).length}`);
  console.log('='.repeat(70) + '\n');
}

// Main execution
if (import.meta.main) {
  console.log('⚽ European Football Leagues Contact Scraper\n');
  console.log('📋 Leagues: Premier League, Bundesliga, La Liga, Serie A, Ligue 1');
  console.log(`📊 Total clubs: ${allClubs.length}\n`);

  const results = await scrapeAllClubs(allClubs);

  // Export results
  await exportToJSON(results, './scraper/all-leagues-contacts.json');
  await exportToCSV(results, './scraper/all-leagues-contacts.csv');

  // Print summary
  printSummary(results);

  console.log('✅ Scraping complete!\n');
  console.log('💡 Tip: Review the CSV file and manually fill in any missing contacts.\n');
}
