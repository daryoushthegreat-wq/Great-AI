// Geologist level (ages 12+): deeper terms, whole book, five study games.
import { UNITS, LESSONS, LESSON_ORDER, GAMES, WORDS, FACTS, CLOZES, SPECIMENS, RANKS } from './data-pro.js';
import { diagramFor, SPECIMEN_ART } from './diagrams.js';
import { iconFor } from './icons.js';
import { say, voiceInfo, fx } from './sound.js';
import { createStore } from './store.js';
import { $, app, ICON, esc, shuffle, wait, show, topBar, wireBar, starRow, startScreen } from './app.js';

const store = createStore('earthExplorers.pro.v1', { LESSONS, LESSON_ORDER, GAMES });
const bar = (opts = {}) => topBar({ brand: 'Earth Explorers · Geologist', ...opts }, store);
const wire = (onBack) => wireBar(onBack, store);

const KID_ICONS = new Set(['crater', 'atmosphere', 'planet', 'comet', 'mineral', 'quartz', 'granite', 'chalk', 'garnet', 'magma', 'fossil', 'iron', 'erosion', 'geology', 'mud', 'sand', 'desert', 'jungle', 'ocean', 'volcano', 'earthquake', 'mine', 'map', 'crystal', 'continent', 'igneous-rock', 'metamorphic-rock', 'microscope', 'red-sea', 'arabia', 'sun', 'star']);
function pictureFor(id) {
  const d = diagramFor(id);
  if (d) return { html: d, kind: 'diagram' };
  const k = id.replace(/^g-/, '');
  const alias = { meteorite: 'crater', 'solar-system': 'planet', orbit: 'planet', hydrogen: 'sun', 'nuclear-reaction': 'sun', 'volcanic-rock': 'volcano', soil: 'jungle', weathering: 'erosion', borehole: 'mine', quarry: 'mine', calcite: 'chalk', 'igneous-rock': 'igneous-rock', 'metamorphic-rock': 'metamorphic-rock', 'thin-section': 'microscope', 'alfred-wegener': 'map', pangaea: 'continent', 'atlantic-ocean': 'ocean', limestone: 'chalk', 'radioactive-dating': 'geology', diamond: 'crystal', gemstone: 'crystal', 'ancient-mountains': 'mountain', plain: 'desert', arid: 'desert', 'mountain-range': 'mountain', landslide: 'earthquake', tsunami: 'ocean', obsidian: 'igneous-rock', pumice: 'igneous-rock', basalt: 'igneous-rock', gneiss: 'metamorphic-rock', schist: 'metamorphic-rock' }[k] || k;
  if (KID_ICONS.has(alias) || alias === 'mountain') return { html: iconFor(alias), kind: 'icon' };
  return null;
}

const rankOf = (stars) => {
  let r = RANKS[0]; let next = null;
  for (let i = 0; i < RANKS.length; i++) if (stars >= RANKS[i][0]) { r = RANKS[i]; next = RANKS[i + 1] || null; }
  return { name: r[1], next };
};
const earnedSpecimens = () => LESSON_ORDER.filter((l) => store.lessonDone(l)).map((l) => LESSONS[l].specimen);

// ---------- Home ----------
export function proHome(greet) {
  document.body.classList.add('pro');
  const s = store.state();
  const { name, next } = rankOf(s.stars);
  const have = earnedSpecimens();
  show(`
  ${bar()}
  <main class="home">
    <section class="rank-card">
      <div class="rank-main">
        <p class="eyebrow">Your rank</p>
        <p class="rank-name">${esc(name)}</p>
        ${next ? `<div class="meter" aria-label="${s.stars} of ${next[0]} stars to ${esc(next[1])}"><i style="width:${Math.min(100, (s.stars / next[0]) * 100)}%"></i></div>
        <p class="rank-next">${next[0] - s.stars} stars to <b>${esc(next[1])}</b></p>` : '<p class="rank-next">Highest rank reached.</p>'}
      </div>
      <button class="collection-btn" id="collection">
        <span class="spec-row">${(have.length ? have.slice(-3) : ['quartz']).map((k) => `<span class="spec-mini ${have.length ? '' : 'empty'}">${SPECIMEN_ART[k]}</span>`).join('')}</span>
        <span><b>Specimen collection</b><br>${have.length} of ${LESSON_ORDER.length}</span>
      </button>
    </section>
    ${UNITS.map((u) => `
      <section class="unit">
        <h2>${esc(u.title)} <span class="pages">Book pages ${u.pages}</span></h2>
        <div class="lessons pro-lessons">
          ${u.lessons.map((lid) => {
            const L = LESSONS[lid]; const open = store.lessonOpen(lid); const n = LESSON_ORDER.indexOf(lid) + 1;
            const done = GAMES.filter((g) => store.gameStars(lid, g.id) > 0).length;
            return `<button class="lesson pro-lesson ${open ? '' : 'locked'} ${store.lessonDone(lid) ? 'done' : ''}" data-lid="${lid}">
              <span class="lesson-num">${open ? `Lesson ${n}` : `${ICON.lock} Lesson ${n}`}</span>
              <span class="lesson-title">${esc(L.title)}</span>
              <span class="lesson-pages">Book pages ${L.pages} · ${L.wordIds.length} terms</span>
              <span class="progress" aria-label="${done} of 5 games played"><i style="width:${done * 20}%"></i></span>
            </button>`;
          }).join('')}
        </div>
      </section>`).join('')}
    <div class="foot-links"><button class="link" id="level">Change level</button><button class="link" id="grown">For teachers and parents</button></div>
  </main>`, () => {
    wire();
    app.querySelectorAll('.lesson').forEach((b) => b.addEventListener('click', () => {
      const lid = b.dataset.lid;
      if (!store.lessonOpen(lid)) { fx('wrong'); toast('Finish all five games in the lesson before this one to unlock it.'); return; }
      fx('tap'); proLesson(lid);
    }));
    $('#collection').addEventListener('click', collection);
    $('#level').addEventListener('click', startScreen);
    $('#grown').addEventListener('click', settings);
    if (greet) say('Welcome, geologist.');
  });
}

function toast(msg) {
  let t = $('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('on');
  clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove('on'), 2600);
}

// ---------- Lesson ----------
const RUN = { study: gStudy, define: gDefine, cloze: gCloze, truefalse: gTF, sort: gSort };
function proLesson(lid) {
  const L = LESSONS[lid];
  show(`
  ${bar({ back: true, title: L.title })}
  <main class="lesson-screen">
    <p class="book-tag">Book pages ${L.pages} · ${L.wordIds.length} terms · Specimen: ${esc(SPECIMENS[L.specimen][0])}</p>
    <div class="games pro-games">
      ${GAMES.map((g, i) => `
        <button class="game pro-game" data-gid="${g.id}">
          <span class="game-step">${i + 1}</span>
          <span class="game-name">${esc(g.name)}</span>
          <span class="game-hint">${esc(g.hint)}</span>
          ${starRow(store.gameStars(lid, g.id))}
        </button>`).join('')}
    </div>
  </main>`, () => {
    wire(() => proHome());
    app.querySelectorAll('.game').forEach((b) => b.addEventListener('click', () => { fx('tap'); RUN[b.dataset.gid](lid); }));
  });
}

function frame(gid, inner) {
  const g = GAMES.find((x) => x.id === gid);
  return `${bar({ back: true, title: g.name })}
  <main class="play pro-play" data-game="${gid}">
    <div class="play-head"><p class="hint">${esc(g.hint)}</p><div class="dots" id="dots"></div></div>
    ${inner}
  </main>`;
}
const dotsAt = (i, n) => { const d = $('#dots'); if (d) d.innerHTML = Array.from({ length: n }, (_, k) => `<i class="${k < i ? 'done' : k === i ? 'now' : ''}"></i>`).join(''); };
const speakBtn = (id, label = 'Read aloud') => `<button class="round small speak-sm" id="${id}" aria-label="${label}">${ICON.speaker}</button>`;

function finish(lid, gid, mistakes) {
  const stars = mistakes <= 1 ? 3 : mistakes <= 3 ? 2 : 1;
  const wasDone = store.lessonDone(lid);
  const before = rankOf(store.state().stars).name;
  store.addStars(lid, gid, stars);
  const nowDone = !wasDone && store.lessonDone(lid);
  const after = rankOf(store.state().stars).name;
  const L = LESSONS[lid];
  const nextLid = LESSON_ORDER[LESSON_ORDER.indexOf(lid) + 1];
  const sp = SPECIMENS[L.specimen];
  show(`
  ${bar()}
  <main class="win pro-win">
    <div class="win-stars">${Array.from({ length: 3 }, (_, i) => `<i class="${i < stars ? 'on' : ''}" style="animation-delay:${i * 0.2}s">${ICON.star}</i>`).join('')}</div>
    <h1>${stars === 3 ? 'Excellent' : stars === 2 ? 'Well done' : 'Keep practising'}</h1>
    <p class="sub">${mistakes === 0 ? 'No mistakes.' : `${mistakes} ${mistakes === 1 ? 'mistake' : 'mistakes'}. Those terms will come back more often.`}</p>
    ${before !== after ? `<p class="badge">New rank: ${esc(after)}</p>` : ''}
    ${nowDone ? `<div class="spec-won"><span class="spec-art">${SPECIMEN_ART[L.specimen]}</span><span><b>New specimen: ${esc(sp[0])}</b><br>${esc(sp[1])}</span></div>` : ''}
    ${nowDone && nextLid ? `<p class="sub">Unlocked: ${esc(LESSONS[nextLid].title)}</p>` : ''}
    <div class="row">
      <button class="btn" id="again-game">Play again</button>
      <button class="btn primary" id="to-lesson">Back to lesson</button>
    </div>
  </main>`, () => {
    wire();
    fx('star');
    $('#again-game').addEventListener('click', () => RUN[gid](lid));
    $('#to-lesson').addEventListener('click', () => proLesson(lid));
  });
}

// ---------- 1. Study cards ----------
function gStudy(lid) {
  const ids = LESSONS[lid].wordIds;
  let i = 0;
  show(frame('study', `
    <article class="study-card" id="card"></article>
    <div class="row"><button class="btn" id="prev">${ICON.back}<span>Previous</span></button><button class="btn primary" id="next"><span>Next</span>${ICON.next}</button></div>`), () => {
    wire(() => proLesson(lid));
    const render = () => {
      const w = WORDS[ids[i]]; const pic = pictureFor(w.id);
      dotsAt(i, ids.length);
      const today = w.note.startsWith('Today:');
      $('#card').innerHTML = `
        <div class="study-text">
          <p class="eyebrow">Term ${i + 1} of ${ids.length}</p>
          <h2 class="term"><button class="term-btn" id="sayterm">${ICON.speaker}<span>${esc(w.word)}</span></button></h2>
          <p class="definition">${esc(w.def)}</p>
          ${w.note ? `<p class="note ${today ? 'today' : ''}"><b>${today ? 'Science today' : 'From the book'}</b> ${esc(today ? w.note.replace(/^Today:\s*/, '') : w.note)}</p>` : ''}
          ${speakBtn('saydef', 'Read the definition aloud')}
        </div>
        ${pic ? `<figure class="study-pic ${pic.kind}">${pic.html}</figure>` : ''}`;
      $('#sayterm').onclick = () => say(w.word);
      $('#saydef').onclick = () => say(`${w.word}. ${w.def}`);
      $('#prev').disabled = i === 0;
      $('#next span').textContent = i === ids.length - 1 ? 'Finish' : 'Next';
      store.markSeen(w.id);
      say(w.word);
    };
    $('#prev').onclick = () => { if (i > 0) { i--; render(); } };
    $('#next').onclick = () => { if (i < ids.length - 1) { i++; render(); } else finish(lid, 'study', 0); };
    current.keys = (e) => { if (e.key === 'ArrowRight') $('#next')?.click(); if (e.key === 'ArrowLeft') $('#prev')?.click(); };
    render();
  });
}
const current = { keys: null };
document.addEventListener('keydown', (e) => { if (document.body.classList.contains('pro') && $('.study-card')) current.keys?.(e); });

// Shared multiple-choice runner.
function mcq({ lid, gid, rounds, build }) {
  const queue = rounds.slice();
  const requeued = new Set();
  let i = 0; let mistakes = 0;
  show(frame(gid, `<div class="mcq" id="mcq"></div>`), () => {
    wire(() => proLesson(lid));
    const round = () => {
      if (i >= queue.length) return finish(lid, gid, mistakes);
      dotsAt(i, queue.length);
      const r = build(queue[i]);
      const box = $('#mcq');
      box.dataset.answer = r.answer;
      box.innerHTML = `
        <div class="prompt-card"><div class="prompt-body">${r.promptHtml}</div>${speakBtn('sayq')}</div>
        <div class="options">${r.options.map((o) => `<button class="option" data-v="${esc(o.v)}">${o.html}</button>`).join('')}</div>
        <div class="explain" id="explain" hidden></div>`;
      $('#sayq').onclick = () => say(r.speak);
      let locked = false;
      box.querySelectorAll('.option').forEach((b) => b.addEventListener('click', () => {
        if (locked) return; locked = true;
        const ok = b.dataset.v === r.answer;
        r.grade(ok);
        box.querySelectorAll('.option').forEach((x) => { x.disabled = true; if (x.dataset.v === r.answer) x.classList.add('right'); });
        if (!ok) {
          b.classList.add('wrong'); mistakes++; fx('wrong');
          const key = queue[i];
          if (!requeued.has(key)) { requeued.add(key); queue.push(key); }
        } else fx('right');
        const ex = $('#explain');
        ex.hidden = false;
        ex.innerHTML = `<p><b>${ok ? 'Correct.' : 'Not quite.'}</b> ${r.explain}</p><button class="btn primary" id="go-next">Next ${ICON.next}</button>`;
        $('#go-next').focus({ preventScroll: true });
        $('#go-next').onclick = () => { i++; round(); };
      }));
    };
    round();
  });
}

// ---------- 2. Definitions ----------
function gDefine(lid) {
  const own = LESSONS[lid].wordIds;
  const review = store.reviewWords(lid, 3);
  const rounds = shuffle([...own, ...review]).map((id, k) => ({ id, flip: k % 3 === 2 }));
  mcq({
    lid, gid: 'define', rounds,
    build: ({ id, flip }) => {
      const w = WORDS[id];
      const sameLesson = LESSONS[w.lesson].wordIds.filter((x) => x !== id);
      const pool = shuffle(sameLesson).slice(0, 3);
      const opts = shuffle([id, ...pool]);
      if (!flip) {
        return {
          answer: id,
          promptHtml: `<p class="eyebrow">Which term matches this definition?</p><p class="prompt">${esc(w.def)}</p>`,
          speak: w.def,
          options: opts.map((o) => ({ v: o, html: `<span class="opt-term">${esc(WORDS[o].word)}</span>` })),
          grade: (ok) => store.grade('words', id, ok),
          explain: `<b>${esc(w.word)}</b>: ${esc(w.def)}`,
        };
      }
      return {
        answer: id,
        promptHtml: `<p class="eyebrow">Which definition matches this term?</p><p class="prompt term-prompt">${esc(w.word)}</p>`,
        speak: w.word,
        options: opts.map((o) => ({ v: o, html: `<span class="opt-def">${esc(WORDS[o].def)}</span>` })),
        grade: (ok) => store.grade('words', id, ok),
        explain: `<b>${esc(w.word)}</b>: ${esc(w.def)}`,
      };
    },
  });
}

// ---------- 3. Fill the gap ----------
function gCloze(lid) {
  const rounds = shuffle([...LESSONS[lid].clozeIds, ...store.reviewCloze(lid, 2)]);
  mcq({
    lid, gid: 'cloze', rounds,
    build: (cid) => {
      const c = CLOZES[cid]; const w = WORDS[c.answer];
      const others = shuffle(LESSONS[c.lesson].wordIds.filter((x) => x !== c.answer)).slice(0, 3);
      const filled = c.text.replace('___', w.word);
      return {
        answer: c.answer,
        promptHtml: `<p class="eyebrow">Complete the sentence</p><p class="prompt">${esc(c.text).replace('___', '<span class="gap">?</span>')}</p>`,
        speak: c.text.replace('___', 'blank'),
        options: shuffle([c.answer, ...others]).map((o) => ({ v: o, html: `<span class="opt-term">${esc(WORDS[o].word)}</span>` })),
        grade: (ok) => { store.grade('cloze', cid, ok); store.grade('words', c.answer, ok); },
        explain: esc(filled),
      };
    },
  });
}

// ---------- 4. True or false ----------
function gTF(lid) {
  const rounds = shuffle([...LESSONS[lid].factIds, ...store.reviewFacts(lid, 2)]);
  mcq({
    lid, gid: 'truefalse', rounds,
    build: (fid) => {
      const f = FACTS[fid];
      return {
        answer: String(f.truth),
        promptHtml: `<p class="eyebrow">True or false?${f.lesson !== lid ? ' · Review' : ''}</p><p class="prompt">${esc(f.text)}</p>`,
        speak: f.text,
        options: [{ v: 'true', html: `${ICON.yes}<span>True</span>` }, { v: 'false', html: `${ICON.no}<span>False</span>` }],
        grade: (ok) => store.grade('facts', fid, ok),
        explain: `${f.truth ? 'It is true.' : 'It is false.'} ${esc(f.why)} <span class="src">Book pages ${LESSONS[f.lesson].pages}</span>`,
      };
    },
  });
}

// ---------- 5. Sort and order ----------
function gSort(lid) {
  const task = LESSONS[lid].task;
  return task.type === 'order' ? gOrder(lid, task) : gBins(lid, task);
}
function gOrder(lid, task) {
  const items = task.items;
  let placed = 0; let mistakes = 0;
  show(frame('sort', `
    <p class="task-prompt">${esc(task.prompt)}</p>
    <ol class="slots" id="slots">${items.map((_, k) => `<li class="slot" data-k="${k}"><span class="num">${k + 1}</span><span class="txt"></span></li>`).join('')}</ol>
    <div class="chips" id="chips">${shuffle(items.map((t, k) => ({ t, k }))).map(({ t, k }) => `<button class="chip" data-k="${k}">${esc(t)}</button>`).join('')}</div>`), () => {
    wire(() => proLesson(lid));
    dotsAt(0, items.length);
    $('#chips').dataset.next = '0';
    app.querySelectorAll('.chip').forEach((b) => b.addEventListener('click', async () => {
      const k = Number(b.dataset.k);
      if (k === placed) {
        fx('right');
        const slot = app.querySelector(`.slot[data-k="${k}"]`);
        slot.querySelector('.txt').textContent = items[k]; slot.classList.add('filled');
        b.remove(); placed++;
        $('#chips').dataset.next = String(placed);
        dotsAt(placed, items.length);
        if (placed === items.length) { await wait(700); finish(lid, 'sort', mistakes); }
      } else {
        mistakes++; fx('wrong');
        b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong');
        toast(`Not yet. What comes at step ${placed + 1}?`);
      }
    }));
  });
}
function gBins(lid, task) {
  const bins = Object.keys(task.bins);
  const cards = shuffle(bins.flatMap((b) => task.bins[b].map((t) => ({ t, b }))));
  let i = 0; let mistakes = 0;
  show(frame('sort', `
    <p class="task-prompt">${esc(task.prompt)}</p>
    <div class="sort-card" id="sortcard"></div>
    <div class="bins" style="--n:${bins.length}">${bins.map((b) => `<button class="bin" data-b="${esc(b)}"><span class="bin-name">${esc(b)}</span><span class="bin-items"></span></button>`).join('')}</div>
    <div class="explain" id="explain" hidden></div>`), () => {
    wire(() => proLesson(lid));
    let locked = false;
    const round = () => {
      if (i >= cards.length) return finish(lid, 'sort', mistakes);
      dotsAt(i, cards.length);
      $('#sortcard').textContent = cards[i].t;
      $('#sortcard').dataset.bin = cards[i].b;
      locked = false;
    };
    app.querySelectorAll('.bin').forEach((btn) => btn.addEventListener('click', async () => {
      if (locked || i >= cards.length) return; locked = true;
      const c = cards[i];
      const ok = btn.dataset.b === c.b;
      const target = app.querySelector(`.bin[data-b="${CSS.escape(c.b)}"]`);
      const tag = document.createElement('span'); tag.textContent = c.t; target.querySelector('.bin-items').appendChild(tag);
      if (ok) { fx('right'); btn.classList.add('flash-right'); }
      else {
        mistakes++; fx('wrong'); btn.classList.add('flash-wrong'); target.classList.add('flash-right');
        toast(`"${c.t}" belongs in: ${c.b}`);
      }
      await wait(ok ? 450 : 1400);
      app.querySelectorAll('.bin').forEach((x) => x.classList.remove('flash-right', 'flash-wrong'));
      i++; round();
    }));
    round();
  });
}

// ---------- Collection ----------
function collection() {
  const have = new Set(earnedSpecimens());
  show(`
  ${bar({ back: true, title: 'Specimen collection' })}
  <main class="collection">
    <p class="book-tag">Finish every game in a lesson to add its specimen.</p>
    <div class="spec-grid">
      ${LESSON_ORDER.map((lid, n) => {
        const k = LESSONS[lid].specimen; const got = have.has(k); const sp = SPECIMENS[k];
        return `<figure class="spec ${got ? '' : 'missing'}"><span class="spec-art">${SPECIMEN_ART[k]}</span>
          <figcaption><b>${got ? esc(sp[0]) : 'Not found yet'}</b><span>${got ? esc(sp[1]) : `Lesson ${n + 1}: ${esc(LESSONS[lid].title)}`}</span></figcaption></figure>`;
      }).join('')}
    </div>
  </main>`, () => wire(() => proHome()));
}

// ---------- Settings ----------
function settings() {
  const s = store.state();
  show(`
  ${bar({ back: true, title: 'For teachers and parents' })}
  <main class="grown">
    <section>
      <h2>About the Geologist level</h2>
      <p>This level covers the whole book <em>The Earth</em>, pages 4 to 32, in 4 units and 15 lessons. It has ${Object.keys(WORDS).length} terms, ${Object.keys(FACTS).length} true-or-false statements and ${Object.keys(CLOZES).length} fill-the-gap sentences.</p>
      <p>The book is from the 1980s. Where science has changed, the study card adds a <b>Science today</b> note, for example on the age of the earth and the dates of the geological periods. The quizzes only use statements that are still correct.</p>
      <p>Terms the student gets wrong come back more often, and terms from earlier lessons are mixed into later ones.</p>
      <p>Everything stays on this device. The app has no ads, no outside links, and sends no data anywhere.</p>
      <p class="muted">${esc(voiceInfo())}</p>
    </section>
    <section>
      <h2>Settings</h2>
      <label class="toggle"><input type="checkbox" id="unlock" ${s.unlockAll ? 'checked' : ''}> Open all lessons</label>
      <div class="danger">
        <button class="btn" id="reset">Delete Geologist progress</button>
        <div id="confirm" hidden><p>Delete all Geologist stars, rank and specimens? This cannot be undone.</p>
          <div class="row"><button class="btn no" id="yes-reset">Yes, delete</button><button class="btn" id="no-reset">Keep it</button></div></div>
      </div>
    </section>
  </main>`, () => {
    wire(() => proHome());
    $('#unlock').addEventListener('change', (e) => { s.unlockAll = e.target.checked; store.save(); });
    $('#reset').addEventListener('click', () => { $('#confirm').hidden = false; });
    $('#no-reset').addEventListener('click', () => { $('#confirm').hidden = true; });
    $('#yes-reset').addEventListener('click', () => { store.reset(); proHome(); });
  });
}
