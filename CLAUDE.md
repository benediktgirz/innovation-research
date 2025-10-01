# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Benedikt Girz's personal website built with Lume (a Deno-based static site generator), Tailwind CSS, and VTO templates. The site includes a personal profile, experience showcase, and portfolio.

## Key Commands

### Development
- `deno task serve` - Start development server at http://localhost:3000
- `deno task build` - Build the static site
- `deno task serve-prod` - Run production server locally
- `deno task test-intro` - Test the intro email generator

### Linting & Formatting
- `deno lint` - Lint TypeScript/JavaScript files
- `deno fmt` - Format code

## Architecture & Structure

### Core Framework
- **Lume**: Static site generator for Deno
- **VTO Templates**: Template engine (`.vto` files in `content/_includes/`)
- **Tailwind CSS**: Utility-first CSS framework with custom theming
- **Middleware Stack**: Custom redirects, routing, cache busting, and 404 handling

### Content Organization
- `content/pages/` - Static pages (About, Contact, etc.)
- `content/writings/` - Blog posts in Markdown
- `content/videos/` - Video content
- `content/static/` - Static assets (images, fonts, PDFs)
- `content/_includes/` - VTO templates for layouts and components
- `content/_data.yml` - Site configuration and content data

### Key Features

#### Intro Email Generator (`intro/`)
- AI-powered email generation using OpenAI GPT-4o-mini
- PDF resume parsing with PDF.js
- Job description fetching and analysis
- Located at `/intro/` endpoint
- Requires `OPENAI_API_KEY` environment variable

#### Practice Integration (`lib/practice.ts`)
- Fetches coaching profile data from Practice.do
- Generates coaching.json for calendar integration
- Scrapes testimonials, schedulers, and packages

#### Custom Middleware (`lib/middleware/`)
- Domain redirects for workingtitles.xyz → benedikt-girz.com/coaching
- Custom routing logic
- Cache busting for static assets

### Site Configuration
- Main config in `_config.ts`
- Page layouts configured via `pageConfigs` array
- Custom Tailwind theme with CSS variables for theming
- SEO meta tags and sitemap generation

### Data Flow
1. Build process runs plugins in sequence
2. Practice plugin fetches external coaching data
3. Content is processed through VTO templates
4. Tailwind CSS is compiled and optimized
5. Static files are copied to `_site/` output directory

### Environment Variables
- `OPENAI_API_KEY` - Required for intro email generation
- Set in `.env` file for local development

### Deployment
- Automatically deploys to Deno Deploy via GitHub Actions
- Production server runs on `serve.ts` with custom middleware stack