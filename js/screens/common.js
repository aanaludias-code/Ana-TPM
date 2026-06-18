/* common.js — shared screen fragments: top game bar, objective banner,
   chapter scaffolding used by every chapter screen. */

import { getState, unlockTool } from '../state.js';
import { go } from '../router.js';
import { getProtagonist } from '../data/protagonists.js';
import { avatar, CREST } from '../data/svg.js';
import { on } from '../ui.js';

export function gamebar(node) {
  const s = getState();
  const p = getProtagonist(s.protagonist);
  const bar = document.createElement('div');
  bar.className = 'gamebar';
  bar.innerHTML = `
    <span class="crest" title="${p.name}" style="width:38px;display:inline-block">${avatar({ ...p.traits })}</span>
    <span class="title">Herdeiro Genético</span>
    <span class="spacer"></span>
    <span class="insight pill gold" title="Pontos de perspicácia">✦ ${s.insight}</span>
    <button class="btn small" data-go="map">🗺️ Mapa</button>
    <button class="btn small ghost" data-go="journal">📜 Diário</button>
  `;
  node.appendChild(bar);
  on(bar, 'click', '[data-go]', (e, t) => go(t.dataset.go));
  return bar;
}

export function objective(text) {
  const el = document.createElement('div');
  el.className = 'objective';
  el.innerHTML = `<span class="obj-icon">🎯</span><div><strong>Objetivo:</strong> ${text}</div>`;
  return el;
}

export function chapterShell(node, chapter, bodyFn) {
  if (chapter.tool) unlockTool(chapter.tool); // grant the tool this chapter uses
  gamebar(node);
  const head = document.createElement('div');
  head.className = 'panel flourish';
  head.style.marginTop = '14px';
  head.innerHTML = `
    <div class="row" style="align-items:center">
      <div style="font-size:2.4rem">${chapter.icon}</div>
      <div class="grow">
        <h2 style="margin:0">Capítulo ${chapter.n} — ${chapter.titulo}</h2>
        <div class="muted">${chapter.local}</div>
      </div>
    </div>
    <p style="margin-top:10px">${chapter.resumo}</p>
  `;
  node.appendChild(head);
  node.appendChild(objective(chapter.objetivo));
  const body = document.createElement('div');
  body.className = 'stack';
  body.style.marginTop = '16px';
  node.appendChild(body);
  bodyFn(body);
}
