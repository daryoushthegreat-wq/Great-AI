// Lowercase letter strokes on the four writing lines, in standard school stroke order.
// The book has no handwriting guide, so this follows common primary-school print.
// Coordinates: x 0..100, top line y=0, dashed middle line y=50, base line y=100, tail line y=150.
// Each stroke is drawn in order, starting at its first point.

const A = 25; // circle radius for x-height letters, centre (50,75)
const S2 = [50 + A * Math.cos(Math.PI / 6), 75 - A * Math.sin(Math.PI / 6)]; // "2 o'clock" start
const f = (n) => n.toFixed(2);
const ccwCircleFrom2 = `M${f(S2[0])},${f(S2[1])} A${A},${A} 0 1,0 ${f(S2[0])},${f(150 - S2[1])} A${A},${A} 0 0,0 ${f(S2[0])},${f(S2[1])}`;
const cwCircleFromLeft = `M25,75 A${A},${A} 0 1,1 75,75 A${A},${A} 0 1,1 25,75`;

export const LETTERS = {
  a: [ccwCircleFrom2, 'M75,50 L75,100'],
  b: ['M25,0 L25,100', cwCircleFromLeft],
  c: [`M${f(S2[0])},${f(S2[1])} A${A},${A} 0 1,0 ${f(S2[0])},${f(150 - S2[1])}`],
  d: [ccwCircleFrom2, 'M75,0 L75,100'],
  e: [`M27,75 L75,75 A${A},${A} 0 1,0 ${f(S2[0])},${f(150 - S2[1])}`],
  f: ['M72,8 Q64,0 56,0 Q45,0 45,15 L45,100', 'M25,50 L68,50'],
  g: [ccwCircleFrom2, 'M75,50 L75,130 Q75,150 52,150 Q34,150 26,140'],
  h: ['M25,0 L25,100', 'M25,72 Q25,50 50,50 Q75,50 75,72 L75,100'],
  i: ['M50,50 L50,100', 'M50,28 L50,31'],
  j: ['M58,50 L58,132 Q58,150 42,150 Q30,150 24,142', 'M58,28 L58,31'],
  k: ['M25,0 L25,100', 'M72,50 L26,78 L75,100'],
  l: ['M50,0 L50,100'],
  m: ['M18,50 L18,100', 'M18,72 Q18,50 34,50 Q50,50 50,72 L50,100 L50,72 Q50,50 66,50 Q82,50 82,72 L82,100'],
  n: ['M25,50 L25,100', 'M25,72 Q25,50 50,50 Q75,50 75,72 L75,100'],
  o: [`M50,50 A${A},${A} 0 1,0 50,100 A${A},${A} 0 1,0 50,50`],
  p: ['M25,50 L25,150', cwCircleFromLeft],
  q: [ccwCircleFrom2, 'M75,50 L75,150'],
  r: ['M28,50 L28,100', 'M28,72 Q28,50 52,50 Q66,50 74,58'],
  s: ['M72,57 Q64,50 50,50 Q28,50 28,63 Q28,74 50,75 Q72,76 72,88 Q72,100 50,100 Q34,100 26,92'],
  t: ['M45,10 L45,88 Q45,100 58,100 Q66,100 70,96', 'M25,50 L68,50'],
  u: ['M25,50 L25,78 Q25,100 50,100 Q75,100 75,78 L75,50 L75,100'],
  v: ['M22,50 L50,100 L78,50'],
  w: ['M12,50 L31,100 L50,58 L69,100 L88,50'],
  x: ['M25,50 L75,100', 'M75,50 L25,100'],
  y: ['M25,50 L52,100', 'M76,50 L36,150'],
  z: ['M25,50 L75,50 L25,100 L75,100'],
};

// Letters whose body sits in the top half too (for nicer framing).
export const TALL = new Set(['b', 'd', 'f', 'h', 'k', 'l', 't']);
export const TAIL = new Set(['g', 'j', 'p', 'q', 'y']);
