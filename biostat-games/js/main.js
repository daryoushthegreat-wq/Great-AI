'use strict';
// App shell: home, lesson and game views, routed on the URL hash (#lesson-1-1, #play-1-1-sorter).
(function () {
  const app = document.getElementById('app');
  const h = BG.h;

  const isLessonDone = (L) => L.games.every((g) => BG.bestScore(L.id, g) >= BG.PASS);
  const isUnlocked = (idx) => BG.progress.unlockAll || idx === 0 || isLessonDone(BG.LESSONS[idx - 1]);
  const go = (hash) => { if (location.hash === '#' + hash) route(); else location.hash = hash; };

  function pagesChip(pages) { return h('span', { class: 'pages mono', title: 'PDF page numbers in the book' }, 'Book pp. ' + pages); }

  function home() {
    const wrap = h('div', { class: 'home' });
    wrap.append(h('section', { class: 'hero' },
      h('p', { class: 'eyebrow' }, 'Biostatistics & Epidemiology · Units 1–2'),
      h('h1', null, 'Learn it by playing with it'),
      h('p', { class: 'lede' }, 'Seven lessons, nine games. Each lesson opens after you score at least 80% in every game of the lesson before it.')));
    BG.UNITS.forEach((U) => {
      const lessons = BG.LESSONS.filter((L) => L.unit === U.n);
      wrap.append(h('section', { class: 'unit' },
        h('div', { class: 'unit-head' }, h('span', { class: 'unit-num mono' }, 'Unit ' + U.n), h('h2', null, U.title), pagesChip(U.pages)),
        h('ol', { class: 'lesson-list' }, lessons.map((L) => {
          const idx = BG.lessonIndex(L.id);
          const open = isUnlocked(idx), done = isLessonDone(L);
          const state = done ? 'done' : open ? 'open' : 'locked';
          const best = L.games.map((g) => BG.bestScore(L.id, g));
          return h('li', null, h(open ? 'a' : 'div', { class: 'lesson-card ' + state, href: open ? '#lesson-' + L.id : null, 'aria-disabled': open ? null : 'true' },
            h('span', { class: 'lesson-num mono' }, L.num),
            h('span', { class: 'lesson-main' }, h('span', { class: 'lesson-title' }, L.title),
              h('span', { class: 'lesson-meta' }, pagesChip(L.pages), h('span', { class: 'games-count' }, L.games.length + (L.games.length > 1 ? ' games' : ' game')))),
            h('span', { class: 'lesson-state' }, done ? 'Passed' : open ? (best.some((b) => b > 0) ? `Best ${Math.min(...best)}%` : 'Start') : 'Locked')));
        }))));
    });
    wrap.append(parentPanel());
    return wrap;
  }

  function parentPanel() {
    const msg = h('p', { class: 'small muted', role: 'status' });
    const unlock = h('input', { type: 'checkbox', id: 'unlock-all', checked: BG.progress.unlockAll });
    unlock.addEventListener('change', () => { BG.progress.unlockAll = unlock.checked; BG.saveProgress(); route(); });
    let armed = false;
    const reset = h('button', { class: 'btn small-btn', onclick: () => {
      if (!armed) { armed = true; reset.textContent = 'Tap again to erase all scores'; msg.textContent = ''; return; }
      BG.progress = { scores: {}, unlockAll: false }; BG.saveProgress(); route();
    } }, 'Reset progress');
    return h('details', { class: 'parent' },
      h('summary', null, 'Parent tools and privacy'),
      h('div', { class: 'parent-body' },
        h('label', { class: 'check', for: 'unlock-all' }, unlock, ' Unlock all lessons (for previewing)'),
        h('div', null, reset), msg,
        h('p', { class: 'small muted' }, 'This app has no ads, no accounts and no links to other sites. It makes no network requests after it is installed. Scores are stored only in this browser on this device and are never sent anywhere.')));
  }

  function lesson(id) {
    const idx = BG.lessonIndex(id);
    const L = BG.LESSONS[idx];
    if (!L || !isUnlocked(idx)) return null;
    const terms = h('div', { class: 'terms' });
    const def = h('p', { class: 'term-def', role: 'status', 'aria-live': 'polite' }, 'Tap a term to see its meaning.');
    Object.entries(L.terms).forEach(([t, d]) => terms.append(h('button', { class: 'term', onclick: (e) => {
      terms.querySelectorAll('.term').forEach((b) => b.classList.toggle('on', b === e.currentTarget));
      BG.clear(def).append(h('strong', null, t + ': '), d);
    } }, t)));
    const games = h('div', { class: 'game-list' }, L.games.map((g) => {
      const G = BG.GAMES[g]; const best = BG.bestScore(L.id, g);
      return h('a', { class: 'game-card' + (best >= BG.PASS ? ' passed' : ''), href: `#play-${L.id}-${g}` },
        h('span', { class: 'game-title' }, G.title), h('span', { class: 'game-goal' }, 'Goal: ' + G.goal),
        h('span', { class: 'game-best mono' }, best ? `Best ${best}%` + (best >= BG.PASS ? ' · passed' : '') : 'Not played yet'));
    }));
    const next = BG.LESSONS[idx + 1];
    return h('article', { class: 'lesson' },
      h('a', { class: 'back', href: '#home' }, '← All lessons'),
      h('header', { class: 'lesson-head' }, h('p', { class: 'eyebrow' }, `Unit ${L.unit} · Lesson ${L.num}`), h('h1', null, L.title), pagesChip(L.pages)),
      h('section', { class: 'block' }, h('h3', null, 'Key terms'), terms, def),
      h('section', { class: 'block' }, h('h3', null, 'Learn'), ...L.sections()),
      L.bookNotes.length ? h('section', { class: 'block notes' }, h('h3', null, 'Book notes'),
        h('p', { class: 'small muted' }, 'Places where this app corrects or clarifies the book.'),
        h('ul', null, L.bookNotes.map((n) => h('li', null, n)))) : null,
      h('section', { class: 'block' }, h('h3', null, 'Play'), games,
        next ? h('p', { class: 'small muted' }, isLessonDone(L) ? `Lesson ${next.num} is open.` : `Score ${BG.PASS}% or more in ${L.games.length > 1 ? 'every game' : 'the game'} to open Lesson ${next.num}.`) : null));
  }

  function play(id, gameId) {
    const idx = BG.lessonIndex(id);
    const L = BG.LESSONS[idx];
    const G = BG.GAMES[gameId];
    if (!L || !G || !L.games.includes(gameId) || !isUnlocked(idx)) return null;
    const root = h('div', { class: 'quiz' });
    const view = h('article', { class: 'play' },
      h('a', { class: 'back', href: '#lesson-' + id }, '← Lesson ' + L.num),
      h('header', { class: 'lesson-head' }, h('p', { class: 'eyebrow' }, `Lesson ${L.num} · ${L.title}`), h('h1', null, G.title),
        h('p', { class: 'goal' }, h('strong', null, 'Goal: '), G.goal), pagesChip(L.pages)),
      root);
    const start = () => BG.runQuiz(root, {
      questions: G.build(),
      onFinish: (pct) => {
        const wasDone = isLessonDone(L);
        BG.recordScore(id, gameId, pct);
        const nextL = BG.LESSONS[idx + 1];
        if (!wasDone && isLessonDone(L) && nextL) setTimeout(() => toast(`Lesson ${nextL.num} unlocked: ${nextL.title}`), 300);
      },
      onRetry: () => { start(); window.scrollTo({ top: 0 }); },
      onBack: () => go('lesson-' + id)
    });
    start();
    return view;
  }

  function toast(text) {
    const t = h('div', { class: 'toast', role: 'status' }, text);
    document.body.append(t);
    setTimeout(() => t.classList.add('show'), 10);
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 3500);
  }

  function route() {
    const hash = location.hash.replace(/^#/, '');
    let view = null, m;
    if ((m = hash.match(/^lesson-(\d-\d)$/))) view = lesson(m[1]);
    else if ((m = hash.match(/^play-(\d-\d)-([a-z]+)$/))) view = play(m[1], m[2]);
    if (!view) view = home();
    BG.clear(app).append(view);
    window.scrollTo({ top: 0 });
    const h1 = app.querySelector('h1');
    if (h1) { h1.setAttribute('tabindex', '-1'); h1.focus({ preventScroll: true }); }
  }

  window.addEventListener('hashchange', route);
  route();

  // Offline support: cache the app files. Fails silently where service workers are unavailable.
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    try { navigator.serviceWorker.register('sw.js').catch(() => {}); } catch (e) { /* ignore */ }
  }
})();
