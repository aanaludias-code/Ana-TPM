/* probability.js — fraction helpers and independent-event combination.
   All genetics probability in the game flows through these so results
   are always exact and reducible. */

function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a || 1; }

/** Reduced fraction {n, d}. */
export function fraction(n, d) {
  if (d === 0) throw new Error('denominador zero');
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(n, d);
  return { n: n / g, d: d / g };
}

/** Multiply independent probabilities (each {n,d}). */
export function combineAnd(...fracs) {
  let n = 1, d = 1;
  for (const f of fracs) { n *= f.n; d *= f.d; }
  return fraction(n, d);
}

/** P(A or B) for mutually exclusive events. */
export function combineOr(...fracs) {
  // bring to common denominator then add
  let d = 1;
  for (const f of fracs) d *= f.d;
  let n = 0;
  for (const f of fracs) n += f.n * (d / f.d);
  return fraction(n, d);
}

export function asPercent(frac, digits = 1) {
  return (100 * frac.n / frac.d).toFixed(digits) + '%';
}

export function asRatio(frac) { return `${frac.n}/${frac.d}`; }

/** Pretty "1/4 (25,0%)" string, pt-BR decimal comma. */
export function format(frac) {
  return `${asRatio(frac)} (${asPercent(frac).replace('.', ',')})`;
}

export function equals(a, b) {
  const fa = fraction(a.n, a.d), fb = fraction(b.n, b.d);
  return fa.n === fb.n && fa.d === fb.d;
}
