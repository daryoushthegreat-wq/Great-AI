// Labelled science diagrams for the Geologist level, drawn as SVG.
// Proportions follow current measurements where a scale is shown.

const F = 'font-family="ui-rounded, Segoe UI, system-ui, sans-serif"';
const C = {
  sky: '#d7e9f2', sea: '#4f8fb8', deep: '#2f6a91', crust: '#9b8b7a', cont: '#b9a27e', mantle: '#d9653b', mantleHi: '#e9894f',
  outer: '#f0a43a', inner: '#f7d354', ink: '#24303a', mute: '#5d6b72', white: '#ffffff', land: '#8fb87d', rock: '#a39486',
  s1: '#e3c88f', s2: '#c98d5a', s3: '#d9d2c3', s4: '#9c8f80', s5: '#b5704c', lava: '#e5603a', ash: '#9aa0a6',
};
const wrap = (vb, body, label) => `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">${body}</svg>`;
const t = (x, y, s, opts = '') => `<text x="${x}" y="${y}" ${F} font-size="9" fill="${C.ink}" ${opts}>${s}</text>`;
const dim = (on) => (on ? '' : ' opacity="0.4"');

// 1. Layers of the earth, radii to scale (crust line exaggerated).
function layers(hi) {
  const R = 112; const k = R / 6371; const cx = 118; const cy = 124;
  const arc = (r) => `M${cx - r},${cy} A${r},${r} 0 0 1 ${cx + r},${cy} Z`;
  const show = (part) => !hi || hi === part;
  const lead = (y, x2, label, bold = true) => `<line x1="${cx}" y1="${y}" x2="${x2 - 3}" y2="${y}" stroke="${C.ink}" stroke-width="0.6"/>${t(x2, y + 3, label, bold ? 'font-weight="700" font-size="8.5"' : 'font-size="7.5"')}`;
  return wrap('0 0 360 130', `
    <rect width="360" height="130" fill="${C.white}"/>
    <path d="${arc(R)}" fill="${C.crust}"${dim(show('crust') || show('shell'))}/>
    <path d="${arc(R - 3)}" fill="${C.mantleHi}"${dim(show('shell') || show('mantle'))}/>
    <path d="${arc(R - 8)}" fill="${C.mantle}"${dim(show('mantle'))}/>
    <path d="${arc(3480 * k)}" fill="${C.outer}"${dim(show('outer'))}/>
    <path d="${arc(1221 * k)}" fill="${C.inner}"${dim(show('inner'))}/>
    <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - R}" stroke="${C.ink}" stroke-width="0.8" stroke-dasharray="2 2"/>
    ${lead(cy - R + 1, 236, 'Crust (thin, cool)')}
    ${lead(cy - R + 14, 236, 'Shell = crust + top of mantle', false)}
    ${lead(cy - R + 34, 236, 'Mantle: solid, churning')}
    ${lead(cy - 52, 236, 'Outer core: liquid iron')}
    ${lead(cy - 10, 236, 'Inner core: solid')}
    ${t(cx - 5, cy - R + 8, '0 km', 'text-anchor="end" font-size="7"')}
    ${t(cx - 5, cy - 3480 * k + 3, '2,900 km', 'text-anchor="end" font-size="7"')}
    ${t(cx - 5, cy - 1221 * k + 3, '5,150 km', 'text-anchor="end" font-size="7"')}
    ${t(cx - 5, cy - 2, '6,370 km', 'text-anchor="end" font-size="7"')}
  `, 'Cross-section of the earth showing crust, mantle, outer core and inner core');
}

// 2. Plates: a mid-ocean ridge (pulling apart) and an ocean trench (one plate sinks).
function plates(focus) {
  const ridge = !focus || focus === 'ridge';
  const trench = !focus || focus === 'trench';
  return wrap('0 0 300 160', `
    <rect width="300" height="160" fill="${C.mantle}"/>
    <rect width="300" height="42" fill="${C.sky}"/>
    <rect y="42" width="200" height="22" fill="${C.sea}"/>
    <path d="M0 62 L58 60 L70 54 L82 60 L188 64 L252 152 L236 158 L180 74 L82 71 L70 67 L58 71 L0 73Z" fill="${C.crust}"/>
    <path d="M186 64 L196 46 L226 40 L238 20 L250 40 L300 42 V84 L222 84 Q205 76 186 64Z" fill="${C.cont}"/>
    <path d="M70 68 Q66 110 72 150" stroke="${C.inner}" stroke-width="5" fill="none"${dim(ridge)}/>
    <path d="M226 118 Q232 90 230 70 Q236 46 238 24" stroke="${C.lava}" stroke-width="3" fill="none"${dim(trench)}/>
    <path d="M52 52 h-18 m5 -5 l-5 5 l5 5 M88 52 h18 m-5 -5 l5 5 l-5 5" stroke="${C.ink}" stroke-width="1.6" fill="none"${dim(ridge)}/>
    <path d="M150 58 h18 m-5 -5 l5 5 l-5 5 M206 100 l10 14 m-7 0 l7 0 l-1 -7" stroke="${C.ink}" stroke-width="1.6" fill="none"${dim(trench)}/>
    ${t(70, 16, 'Mid-ocean ridge', 'text-anchor="middle" font-weight="700"')}${t(70, 28, 'plates pull apart', 'text-anchor="middle" font-size="7.5"')}
    ${t(170, 16, 'Ocean trench', 'text-anchor="middle" font-weight="700"')}${t(170, 28, 'one plate sinks', 'text-anchor="middle" font-size="7.5"')}
    ${t(262, 16, 'Volcano', 'font-size="8" font-weight="700"')}
    ${t(78, 120, 'Magma rises', 'font-size="7.5"')}
    ${t(96, 86, 'Oceanic crust (thin, dense)', 'font-size="7.5" fill="#fff"')}
    ${t(262, 66, 'Continental', 'text-anchor="middle" font-size="7.5"')}${t(262, 75, 'crust', 'text-anchor="middle" font-size="7.5"')}
    ${t(196, 140, 'Subduction', 'text-anchor="end" font-size="8" fill="#fff" font-weight="700"')}
    ${t(8, 152, 'Mantle', 'font-size="8" fill="#fff" font-weight="700"')}
  `, 'Plates pulling apart at a mid-ocean ridge and sinking at an ocean trench');
}

// 3. Volcano cross-section.
function volcano() {
  return wrap('0 0 260 150', `
    <rect width="260" height="150" fill="${C.sky}"/>
    <path d="M118 30 q-16 -4 -14 -14 q4 -12 18 -8 q8 -10 20 -2 q14 -2 12 10 q8 8 -4 14Z" fill="${C.ash}"/>
    <path d="M20 112 L112 40 L148 40 L240 112Z" fill="${C.rock}"/>
    <path d="M40 112 L112 50 M220 112 L148 50 M60 112 L114 64 M200 112 L146 64" stroke="#8a7d70" stroke-width="1.2"/>
    <rect y="112" width="260" height="38" fill="${C.crust}"/>
    <ellipse cx="130" cy="134" rx="40" ry="11" fill="${C.lava}"/>
    <path d="M127 40 L125 126 L135 126 L133 40Z" fill="${C.lava}"/>
    <path d="M148 42 Q160 60 168 80 Q172 92 180 100" stroke="${C.lava}" stroke-width="5" fill="none" stroke-linecap="round"/>
    ${t(130, 36, 'Crater', 'text-anchor="middle" font-size="7"')}
    ${t(160, 12, 'Ash and gas', 'font-size="8"')}
    ${t(186, 96, 'Lava flow', 'font-size="8" font-weight="700"')}
    ${t(140, 90, 'Vent', 'font-size="8"')}
    ${t(176, 136, 'Magma chamber', 'font-size="8" font-weight="700" fill="#fff"')}
    ${t(24, 104, 'Layers of old lava and ash', 'font-size="7"')}
  `, 'Cross-section of a volcano with magma chamber, vent, crater and lava flow');
}

// 4. Strata with fossils: superposition.
function strata() {
  const L = [[C.s1, 'Youngest'], [C.s3, ''], [C.s2, ''], [C.s4, ''], [C.s5, 'Oldest']];
  return wrap('0 0 260 140', `
    <rect width="260" height="140" fill="${C.white}"/>
    ${L.map(([c], i) => `<path d="M10 ${14 + i * 24} Q80 ${10 + i * 24} 150 ${15 + i * 24} T210 ${13 + i * 24} V${38 + i * 24} Q150 ${40 + i * 24} 80 ${35 + i * 24} T10 ${38 + i * 24}Z" fill="${c}"/>`).join('')}
    <g fill="none" stroke="#6b5a49" stroke-width="1.4">
      <path d="M60 74 m-2 0 a2 2 0 1 1 4 0 a4 4 0 1 1 -8 0 a6 6 0 1 1 12 0"/>
      <path d="M150 100 m-2 0 a2 2 0 1 1 4 0 a4 4 0 1 1 -8 0 a6 6 0 1 1 12 0 a8 8 0 1 1 -16 0"/>
      <path d="M110 48 q6 -6 12 0 q6 6 12 0"/>
    </g>
    <path d="M232 120 V22 m-6 8 l6 -8 l6 8" stroke="${C.ink}" stroke-width="2" fill="none"/>
    ${t(222, 132, 'Oldest', 'font-size="8" font-weight="700"')}
    ${t(220, 14, 'Youngest', 'font-size="8" font-weight="700"')}
    ${t(14, 30, 'Stratum', 'font-size="7"')}
    ${t(70, 92, 'Fossils', 'font-size="7"')}
  `, 'Layers of sedimentary rock: the oldest at the bottom, the youngest at the top');
}

// 5. Folding.
function fold() {
  const cols = [C.s5, C.s4, C.s2, C.s1];
  const layer = (i) => { const y = 92 - i * 13; return `<path d="M34 ${y} Q74 ${y - 56} 114 ${y} T194 ${y} T234 ${y - 28}" stroke="${cols[i]}" stroke-width="13" fill="none"/>`; };
  return wrap('0 0 260 140', `
    <rect width="260" height="140" fill="${C.white}"/>
    ${[0, 1, 2, 3].map(layer).join('')}
    <path d="M4 70 h22 m-7 -6 l7 6 l-7 6 M256 70 h-18 m7 -6 l-7 6 l7 6" stroke="${C.lava}" stroke-width="3" fill="none"/>
    ${t(4, 60, 'Pressure', 'font-size="7"')}${t(256, 60, 'Pressure', 'font-size="7" text-anchor="end"')}
    ${t(74, 16, 'Upfold', 'text-anchor="middle" font-size="8" font-weight="700"')}
    ${t(154, 132, 'Downfold', 'text-anchor="middle" font-size="8" font-weight="700"')}
  `, 'Rock layers folded by sideways pressure');
}

// 6. Faulting.
function fault() {
  const block = (x, dy) => [C.s1, C.s2, C.s4, C.s5].map((c, i) => `<path d="${x === 0 ? `M10 ${30 + dy + i * 22} H${124 - i * 6} L${118 - i * 6} ${52 + dy + i * 22} H10Z` : `M${124 - i * 6} ${30 + dy + i * 22} H250 V${52 + dy + i * 22} H${118 - i * 6}Z`}" fill="${c}"/>`).join('');
  return wrap('0 0 260 140', `
    <rect width="260" height="140" fill="${C.white}"/>
    ${block(0, 0)}${block(1, 16)}
    <path d="M126 22 L100 128" stroke="${C.ink}" stroke-width="2.4"/>
    <path d="M90 60 v-18 m-5 6 l5 -6 l5 6 M150 60 v18 m-5 -6 l5 6 l5 -6" stroke="${C.lava}" stroke-width="2.4" fill="none"/>
    ${t(128, 16, 'Fault', 'font-size="9" font-weight="700"')}
    ${t(130, 134, 'The rock cracks and slips', 'font-size="8" text-anchor="middle"')}
  `, 'Rock layers broken and shifted along a fault');
}

// 7. Seismograph trace.
function seismo() {
  let d = 'M10 70';
  for (let x = 10; x <= 250; x += 2) {
    const a = x < 90 ? 2 : x < 130 ? 10 : x < 190 ? 34 * Math.exp(-((x - 150) ** 2) / 900) + 6 : 4;
    d += ` L${x} ${70 + Math.sin(x * 1.7) * a * (0.6 + 0.4 * Math.sin(x * 0.37))}`;
  }
  return wrap('0 0 260 140', `
    <rect width="260" height="140" fill="#fbfaf6"/>
    ${[30, 50, 70, 90, 110].map((y) => `<line x1="10" x2="250" y1="${y}" y2="${y}" stroke="#e3e0d6"/>`).join('')}
    <path d="${d}" stroke="#2f6a91" stroke-width="1.3" fill="none"/>
    ${t(14, 20, 'Seismograph record', 'font-size="9" font-weight="700"')}
    ${t(14, 128, 'Small tremors', 'font-size="7"')}${t(130, 128, 'Main shock waves arrive', 'font-size="7"')}
  `, 'A seismograph record of an earthquake');
}

// 8. Geological timescale, to scale (current dates, millions of years).
function timescale(hi) {
  const eras = [['Precambrian', 4540, 538.8, '#cfd8dc'], ['Palaeozoic', 538.8, 251.9, '#5c8fc7'], ['Mesozoic', 251.9, 66, '#d9653b'], ['Cenozoic', 66, 0, '#f2c14e']];
  const W = 236; const x0 = 12; const k = W / 4540;
  return wrap('0 0 260 120', `
    <rect width="260" height="120" fill="${C.white}"/>
    ${eras.map(([n, a, b, c]) => `<rect x="${x0 + (4540 - a) * k}" y="34" width="${Math.max((a - b) * k, 1.6)}" height="34" fill="${c}"${!hi || hi === n ? '' : ' opacity="0.35"'}/>`).join('')}
    ${t(x0 + 4, 56, 'Precambrian (about 88% of all time)', 'font-size="8" font-weight="700"')}
    <path d="M${x0 + (4540 - 538.8) * k} 72 v10 M${x0 + W} 72 v10" stroke="${C.ink}"/>
    ${t(x0 + (4540 - 538.8) * k - 4, 92, 'Palaeozoic, Mesozoic, Cenozoic', 'font-size="7" text-anchor="end"')}
    ${t(x0, 26, '4,540 million years ago', 'font-size="7"')}${t(x0 + W, 26, 'Today', 'font-size="7" text-anchor="end"')}
    ${t(x0, 112, 'Drawn to scale with today’s dates', 'font-size="7" fill="#5d6b72"')}
  `, 'The geological timescale drawn to scale');
}

// 9. Crystal lattice.
function lattice() {
  let dots = '';
  for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++) {
    const x = 50 + c * 26 + (r % 2) * 13; const y = 26 + r * 22;
    dots += `<circle cx="${x}" cy="${y}" r="${(r + c) % 2 ? 6 : 9}" fill="${(r + c) % 2 ? '#e9894f' : '#4f8fb8'}"/>`;
  }
  return wrap('0 0 260 140', `
    <rect width="260" height="140" fill="${C.white}"/>
    ${dots}
    ${t(14, 134, 'Atoms fixed in a regular, repeating pattern', 'font-size="8"')}
  `, 'Atoms arranged in a regular crystal pattern');
}

// 10. Continental shelf.
function shelf() {
  return wrap('0 0 260 130', `
    <rect width="260" height="130" fill="${C.sky}"/>
    <path d="M0 50 H260 V130 H0Z" fill="${C.sea}"/>
    <path d="M0 40 Q30 36 50 46 L150 58 Q170 60 182 80 L210 120 L260 124 V130 H0Z" fill="${C.cont}"/>
    <path d="M0 40 Q30 36 50 46" stroke="${C.land}" stroke-width="4" fill="none"/>
    <path d="M60 50 v6 M140 50 v8" stroke="${C.white}" stroke-width="1"/>
    ${t(80, 46, 'Shallow shelf sea', 'font-size="8" font-weight="700" fill="#fff"')}
    ${t(64, 76, 'Continental shelf', 'font-size="8" font-weight="700"')}
    ${t(196, 100, 'Deep ocean', 'font-size="8" fill="#fff"')}
    ${t(8, 30, 'Land', 'font-size="8"')}
  `, 'A continental shelf covered by a shallow sea');
}

// 11. Mountain root.
function root() {
  return wrap('0 0 260 150', `
    <rect width="260" height="150" fill="${C.white}"/>
    <rect width="260" height="54" fill="${C.sky}"/>
    <path d="M0 54 H80 L120 14 L140 30 L160 10 L200 54 H260 V150 H0Z" fill="${C.mantle}"/>
    <path d="M0 54 H80 L120 14 L140 30 L160 10 L200 54 H260 V78 H200 Q150 140 110 130 Q70 120 60 78 H0Z" fill="${C.cont}"/>
    <path d="M0 54 H260" stroke="${C.ink}" stroke-dasharray="3 3" stroke-width="0.8"/>
    ${t(170, 26, 'Mountain', 'font-size="8" font-weight="700"')}
    ${t(104, 104, 'Mountain root', 'font-size="8" font-weight="700"')}
    ${t(6, 72, 'Light continental crust', 'font-size="7"')}
    ${t(6, 140, 'Denser rock below', 'font-size="8" fill="#fff"')}
  `, 'A mountain with a deep root of light crust, like an iceberg');
}

// 12. Rift.
function rift() {
  return wrap('0 0 260 140', `
    <rect width="260" height="140" fill="${C.sky}"/>
    <path d="M0 50 H100 L112 90 L148 90 L160 50 H260 V140 H0Z" fill="${C.cont}"/>
    <path d="M112 90 L148 90 L144 74 L116 74Z" fill="${C.sea}"/>
    <rect y="110" width="260" height="30" fill="${C.mantle}"/>
    <path d="M130 110 V92" stroke="${C.inner}" stroke-width="4"/>
    <path d="M70 40 h-30 m8 -6 l-8 6 l8 6 M190 40 h30 m-8 -6 l8 6 l-8 6" stroke="${C.ink}" stroke-width="2" fill="none"/>
    ${t(20, 30, 'Africa', 'font-size="9" font-weight="700"')}${t(200, 30, 'Arabia', 'font-size="9" font-weight="700"')}
    ${t(130, 70, 'Red Sea', 'text-anchor="middle" font-size="8" font-weight="700"')}
    ${t(150, 104, 'Magma rises', 'font-size="7"')}
  `, 'A rift: two plates pulling apart with a sea filling the gap');
}

const MAP = {
  'g-crust': () => layers('crust'), 'g-shell': () => layers('shell'), 'g-mantle': () => layers('mantle'),
  'g-outer-core': () => layers('outer'), 'g-inner-core': () => layers('inner'), 'g-diameter': () => layers(), 'g-white-hot': () => layers('mantle'),
  'g-moho': () => layers('crust'),
  'g-plate': () => plates(), 'g-magma': () => plates('ridge'), 'g-mid-ocean-ridge': () => plates('ridge'), 'g-ocean-trench': () => plates('trench'),
  'g-subduction': () => plates('trench'), 'g-continental-crust': () => plates(), 'g-oceanic-crust': () => plates(), 'g-volcanic-chain': () => plates('trench'),
  'g-andes': () => plates('trench'), 'g-ring-of-fire': () => plates('trench'), 'g-andesite': () => plates('trench'),
  'g-eruption': volcano, 'g-lava': volcano, 'g-hotspot': volcano, 'g-shield-volcano': volcano, 'g-volcanic-rock': volcano,
  'g-stratum': strata, 'g-sedimentary-rock': strata, 'g-superposition': strata, 'g-relative-age': strata, 'g-sediment': strata, 'g-deposit': strata, 'g-fossil': strata, 'g-ammonite': strata,
  'g-folding': fold, 'g-fold-mountains': fold, 'g-buckle': fold, 'g-stress': fold, 'g-alps': fold, 'g-himalayas': fold,
  'g-faulting': fault, 'g-fault-line': fault, 'g-strain': fault, 'g-brittle': fault,
  'g-seismograph': seismo, 'g-tremor': seismo, 'g-shock-wave': seismo,
  'g-geological-timescale': () => timescale(), 'g-era': () => timescale(), 'g-period': () => timescale(), 'g-precambrian': () => timescale('Precambrian'),
  'g-palaeozoic': () => timescale('Palaeozoic'), 'g-mesozoic': () => timescale('Mesozoic'), 'g-cenozoic': () => timescale('Cenozoic'),
  'g-jurassic': () => timescale('Mesozoic'), 'g-holocene': () => timescale('Cenozoic'),
  'g-crystal': lattice, 'g-atom': lattice, 'g-compound': lattice, 'g-silicate': lattice,
  'g-continental-shelf': shelf, 'g-shelf-sea': shelf, 'g-sea-level': shelf, 'g-coastline': shelf,
  'g-mountain-root': root, 'g-density': root, 'g-mountain-range': root,
  'g-rift': rift, 'g-red-sea': rift, 'g-continental-drift': rift,
};
export const diagramFor = (id) => (MAP[id] ? MAP[id]() : '');

// ---------- Specimens for the collection ----------
const rockPath = 'M18 70 Q10 46 28 34 Q42 18 64 24 Q86 26 90 48 Q96 70 78 80 Q54 92 34 86 Q20 82 18 70Z';
function specimen(base, extra) {
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="54" cy="88" rx="36" ry="5" fill="#000" opacity="0.12"/>
    <path d="${rockPath}" fill="${base}"/>${extra}
    <path d="M30 36 Q44 26 60 28" stroke="#fff" stroke-width="3" opacity="0.35" fill="none" stroke-linecap="round"/></svg>`;
}
const dots = (n, cols, r = [2, 4]) => Array.from({ length: n }, (_, i) => `<circle cx="${26 + ((i * 37) % 60)}" cy="${34 + ((i * 23) % 46)}" r="${r[0] + (i % 3) * (r[1] - r[0]) / 2}" fill="${cols[i % cols.length]}"/>`).join('');
export const SPECIMEN_ART = {
  basalt: specimen('#3f4247', dots(10, ['#55595f'], [1, 2])),
  meteorite: specimen('#5b5650', dots(12, ['#3e3a35', '#8d8a85'], [2, 5])),
  iron: specimen('#7d858e', '<path d="M30 50 L80 46 M28 62 L82 60" stroke="#a3abb4" stroke-width="3"/>'),
  mudstone: specimen('#8b7765', '<path d="M18 50 Q50 44 92 50 M16 62 Q50 56 94 62 M20 74 Q50 70 86 76" stroke="#6f5d4d" stroke-width="2.5" fill="none"/>'),
  quartz: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><ellipse cx="50" cy="88" rx="36" ry="5" fill="#000" opacity="0.12"/>
    <path d="M14 86 L86 86 L80 76 L20 76Z" fill="#a39486"/>${[[26, 30, 8], [44, 12, 10], [62, 24, 9], [76, 40, 7]].map(([x, y, w]) => `<path d="M${x - w} 78 L${x - w} ${y + 12} L${x} ${y} L${x + w} ${y + 12} L${x + w} 78Z" fill="#eef4f7" stroke="#c3d0d8" stroke-width="1.5"/><path d="M${x} ${y} L${x} 78" stroke="#d8e2e8"/>`).join('')}</svg>`,
  garnet: specimen('#cfc6b8', '<path d="M34 44 L46 38 L56 48 L50 62 L36 62 L28 52Z M60 56 L72 50 L80 60 L74 72 L62 70Z" fill="#8e2333"/><path d="M34 44 L46 38 L42 48Z" fill="#c4505f"/>'),
  obsidian: specimen('#15161a', '<path d="M40 40 Q60 34 74 46" stroke="#5c6470" stroke-width="3" fill="none"/><path d="M30 64 Q50 60 70 70" stroke="#3a3f47" stroke-width="2" fill="none"/>'),
  'fossil-fern': specimen('#c9bda6', '<path d="M30 76 Q52 54 76 32" stroke="#6b5a49" stroke-width="2" fill="none"/>' + Array.from({ length: 7 }, (_, i) => { const x = 34 + i * 6; const y = 72 - i * 6; return `<path d="M${x} ${y} q-8 -2 -12 -8 M${x} ${y} q2 8 8 10" stroke="#6b5a49" stroke-width="1.6" fill="none"/>`; }).join('')),
  coal: specimen('#1e1e22', dots(8, ['#3b3d44'], [2, 3]) + '<path d="M30 44 L52 40 L70 50" stroke="#4a4d55" stroke-width="2" fill="none"/>'),
  ammonite: specimen('#bfae8f', '<path d="M56 56 m-3 0 a3 3 0 1 1 6 0 a6 6 0 1 1 -12 0 a10 10 0 1 1 20 0 a15 15 0 1 1 -30 0 a20 20 0 1 1 40 0" stroke="#7a6a52" stroke-width="2.6" fill="none"/>'),
  gneiss: specimen('#8e8792', '<path d="M18 46 Q40 36 58 48 Q76 60 92 50 M16 60 Q38 50 58 62 Q78 74 94 64 M20 74 Q40 66 58 76 Q74 84 88 78" stroke="#f1ece4" stroke-width="4" fill="none"/>'),
  pumice: specimen('#ddd6c8', dots(26, ['#bdb4a4', '#c9c0b0'], [1.5, 3.5])),
  slate: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><ellipse cx="50" cy="88" rx="38" ry="5" fill="#000" opacity="0.12"/>
    <path d="M12 70 L28 40 L90 34 L86 64Z" fill="#4c5560"/><path d="M12 70 L86 64 L84 74 L12 80Z" fill="#3b424b"/><path d="M28 48 L86 42 M22 58 L86 52" stroke="#5c6672" stroke-width="1.5"/></svg>`,
  jade: specimen('#5f9e74', '<path d="M30 50 Q50 40 70 52 Q60 70 40 66Z" fill="#7dbb90"/>' + dots(6, ['#4b8460'], [1, 2])),
  trilobite: specimen('#b8a98e', '<ellipse cx="54" cy="56" rx="16" ry="24" fill="#8a7a62"/><path d="M42 40 Q54 30 66 40" fill="#9d8d74"/>' + Array.from({ length: 6 }, (_, i) => `<path d="M40 ${46 + i * 6} H68" stroke="#6b5c46" stroke-width="1.5"/>`).join('') + '<path d="M54 34 V80" stroke="#6b5c46" stroke-width="2"/>'),
};
