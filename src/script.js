// Push Your Limits: workshop site
// Plain JavaScript, no build step. Each block below powers one section of the page.

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* ---------- Boot sequence: types the hero terminal once on load ---------- */
function bootTerminal() {
  const boot = $('#boot');
  const bar = $('#boot-bar');
  const state = $('#boot-state');
  if (!boot) return;

  const finish = () => {
    if (bar) bar.style.width = '100%';
    if (state) { state.textContent = 'READY'; state.classList.add('is-ready'); }
  };
  if (reduceMotion) { finish(); return; }

  // Read the finished terminal from the HTML, clear it, then replay it.
  const lines = $$('.ln', boot).map((ln) => [...ln.children].map((el) => ({ cls: el.className, text: el.textContent })));
  boot.style.minHeight = boot.offsetHeight + 'px';
  boot.textContent = '';
  if (state) state.textContent = 'BOOTING…';

  const caret = document.createElement('span');
  caret.className = 'caret';
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  (async () => {
    for (let i = 0; i < lines.length; i++) {
      const ln = document.createElement('span');
      ln.className = 'ln';
      boot.appendChild(ln);
      for (const seg of lines[i]) {
        if (seg.cls === 'caret') continue;
        const span = document.createElement('span');
        span.className = seg.cls;
        ln.appendChild(span);
        ln.appendChild(caret);
        if (seg.cls === 'c') {
          for (const ch of seg.text) { span.textContent += ch; await wait(16); }
          await wait(220);
        } else {
          span.textContent = seg.text;
          await wait(seg.cls === 'k' ? 60 : 140);
        }
      }
      if (bar) bar.style.width = Math.round(((i + 1) / lines.length) * 100) + '%';
      if (i < lines.length - 1) boot.appendChild(document.createTextNode('\n'));
    }
    finish();
  })();
}

/* ---------- HUD: the top bar follows you through the page ---------- */
const HUD_STATES = {
  lobby: { tag: 'LOBBY', name: 'WELCOME TO GITHUB LAB', status: 'READY', sc: 'teal', lvl: 'LVL 00', pct: 0 },
  'sec-bosses': { tag: 'BOSS BATTLES', name: '03 CHALLENGES', status: 'LIVE', sc: 'orange', acc: 'orange', lvl: 'LVL MAX', pct: 100 },
  'sec-arena': { tag: 'TEAM ARENA', name: 'CONFLICT RESOLVER', status: 'LIVE', sc: 'teal', acc: 'teal', lvl: 'LVL MAX', pct: 100 },
  'sec-results': { tag: 'RESULTS', name: 'LEADERBOARD', status: 'LOADING', sc: 'lav', lvl: 'LVL MAX', pct: 100 },
  'sec-commands': { tag: 'CHEAT SHEET', name: 'GIT COMMANDS', status: 'UNLOCKED', sc: 'green', lvl: 'LVL MAX', pct: 100 },
  complete: { tag: 'QUEST COMPLETE', name: 'GITHUB LAB', status: 'COMPLETE', sc: 'green', lvl: 'LVL MAX', pct: 100 },
};

const hud = $('#hud');
const hudListeners = [];

function setHud(key) {
  const s = HUD_STATES[key];
  if (!hud || !s) return;
  $('#hud-tag').textContent = s.tag;
  $('#hud-name').textContent = s.name;
  $('#hud-status').textContent = s.status;
  $('#hud-lvl').textContent = s.lvl;
  $('#hud-pct').textContent = s.pct + '%';
  $('#hud-fill').style.width = s.pct + '%';
  $('#hud-bar').setAttribute('aria-valuenow', s.pct);
  hud.dataset.sc = s.sc;
  hud.dataset.acc = s.acc || '';
  hudListeners.forEach((fn) => fn(key));
}

// Whatever crosses the middle band of the screen drives the HUD.
const hudObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) setHud(e.target.dataset.hud); });
}, { rootMargin: '-42% 0px -52% 0px' });

function watchHud(el) { if (el && el.dataset.hud) hudObserver.observe(el); }

/* ---------- Start ---------- */
bootTerminal();
$$('[data-hud]').forEach((el) => { if (!el.classList.contains('q')) watchHud(el); });
