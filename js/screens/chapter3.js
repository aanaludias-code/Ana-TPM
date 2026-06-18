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
      <h3>B · O marcador de pigmento (locus ${MARKER_LOCUS})</h3>
      <div class="row">
        <div class="grow" style="min-width:280px">
          <p>Um marcador de pigmento floral herdado segue <b>dominância incompleta</b>:
          <span class="pill blood">RR = vermelho</span>
          <span class="pill gold">Rr = rosa</span>
          <span class="pill">rr = branco</span>.</p>
          <p>A criança expressa o fenótipo <b>rosa (intermediário)</b>. Entre os candidatos,
          apenas <b>Helena Drummond</b> também é <b>rosa (Rr)</b>; os demais ramos são vermelhos
          ou brancos puros.</p>
          <p><b>Pergunta:</b> qual o genótipo da criança para este marcador?</p>
          <div class="row" data-group="geno">
            <div class="card selectable" data-g="RR">RR (vermelho)</div>
            <div class="card selectable" data-g="Rr">Rr (rosa)</div>
            <div class="card selectable" data-g="rr">rr (branco)</div>
          </div>
          <div class="center" style="margin-top:10px"><button class="btn primary" id="check-b">Confirmar genótipo</button></div>
          <div id="b-feedback"></div>
        </div>
        <div style="flex:0 0 300px">
          ${note('Dominância Incompleta', `<ul>
            <li>Heterozigoto = fenótipo <b>intermediário</b></li>
            <li>Rr → <b>rosa</b>, nem vermelho nem branco</li>
            <li>Cruzamento Rr × Rr → 1 vermelho : 2 rosa : 1 branco</li>
          </ul>`, '🌸')}
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
      if (gPick === 'Rr') {
        // demonstrate the 1:2:1 with a Punnett call for teaching
        const ph = phenotypes('Rr', 'Rr', { mode: 'incomplete' });
        const ratio = `${ph['RR'] || 0} vermelho : ${ph['Rr'] || 0} rosa : ${ph['rr'] || 0} branco`;
        fb.innerHTML = feedback(`<strong>Correto!</strong> Fenótipo rosa só existe em <b>Rr</b>
          (dominância incompleta). Isso liga a criança ao ramo de Helena Drummond.
          Para referência, Rr × Rr produz ${ratio}.`, 'good');
        finish();
      } else {
        fb.innerHTML = feedback(`<strong>Reveja.</strong> Na dominância incompleta o fenótipo
          intermediário (rosa) corresponde ao heterozigoto. RR seria vermelho e rr branco.`, 'bad');
      }
    });

    function finish() {
      if (getState().chapterDone[3]) return;
      addEvidence({ id: 'ev-chromo', chapter: 3, title: 'Marcador cromossômico',
        text: `Deleção no cromossomo ${ABNORMAL} e marcador de pigmento rosa (Rr, dominância incompleta) ligam a criança ao ramo Drummond.` });
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
