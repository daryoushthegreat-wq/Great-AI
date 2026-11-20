// Progress is kept only in this browser (localStorage). Nothing is sent anywhere.
import { WORDS, FACTS, LESSON_ORDER, LESSONS, GAMES } from './data.js';

const KEY = 'earthExplorers.v1';
const fresh = () => ({ stars: 0, gameStars: {}, words: {}, facts: {}, music: 2, unlockAll: false });

let S = fresh();
try {
  const raw = localStorage.getItem(KEY);
  if (raw) S = Object.assign(fresh(), JSON.parse(raw));
} catch { /* storage blocked: play without saving */ }

export const state = () => S;
export function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* ignore */ } }
export function reset() { const m = S.music; S = fresh(); S.music = m; save(); }

// ---------- Rewards ----------
export const PET_STEPS = [0, 5, 15, 35, 70];
export const petStage = () => PET_STEPS.filter((n) => S.stars >= n).length - 1;
export function addStars(lid, gid, n) {
  S.stars += n;
  S.gameStars[lid] = S.gameStars[lid] || {};
  S.gameStars[lid][gid] = Math.max(S.gameStars[lid][gid] || 0, n);
  save();
}
export const gameStars = (lid, gid) => S.gameStars[lid]?.[gid] || 0;
export const lessonDone = (lid) => GAMES.every((g) => gameStars(lid, g.id) > 0);
export function lessonOpen(lid) {
  const i = LESSON_ORDER.indexOf(lid);
  return S.unlockAll || i === 0 || lessonDone(LESSON_ORDER[i - 1]);
}

// ---------- Spaced review (Leitner boxes 1..5) ----------
const rec = (kind, id) => (S[kind][id] = S[kind][id] || { box: 1, wrong: 0, seen: 0 });
export function grade(kind, id, correct) {
  const r = rec(kind, id);
  r.seen++;
  if (correct) r.box = Math.min(5, r.box + 1);
  else { r.box = 1; r.wrong++; }
  save();
}
export const markSeen = (id) => { rec('words', id).seen++; save(); };

// Lower box and more mistakes = more likely to come back.
const weight = (kind, id) => {
  const r = S[kind][id];
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

// Old words from earlier lessons that the child has already met.
export function reviewWords(lid, n) {
  const before = LESSON_ORDER.slice(0, LESSON_ORDER.indexOf(lid));
  const ids = before.flatMap((l) => LESSONS[l].wordIds).filter((id) => S.words[id]?.seen);
  return weightedPick(ids, n, 'words');
}
export function reviewFacts(lid, n) {
  const before = LESSON_ORDER.slice(0, LESSON_ORDER.indexOf(lid));
  const ids = before.flatMap((l) => LESSONS[l].factIds).filter((id) => S.facts[id]?.seen);
  return weightedPick(ids, n, 'facts');
}
// Current-lesson words, weakest first (with a little randomness).
export const weakest = (ids, n) => weightedPick(ids, n, 'words');

export { WORDS, FACTS };
