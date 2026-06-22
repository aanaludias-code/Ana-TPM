/* chapter3.js — Detetive Cromossômico.
   Task A: flag the chromosome with a structural abnormality on the karyotype.
   Task B: use an incomplete-dominance pigment marker to tie the child to a
   family branch (intermediate heterozygote phenotype). */

import { register } from '../router.js';
import { completeChapter, unlockCodex, addEvidence, getState } from '../state.js';
import { on, toast, feedback, note } from '../ui.js';
import { chapterByN } from '../data/chapters.js';
import { phenotypes } from '../genetics/punnett.js';
import { chapterShell } from './common.js';
import { afterChapter } from './chapter1.js';

const ABNORMAL = 9;     // chromosome with a deletion
const MARKER_LOCUS = 11;

register('chapter3', (node) => {
  const ch = chapterByN(3);
  chapterShell(node, ch, (body) => {
    let flagged = null;
    let taskADone = false;

    // ---- Task A: karyotype ----
    const kar = document.createElement('div');
    kar.className = 'panel flourish';
    kar.innerHTML = `
      <h3>A · Cariótipo da criança</h3>
      <p class="muted">Examine os 22 autossomos + par sexual. Sinalize o cromossomo que
      apresenta uma <b>anomalia estrutural</b> (segmento ausente).</p>
      <div class="karyotype">${chromos()}</div>
      <div class="center" style="margin-top:12px">
        <button class="btn primary" id="check-a" disabled>Confirmar cromossomo anômalo</button>
      </div>
      <div id="a-feedback"></div>`;
    body.appendChild(kar);

    on(kar, 'click', '.chromo', (e, t) => {
      flagged = +t.dataset.n;
      kar.querySelectorAll('.chromo').forEach(c => c.classList.remove('flagged'));
      t.classList.add('flagged');
      kar.querySelector('#check-a').disabled = false;
    });

    on(kar, 'click', '#check-a', () => {
      const fb = kar.querySelector('#a-feedback');
      if (flagged === ABNORMAL) {
        fb.innerHTML = feedback(`<strong>Correto!</strong> O cromossomo ${ABNORMAL} mostra uma
          <b>deleção</b> — um segmento perdido, visível pelo braço encurtado e padrão de bandas
          alterado. Anomalias estruturais podem servir de marcador familiar.`, 'good');
        unlockCodex(['cariotipo']);
        taskADone = true;
        taskB.classList.remove('hidden');
        taskB.scrollIntoView({ behavior: 'smooth' });
      } else {
        fb.innerHTML = feedback(`<strong>Não é esse.</strong> Procure o cromossomo cujo braço
          está visivelmente mais curto que seu par homólogo — sinal de deleção.`, 'bad');
      }
    });

    // ---- Task B: incomplete dominance marker ----
    const taskB = document.createElement('div');
    taskB.className = 'panel flourish hidden';
    taskB.innerHTML = `
      <h3>B · O marcador de textura do cabelo (locus ${MARKER_LOCUS})</h3>
      <div class="row">
        <div class="grow" style="min-width:280px">
          <p>Em humanos, a <b>textura do cabelo</b> segue <b>dominância incompleta</b>:
          <span class="pill blood">CC = crespo</span>
          <span class="pill gold">Cc = ondulado</span>
          <span class="pill">cc = liso</span>.</p>
          <p>A criança tem cabelo <b>ondulado (intermediário)</b>. Entre os candidatos,
          apenas <b>Helena Drummond</b> também é <b>ondulada (Cc)</b>; os demais ramos têm
          cabelo crespo ou liso puro.</p>
          <p><b>Pergunta:</b> qual o genótipo da criança para este marcador?</p>
          <div class="row" data-group="geno">
            <div class="card selectable" data-g="CC">CC (crespo)</div>
            <div class="card selectable" data-g="Cc">Cc (ondulado)</div>
            <div class="card selectable" data-g="cc">cc (liso)</div>
          </div>
          <div class="center" style="margin-top:10px"><button class="btn primary" id="check-b">Confirmar genótipo</button></div>
          <div id="b-feedback"></div>
        </div>
        <div style="flex:0 0 300px">
          ${note('Dominância Incompleta', `<ul>
            <li>Heterozigoto = fenótipo <b>intermediário</b></li>
            <li>Cc → <b>ondulado</b>, nem crespo nem liso</li>
            <li>Cruzamento Cc × Cc → 1 crespo : 2 ondulado : 1 liso</li>
          </ul>`, '💇')}
        </div>
      </div>`;
    body.appendChild(taskB);

    let gPick = null;
    on(taskB, 'click', '[data-g]', (e, t) => {
      gPick = t.dataset.g;
      taskB.querySelectorAll('[data-g]').forEach(c => c.classList.remove('chosen'));
      t.classList.add('chosen');
    });

    on(taskB, 'click', '#check-b', () => {
      const fb = taskB.querySelector('#b-feedback');
      if (gPick === 'Cc') {
        // demonstrate the 1:2:1 with a Punnett call for teaching
        const ph = phenotypes('Cc', 'Cc', { mode: 'incomplete' });
        const ratio = `${ph['CC'] || 0} crespo : ${ph['Cc'] || 0} ondulado : ${ph['cc'] || 0} liso`;
        fb.innerHTML = feedback(`<strong>Correto!</strong> Cabelo ondulado só existe em <b>Cc</b>
          (dominância incompleta). Isso liga a criança ao ramo de Helena Drummond.
          Para referência, Cc × Cc produz ${ratio}.`, 'good');
        finish();
      } else {
        fb.innerHTML = feedback(`<strong>Reveja.</strong> Na dominância incompleta o fenótipo
          intermediário (ondulado) corresponde ao heterozigoto. CC seria crespo e cc liso.`, 'bad');
      }
    });

    function finish() {
      if (getState().chapterDone[3]) return;
      addEvidence({ id: 'ev-chromo', chapter: 3, title: 'Marcador cromossômico',
        text: `Deleção no cromossomo ${ABNORMAL} e cabelo ondulado (Cc, dominância incompleta) ligam a criança ao ramo Drummond.` });
      unlockCodex(chapterByN(3).codex);
      completeChapter(3, { insight: 140, tool: chapterByN(3).toolUnlock });
      setTimeout(() => { toast('✦ +140 perspicácia · Sequenciador de DNA desbloqueado!', 'good'); afterChapter(node, 3); }, 700);
    }
  });
});

function chromos() {
  let out = '';
  for (let i = 1; i <= 22; i++) {
    const short = i === ABNORMAL;
    out += chromoSVG(i, short);
  }
  out += chromoSVG('XY', false, true);
  return out;
}

function chromoSVG(n, short, sex = false) {
  const h = short ? 34 : 58;            // shortened arm signals the deletion
  const marker = (n === MARKER_LOCUS) ? '<circle cx="9" cy="20" r="3" fill="#b8893b"/>' : '';
  return `<div class="chromo" data-n="${n}">
    <svg width="22" height="64" viewBox="0 0 18 64">
      <rect x="6" y="${30 - h/2}" width="6" height="${h}" rx="3" fill="#7a2d24" stroke="#2a1d10" stroke-width="1.5"/>
      <circle cx="9" cy="30" r="3.4" fill="#2a1d10"/>
      ${marker}
    </svg>
    <span class="num">${n}</span>
  </div>`;
}
