/* svg.js — inline SVG art. Modular cartoon avatars (thick-outlined,
   storybook), vine frames, crests, baby portraits and tool icons.
   Traits (skin, hair, eyes) are parameterised so families can share
   heritable features that the genetics actually drives. */

export const SKIN = {
  fair:   '#f0c9a3', light: '#e6b487', tan: '#cf9a6a',
  olive:  '#b07f50', brown: '#8a5a36', deep: '#5e3a22',
};
export const HAIR = {
  black: '#241a12', brown: '#5a3a1e', auburn: '#7a3416',
  blond: '#cda24e', red: '#9c3b1a', gray: '#9a8f80', white: '#d8cfc2',
};
export const EYES = {
  brown: '#5a3a1e', hazel: '#7a5a2a', green: '#3f6b3f', blue: '#3f6f9e', gray: '#6f6f6f',
};

const OUT = '#2a1d10';     // thick outline colour
const SW = 4;              // outline stroke width

/* ---------- Vine frame wrapper (reusable) ---------- */
export function vineFrame(innerSVG, { color = '#5e8155' } = {}) {
  return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="pc"><circle cx="60" cy="58" r="42"/></clipPath>
    </defs>
    <g clip-path="url(#pc)">${innerSVG}</g>
    <circle cx="60" cy="58" r="42" fill="none" stroke="${OUT}" stroke-width="5"/>
    <!-- decorative vines/leaves around the frame -->
    <g fill="${color}" stroke="${OUT}" stroke-width="2">
      <path d="M18 58 q-8 -16 6 -26 q4 12 -6 26Z"/>
      <path d="M102 58 q8 -16 -6 -26 q-4 12 6 26Z"/>
      <ellipse cx="60" cy="14" rx="9" ry="5" transform="rotate(-18 60 14)"/>
      <ellipse cx="60" cy="14" rx="9" ry="5" transform="rotate(18 60 14)"/>
      <ellipse cx="30" cy="92" rx="8" ry="4.5" transform="rotate(28 30 92)"/>
      <ellipse cx="90" cy="92" rx="8" ry="4.5" transform="rotate(-28 90 92)"/>
    </g>
  </svg>`;
}

/* ---------- Adult avatar ---------- */
export function avatar(traits = {}) {
  const {
    sex = 'F', skin = 'light', hair = 'brown', eyes = 'brown',
    expression = 'neutral', accessory = null, age = 'adult',
  } = traits;
  const sc = SKIN[skin] || skin;
  const hc = HAIR[hair] || hair;
  const ec = EYES[eyes] || eyes;

  const mouth = {
    smile: `<path d="M48 78 q12 12 24 0" fill="none" stroke="${OUT}" stroke-width="3" stroke-linecap="round"/>`,
    neutral: `<path d="M50 80 h20" stroke="${OUT}" stroke-width="3" stroke-linecap="round"/>`,
    worried: `<path d="M48 82 q12 -8 24 0" fill="none" stroke="${OUT}" stroke-width="3" stroke-linecap="round"/>`,
  }[expression] || `<path d="M50 80 h20" stroke="${OUT}" stroke-width="3" stroke-linecap="round"/>`;

  // hair shape varies a touch by sex for silhouette variety
  const hairShape = sex === 'F'
    ? `<path d="M28 56 q-4 -40 32 -42 q36 2 32 42 q-6 -14 -16 -16 q4 8 0 14 q-16 -10 -32 0 q-4 -6 0 -14 q-12 4 -16 16Z" fill="${hc}" stroke="${OUT}" stroke-width="${SW}"/>`
    : `<path d="M30 50 q-2 -36 30 -38 q32 2 30 38 q-8 -18 -30 -18 q-22 0 -30 18Z" fill="${hc}" stroke="${OUT}" stroke-width="${SW}"/>`;

  const acc = {
    crown: `<path d="M42 22 l6 10 6 -12 6 12 6 -10 -2 16 h-20Z" fill="#d9a73a" stroke="${OUT}" stroke-width="2.5"/>`,
    glasses: `<g fill="none" stroke="${OUT}" stroke-width="3"><circle cx="48" cy="66" r="8"/><circle cx="72" cy="66" r="8"/><path d="M56 66 h8"/></g>`,
    flower: `<g transform="translate(82 34)"><circle r="5" fill="#a8453a" stroke="${OUT}" stroke-width="2"/><circle r="2" fill="#e0b35e"/></g>`,
    monocle: `<g fill="none" stroke="${OUT}" stroke-width="3"><circle cx="72" cy="66" r="8"/><path d="M72 74 v8"/></g>`,
    null: '',
  }[accessory] || '';

  return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="120" height="120" fill="none"/>
    <!-- neck/shoulders -->
    <path d="M30 120 q4 -28 30 -28 q26 0 30 28Z" fill="${sc}" stroke="${OUT}" stroke-width="${SW}"/>
    <!-- head -->
    <ellipse cx="60" cy="62" rx="30" ry="33" fill="${sc}" stroke="${OUT}" stroke-width="${SW}"/>
    <!-- ears -->
    <circle cx="30" cy="64" r="6" fill="${sc}" stroke="${OUT}" stroke-width="3"/>
    <circle cx="90" cy="64" r="6" fill="${sc}" stroke="${OUT}" stroke-width="3"/>
    ${hairShape}
    <!-- eyes -->
    <ellipse cx="48" cy="66" rx="4.5" ry="5.5" fill="#fff" stroke="${OUT}" stroke-width="2"/>
    <ellipse cx="72" cy="66" rx="4.5" ry="5.5" fill="#fff" stroke="${OUT}" stroke-width="2"/>
    <circle cx="48" cy="67" r="2.6" fill="${ec}"/>
    <circle cx="72" cy="67" r="2.6" fill="${ec}"/>
    <!-- brows -->
    <path d="M42 57 q6 -3 12 0" fill="none" stroke="${OUT}" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M66 57 q6 -3 12 0" fill="none" stroke="${OUT}" stroke-width="2.5" stroke-linecap="round"/>
    <!-- nose -->
    <path d="M60 68 v8 q-3 2 -5 2" fill="none" stroke="${OUT}" stroke-width="2.5" stroke-linecap="round"/>
    ${mouth}
    ${acc}
  </svg>`;
}

/* ---------- Baby avatar (crib selection, reference 2) ---------- */
export function baby(traits = {}) {
  const { skin = 'light', hair = 'brown', eyes = 'brown' } = traits;
  const sc = SKIN[skin] || skin;
  const hc = HAIR[hair] || hair;
  const ec = EYES[eyes] || eyes;
  return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <!-- swaddle -->
    <path d="M26 120 q0 -34 34 -34 q34 0 34 34Z" fill="#eadfca" stroke="${OUT}" stroke-width="${SW}"/>
    <!-- big head -->
    <circle cx="60" cy="56" r="34" fill="${sc}" stroke="${OUT}" stroke-width="${SW}"/>
    <!-- little hair curl -->
    <path d="M48 30 q12 -14 24 0 q-8 -4 -12 0 q-4 -3 -12 0Z" fill="${hc}" stroke="${OUT}" stroke-width="3"/>
    <!-- big eyes -->
    <circle cx="48" cy="58" r="6" fill="#fff" stroke="${OUT}" stroke-width="2"/>
    <circle cx="72" cy="58" r="6" fill="#fff" stroke="${OUT}" stroke-width="2"/>
    <circle cx="49" cy="59" r="3.4" fill="${ec}"/>
    <circle cx="73" cy="59" r="3.4" fill="${ec}"/>
    <!-- cheeks -->
    <circle cx="40" cy="70" r="4" fill="#e79b8a" opacity="0.7"/>
    <circle cx="80" cy="70" r="4" fill="#e79b8a" opacity="0.7"/>
    <!-- mouth -->
    <path d="M54 74 q6 6 12 0" fill="none" stroke="${OUT}" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`;
}

/* ---------- Crest / misc icons ---------- */
export const CREST = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 10 h40 v26 q0 18 -20 26 q-20 -8 -20 -26Z" fill="#7a2d24" stroke="#2a1d10" stroke-width="3"/>
  <path d="M32 16 l4 8 -4 -2 -4 2Z" fill="#e0b35e"/>
  <circle cx="32" cy="36" r="8" fill="#e0b35e" stroke="#2a1d10" stroke-width="2"/>
  <path d="M32 30 v12 M26 36 h12" stroke="#7a2d24" stroke-width="2"/>
</svg>`;

export const ICONS = {
  pedigree: '🌳', blood: '🩸', chromosome: '🧬', mutation: '⚠️',
  lineage: '👑', microscope: '🔬', dna: '🧪', database: '📚',
  map: '🗺️', journal: '📜', tree: '🌿', baby: '👶',
};

/* tool emblem inner glyphs */
export function toolIcon(id) {
  return ({
    'kit-sangue': '🩸', 'microscopio': '🔬', 'analisador-cromossomos': '🧬',
    'sequenciador': '🧪', 'banco-mutacoes': '📚', 'reconstrutor': '🌿',
  })[id] || '🔧';
}
