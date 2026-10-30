'use strict';
// Core helpers: DOM building, randomness, local progress storage, quiz runner.
const BG = (window.BG = {});

BG.h = function h(tag, attrs, ...kids) {
  const el = document.createElement(tag);
  BG._apply(el, attrs);
  BG._append(el, kids);
  return el;
};

BG.SVG_NS = 'http://www.w3.org/2000/svg';
BG.s = function s(tag, attrs, ...kids) {
  const el = document.createElementNS(BG.SVG_NS, tag);
  BG._apply(el, attrs);
  BG._append(el, kids);
  return el;
};

BG._apply = function (el, attrs) {
  if (!attrs) return;
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null || v === false) continue;
    if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'text') el.textContent = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else el.setAttribute(k, v === true ? '' : v);
  }
};

BG._append = function (el, kids) {
  for (const k of kids.flat(Infinity)) {
    if (k === undefined || k === null || k === false) continue;
    el.appendChild(k instanceof Node ? k : document.createTextNode(String(k)));
  }
};

BG.clear = (el) => { while (el.firstChild) el.removeChild(el.firstChild); return el; };

// ---------- randomness ----------
BG.rand = (a, b) => a + Math.random() * (b - a);
BG.randInt = (a, b) => Math.floor(BG.rand(a, b + 1));
BG.pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
BG.shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
BG.sample = (arr, n) => BG.shuffle(arr).slice(0, n);
BG.normal = () => { // Box-Muller
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

BG.fmt = (x, d = 1) => (Number.isFinite(x) ? (Math.round(x * 10 ** d) / 10 ** d).toFixed(d) : '—');
BG.pct = (x, d = 0) => (Number.isFinite(x) ? BG.fmt(x * 100, d) + '%' : '—');

BG.reducedMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- progress (kept only in this browser; never sent anywhere) ----------
BG.STORE_KEY = 'biostat-lab-progress-v1';
BG.loadProgress = function () {
  try {
    const raw = window.localStorage.getItem(BG.STORE_KEY);
    const p = raw ? JSON.parse(raw) : null;
    if (p && typeof p === 'object' && p.scores) return p;
  } catch (e) { /* storage blocked: run without saving */ }
  return { scores: {}, unlockAll: false };
};
BG.progress = BG.loadProgress();
BG.saveProgress = function () {
  try { window.localStorage.setItem(BG.STORE_KEY, JSON.stringify(BG.progress)); } catch (e) { /* ignore */ }
};
BG.recordScore = function (lessonId, gameId, pct) {
  const key = lessonId + '/' + gameId;
  const prev = BG.progress.scores[key] || 0;
  if (pct > prev) BG.progress.scores[key] = pct;
  BG.saveProgress();
};
BG.bestScore = (lessonId, gameId) => BG.progress.scores[lessonId + '/' + gameId] || 0;
BG.PASS = 80;

// ---------- quiz runner ----------
// A question is { mount(box, done) }. It calls done(fraction 0..1, feedbackNode).
BG.runQuiz = function (root, { questions, onFinish, onRetry, onBack }) {
  let i = 0;
  let total = 0;
  const results = [];

  const bar = BG.h('div', { class: 'qbar' });
  const dots = questions.map(() => BG.h('span', { class: 'qdot' }));
  const counter = BG.h('span', { class: 'qcount mono' });
  bar.append(counter, BG.h('span', { class: 'qdots' }, dots));
  const stage = BG.h('div', { class: 'qstage' });
  BG.clear(root).append(bar, stage);

  function show() {
    counter.textContent = `Question ${i + 1} of ${questions.length}`;
    dots.forEach((d, k) => d.classList.toggle('now', k === i));
    BG.clear(stage);
    const box = BG.h('div', { class: 'qbox' });
    const fb = BG.h('div', { class: 'feedback', role: 'status', 'aria-live': 'polite' });
    stage.append(box, fb);
    let answered = false;
    questions[i].mount(box, (frac, note) => {
      if (answered) return;
      answered = true;
      total += frac;
      results.push(frac);
      const ok = frac >= 0.999;
      const part = !ok && frac > 0;
      dots[i].classList.add(ok ? 'ok' : part ? 'part' : 'bad');
      fb.className = 'feedback show ' + (ok ? 'ok' : part ? 'part' : 'bad');
      const next = BG.h('button', { class: 'btn primary', onclick: () => { i++; i < questions.length ? show() : finish(); } },
        i + 1 < questions.length ? 'Next question' : 'See my score');
      BG.clear(fb).append(
        BG.h('div', { class: 'fb-head' }, ok ? 'Correct' : part ? `Partly right (${Math.round(frac * 100)}%)` : 'Not quite'),
        note ? BG.h('div', { class: 'fb-body' }, note) : null,
        BG.h('div', { class: 'fb-actions' }, next)
      );
      next.focus({ preventScroll: true });
      fb.scrollIntoView({ behavior: BG.reducedMotion() ? 'auto' : 'smooth', block: 'nearest' });
    });
  }

  function finish() {
    const pct = Math.round((total / questions.length) * 100);
    onFinish && onFinish(pct);
    const passed = pct >= BG.PASS;
    BG.clear(stage);
    counter.textContent = 'Finished';
    stage.append(BG.h('div', { class: 'result ' + (passed ? 'ok' : 'bad') },
      BG.h('div', { class: 'result-score mono' }, pct + '%'),
      BG.h('p', null, passed
        ? 'Passed. Your best score is saved on this device.'
        : `You need ${BG.PASS}% to pass. Read the feedback, then try a new set of questions.`),
      BG.h('div', { class: 'row gap' },
        BG.h('button', { class: 'btn primary', onclick: onRetry }, 'Play again (new questions)'),
        BG.h('button', { class: 'btn', onclick: onBack }, 'Back to lesson'))
    ));
  }

  show();
};

// Multiple-choice helper. options: [{label, correct}] ; explain: string|Node|fn(correct)->Node
BG.mcq = function (box, { prompt, options, explain, visual, afterAnswer, shuffle = true, columns }, done) {
  if (visual) box.append(visual);
  if (prompt) box.append(BG.h('p', { class: 'qprompt' }, prompt));
  const opts = shuffle ? BG.shuffle(options) : options;
  const list = BG.h('div', { class: 'options' + (columns ? ' cols-' + columns : '') });
  const buttons = opts.map((o) => BG.h('button', { class: 'opt', onclick: () => choose(o) }, o.label));
  list.append(...buttons);
  box.append(list);
  function choose(o) {
    buttons.forEach((b, k) => {
      b.disabled = true;
      if (opts[k].correct) b.classList.add('right');
      if (opts[k] === o && !o.correct) b.classList.add('wrong');
    });
    if (afterAnswer) afterAnswer(o.correct);
    const note = typeof explain === 'function' ? explain(o.correct, o) : explain;
    done(o.correct ? 1 : 0, note);
  }
};

BG.p = (...kids) => BG.h('p', null, ...kids);
BG.b = (t) => BG.h('strong', null, t);
