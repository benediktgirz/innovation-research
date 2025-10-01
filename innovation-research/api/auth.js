const crypto = require('crypto');

// Secure hash of "Bg2025!!Bg2025!!" using SHA-256
const ADMIN_PASSWORD_HASH = "77291d7e4a46974e3d4baf878b1e6dd4c74dbe164815a8b222d6c60c198dcbd3";
const ADMIN_EMAIL = "bg@benedikt-girz.com";

async function hashPassword(password) {
  const data = password + "saltBG2025";
  const hash = crypto.createHash('sha256').update(data).digest('hex');
  return hash;
}

module.exports = async (req, res) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Check if email matches admin email
    if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Verify password against hash
    const inputPasswordHash = await hashPassword(password);
    const isPasswordValid = inputPasswordHash === ADMIN_PASSWORD_HASH;

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Generate simple session token
    const payload = {
      email: email,
      exp: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      iat: Date.now(),
    };

    const token = Buffer.from(JSON.stringify(payload)).toString('base64');

    const response = {
      success: true,
      token: token,
    };

    return res.status(200).json(response);

  } catch (error) {
    console.error("❌ Auth error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication failed"
    });
  }
};