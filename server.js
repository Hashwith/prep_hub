require('dotenv').config();
const express = require('express');
const path    = require('path');
const app     = express();
const PORT    = process.env.PORT || 3000;

// Serve all static files (index.html, data.js, style.css, etc.)
app.use(express.static(path.join(__dirname)));

// Safe config endpoint — never exposes the key directly in HTML/JS
// Chatbot fetches this at runtime, so the key stays server-side
app.get('/api/config', (req, res) => {
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not set in .env' });
  }
  res.json({ apiKey: process.env.GEMINI_API_KEY });
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Prep Hub running at http://localhost:${PORT}`);
});
