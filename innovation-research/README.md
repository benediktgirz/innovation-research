# Innovation in Professional Football - Research Website

A multilingual website for conducting research on innovation in professional football across top European leagues.

## Features

- **Multilingual Support**: English, German, French, Spanish, and Italian
- **Responsive Design**: Optimized for desktop and mobile
- **Academic Styling**: Formal, scientific design with appropriate typography
- **Form Handling**: Participation and contact forms with database persistence
- **Privacy Compliant**: GDPR-compliant with cookie consent management
- **Analytics Integration**: Simple Analytics and Google Analytics with consent mode

## Technical Stack

- **Framework**: [Lume](https://lume.land/) (Deno-based static site generator)
- **Styling**: Tailwind CSS with custom academic theme
- **Templates**: VTO templates
- **Runtime**: Deno
- **Deployment**: research.benedikt-girz.com subdomain

## Design System

### Typography
- **Headings**: Merriweather (serif) for academic credibility
- **Body**: Inter (sans-serif) for readability
- **Code**: JetBrains Mono

### Color Palette
- **Primary**: Deep blue (#1e3a8a) - academic, trustworthy
- **Secondary**: Gray tones for professional appearance
- **Accent**: Emerald green (#059669) for highlights
- **Background**: Clean white with subtle gray alternatives

## Development

### Prerequisites
- Deno 1.x or higher

### Setup
```bash
cd innovation-research
deno task serve
```

### Available Commands
- `deno task build` - Build the static site
- `deno task serve` - Start development server
- `deno task serve-prod` - Run production server locally

### Project Structure
```
innovation-research/
├── content/
│   ├── _includes/          # VTO templates
│   ├── static/             # Static assets
│   ├── en/pages/           # English pages
│   ├── de/pages/           # German pages
│   ├── fr/pages/           # French pages
│   ├── es/pages/           # Spanish pages
│   ├── it/pages/           # Italian pages
│   └── _data.yml           # Content and navigation data
├── _config.ts              # Lume configuration
├── serve.ts                # Production server with API endpoints
└── deno.json               # Deno configuration
```

## Content Management

### Adding Translations
Update `content/_data.yml` with new content in all supported languages:
- `content.en` - English
- `content.de` - German
- `content.fr` - French
- `content.es` - Spanish
- `content.it` - Italian

### Form Data Storage
- Participation data: `data/participations.json`
- Contact messages: `data/contacts.json`

## API Endpoints

### POST /api/participate
Submit participation form data
```json
{
  "club_name": "string",
  "role": "string",
  "email": "string",
  "innovation": "string",
  "language": "string"
}
```

### POST /api/contact
Submit contact form data
```json
{
  "name": "string",
  "email": "string",
  "message": "string",
  "language": "string"
}
```

## Deployment

The site deploys automatically to `research.benedikt-girz.com` when changes are pushed to the main branch.

### Manual Deployment
1. Build the site: `deno task build`
2. Deploy `_site/` directory to web server
3. Configure server to handle API endpoints

## Analytics & Privacy

- **Simple Analytics**: Privacy-first analytics
- **Google Analytics**: With consent mode
- **Cookie Consent**: GDPR-compliant banner
- **Data Protection**: All participant data anonymized and confidential

## Study Information

- **Timeline**: October 2025 - December 2025
- **Target**: European football leagues (Premier League, Bundesliga, La Liga, Ligue 1, Serie A)
- **Contact**: research@benedikt-girz.com

## License

Research project - All rights reserved.

---

For questions about this project, contact: research@benedikt-girz.com