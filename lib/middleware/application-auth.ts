import { create, verify } from 'https://deno.land/x/djwt@v3.0.2/mod.ts';
import * as bcrypt from 'https://deno.land/x/bcrypt@v0.4.1/mod.ts';

const JWT_SECRET = await crypto.subtle.generateKey(
  { name: 'HMAC', hash: 'SHA-512' },
  true,
  ['sign', 'verify']
);

const SESSION_DURATION = 24 * 60 * 60; // 24 hours in seconds

interface ApplicationAuthPayload {
  slug: string;
  exp: number;
}

export async function createAuthToken(slug: string): Promise<string> {
  const payload: ApplicationAuthPayload = {
    slug,
    exp: Math.floor(Date.now() / 1000) + SESSION_DURATION,
  };

  return await create({ alg: 'HS512', typ: 'JWT' }, payload, JWT_SECRET);
}

export async function verifyAuthToken(token: string, slug: string): Promise<boolean> {
  try {
    const payload = await verify(token, JWT_SECRET) as ApplicationAuthPayload;

    // Check if token is for the correct application
    if (payload.slug !== slug) {
      return false;
    }

    // Check if token is expired
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Middleware function for protecting application routes
export function applicationAuthMiddleware(applications: any[]) {
  return async (request: Request, next: () => Promise<Response>): Promise<Response> => {
    const url = new URL(request.url);

    // Only intercept /application/* routes
    const applicationMatch = url.pathname.match(/^\/application\/([^\/]+)\/?$/);
    if (!applicationMatch) {
      return await next(request);
    }

    const slug = applicationMatch[1];

    // Find the application
    const application = applications.find((app: any) => app.slug === slug);
    if (!application) {
      return new Response('Application not found', { status: 404 });
    }

    // Check for authentication cookie
    const cookies = request.headers.get('cookie') || '';
    const authCookie = cookies.split(';').find(c => c.trim().startsWith(`app_auth_${slug}=`));
    const token = authCookie?.split('=')[1];

    // If POST request, handle login
    if (request.method === 'POST') {
      const contentType = request.headers.get('content-type') || '';
      let password: string | null = null;

      if (contentType.includes('application/x-www-form-urlencoded')) {
        const formData = await request.formData();
        password = formData.get('password') as string;
      } else if (contentType.includes('multipart/form-data')) {
        const formData = await request.formData();
        password = formData.get('password') as string;
      } else {
        // Try to parse as form data anyway
        try {
          const formData = await request.formData();
          password = formData.get('password') as string;
        } catch {
          // If that fails, try to read as text
          const body = await request.text();
          const params = new URLSearchParams(body);
          password = params.get('password');
        }
      }

      if (!password) {
        return new Response('Password required', { status: 400 });
      }

      const isValid = await verifyPassword(password, application.password);

      if (isValid) {
        const authToken = await createAuthToken(slug);
        const response = new Response(null, {
          status: 303,
          headers: {
            'Location': url.pathname,
            'Set-Cookie': `app_auth_${slug}=${authToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_DURATION}`,
          },
        });
        return response;
      } else {
        // Return to login page with error
        return new Response(null, {
          status: 303,
          headers: {
            'Location': `${url.pathname}?error=invalid`,
          },
        });
      }
    }

    // Verify existing token
    if (token && await verifyAuthToken(token, slug)) {
      return await next(request);
    }

    // No valid auth, show login form
    const error = url.searchParams.get('error');
    const loginHtml = generateLoginPage(application, error === 'invalid');

    return new Response(loginHtml, {
      status: 401,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  };
}

function generateLoginPage(application: any, hasError: boolean): string {
  return `<!DOCTYPE html>
<html lang="${application.lang || 'en'}" class="bg-canvas text-on-canvas">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Access Application - ${application.company}</title>
    <link rel="stylesheet" href="/styles.css" />
    <style>
      .login-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
      }
      .login-box {
        width: 100%;
        max-width: 400px;
        background: var(--color-surface);
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      .login-title {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: var(--color-on-canvas);
      }
      .login-subtitle {
        font-size: 1rem;
        color: var(--color-on-canvas);
        opacity: 0.7;
        margin-bottom: 2rem;
      }
      .form-group {
        margin-bottom: 1.5rem;
      }
      .form-label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: var(--color-on-canvas);
      }
      .form-input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        font-size: 1rem;
        background: var(--color-canvas);
        color: var(--color-on-canvas);
      }
      .form-input:focus {
        outline: none;
        border-color: var(--color-primary);
      }
      .form-button {
        width: 100%;
        padding: 0.75rem;
        background: var(--color-primary);
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: opacity 0.2s;
      }
      .form-button:hover {
        opacity: 0.9;
      }
      .error-message {
        background: #fee;
        color: #c33;
        padding: 0.75rem;
        border-radius: 4px;
        margin-bottom: 1rem;
        font-size: 0.9rem;
      }
    </style>
  </head>
  <body>
    <div class="login-container">
      <div class="login-box">
        <h1 class="login-title">Access Application</h1>
        <p class="login-subtitle">${application.company}</p>
        ${hasError ? '<div class="error-message">Invalid password. Please try again.</div>' : ''}
        <form method="POST">
          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              class="form-input"
              required
              autofocus
              placeholder="Enter password"
            />
          </div>
          <button type="submit" class="form-button">Access Application</button>
        </form>
      </div>
    </div>
  </body>
</html>`;
}
