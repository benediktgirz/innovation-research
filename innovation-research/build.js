#!/usr/bin/env node

// Build script for Vercel deployment
// This builds the static site and copies it to public/ for Vercel to serve

import { execSync } from 'child_process';
import fsExtra from 'fs-extra';
import { existsSync, rmSync } from 'fs';

const { copySync } = fsExtra;

console.log('🔥 Building Innovation Research site...');

try {
  // Build the site with Deno
  console.log('📦 Running Deno build...');
  execSync('deno run -A _config.ts', { stdio: 'inherit' });

  // Clean up public directory
  if (existsSync('public')) {
    rmSync('public', { recursive: true });
  }

  // Copy built site to public/ for Vercel
  console.log('📁 Copying files to public/...');
  copySync('_site', 'public');

  console.log('✅ Build complete! Site ready for deployment.');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}