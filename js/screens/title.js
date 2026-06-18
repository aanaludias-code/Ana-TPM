/* title.js — storybook cover screen. */

import { register, go } from '../router.js';
import { hasSave, reset, load } from '../state.js';
import { on, modal } from '../ui.js';
import { CREST } from '../data/svg.js';

register('title', (node) => {
  const cont = hasSave();
  node.innerHTML = `
    <div class="title-screen">
      <div class="crest-big">🜂</div>
      <div style="width:120px;margin:0 auto">${CREST}</div>
      <h1>Herdeiro Genético</h1>
      <div class="subtitle">A Linhagem Perdida</div>
      <div class="menu">
        <button class="btn primary" data-act="new">📖 Nova Investigação</button>
        <button class="btn ${cont ? '' : 'ghost'}" data-act="continue" ${cont ? '' : 'disabled'}>
          ${cont ? '↪️ Continuar' : 'Continuar (sem progresso salvo)'}
        </button>
        <button class="btn ghost" data-act="about">❧ Sobre o Jogo</button>
      </div>
      <div class="panel flourish blurb">
        <p>Numa cidade onde linhagens antigas guardam segredos, uma criança é encontrada
        em circunstâncias misteriosas. Você é um jovem investigador genético: através de
        heredogramas, exames de sangue, cariótipos e análise de mutações, descubra a
        verdadeira origem biológica da criança.</p>
        <p class="muted">Jogo educativo de Genética • Biologia, Biomedicina, Medicina e Veterinária</p>
      </div>
    </div>
  `;

  on(node, 'click', '[data-act]', (e, t) => {
    const act = t.dataset.act;
    if (act === 'new') { reset(); go('protagonist'); }
    if (act === 'continue') { if (load()) go('map'); }
    if (act === 'about') showAbout();
  });
});

function showAbout() {
  modal(`
      <h2>Sobre o Jogo</h2>
      <p>Cada capítulo apresenta um desafio real de genética — não um questionário.
      Você constrói heredogramas, preenche genótipos, calcula probabilidades, interpreta
      exames laboratoriais e compara hipóteses para justificar suas conclusões com evidências.</p>
      <p><strong>Conceitos abordados:</strong> Leis de Mendel, dominância/recessividade,
      dominância incompleta, codominância, alelos múltiplos, sistema ABO, fator Rh, herança
      ligada ao sexo, herança autossômica, análise de heredograma, mapeamento cromossômico,
      mutações, reparo de DNA, probabilidade e aconselhamento genético.</p>
      <div class="center" style="margin-top:14px"><button class="btn" data-close>Fechar</button></div>
    `);
}
