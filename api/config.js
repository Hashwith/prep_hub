// api/config.js — Vercel Serverless Function
// Safely exposes the Gemini API key to the frontend
// The key is stored as a Vercel Environment Variable (never in code)

export default function handler(req, res) {
  const key = process.env.GEMINI_API_KEY;

  if (!key) {
    return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is not set.' });
  }

  // Allow requests from same origin only
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ apiKey: key });
}
