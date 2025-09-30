import { FreshContext } from "$fresh/server.ts";
import * as jwt from "https://deno.land/x/djwt@v3.0.2/mod.ts";

const SECRET_KEY = await crypto.subtle.generateKey(
  { name: "HMAC", hash: "SHA-256" },
  true,
  ["sign", "verify"]
);

// Secure hash of "B2025!!Bg2025!!" using SHA-256
// Never store plaintext passwords in production
const ADMIN_PASSWORD_HASH = "a8f5f167f44f4964e6c998dee827110dbacf0f5bc6df26d9e8b48e10b06db4b4";
const ADMIN_EMAIL = "bg@benedikt-girz.com";

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "saltBG2025");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  token?: string;
  message?: string;
}

export const handler = async (req: Request, _ctx: FreshContext): Promise<Response> => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ success: false, message: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body: LoginRequest = await req.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return new Response(JSON.stringify({
        success: false,
        message: "Email and password are required"
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if email matches admin email
    if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return new Response(JSON.stringify({
        success: false,
        message: "Invalid credentials"
      }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify password against hash
    const inputPasswordHash = await hashPassword(password);
    const isPasswordValid = inputPasswordHash === ADMIN_PASSWORD_HASH;

    if (!isPasswordValid) {
      return new Response(JSON.stringify({
        success: false,
        message: "Invalid credentials"
      }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate JWT token
    const payload = {
      email: email,
      exp: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      iat: Date.now(),
    };

    const token = await jwt.create(
      { alg: "HS256", typ: "JWT" },
      payload,
      SECRET_KEY
    );

    const response: AuthResponse = {
      success: true,
      token: token,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("❌ Auth error:", error);
    return new Response(JSON.stringify({
      success: false,
      message: "Authentication failed"
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};