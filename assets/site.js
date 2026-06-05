// ─────────────────────────────────────────────────────────────────────────────
// SHARED SITE JS — Tiger Debate Camp
// ─────────────────────────────────────────────────────────────────────────────

let _serverContent = null;
let _serverTheme   = null;

// ── CONTENT DEFAULTS ─────────────────────────────────────────────────────────
const CONTENT_DEFAULTS = {
  headline:    "Tiger Debate Camp",
  subheadline: "An intensive debate program for rising 6th–8th graders, run out of Pensacola High School by the Pensacola High Debate Team.",
  contactEmail: "tigerdebatecamp@gmail.com",
  announcement: {
    badge: "2026 Enrollment",
    title: "Applications Open — June 8–12 · 8:30 AM – 1:30 PM",
    body:  "23 students enrolled for 2026. Over four days you'll learn to build airtight arguments, think on your feet, and hold your own in front of a crowd. Text 850-380-5099 for more info.",
    ctaText: "Learn More",
    ctaHref: "#section-program",
  },
  calendarEmbed: "",
  googleFormEmbed: "",
  events: [
    { date: "JUN 8",  title: "Day 1 — Foundations",         desc: "Introduction to debate, argument structure, and the Tiger Debate Format." },
    { date: "JUN 9",  title: "Day 2 — Research & Evidence",  desc: "Building a case, finding evidence, and understanding both sides." },
    { date: "JUN 10", title: "Day 3 — Crossfire & Rebuttal", desc: "Practice crossfire technique, rebuttals, and refutations." },
    { date: "JUN 11", title: "Day 4 — Practice Rounds",      desc: "Full practice rounds with coaching and feedback from instructors." },
    { date: "JUN 12", title: "Day 5 — Tournament",           desc: "Real tournament with real awards. Put everything on the line." },
  ],
  team: [
    { role: "Founder & Director", name: "Henry White" },
  ],
};

function loadContent() {
  try {
    const base = _serverContent || JSON.parse(localStorage.getItem('tdc_content') || '{}');
    return deepMergeContent(CONTENT_DEFAULTS, base);
  } catch (_) { return JSON.parse(JSON.stringify(CONTENT_DEFAULTS)); }
}

function deepMergeContent(defaults, saved) {
  const result = JSON.parse(JSON.stringify(defaults));
  if (typeof saved.headline    === 'string') result.headline    = saved.headline;
  if (typeof saved.subheadline === 'string') result.subheadline = saved.subheadline;
  if (typeof saved.contactEmail === 'string') result.contactEmail = saved.contactEmail;
  if (saved.announcement && typeof saved.announcement === 'object') {
    result.announcement = { ...result.announcement, ...saved.announcement };
  }
  if (typeof saved.calendarEmbed   === 'string') result.calendarEmbed   = saved.calendarEmbed;
  if (typeof saved.googleFormEmbed === 'string') result.googleFormEmbed = saved.googleFormEmbed;
  if (Array.isArray(saved.events)) result.events = saved.events;
  if (Array.isArray(saved.team))   result.team   = saved.team;
  return result;
}

function currentContent() { return loadContent(); }

// ── THEME ─────────────────────────────────────────────────────────────────────
const THEME_DEFAULTS = {
  showEvents:       true,
  showTeam:         true,
  showCta:          true,
  showAnnouncement: true,
  showCalendar:     false,
};

function loadTheme() {
  try {
    const base = _serverTheme || JSON.parse(localStorage.getItem('tdc_theme') || '{}');
    const t = { ...THEME_DEFAULTS, ...base };
    window.__theme = t;
  } catch (_) { window.__theme = { ...THEME_DEFAULTS }; }
}

function currentTheme() {
  try { return { ...THEME_DEFAULTS, ...JSON.parse(localStorage.getItem('tdc_theme') || '{}') }; }
  catch (_) { return { ...THEME_DEFAULTS }; }
}

async function initSiteData() {
  try {
    const res = await fetch(`src/data/content.json?_=${Date.now()}`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === 'object') {
        if (data.content && typeof data.content === 'object') _serverContent = data.content;
        if (data.theme   && typeof data.theme   === 'object') _serverTheme   = data.theme;
      }
    }
  } catch (_) {}
}

// ── ESCAPE HELPERS ────────────────────────────────────────────────────────────
function escHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── HEADER / NAV INIT ─────────────────────────────────────────────────────────
function highlightActiveNav() {
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  let activeId = null;
  if (path === '' || path === 'index.html') activeId = 'nav-home';
  else if (path === 'about.html')           activeId = 'nav-about';
  document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
  if (activeId) document.getElementById(activeId)?.classList.add('active');
}

function initHeaderFooter() {
  highlightActiveNav();

  const ham = document.getElementById('hamburger');
  const nav = document.getElementById('main-nav');
  if (ham && nav) {
    ham.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      ham.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', () => {
      nav.classList.remove('open');
      ham.setAttribute('aria-expanded', 'false');
    });
  }

  const logoArea = document.querySelector('.logo-area');
  if (logoArea) {
    logoArea.addEventListener('keydown', e => {
      if (e.key === 'Enter') location.href = 'index.html';
    });
  }
}

// ── BOOT ──────────────────────────────────────────────────────────────────────
async function bootSite() {
  await initSiteData();
  loadTheme();
  initHeaderFooter();
  if (typeof onSiteReady === 'function') onSiteReady();
}

window.addEventListener('load', bootSite);
