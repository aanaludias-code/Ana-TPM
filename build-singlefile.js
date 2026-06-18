/* build-singlefile.js — bundles the whole game into ONE self-contained
   index.html that opens by double-click (no server, no commands).

   It inlines the CSS and concatenates every ES module into a single inline
   <script type="module">, stripping import/export so there are no external
   fetches (which file:// blocks). Run with:  node build-singlefile.js
   Output: dist/herdeiro-genetico.html  */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';

const root = new URL('.', import.meta.url).pathname;
const read = p => readFileSync(root + p, 'utf8');

// CSS, in load order
const css = ['css/theme.css', 'css/components.css', 'css/game.css'].map(read).join('\n\n');

// JS modules, dependency order (deps first, main last)
const order = [
  'js/genetics/probability.js',
  'js/genetics/punnett.js',
  'js/genetics/blood.js',
  'js/genetics/pedigree.js',
  'js/genetics/mutation.js',
  'js/data/svg.js',
  'js/data/protagonists.js',
  'js/data/codex.js',
  'js/data/characters.js',
  'js/data/chapters.js',
  'js/state.js',
  'js/router.js',
  'js/ui.js',
  'js/screens/common.js',
  'js/screens/title.js',
  'js/screens/protagonist.js',
  'js/screens/map.js',
  'js/screens/journal.js',
  'js/screens/chapter1.js',
  'js/screens/chapter2.js',
  'js/screens/chapter3.js',
  'js/screens/chapter4.js',
  'js/screens/chapter5.js',
  'js/screens/ending.js',
  'js/main.js',
];

function strip(path, src) {
  // blood.js defines a local `gametes` that collides with punnett's in a
  // single shared scope — rename it to bloodGametes just for the bundle.
  if (path.endsWith('blood.js')) src = src.replace(/\bgametes\b/g, 'bloodGametes');

  return src.split('\n').filter(line => {
    if (/^\s*import\s/.test(line)) return false;      // static imports
    if (/import\s*\(/.test(line)) return false;        // dynamic imports (e.g. ?selftest)
    if (/^\s*export\s*\{/.test(line)) return false;    // re-export lines
    return true;
  }).map(line => line.replace(/^(\s*)export\s+/, '$1')) // strip `export ` keyword
    .join('\n');
}

const js = order.map(p => `\n/* ===== ${p} ===== */\n` + strip(p, read(p))).join('\n');

const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Herdeiro Genético: A Linhagem Perdida</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Caveat:wght@500;700&display=swap" rel="stylesheet" />
  <style>
${css}
  </style>
</head>
<body>
  <div class="bg-parchment" aria-hidden="true"></div>
  <div class="bg-vignette" aria-hidden="true"></div>
  <main id="app" role="main"></main>
  <div id="toast-layer" aria-live="polite"></div>
  <noscript><div style="padding:2rem;text-align:center;font-family:serif">Este jogo precisa de JavaScript ativado.</div></noscript>
  <script type="module">
${js}
  </script>
</body>
</html>
`;

mkdirSync(root + 'dist', { recursive: true });
writeFileSync(root + 'dist/herdeiro-genetico.html', html);
console.log('OK → dist/herdeiro-genetico.html (' + (html.length / 1024).toFixed(0) + ' KB)');
