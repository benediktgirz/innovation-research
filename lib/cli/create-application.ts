#!/usr/bin/env -S deno run --allow-read --allow-write --allow-env

import { parse } from 'std/flags';
import { ensureDir } from 'std/fs';
import { join } from 'std/path';
import * as YAML from 'https://deno.land/std@0.218.0/yaml/mod.ts';
import { hashPassword } from '../middleware/application-auth.ts';

interface ApplicationData {
  slug: string;
  password: string;
  company: string;
  lang: string;
  headline: string;
  hero_claim: string;
  video: string;
  documents: Array<{ title: string; file: string }>;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function createApplication() {
  const args = parse(Deno.args, {
    string: ['company', 'slug', 'lang', 'headline', 'claim', 'password'],
    alias: {
      c: 'company',
      s: 'slug',
      l: 'lang',
      h: 'headline',
      p: 'password',
    },
  });

  console.log('\n🚀 Create New Application\n');

  // Get company name
  const company = args.company;
  if (!company) {
    console.error('❌ Company name is required. Use --company "Company Name"');
    console.log('\nUsage:');
    console.log('  deno task create-application --company "Acme Corp" --password "secret123"');
    console.log('\nOptions:');
    console.log('  --company, -c    Company name (required)');
    console.log('  --slug, -s       URL slug (auto-generated from company name if not provided)');
    console.log('  --lang, -l       Language: en, de, fr, pt (default: en)');
    console.log('  --headline, -h   Welcome headline');
    console.log('  --claim          Hero claim text');
    console.log('  --password, -p   Access password (required)');
    Deno.exit(1);
  }

  const slugSuggestion = slugify(company);
  const slug = args.slug || slugSuggestion;

  const lang = args.lang || 'en';

  const headline = args.headline || `Welcome to My Application for ${company}`;

  const hero_claim = args.claim ||
    "I'll help you build products that users love and scale with confidence";

  const password = args.password;
  if (!password) {
    console.error('❌ Password is required. Use --password "your-password"');
    Deno.exit(1);
  }

  console.log('\n⏳ Hashing password...');
  const hashedPassword = await hashPassword(password);

  // Create application directory
  const appDir = join(Deno.cwd(), 'content', 'static', 'applications', slug);
  console.log(`\n📁 Creating directory: ${appDir}`);
  await ensureDir(appDir);

  // Read existing applications
  const yamlPath = join(Deno.cwd(), 'content', '_data', 'applications.yml');
  const yamlContent = await Deno.readTextFile(yamlPath);
  const data = YAML.parse(yamlContent) as { applications: ApplicationData[] };

  // Check if slug already exists
  if (data.applications.some((app: ApplicationData) => app.slug === slug)) {
    console.error(`❌ Application with slug "${slug}" already exists`);
    Deno.exit(1);
  }

  // Create new application entry
  const newApp: ApplicationData = {
    slug,
    password: hashedPassword,
    company,
    lang,
    headline,
    hero_claim,
    video: 'video.mp4',
    documents: [
      { title: 'Resume', file: 'resume.pdf' },
      { title: 'Portfolio', file: 'portfolio.pdf' },
    ],
  };

  // Add to applications
  data.applications.push(newApp);

  // Write back to YAML
  console.log('\n💾 Updating applications.yml...');
  const newYamlContent = YAML.stringify(data);
  await Deno.writeTextFile(yamlPath, newYamlContent);

  console.log('\n✅ Application created successfully!\n');
  console.log('📋 Next steps:');
  console.log(`   1. Add your video to: ${appDir}/video.mp4`);
  console.log(`   2. Add your documents to: ${appDir}/`);
  console.log(`   3. Update document list in: content/_data/applications.yml`);
  console.log(`   4. Access your application at: /application/${slug}/\n`);
}

if (import.meta.main) {
  await createApplication();
}
