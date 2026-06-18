/* chapter4.js — O Mistério da Mutação.
   Player gathers forensic clues, then classifies the origin of the child's
   new condition: spontaneous (de novo), germline, somatic, or DNA-repair
   defect. classify() in mutation.js scores the evidence. */

import { register } from '../router.js';
import { completeChapter, unlockCodex, addEvidence, getState } from '../state.js';
import { on, toast, feedback, note, esc } from '../ui.js';
import { chapterByN } from '../data/chapters.js';
import { MUTATION_TYPES, classify, check } from '../genetics/mutation.js';
import { BABY } from '../data/characters.js';
import { chapterShell } from './common.js';
import { afterChapter } from './chapter1.js';

const EXPECTED = 'espontanea';

const CLUES = [
  { id: 'tecidos', label: 'Comparar sangue e pele da criança',
    found: 'A alteração está em TODAS as células (sangue e pele) — não restrita a um tecido.',
    weights: { espontanea: 2, germinativa: 2, somatica: -3 } },
  { id: 'pais-sangue', label: 'Sequenciar o sangue de ambos os pais',
    found: 'A mutação está AUSENTE no sangue de Helena e Rafael.',
    weights: { espontanea: 2, germinativa: 1, somatica: -1 } },
  { id: 'germinativa', label: 'Triagem das células germinativas dos pais',
    found: 'Triagem germinativa dos pais: NEGATIVA — nenhum dos pais a carrega.',
    weights: { espontanea: 3, germinativa: -2 } },
  { id: 'reparo', label: 'Sequenciar genes de reparo de DNA (via XP)',
    found: 'Os genes de reparo de DNA estão NORMAIS — sem defeito tipo Xeroderma Pigmentoso.',
    weights: { reparo: -3, espontanea: 1 } },
  { id: 'historico', label: 'Revisar histórico familiar e consanguinidade',
    found: 'SEM histórico familiar e SEM consanguinidade entre os pais.',
    weights: { reparo: -2, germinativa: -1, espontanea: 1 } },
];

register('chapter4', (node) => {
  const ch = chapterByN(4);
  chapterShell(node, ch, (body) => {
    const gathered = [];

    const intro = document.createElement('div');
    intro.className = 'row';
    intro.innerHTML = `
      <div class="panel flourish grow" style="min-width:300px">
        <h3>O sintoma inédito</h3>
        <p>A criança apresenta <b>${esc(BABY.condicao)}</b> — uma condição ausente em todas as
        gerações anteriores das famílias. De onde veio?</p>
        <p class="muted">Reúna evidências no banco de mutações antes de classificar a origem.</p>
      </div>
      <div style="flex:0 0 320px">
        ${note('Tipos de Mutação', `<ul>
          <li><b>Espontânea (de novo):</b> nova, ausente nos pais</li>
          <li><b>Germinativa:</b> herdada de gameta de um genitor portador</li>
          <li><b>Somática:</b> só em um tecido; não hereditária</li>
          <li><b>Falha de reparo:</b> defeito em genes de reparo do DNA</li>
        </ul>`, '⚠️')}
      </div>`;
    body.appendChild(intro);

    const lab = document.createElement('div');
    lab.className = 'panel flourish';
    lab.innerHTML = `<h3>Banco de Mutações — coletar evidências</h3>
      <div class="row">${CLUES.map(c => `
        <button class="btn small" data-clue="${c.id}">🔬 ${c.label}</button>`).join('')}</div>
      <div class="readout" id="findings" style="margin-top:12px">Nenhuma evidência coletada ainda.</div>`;
    body.appendChild(lab);

    const decide = document.createElement('div');
    decide.className = 'panel flourish';
    decide.innerHTML = `<h3>Classifique a origem da mutação</h3>
      <p class="muted">Colete ao menos 3 evidências antes de concluir.</p>
      <div class="row" data-group="type">
        ${Object.entries(MUTATION_TYPES).map(([k, v]) => `
          <div class="card selectable grow" data-type="${k}"><h4>${v}</h4></div>`).join('')}
      </div>
      <div class="center" style="margin-top:12px">
        <button class="btn primary" id="conclude4" disabled>Concluir classificação</button>
      </div>
      <div id="c4-feedback"></div>`;
    body.appendChild(decide);

    let chosen = null;
    function refreshFindings() {
      const fEl = lab.querySelector('#findings');
      fEl.textContent = gathered.length
        ? gathered.map(c => '• ' + c.found).join('\n')
        : 'Nenhuma evidência coletada ainda.';
      decide.querySelector('#conclude4').disabled = !(chosen && gathered.length >= 3);
    }

    on(lab, 'click', '[data-clue]', (e, t) => {
      const clue = CLUES.find(c => c.id === t.dataset.clue);
      if (!gathered.includes(clue)) { gathered.push(clue); t.disabled = true; t.classList.add('ghost'); }
      refreshFindings();
    });

    on(decide, 'click', '[data-type]', (e, t) => {
      chosen = t.dataset.type;
      decide.querySelectorAll('[data-type]').forEach(c => c.classList.remove('chosen'));
      t.classList.add('chosen');
      refreshFindings();
    });

    on(decide, 'click', '#conclude4', () => {
      const fb = decide.querySelector('#c4-feedback');
      const res = check(gathered, chosen, EXPECTED);
      if (res.correct) {
        fb.innerHTML = feedback(`<strong>Correto — mutação espontânea (de novo).</strong>
          A alteração está em todas as células da criança (logo, não é somática), está ausente
          no sangue E nas células germinativas dos pais (logo, não foi herdada), e os genes de
          reparo são normais (não é falha de reparo). Surgiu nova, num gameta, sem causa
          herdada — uma mutação de novo.`, 'good');
        finish();
      } else {
        const tips = {
          somatica: 'Mutação somática ficaria restrita a um tecido — mas ela está em todas as células.',
          germinativa: 'Germinativa herdada exigiria um dos pais portador — a triagem germinativa foi negativa.',
          reparo: 'Falha de reparo apareceria com genes de reparo defeituosos — eles estão normais.',
          espontanea: '',
        };
        fb.innerHTML = feedback(`<strong>Reveja as evidências.</strong> ${tips[chosen] || ''}
          A evidência aponta para <em>${MUTATION_TYPES[res.evidenceBest]}</em>.`, 'bad');
      }
    });
  });

  function finish() {
    if (getState().chapterDone[4]) return;
    addEvidence({ id: 'ev-mut', chapter: 4, title: 'Origem da mutação',
      text: 'A condição da criança é uma mutação espontânea (de novo): ausente nos pais e nas células germinativas, reparo de DNA normal.' });
    unlockCodex(chapterByN(4).codex);
    completeChapter(4, { insight: 160, tool: chapterByN(4).toolUnlock });
    setTimeout(() => { toast('✦ +160 perspicácia · Reconstrutor de Árvore desbloqueado!', 'good'); afterChapter(node, 4); }, 700);
  }
});
