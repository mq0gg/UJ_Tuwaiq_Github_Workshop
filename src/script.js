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

/* ---------- Mission map: built from data/missions.js ---------- */
const TYPE_ACC = { mission: 'purple', boss: 'orange', bonus: 'green', break: 'dim', lobby: 'teal', end: 'lav' };
const STATUS = {
  mission: ['IN PROGRESS', 'green'], boss: ['LIVE', null], bonus: ['LIVE', 'green'],
  break: ['PAUSED', 'orange'], lobby: ['READY', 'teal'], end: ['COMPLETE', 'green'],
};
const NODE_ICON = { mission: 'check', boss: 'zap', bonus: 'rocket', break: 'clock', lobby: 'people', end: 'trophy' };

const clock = (min) => 'T+' + String(Math.floor(min / 60)).padStart(2, '0') + ':' + String(min % 60).padStart(2, '0');
const icon = (name) => `<svg class="ic" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function renderMissions() {
  const list = $('#quest');
  const bar = $('#runbar');
  if (!list || typeof MISSIONS === 'undefined') return;

  const total = MISSIONS[MISSIONS.length - 1].end;

  MISSIONS.forEach((m) => {
    const acc = m.color || TYPE_ACC[m.type];
    const [status, sc] = STATUS[m.type];
    if (typeof HUD_STATES !== 'undefined') {
      HUD_STATES[m.id] = { tag: m.tag, name: m.name, status, sc: sc || acc, acc: m.type === 'boss' ? acc : '', lvl: m.lvl, pct: m.pct };
    }

    // proportional run bar
    const seg = document.createElement('a');
    seg.className = `seg seg--${m.type}`;
    seg.href = `#step-${m.id}`;
    seg.style.setProperty('--w', ((m.end - m.start) / total) * 100 + '%');
    seg.style.setProperty('--acc', `var(--${acc})`);
    seg.dataset.step = m.id;
    seg.setAttribute('aria-label', `${m.tag}: ${m.name}, ${m.end - m.start} min`);
    seg.title = `${m.tag} · ${m.name} · ${m.end - m.start} MIN`;
    bar.appendChild(seg);

    // quest log entry
    const li = document.createElement('li');
    li.className = `q q--${m.type}`;
    li.id = `step-${m.id}`;
    li.dataset.hud = m.id;
    li.style.setProperty('--acc', `var(--${acc})`);

    const topics = (m.topics || []).map((t) => `<li dir="ltr">${esc(t)}</li>`).join('');
    const extra = [
      m.demo ? `<span class="q__demo" dir="ltr"><span class="q__live" aria-hidden="true"></span>${esc(m.demo)}</span>` : '',
      m.link ? `<a class="q__link" href="${m.link}">${m.type === 'end' ? 'شوف الترتيب' : 'تفاصيل التحدي'}${icon('arrow-down')}</a>` : '',
    ].join('');

    const dur = `${m.end - m.start} MIN`;
    const node = m.type === 'mission'
      ? `<svg class="ic ic--todo" aria-hidden="true"><use href="#i-dot-fill"/></svg><svg class="ic ic--done" aria-hidden="true"><use href="#i-check"/></svg>`
      : icon(NODE_ICON[m.type]);

    li.innerHTML = `
      <div class="q__time"><span dir="ltr">${clock(m.start)}</span><span class="q__dur" dir="ltr">${dur}</span></div>
      <div class="q__node"><span class="q__dot">${node}</span></div>
      <div class="q__card">
        <div class="q__top"><span class="q__tag" dir="ltr">${esc(m.tag)}</span><span class="q__meta"><span class="q__when" dir="ltr">${clock(m.start)} · ${dur}</span><span dir="ltr">${esc(m.lvl)}</span></span></div>
        <h3 class="q__name"><span dir="ltr">${esc(m.name)}</span></h3>
        <p class="q__ar">${esc(m.ar)}</p>
        ${topics ? `<ul class="q__topics">${topics}</ul>` : ''}
        ${extra ? `<div class="q__extra">${extra}</div>` : ''}
      </div>`;
    list.appendChild(li);
    if (typeof watchHud === 'function') watchHud(li);
  });

  // Highlight the current step, and mark everything before it as cleared.
  const ids = MISSIONS.map((m) => m.id);
  const items = $$('.q', list);
  const segs = $$('.seg', bar);
  const mark = (key) => {
    let at = ids.indexOf(key);
    if (at === -1) at = ids.length; // sections after the map: everything is cleared
    items.forEach((el, i) => { el.classList.toggle('is-active', i === at); el.classList.toggle('is-cleared', i < at); });
    segs.forEach((el, i) => { el.classList.toggle('is-active', i === at); el.classList.toggle('is-cleared', i < at); });
  };
  if (typeof hudListeners !== 'undefined') hudListeners.push(mark);
}

/* ---------- Start ---------- */
bootTerminal();
renderMissions();
$$('[data-hud]').forEach((el) => { if (!el.classList.contains('q')) watchHud(el); });
