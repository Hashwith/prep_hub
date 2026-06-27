// =====================================================
//  app.js — Prep Hub navigation & rendering engine
// =====================================================

const RESUME_TEXT = `TEKULA HASHWITH REDDY
B.Tech CSE (AI & ML) — KMIT, Hyderabad
+91-9381507664 · tekulahashwith@gmail.com

PROFESSIONAL SUMMARY
Computer Science undergraduate (AI & ML) with a strong foundation in Core Java, object-oriented programming, data structures, and backend development. Hands-on experience building scalable applications, REST APIs, and structured workflows through real-world projects.

TECHNICAL SKILLS
Core Java      OOPs, Collections Framework, Exception Handling, Data Structures & Algorithms
Backend        Node.js, Express.js, Flask, REST APIs, Socket.IO
Frontend       React.js, HTML5, CSS3, JavaScript (ES6+)
Databases      MongoDB, SQL, Redis (caching & session management)
AI / ML        ANN, CNN, RNN, Scikit-learn, TensorFlow, Pandas, NumPy, Matplotlib
Tools          Git, GitHub, Docker
Languages      Java, Python, JavaScript, C, C++, SQL

PROJECTS
AI Customer Support Ecosystem | Flask · React.js · Google Gemini AI · Redis · Socket.IO · MongoDB
  · Architected a hybrid AI-human support platform with Google Gemini AI resolving Tier-1 queries.
  · Built real-time escalation pipeline using Socket.IO and Redis-backed sessions.
  · Designed RESTful Flask APIs with clean separation of concerns and modular architecture.

Asset Management System (AMS) | React.js · Node.js · Express.js · MongoDB (MERN)
  · Built full-stack MERN app digitising enterprise inventory tracking via QR-code integration.
  · Designed multi-tier role-based approval workflow (Employee → HOD → Admin).
  · Implemented MVC architecture with real-time admin dashboards.

IPL Match Prediction System | Python · Keras · Scikit-learn · React.js
  · Trained a Deep Learning (ANN) model on historical IPL data using feature engineering and EDA.
  · Deployed interactive React dashboard for live win-probability visualisation.

EDUCATION
B.Tech — CSE (Artificial Intelligence & Machine Learning) — 2023 – Present
Keshav Memorial Institute of Technology, Hyderabad | CGPA: 8.4 / 10.0
Intermediate — MPC (Class XII) — 2021–2023 | Sarath Junior College | 96.2%
Class X — ICSE Board — 2021 | Sri Sai Public School | 89.0%`;

const JD_TEXT = `===== JD 1: OpenText — AI/ML/DS Internship =====

- ML models for document classification, metadata tagging, intelligent search
- NLP concepts and techniques
- Agentic AI frameworks, LLMs, prompt engineering
- Python, Java, JavaScript, REST APIs
- Databases (MySQL, Oracle, PL/SQL), data visualisation

===== JD 2: Zeta Global (Aptroid) — Deep Programming & Systems =====

- Deep understanding of programming concepts (beyond syntax)
- Program execution model, stack vs heap, runtime behavior
- Data Structures & Algorithms
- Operating System fundamentals (processes, threads, scheduling, memory)
- Concurrency basics (race conditions, deadlock, locks)
- Performance thinking and trade-offs
- Build production-grade backend / platform / distributed systems
- Compilation vs interpretation / JVM / memory models
- Threads, processes, I/O, networking basics
- System design, scalability, distributed systems`;

// ─── Categories ───────────────────────────────────────
const CATEGORIES = [
  { name: 'Java',            icon: '☕' },
  { name: 'DSA',             icon: '🌲' },
  { name: 'Frontend',        icon: '⚛️' },
  { name: 'Backend',         icon: '🟢' },
  { name: 'Databases',       icon: '🗄️' },
  { name: 'AI / ML',         icon: '🧠' },
  { name: 'System Design',   icon: '📐' },
  { name: 'CS Fundamentals', icon: '🖥️' },
  { name: 'Tools',           icon: '🔧' },
];

// ─── State ────────────────────────────────────────────
let topicStatus   = JSON.parse(localStorage.getItem('topicStatus')   || '{}');
let bookmarks     = new Set(JSON.parse(localStorage.getItem('bookmarks') || '[]'));
let currentTopicId= null;
let currentView   = 'dashboard';
let practiceState = { topicId: null, idx: 0, revealed: false };

// ─── Init ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('rjd-resume-content').textContent = RESUME_TEXT;
  document.getElementById('rjd-jd-content').textContent     = JD_TEXT;
  renderTopicsGrid();
  updateDashboard();
});

// ─── View switching ───────────────────────────────────
function showView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
  document.querySelectorAll('.sb-nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('view-' + name).classList.remove('hidden');
  const navMap = { dashboard:'nav-dashboard', topics:'nav-topics', resumejd:'nav-resumejd', 'topic-detail':'nav-topics', practice:'nav-topics' };
  if (navMap[name]) document.getElementById(navMap[name])?.classList.add('active');
  currentView = name;
  window.scrollTo(0,0);
}

// ─── Dashboard ────────────────────────────────────────
function updateDashboard() {
  const total    = TOPICS.length;
  const learned  = Object.values(topicStatus).filter(s => s === 'learned').length;
  const inProg   = Object.values(topicStatus).filter(s => s === 'in-progress').length;
  const bookmarked = bookmarks.size;
  const pct      = total ? Math.round((learned / total) * 100) : 0;

  document.getElementById('dash-total').textContent      = total;
  document.getElementById('dash-learned').textContent    = learned;
  document.getElementById('dash-progress').textContent   = inProg;
  document.getElementById('dash-bookmarked').textContent = bookmarked;
  document.getElementById('dash-pct').textContent        = pct + '% complete';
  document.getElementById('dash-bar').style.width        = pct + '%';

  const bmPreview = document.getElementById('dash-bookmarks-preview');
  if (bookmarks.size === 0) {
    bmPreview.textContent = 'No bookmarks yet. Star important topics from the topics page.';
  } else {
    const names = [...bookmarks].map(id => TOPICS.find(t => t.id === id)?.title).filter(Boolean).slice(0,3);
    bmPreview.textContent = names.join(' · ') + (bookmarks.size > 3 ? ` +${bookmarks.size-3} more` : '');
  }
}

// ─── Topics grid ──────────────────────────────────────
function renderTopicsGrid() {
  const grid = document.getElementById('topics-grid');
  grid.innerHTML = TOPICS.map(t => {
    const status = topicStatus[t.id] || 'not-started';
    const bm     = bookmarks.has(t.id);
    return `
    <div class="topic-card" data-id="${t.id}" data-status="${status}" data-cat="${t.category}" data-title="${t.title.toLowerCase()}" onclick="openTopic('${t.id}')">
      <div class="tc-top">
        <div class="tc-left">
          <div class="tc-check"></div>
          <span class="tc-priority">high</span>
          <span class="tc-category">${t.category}</span>
        </div>
        <button class="tc-bookmark ${bm ? 'bookmarked' : ''}" onclick="toggleBookmark(event,'${t.id}')" title="Bookmark">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="${bm ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
        </button>
      </div>
      <div class="tc-title">${t.emoji} ${t.title}</div>
      <div class="tc-desc">${t.desc}</div>
      <div class="tc-footer">
        <span class="tc-source">FROM RESUME</span>
        <span class="tc-badge">${t.qa?.length || 0} Q&amp;As</span>
      </div>
    </div>`;
  }).join('');
  document.getElementById('topics-count').textContent = `${TOPICS.length} items · filter, search and open any card to study.`;
}

function filterTopics() {
  const q   = document.getElementById('topic-search').value.toLowerCase();
  const st  = document.getElementById('filter-status').value;
  const cat = document.getElementById('filter-cat').value;
  let vis = 0;
  document.querySelectorAll('.topic-card').forEach(card => {
    const matchQ   = !q   || card.dataset.title.includes(q);
    const matchSt  = !st  || (topicStatus[card.dataset.id] || 'not-started') === st;
    const matchCat = !cat || card.dataset.cat === cat;
    const show = matchQ && matchSt && matchCat;
    card.classList.toggle('hidden-card', !show);
    if (show) vis++;
  });
  document.getElementById('topics-count').textContent = `${vis} of ${TOPICS.length} items`;
}

// ─── Bookmark ─────────────────────────────────────────
function toggleBookmark(e, id) {
  e.stopPropagation();
  if (bookmarks.has(id)) bookmarks.delete(id);
  else bookmarks.add(id);
  localStorage.setItem('bookmarks', JSON.stringify([...bookmarks]));
  renderTopicsGrid();
  updateDashboard();
}

// ─── Open topic detail ────────────────────────────────
function openTopic(id) {
  const t = TOPICS.find(x => x.id === id);
  if (!t) return;
  currentTopicId = id;
  const status = topicStatus[id] || 'not-started';

  const tags = (t.tags || []).map(tg => `<span class="detail-tag">${tg.label}</span>`).join('');
  const concepts = t.concepts.map(c =>
    `<div class="notes-h3">${c.name}</div><p class="notes-p">${c.desc}</p>`).join('');
  const qa = t.qa.map((item, i) => `
    <div class="qa-item" id="qa-${id}-${i}">
      <div class="qa-q" onclick="toggleQA('qa-${id}-${i}')">
        <span style="flex:1">${item.q}</span>
        <span class="qa-q-icon">▾</span>
      </div>
      <div class="qa-a">${item.a}</div>
    </div>`).join('');
  const codeHtml = (t.code || []).map(c => `
    <div class="code-block">
      <div class="code-label-bar">${c.label}</div>
      <pre>${c.body}</pre>
    </div>`).join('');
  const tipsHtml = (t.tips || []).map(tip =>
    `<li><strong>→</strong> ${tip}</li>`).join('');

  document.getElementById('topic-detail-content').innerHTML = `
    <div class="detail-tags">
      <span class="detail-tag priority">High Priority</span>
      ${tags}
      <span class="detail-tag source">source · resume</span>
    </div>
    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;">
      <h1 class="detail-title">${t.emoji} ${t.title}</h1>
      <button class="tc-bookmark ${bookmarks.has(id)?'bookmarked':''}" onclick="toggleBookmark(event,'${id}')" style="margin-top:8px" title="Bookmark">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="${bookmarks.has(id)?'currentColor':'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
      </button>
    </div>
    <p class="detail-desc">${t.desc}</p>

    <div class="detail-actions">
      <select class="status-select" onchange="setStatus('${id}',this.value)">
        <option value="not-started" ${status==='not-started'?'selected':''}>Not started</option>
        <option value="in-progress" ${status==='in-progress'?'selected':''}>In progress</option>
        <option value="learned"     ${status==='learned'?'selected':''}>Learned ✓</option>
      </select>
      <button class="btn-outline" onclick="openPractice('${id}')">🃏 Open practice mode</button>
      <button class="practice-link" onclick="openPractice('${id}')">Open practice mode →</button>
    </div>

    <div class="notes-card">
      <div class="notes-section">
        <div class="notes-h2">Overview</div>
        <p class="notes-p">${t.desc} This topic is directly relevant to the OpenText AI/ML internship — covering real-world applications used in enterprise content management and AI development.</p>
      </div>

      <div class="notes-section">
        <div class="notes-h2">Key Concepts</div>
        ${concepts}
      </div>

      ${codeHtml ? `<div class="notes-section"><div class="notes-h2">Code Examples</div>${codeHtml}</div>` : ''}

      <div class="notes-section">
        <div class="notes-h2">Common Q&amp;As</div>
        ${qa}
      </div>

      ${tipsHtml ? `<div class="notes-section"><div class="notes-h2">Quick Tips</div><ul class="notes-ul">${tipsHtml}</ul></div>` : ''}
    </div>
  `;

  showView('topic-detail');
}

// ─── Status update ────────────────────────────────────
function setStatus(id, val) {
  topicStatus[id] = val;
  localStorage.setItem('topicStatus', JSON.stringify(topicStatus));
  const card = document.querySelector(`.topic-card[data-id="${id}"]`);
  if (card) card.dataset.status = val;
  updateDashboard();
}

// ─── Q&A toggle ───────────────────────────────────────
function toggleQA(id) {
  document.getElementById(id)?.classList.toggle('open');
}

// ─── Practice mode ────────────────────────────────────
function openPractice(id) {
  const t = TOPICS.find(x => x.id === id);
  if (!t || !t.qa?.length) return;
  practiceState = { topicId: id, idx: 0, revealed: false };
  document.getElementById('practice-back-btn').onclick = () => openTopic(id);
  renderPracticeCard();
  showView('practice');
}

function renderPracticeCard() {
  const t = TOPICS.find(x => x.id === practiceState.topicId);
  if (!t) return;
  const { idx, revealed } = practiceState;
  const total = t.qa.length;
  const q = t.qa[idx];
  const pct = ((idx) / total) * 100;

  document.getElementById('practice-container').innerHTML = `
    <div class="practice-header">
      <div class="practice-eyebrow">FLASHCARD PRACTICE</div>
      <h2 class="practice-title">${t.emoji} ${t.title}</h2>
    </div>
    <div class="card-progress-bar">
      <span>Card ${idx + 1} of ${total}</span>
      <div class="card-progress-track"><div class="card-progress-fill" style="width:${pct}%"></div></div>
    </div>
    <div class="flashcard">
      <div class="fc-label">QUESTION</div>
      <div class="fc-question">${q.q}</div>
      <div class="fc-answer ${revealed ? 'visible' : ''}" id="fc-answer">${q.a}</div>
      ${!revealed ? `<button class="btn-reveal" onclick="revealAnswer()">👁 Reveal answer</button>` : ''}
    </div>
    <div class="practice-nav">
      <button class="pnav-btn" onclick="practiceNav(-1)" ${idx===0?'disabled':''}>← Prev</button>
      <button class="pnav-btn" onclick="restartPractice()">↺ Restart</button>
      <button class="pnav-btn primary" onclick="practiceNav(1)" ${idx===total-1?'disabled':''}>Next →</button>
    </div>
  `;
}

function revealAnswer() {
  practiceState.revealed = true;
  document.getElementById('fc-answer')?.classList.add('visible');
  const btn = document.querySelector('.btn-reveal');
  if (btn) btn.style.display = 'none';
}

function practiceNav(dir) {
  const t = TOPICS.find(x => x.id === practiceState.topicId);
  if (!t) return;
  practiceState.idx = Math.max(0, Math.min(t.qa.length - 1, practiceState.idx + dir));
  practiceState.revealed = false;
  renderPracticeCard();
}

function restartPractice() {
  practiceState.idx = 0;
  practiceState.revealed = false;
  renderPracticeCard();
}

// ─── Resume & JD tab ──────────────────────────────────
function switchRJD(tab) {
  document.getElementById('rjd-resume-content').classList.toggle('hidden', tab !== 'resume');
  document.getElementById('rjd-jd-content').classList.toggle('hidden', tab !== 'jd');
  document.getElementById('tab-resume').classList.toggle('active', tab === 'resume');
  document.getElementById('tab-jd').classList.toggle('active', tab === 'jd');
}
