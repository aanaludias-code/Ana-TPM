/* ending.js — the lineage reveal + reconstructed family tree. */

import { register, go } from '../router.js';
import { getState, reset } from '../state.js';
import { on } from '../ui.js';
import { TRUTH, BABY, familyById } from '../data/characters.js';
import { avatar, baby, vineFrame } from '../data/svg.js';
import { gamebar } from './common.js';
import { CHAPTERS } from '../data/chapters.js';

register('ending', (node) => {
  gamebar(node);
  const s = getState();
  const fam = familyById(TRUTH.familia);
  const mae = fam.membros.find(m => m.nome === TRUTH.mae);
  const pai = fam.membros.find(m => m.nome === TRUTH.pai);

  const personHTML = (svg, name, sub) => `
    <div class="person">
      <div class="portrait">${vineFrame(svg, { color: fam.cor })}</div>
      <span class="ribbon">${name}</span>
      ${sub ? `<span class="pill">${sub}</span>` : ''}
    </div>`;

  const reveal = document.createElement('div');
  reveal.className = 'panel flourish';
  reveal.style.marginTop = '14px';
  reveal.style.textAlign = 'center';
  reveal.innerHTML = `
    <h1>A Linhagem Revelada</h1>
    <p class="subtitle" style="font-family:var(--font-note);font-size:1.5rem;color:var(--ink-soft)">
      A criança pertence à ${fam.nome}</p>

    <div class="row" style="justify-content:center;align-items:flex-end;gap:40px;margin:18px 0">
      ${personHTML(avatar(mae.traits), mae.nome, `${mae.blood.abo}${mae.blood.rh}`)}
      <div style="font-size:2rem;align-self:center;color:var(--oxblood)">♥</div>
      ${personHTML(avatar(pai.traits), pai.nome, `${pai.blood.abo}${pai.blood.rh}`)}
    </div>
    <div style="font-size:1.6rem;color:var(--wood-dark)">⤵</div>
    <div class="row" style="justify-content:center;margin-top:8px">
      ${personHTML(baby(BABY.traits), `${BABY.apelido} (${BABY.blood.abo}${BABY.blood.rh})`, 'a criança')}
    </div>

    <div class="feedback good" style="text-align:left;max-width:720px;margin:18px auto 0">
      ${TRUTH.resumo}
    </div>
    <p class="muted" style="margin-top:10px">A criança herdou de Helena os traços de pigmentação
    (pele, cabelos e olhos) — confirmados pelo marcador de dominância incompleta.</p>

    <div class="row" style="justify-content:center;margin-top:16px">
      <span class="pill gold" style="font-size:1.1rem">✦ Perspicácia final: ${s.insight}</span>
    </div>
  `;
  node.appendChild(reveal);

  const recap = document.createElement('div');
  recap.className = 'panel flourish';
  recap.style.marginTop = '16px';
  recap.innerHTML = `<h2>Conceitos dominados nesta investigação</h2>
    <div class="map-grid">${CHAPTERS.map(c => `
      <div class="card"><h4>Cap. ${c.n} — ${c.titulo}</h4>
        <p style="margin:0;font-size:0.95rem">${c.objetivo}</p></div>`).join('')}</div>
    <div class="center" style="margin-top:18px">
      <button class="btn" data-act="map">🗺️ Voltar ao mapa</button>
      <button class="btn primary" data-act="restart">📖 Nova investigação</button>
    </div>`;
  node.appendChild(recap);

  on(node, 'click', '[data-act]', (e, t) => {
    if (t.dataset.act === 'map') go('map');
    if (t.dataset.act === 'restart') { reset(); go('title'); }
  });
});
