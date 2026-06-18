/* chapter5.js — A Linhagem Final.
   Recap all evidence, solve a probability capstone for the deduced couple,
   then name the biological parents and reconstruct the family tree. */

import { register, go } from '../router.js';
import { completeChapter, unlockCodex, getState, save } from '../state.js';
import { on, toast, feedback, note, esc } from '../ui.js';
import { chapterByN } from '../data/chapters.js';
import { fraction, combineAnd, format, equals } from '../genetics/probability.js';
import { FAMILIES, BABY, TRUTH } from '../data/characters.js';
import { chapterShell } from './common.js';

register('chapter5', (node) => {
  const ch = chapterByN(5);
  chapterShell(node, ch, (body) => {
    const s = getState();

    // ---- Evidence recap ----
    const recap = document.createElement('div');
    recap.className = 'panel flourish';
    recap.innerHTML = `<h3>Dossiê reunido</h3>
      ${s.evidence.length ? `<div class="stack">${s.evidence.map(e => `
        <div class="card"><h4>Cap. ${e.chapter} — ${e.title}</h4><p style="margin:0">${e.text}</p></div>`).join('')}</div>`
      : `<p class="muted">Você ainda não coletou evidências nos capítulos anteriores.</p>`}`;
    body.appendChild(recap);

    // ---- Probability capstone ----
    const prob = document.createElement('div');
    prob.className = 'panel flourish';
    prob.innerHTML = `
      <h3>Prova final de probabilidade</h3>
      <div class="row">
        <div class="grow" style="min-width:280px">
          <p>Para o casal compatível — <b>Helena (Iᴮi, Rh Dd)</b> × <b>Rafael (IᴬIᴮ, Rh dd)</b> —
          calcule a probabilidade de um filho ser exatamente <b>${BABY.blood.abo}${BABY.blood.rh}</b>.</p>

          <p><b>1) P(tipo B):</b></p>
          <div class="row" data-group="pb">
            <div class="card selectable" data-pb="1/4">1/4</div>
            <div class="card selectable" data-pb="1/2">1/2</div>
            <div class="card selectable" data-pb="3/4">3/4</div>
          </div>

          <p style="margin-top:10px"><b>2) P(Rh+):</b></p>
          <div class="row" data-group="prh">
            <div class="card selectable" data-prh="1/4">1/4</div>
            <div class="card selectable" data-prh="1/2">1/2</div>
            <div class="card selectable" data-prh="1/1">1 (certo)</div>
          </div>

          <p style="margin-top:10px"><b>3) P(B e Rh+) combinada:</b></p>
          <div class="row" data-group="pcomb">
            <div class="card selectable" data-pcomb="1/8">1/8</div>
            <div class="card selectable" data-pcomb="1/4">1/4</div>
            <div class="card selectable" data-pcomb="1/2">1/2</div>
          </div>

          <div class="center" style="margin-top:12px"><button class="btn primary" id="check-prob">Verificar cálculo</button></div>
          <div id="prob-feedback"></div>
        </div>
        <div style="flex:0 0 300px">
          ${note('Regra do "e"', `<ul>
            <li>Eventos independentes: <b>multiplique</b></li>
            <li>Iᴮi × IᴬIᴮ → B = Iᴮ·(Iᴬ ou Iᴮ)</li>
            <li>Dd × dd → metade Rh+</li>
          </ul>`, '🎲')}
        </div>
      </div>`;
    body.appendChild(prob);

    const pick = { pb: null, prh: null, pcomb: null };
    ['pb', 'prh', 'pcomb'].forEach(group => {
      on(prob, 'click', `[data-${group}]`, (e, t) => {
        pick[group] = t.dataset[group];
        prob.querySelectorAll(`[data-${group}]`).forEach(c => c.classList.remove('chosen'));
        t.classList.add('chosen');
      });
    });

    let probSolved = false;
    on(prob, 'click', '#check-prob', () => {
      const fb = prob.querySelector('#prob-feedback');
      const pb = parseFrac(pick.pb), prh = parseFrac(pick.prh), pc = parseFrac(pick.pcomb);
      if (!pb || !prh || !pc) { toast('Responda os três itens.', 'bad'); return; }
      const okB = equals(pb, fraction(1, 2));
      const okRh = equals(prh, fraction(1, 2));
      const expectedComb = combineAnd(fraction(1, 2), fraction(1, 2)); // 1/4
      const okC = equals(pc, expectedComb);
      if (okB && okRh && okC) {
        fb.innerHTML = feedback(`<strong>Cálculo correto!</strong>
          P(B) = 1/2 (Iᴮi × IᴬIᴮ → AB, B, A, B → 2/4 são B).
          P(Rh+) = 1/2 (Dd × dd → metade D_).
          Como são independentes, P(B e Rh+) = 1/2 × 1/2 = <b>${format(expectedComb)}</b>.
          O resultado B+ é plenamente possível para este casal.`, 'good');
        probSolved = true;
        accuse.classList.remove('hidden');
        accuse.scrollIntoView({ behavior: 'smooth' });
      } else {
        const tips = [];
        if (!okB) tips.push('Liste os 4 descendentes de Iᴮi × IᴬIᴮ e conte quantos são B.');
        if (!okRh) tips.push('Dd × dd: metade recebe D (Rh+), metade dd (Rh−).');
        if (!okC) tips.push('Para "B e Rh+", multiplique as duas probabilidades.');
        fb.innerHTML = feedback(`<strong>Reveja.</strong> ${tips.join(' ')}`, 'bad');
      }
    });

    // ---- Accusation ----
    const accuse = document.createElement('div');
    accuse.className = 'panel flourish hidden';
    accuse.innerHTML = `<h3>Nomeie os pais biológicos</h3>
      <p class="muted">Com todas as provas convergindo, aponte a família da criança.</p>
      <div class="row" data-group="fam">
        ${FAMILIES.map(f => `<div class="card selectable grow" data-fam="${f.id}">
          <h4 style="color:${f.cor}">${f.nome}</h4>
          <p style="margin:0">${esc(f.membros[0].nome)} & ${esc(f.membros[1].nome)}</p>
        </div>`).join('')}
      </div>
      <div class="center" style="margin-top:12px"><button class="btn primary" id="accuse-btn" disabled>Acusar esta linhagem</button></div>
      <div id="accuse-feedback"></div>`;
    body.appendChild(accuse);

    let famPick = null;
    on(accuse, 'click', '[data-fam]', (e, t) => {
      famPick = t.dataset.fam;
      accuse.querySelectorAll('[data-fam]').forEach(c => c.classList.remove('chosen'));
      t.classList.add('chosen');
      accuse.querySelector('#accuse-btn').disabled = false;
    });

    on(accuse, 'click', '#accuse-btn', () => {
      const fb = accuse.querySelector('#accuse-feedback');
      if (famPick === TRUTH.familia) {
        fb.innerHTML = feedback(`<strong>Linhagem confirmada!</strong> Todas as evidências —
          heredograma, exclusão por sangue, marcador cromossômico, mutação de novo e o cálculo
          de probabilidade — convergem para a <b>${FAMILIES.find(f=>f.id===TRUTH.familia).nome}</b>.`, 'good');
        unlockCodex(chapterByN(5).codex);
        if (!getState().chapterDone[5]) {
          completeChapter(5, { insight: 200 });
          getState().lineageSolved = true; save();
        }
        setTimeout(() => go('ending'), 1100);
      } else {
        fb.innerHTML = feedback(`<strong>As provas não sustentam essa acusação.</strong>
          Revise a exclusão por sangue (Cap. 2) e o marcador cromossômico (Cap. 3) — eles
          eliminam essa família.`, 'bad');
      }
    });
  });
});

function parseFrac(str) {
  if (!str) return null;
  const [n, d] = str.split('/').map(Number);
  return fraction(n, d);
}
