#!/usr/bin/env -S deno run --allow-net --allow-read --allow-env

// Test script to send one email of each language to benedikt.girz@gmail.com

import { generateEmail } from "./email-templates.ts";
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
const TEST_EMAIL = "benedikt.girz@gmail.com";

console.log("🧪 Email Template Test Script");
console.log("================================\n");

if (!RESEND_API_KEY) {
  console.error("❌ Error: RESEND_API_KEY environment variable not set");
  console.log("\nPlease set your Resend API key:");
  console.log("export RESEND_API_KEY='your-api-key-here'\n");
  Deno.exit(1);
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
        subject: `[TEST] ${subject}`,
        html: html,
        text: text,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Resend API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    console.log(`   ✅ Sent successfully (ID: ${data.id})\n`);
    return true;
  } catch (error) {
    console.error(`   ❌ Failed:`, error.message, "\n");
    return false;
  }
}

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log(`📧 Sending test emails to: ${TEST_EMAIL}\n`);

  const testCases = [
    { language: "en", club: "Arsenal FC", league: "Premier League" },
    { language: "de", club: "Bayern Munich", league: "Bundesliga" },
    { language: "es", club: "Real Madrid", league: "La Liga" },
    { language: "it", club: "Juventus", league: "Serie A" },
    { language: "fr", club: "Paris Saint-Germain", league: "Ligue 1" },
  ];

  let successCount = 0;
  let failCount = 0;

  for (const testCase of testCases) {
    console.log(`📨 Sending ${testCase.language.toUpperCase()} email (${testCase.league})`);
    console.log(`   Club: ${testCase.club}`);

    const email = generateEmail({
      clubName: testCase.club,
      league: testCase.league,
    }, testCase.language);

    const success = await sendEmail(
      TEST_EMAIL,
      email.subject,
      email.html,
      email.text
    );

    if (success) {
      successCount++;
    } else {
      failCount++;
    }

    // Delay between emails
    if (testCases.indexOf(testCase) < testCases.length - 1) {
      console.log(`   ⏳ Waiting 2 seconds...\n`);
      await delay(2000);
    }
  }

  console.log("================================");
  console.log("📊 Test Results");
  console.log("================================");
  console.log(`✅ Successfully sent: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`\n📬 Check your inbox at: ${TEST_EMAIL}\n`);
}

if (import.meta.main) {
  try {
    await main();
  } catch (error) {
    console.error("\n❌ Fatal error:", error.message);
    Deno.exit(1);
  }
}
