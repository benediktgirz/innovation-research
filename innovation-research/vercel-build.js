#!/usr/bin/env node

/**
 * Vercel Build Output API implementation
 * This script creates the proper structure for Vercel deployments
 * combining static site (_site) + serverless functions (api/)
 */

import { promises as fs } from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const OUTPUT_DIR = '.vercel/output';

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function copyDir(src, dest) {
  await ensureDir(dest);
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function main() {
  console.log('Starting Vercel Build Output API build...');

  // Step 1: Install Deno if not present
  console.log('Installing Deno...');
  try {
    execSync('curl -fsSL https://deno.land/x/install/install.sh | sh', {
      stdio: 'inherit',
      shell: '/bin/bash',
    });

    // Add Deno to PATH for this process
    process.env.PATH = `${process.env.HOME}/.deno/bin:${process.env.PATH}`;
  } catch (error) {
    console.error('Deno installation might have failed, continuing anyway...');
  }

  // Step 2: Install Deno dependencies
  console.log('Installing Deno dependencies...');
  try {
    execSync('deno install', { stdio: 'inherit' });
  } catch (error) {
    console.error('Deno install failed:', error.message);
  }

  // Step 3: Build static site with Lume
  console.log('Building static site with Lume...');
  try {
    execSync('deno task build', { stdio: 'inherit' });
  } catch (error) {
    console.error('Lume build failed:', error.message);
    process.exit(1);
  }

  // Step 4: Create Build Output API structure
  console.log('Creating Build Output API structure...');

  // Clean output directory
  await fs.rm(OUTPUT_DIR, { recursive: true, force: true });
  await ensureDir(OUTPUT_DIR);

  // Copy static files to output/static
  console.log('Copying static files...');
  await copyDir('_site', path.join(OUTPUT_DIR, 'static'));

  // Create config.json
  const config = {
    version: 3,
  };
  await fs.writeFile(
    path.join(OUTPUT_DIR, 'config.json'),
    JSON.stringify(config, null, 2)
  );

  // Create functions directory and copy API functions
  console.log('Setting up serverless functions...');
  const functionsDir = path.join(OUTPUT_DIR, 'functions');
  await ensureDir(functionsDir);

  // Copy each API function to the Build Output structure
  const apiFiles = await fs.readdir('api');
  for (const file of apiFiles) {
    if (file.endsWith('.js')) {
      const functionName = file.replace('.js', '');
      const functionDir = path.join(functionsDir, `api/${functionName}.func`);
      await ensureDir(functionDir);

      // Copy the function file
      await fs.copyFile(
        path.join('api', file),
        path.join(functionDir, 'index.js')
      );

      // Create .vc-config.json for the function
      const functionConfig = {
        runtime: 'nodejs20.x',
        handler: 'index.js',
        launcherType: 'Nodejs',
        shouldAddHelpers: true,
        shouldAddSourcemapSupport: false,
        maxDuration: 10,
      };
      await fs.writeFile(
        path.join(functionDir, '.vc-config.json'),
        JSON.stringify(functionConfig, null, 2)
      );

      // Create package.json with CommonJS type
      const funcPackageJson = {
        type: 'commonjs'
      };
      await fs.writeFile(
        path.join(functionDir, 'package.json'),
        JSON.stringify(funcPackageJson, null, 2)
      );

      console.log(`  ✓ Created function: /api/${functionName}`);
    }
  }

  console.log('Build Output API structure created successfully!');
  console.log(`Output directory: ${OUTPUT_DIR}`);
}

main().catch((error) => {
  console.error('Build failed:', error);
  process.exit(1);
});
