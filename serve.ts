import Server from 'lume/core/server.ts';
import onDemand from 'lume/middlewares/on_demand.ts';
import site from './_config.ts';
import { redirects, router, notFound, cacheBusting, applicationAuthMiddleware } from './lib/middleware.ts';
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

const server = new Server({
  root: `${Deno.cwd()}/_site`,
  port: 3000,
});

// domain routing middleware
server.use(async (request, next) => {
  const host = request.headers.get('host');
  if (host && /^(www\.)?workingtitles\.xyz$/.test(host)) {
    return new Response(null, {
      status: 302,
      headers: { Location: 'https://benedikt-girz.com/coaching/?ref=workingtitles.xyz' },
    });
  }
  return await next(request);
});

server.use(redirects);
server.use(applicationAuthMiddleware(applications));
server.use(router);
server.use(onDemand({ site }));
server.use(notFound());
server.use(cacheBusting());

server.start();

console.warn('Listening on http://localhost:3000');
