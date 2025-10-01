/**
 * Enhanced 404 middleware for better error handling and language detection
 */

export default function enhanced404() {
  return async (req: Request, next: () => Promise<Response>) => {
    try {
      const response = await next();
      
      // Only handle 404s
      if (response.status !== 404) {
        return response;
      }
      
      const url = new URL(req.url);
      const pathname = url.pathname;
      
      // Log 404s for analytics (optional)
      console.log(`404 Error: ${pathname} at ${new Date().toISOString()}`);
      
      // Detect if the URL suggests German content
      const isGermanPath = pathname.startsWith('/de/') || 
                          pathname.includes('/lebenslauf') ||
                          pathname.includes('/ueber-mich') ||
                          pathname.includes('/erfahrung') ||
                          pathname.includes('/kontakt') ||
                          pathname.includes('/impressum') ||
                          pathname.includes('/datenschutz');
      
      // Return basic 404 response with proper language detection
      const fallbackContent = isGermanPath 
        ? `<!DOCTYPE html><html lang="de"><head><title>Seite nicht gefunden</title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="font-family: system-ui, sans-serif; max-width: 600px; margin: 2rem auto; padding: 2rem; text-align: center;"><h1>404 - Seite nicht gefunden</h1><p>Entschuldigung, die gesuchte Seite existiert nicht oder wurde verschoben.</p><p><a href="/de/" style="display: inline-block; background: #0066ff; color: white; padding: 0.5rem 1rem; text-decoration: none; border-radius: 4px;">Zur Startseite</a></p></body></html>`
        : `<!DOCTYPE html><html lang="en"><head><title>Page Not Found</title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="font-family: system-ui, sans-serif; max-width: 600px; margin: 2rem auto; padding: 2rem; text-align: center;"><h1>404 - Page Not Found</h1><p>Sorry, the page you are looking for doesn't exist or has been moved.</p><p><a href="/" style="display: inline-block; background: #0066ff; color: white; padding: 0.5rem 1rem; text-decoration: none; border-radius: 4px;">Go Home</a></p></body></html>`;
      
      return new Response(fallbackContent, {
        status: 404,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
      
    } catch (error) {
      console.error('Error in enhanced 404 middleware:', error);
      // Fallback to basic error response
      return new Response('Internal Server Error', {
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  };
}