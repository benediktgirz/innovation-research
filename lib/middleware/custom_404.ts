/**
 * Custom 404 middleware that serves language-specific 404 pages
 */
export default function custom404(site: any) {
  return async (req: Request, next: () => Promise<Response>) => {
    try {
      const response = await next();
      
      // Only handle 404s
      if (response.status !== 404) {
        return response;
      }
      
      const url = new URL(req.url);
      const pathname = url.pathname;
      
      // Determine if this should be a German 404
      const isGermanPath = pathname.startsWith('/de/') || 
                          pathname.includes('/lebenslauf') ||
                          pathname.includes('/ueber-mich') ||
                          pathname.includes('/erfahrung') ||
                          pathname.includes('/kontakt') ||
                          pathname.includes('/impressum') ||
                          pathname.includes('/datenschutz');
      
      // Use fallback 404 content with proper styling
      const fallbackContent = isGermanPath 
        ? `<!DOCTYPE html><html lang="de" class="bg-canvas text-on-canvas"><head><title>Seite nicht gefunden - Benedikt Girz</title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link href="/styles.css" rel="stylesheet"></head><body class="body-layout body-padding body-flex"><header class="site-header"><nav class="navbar"><div class="navbar-container"><a class="navbar-brand" href="/"> <div class="logo-container"><div class="logo-text">hiregrowth</div></div> </a></div></nav></header><main><div class="main-container"><div class="text-center py-12"><h1 class="text-4xl font-bold mb-4">404 - Seite nicht gefunden</h1><p class="text-xl mb-8">Entschuldigung, die gesuchte Seite existiert nicht oder wurde verschoben.</p><div class="mb-8"><h2 class="text-2xl font-semibold mb-4">Beliebte Seiten:</h2><div class="space-y-2"><div><a class="link-style" href="/de/">Startseite</a></div><div><a class="link-style" href="/de/ueber-mich/">Über mich</a></div><div><a class="link-style" href="/de/erfahrung/">Erfahrung</a></div><div><a class="link-style" href="/de/kontakt/">Kontakt</a></div></div></div><p class="text-base"><a class="contact-action-btn" href="/de/">Zur Startseite</a></p></div></div></main></body></html>`
        : `<!DOCTYPE html><html lang="en" class="bg-canvas text-on-canvas"><head><title>Page Not Found - Benedikt Girz</title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link href="/styles.css" rel="stylesheet"></head><body class="body-layout body-padding body-flex"><header class="site-header"><nav class="navbar"><div class="navbar-container"><a class="navbar-brand" href="/"> <div class="logo-container"><div class="logo-text">hiregrowth</div></div> </a></div></nav></header><main><div class="main-container"><div class="text-center py-12"><h1 class="text-4xl font-bold mb-4">404 - Page Not Found</h1><p class="text-xl mb-8">Sorry, the page you are looking for doesn't exist or has been moved.</p><div class="mb-8"><h2 class="text-2xl font-semibold mb-4">Popular Pages:</h2><div class="space-y-2"><div><a class="link-style" href="/">Home</a></div><div><a class="link-style" href="/about/">About</a></div><div><a class="link-style" href="/experience/">Experience</a></div><div><a class="link-style" href="/contact/">Contact</a></div></div></div><p class="text-base"><a class="contact-action-btn" href="/">Go Home</a></p></div></div></main></body></html>`;
      
      return new Response(fallbackContent, {
        status: 404,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
      
    } catch (error) {
      console.error('Error in custom 404 middleware:', error);
      return new Response('Internal Server Error', {
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  };
}