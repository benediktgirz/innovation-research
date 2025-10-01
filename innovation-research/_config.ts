import lume from 'lume/mod.ts';
import tailwindcss from 'lume/plugins/tailwindcss.ts';
import postcss from 'lume/plugins/postcss.ts';
import metas from 'lume/plugins/metas.ts';
import sitemap from 'lume/plugins/sitemap.ts';
import minifyHTML from 'lume/plugins/minify_html.ts';
import robots from 'lume/plugins/robots.ts';
import markdown from 'lume/plugins/markdown.ts';
import date from 'lume/plugins/date.ts';

const site = lume({
  src: './content',
  location: new URL('https://research.benedikt-girz.com'),
  server: {
    port: 3001,
  },
});

// Language configuration for 5 languages
const languages = {
  en: {
    code: 'en',
    name: 'English',
    path: '/',
    locale: 'en-US',
    isDefault: true
  },
  de: {
    code: 'de',
    name: 'Deutsch',
    path: '/de/',
    locale: 'de-DE',
    isDefault: false
  },
  fr: {
    code: 'fr',
    name: 'Français',
    path: '/fr/',
    locale: 'fr-FR',
    isDefault: false
  },
  es: {
    code: 'es',
    name: 'Español',
    path: '/es/',
    locale: 'es-ES',
    isDefault: false
  },
  it: {
    code: 'it',
    name: 'Italiano',
    path: '/it/',
    locale: 'it-IT',
    isDefault: false
  }
};

site.data('languages', languages);

site.data('site', {
  title: 'Innovation in Professional Football - Research Study',
  name: 'Football Innovation Research',
  description: 'A comprehensive research study on innovation in professional football across top European leagues.',
});

// Load the data from _data.yml into the site
import { parse } from 'https://deno.land/std@0.210.0/yaml/mod.ts';

const dataYaml = await Deno.readTextFile('./content/_data.yml');
const dataConfig = parse(dataYaml);
site.data('content', dataConfig.content);
site.data('sections', dataConfig.sections);
site.data('metas', dataConfig.metas);
site.data('leagues', dataConfig.leagues);

site
  .use(
    tailwindcss({
      options: {
        content: [
          './content/**/*.{html,js,ts,jsx,tsx,md,vto}',
          './content/static/css/*.css',
        ],
        theme: {
          extend: {
            colors: {
              // Academic/Scientific color palette
              primary: '#1e3a8a', // Deep blue
              'primary-light': '#3b82f6', // Blue
              'primary-dark': '#1e40af', // Darker blue
              secondary: '#374151', // Gray-700
              'secondary-light': '#6b7280', // Gray-500
              accent: '#059669', // Emerald-600
              background: '#ffffff',
              'background-alt': '#f8fafc', // Slate-50
              text: '#111827', // Gray-900
              'text-muted': '#6b7280', // Gray-500
              border: '#e5e7eb', // Gray-200
              success: '#10b981',
              warning: '#f59e0b',
              error: '#ef4444',
            },
            fontFamily: {
              sans: ['Inter', 'system-ui', 'sans-serif'],
              serif: ['Merriweather', 'Georgia', 'serif'],
              mono: ['JetBrains Mono', 'Monaco', 'monospace'],
            },
            fontSize: {
              'xs': '0.75rem',
              'sm': '0.875rem',
              'base': '1rem',
              'lg': '1.125rem',
              'xl': '1.25rem',
              '2xl': '1.5rem',
              '3xl': '1.875rem',
              '4xl': '2.25rem',
              '5xl': '3rem',
            },
            spacing: {
              '18': '4.5rem',
              '88': '22rem',
            },
          },
        },
        variants: {},
        plugins: [],
      },
    })
  )
  .use(markdown())
  .use(postcss())
  .use(metas())
  .use(minifyHTML())
  .use(robots())
  .use(
    sitemap({
      query: 'indexable=true',
      sort: 'date=desc',
    })
  )
  .use(
    date({
      formats: {
        SHORT: 'MMM dd',
        LONG: 'MMMM dd, yyyy',
      },
    })
  )
  .copy('static', './')
  .copy('static/.htaccess', '.htaccess');

// Only build when this file is run directly
if (import.meta.main) {
  await site.build();
}

export default site;