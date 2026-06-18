/* journal.js — evidence log + Códice da Genética (concept reference). */

import { register } from '../router.js';
import { getState } from '../state.js';
import { CODEX } from '../data/codex.js';
import { gamebar } from './common.js';

register('journal', (node) => {
  gamebar(node);
  const s = getState();

  const evWrap = document.createElement('div');
  evWrap.className = 'panel flourish';
  evWrap.style.marginTop = '14px';
  evWrap.innerHTML = `<h2>📜 Diário de Evidências</h2>` + (
    s.evidence.length
      ? `<div class="stack">${s.evidence.map(e => `
          <div class="card"><h4>Cap. ${e.chapter} — ${e.title}</h4><p style="margin:0">${e.text}</p></div>
        `).join('')}</div>`
      : `<p class="muted">Nenhuma evidência coletada ainda. Comece a investigar no mapa.</p>`
  );
  node.appendChild(evWrap);

  const codexWrap = document.createElement('div');
  codexWrap.className = 'panel flourish';
  codexWrap.style.marginTop = '16px';
  codexWrap.innerHTML = `<h2>📚 Códice da Genética</h2>
    <p class="muted">Conceitos são revelados conforme você os encontra na investigação.</p>
    <div class="codex-list">${CODEX.map(c => {
      const unlocked = s.codexUnlocked.includes(c.id);
      return `<div class="card codex-entry ${unlocked ? '' : 'locked'}">
        <h4>${unlocked ? c.titulo : '🔒 Conceito bloqueado'}</h4>
        ${unlocked ? `<p style="margin:0">${c.texto}</p>`
                   : `<p class="lock" style="margin:0">Descubra-o em campo (Cap. ${c.chapter}).</p>`}
      </div>`;
    }).join('')}</div>`;
  node.appendChild(codexWrap);
});
