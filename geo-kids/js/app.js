import { UNITS, LESSONS, LESSON_ORDER, GAMES, WORDS, FACTS } from './data.js';
import { iconFor, petSvg } from './icons.js';
import { LETTERS } from './letters.js';
import { say, stopTalking, voiceInfo, initAudio, setMusicLevel, fx, resumeAudio } from './sound.js';
import { createStore } from './store.js';

const store = createStore('earthExplorers.v1', { LESSONS, LESSON_ORDER, GAMES });

export const $ = (sel, root = document) => root.querySelector(sel);
export const app = $('#app');
export const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
export const wait = (ms) => new Promise((r) => setTimeout(r, ms));
export const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export const ICON = {
  star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z"/></svg>',
  speaker: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 8.5a5 5 0 010 7M18.5 6a8.5 8.5 0 010 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  next: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3" fill="none" stroke="currentColor" stroke-width="2.5"/></svg>',
  yes: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  no: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/></svg>',
  music: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V5l11-2v13" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="6.5" cy="18" r="2.8"/><circle cx="17.5" cy="16" r="2.8"/></svg>',
  minus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h12" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/></svg>',
  plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h12M12 6v12" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/></svg>',
  replay: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12a7 7 0 107-7H8" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><path d="M10 2L7 5l3 3" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};
const GAME_ICON = {
  cards: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="6" y="10" width="26" height="32" rx="4" fill="#f2e3c4"/><rect x="16" y="6" width="26" height="32" rx="4" fill="#fff" stroke="#3f8f86" stroke-width="2.5"/><circle cx="29" cy="18" r="5" fill="#e59a4c"/><path d="M21 30h16" stroke="#3f8f86" stroke-width="3" stroke-linecap="round"/></svg>',
  listen: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M30 38c0-6 8-8 8-18a14 14 0 10-28 0" fill="none" stroke="#3f8f86" stroke-width="4" stroke-linecap="round"/><path d="M18 20a6 6 0 0112 0c0 5-6 6-6 11" fill="none" stroke="#e59a4c" stroke-width="4" stroke-linecap="round"/></svg>',
  match: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="4" y="12" width="16" height="22" rx="3" fill="#9fd3c7"/><rect x="28" y="12" width="16" height="22" rx="3" fill="#f2e3c4"/><path d="M20 23h8" stroke="#3f8f86" stroke-width="4" stroke-linecap="round"/></svg>',
  truefalse: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="15" cy="24" r="11" fill="#5aa36f"/><path d="M10 24l4 4 7-8" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="34" cy="24" r="11" fill="#d97a6a"/><path d="M30 20l8 8M38 20l-8 8" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/></svg>',
  trace: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M4 12h40M4 24h40M4 36h40" stroke="#c9d6d2" stroke-width="2"/><path d="M30 26a7 7 0 10 0 1V36" fill="none" stroke="#3f8f86" stroke-width="4" stroke-linecap="round"/><circle cx="30" cy="25" r="3" fill="#e59a4c"/></svg>',
};

// ---------- Screens ----------
let current = null; // {cleanup}
export function show(html, after) {
  stopTalking();
  current?.cleanup?.();
  current = null;
  app.innerHTML = html;
  app.scrollTop = 0;
  window.scrollTo(0, 0);
  after?.();
}

export function topBar(opts = {}, st = store) {
  const s = st.state();
  return `
  <header class="bar">
    ${opts.back ? `<button class="round" id="back" aria-label="Back">${ICON.back}</button>` : `<span class="brand">${opts.brand || 'Earth Explorers'}</span>`}
    ${opts.title ? `<h1 class="bar-title">${esc(opts.title)}</h1>` : '<span class="grow"></span>'}
    <div class="stars-pill" aria-label="${s.stars} stars">${ICON.star}<b>${s.stars}</b></div>
    <div class="music" role="group" aria-label="Music volume">
      <button class="round small" id="vol-down" aria-label="Music quieter">${ICON.minus}</button>
      <span class="vol" aria-hidden="true">${ICON.music}<i class="lvl">${'<em></em>'.repeat(5)}</i></span>
      <button class="round small" id="vol-up" aria-label="Music louder">${ICON.plus}</button>
    </div>
  </header>`;
}
export function wireBar(onBack, st = store) {
  $('#back')?.addEventListener('click', () => { fx('tap'); onBack(); });
  const paint = () => [...app.querySelectorAll('.lvl em')].forEach((e, i) => e.classList.toggle('on', i < st.state().music));
  $('#vol-down')?.addEventListener('click', () => { st.state().music = setMusicLevel(st.state().music - 1); st.save(); paint(); });
  $('#vol-up')?.addEventListener('click', () => { st.state().music = setMusicLevel(st.state().music + 1); st.save(); paint(); });
  paint();
}

export function starRow(n, max = 3) {
  return `<span class="mini-stars" aria-label="${n} of ${max} stars">${Array.from({ length: max }, (_, i) => `<i class="${i < n ? 'on' : ''}">${ICON.star}</i>`).join('')}</span>`;
}

// ---------- Start ----------
export function startScreen() {
  document.body.classList.remove('pro');
  show(`
  <main class="start">
    <div class="pet big">${petSvg(store.petStage())}</div>
    <h1>Earth Explorers</h1>
    <p class="sub">Rocks, volcanoes, and the inside of our planet</p>
    <div class="levels">
      <button class="btn primary huge" id="go">Explorer<small>Ages 5 to 10</small></button>
      <button class="btn huge level-pro" id="go-pro">Geologist<small>Ages 12 and up</small></button>
    </div>
  </main>`, () => {
    const begin = () => { initAudio(store.state().music); resumeAudio(); };
    $('#go').addEventListener('click', () => {
      begin();
      document.body.classList.remove('pro');
      try { localStorage.setItem('earthExplorers.level', 'kids'); } catch { /* ignore */ }
      home(true);
    });
    $('#go-pro').addEventListener('click', async () => {
      begin();
      try { localStorage.setItem('earthExplorers.level', 'pro'); } catch { /* ignore */ }
      const m = await import('./pro.js');
      m.proHome(true);
    });
  });
}

// ---------- Home: units and lessons ----------
function home(greet) {
  const s = store.state();
  const stage = store.petStage();
  const nextAt = store.PET_STEPS[stage + 1];
  show(`
  ${topBar()}
  <main class="home">
    <section class="pet-card">
      <button class="pet" id="pet" aria-label="Your dinosaur">${petSvg(stage)}</button>
      <div>
        <p class="pet-name">Pebble the dinosaur</p>
        <p class="pet-msg">${nextAt ? `${nextAt - s.stars} more stars to grow!` : 'Pebble is all grown up!'}</p>
      </div>
    </section>
    ${UNITS.map((u) => `
      <section class="unit">
        <h2>${esc(u.title)} <span class="pages">Book pages ${u.pages}</span></h2>
        <div class="lessons">
          ${u.lessons.map((lid) => {
            const L = LESSONS[lid];
            const open = store.lessonOpen(lid);
            const n = LESSON_ORDER.indexOf(lid) + 1;
            const done = GAMES.filter((g) => store.gameStars(lid, g.id) > 0).length;
            return `<button class="lesson ${open ? '' : 'locked'} ${store.lessonDone(lid) ? 'done' : ''}" data-lid="${lid}">
              <span class="lesson-pic">${open ? iconFor(L.wordIds[0]) : ICON.lock}</span>
              <span class="lesson-num">Lesson ${n}</span>
              <span class="lesson-title">${esc(L.title)}</span>
              <span class="lesson-pages">Book pages ${L.pages}</span>
              <span class="progress" aria-label="${done} of 5 games played"><i style="width:${done * 20}%"></i></span>
            </button>`;
          }).join('')}
        </div>
      </section>`).join('')}
    <div class="foot-links"><button class="link" id="level">Change level</button><button class="link" id="grown">For grown-ups</button></div>
  </main>`, () => {
    wireBar();
    $('#pet').addEventListener('click', () => { fx('star'); say(nextAt ? `Hi! I am Pebble. Win ${nextAt - s.stars} more stars and I will grow!` : 'Hi! I am Pebble. Thank you for all the stars!'); });
    app.querySelectorAll('.lesson').forEach((b) => b.addEventListener('click', () => {
      const lid = b.dataset.lid;
      if (!store.lessonOpen(lid)) { fx('wrong'); say('This lesson is locked. Finish the lesson before it first.'); return; }
      fx('tap');
      lesson(lid);
    }));
    $('#grown').addEventListener('click', grownUps);
    $('#level').addEventListener('click', startScreen);
    if (greet) say('Welcome, explorer! Pick a lesson.');
  });
}

// ---------- Lesson: five games ----------
function lesson(lid) {
  const L = LESSONS[lid];
  show(`
  ${topBar({ back: true, title: L.title })}
  <main class="lesson-screen">
    <p class="book-tag">Book pages ${L.pages}</p>
    <div class="games">
      ${GAMES.map((g, i) => `
        <button class="game" data-gid="${g.id}">
          <span class="game-icon">${GAME_ICON[g.id]}</span>
          <span class="game-name">${i + 1}. ${esc(g.name)}</span>
          ${starRow(store.gameStars(lid, g.id))}
        </button>`).join('')}
    </div>
  </main>`, () => {
    wireBar(() => home());
    say(`${L.title}. Pick a game.`);
    app.querySelectorAll('.game').forEach((b) => b.addEventListener('click', () => {
      fx('tap');
      const g = b.dataset.gid;
      ({ cards: gameCards, listen: gameListen, match: gameMatch, truefalse: gameTrueFalse, trace: gameTrace })[g](lid);
    }));
  });
}

function gameFrame(lid, gid, inner) {
  const g = GAMES.find((x) => x.id === gid);
  return `${topBar({ back: true, title: g.name })}
  <main class="play" data-game="${gid}">
    <div class="play-head">
      <button class="round speak" id="again" aria-label="Hear it again">${ICON.speaker}</button>
      <div class="dots" id="dots"></div>
    </div>
    ${inner}
  </main>`;
}
const paintDots = (i, n) => { const d = $('#dots'); if (d) d.innerHTML = Array.from({ length: n }, (_, k) => `<i class="${k < i ? 'done' : k === i ? 'now' : ''}"></i>`).join(''); };

function finish(lid, gid, mistakes, perfectAt = 1, okAt = 3) {
  const stars = mistakes <= perfectAt ? 3 : mistakes <= okAt ? 2 : 1;
  const before = store.petStage();
  const wasDone = store.lessonDone(lid);
  store.addStars(lid, gid, stars);
  const grew = store.petStage() > before;
  const nowDone = !wasDone && store.lessonDone(lid);
  const nextLid = LESSON_ORDER[LESSON_ORDER.indexOf(lid) + 1];
  show(`
  ${topBar()}
  <main class="win">
    <div class="win-stars">${Array.from({ length: 3 }, (_, i) => `<i class="${i < stars ? 'on' : ''}" style="animation-delay:${i * 0.25}s">${ICON.star}</i>`).join('')}</div>
    <div class="pet big ${grew ? 'grow' : 'hop'}">${petSvg(store.petStage())}</div>
    <h1>${stars === 3 ? 'Super!' : stars === 2 ? 'Great job!' : 'Good try!'}</h1>
    ${grew ? '<p class="sub">Pebble grew bigger!</p>' : ''}
    ${nowDone && nextLid ? `<p class="sub">You opened the next lesson: ${esc(LESSONS[nextLid].title)}!</p>` : ''}
    <div class="row">
      <button class="btn" id="again-game">Play again</button>
      <button class="btn primary" id="to-lesson">More games</button>
    </div>
  </main>`, () => {
    wireBar();
    fx('star');
    let msg = `${stars === 3 ? 'Super!' : stars === 2 ? 'Great job!' : 'Good try!'} You won ${stars} ${stars === 1 ? 'star' : 'stars'}.`;
    if (grew) msg += ' Look! Pebble grew bigger!';
    if (nowDone && nextLid) msg += ` You opened a new lesson: ${LESSONS[nextLid].title}.`;
    say(msg);
    $('#again-game').addEventListener('click', () => ({ cards: gameCards, listen: gameListen, match: gameMatch, truefalse: gameTrueFalse, trace: gameTrace })[gid](lid));
    $('#to-lesson').addEventListener('click', () => lesson(lid));
  });
}

// ---------- Game 1: Word cards ----------
function gameCards(lid) {
  const ids = LESSONS[lid].wordIds;
  let i = 0;
  show(gameFrame(lid, 'cards', `
    <div class="card-view">
      <div class="word-card" id="card"></div>
      <div class="row">
        <button class="round big-nav" id="prev" aria-label="Back">${ICON.back}</button>
        <button class="round big-nav go" id="next" aria-label="Next">${ICON.next}</button>
      </div>
    </div>`), () => {
    wireBar(() => lesson(lid));
    const render = () => {
      const w = WORDS[ids[i]];
      paintDots(i, ids.length);
      $('#card').innerHTML = `
        <div class="card-pic">${iconFor(w.id)}</div>
        <button class="card-word" id="sayword">${ICON.speaker}<span>${esc(w.word)}</span></button>
        <button class="card-def" id="saydef">${esc(w.def)}</button>`;
      $('#sayword').onclick = () => say(w.word);
      $('#saydef').onclick = () => say(w.def);
      $('#prev').disabled = i === 0;
      store.markSeen(w.id);
      say(`${w.word}. ${w.def}`);
    };
    $('#again').onclick = () => { const w = WORDS[ids[i]]; say(`${w.word}. ${w.def}`); };
    $('#prev').onclick = () => { if (i > 0) { i--; fx('tap'); render(); } };
    $('#next').onclick = () => { fx('tap'); if (i < ids.length - 1) { i++; render(); } else finish(lid, 'cards', 0); };
    render();
  });
}

// ---------- Game 2: Listen and find ----------
function gameListen(lid) {
  const own = LESSONS[lid].wordIds;
  const review = store.reviewWords(lid, 3);
  const queue = shuffle([...own, ...review]);
  const pool = [...own, ...review];
  const requeued = new Set();
  let i = 0;
  let mistakes = 0;
  let total = queue.length;
  show(gameFrame(lid, 'listen', `<div class="choices three" id="choices"></div>`), () => {
    wireBar(() => lesson(lid));
    let busy = false;
    const round = () => {
      if (i >= queue.length) return finish(lid, 'listen', mistakes);
      const target = queue[i];
      const others = shuffle(pool.filter((x) => x !== target)).slice(0, 2);
      const opts = shuffle([target, ...others]);
      paintDots(i, total);
      const box = $('#choices');
      box.dataset.target = target;
      box.innerHTML = opts.map((id) => `<button class="pic" data-id="${id}" aria-label="${esc(WORDS[id].word)}">${iconFor(id)}</button>`).join('');
      const prompt = () => say(`Find: ${WORDS[target].word}.`);
      $('#again').onclick = prompt;
      prompt();
      busy = false;
      box.querySelectorAll('.pic').forEach((b) => b.addEventListener('click', async () => {
        if (busy) return;
        busy = true;
        const ok = b.dataset.id === target;
        store.grade('words', target, ok);
        if (ok) {
          b.classList.add('right'); fx('right');
          await say(`Yes! ${WORDS[target].word}.`);
        } else {
          mistakes++;
          b.classList.add('wrong'); fx('wrong');
          box.querySelector(`[data-id="${CSS.escape(target)}"]`).classList.add('right');
          if (!requeued.has(target)) { requeued.add(target); queue.push(target); total++; }
          await say(`This one is ${WORDS[target].word}.`);
        }
        await wait(300);
        i++;
        round();
      }));
    };
    round();
  });
}

// ---------- Game 3: Match picture and word ----------
function gameMatch(lid) {
  const own = LESSONS[lid].wordIds;
  const review = store.reviewWords(lid, 1);
  const ids = shuffle([...store.weakest(own, 4 - review.length), ...review]);
  let mistakes = 0;
  let matched = 0;
  show(gameFrame(lid, 'match', `
    <div class="match">
      <div class="col" id="pics">${shuffle(ids).map((id) => `<button class="pic sm" data-id="${id}" aria-label="picture">${iconFor(id)}</button>`).join('')}</div>
      <div class="col" id="words">${shuffle(ids).map((id) => `<button class="word-chip" data-id="${id}">${esc(WORDS[id].word)}</button>`).join('')}</div>
    </div>`), () => {
    wireBar(() => lesson(lid));
    const intro = () => say('Tap a picture. Then tap its word.');
    $('#again').onclick = intro;
    intro();
    paintDots(0, ids.length);
    let pick = null;
    const choose = async (b) => {
      if (b.classList.contains('locked')) return;
      const isPic = b.classList.contains('pic');
      if (!pick || pick.classList.contains('pic') === isPic) {
        pick?.classList.remove('sel');
        pick = b; b.classList.add('sel'); fx('tap');
        if (!isPic) say(WORDS[b.dataset.id].word);
        return;
      }
      const a = pick; pick = null; a.classList.remove('sel');
      const picBtn = isPic ? b : a;
      if (a.dataset.id === b.dataset.id) {
        a.classList.add('locked', 'right'); b.classList.add('locked', 'right');
        fx('right'); matched++;
        store.grade('words', a.dataset.id, true);
        paintDots(matched, ids.length);
        await say(WORDS[a.dataset.id].word);
        if (matched === ids.length) { await wait(300); finish(lid, 'match', mistakes); }
      } else {
        mistakes++;
        store.grade('words', picBtn.dataset.id, false);
        a.classList.add('wrong'); b.classList.add('wrong'); fx('wrong');
        setTimeout(() => { a.classList.remove('wrong'); b.classList.remove('wrong'); }, 600);
        say('Not this one. Try again.');
      }
    };
    app.querySelectorAll('.match button').forEach((b) => b.addEventListener('click', () => choose(b)));
  });
}

// ---------- Game 4: True or false ----------
const THE = new Set(['earth', 'sun', 'atmosphere', 'crust', 'mantle', 'core', 'Red Sea']);
const BARE = new Set(['sand', 'mud', 'iron', 'solid', 'liquid', 'erosion', 'geology', 'pressure', 'drift', 'magma', 'chalk', 'granite', 'quartz', 'sandstone', 'igneous rock', 'metamorphic rock', 'Arabia']);
function withArticle(w) {
  if (THE.has(w)) return `the ${w}`;
  if (BARE.has(w)) return w;
  return `${/^[aeiou]/i.test(w) ? 'an' : 'a'} ${w}`;
}
function factIcon(f) {
  const L = LESSONS[f.lesson];
  const hit = L.wordIds.find((id) => f.text.toLowerCase().includes(WORDS[id].word.toLowerCase()));
  return hit || L.wordIds[0];
}
function gameTrueFalse(lid) {
  const items = LESSONS[lid].factIds.map((id) => ({ kind: 'fact', id }));
  store.reviewFacts(lid, 1).forEach((id) => items.push({ kind: 'fact', id }));
  // Old words come back as "Is this a ...?" questions.
  const old = store.reviewWords(lid, 2);
  old.forEach((id) => {
    const truth = Math.random() < 0.5;
    const others = LESSON_ORDER.flatMap((l) => LESSONS[l].wordIds).filter((x) => x !== id);
    const shown = truth ? id : shuffle(others)[0];
    items.push({ kind: 'word', id, shown, truth });
  });
  const list = shuffle(items);
  let i = 0;
  let mistakes = 0;
  show(gameFrame(lid, 'truefalse', `
    <div class="tf">
      <div class="tf-pic" id="tfpic"></div>
      <button class="tf-text" id="tftext"></button>
      <div class="row">
        <button class="btn yes" id="yes">${ICON.yes}<span>True</span></button>
        <button class="btn no" id="no">${ICON.no}<span>False</span></button>
      </div>
    </div>`), () => {
    wireBar(() => lesson(lid));
    let busy = false;
    const round = () => {
      if (i >= list.length) return finish(lid, 'truefalse', mistakes, 0, 2);
      const it = list[i];
      paintDots(i, list.length);
      let text; let truth; let fix;
      if (it.kind === 'fact') {
        const f = FACTS[it.id];
        text = f.text; truth = f.truth; fix = f.fix;
        $('#tfpic').innerHTML = iconFor(factIcon(f));
      } else {
        const w = WORDS[it.id];
        text = `Is this ${withArticle(w.word)}?`;
        truth = it.truth;
        fix = truth ? '' : `No! This is ${withArticle(WORDS[it.shown].word)}.`;
        $('#tfpic').innerHTML = iconFor(it.shown);
      }
      $('.tf').dataset.truth = String(truth);
      const isQuestion = it.kind === 'word';
      $('#yes span').textContent = isQuestion ? 'Yes' : 'True';
      $('#no span').textContent = isQuestion ? 'No' : 'False';
      $('#tftext').textContent = text;
      const prompt = () => say(text);
      $('#tftext').onclick = prompt;
      $('#again').onclick = prompt;
      prompt();
      busy = false;
      const answer = async (said) => {
        if (busy) return;
        busy = true;
        const ok = said === truth;
        store.grade(it.kind === 'fact' ? 'facts' : 'words', it.id, ok);
        const btn = said ? $('#yes') : $('#no');
        btn.classList.add(ok ? 'right' : 'wrong');
        fx(ok ? 'right' : 'wrong');
        if (!ok) mistakes++;
        const explain = truth ? (ok ? 'Yes, that is true!' : 'It is true!') : (ok ? `Right! ${fix}` : fix);
        await say(explain);
        await wait(250);
        btn.classList.remove('right', 'wrong');
        i++;
        round();
      };
      $('#yes').onclick = () => answer(true);
      $('#no').onclick = () => answer(false);
    };
    round();
  });
}

// ---------- Game 5: Trace the letter ----------
function gameTrace(lid) {
  const own = LESSONS[lid].wordIds;
  const review = store.reviewWords(lid, 1);
  const seen = new Set();
  const picks = [];
  for (const id of [...shuffle(own), ...review]) {
    const ch = WORDS[id].word[0].toLowerCase();
    if (!LETTERS[ch] || (seen.has(ch) && picks.length >= 2)) continue;
    seen.add(ch); picks.push(id);
    if (picks.length === 3 + Math.min(1, review.length)) break;
  }
  let i = 0;
  let mistakes = 0;
  show(gameFrame(lid, 'trace', `
    <div class="trace">
      <div class="trace-word" id="tword"></div>
      <div class="trace-box" id="tbox"></div>
    </div>`), () => {
    wireBar(() => lesson(lid));
    let tracer = null;
    current = { cleanup: () => tracer?.destroy() };
    const round = () => {
      tracer?.destroy();
      if (i >= picks.length) return finish(lid, 'trace', mistakes, 2, 5);
      paintDots(i, picks.length);
      const w = WORDS[picks[i]];
      const ch = w.word[0].toLowerCase();
      $('#tword').innerHTML = `<span class="tw-pic">${iconFor(w.id)}</span><span class="tw-text"><b>${esc(w.word[0])}</b>${esc(w.word.slice(1))}</span>`;
      const prompt = () => say(`Trace the letter ${ch}. ${ch}, for ${w.word}. Start at the green dot.`);
      $('#again').onclick = prompt;
      prompt();
      tracer = makeTracer($('#tbox'), ch, {
        onMiss: () => { mistakes++; fx('wrong'); say('Oops! Start again at the green dot.'); },
        onStroke: () => fx('tap'),
        onDone: async () => {
          fx('right');
          store.grade('words', w.id, true);
          await say(`Well done! ${ch}, for ${w.word}.`);
          await wait(300);
          i++;
          round();
        },
      });
    };
    round();
  });
}

function makeTracer(host, ch, cb) {
  const strokes = LETTERS[ch];
  const NS = 'http://www.w3.org/2000/svg';
  host.innerHTML = `
  <svg class="lines" viewBox="-12 -18 124 184" role="img" aria-label="Trace the letter ${ch}">
    <line x1="-12" x2="112" y1="0" y2="0" class="l-top"/>
    <line x1="-12" x2="112" y1="50" y2="50" class="l-mid"/>
    <line x1="-12" x2="112" y1="100" y2="100" class="l-base"/>
    <line x1="-12" x2="112" y1="150" y2="150" class="l-tail"/>
    <g class="ghost">${strokes.map((d) => `<path d="${d}"/>`).join('')}</g>
    <g class="inked"></g>
    <path class="progress-ink" d=""/>
    <g class="start-mark"><circle r="9"/><text dy="4.5"></text></g>
    <path class="arrow" d=""/>
  </svg>`;
  const svgEl = host.querySelector('svg');
  const inked = svgEl.querySelector('.inked');
  const prog = svgEl.querySelector('.progress-ink');
  const mark = svgEl.querySelector('.start-mark');
  const arrow = svgEl.querySelector('.arrow');
  const measure = document.createElementNS(NS, 'path');
  measure.setAttribute('class', 'measure');
  svgEl.appendChild(measure);

  const TOL = 17; const FAIL = 30;
  let s = 0; let samples = []; let len = 0; let idx = 0; let active = false; let dead = false;

  function load() {
    const d = strokes[s];
    measure.setAttribute('d', d);
    prog.setAttribute('d', d);
    len = measure.getTotalLength();
    samples = [];
    const step = 2;
    for (let t = 0; t <= len; t += step) { const p = measure.getPointAtLength(t); samples.push([p.x, p.y, t]); }
    const e = measure.getPointAtLength(len); samples.push([e.x, e.y, len]);
    idx = 0;
    prog.style.strokeDasharray = `${len} ${len + 10}`;
    prog.style.strokeDashoffset = `${len}`;
    const [x, y] = samples[0];
    mark.setAttribute('transform', `translate(${x} ${y})`);
    mark.querySelector('text').textContent = String(s + 1);
    // little arrow showing direction
    const a = measure.getPointAtLength(Math.min(len, 14));
    const b = measure.getPointAtLength(Math.min(len, 26));
    if (len > 20) {
      const ang = Math.atan2(b.y - a.y, b.x - a.x);
      const hx = b.x; const hy = b.y;
      arrow.setAttribute('d', `M${a.x},${a.y} L${hx},${hy} M${hx - 7 * Math.cos(ang - 0.5)},${hy - 7 * Math.sin(ang - 0.5)} L${hx},${hy} L${hx - 7 * Math.cos(ang + 0.5)},${hy - 7 * Math.sin(ang + 0.5)}`);
    } else arrow.setAttribute('d', '');
    svgEl.dataset.stroke = String(s);
  }
  const paint = () => { prog.style.strokeDashoffset = `${len - samples[idx][2]}`; };
  function toSvg(e) {
    const pt = svgEl.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
    const m = svgEl.getScreenCTM(); if (!m) return [0, 0];
    const r = pt.matrixTransform(m.inverse()); return [r.x, r.y];
  }
  const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);

  function completeStroke() {
    active = false;
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', strokes[s]); inked.appendChild(p);
    s++;
    if (s >= strokes.length) {
      dead = true; prog.setAttribute('d', ''); mark.style.display = 'none'; arrow.setAttribute('d', '');
      svgEl.classList.add('finished');
      cb.onDone();
    } else { cb.onStroke(); load(); }
  }
  function miss() {
    active = false; idx = 0; paint();
    svgEl.classList.remove('shake'); void svgEl.getBoundingClientRect(); svgEl.classList.add('shake');
    cb.onMiss();
  }
  function down(e) {
    if (dead) return;
    e.preventDefault();
    const p = toSvg(e);
    if (len < 6) { if (dist(p, samples[0]) <= TOL + 4) completeStroke(); return; }
    if (dist(p, samples[idx]) <= TOL + 4) { active = true; svgEl.setPointerCapture?.(e.pointerId); }
    else if (idx === 0) { mark.classList.remove('pulse'); void mark.getBoundingClientRect(); mark.classList.add('pulse'); }
  }
  function move(e) {
    if (!active || dead) return;
    e.preventDefault();
    const p = toSvg(e);
    let best = -1; let bestD = Infinity;
    const hi = Math.min(samples.length - 1, idx + 14);
    for (let j = Math.max(0, idx - 4); j <= hi; j++) { const d = dist(p, samples[j]); if (d < bestD) { bestD = d; best = j; } }
    if (bestD > FAIL) return miss();
    if (bestD <= TOL && best > idx) { idx = best; paint(); }
    if (idx >= samples.length - 3) completeStroke();
  }
  function up() { active = false; }
  svgEl.addEventListener('pointerdown', down);
  svgEl.addEventListener('pointermove', move);
  svgEl.addEventListener('pointerup', up);
  svgEl.addEventListener('pointercancel', up);
  load();
  return { destroy() { dead = true; host.innerHTML = ''; } };
}

// ---------- Grown-ups panel ----------
function grownUps() {
  const s = store.state();
  show(`
  ${topBar({ back: true, title: 'For grown-ups' })}
  <main class="grown">
    <section>
      <h2>About this app</h2>
      <p>Words and facts come from the book <em>The Earth</em>, pages 4 to 19. Each lesson shows its book pages. Lessons open in order: finish all five games to open the next one.</p>
      <p>Words the child gets wrong come back more often, in this lesson and in later lessons.</p>
      <p>Everything stays on this device. The app has no ads, no outside links, and sends no data anywhere. It works without internet once it has been opened one time.</p>
      <p class="muted" id="voice">${esc(voiceInfo())}</p>
    </section>
    <section>
      <h2>Settings</h2>
      <label class="toggle"><input type="checkbox" id="unlock" ${s.unlockAll ? 'checked' : ''}> Open all lessons (for testing)</label>
      <div class="danger">
        <button class="btn" id="reset">Delete all progress</button>
        <div id="confirm" hidden>
          <p>Delete all stars and progress? This cannot be undone.</p>
          <div class="row"><button class="btn no" id="yes-reset">Yes, delete</button><button class="btn" id="no-reset">Keep it</button></div>
        </div>
      </div>
    </section>
  </main>`, () => {
    wireBar(() => home());
    setTimeout(() => { const v = $('#voice'); if (v) v.textContent = voiceInfo(); }, 800);
    $('#unlock').addEventListener('change', (e) => { s.unlockAll = e.target.checked; store.save(); });
    $('#reset').addEventListener('click', () => { $('#confirm').hidden = false; });
    $('#no-reset').addEventListener('click', () => { $('#confirm').hidden = true; });
    $('#yes-reset').addEventListener('click', () => { store.reset(); home(); });
  });
}

startScreen();

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
