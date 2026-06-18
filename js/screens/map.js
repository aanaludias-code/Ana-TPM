/* map.js — location hub. Travel to chapters, see unlocked tools. */

import { register, go } from '../router.js';
import { getState } from '../state.js';
import { on, toast } from '../ui.js';
import { CHAPTERS, TOOLS } from '../data/chapters.js';
import { toolIcon } from '../data/svg.js';
import { gamebar } from './common.js';

register('map', (node) => {
  gamebar(node);
  const s = getState();

  const intro = document.createElement('div');
  intro.className = 'panel flourish';
  intro.style.marginTop = '14px';
  intro.innerHTML = `
    <h2 style="margin:0">Mapa da Investigação</h2>
    <p class="muted">Viaje entre os locais para reunir evidências. Cada caso bem-sucedido
    desbloqueia uma nova ferramenta de laboratório e o próximo local.</p>`;
  node.appendChild(intro);

  const grid = document.createElement('div');
  grid.className = 'map-grid';
  grid.innerHTML = CHAPTERS.map(c => {
    const unlocked = c.n <= s.maxChapterUnlocked;
    const done = s.chapterDone[c.n];
    return `
      <div class="panel location ${unlocked ? '' : 'locked'}" data-chapter="${unlocked ? c.n : ''}">
        ${done ? '<span class="pill leaf lock-tag">✔ Concluído</span>'
               : (!unlocked ? '<span class="pill lock-tag">🔒</span>' : '')}
        <div class="loc-icon">${c.icon}</div>
        <h3 style="margin:0">Cap. ${c.n} — ${c.titulo}</h3>
        <div class="muted">${c.local}</div>
        <p style="margin:6px 0 0;font-size:0.95rem">${c.resumo}</p>
        ${unlocked ? `<button class="btn ${done ? '' : 'primary'} small" style="margin-top:auto" data-enter="${c.n}">
            ${done ? 'Revisitar' : 'Investigar'}</button>` : ''}
      </div>`;
  }).join('');
  node.appendChild(grid);

  // Tool tray
  const tray = document.createElement('div');
  tray.className = 'panel tooltray';
  const toolIds = Object.keys(TOOLS);
  tray.innerHTML = `<strong style="font-family:var(--font-display)">Ferramentas:</strong>` +
    toolIds.map(id => {
      const has = s.toolsUnlocked.includes(id);
      return `<div class="tool">
        <span class="emblem ${has ? '' : 'locked'}" title="${TOOLS[id]}">${toolIcon(id)}</span>
        <span>${has ? TOOLS[id] : '???'}</span>
      </div>`;
    }).join('');
  node.appendChild(tray);

  on(node, 'click', '[data-enter]', (e, t) => go('chapter' + t.dataset.enter));
});
