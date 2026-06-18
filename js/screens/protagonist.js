/* protagonist.js — choose one of three investigators. */

import { register, go } from '../router.js';
import { setProtagonist } from '../state.js';
import { on } from '../ui.js';
import { PROTAGONISTS } from '../data/protagonists.js';
import { avatar, vineFrame } from '../data/svg.js';
import { statBar } from '../ui.js';

register('protagonist', (node) => {
  node.innerHTML = `<h1 class="center">Escolha seu Investigador</h1>
    <p class="center muted">Cada perfil tem forças diferentes em análise, dedução e interação social.
    A ciência é a mesma — mas as pistas e tentativas variam.</p>`;
  const grid = document.createElement('div');
  grid.className = 'protagonist-grid';
  grid.innerHTML = PROTAGONISTS.map(p => `
    <div class="card selectable" data-id="${p.id}">
      <div class="portrait">${vineFrame(avatar(p.traits))}</div>
      <h3 style="margin:8px 0 0">${p.name}</h3>
      <div class="pill blood">${p.role}</div>
      <p style="margin:10px 0">${p.blurb}</p>
      <div class="statline">
        ${statBar('Análise', p.stats.analise)}
        ${statBar('Dedução', p.stats.deducao, 5, 'health')}
        ${statBar('Social', p.stats.social, 5, 'skill')}
      </div>
      <div class="note" style="transform:none;max-width:none;margin-top:12px;font-size:1.05rem">
        <strong>Talento:</strong> ${p.perk}
      </div>
      <button class="btn primary block" style="margin-top:12px" data-pick="${p.id}">Escolher</button>
    </div>
  `).join('');
  node.appendChild(grid);

  on(node, 'click', '[data-pick]', (e, t) => {
    setProtagonist(t.dataset.pick);
    go('map');
  });
});
