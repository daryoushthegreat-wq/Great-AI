'use strict';
// Interactive, animated explainers. Each returns { el, ...controls } so games can reuse them.

// ---------- shared ----------
BG.stats = function (vals) {
  const n = vals.length;
  const sorted = vals.slice().sort((a, b) => a - b);
  const mean = vals.reduce((s, v) => s + v, 0) / n;
  const median = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
  const counts = new Map();
  vals.forEach((v) => counts.set(v, (counts.get(v) || 0) + 1));
  const maxC = Math.max(...counts.values());
  const modes = maxC > 1 ? [...counts.entries()].filter(([, c]) => c === maxC).map(([v]) => v).sort((a, b) => a - b) : [];
  const variance = vals.reduce((s, v) => s + (v - mean) ** 2, 0) / n;
  return { n, sorted, mean, median, modes, range: sorted[n - 1] - sorted[0], min: sorted[0], max: sorted[n - 1], variance, sd: Math.sqrt(variance) };
};

BG.slider = function ({ id, label, min, max, step, value, fmt, onInput }) {
  const out = BG.h('output', { class: 'mono', for: id });
  const input = BG.h('input', { type: 'range', id, min, max, step, value });
  const sync = () => { out.textContent = fmt ? fmt(+input.value) : input.value; };
  input.addEventListener('input', () => { sync(); onInput(+input.value); });
  sync();
  const wrap = BG.h('label', { class: 'slider', for: id }, BG.h('span', { class: 'slider-label' }, label), out, input);
  wrap.set = (v) => { input.value = v; sync(); };
  return wrap;
};

BG.svgPoint = function (svg, evt) {
  const pt = svg.createSVGPoint();
  pt.x = evt.clientX; pt.y = evt.clientY;
  return pt.matrixTransform(svg.getScreenCTM().inverse());
};

// Person glyph grid (used by several demos)
BG.personGlyph = function (size) {
  return [
    BG.s('circle', { cx: size / 2, cy: size * 0.26, r: size * 0.21 }),
    BG.s('rect', { x: size * 0.18, y: size * 0.5, width: size * 0.64, height: size * 0.48, rx: size * 0.26 })
  ];
};

BG.peopleGrid = function (n, cols, size = 16, gap = 4) {
  const rows = Math.ceil(n / cols);
  const W = cols * (size + gap) - gap, H = rows * (size + gap) - gap;
  const svg = BG.s('svg', { viewBox: `0 0 ${W} ${H}`, class: 'people', role: 'img' });
  const items = [];
  for (let i = 0; i < n; i++) {
    const x = (i % cols) * (size + gap), y = Math.floor(i / cols) * (size + gap);
    const g = BG.s('g', { transform: `translate(${x},${y})`, class: 'pp' }, BG.personGlyph(size));
    svg.append(g); items.push(g);
  }
  return { svg, items, setClass: (i, cls) => items[i].setAttribute('class', 'pp ' + cls) };
};

// =====================================================================
// 1. Centre & spread lab: draggable dots, live mean / median / mode / SD
// =====================================================================
BG.statsLab = function ({ values, min = 0, max = 100, unit = '', label = 'Value', draggable = true, onChange, step = 10 }) {
  const W = 640, H = 175, L = 24, R = 24, AX = 128;
  const X = (v) => L + ((v - min) / (max - min)) * (W - L - R);
  let vals = values.slice();
  let hi = -1;

  const svg = BG.s('svg', { viewBox: `0 0 ${W} ${H}`, class: 'lab', role: 'img', 'aria-label': 'Dot plot of ' + label });
  const band = BG.s('rect', { class: 'sd-band', y: 8, height: AX - 8, x: 0, width: 0 });
  const bandLbl = BG.s('text', { class: 'tiny muted-fill', y: 20, 'text-anchor': 'middle' }, 'mean ± 1 SD');
  const axis = BG.s('g', { class: 'axis' });
  axis.append(BG.s('line', { x1: L, x2: W - R, y1: AX, y2: AX }));
  for (let t = min; t <= max + 1e-9; t += step) {
    axis.append(BG.s('line', { x1: X(t), x2: X(t), y1: AX, y2: AX + 5 }),
      BG.s('text', { x: X(t), y: AX + 18, 'text-anchor': 'middle', class: 'tiny' }, t));
  }
  axis.append(BG.s('text', { x: W - R, y: H - 4, 'text-anchor': 'end', class: 'tiny muted-fill' }, label + (unit ? ` (${unit})` : '')));
  const meanM = BG.s('g', { class: 'marker mean-m' }, BG.s('line', { x1: 0, x2: 0, y1: 26, y2: AX }), BG.s('text', { x: 4, y: 36, class: 'tiny' }, 'mean'));
  const medM = BG.s('g', { class: 'marker median-m' }, BG.s('line', { x1: 0, x2: 0, y1: 44, y2: AX }), BG.s('text', { x: 4, y: 54, class: 'tiny' }, 'median'));
  const dotsG = BG.s('g');
  svg.append(band, bandLbl, axis, meanM, medM, dotsG);

  let dots = [];
  function buildDots() {
    BG.clear(dotsG);
    dots = vals.map((v, i) => {
      const c = BG.s('circle', { r: 9, class: 'dot' + (draggable ? ' drag' : ''), tabindex: draggable ? 0 : null, 'aria-label': `${label} ${v}` });
      if (draggable) attachDrag(c, i);
      dotsG.append(c);
      return c;
    });
  }

  function layout() {
    const st = BG.stats(vals);
    const seen = new Map();
    vals.forEach((v, i) => {
      const k = seen.get(v) || 0; seen.set(v, k + 1);
      dots[i].style.transform = `translate(${X(v)}px, ${AX - 11 - k * 19}px)`;
      dots[i].classList.toggle('hi', i === hi);
      dots[i].setAttribute('aria-label', `${label} ${v}`);
    });
    meanM.style.transform = `translateX(${X(st.mean)}px)`;
    medM.style.transform = `translateX(${X(st.median)}px)`;
    const a = Math.max(L, X(st.mean - st.sd)), b = Math.min(W - R, X(st.mean + st.sd));
    band.setAttribute('x', a); band.setAttribute('width', Math.max(0, b - a));
    bandLbl.setAttribute('x', (a + b) / 2);
    renderPanel(st);
    onChange && onChange(st, vals.slice());
  }

  const panel = BG.h('dl', { class: 'statgrid' });
  function renderPanel(st) {
    const f = (x) => BG.fmt(x, 1);
    const items = [
      ['n', st.n],
      ['Mean', f(st.mean)],
      ['Median', f(st.median)],
      ['Mode', st.modes.length ? st.modes.join(', ') : 'none'],
      ['Range', `${st.range} (${st.min}–${st.max})`],
      ['Variance', f(st.variance)],
      ['SD', f(st.sd)]
    ];
    BG.clear(panel).append(...items.map(([k, v]) => BG.h('div', null, BG.h('dt', null, k), BG.h('dd', { class: 'mono' }, v))));
  }

  function attachDrag(c, i) {
    let active = false;
    c.addEventListener('pointerdown', (e) => { active = true; c.setPointerCapture(e.pointerId); c.classList.add('grab'); e.preventDefault(); });
    c.addEventListener('pointermove', (e) => {
      if (!active) return;
      const p = BG.svgPoint(svg, e);
      const v = Math.round(min + ((p.x - L) / (W - L - R)) * (max - min));
      const nv = Math.max(min, Math.min(max, v));
      if (nv !== vals[i]) { vals[i] = nv; layout(); }
    });
    const end = () => { active = false; c.classList.remove('grab'); };
    c.addEventListener('pointerup', end);
    c.addEventListener('pointercancel', end);
    c.addEventListener('keydown', (e) => {
      const d = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      vals[i] = Math.max(min, Math.min(max, vals[i] + d * (e.shiftKey ? 5 : 1)));
      layout();
    });
  }

  buildDots();
  layout();
  const el = BG.h('div', { class: 'demo-lab' }, BG.h('div', { class: 'svgwrap' }, svg), panel);
  return {
    el,
    setValues(v) { const rebuild = v.length !== vals.length; vals = v.slice(); if (rebuild) buildDots(); layout(); },
    move(i, v) { vals[i] = v; layout(); },
    highlight(i) { hi = i; layout(); },
    get values() { return vals.slice(); }
  };
};

BG.LAB_PRESETS = {
  symmetric: [40, 45, 48, 50, 50, 50, 52, 55, 60],
  right: [20, 22, 24, 25, 25, 28, 34, 48, 80],
  left: [20, 52, 66, 72, 75, 75, 76, 78, 80],
  outlier: [40, 42, 45, 47, 50, 52, 55, 58, 98]
};

BG.demoStatsLab = function () {
  const note = BG.h('p', { class: 'demo-note' });
  const lab = BG.statsLab({
    values: BG.LAB_PRESETS.right, label: 'ICU length of stay', unit: 'hours', draggable: true,
    onChange: (st) => {
      const gap = st.mean - st.median;
      note.textContent = Math.abs(gap) < 1.5
        ? 'Mean and median are close: the data are roughly symmetric.'
        : gap > 0
          ? `Mean is ${BG.fmt(gap)} above the median: a long right tail (right skew) pulls the mean up. Order here: mode ≤ median < mean.`
          : `Mean is ${BG.fmt(-gap)} below the median: a long left tail (left skew) pulls the mean down. Order here: mean < median ≤ mode.`;
    }
  });
  const presets = BG.h('div', { class: 'row gap wrap' },
    ['symmetric', 'right', 'left', 'outlier'].map((k) =>
      BG.h('button', { class: 'chip-btn', onclick: () => lab.setValues(BG.LAB_PRESETS[k]) },
        { symmetric: 'Symmetric', right: 'Right skew', left: 'Left skew', outlier: 'Add an outlier' }[k])));
  return BG.h('div', { class: 'demo' },
    BG.h('div', { class: 'demo-title' }, 'Try it: drag any dot (or focus it and use the arrow keys)'),
    presets, lab.el, note);
};

// =====================================================================
// 2. Probability on 100 patients
// =====================================================================
BG.demoProbability = function () {
  let pA = 30, pB = 20, pAB = 10;
  const grid = BG.peopleGrid(100, 20, 16, 4);
  const out = BG.h('div', { class: 'formula mono' });
  function render() {
    pAB = Math.min(pAB, pA, pB);
    if (pA + pB - pAB > 100) pAB = pA + pB - 100;
    const aOnly = pA - pAB, bOnly = pB - pAB;
    for (let i = 0; i < 100; i++) {
      grid.setClass(i, i < pAB ? 'c-both' : i < pAB + aOnly ? 'c-a' : i < pAB + aOnly + bOnly ? 'c-b' : 'c-none');
    }
    const either = pA + pB - pAB;
    BG.clear(out).append(
      BG.h('div', null, `P(diabetes or hypertension) = ${pA / 100} + ${pB / 100} − ${pAB / 100} = `, BG.b(BG.fmt(either / 100, 2))),
      BG.h('div', null, `P(neither) = 1 − ${BG.fmt(either / 100, 2)} = `, BG.b(BG.fmt(1 - either / 100, 2)), ' (complement rule)'),
      BG.h('div', null, `P(hypertension | diabetes) = ${pAB}/${pA} = `, BG.b(pA ? BG.fmt(pAB / pA, 2) : '—'),
        `  →  P(both) = ${pA / 100} × ${pA ? BG.fmt(pAB / pA, 2) : '—'} = ${BG.fmt(pAB / 100, 2)}`)
    );
  }
  const sA = BG.slider({ id: 'prob-a', label: 'Diabetes', min: 0, max: 60, step: 1, value: pA, fmt: (v) => v + ' / 100', onInput: (v) => { pA = v; render(); sync(); } });
  const sB = BG.slider({ id: 'prob-b', label: 'Hypertension', min: 0, max: 60, step: 1, value: pB, fmt: (v) => v + ' / 100', onInput: (v) => { pB = v; render(); sync(); } });
  const sAB = BG.slider({ id: 'prob-ab', label: 'Both', min: 0, max: 60, step: 1, value: pAB, fmt: (v) => v + ' / 100', onInput: (v) => { pAB = v; render(); sync(); } });
  function sync() { sAB.set(pAB); }
  render();
  return BG.h('div', { class: 'demo' },
    BG.h('div', { class: 'demo-title' }, '100 clinic patients'),
    BG.h('div', { class: 'legend' },
      BG.h('span', { class: 'key c-a' }, 'Diabetes only'), BG.h('span', { class: 'key c-b' }, 'Hypertension only'),
      BG.h('span', { class: 'key c-both' }, 'Both'), BG.h('span', { class: 'key c-none' }, 'Neither')),
    BG.h('div', { class: 'svgwrap narrow' }, grid.svg),
    BG.h('div', { class: 'sliders' }, sA, sB, sAB), out);
};

// =====================================================================
// 3. Confidence interval vs the null line
// =====================================================================
BG.demoCI = function () {
  let mode = 'diff', est = 4, n = 100;
  const W = 640, H = 120, L = 30, R = 30;
  const svg = BG.s('svg', { viewBox: `0 0 ${W} ${H}`, class: 'lab', role: 'img' });
  const msg = BG.h('p', { class: 'demo-note' });
  const sEst = BG.slider({ id: 'ci-est', label: 'Estimate', min: -8, max: 8, step: 0.5, value: est, fmt: (v) => label(v), onInput: (v) => { est = v; draw(); } });
  const sN = BG.slider({ id: 'ci-n', label: 'Sample size', min: 10, max: 1000, step: 10, value: n, fmt: (v) => 'n = ' + v, onInput: (v) => { n = v; draw(); } });
  function label(v) { return mode === 'diff' ? (v > 0 ? '+' : '') + v + ' mmHg' : 'RR ' + BG.fmt(Math.exp(v / 8), 2); }
  function draw() {
    sEst.set(est);
    BG.clear(svg);
    let lo, hi, point, nullV, X, ticks, fmtT;
    if (mode === 'diff') {
      const half = 1.96 * 30 * Math.sqrt(2 / n);
      point = est; lo = est - half; hi = est + half; nullV = 0;
      X = (v) => L + ((Math.max(-16, Math.min(16, v)) + 16) / 32) * (W - L - R);
      ticks = [-16, -12, -8, -4, 0, 4, 8, 12, 16]; fmtT = (t) => t;
    } else {
      const lnPoint = est / 8, half = 1.96 * Math.sqrt(4 / n) * 1.2;
      point = Math.exp(lnPoint); lo = Math.exp(lnPoint - half); hi = Math.exp(lnPoint + half); nullV = 1;
      const lx = (v) => Math.log(Math.max(0.25, Math.min(4, v)));
      X = (v) => L + ((lx(v) + Math.log(4)) / (2 * Math.log(4))) * (W - L - R);
      ticks = [0.25, 0.5, 1, 2, 4]; fmtT = (t) => t;
    }
    const sig = lo > nullV || hi < nullV;
    svg.append(BG.s('line', { x1: L, x2: W - R, y1: 80, y2: 80, class: 'axis-line' }));
    ticks.forEach((t) => svg.append(BG.s('line', { x1: X(t), x2: X(t), y1: 80, y2: 85, class: 'axis-line' }),
      BG.s('text', { x: X(t), y: 100, 'text-anchor': 'middle', class: 'tiny' }, fmtT(t))));
    svg.append(BG.s('line', { x1: X(nullV), x2: X(nullV), y1: 10, y2: 80, class: 'null-line' }),
      BG.s('text', { x: X(nullV) + 5, y: 20, class: 'tiny muted-fill' }, 'no effect = ' + nullV));
    svg.append(BG.s('line', { x1: X(lo), x2: X(hi), y1: 48, y2: 48, class: 'ci-bar ' + (sig ? 'sig' : 'ns') }),
      BG.s('line', { x1: X(lo), x2: X(lo), y1: 40, y2: 56, class: 'ci-bar ' + (sig ? 'sig' : 'ns') }),
      BG.s('line', { x1: X(hi), x2: X(hi), y1: 40, y2: 56, class: 'ci-bar ' + (sig ? 'sig' : 'ns') }),
      BG.s('rect', { x: X(point) - 6, y: 42, width: 12, height: 12, class: 'ci-point ' + (sig ? 'sig' : 'ns') }));
    svg.append(BG.s('text', { x: W - R, y: 116, 'text-anchor': 'end', class: 'tiny muted-fill' },
      mode === 'diff' ? 'Difference in systolic BP, drug − placebo (mmHg)' : 'Relative risk (log scale)'));
    const f = (v) => (mode === 'diff' ? BG.fmt(v, 1) : BG.fmt(v, 2));
    msg.textContent = `95% CI ${f(lo)} to ${f(hi)}. ` + (sig
      ? `It does not include ${nullV}, so the result is statistically significant at the 5% level (p < 0.05).`
      : `It includes ${nullV} (no effect), so the result is not statistically significant at the 5% level.`);
  }
  const toggle = BG.h('div', { class: 'seg', role: 'group', 'aria-label': 'Measure type' },
    BG.h('button', { class: 'on', onclick: (e) => setMode('diff', e.currentTarget) }, 'Difference (null = 0)'),
    BG.h('button', { onclick: (e) => setMode('ratio', e.currentTarget) }, 'Ratio (null = 1)'));
  function setMode(m, btn) {
    mode = m; [...toggle.children].forEach((b) => b.classList.toggle('on', b === btn));
    sEst.set(est); sEst.querySelector('output').textContent = label(est); draw();
  }
  draw();
  return BG.h('div', { class: 'demo' },
    BG.h('div', { class: 'demo-title' }, 'Move the estimate and the sample size'), toggle,
    BG.h('div', { class: 'svgwrap' }, svg), BG.h('div', { class: 'sliders' }, sEst, sN), msg);
};

// =====================================================================
// 4. Disease bathtub: incidence flows in, prevalence is the water level
// =====================================================================
BG.bathtub = function ({ I = 10, r = 0.1, d = 0.05, P, controls = true, cap = 300 } = {}) {
  const W = 640, H = 290;
  const TUB = { x: 150, y: 70, w: 340, h: 170 };
  let par = { I, r, d };
  let prev = P !== undefined ? P : I / (r + d);
  const svg = BG.s('svg', { viewBox: `0 0 ${W} ${H}`, class: 'tub', role: 'img', 'aria-label': 'Bathtub model of incidence and prevalence' });
  const water = BG.s('rect', { class: 'water', x: TUB.x + 4, width: TUB.w - 8 });
  const level = BG.s('text', { class: 'tub-num', x: TUB.x + TUB.w / 2, 'text-anchor': 'middle' });
  const drops = BG.s('g');
  svg.append(
    BG.s('path', { class: 'pipe', d: `M40 20 H ${TUB.x + 70} V 46` }),
    BG.s('rect', { class: 'pipe-end', x: TUB.x + 58, y: 40, width: 24, height: 10, rx: 2 }),
    BG.s('text', { x: 40, y: 14, class: 'tiny strong-fill' }, 'INCIDENCE: new cases flow in'),
    water,
    BG.s('path', { class: 'tub-wall', d: `M${TUB.x} ${TUB.y} V ${TUB.y + TUB.h} H ${TUB.x + TUB.w} V ${TUB.y}` }),
    BG.s('path', { class: 'pipe good', d: `M${TUB.x + 50} ${TUB.y + TUB.h} V ${TUB.y + TUB.h + 22} H 40` }),
    BG.s('path', { class: 'pipe dark', d: `M${TUB.x + TUB.w - 50} ${TUB.y + TUB.h} V ${TUB.y + TUB.h + 22} H ${W - 40}` }),
    BG.s('text', { x: 40, y: TUB.y + TUB.h + 42, class: 'tiny' }, 'Recovery / cure'),
    BG.s('text', { x: W - 40, y: TUB.y + TUB.h + 42, class: 'tiny', 'text-anchor': 'end' }, 'Death'),
    BG.s('text', { x: TUB.x + TUB.w + 10, y: TUB.y + 14, class: 'tiny strong-fill' }, 'PREVALENCE ='),
    BG.s('text', { x: TUB.x + TUB.w + 10, y: TUB.y + 30, class: 'tiny' }, 'everyone who has'),
    BG.s('text', { x: TUB.x + TUB.w + 10, y: TUB.y + 46, class: 'tiny' }, 'the disease now'),
    level, drops
  );
  const readout = BG.h('div', { class: 'formula mono' });

  let dropList = [], acc = { in: 0, rec: 0, die: 0 }, last = 0, started = false;
  function waterY() { return TUB.y + TUB.h - Math.min(1, prev / cap) * (TUB.h - 6); }
  function spawn(kind) {
    if (BG.reducedMotion() || dropList.length > 80) return;
    let x, y, vx, vy;
    if (kind === 'in') { x = TUB.x + 70 + BG.rand(-6, 6); y = 50; vx = 0; vy = 60; }
    else if (kind === 'rec') { x = TUB.x + 50; y = TUB.y + TUB.h + 22; vx = -140; vy = 0; }
    else { x = TUB.x + TUB.w - 50; y = TUB.y + TUB.h + 22; vx = 140; vy = 0; }
    const c = BG.s('circle', { r: 4, class: 'drop ' + kind, cx: x, cy: y });
    drops.append(c); dropList.push({ c, x, y, vx, vy, kind });
  }
  function tick(t) {
    if (!svg.isConnected) { if (started) return; requestAnimationFrame(tick); return; }
    started = true;
    const dt = last ? Math.min(0.05, (t - last) / 1000) : 0; last = t;
    const months = dt * 1.5; // 1 real second ≈ 1.5 months
    prev = Math.max(0, prev + (par.I - (par.r + par.d) * prev) * months);
    acc.in += par.I * months * 0.5; acc.rec += par.r * prev * months * 0.5; acc.die += par.d * prev * months * 0.5;
    while (acc.in >= 1) { spawn('in'); acc.in -= 1; }
    while (acc.rec >= 1) { spawn('rec'); acc.rec -= 1; }
    while (acc.die >= 1) { spawn('die'); acc.die -= 1; }
    const wy = waterY();
    dropList = dropList.filter((o) => {
      if (o.kind === 'in') o.vy += 400 * dt;
      o.x += o.vx * dt; o.y += o.vy * dt;
      const gone = (o.kind === 'in' && o.y >= wy) || o.x < 30 || o.x > W - 30;
      if (gone) { o.c.remove(); return false; }
      o.c.setAttribute('cx', o.x); o.c.setAttribute('cy', o.y);
      return true;
    });
    water.setAttribute('y', wy); water.setAttribute('height', TUB.y + TUB.h - wy);
    level.setAttribute('y', Math.min(TUB.y + TUB.h - 10, wy + 22));
    level.textContent = Math.round(prev) + ' people';
    renderReadout();
    requestAnimationFrame(tick);
  }
  let lastTxt = '';
  function renderReadout() {
    const out = par.r + par.d;
    const dur = out > 0 ? 1 / out : Infinity;
    const txt = `Incidence ${par.I}/month · prevalence now ${Math.round(prev)} · average duration ${Number.isFinite(dur) ? BG.fmt(dur, 1) + ' months' : '∞'} · steady state ≈ incidence × duration = ${Number.isFinite(dur) ? Math.round(par.I * dur) : '∞'}`;
    if (txt !== lastTxt) { readout.textContent = txt; lastTxt = txt; }
  }
  requestAnimationFrame(tick);

  const el = BG.h('div', { class: 'demo-tub' }, BG.h('div', { class: 'svgwrap scroll' }, svg), readout);
  if (controls) {
    el.append(BG.h('div', { class: 'sliders' },
      BG.slider({ id: 'tub-i', label: 'New cases per month', min: 0, max: 20, step: 1, value: par.I, onInput: (v) => { par.I = v; } }),
      BG.slider({ id: 'tub-r', label: 'Recovery rate', min: 0, max: 0.5, step: 0.01, value: par.r, fmt: (v) => BG.pct(v) + ' /month', onInput: (v) => { par.r = v; } }),
      BG.slider({ id: 'tub-d', label: 'Death rate', min: 0, max: 0.5, step: 0.01, value: par.d, fmt: (v) => BG.pct(v) + ' /month', onInput: (v) => { par.d = v; } })));
  }
  return { el, set(p) { Object.assign(par, p); }, setPrev(v) { prev = v; } };
};

BG.demoBathtub = function () {
  const tub = BG.bathtub({ I: 10, r: 0.1, d: 0.05 });
  return BG.h('div', { class: 'demo' },
    BG.h('div', { class: 'demo-title' }, 'Change the flows and watch the water level'), tub.el,
    BG.h('p', { class: 'demo-note' }, 'Try: set recovery and death close to 0 (a drug that keeps people alive but does not cure). Incidence stays the same, but prevalence keeps rising.'));
};

// =====================================================================
// 5. 2×2 table: RR, OR, attributable risk
// =====================================================================
BG.demo2x2 = function () {
  const v = { a: 30, b: 70, c: 10, d: 90 };
  const out = BG.h('div', { class: 'formula mono' });
  const bars = BG.h('div', { class: 'riskbars' });
  const inp = (k) => {
    const i = BG.h('input', { type: 'number', min: 0, max: 999, value: v[k], id: 'tt-' + k, class: 'num', 'aria-label': 'cell ' + k });
    i.addEventListener('input', () => { v[k] = Math.max(0, Math.min(999, Math.round(+i.value || 0))); render(); });
    return i;
  };
  const table = BG.h('table', { class: 't2x2' },
    BG.h('thead', null, BG.h('tr', null, BG.h('th'), BG.h('th', null, 'Disease'), BG.h('th', null, 'No disease'))),
    BG.h('tbody', null,
      BG.h('tr', null, BG.h('th', null, 'Exposed (smokers)'), BG.h('td', null, BG.h('span', { class: 'cell-tag' }, 'a'), inp('a')), BG.h('td', null, BG.h('span', { class: 'cell-tag' }, 'b'), inp('b'))),
      BG.h('tr', null, BG.h('th', null, 'Unexposed'), BG.h('td', null, BG.h('span', { class: 'cell-tag' }, 'c'), inp('c')), BG.h('td', null, BG.h('span', { class: 'cell-tag' }, 'd'), inp('d')))));
  function render() {
    const { a, b, c, d } = v;
    const re = a / (a + b), ru = c / (c + d);
    const rr = re / ru, or = (a * d) / (b * c), ar = re - ru;
    BG.clear(out).append(
      BG.h('div', null, `Risk in exposed   = a/(a+b) = ${a}/${a + b} = `, BG.b(BG.fmt(re, 3))),
      BG.h('div', null, `Risk in unexposed = c/(c+d) = ${c}/${c + d} = `, BG.b(BG.fmt(ru, 3))),
      BG.h('div', null, 'Relative risk  RR = ', BG.b(BG.fmt(rr, 2)), rr > 1 ? '  (> 1: exposure linked to higher risk)' : rr < 1 ? '  (< 1: exposure linked to lower risk)' : ''),
      BG.h('div', null, `Odds ratio     OR = ad/bc = (${a}×${d})/(${b}×${c}) = `, BG.b(BG.fmt(or, 2))),
      BG.h('div', null, 'Attributable risk AR = risk exposed − risk unexposed = ', BG.b(BG.fmt(ar, 3)),
        Number.isFinite(ar) ? `  (${BG.fmt(Math.abs(ar) * 1000, 0)} ${ar >= 0 ? 'extra' : 'fewer'} cases per 1,000 exposed)` : ''));
    BG.clear(bars).append(
      ...[['Exposed', re, 'exp'], ['Unexposed', ru, 'unexp']].map(([n, r, cls]) =>
        BG.h('div', { class: 'riskbar' }, BG.h('span', null, n),
          BG.h('span', { class: 'track' }, BG.h('span', { class: 'fill ' + cls, style: { width: (Number.isFinite(r) ? r * 100 : 0) + '%' } })),
          BG.h('span', { class: 'mono' }, BG.pct(r, 1)))));
  }
  render();
  return BG.h('div', { class: 'demo' },
    BG.h('div', { class: 'demo-title' }, 'Edit the counts in the 2×2 table'),
    BG.h('div', { class: 'tablewrap' }, table), bars, out);
};

// =====================================================================
// 6. Screening test on 400 people: sensitivity, specificity, PPV, NPV
// =====================================================================
BG.demoTestGrid = function () {
  let prev = 10, sens = 90, spec = 90;
  const N = 400;
  const grid = BG.peopleGrid(N, 25, 14, 3);
  const out = BG.h('div', { class: 'formula mono' });
  function render() {
    const D = Math.round(N * prev / 100), ND = N - D;
    const TP = Math.round(D * sens / 100), FN = D - TP, TN = Math.round(ND * spec / 100), FP = ND - TN;
    let k = 0;
    [[TP, 'c-tp'], [FN, 'c-fn'], [FP, 'c-fp'], [TN, 'c-tn']].forEach(([cnt, cls]) => { for (let j = 0; j < cnt; j++) grid.setClass(k++, cls); });
    const ppv = TP / (TP + FP), npv = TN / (TN + FN);
    BG.clear(out).append(
      BG.h('div', null, `Diseased ${D} · healthy ${ND}`),
      BG.h('div', null, `Sensitivity = TP/(TP+FN) = ${TP}/${D} · Specificity = TN/(TN+FP) = ${TN}/${ND}`),
      BG.h('div', null, `PPV = TP/(TP+FP) = ${TP}/${TP + FP} = `, BG.b(BG.pct(ppv, 1)), '  (chance a positive result is a true case)'),
      BG.h('div', null, `NPV = TN/(TN+FN) = ${TN}/${TN + FN} = `, BG.b(BG.pct(npv, 1)), '  (chance a negative result is truly healthy)'));
  }
  render();
  return BG.h('div', { class: 'demo' },
    BG.h('div', { class: 'demo-title' }, '400 people screened'),
    BG.h('div', { class: 'legend' },
      BG.h('span', { class: 'key c-tp' }, 'True positive'), BG.h('span', { class: 'key c-fn' }, 'False negative'),
      BG.h('span', { class: 'key c-fp' }, 'False positive'), BG.h('span', { class: 'key c-tn' }, 'True negative')),
    BG.h('div', { class: 'svgwrap narrow' }, grid.svg),
    BG.h('div', { class: 'sliders' },
      BG.slider({ id: 'tg-prev', label: 'Prevalence', min: 1, max: 50, step: 1, value: prev, fmt: (v) => v + '%', onInput: (v) => { prev = v; render(); } }),
      BG.slider({ id: 'tg-sens', label: 'Sensitivity', min: 50, max: 100, step: 1, value: sens, fmt: (v) => v + '%', onInput: (v) => { sens = v; render(); } }),
      BG.slider({ id: 'tg-spec', label: 'Specificity', min: 50, max: 100, step: 1, value: spec, fmt: (v) => v + '%', onInput: (v) => { spec = v; render(); } })),
    out,
    BG.h('p', { class: 'demo-note' }, 'Try: drop prevalence to 1%. Even a good test gives mostly false positives, so PPV falls. Push sensitivity to 100%: there are no false negatives, so a negative result rules the disease out (SnNOut).'));
};

// =====================================================================
// 7. Study-design timelines
// =====================================================================
BG.DESIGNS = {
  cross: { name: 'Cross-sectional', caption: 'One snapshot: exposure and outcome are measured at the same moment. Gives prevalence; cannot show what came first.' },
  procohort: { name: 'Prospective cohort', caption: 'Start now with people grouped by exposure, then follow them into the future to see who develops the outcome.' },
  retrocohort: { name: 'Retrospective cohort', caption: 'Start now, but use old records: group people by past exposure and trace their outcomes up to today. Still runs exposure → outcome.' },
  casecontrol: { name: 'Case-control', caption: 'Start with the outcome: people with the disease (cases) and without (controls). Look back to compare past exposure.' },
  rct: { name: 'Randomized controlled trial', caption: 'The investigator assigns the intervention by chance (R), then follows both groups forward and compares outcomes.' },
  crossover: { name: 'Crossover trial', caption: 'Every participant gets both treatments in random order, with a washout between. Each person is their own control.' },
  quasi: { name: 'Quasi-experimental', caption: 'The investigator applies an intervention, but without random assignment (or without a proper control group).' }
};

BG.timeline = function (key) {
  const W = 640, H = 240, PAST = 110, NOW = 320, FUT = 530;
  const id = 'arw' + Math.random().toString(36).slice(2, 8);
  const svg = BG.s('svg', { viewBox: `0 0 ${W} ${H}`, class: 'timeline', role: 'img', 'aria-label': BG.DESIGNS[key].name + ' timeline' });
  svg.append(BG.s('defs', null, BG.s('marker', { id, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' },
    BG.s('path', { d: 'M0 0 L10 5 L0 10 z', class: 'arrowhead' }))));
  svg.append(BG.s('line', { x1: 30, x2: W - 20, y1: 205, y2: 205, class: 'axis-line', 'marker-end': `url(#${id})` }));
  [[PAST, 'Past'], [NOW, 'Now'], [FUT, 'Future']].forEach(([x, t]) => svg.append(
    BG.s('line', { x1: x, x2: x, y1: 200, y2: 210, class: 'axis-line' }), BG.s('text', { x, y: 228, 'text-anchor': 'middle', class: 'tiny strong-fill' }, t)));
  svg.append(BG.s('text', { x: W - 20, y: 196, 'text-anchor': 'end', class: 'tiny muted-fill' }, 'time'));
  let step = 0;
  const delay = () => (BG.reducedMotion() ? 0 : 0.35 * step++) + 's';
  const box = (x, y, w, t, cls = '') => {
    const g = BG.s('g', { class: 'tl-box appear ' + cls, style: `animation-delay:${delay()}` },
      BG.s('rect', { x: x - w / 2, y: y - 15, width: w, height: 30, rx: 6 }),
      BG.s('text', { x, y: y + 4, 'text-anchor': 'middle' }, t));
    svg.append(g); return g;
  };
  const arrow = (x1, y1, x2, y2, cls = '') => {
    svg.append(BG.s('path', { d: `M${x1} ${y1} L${x2} ${y2}`, class: 'tl-arrow draw ' + cls, pathLength: 1, 'marker-end': `url(#${id})`, style: `animation-delay:${delay()}` }));
  };
  const note = (x, y, t, anchor = 'middle') => svg.append(BG.s('text', { x, y, 'text-anchor': anchor, class: 'tiny muted-fill appear', style: `animation-delay:${delay()}` }, t));
  const circleR = (x, y) => {
    svg.append(BG.s('g', { class: 'appear', style: `animation-delay:${delay()}` },
      BG.s('circle', { cx: x, cy: y, r: 16, class: 'r-circle' }), BG.s('text', { x, y: y + 5, 'text-anchor': 'middle', class: 'r-text' }, 'R')));
  };

  switch (key) {
    case 'cross':
      svg.append(BG.s('rect', { x: NOW - 85, y: 20, width: 170, height: 165, rx: 10, class: 'snapshot appear', style: `animation-delay:${delay()}` }));
      box(NOW, 50, 150, 'Population sample');
      box(NOW, 105, 150, 'Exposure?', 'exp');
      box(NOW, 150, 150, 'Outcome?', 'out');
      note(NOW + 100, 105, 'measured together', 'start');
      break;
    case 'procohort':
      note(NOW, 25, 'study starts here');
      box(NOW, 70, 120, 'Exposed', 'exp'); box(NOW, 140, 120, 'Unexposed', 'exp');
      arrow(NOW + 62, 70, FUT - 62, 70); arrow(NOW + 62, 140, FUT - 62, 140);
      box(FUT, 70, 120, 'Outcome?', 'out'); box(FUT, 140, 120, 'Outcome?', 'out');
      break;
    case 'retrocohort':
      box(PAST, 70, 150, 'Exposed (records)', 'exp'); box(PAST, 140, 150, 'Unexposed (records)', 'exp');
      arrow(PAST + 77, 70, NOW - 62, 70); arrow(PAST + 77, 140, NOW - 62, 140);
      box(NOW, 70, 120, 'Outcome?', 'out'); box(NOW, 140, 120, 'Outcome?', 'out');
      arrow(NOW, 30, PAST + 10, 30, 'dashed');
      note(NOW + 10, 34, 'researcher starts now, opens old records', 'start');
      break;
    case 'casecontrol':
      note(NOW, 25, 'study starts with the outcome');
      box(NOW, 70, 150, 'Cases (disease)', 'out'); box(NOW, 140, 150, 'Controls (no disease)', 'out');
      arrow(NOW - 77, 70, PAST + 62, 70); arrow(NOW - 77, 140, PAST + 62, 140);
      box(PAST, 70, 120, 'Exposure?', 'exp'); box(PAST, 140, 120, 'Exposure?', 'exp');
      break;
    case 'rct':
      box(150, 105, 130, 'Eligible patients');
      arrow(216, 105, 254, 105); circleR(272, 105);
      arrow(288, 98, 340, 70); arrow(288, 112, 340, 140);
      box(400, 70, 120, 'Intervention', 'exp'); box(400, 140, 120, 'Control', 'exp');
      arrow(461, 70, FUT + 10, 70); arrow(461, 140, FUT + 10, 140);
      box(FUT + 60, 70, 100, 'Outcome?', 'out'); box(FUT + 60, 140, 100, 'Outcome?', 'out');
      break;
    case 'crossover':
      circleR(110, 105);
      arrow(126, 98, 170, 70); arrow(126, 112, 170, 140);
      box(230, 70, 110, 'Drug A', 'exp'); arrow(286, 70, 320, 70); box(380, 70, 110, 'Washout'); arrow(436, 70, 470, 70); box(530, 70, 110, 'Drug B', 'out');
      box(230, 140, 110, 'Drug B', 'out'); arrow(286, 140, 320, 140); box(380, 140, 110, 'Washout'); arrow(436, 140, 470, 140); box(530, 140, 110, 'Drug A', 'exp');
      note(380, 30, 'each person receives both treatments');
      break;
    case 'quasi':
      note(NOW - 60, 25, 'investigator chooses who gets it (no R)');
      box(NOW - 60, 70, 200, 'Hospital A: new program', 'exp'); box(NOW - 60, 140, 200, 'Hospital B: usual care', 'exp');
      arrow(NOW + 42, 70, FUT - 52, 70); arrow(NOW + 42, 140, FUT - 52, 140);
      box(FUT, 70, 100, 'Outcome?', 'out'); box(FUT, 140, 100, 'Outcome?', 'out');
      break;
  }
  return BG.h('figure', { class: 'tl-fig' }, BG.h('div', { class: 'svgwrap scroll' }, svg),
    BG.h('figcaption', null, BG.b(BG.DESIGNS[key].name + '. '), BG.DESIGNS[key].caption));
};

BG.demoTimelines = function () {
  const holder = BG.h('div');
  const keys = Object.keys(BG.DESIGNS);
  const tabs = BG.h('div', { class: 'seg wrap', role: 'tablist' }, keys.map((k, i) =>
    BG.h('button', { role: 'tab', class: i === 0 ? 'on' : '', onclick: (e) => show(k, e.currentTarget) }, BG.DESIGNS[k].name)));
  function show(k, btn) {
    [...tabs.children].forEach((b) => { b.classList.toggle('on', b === btn); b.setAttribute('aria-selected', b === btn); });
    BG.clear(holder).append(BG.timeline(k));
  }
  show(keys[0], tabs.children[0]);
  return BG.h('div', { class: 'demo' }, BG.h('div', { class: 'demo-title' }, 'Pick a design to see which way it runs in time'), tabs, holder);
};

// =====================================================================
// 8. Randomizer: doctor's choice vs coin flip
// =====================================================================
BG.randomizer = function ({ n = 40, controls = true } = {}) {
  const W = 640;
  let patients = [], size, gapPx, H, revealed = false, allocated = false;
  const svg = BG.s('svg', { class: 'rand', role: 'img', 'aria-label': 'Patients being allocated to two groups' });
  const labels = BG.s('g');
  const peopleG = BG.s('g');
  svg.append(labels, peopleG);
  const table = BG.h('div', { class: 'balance' });
  const status = BG.h('p', { class: 'demo-note' });

  function newPatients(count) {
    n = count; allocated = false;
    size = n <= 40 ? 20 : n <= 100 ? 14 : 10; gapPx = n <= 40 ? 6 : 3;
    patients = Array.from({ length: n }, () => {
      const high = Math.random() < 0.4, gene = Math.random() < 0.3;
      const pRec = (high ? 0.45 : 0.8) - (gene ? 0.2 : 0);
      return { high, gene, group: null, recovered: Math.random() < pRec };
    });
    BG.clear(peopleG);
    patients.forEach((p) => {
      p.el = BG.s('g', { class: 'pp ' + (p.high ? 'c-high' : 'c-low') }, BG.personGlyph(size),
        BG.s('circle', { cx: size * 0.82, cy: size * 0.18, r: size * 0.16, class: 'gene-dot' }));
      peopleG.append(p.el);
    });
    layout();
  }

  function positions(list, x0, width, y0) {
    const cols = Math.max(1, Math.floor((width + gapPx) / (size + gapPx)));
    list.forEach((p, i) => { p.x = x0 + (i % cols) * (size + gapPx); p.y = y0 + Math.floor(i / cols) * (size + gapPx); });
    return Math.ceil(list.length / cols) * (size + gapPx);
  }

  function layout() {
    BG.clear(labels);
    let h;
    if (!allocated) {
      h = positions(patients, 20, W - 40, 34);
      labels.append(BG.s('text', { x: 20, y: 20, class: 'tiny strong-fill' }, `${n} patients waiting to be allocated`));
    } else {
      const A = patients.filter((p) => p.group === 'A'), B = patients.filter((p) => p.group === 'B');
      h = Math.max(positions(A, 20, 280, 34), positions(B, 340, 280, 34));
      labels.append(BG.s('text', { x: 20, y: 20, class: 'tiny strong-fill' }, `New drug (${A.length})`),
        BG.s('text', { x: 340, y: 20, class: 'tiny strong-fill' }, `Standard care (${B.length})`),
        BG.s('line', { x1: 320, x2: 320, y1: 8, y2: 34 + h, class: 'divider' }));
    }
    H = 34 + h + 8;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    patients.forEach((p) => {
      p.el.style.transform = `translate(${p.x}px, ${p.y}px)`;
      p.el.classList.toggle('show-gene', revealed && p.gene);
    });
    renderTable();
  }

  function renderTable() {
    const A = patients.filter((p) => p.group === 'A'), B = patients.filter((p) => p.group === 'B');
    const share = (list, f) => (list.length ? list.filter(f).length / list.length : NaN);
    const row = (name, f, hidden) => BG.h('div', { class: 'brow' }, BG.h('span', { class: 'bname' }, name),
      ...[A, B].map((list, k) => {
        const v = share(list, f);
        return BG.h('span', { class: 'bcell' },
          BG.h('span', { class: 'track' }, BG.h('span', { class: 'fill ' + (k ? 'unexp' : 'exp'), style: { width: (hidden || !Number.isFinite(v) ? 0 : v * 100) + '%' } })),
          BG.h('span', { class: 'mono' }, hidden ? '?' : BG.pct(v)));
      }));
    BG.clear(table).append(
      BG.h('div', { class: 'brow head' }, BG.h('span'), BG.h('span', null, 'New drug'), BG.h('span', null, 'Standard')),
      row('High-risk', (p) => p.high, !allocated),
      row('Hidden gene', (p) => p.gene, !allocated || !revealed),
      row('Recovered', (p) => p.recovered, !allocated));
  }

  function allocate(mode) {
    patients.forEach((p) => {
      const pNew = mode === 'doctor' ? (p.high ? 0.15 : 0.85) : 0.5;
      p.group = Math.random() < pNew ? 'A' : 'B';
    });
    allocated = true;
    layout();
    const A = patients.filter((p) => p.group === 'A'), B = patients.filter((p) => p.group === 'B');
    const ra = A.filter((p) => p.recovered).length / (A.length || 1), rb = B.filter((p) => p.recovered).length / (B.length || 1);
    status.textContent = (mode === 'doctor'
      ? 'Doctor\'s choice: the doctor gave the new drug mostly to healthier (low-risk) patients. '
      : 'Coin flip: every patient had a 50% chance of each group. ')
      + `Recovery ${BG.pct(ra)} vs ${BG.pct(rb)}. In this simulation the new drug does nothing, so any gap comes from who ended up in each group (or chance).`;
  }

  newPatients(n);
  const el = BG.h('div', { class: 'demo-rand' });
  if (controls) {
    el.append(BG.h('div', { class: 'row gap wrap' },
      BG.h('button', { class: 'btn', onclick: () => allocate('doctor') }, 'Doctor\'s choice'),
      BG.h('button', { class: 'btn primary', onclick: () => allocate('random') }, 'Randomize (coin flip)'),
      BG.h('button', { class: 'btn', onclick: (e) => { revealed = !revealed; e.currentTarget.textContent = revealed ? 'Hide hidden gene' : 'Reveal hidden gene'; layout(); } }, 'Reveal hidden gene'),
      BG.h('label', { class: 'inline-select' }, 'Patients ',
        BG.h('select', { id: 'rand-n', onchange: (e) => { newPatients(+e.target.value); status.textContent = ''; } },
          [12, 40, 200].map((v) => BG.h('option', { value: v, selected: v === n }, v))))));
  }
  el.append(BG.h('div', { class: 'legend' }, BG.h('span', { class: 'key c-high' }, 'High-risk'), BG.h('span', { class: 'key c-low' }, 'Low-risk'),
    BG.h('span', { class: 'key c-gene' }, 'Hidden gene (when revealed)')),
  BG.h('div', { class: 'svgwrap' }, svg), table, status);
  return {
    el, allocate, newPatients,
    reveal(v) { revealed = v; layout(); },
    balance() {
      const A = patients.filter((p) => p.group === 'A'), B = patients.filter((p) => p.group === 'B');
      const s = (l, f) => l.filter(f).length / (l.length || 1);
      return { highA: s(A, (p) => p.high), highB: s(B, (p) => p.high), geneA: s(A, (p) => p.gene), geneB: s(B, (p) => p.gene), nA: A.length, nB: B.length };
    }
  };
};

BG.demoRandomizer = function () {
  const r = BG.randomizer({ n: 40 });
  return BG.h('div', { class: 'demo' },
    BG.h('div', { class: 'demo-title' }, 'Allocate 40 patients two ways'), r.el,
    BG.h('p', { class: 'demo-note' }, 'Try: press "Doctor\'s choice" several times, then "Randomize" several times. Reveal the hidden gene: randomization balances it too, even though nobody measured it.'));
};

// =====================================================================
// 9. Blinding: who knows the assignment?
// =====================================================================
BG.ROLES = ['Participants', 'Doctors / researchers', 'Outcome assessors'];
BG.BLIND_LEVELS = { open: [], single: [0], double: [0, 1], triple: [0, 1, 2] };
BG.BLIND_NAMES = { open: 'Open-label (no blinding)', single: 'Single-blind', double: 'Double-blind', triple: 'Triple-blind' };

BG.eyeIcon = function () {
  return BG.s('svg', { viewBox: '0 0 48 32', class: 'eye', 'aria-hidden': 'true' },
    BG.s('g', { class: 'eye-open' },
      BG.s('path', { d: 'M3 16 Q24 -2 45 16 Q24 34 3 16 Z', class: 'eye-white' }),
      BG.s('circle', { cx: 24, cy: 16, r: 7, class: 'eye-iris' })),
    BG.s('g', { class: 'eye-closed' },
      BG.s('path', { d: 'M3 14 Q24 30 45 14', class: 'eye-lid' }),
      BG.s('path', { d: 'M12 21 L9 27 M24 24 L24 30 M36 21 L39 27', class: 'eye-lid' })));
};

BG.blindCards = function (blinded = []) {
  const cards = BG.ROLES.map((r, i) => BG.h('div', { class: 'role' + (blinded.includes(i) ? ' blind' : '') }, BG.eyeIcon(),
    BG.h('div', { class: 'role-name' }, r), BG.h('div', { class: 'role-state' }, blinded.includes(i) ? 'does not know' : 'knows')));
  const el = BG.h('div', { class: 'roles' }, cards);
  el.set = (list) => cards.forEach((c, i) => {
    c.classList.toggle('blind', list.includes(i));
    c.querySelector('.role-state').textContent = list.includes(i) ? 'does not know' : 'knows';
  });
  return el;
};

BG.demoBlinding = function () {
  const cards = BG.blindCards([]);
  const seg = BG.h('div', { class: 'seg wrap' }, Object.keys(BG.BLIND_LEVELS).map((k, i) =>
    BG.h('button', { class: i === 0 ? 'on' : '', onclick: (e) => { [...seg.children].forEach((b) => b.classList.toggle('on', b === e.currentTarget)); cards.set(BG.BLIND_LEVELS[k]); } }, BG.BLIND_NAMES[k])));
  return BG.h('div', { class: 'demo' }, BG.h('div', { class: 'demo-title' }, 'Who knows which treatment each patient got?'), seg, cards);
};

// =====================================================================
// 10. Sampling machine
// =====================================================================
BG.STRATA = [{ key: 'young', name: 'Age 18–39', cls: 'c-young', sbp: 116, count: 50 },
  { key: 'mid', name: 'Age 40–64', cls: 'c-mid', sbp: 128, count: 30 },
  { key: 'old', name: 'Age 65+', cls: 'c-old', sbp: 142, count: 20 }];
BG.SAMPLING_NAMES = { random: 'Simple random', stratified: 'Stratified', cluster: 'Cluster', systematic: 'Systematic', convenience: 'Convenience' };

BG.samplingMachine = function ({ controls = true } = {}) {
  const SZ = 18, GP = 5, VW = 5 * (SZ + GP) + 14, VH = 2 * (SZ + GP) + 26;
  const W = 5 * VW + 20, H = 2 * VH + 20;
  const strata = BG.shuffle(BG.STRATA.flatMap((s, k) => Array(s.count).fill(k)));
  const people = strata.map((k, i) => ({ id: i, s: k, village: Math.floor(i / 10), sbp: Math.round(BG.STRATA[k].sbp + BG.normal() * 8) }));
  const popMean = people.reduce((a, p) => a + p.sbp, 0) / people.length;
  const svg = BG.s('svg', { viewBox: `0 0 ${W} ${H}`, class: 'sampling', role: 'img', 'aria-label': 'Population of 100 people in 10 villages' });
  for (let v = 0; v < 10; v++) {
    const vx = 10 + (v % 5) * VW, vy = 10 + Math.floor(v / 5) * VH;
    svg.append(BG.s('rect', { x: vx, y: vy, width: VW - 8, height: VH - 8, rx: 8, class: 'village' }),
      BG.s('text', { x: vx + 6, y: vy + 13, class: 'tiny muted-fill' }, 'Village ' + (v + 1)));
    people.filter((p) => p.village === v).forEach((p, j) => {
      p.el = BG.s('g', { class: 'pp ' + BG.STRATA[p.s].cls, transform: `translate(${vx + 6 + (j % 5) * (SZ + GP)}, ${vy + 18 + Math.floor(j / 5) * (SZ + GP)})` }, BG.personGlyph(SZ));
      svg.append(p.el);
    });
  }
  const info = BG.h('div', { class: 'formula mono' }, `Population: 100 people · mean systolic BP ${BG.fmt(popMean, 1)} mmHg · sample size 20`);
  const comp = BG.h('div', { class: 'compbar-wrap' });
  let timers = [];

  function choose(method) {
    if (method === 'random') return BG.sample(people, 20);
    if (method === 'systematic') { const start = BG.randInt(0, 4); return people.filter((p) => p.id % 5 === start); }
    if (method === 'cluster') { const vs = BG.sample([...Array(10).keys()], 2); return people.filter((p) => vs.includes(p.village)); }
    if (method === 'stratified') return [0, 1, 2].flatMap((k) => BG.sample(people.filter((p) => p.s === k), BG.STRATA[k].count / 5));
    // convenience: whoever is in the clinic waiting room today; older people visit more often
    const pool = people.slice(); const out = [];
    while (out.length < 20) {
      const w = pool.map((p) => [1, 3, 8][p.s]); const tot = w.reduce((a, b) => a + b, 0);
      let r = Math.random() * tot, i = 0; while (r > w[i]) { r -= w[i]; i++; }
      out.push(pool.splice(i, 1)[0]);
    }
    return out;
  }

  function show(sel, animate = true) {
    timers.forEach(clearTimeout); timers = [];
    people.forEach((p) => p.el.classList.remove('picked', 'dim'));
    const ordered = sel.slice().sort((a, b) => a.id - b.id);
    people.forEach((p) => p.el.classList.add('dim'));
    ordered.forEach((p, k) => {
      const t = setTimeout(() => { p.el.classList.remove('dim'); p.el.classList.add('picked'); }, animate && !BG.reducedMotion() ? 80 * k : 0);
      timers.push(t);
    });
    const m = sel.reduce((a, p) => a + p.sbp, 0) / sel.length;
    info.textContent = `Sample mean systolic BP ${BG.fmt(m, 1)} mmHg · population mean ${BG.fmt(popMean, 1)} mmHg · difference ${m - popMean >= 0 ? '+' : ''}${BG.fmt(m - popMean, 1)}`;
    const bar = (list, title) => BG.h('div', { class: 'compbar' }, BG.h('span', { class: 'tiny-label' }, title),
      BG.h('span', { class: 'stack' }, [0, 1, 2].map((k) => {
        const f = list.filter((p) => p.s === k).length / list.length;
        return BG.h('span', { class: 'seg-fill ' + BG.STRATA[k].cls, style: { width: f * 100 + '%' }, title: BG.STRATA[k].name + ' ' + BG.pct(f) });
      })));
    BG.clear(comp).append(bar(people, 'Population'), bar(sel, 'Sample'));
  }

  function run(method, animate = true) { const sel = choose(method); show(sel, animate); return sel; }

  const el = BG.h('div', { class: 'demo-sampling' });
  if (controls) {
    el.append(BG.h('div', { class: 'seg wrap' }, Object.keys(BG.SAMPLING_NAMES).map((k) =>
      BG.h('button', { onclick: (e) => { [...e.currentTarget.parentNode.children].forEach((b) => b.classList.toggle('on', b === e.currentTarget)); run(k); } }, BG.SAMPLING_NAMES[k]))));
  }
  el.append(BG.h('div', { class: 'legend' }, BG.STRATA.map((s) => BG.h('span', { class: 'key ' + s.cls }, s.name))),
    BG.h('div', { class: 'svgwrap' }, svg), comp, info);
  return { el, run, people };
};

BG.demoSampling = function () {
  const m = BG.samplingMachine();
  return BG.h('div', { class: 'demo' }, BG.h('div', { class: 'demo-title' }, 'Draw a sample of 20 from 100 people'), m.el,
    BG.h('p', { class: 'demo-note' }, 'Press each method several times. Convenience sampling takes whoever is at the clinic today, mostly older people, so its average blood pressure is too high almost every time.'));
};

// =====================================================================
// 11. Confounding: coffee, smoking and lung cancer
// =====================================================================
BG.demoConfounding = function () {
  const data = { smokers: { coffee: [400, 40], none: [100, 10] }, non: { coffee: [100, 1], none: [400, 4] } };
  const holder = BG.h('div', { class: 'conf-bars' });
  const out = BG.h('p', { class: 'demo-note' });
  const dag = BG.s('svg', { viewBox: '0 0 400 150', class: 'dag', role: 'img', 'aria-label': 'Smoking causes both coffee drinking and lung cancer' },
    BG.s('defs', null, BG.s('marker', { id: 'dagm', viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto' }, BG.s('path', { d: 'M0 0 L10 5 L0 10 z', class: 'arrowhead' }))),
    BG.s('g', { class: 'node conf' }, BG.s('rect', { x: 140, y: 10, width: 120, height: 34, rx: 17 }), BG.s('text', { x: 200, y: 32, 'text-anchor': 'middle' }, 'Smoking')),
    BG.s('g', { class: 'node' }, BG.s('rect', { x: 10, y: 104, width: 120, height: 34, rx: 17 }), BG.s('text', { x: 70, y: 126, 'text-anchor': 'middle' }, 'Coffee')),
    BG.s('g', { class: 'node' }, BG.s('rect', { x: 270, y: 104, width: 120, height: 34, rx: 17 }), BG.s('text', { x: 330, y: 126, 'text-anchor': 'middle' }, 'Lung cancer')),
    BG.s('path', { d: 'M165 44 L95 102', class: 'dag-arrow', 'marker-end': 'url(#dagm)' }),
    BG.s('path', { d: 'M235 44 L305 102', class: 'dag-arrow', 'marker-end': 'url(#dagm)' }),
    BG.s('path', { d: 'M132 121 L266 121', class: 'dag-arrow dashed', 'marker-end': 'url(#dagm)' }),
    BG.s('text', { x: 200, y: 114, 'text-anchor': 'middle', class: 'tiny muted-fill' }, 'real effect?'));
  const group = (title, coffee, none) => {
    const rc = coffee[1] / coffee[0], rn = none[1] / none[0];
    const scale = 12; // % shown full width
    return BG.h('div', { class: 'conf-group' }, BG.h('div', { class: 'conf-title' }, title, BG.h('span', { class: 'mono' }, '  RR = ' + BG.fmt(rc / rn, 2))),
      ...[['Coffee', rc, coffee, 'exp'], ['No coffee', rn, none, 'unexp']].map(([n, r, cell, cls]) =>
        BG.h('div', { class: 'riskbar' }, BG.h('span', null, n),
          BG.h('span', { class: 'track' }, BG.h('span', { class: 'fill ' + cls, style: { width: Math.min(100, (r * 100 / scale) * 100) + '%' } })),
          BG.h('span', { class: 'mono' }, `${cell[1]}/${cell[0]} = ${BG.pct(r, 1)}`))));
  };
  function render(strat) {
    BG.clear(holder);
    if (!strat) {
      const c = [500, 41], nn = [500, 14];
      holder.append(group('Everyone (crude)', c, nn));
      out.textContent = 'Crude result: coffee drinkers seem to get lung cancer about 3 times as often. But most coffee drinkers here also smoke.';
    } else {
      holder.append(group('Smokers only', data.smokers.coffee, data.smokers.none), group('Non-smokers only', data.non.coffee, data.non.none));
      out.textContent = 'Within each smoking group the risk is identical (RR = 1.0). Smoking was the confounder: it is linked to coffee drinking and it causes lung cancer.';
    }
  }
  const seg = BG.h('div', { class: 'seg' },
    BG.h('button', { class: 'on', onclick: (e) => { mark(e); render(false); } }, 'Crude (everyone)'),
    BG.h('button', { onclick: (e) => { mark(e); render(true); } }, 'Stratify by smoking'));
  function mark(e) { [...seg.children].forEach((b) => b.classList.toggle('on', b === e.currentTarget)); }
  render(false);
  return BG.h('div', { class: 'demo' }, BG.h('div', { class: 'demo-title' }, 'Does coffee cause lung cancer? (made-up numbers)'),
    BG.h('div', { class: 'svgwrap narrow' }, dag), seg, holder, out);
};

// =====================================================================
// 12. Evidence-based medicine triad (static)
// =====================================================================
BG.demoEBM = function () {
  const svg = BG.s('svg', { viewBox: '0 0 360 250', class: 'ebm', role: 'img', 'aria-label': 'Evidence-based medicine combines three things' },
    BG.s('circle', { cx: 130, cy: 95, r: 80, class: 'v1' }), BG.s('circle', { cx: 230, cy: 95, r: 80, class: 'v2' }), BG.s('circle', { cx: 180, cy: 165, r: 80, class: 'v3' }),
    BG.s('text', { x: 95, y: 75, 'text-anchor': 'middle', class: 'small' }, 'Best research'), BG.s('text', { x: 95, y: 92, 'text-anchor': 'middle', class: 'small' }, 'evidence'),
    BG.s('text', { x: 265, y: 75, 'text-anchor': 'middle', class: 'small' }, 'Clinical'), BG.s('text', { x: 265, y: 92, 'text-anchor': 'middle', class: 'small' }, 'expertise'),
    BG.s('text', { x: 180, y: 210, 'text-anchor': 'middle', class: 'small' }, 'Patient values'),
    BG.s('text', { x: 180, y: 128, 'text-anchor': 'middle', class: 'small strong-fill' }, 'EBM'));
  return BG.h('div', { class: 'demo' }, BG.h('div', { class: 'svgwrap narrow' }, svg));
};
