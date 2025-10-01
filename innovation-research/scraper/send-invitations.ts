#!/usr/bin/env -S deno run --allow-net --allow-read --allow-write --allow-env

import { parse } from "https://deno.land/std@0.208.0/csv/mod.ts";
import { generateEmail, getLeagueLanguage } from "./email-templates.ts";
import { load } from "https://deno.land/std@0.208.0/dotenv/mod.ts";

// Load environment variables from .env.production, .env.local or .env
let RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

if (!RESEND_API_KEY) {
  try {
    // Try loading from parent directory .env.production (Vercel production env)
    const envProd = await load({ envPath: "../.env.production", export: false });
    RESEND_API_KEY = envProd.RESEND_API_KEY?.trim().replace(/\\n$/, "");
  } catch {
    try {
      // Try loading from parent directory .env.local (Vercel dev env)
      const envLocal = await load({ envPath: "../.env.local", export: false });
      RESEND_API_KEY = envLocal.RESEND_API_KEY?.trim().replace(/\\n$/, "");
    } catch {
      // Try loading from current directory .env
      try {
        const env = await load({ export: false });
        RESEND_API_KEY = env.RESEND_API_KEY?.trim().replace(/\\n$/, "");
      } catch {
        // Will be caught by validation below
      }
    }
  }
}

// Clean up any escape sequences
if (RESEND_API_KEY) {
  RESEND_API_KEY = RESEND_API_KEY.trim().replace(/\\n$/, "");
}
const FROM_EMAIL = "research@benedikt-girz.com";
const TEST_EMAIL = "benedikt.girz@gmail.com"; // Test email address
const DELAY_MS = 3000; // 3 seconds between emails to avoid spam filters

interface ClubContact {
  Club: string;
  Website: string;
  "Press Email": string;
  "Media Email": string;
  "General Email": string;
  "All Emails": string;
  Status: string;
  Notes: string;
  "Scraped At": string;
  League?: string; // Will be added when processing
}

interface SentEmail {
  club: string;
  email: string;
  language: string;
  status: "sent" | "failed";
  sentAt: string;
  error?: string;
}

// Parse command line arguments
const args = Deno.args;
const testMode = args.includes("--test");
const dryRun = args.includes("--dry-run");
const csvFile = args.find(arg => arg.endsWith(".csv")) || "premier-league-contacts.csv";
const onlyLeague = args.find(arg => arg.startsWith("--league="))?.split("=")[1];

console.log("🚀 Football Club Email Invitation System");
console.log("==========================================\n");

if (!RESEND_API_KEY) {
  console.error("❌ Error: RESEND_API_KEY environment variable not set");
  console.log("\nPlease set your Resend API key:");
  console.log("export RESEND_API_KEY='your-api-key-here'\n");
  Deno.exit(1);
}

if (testMode) {
  console.log("🧪 TEST MODE: Sending all emails to", TEST_EMAIL);
}

if (dryRun) {
  console.log("👀 DRY RUN MODE: No emails will be sent\n");
}

// Map clubs to leagues
const clubLeagueMap: Record<string, string> = {
  // Premier League
  "Arsenal": "Premier League",
  "Aston Villa": "Premier League",
  "Bournemouth": "Premier League",
  "Brentford": "Premier League",
  "Brighton": "Premier League",
  "Chelsea": "Premier League",
  "Crystal Palace": "Premier League",
  "Everton": "Premier League",
  "Fulham": "Premier League",
  "Ipswich Town": "Premier League",
  "Leicester City": "Premier League",
  "Liverpool": "Premier League",
  "Manchester City": "Premier League",
  "Manchester United": "Premier League",
  "Newcastle United": "Premier League",
  "Nottingham Forest": "Premier League",
  "Southampton": "Premier League",
  "Tottenham Hotspur": "Premier League",
  "West Ham United": "Premier League",
  "Wolverhampton": "Premier League",

  // Bundesliga
  "Bayern Munich": "Bundesliga",
  "Borussia Dortmund": "Bundesliga",
  "RB Leipzig": "Bundesliga",
  "Bayer Leverkusen": "Bundesliga",
  "Union Berlin": "Bundesliga",
  "Eintracht Frankfurt": "Bundesliga",
  "SC Freiburg": "Bundesliga",
  "VfL Wolfsburg": "Bundesliga",
  "Borussia Mönchengladbach": "Bundesliga",
  "Mainz 05": "Bundesliga",
  "Werder Bremen": "Bundesliga",
  "VfB Stuttgart": "Bundesliga",
  "TSG Hoffenheim": "Bundesliga",
  "FC Augsburg": "Bundesliga",

  // La Liga
  "Real Madrid": "La Liga",
  "Barcelona": "La Liga",
  "Atlético Madrid": "La Liga",
  "Athletic Bilbao": "La Liga",
  "Real Sociedad": "La Liga",
  "Real Betis": "La Liga",
  "Villarreal": "La Liga",
  "Valencia": "La Liga",
  "Sevilla": "La Liga",
  "Celta Vigo": "La Liga",
  "Getafe": "La Liga",
  "Osasuna": "La Liga",
  "Rayo Vallecano": "La Liga",
  "Mallorca": "La Liga",

  // Serie A
  "Juventus": "Serie A",
  "Inter Milan": "Serie A",
  "AC Milan": "Serie A",
  "Napoli": "Serie A",
  "AS Roma": "Serie A",
  "Lazio": "Serie A",
  "Atalanta": "Serie A",
  "Fiorentina": "Serie A",
  "Torino": "Serie A",
  "Bologna": "Serie A",
  "Udinese": "Serie A",
  "Genoa": "Serie A",
  "Cagliari": "Serie A",
  "Hellas Verona": "Serie A",

  // Ligue 1
  "PSG": "Ligue 1",
  "Paris Saint-Germain": "Ligue 1",
  "Marseille": "Ligue 1",
  "Lyon": "Ligue 1",
  "Monaco": "Ligue 1",
  "Lille": "Ligue 1",
  "Nice": "Ligue 1",
  "Lens": "Ligue 1",
  "Rennes": "Ligue 1",
  "Brest": "Ligue 1",
  "Strasbourg": "Ligue 1",
  "Nantes": "Ligue 1",
  "Toulouse": "Ligue 1",
  "Angers": "Ligue 1",
  "Auxerre": "Ligue 1",
};

function getClubLeague(clubName: string): string {
  return clubLeagueMap[clubName] || "Premier League"; // Default to Premier League
}

function extractBestEmail(contact: ClubContact): string | null {
  // Priority: Press Email > Media Email > General Email
  if (contact["Press Email"]) return contact["Press Email"];
  if (contact["Media Email"]) return contact["Media Email"];
  if (contact["General Email"]) return contact["General Email"];

  // Parse "All Emails" field if others are empty
  const allEmails = contact["All Emails"];
  if (allEmails) {
    // Clean up encoded HTML entities and split
    const emails = allEmails
      .replace(/u003E/g, "")
      .split(";")
      .map(e => e.trim())
      .filter(e => e && e.includes("@") && !e.includes("sentry.io"));

    // Prioritize media/press emails
    const mediaEmail = emails.find(e => e.includes("media") || e.includes("press"));
    if (mediaEmail) return mediaEmail;

    // Return first valid email
    return emails[0] || null;
  }

  return null;
}

async function sendEmail(to: string, subject: string, html: string, text: string): Promise<boolean> {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject: subject,
        html: html,
        text: text,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Resend API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    console.log(`✅ Email sent successfully (ID: ${data.id})`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send email:`, error.message);
    return false;
  }
}

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  // Read CSV file
  console.log(`📄 Reading contacts from: ${csvFile}\n`);
  const csvContent = await Deno.readTextFile(csvFile);
  const contacts = parse(csvContent, {
    skipFirstRow: true,
    columns: ["Club", "Website", "Press Email", "Media Email", "General Email", "All Emails", "Status", "Notes", "Scraped At"]
  }) as ClubContact[];

  // Add league information to each contact
  contacts.forEach(contact => {
    contact.League = getClubLeague(contact.Club);
  });

  // Filter contacts with valid emails
  let validContacts = contacts.filter(contact => {
    const email = extractBestEmail(contact);
    return email !== null;
  });

  // Filter by league if specified
  if (onlyLeague) {
    validContacts = validContacts.filter(c => c.League === onlyLeague);
    console.log(`🎯 Filtering by league: ${onlyLeague}\n`);
  }

  console.log(`📊 Statistics:`);
  console.log(`   Total clubs in CSV: ${contacts.length}`);
  console.log(`   Clubs with valid emails: ${validContacts.length}`);
  console.log(`   Clubs without emails: ${contacts.length - validContacts.length}\n`);

  if (validContacts.length === 0) {
    console.log("⚠️  No valid contacts found to send emails to.");
    return;
  }

  // Group by league
  const byLeague = validContacts.reduce((acc, contact) => {
    const league = contact.League!;
    if (!acc[league]) acc[league] = [];
    acc[league].push(contact);
    return acc;
  }, {} as Record<string, ClubContact[]>);

  console.log(`📧 Emails by league:`);
  Object.entries(byLeague).forEach(([league, clubs]) => {
    console.log(`   ${league}: ${clubs.length} clubs`);
  });
  console.log();

  if (dryRun) {
    console.log("👀 DRY RUN - Would send emails to:\n");
    validContacts.forEach((contact, index) => {
      const email = extractBestEmail(contact)!;
      const language = getLeagueLanguage(contact.League!);
      console.log(`${index + 1}. ${contact.Club} (${contact.League})`);
      console.log(`   Email: ${email}`);
      console.log(`   Language: ${language}\n`);
    });
    console.log(`Total: ${validContacts.length} emails would be sent\n`);
    return;
  }

  // Confirm before sending (unless in test mode)
  if (!testMode) {
    console.log(`⚠️  About to send ${validContacts.length} emails.`);
    console.log(`   This will take approximately ${Math.ceil(validContacts.length * DELAY_MS / 1000 / 60)} minutes.\n`);

    const confirmation = prompt("Type 'yes' to continue: ");
    if (confirmation?.toLowerCase() !== "yes") {
      console.log("❌ Cancelled by user");
      return;
    }
    console.log();
  }

  // Send emails
  const sentEmails: SentEmail[] = [];
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < validContacts.length; i++) {
    const contact = validContacts[i];
    const email = extractBestEmail(contact)!;
    const league = contact.League!;
    const language = getLeagueLanguage(league);

    console.log(`[${i + 1}/${validContacts.length}] ${contact.Club} (${league})`);
    console.log(`   Email: ${email}`);
    console.log(`   Language: ${language}`);

    // Generate email content
    const emailContent = generateEmail({
      clubName: contact.Club,
      league: league,
    }, language);

    const sentEmail: SentEmail = {
      club: contact.Club,
      email: testMode ? TEST_EMAIL : email,
      language: language,
      status: "sent",
      sentAt: new Date().toISOString(),
    };

    // Send email
    const success = await sendEmail(
      testMode ? TEST_EMAIL : email,
      emailContent.subject,
      emailContent.html,
      emailContent.text
    );

    if (success) {
      successCount++;
    } else {
      failCount++;
      sentEmail.status = "failed";
      sentEmail.error = "Failed to send via Resend API";
    }

    sentEmails.push(sentEmail);

    // Delay between emails (except for last one)
    if (i < validContacts.length - 1) {
      console.log(`   ⏳ Waiting ${DELAY_MS / 1000}s before next email...\n`);
      await delay(DELAY_MS);
    }
  }

  // Save sent emails log
  const timestamp = new Date().toISOString().replace(/:/g, "-").split(".")[0];
  const logFile = `sent-invitations-${timestamp}.csv`;

  const csvContent = [
    "Club,Email,Language,Status,Sent At,Error",
    ...sentEmails.map(e =>
      `"${e.club}","${e.email}","${e.language}","${e.status}","${e.sentAt}","${e.error || ""}"`
    )
  ].join("\n");

  await Deno.writeTextFile(`scraper/${logFile}`, csvContent);

  // Summary
  console.log("\n==========================================");
  console.log("📊 SUMMARY");
  console.log("==========================================");
  console.log(`✅ Successfully sent: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`📝 Log saved to: scraper/${logFile}\n`);

  if (testMode) {
    console.log(`🧪 Test mode: All emails sent to ${TEST_EMAIL}\n`);
  }
}

// Run the script
if (import.meta.main) {
  try {
    await main();
  } catch (error) {
    console.error("\n❌ Fatal error:", error.message);
    Deno.exit(1);
  }
}
