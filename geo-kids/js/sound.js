// Voice (device text-to-speech, local voices only) and sounds made in the browser.
// Nothing is downloaded and nothing leaves the device.

let voice = null;
let voiceReady = false;
const synth = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;

function pickVoice() {
  if (!synth) return;
  const all = synth.getVoices();
  // Only voices that run on the device. Online voices would send the text to a server.
  const local = all.filter((v) => v.localService && /^en[-_]/i.test(v.lang));
  const pref = ['en-US', 'en-GB', 'en-AU', 'en-IE', 'en-CA'];
  voice = null;
  for (const p of pref) {
    const list = local.filter((v) => v.lang.replace('_', '-').toLowerCase() === p.toLowerCase());
    // Prefer friendlier-sounding voices if present.
    voice = list.find((v) => /samantha|zira|karen|moira|serena|female/i.test(v.name)) || list[0];
    if (voice) break;
  }
  if (!voice) voice = local[0] || null;
  voiceReady = all.length > 0;
}

if (synth) {
  pickVoice();
  synth.addEventListener?.('voiceschanged', pickVoice);
}

export function voiceInfo() {
  if (!synth) return 'This browser cannot speak.';
  if (!voiceReady) return 'Looking for voices…';
  return voice ? `Voice: ${voice.name}` : 'No English voice is installed on this device. Words will show as text only.';
}

let speakToken = 0;
export function say(text) {
  return new Promise((resolve) => {
    const token = ++speakToken;
    if (!synth || !voice || !text) return resolve();
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.voice = voice;
    u.lang = voice.lang;
    u.rate = 0.85;
    u.pitch = 1.05;
    let done = false;
    const finish = () => { if (!done) { done = true; resolve(); } };
    u.onend = finish;
    u.onerror = finish;
    // Safety net: some engines never fire "end".
    setTimeout(finish, 1500 + text.length * 95);
    if (token === speakToken) synth.speak(u);
  });
}
export function stopTalking() { speakToken++; synth?.cancel(); }

// ---------- Sounds and music (Web Audio, generated) ----------
let ctx = null;
let musicGain = null;
let fxGain = null;
let musicTimer = null;
let level = 2; // 0..5

export function initAudio(startLevel) {
  level = startLevel;
  if (ctx) return;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  ctx = new AC();
  musicGain = ctx.createGain();
  fxGain = ctx.createGain();
  fxGain.gain.value = 0.25;
  musicGain.connect(ctx.destination);
  fxGain.connect(ctx.destination);
  applyLevel();
  startMusic();
}

function applyLevel() {
  if (!musicGain) return;
  const v = [0, 0.02, 0.04, 0.07, 0.1, 0.14][level];
  musicGain.gain.setTargetAtTime(v, ctx.currentTime, 0.2);
}

export function setMusicLevel(n) {
  level = Math.max(0, Math.min(5, n));
  applyLevel();
  return level;
}

function note(freq, t, dur, gainNode, type = 'sine', peak = 1) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + 0.04);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(gainNode);
  o.start(t);
  o.stop(t + dur + 0.05);
}

// A slow, calm loop on a pentatonic scale.
function startMusic() {
  const scale = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25];
  const chords = [[130.81, 196.0], [110.0, 164.81], [146.83, 220.0], [130.81, 196.0]];
  let step = 0;
  const beat = 0.75;
  const tick = () => {
    if (!ctx) return;
    const t = ctx.currentTime + 0.05;
    if (step % 8 === 0) {
      const ch = chords[(step / 8) % chords.length];
      ch.forEach((fq) => note(fq, t, beat * 8, musicGain, 'sine', 0.5));
    }
    if (step % 2 === 0 || Math.random() < 0.3) {
      const fq = scale[(step * 3 + (step >> 3)) % scale.length];
      note(fq, t, beat * 2.2, musicGain, 'triangle', 0.35);
    }
    step = (step + 1) % 32;
  };
  tick();
  musicTimer = setInterval(tick, beat * 1000);
}

export function resumeAudio() { ctx?.state === 'suspended' && ctx.resume(); }

export function fx(kind) {
  if (!ctx) return;
  const t = ctx.currentTime + 0.01;
  if (kind === 'right') { note(660, t, 0.25, fxGain, 'sine'); note(880, t + 0.12, 0.35, fxGain, 'sine'); }
  else if (kind === 'wrong') { note(300, t, 0.25, fxGain, 'triangle', 0.6); note(250, t + 0.12, 0.3, fxGain, 'triangle', 0.6); }
  else if (kind === 'star') { [784, 988, 1175, 1568].forEach((fq, i) => note(fq, t + i * 0.1, 0.4, fxGain, 'sine', 0.7)); }
  else if (kind === 'tap') { note(520, t, 0.1, fxGain, 'sine', 0.4); }
}
