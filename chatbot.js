// chatbot.js — Gemini-powered AI Study Assistant
(function () {

  const SYSTEM_PROMPT = `You are an expert technical interview coach for Hashwith Reddy, a B.Tech CSE (AI & ML) student at KMIT, Hyderabad.
He is preparing for:
1. OpenText AI/ML/DS Internship — focused on ML models, NLP, document classification, Python, Java, REST APIs, LLMs, Agentic AI frameworks.
2. Zeta Global (Aptroid) — focused on deep programming, system design, OS fundamentals, concurrency, memory management, algorithms, distributed systems.

His skills: Core Java, OOP, DSA, Node.js, Express.js, Flask, React.js, JavaScript, MongoDB, SQL, Redis, AI/ML (ANN/CNN/RNN), Scikit-learn, TensorFlow, Docker, Git, Socket.IO, Python.

His projects: AI Customer Support Ecosystem (Flask+Gemini+Redis+Socket.IO), Asset Management System (MERN), IPL Match Prediction (ANN+React).

Your role:
- Give deep, interview-specific answers — not generic textbook explanations.
- Always tie concepts back to his resume projects when relevant.
- When asked about code, give clean runnable examples.
- When asked about system design, give structured responses (requirements → estimates → design → deep dive → trade-offs).
- Be concise but complete. Use bullet points for lists.
- If asked to quiz him, ask follow-up questions to test depth.`;

  let apiKey = '';
  let chatHistory = [];
  let isOpen = false;

  // ── Fetch API key from server config endpoint ─────────────────────────────
  async function loadApiKey() {
    try {
      const res  = await fetch('/api/config');
      if (!res.ok) throw new Error('Config endpoint error');
      const data = await res.json();
      if (data.apiKey) {
        apiKey = data.apiKey;
        // Hide the manual key bar since we loaded it automatically
        const bar = document.getElementById('chat-key-bar');
        if (bar) bar.classList.add('hidden');
        setStatus('ready');
      }
    } catch {
      // Server not running with env key — fall back to manual entry
      setStatus('manual');
    }
  }

  function setStatus(mode) {
    const indicator = document.getElementById('chat-status-dot');
    const subtitle  = document.querySelector('.chat-subtitle');
    if (mode === 'ready' && indicator) {
      indicator.style.background = '#22c55e';
      if (subtitle) subtitle.textContent = 'Online · Gemini 3.5 Flash';
    } else if (indicator) {
      indicator.style.background = '#f59e0b';
      if (subtitle) subtitle.textContent = 'Enter API key below';
    }
  }

  // ── UI injection ──────────────────────────────────────────────────────────
  function injectUI() {
    // Floating button
    const btn = document.createElement('button');
    btn.id        = 'chat-fab';
    btn.innerHTML = '🤖';
    btn.title     = 'AI Study Assistant';
    btn.onclick   = toggleChat;
    document.body.appendChild(btn);

    // Chat window
    const win = document.createElement('div');
    win.id        = 'chat-window';
    win.className = 'chat-hidden';
    win.innerHTML = `
      <div class="chat-header">
        <div class="chat-header-left">
          <div class="chat-avatar">AI</div>
          <div>
            <div class="chat-title">Study Assistant</div>
            <div class="chat-subtitle">Connecting…</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:10px;">
          <span id="chat-status-dot" style="width:8px;height:8px;border-radius:50%;background:#94a3b8;transition:background 0.3s;"></span>
          <button class="chat-close" onclick="window.chatToggle()">✕</button>
        </div>
      </div>
      <div id="chat-key-bar">
        <input type="password" id="chat-api-input" placeholder="Paste Gemini API key to start…" />
        <button onclick="window.chatSaveKey()">Save</button>
      </div>
      <div class="chat-messages" id="chat-messages">
        <div class="chat-msg bot">
          <div class="chat-bubble">👋 Hi Hashwith! I'm your AI study coach.<br><br>Ask me anything — concepts, mock interview questions, code examples, or system design walkthroughs. I know your resume and both JDs inside out.</div>
        </div>
        <div class="chat-suggestions">
          <button class="suggestion-chip" onclick="window.chatSuggest('Explain the CAP theorem with a real-world example')">CAP Theorem</button>
          <button class="suggestion-chip" onclick="window.chatSuggest('Quiz me on Java concurrency')">Java Concurrency Quiz</button>
          <button class="suggestion-chip" onclick="window.chatSuggest('Walk me through designing a URL shortener like bit.ly')">Design URL Shortener</button>
          <button class="suggestion-chip" onclick="window.chatSuggest('What is the difference between process and thread?')">Process vs Thread</button>
        </div>
      </div>
      <div class="chat-input-area">
        <textarea id="chat-input" placeholder="Ask a question…" rows="1" onkeydown="window.chatKeydown(event)" oninput="this.style.height='auto';this.style.height=this.scrollHeight+'px'"></textarea>
        <button class="chat-send" onclick="window.chatSend()" title="Send">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    `;
    document.body.appendChild(win);

    // Try to auto-load key from server
    loadApiKey();
  }

  // ── Toggle ────────────────────────────────────────────────────────────────
  function toggleChat() {
    isOpen = !isOpen;
    const win = document.getElementById('chat-window');
    win.className = isOpen ? 'chat-visible' : 'chat-hidden';
    if (isOpen) setTimeout(() => document.getElementById('chat-input')?.focus(), 200);
  }
  window.chatToggle = toggleChat;

  // ── Manual key save ───────────────────────────────────────────────────────
  window.chatSaveKey = function () {
    const val = document.getElementById('chat-api-input').value.trim();
    if (!val) return;
    apiKey = val;
    document.getElementById('chat-key-bar').classList.add('hidden');
    setStatus('ready');
    addMessage('bot', '✅ Key saved! Ask me anything about your interview prep.');
  };

  // ── Suggestion chips ──────────────────────────────────────────────────────
  window.chatSuggest = function (text) {
    document.getElementById('chat-input').value = text;
    window.chatSend();
  };

  // ── Keyboard send ─────────────────────────────────────────────────────────
  window.chatKeydown = function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); window.chatSend(); }
  };

  // ── Send message ──────────────────────────────────────────────────────────
  window.chatSend = async function () {
    if (!apiKey) {
      document.getElementById('chat-key-bar').classList.remove('hidden');
      document.getElementById('chat-api-input').focus();
      return;
    }
    const input = document.getElementById('chat-input');
    const text  = input.value.trim();
    if (!text) return;

    input.value       = '';
    input.style.height = 'auto';

    // Remove suggestion chips after first message
    document.querySelector('.chat-suggestions')?.remove();

    addMessage('user', text);
    chatHistory.push({ role: 'user', parts: [{ text }] });

    const typingId = addTyping();

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
        {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents:           chatHistory,
            generationConfig:   { temperature: 0.7, maxOutputTokens: 2048 }
          })
        }
      );
      const data = await response.json();
      removeTyping(typingId);

      if (data.error) {
        addMessage('bot', `⚠️ API Error: ${data.error.message}`);
        return;
      }

      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received.';
      chatHistory.push({ role: 'model', parts: [{ text: reply }] });
      addMessage('bot', reply);
    } catch (err) {
      removeTyping(typingId);
      addMessage('bot', '⚠️ Network error. Make sure the server is running and the API key is valid.');
      console.error('[Chatbot]', err);
    }
  };

  // ── Render message ────────────────────────────────────────────────────────
  function addMessage(role, text) {
    const msgs = document.getElementById('chat-messages');
    const div  = document.createElement('div');
    div.className = 'chat-msg ' + role;

    const formatted = text
      .replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) =>
        `<pre class="chat-code"><div class="chat-code-lang">${lang || 'code'}</div>${escHtml(code.trim())}</pre>`)
      .replace(/`([^`]+)`/g,    '<code class="chat-inline">$1</code>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/^### (.+)$/gm,  '<div class="chat-h3">$1</div>')
      .replace(/^## (.+)$/gm,   '<div class="chat-h2">$1</div>')
      .replace(/^- (.+)$/gm,    '<div class="chat-li">• $1</div>')
      .replace(/^\d+\. (.+)$/gm,'<div class="chat-li">$&</div>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');

    div.innerHTML = `<div class="chat-bubble">${formatted}</div>`;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    return div;
  }

  function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function addTyping() {
    const id   = 'typing-' + Date.now();
    const msgs = document.getElementById('chat-messages');
    const div  = document.createElement('div');
    div.className = 'chat-msg bot';
    div.id        = id;
    div.innerHTML = '<div class="chat-bubble typing"><span></span><span></span><span></span></div>';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    return id;
  }

  function removeTyping(id) {
    document.getElementById(id)?.remove();
  }

  // ── Styles ────────────────────────────────────────────────────────────────
  function injectStyles() {
    const s = document.createElement('style');
    s.textContent = `
/* ── Floating button ── */
#chat-fab {
  position:fixed; bottom:28px; right:28px;
  width:56px; height:56px; border-radius:50%;
  background:var(--green,#2d5a4f); border:none;
  font-size:24px; cursor:pointer; z-index:9999;
  box-shadow:0 4px 24px rgba(0,0,0,.28);
  transition:transform .2s,box-shadow .2s;
  display:flex; align-items:center; justify-content:center;
}
#chat-fab:hover { transform:scale(1.1); box-shadow:0 8px 32px rgba(0,0,0,.35); }

/* ── Window ── */
#chat-window {
  position:fixed; bottom:96px; right:28px;
  width:400px; max-height:600px;
  background:#fff; border:1px solid #e2e0d8;
  border-radius:18px; z-index:9998;
  display:flex; flex-direction:column;
  box-shadow:0 16px 56px rgba(0,0,0,.18);
  overflow:hidden;
  transition:opacity .22s,transform .22s;
}
#chat-window.chat-hidden  { opacity:0; pointer-events:none; transform:translateY(14px) scale(.97); }
#chat-window.chat-visible { opacity:1; pointer-events:all; transform:none; }

/* ── Header ── */
.chat-header {
  background:#1e2d2b; padding:14px 16px;
  display:flex; align-items:center; justify-content:space-between;
  flex-shrink:0;
}
.chat-header-left { display:flex; align-items:center; gap:10px; }
.chat-avatar {
  width:36px; height:36px; border-radius:50%;
  background:#2d5a4f;
  display:flex; align-items:center; justify-content:center;
  font-size:12px; font-weight:700; color:#fff; letter-spacing:.5px;
}
.chat-title    { font-size:14px; font-weight:600; color:#fff; }
.chat-subtitle { font-size:11px; color:rgba(255,255,255,.45); margin-top:1px; }
.chat-close {
  background:none; border:none; color:rgba(255,255,255,.45);
  font-size:16px; cursor:pointer; transition:color .15s; padding:4px;
}
.chat-close:hover { color:#fff; }

/* ── API key bar ── */
#chat-key-bar {
  display:flex; gap:8px; padding:10px 12px;
  background:#f5f4f0; border-bottom:1px solid #e2e0d8; flex-shrink:0;
}
#chat-key-bar input {
  flex:1; border:1px solid #d8d6ce; border-radius:7px;
  padding:8px 10px; font-size:12px; font-family:'JetBrains Mono',monospace;
  background:#fff; color:#2a2a2a; outline:none;
}
#chat-key-bar input:focus { border-color:#2d5a4f; }
#chat-key-bar button {
  background:#2d5a4f; color:#fff; border:none; border-radius:7px;
  padding:8px 14px; font-size:12px; cursor:pointer;
  font-family:'Inter',sans-serif; font-weight:500;
  transition:background .15s;
}
#chat-key-bar button:hover { background:#3d7a6e; }
#chat-key-bar.hidden { display:none; }

/* ── Messages ── */
.chat-messages {
  flex:1; overflow-y:auto; padding:16px 12px;
  display:flex; flex-direction:column; gap:12px;
  background:#fafaf8;
}
.chat-messages::-webkit-scrollbar { width:4px; }
.chat-messages::-webkit-scrollbar-thumb { background:#d8d6ce; border-radius:2px; }

.chat-msg { display:flex; }
.chat-msg.user { justify-content:flex-end; }
.chat-bubble {
  max-width:88%; padding:11px 14px;
  border-radius:14px; font-size:13.5px; line-height:1.65;
  font-family:'Inter',sans-serif; word-break:break-word;
}
.chat-msg.bot  .chat-bubble {
  background:#fff; border:1px solid #e8e6de; color:#2a2a2a;
  border-radius:4px 14px 14px 14px;
  box-shadow:0 1px 4px rgba(0,0,0,.06);
}
.chat-msg.user .chat-bubble {
  background:#2d5a4f; color:#fff;
  border-radius:14px 4px 14px 14px;
}

/* ── Markdown rendering ── */
.chat-h2 { font-size:14px; font-weight:700; margin:10px 0 4px; color:#1e2d2b; }
.chat-h3 { font-size:13px; font-weight:600; margin:8px 0 3px; color:#2d5a4f; }
.chat-li { padding:2px 0; }
.chat-code {
  background:#1a1e1d; color:#c8e6c9; border-radius:8px;
  font-family:'JetBrains Mono',monospace; font-size:11.5px;
  padding:12px 14px; margin:8px 0; overflow-x:auto; white-space:pre;
  position:relative;
}
.chat-code-lang {
  position:absolute; top:6px; right:10px;
  font-size:10px; color:rgba(255,255,255,.35); text-transform:uppercase; letter-spacing:.5px;
}
.chat-inline {
  background:rgba(45,90,79,.1); color:#1e5c4e;
  padding:1px 6px; border-radius:4px;
  font-family:'JetBrains Mono',monospace; font-size:12px;
}
.chat-msg.user .chat-inline { background:rgba(255,255,255,.2); color:#fff; }

/* ── Typing ── */
.typing { display:flex; gap:5px; align-items:center; padding:14px 18px !important; }
.typing span {
  width:7px; height:7px; border-radius:50%;
  background:#a0a0a0; animation:dot-bounce 1.3s infinite;
}
.typing span:nth-child(2) { animation-delay:.2s; }
.typing span:nth-child(3) { animation-delay:.4s; }
@keyframes dot-bounce { 0%,60%,100%{transform:translateY(0);opacity:.6} 30%{transform:translateY(-7px);opacity:1} }

/* ── Suggestion chips ── */
.chat-suggestions {
  display:flex; flex-wrap:wrap; gap:7px; padding:4px 0 8px;
}
.suggestion-chip {
  background:#fff; border:1px solid #d8d6ce; border-radius:20px;
  padding:6px 12px; font-size:11.5px; cursor:pointer; color:#2d5a4f;
  font-family:'Inter',sans-serif; transition:all .15s;
}
.suggestion-chip:hover { background:#2d5a4f; color:#fff; border-color:#2d5a4f; }

/* ── Input area ── */
.chat-input-area {
  display:flex; gap:8px; padding:10px 12px;
  border-top:1px solid #e8e6de; flex-shrink:0; background:#fff;
  align-items:flex-end;
}
#chat-input {
  flex:1; border:1px solid #d8d6ce; border-radius:10px;
  padding:9px 13px; font-size:13px; resize:none;
  font-family:'Inter',sans-serif; color:#2a2a2a;
  background:#fafaf8; outline:none; max-height:120px;
  transition:border-color .15s; line-height:1.5;
}
#chat-input:focus { border-color:#2d5a4f; background:#fff; }
.chat-send {
  background:#2d5a4f; border:none; border-radius:10px;
  width:40px; height:40px; color:#fff; cursor:pointer;
  display:flex; align-items:center; justify-content:center;
  transition:background .15s; flex-shrink:0;
}
.chat-send:hover { background:#3d7a6e; }

/* ── Responsive ── */
@media (max-width:500px) {
  #chat-window { width:calc(100vw - 24px); right:12px; bottom:80px; }
  #chat-fab    { right:16px; bottom:16px; }
}
    `;
    document.head.appendChild(s);
  }

  // ── Boot ──────────────────────────────────────────────────────────────────
  injectStyles();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectUI);
  } else {
    injectUI();
  }

})();
