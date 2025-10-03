import lume from 'lume/mod.ts';
import plugins from './lib/plugins.ts';
import { redirects, router, cacheBusting, notFound, enhanced404, custom404, applicationAuthMiddleware } from './lib/middleware.ts';
import * as YAML from 'https://deno.land/std@0.218.0/yaml/mod.ts';

// Load applications for auth middleware
let applications: any[] = [];
try {
  const applicationsYaml = await Deno.readTextFile('./content/_data/applications.yml');
  const data = YAML.parse(applicationsYaml) as { applications: any[] };
  applications = data.applications || [];
} catch (error) {
  console.warn('Could not load applications.yml:', error);
}

const site = lume({
  src: './content',
  location: new URL('https://benedikt-girz.com'),
  server: {
    middlewares: [redirects, applicationAuthMiddleware(applications), router, notFound(), cacheBusting()],
  },
});

const pageConfigs: Array<{ path: string; layout: string; tags?: string[]; indexable?: boolean }> = [
  { path: '/pages', layout: 'simple.vto' },
  { path: '/writings', layout: 'simple.vto', tags: ['writing'] },
  { path: '/videos', layout: 'simple.vto', tags: ['video'], indexable: true },
];

pageConfigs.forEach(({ path, layout, tags, indexable }) => {
  site.data('layout', layout, path);
  if (tags) site.data('tags', tags, path);
  if (indexable) site.data('indexable', indexable, path);
});

// Disable cache busting for production deployment
// site.data('cacheBusterVersion', `v${Date.now()}`);

site.data('site', {
  title: 'Benedikt Girz, building growing products',
  name: 'hiregrowth',
  description: "Benedikt Girz's personal website.",
});

// Language configuration
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
  pt: {
    code: 'pt',
    name: 'Português',
    path: '/pt/',
    locale: 'pt-BR',
    isDefault: false
  }
};

site.data('languages', languages);

site.use(plugins());

export default site;
