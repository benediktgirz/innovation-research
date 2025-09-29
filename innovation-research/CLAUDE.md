# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with the Innovation Research project.

## Project Overview

This is an innovation research platform for football/soccer, built with Lume (Deno-based static site generator), Tailwind CSS, and VTO templates. The platform conducts comprehensive research across Europe's top five leagues, gathering insights from football experts, academies, associations, and coaches.

## Key Commands

### Development
- `deno task serve` - Start development server at http://localhost:3000
- `deno task build` - Build the static site
- `deno task serve-prod` - Run production server locally

### Testing
- `node test-database.js` - Test database integration and API endpoints
- `node local-server.js` - Start local test server for form submissions

### Linting & Formatting
- `deno lint` - Lint TypeScript/JavaScript files
- `deno fmt` - Format code

## Architecture & Structure

### Core Framework
- **Lume**: Static site generator for Deno
- **VTO Templates**: Template engine (`.vto` files in `content/_includes/`)
- **Tailwind CSS**: Utility-first CSS framework with custom theming
- **Vercel Serverless Functions**: Backend API for form processing and data storage

### Content Organization
- `content/en/pages/` - English pages (home, about, contact, etc.)
- `content/de/pages/` - German translations
- `content/fr/pages/` - French translations
- `content/es/pages/` - Spanish translations
- `content/it/pages/` - Italian translations
- `content/static/` - Static assets (images, CSS, favicon)
- `content/_includes/` - VTO templates for layouts and components
- `content/_data.yml` - Site configuration and content data

### API Endpoints

#### Form Processing (`api/`)
- `POST /api/participate` - Handles research participation form submissions
- `GET /api/data` - Retrieves stored research data (requires authentication)

Key features:
- **Data Storage**: Vercel KV (Redis-compatible) database
- **Email Notifications**: Resend service integration
- **Multi-format Export**: JSON and CSV data export
- **Analytics Dashboard**: Response analysis and reporting
- **Authentication**: Bearer token security for data access

### Database Integration

#### Vercel KV Storage
- Individual participation records with UUID keys
- List indexing for efficient retrieval
- Club analytics and aggregation
- Automatic data persistence and backup

#### Data Structure
```typescript
interface ParticipationRecord {
  id: string;              // UUID
  club_name: string;       // Club/organization name
  role: string;            // Participant role
  email: string;           // Contact email
  innovation: string;      // Key Research Question response
  language: string;        // Form language (en, de, fr, es, it)
  submitted_at: string;    // ISO timestamp
  ip_address: string;      // Client IP address
}
```

## Environment Variables

### Required for Production
```bash
# Vercel KV Database
KV_REST_API_URL=your_kv_rest_api_url
KV_REST_API_TOKEN=your_kv_rest_api_token

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key
NOTIFICATION_EMAIL=research@benedikt-girz.com
FROM_EMAIL=research@benedikt-girz.com

# Data Access Security
DATA_ACCESS_TOKEN=your_secure_token_for_data_retrieval
```

### Development
- Set in `.env` file for local development
- Database functions fallback to console logging without KV credentials

## Multilingual Support

The platform supports 5 languages with complete translations:
- **English (en)** - Primary language, default
- **German (de)** - Deutsch
- **French (fr)** - Français
- **Spanish (es)** - Español
- **Italian (it)** - Italiano

### Translation Structure
- Hero sections with executive summaries
- Research questions and methodologies
- Call-to-action buttons and forms
- Navigation and UI elements

## Deployment

### Vercel Deployment
1. **Database Setup**: Create Vercel KV database in project dashboard
2. **Environment Variables**: Configure all required environment variables
3. **API Functions**: Automatic deployment of `/api/` endpoints
4. **Static Site**: Lume build process generates optimized static files

### GitHub Actions
- Automatic deployment trigger on push to main branch
- Build process includes Lume static generation
- Environment variables managed through Vercel dashboard

## Data Analytics

The platform provides comprehensive analytics:
- **Response Metrics**: Total submissions, timeline tracking
- **Demographic Analysis**: Language distribution, role breakdown
- **Club Participation**: Top participating organizations
- **Innovation Insights**: Response length analysis, keyword tracking
- **Export Capabilities**: CSV download, JSON API access

## Security Features

- **Authentication**: Bearer token for data access endpoints
- **CORS Protection**: Configured headers for cross-origin requests
- **Data Privacy**: Email masking in logs, IP tracking for analysis
- **Input Validation**: Required field checks, data sanitization
- **Error Handling**: Graceful failures without data exposure

## Testing

### Automated Testing
- `test-database.js` - Comprehensive integration tests
- Form submission validation
- Data retrieval and analytics verification
- Error handling and security checks

### Local Development
- `local-server.js` - Mock server for front-end testing
- API endpoint simulation
- Form processing validation
- Database-free development mode

## Site Configuration
- Main config in `_config.ts`
- Multilingual content management via `_data.yml`
- Custom Tailwind theme with CSS variables
- SEO optimization with meta tags and sitemaps

## Research Methodology

The platform conducts the first comprehensive study across Europe's top five leagues:
- **Premier League** (England)
- **La Liga** (Spain)
- **Bundesliga** (Germany)
- **Serie A** (Italy)
- **Ligue 1** (France)

Gathering insights from football experts, academies, associations, and coaches to identify innovations changing how teams win.

## Important Instructions

- **File Management**: Always prefer editing existing files over creating new ones
- **Multilingual Updates**: When updating content, ensure all language versions are synchronized
- **Database Security**: Never commit credentials or expose sensitive data
- **Testing**: Always test database integration after environment changes
- **Documentation**: Keep this file updated with any architectural changes