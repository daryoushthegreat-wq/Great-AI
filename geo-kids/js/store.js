// Progress is kept only in this browser (localStorage). Nothing is sent anywhere.
// One store per level, so the Explorer and Geologist levels keep separate progress.

export function createStore(KEY, { LESSONS, LESSON_ORDER, GAMES }, petSteps = [0, 5, 15, 35, 70]) {
  const fresh = () => ({ stars: 0, gameStars: {}, words: {}, facts: {}, cloze: {}, music: 2, unlockAll: false });
  let S = fresh();
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) S = Object.assign(fresh(), JSON.parse(raw));
  } catch { /* storage blocked: play without saving */ }

  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* ignore */ } };
  const gameStars = (lid, gid) => S.gameStars[lid]?.[gid] || 0;
  const lessonDone = (lid) => GAMES.every((g) => gameStars(lid, g.id) > 0);

  const rec = (kind, id) => { S[kind] = S[kind] || {}; return (S[kind][id] = S[kind][id] || { box: 1, wrong: 0, seen: 0 }); };
  // Lower box and more mistakes = more likely to come back.
  const weight = (kind, id) => {
    const r = S[kind]?.[id];
    if (!r) return 9;
    return (6 - r.box) ** 2 + Math.min(r.wrong, 5) * 2;
  };
  function weightedPick(ids, n, kind) {
    const pool = ids.map((id) => ({ id, w: weight(kind, id) }));
    const out = [];
    while (out.length < n && pool.length) {
      const total = pool.reduce((a, b) => a + b.w, 0);
      let r = Math.random() * total;
      const i = pool.findIndex((p) => (r -= p.w) <= 0);
      out.push(pool.splice(i < 0 ? pool.length - 1 : i, 1)[0].id);
    }
    return out;
  }
  const earlier = (lid) => LESSON_ORDER.slice(0, LESSON_ORDER.indexOf(lid));
  const reviewFrom = (lid, n, kind, listKey) => {
    const ids = earlier(lid).flatMap((l) => LESSONS[l][listKey] || []).filter((id) => S[kind]?.[id]?.seen);
    return weightedPick(ids, n, kind);
  };

  return {
    state: () => S,
    save,
    reset() { const m = S.music; S = fresh(); S.music = m; save(); },
    PET_STEPS: petSteps,
    petStage: () => petSteps.filter((n) => S.stars >= n).length - 1,
    addStars(lid, gid, n) {
      S.stars += n;
      S.gameStars[lid] = S.gameStars[lid] || {};
      S.gameStars[lid][gid] = Math.max(S.gameStars[lid][gid] || 0, n);
      save();
    },
    gameStars,
    lessonDone,
    lessonOpen(lid) {
      const i = LESSON_ORDER.indexOf(lid);
      return S.unlockAll || i === 0 || lessonDone(LESSON_ORDER[i - 1]);
    },
    grade(kind, id, correct) {
      const r = rec(kind, id);
      r.seen++;
      if (correct) r.box = Math.min(5, r.box + 1);
      else { r.box = 1; r.wrong++; }
      save();
    },
    markSeen(id, kind = 'words') { rec(kind, id).seen++; save(); },
    reviewWords: (lid, n) => reviewFrom(lid, n, 'words', 'wordIds'),
    reviewFacts: (lid, n) => reviewFrom(lid, n, 'facts', 'factIds'),
    reviewCloze: (lid, n) => reviewFrom(lid, n, 'cloze', 'clozeIds'),
    weakest: (ids, n, kind = 'words') => weightedPick(ids, n, kind),
  };
}
