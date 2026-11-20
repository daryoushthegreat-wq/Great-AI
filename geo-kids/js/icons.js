// Simple hand-made SVG pictures, one per word. viewBox is always 0 0 100 100.
// No pictures are copied from the book.

const C = {
  sky: '#cfe6f2', sea: '#5b9bc4', deep: '#3d7aa6', land: '#8fbf7f', forest: '#4f8a5b',
  sand: '#e8cf98', rock: '#9a8f86', darkRock: '#6e655e', lava: '#e8743b', hot: '#f2a33a',
  core: '#f7d354', ink: '#3b3a45', white: '#ffffff', snow: '#f4f7fa', mud: '#8a6a4b', red: '#c8553d',
};

const svg = (body) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${body}</svg>`;

// Earth cut-away: highlight one of crust / mantle / core.
function earthCut(hi) {
  const dim = (k) => (hi && hi !== k ? ' opacity="0.35"' : '');
  return svg(`
    <circle cx="50" cy="50" r="44" fill="${C.sea}"${dim('crust')}/>
    <path d="M18 30 q10 -10 22 -4 q6 10 -4 16 q-12 4 -18 -12z M60 14 q14 2 20 14 q-8 6 -16 0z M66 66 q10 -4 16 6 q-6 12 -16 6z" fill="${C.land}"${dim('crust')}/>
    <path d="M50 50 L50 6 A44 44 0 0 1 94 50 Z" fill="${C.darkRock}"${dim('crust')}/>
    <path d="M50 50 L50 10 A40 40 0 0 1 90 50 Z" fill="${C.lava}"${dim('mantle')}/>
    <path d="M50 50 L50 28 A22 22 0 0 1 72 50 Z" fill="${C.hot}"${dim('core')}/>
    <path d="M50 50 L50 38 A12 12 0 0 1 62 50 Z" fill="${C.core}"${dim('core')}/>
    ${hi ? `<path d="${{ crust: 'M50 6 A44 44 0 0 1 94 50', mantle: 'M50 18 A32 32 0 0 1 82 50', core: 'M50 30 A20 20 0 0 1 70 50' }[hi]}" fill="none" stroke="${C.ink}" stroke-width="3" stroke-dasharray="4 4"/>` : ''}
  `);
}

const mountainShape = (fill = C.rock) => `
  <path d="M5 88 L38 30 L52 50 L66 22 L95 88 Z" fill="${fill}"/>
  <path d="M38 30 L30 44 L36 42 L41 47 L45 40 Z M66 22 L58 36 L64 34 L69 39 L74 33 Z" fill="${C.snow}"/>`;

export const ICONS = {
  earth: earthCut(null).replace(/<path d="M50 50[^>]*>/g, ''),
  rock: svg(`<path d="M14 78 Q8 52 30 40 Q46 24 66 32 Q90 38 88 64 Q86 82 60 84 Q30 88 14 78Z" fill="${C.rock}"/>
    <path d="M30 52 Q40 46 50 50 M58 44 Q68 46 72 56 M36 70 Q50 66 64 72" stroke="${C.darkRock}" stroke-width="3" fill="none" stroke-linecap="round"/>`),
  mountain: svg(`<rect width="100" height="100" fill="${C.sky}"/>${mountainShape()}<rect y="86" width="100" height="14" fill="${C.land}"/>`),
  desert: svg(`<rect width="100" height="100" fill="#f6e3b4"/><circle cx="76" cy="24" r="12" fill="${C.core}"/>
    <path d="M0 70 Q25 52 50 66 Q75 80 100 62 L100 100 L0 100Z" fill="${C.sand}"/>
    <path d="M0 84 Q30 72 60 84 Q80 92 100 82 L100 100 L0 100Z" fill="#d9b874"/>
    <path d="M26 66 L26 44 M26 54 Q18 54 18 46 M26 50 Q34 50 34 42" stroke="${C.forest}" stroke-width="5" stroke-linecap="round" fill="none"/>`),
  jungle: svg(`<rect width="100" height="100" fill="#dcefd6"/>
    <rect x="22" y="48" width="7" height="46" fill="${C.mud}"/><rect x="66" y="40" width="7" height="54" fill="${C.mud}"/>
    <path d="M25 50 Q8 40 4 52 Q14 44 25 50 Q12 30 22 26 Q20 40 25 50 Q30 28 44 32 Q32 38 25 50 Q42 42 46 54 Q36 46 25 50Z" fill="${C.forest}"/>
    <path d="M69 42 Q52 32 48 44 Q58 36 69 42 Q56 22 66 18 Q64 32 69 42 Q74 20 88 24 Q76 30 69 42 Q86 34 90 46 Q80 38 69 42Z" fill="${C.forest}"/>
    <ellipse cx="50" cy="92" rx="50" ry="10" fill="${C.land}"/>`),
  ocean: svg(`<rect width="100" height="100" fill="${C.sky}"/><rect y="40" width="100" height="60" fill="${C.sea}"/>
    <path d="M0 50 q8 -6 16 0 t16 0 t16 0 t16 0 t16 0 t20 0 M0 66 q8 -6 16 0 t16 0 t16 0 t16 0 t16 0 t20 0 M0 82 q8 -6 16 0 t16 0 t16 0 t16 0 t16 0 t20 0" stroke="${C.white}" stroke-width="3" fill="none"/>`),
  sand: svg(`<path d="M10 86 Q50 30 90 86Z" fill="${C.sand}"/>
    ${Array.from({ length: 30 }, (_, i) => `<circle cx="${22 + ((i * 37) % 56)}" cy="${60 + ((i * 23) % 24)}" r="1.6" fill="#b8925a"/>`).join('')}
    <circle cx="70" cy="30" r="3" fill="${C.sand}"/><circle cx="78" cy="22" r="2" fill="${C.sand}"/><circle cx="62" cy="20" r="2.5" fill="${C.sand}"/>`),

  sun: svg(`<g stroke="${C.hot}" stroke-width="6" stroke-linecap="round">${Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4; return `<line x1="${50 + 30 * Math.cos(a)}" y1="${50 + 30 * Math.sin(a)}" x2="${50 + 44 * Math.cos(a)}" y2="${50 + 44 * Math.sin(a)}"/>`;
  }).join('')}</g><circle cx="50" cy="50" r="24" fill="${C.core}"/>`),
  star: svg(`<rect width="100" height="100" rx="12" fill="#2f3a5c"/>
    <path d="M50 14 L59 40 L87 40 L64 56 L73 84 L50 67 L27 84 L36 56 L13 40 L41 40Z" fill="${C.core}"/>`),
  planet: svg(`<rect width="100" height="100" rx="12" fill="#2f3a5c"/><circle cx="50" cy="50" r="24" fill="#d99a6c"/>
    <ellipse cx="50" cy="50" rx="44" ry="10" fill="none" stroke="${C.sand}" stroke-width="4" transform="rotate(-18 50 50)"/>
    <circle cx="16" cy="18" r="1.5" fill="${C.white}"/><circle cx="84" cy="82" r="1.5" fill="${C.white}"/>`),
  comet: svg(`<rect width="100" height="100" rx="12" fill="#2f3a5c"/>
    <path d="M70 30 L10 84 L20 70 L4 70 L64 24Z" fill="#9fd0ea" opacity="0.7"/><circle cx="72" cy="28" r="12" fill="${C.snow}"/>`),
  crater: svg(`<rect width="100" height="100" fill="${C.sky}"/><path d="M0 50 L100 50 L100 100 L0 100Z" fill="#b5a99b"/>
    <ellipse cx="50" cy="66" rx="34" ry="14" fill="${C.darkRock}"/><ellipse cx="50" cy="68" rx="26" ry="9" fill="#544c46"/>
    <path d="M16 62 Q14 54 22 54 M84 62 Q86 54 78 54" stroke="#b5a99b" stroke-width="6" fill="none"/>`),
  atmosphere: svg(`<circle cx="50" cy="50" r="46" fill="#bfe1f5"/><circle cx="50" cy="50" r="34" fill="${C.sea}"/>
    <path d="M30 40 q10 -10 20 -2 q4 10 -6 14 q-10 2 -14 -12z M56 56 q12 -4 16 6 q-8 10 -16 4z" fill="${C.land}"/>
    <path d="M14 30 q6 -4 12 0 M80 70 q6 -4 12 0" stroke="${C.white}" stroke-width="3" fill="none"/>`),

  crust: earthCut('crust'),
  mantle: earthCut('mantle'),
  core: earthCut('core'),
  iron: svg(`<path d="M20 70 L34 40 L84 40 L70 70Z" fill="#8c95a0"/><path d="M20 70 L70 70 L70 80 L20 80Z" fill="#6b737d"/><path d="M70 70 L84 40 L84 50 L70 80Z" fill="#5a616a"/>
    <path d="M40 48 L74 48" stroke="#b9c1ca" stroke-width="3"/>`),
  solid: svg(`<rect x="22" y="30" width="46" height="46" rx="6" fill="#bfe1f5" stroke="#7fb7d6" stroke-width="3"/>
    <path d="M30 40 L44 40" stroke="${C.white}" stroke-width="4" stroke-linecap="round"/>
    <path d="M68 30 L80 20 L80 66 L68 76Z" fill="#9ccbe6"/><path d="M22 30 L34 20 L80 20 L68 30Z" fill="#dff0fa"/>`),
  liquid: svg(`<path d="M50 12 Q74 46 74 62 A24 24 0 0 1 26 62 Q26 46 50 12Z" fill="${C.sea}"/>
    <path d="M38 62 Q38 72 46 76" stroke="${C.white}" stroke-width="4" fill="none" stroke-linecap="round"/>`),

  layer: svg(`<rect x="10" y="20" width="80" height="14" rx="3" fill="#d9b874"/><rect x="10" y="34" width="80" height="14" fill="${C.red}" opacity="0.75"/>
    <rect x="10" y="48" width="80" height="14" fill="${C.sand}"/><rect x="10" y="62" width="80" height="14" fill="${C.rock}"/><rect x="10" y="76" width="80" height="10" rx="3" fill="${C.darkRock}"/>`),
  volcano: svg(`<rect width="100" height="100" fill="${C.sky}"/><path d="M42 10 q-10 -2 -8 8 q-10 2 -4 10 h22 q8 -6 0 -12 q0 -8 -10 -6z" fill="#c3c3c8"/>
    <path d="M6 92 L40 34 L60 34 L94 92Z" fill="${C.darkRock}"/><path d="M40 34 L60 34 L56 46 L52 40 L48 52 L44 42Z" fill="${C.lava}"/>`),
  earthquake: svg(`<rect width="100" height="100" fill="${C.sky}"/><path d="M0 62 L100 62 L100 100 L0 100Z" fill="${C.land}"/>
    <path d="M30 62 L40 74 L34 80 L46 94" stroke="${C.ink}" stroke-width="4" fill="none" stroke-linejoin="round"/>
    <rect x="56" y="34" width="24" height="28" fill="${C.sand}" transform="rotate(8 68 48)"/><path d="M54 36 L68 24 L82 36Z" fill="${C.red}" transform="rotate(8 68 48)"/>
    <path d="M8 40 q4 -4 0 -8 M16 44 q6 -8 0 -16 M90 30 q-4 -4 0 -8" stroke="${C.ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`),
  mine: svg(`<rect width="100" height="100" fill="${C.sky}"/><path d="M0 40 L100 40 L100 100 L0 100Z" fill="${C.mud}"/>
    <rect x="40" y="40" width="20" height="52" fill="#3e2f22"/><path d="M30 40 L30 14 L70 14 L70 40 M30 14 L70 40 M70 14 L30 40" stroke="${C.darkRock}" stroke-width="4" fill="none"/>
    <circle cx="50" cy="60" r="4" fill="${C.core}"/>`),
  mud: svg(`<path d="M6 70 Q20 56 40 62 Q56 50 74 60 Q94 58 94 74 Q90 88 50 86 Q10 88 6 70Z" fill="${C.mud}"/>
    <ellipse cx="40" cy="70" rx="8" ry="3" fill="#a5835f"/><ellipse cx="66" cy="74" rx="6" ry="2.5" fill="#a5835f"/>
    <path d="M50 40 q-6 8 0 12 q6 -4 0 -12z" fill="${C.sea}"/>`),
  erosion: svg(`<rect width="100" height="100" fill="${C.sky}"/><path d="M40 92 L46 40 Q60 30 70 44 L76 92Z" fill="${C.red}" opacity="0.8"/>
    <path d="M6 30 h26 M2 44 h30 M8 58 h22" stroke="${C.white}" stroke-width="4" stroke-linecap="round"/>
    <circle cx="82" cy="78" r="2" fill="${C.sand}"/><circle cx="88" cy="84" r="2" fill="${C.sand}"/><circle cx="84" cy="90" r="2" fill="${C.sand}"/>
    <rect y="90" width="100" height="10" fill="${C.sand}"/>`),
  geology: svg(`<path d="M8 82 Q6 60 26 54 Q40 44 56 52 Q70 58 68 76 Q64 88 40 88 Q16 90 8 82Z" fill="${C.rock}"/>
    <circle cx="62" cy="38" r="20" fill="#e6f3fa" stroke="${C.ink}" stroke-width="6"/><path d="M76 52 L92 68" stroke="${C.ink}" stroke-width="9" stroke-linecap="round"/>`),

  crystal: svg(`<path d="M50 8 L66 30 L60 90 L40 90 L34 30Z" fill="#c9b6e8"/><path d="M50 8 L66 30 L50 34Z" fill="#e4d9f5"/><path d="M50 8 L34 30 L50 34Z" fill="#b39ddb"/>
    <path d="M50 34 L50 90" stroke="#9c84c7" stroke-width="2"/><path d="M20 90 L28 54 L36 62 L36 90Z M80 90 L72 50 L64 60 L64 90Z" fill="#b39ddb"/>`),
  mineral: svg(`<path d="M10 84 Q8 62 28 58 L72 58 Q92 62 90 84Z" fill="${C.rock}"/>
    <path d="M30 58 L38 30 L46 58Z M46 58 L54 20 L62 58Z M62 58 L70 36 L76 58Z" fill="#9fd3c7"/>`),
  quartz: svg(`<path d="M24 86 L30 34 L40 22 L50 34 L46 86Z" fill="#eef3f6" stroke="#c3d0d8" stroke-width="2"/>
    <path d="M48 86 L54 26 L64 12 L74 26 L72 86Z" fill="#f7fafb" stroke="#c3d0d8" stroke-width="2"/><path d="M10 86 L90 86 L86 92 L14 92Z" fill="${C.rock}"/>`),
  granite: svg(`<rect x="10" y="22" width="80" height="60" rx="10" fill="#d8cfc8"/>
    ${Array.from({ length: 26 }, (_, i) => `<circle cx="${18 + ((i * 41) % 64)}" cy="${30 + ((i * 29) % 46)}" r="${2 + (i % 3)}" fill="${['#3b3a45', '#e6a6a0', '#f5f2ee'][i % 3]}"/>`).join('')}`),
  chalk: svg(`<rect width="100" height="100" fill="${C.sky}"/><path d="M0 26 L64 26 L70 100 L0 100Z" fill="#f4f2ec"/><path d="M64 26 L70 100 L100 100 L100 70Q80 60 64 26Z" fill="${C.sea}"/>
    <path d="M0 44 L66 44 M0 62 L68 62 M0 80 L69 80" stroke="#dcd8cc" stroke-width="2"/><rect y="20" width="64" height="8" fill="${C.land}"/>`),
  sandstone: svg(`<rect x="10" y="20" width="80" height="62" rx="8" fill="#d98f5c"/>
    <path d="M12 36 Q50 30 88 38 M12 52 Q50 46 88 54 M12 68 Q50 62 88 70" stroke="#b86d3f" stroke-width="3" fill="none"/>
    ${Array.from({ length: 18 }, (_, i) => `<circle cx="${18 + ((i * 37) % 64)}" cy="${28 + ((i * 17) % 48)}" r="1.5" fill="#f2c497"/>`).join('')}`),
  microscope: svg(`<rect x="16" y="84" width="60" height="8" rx="3" fill="${C.ink}"/><path d="M60 84 Q72 66 60 46" stroke="${C.ink}" stroke-width="7" fill="none"/>
    <rect x="34" y="14" width="14" height="40" rx="3" fill="#5c6a8a" transform="rotate(-25 41 34)"/><rect x="28" y="62" width="34" height="5" fill="${C.ink}"/>
    <rect x="40" y="52" width="6" height="12" fill="${C.ink}"/>`),

  'igneous-rock': svg(`<path d="M6 92 L40 40 L60 40 L94 92Z" fill="${C.darkRock}"/><path d="M44 40 L56 40 L64 72 Q50 64 36 72Z" fill="${C.lava}"/>
    <path d="M74 16 V36 M65 21 L83 31 M65 31 L83 21" stroke="#7fb7d6" stroke-width="3.5" stroke-linecap="round"/>`),
  'metamorphic-rock': svg(`<path d="M8 80 Q6 40 30 30 Q60 18 84 34 Q96 50 90 74 Q80 92 50 88 Q20 92 8 80Z" fill="#7d6f7c"/>
    <path d="M14 50 Q30 38 42 52 Q54 66 70 50 Q80 40 90 48 M12 64 Q30 52 44 66 Q58 78 74 64 Q84 56 92 62" stroke="#efe6ec" stroke-width="4" fill="none"/>`),
  pressure: svg(`<rect x="34" y="34" width="32" height="32" rx="4" fill="${C.rock}"/>
    <path d="M6 50 L28 50 M20 40 L30 50 L20 60 M94 50 L72 50 M80 40 L70 50 L80 60" stroke="${C.red}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`),
  fold: svg(`<path d="M6 70 Q28 20 50 50 Q72 80 94 30 L94 46 Q72 96 50 66 Q28 36 6 86Z" fill="${C.red}" opacity="0.85"/>
    <path d="M6 54 Q28 4 50 34 Q72 64 94 14 L94 30 Q72 80 50 50 Q28 20 6 70Z" fill="${C.sand}"/>`),
  fault: svg(`<path d="M6 30 L48 30 L56 90 L6 90Z" fill="${C.sand}"/><path d="M6 46 L50 46 M6 62 L52 62 M6 78 L54 78" stroke="${C.red}" stroke-width="5"/>
    <path d="M52 40 L94 40 L94 96 L60 96Z" fill="${C.sand}"/><path d="M53 56 L94 56 M55 72 L94 72 M57 88 L94 88" stroke="${C.red}" stroke-width="5"/>
    <path d="M48 30 L56 90 M52 40 L60 96" stroke="${C.ink}" stroke-width="3"/>`),
  garnet: svg(`<path d="M10 80 Q8 56 30 50 L74 50 Q92 56 90 80Z" fill="#cfc6b8"/>
    <path d="M30 36 L44 30 L52 42 L46 56 L32 56 L24 46Z" fill="#8e2333"/><path d="M58 50 L70 44 L80 54 L74 66 L60 64Z" fill="#8e2333"/><path d="M30 36 L44 30 L40 40Z" fill="#c4505f"/>`),

  plate: svg(`<circle cx="50" cy="50" r="44" fill="${C.sea}"/><path d="M8 40 Q30 46 44 30 Q56 18 50 6 M44 30 Q60 50 92 44 M60 48 Q52 70 64 92 M30 90 Q40 70 26 52 Q16 46 8 60" stroke="${C.ink}" stroke-width="3" fill="none"/>
    <path d="M70 20 l6 -4 M76 70 l6 4" stroke="${C.white}" stroke-width="4" stroke-linecap="round"/>`),
  jigsaw: svg(`<path d="M14 14 H44 V24 A8 8 0 1 1 44 40 V50 H14Z" fill="#e5b45b"/><path d="M50 14 H86 V50 H76 A8 8 0 1 0 60 50 H50 V40 A8 8 0 1 0 50 24Z" fill="${C.sea}"/>
    <path d="M14 56 H24 A8 8 0 1 0 40 56 H50 V86 H14Z" fill="${C.land}"/><path d="M56 56 H86 V86 H56 V76 A8 8 0 1 1 56 66Z" fill="${C.red}" opacity="0.8"/>`),
  magma: svg(`<rect width="100" height="100" fill="${C.darkRock}"/><path d="M50 100 Q30 70 46 50 Q60 34 50 0 L60 0 Q70 34 58 54 Q48 72 66 100Z" fill="${C.lava}"/>
    <circle cx="30" cy="80" r="10" fill="${C.hot}"/><circle cx="72" cy="30" r="6" fill="${C.hot}"/>`),
  continent: svg(`<rect width="100" height="100" rx="12" fill="${C.sea}"/>
    <path d="M40 14 Q60 12 66 26 Q76 30 74 44 Q70 56 60 62 Q58 78 50 88 Q44 80 44 66 Q30 60 28 46 Q24 30 40 14Z" fill="${C.land}"/>`),
  'ocean-trench': svg(`<rect width="100" height="40" fill="${C.sky}"/><rect y="30" width="100" height="70" fill="${C.sea}"/>
    <path d="M0 70 L40 70 L50 96 L56 64 L100 56 L100 100 L0 100Z" fill="${C.darkRock}"/><path d="M44 74 L50 92" stroke="${C.white}" stroke-width="2" stroke-dasharray="3 3"/>`),
  'mid-ocean-ridge': svg(`<rect width="100" height="30" fill="${C.sky}"/><rect y="24" width="100" height="76" fill="${C.deep}"/>
    <path d="M0 90 L30 76 L42 58 L50 66 L58 58 L70 76 L100 90 L100 100 L0 100Z" fill="${C.darkRock}"/><path d="M50 66 L50 96" stroke="${C.lava}" stroke-width="4"/>
    <path d="M30 86 L18 90 M70 86 L82 90" stroke="${C.white}" stroke-width="3" stroke-linecap="round"/>`),

  map: svg(`<path d="M8 20 L34 12 L66 22 L92 14 L92 82 L66 90 L34 80 L8 88Z" fill="#f2e9d0"/><path d="M34 12 L34 80 M66 22 L66 90" stroke="#d5c8a3" stroke-width="2"/>
    <path d="M18 38 Q26 30 36 40 Q44 50 36 58 Q24 60 18 38Z M56 46 Q70 36 80 48 Q78 64 64 62Z" fill="${C.land}"/>
    <path d="M60 70 l8 6 m0 -6 l-8 6" stroke="${C.red}" stroke-width="3"/>`),
  raft: svg(`<rect width="100" height="100" fill="${C.sky}"/><rect y="60" width="100" height="40" fill="${C.sea}"/>
    <rect x="16" y="52" width="68" height="10" rx="4" fill="#b98a55"/><path d="M30 52 V56 M50 52 V56 M70 52 V56" stroke="#8a6438" stroke-width="2"/>
    <path d="M50 52 L50 16 L74 44Z" fill="${C.white}"/><path d="M50 16 V52" stroke="${C.mud}" stroke-width="3"/>`),
  drift: svg(`<rect width="100" height="100" rx="12" fill="${C.sea}"/><path d="M10 30 Q22 20 34 30 Q40 46 28 56 Q14 54 10 30Z" fill="${C.land}"/>
    <path d="M60 40 Q76 30 88 42 Q90 60 74 66 Q60 60 60 40Z" fill="${C.land}"/>
    <path d="M38 76 H62 M54 68 L62 76 L54 84" stroke="${C.white}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`),
  fossil: svg(`<path d="M8 84 Q6 30 50 18 Q94 30 92 84Z" fill="#cdbfa8"/>
    <path d="M50 66 m-4 0 a4 4 0 1 1 8 0 a8 8 0 1 1 -16 0 a12 12 0 1 1 24 0 a16 16 0 1 1 -32 0 a20 20 0 1 1 40 0" stroke="#8a7a62" stroke-width="3.5" fill="none"/>`),
  'red-sea': svg(`<rect width="100" height="100" rx="12" fill="#d9c08f"/><path d="M28 0 Q38 30 52 50 Q66 72 76 100 L92 100 Q80 70 66 48 Q52 26 46 0Z" fill="${C.sea}"/>
    <path d="M10 70 L22 76 M18 64 L28 70" stroke="#b89c66" stroke-width="2"/>`),
  arabia: svg(`<rect width="100" height="100" rx="12" fill="${C.sea}"/>
    <path d="M22 18 L70 14 Q82 30 92 46 Q88 66 70 76 Q50 86 38 78 Q30 60 22 44 Q16 30 22 18Z" fill="#e2c389"/>
    <circle cx="56" cy="44" r="4" fill="${C.red}"/>`),
};

export const iconFor = (id) => ICONS[id] || svg(`<circle cx="50" cy="50" r="40" fill="${C.rock}"/>`);

// The pet: a baby dinosaur that grows with stars (fossils link to the book).
export function petSvg(stage) {
  const egg = `<ellipse cx="50" cy="60" rx="26" ry="32" fill="#f4ecd8" stroke="#d8c9a3" stroke-width="3"/>
    <circle cx="40" cy="50" r="4" fill="#9fd3c7"/><circle cx="58" cy="66" r="5" fill="#9fd3c7"/><circle cx="56" cy="42" r="3" fill="#9fd3c7"/>`;
  if (stage === 0) return svg(egg);
  if (stage === 1) {
    return svg(`<path d="M24 64 L32 56 L40 64 L48 56 L56 64 L64 56 L72 64 L76 64 Q76 94 50 94 Q24 94 24 64Z" fill="#f4ecd8" stroke="#d8c9a3" stroke-width="3"/>
      <circle cx="50" cy="48" r="18" fill="#7cc4a4"/><circle cx="44" cy="44" r="3" fill="#2d3540"/><circle cx="56" cy="44" r="3" fill="#2d3540"/>
      <path d="M44 54 Q50 58 56 54" stroke="#2d3540" stroke-width="2" fill="none"/>`);
  }
  const s = [0, 0, 0.8, 0.92, 1][stage];
  return svg(`<g transform="translate(50 56) scale(${s}) translate(-50 -56)">
    <path d="M66 70 Q90 72 96 56 Q86 64 70 60Z" fill="#6ab593"/>
    <ellipse cx="54" cy="66" rx="24" ry="20" fill="#7cc4a4"/>
    <path d="M40 50 L44 40 L50 48 L56 38 L62 48 L68 42 L70 54" fill="#f2a33a"/>
    <circle cx="34" cy="42" r="16" fill="#7cc4a4"/>
    <circle cx="30" cy="38" r="3.5" fill="#2d3540"/><circle cx="31" cy="37" r="1.2" fill="#fff"/>
    <path d="M22 48 Q28 52 34 48" stroke="#2d3540" stroke-width="2" fill="none"/>
    <circle cx="40" cy="46" r="3" fill="#f2b0a4" opacity="0.8"/>
    <rect x="40" y="80" width="8" height="12" rx="3" fill="#6ab593"/><rect x="58" y="80" width="8" height="12" rx="3" fill="#6ab593"/>
    <ellipse cx="54" cy="70" rx="12" ry="10" fill="#c6ead6"/>
    ${stage >= 4 ? '<path d="M28 24 L34 14 L40 24Z" fill="#f2d354"/>' : ''}
  </g>`);
}
