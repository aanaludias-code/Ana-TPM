/* chapter1.js — O Heredograma Esquecido.
   Player classifies the inheritance pattern (axis + dominance) and assigns
   genotypes to key family members. Validated against pedigree.js. */

import { register, go } from '../router.js';
import { completeChapter, unlockCodex, addEvidence, getState } from '../state.js';
import { on, toast, feedback, note, esc, modal } from '../ui.js';
import { chapterByN } from '../data/chapters.js';
import { renderSVG, possibleGenotypes, findViolations } from '../genetics/pedigree.js';
import { chapterShell } from './common.js';

// --- Puzzle: an X-linked recessive trait (only males affected; carrier mothers) ---
const MEMBERS = [
  { id: 'I-1',  sex: 'M', affected: false, gen: 0, x: 2 },
  { id: 'I-2',  sex: 'F', affected: false, gen: 0, x: 3 },                 // carrier
  { id: 'II-2', sex: 'M', affected: false, gen: 1, x: 0 },                 // married in
  { id: 'II-1', sex: 'F', affected: false, gen: 1, x: 1, parents: ['I-2', 'I-1'] }, // carrier
  { id: 'II-3', sex: 'M', affected: true,  gen: 1, x: 4, parents: ['I-2', 'I-1'] },
  { id: 'II-4', sex: 'F', affected: false, gen: 1, x: 5 },                 // married in
  { id: 'III-1', sex: 'M', affected: true,  gen: 2, x: 0.5, parents: ['II-1', 'II-2'] },
  { id: 'III-2', sex: 'F', affected: false, gen: 2, x: 1.5, parents: ['II-1', 'II-2'] },
  { id: 'III-3', sex: 'F', affected: false, gen: 2, x: 4.5, parents: ['II-4', 'II-3'] }, // obligate carrier
];

const PATTERN = { axis: 'xlinked', dominance: 'recessive' };

// curated genotype questions with required answers + teaching feedback
const GENO_Q = [
  { id: 'II-3', required: 'XaY',  hint: 'Homem afetado por traço X-recessivo é hemizigoto Xᵃ Y.' },
  { id: 'III-1', required: 'XaY', hint: 'Filho afetado de pais não-afetados: recebeu Xᵃ da mãe portadora.' },
  { id: 'I-2',  required: 'XAXa', hint: 'Mãe não-afetada com filho afetado é obrigatoriamente portadora (XᴬXᵃ).' },
  { id: 'III-3', required: 'XAXa', hint: 'Toda filha de homem afetado (Xᵃ Y) herda o Xᵃ dele → portadora obrigatória.' },
];

register('chapter1', (node) => {
  const ch = chapterByN(1);
  chapterShell(node, ch, (body) => {
    const s = getState();

    // Cheat-sheet note + pedigree
    const top = document.createElement('div');
    top.className = 'row';
    top.innerHTML = `
      <div class="panel flourish grow" style="min-width:320px">
        <h3>Heredograma da Família</h3>
        <div class="pedigree">${renderSVG(MEMBERS)}</div>
        <div class="pedigree-legend">
          <span><i class="legend-swatch sq"></i> ♂ Homem</span>
          <span><i class="legend-swatch ci"></i> ♀ Mulher</span>
          <span><i class="legend-swatch sq filled"></i> Afetado</span>
        </div>
      </div>
      <div style="flex:0 0 300px">
        ${note('Pistas de Leitura', `<ul>
          <li>2 pais não-afetados com filho afetado → <b>recessivo</b></li>
          <li>Só homens afetados → suspeite de <b>ligado ao X</b></li>
          <li>Filha de homem afetado X-rec. → <b>portadora</b></li>
        </ul>`, '🔍')}
      </div>`;
    body.appendChild(top);

    // Question 1: axis
    const q = document.createElement('div');
    q.className = 'panel flourish';
    q.innerHTML = `
      <h3>1 · Onde está o gene?</h3>
      <div class="row" data-group="axis">
        <div class="card selectable grow" data-axis="autosomal"><h4>Autossômico</h4>
          <p style="margin:0">Em cromossomo não-sexual; afeta ♂ e ♀ igualmente.</p></div>
        <div class="card selectable grow" data-axis="xlinked"><h4>Ligado ao X</h4>
          <p style="margin:0">No cromossomo X; padrão diferente entre sexos.</p></div>
      </div>
      <h3 style="margin-top:14px">2 · Dominante ou recessivo?</h3>
      <div class="row" data-group="dom">
        <div class="card selectable grow" data-dom="dominant"><h4>Dominante</h4>
          <p style="margin:0">Aparece em toda geração; exige pai/mãe afetado.</p></div>
        <div class="card selectable grow" data-dom="recessive"><h4>Recessivo</h4>
          <p style="margin:0">Pode pular gerações; surge de pais não-afetados.</p></div>
      </div>
      <div id="cls-feedback"></div>`;
    body.appendChild(q);

    let pick = { axis: null, dom: null };
    on(q, 'click', '[data-axis]', (e, t) => {
      pick.axis = t.dataset.axis;
      q.querySelectorAll('[data-axis]').forEach(c => c.classList.remove('chosen'));
      t.classList.add('chosen');
    });
    on(q, 'click', '[data-dom]', (e, t) => {
      pick.dom = t.dataset.dom;
      q.querySelectorAll('[data-dom]').forEach(c => c.classList.remove('chosen'));
      t.classList.add('chosen');
    });

    // Genotype assignment panel (revealed after correct classification)
    const genoPanel = document.createElement('div');
    genoPanel.className = 'panel flourish hidden';
    genoPanel.innerHTML = `<h3>3 · Atribua os genótipos</h3>
      <p class="muted">Com o padrão definido, complete os genótipos dos indivíduos-chave.</p>
      <div id="geno-rows"></div>
      <div class="center" style="margin-top:12px">
        <button class="btn primary" id="check-geno">Validar genótipos</button>
      </div>
      <div id="geno-feedback"></div>`;
    body.appendChild(genoPanel);

    // classification check button
    const clsBtn = document.createElement('div');
    clsBtn.className = 'center';
    clsBtn.innerHTML = `<button class="btn primary" id="check-cls">Confirmar padrão de herança</button>`;
    q.appendChild(clsBtn);

    on(q, 'click', '#check-cls', () => {
      if (!pick.axis || !pick.dom) { toast('Escolha as duas opções.', 'bad'); return; }
      const fb = q.querySelector('#cls-feedback');
      const axisOk = pick.axis === PATTERN.axis;
      const domOk = pick.dom === PATTERN.dominance;
      if (axisOk && domOk) {
        // sanity: no violations under this pattern
        const viol = findViolations(MEMBERS, PATTERN);
        fb.innerHTML = feedback(
          `<strong>Correto!</strong> Apenas homens são afetados e a condição surge de pais
           não-afetados — assinatura de herança <b>ligada ao X, recessiva</b>.
           ${viol.length ? '' : 'Nenhuma inconsistência no heredograma.'}`, 'good');
        unlockCodex(['sex-linked', 'dom-rec', 'heredograma']);
        buildGenoRows();
        genoPanel.classList.remove('hidden');
        genoPanel.scrollIntoView({ behavior: 'smooth' });
      } else {
        const tips = [];
        if (!axisOk) tips.push('Observe quem é afetado: se só homens, pense no cromossomo X.');
        if (!domOk) tips.push('Pais não-afetados com filho afetado indicam alelo recessivo.');
        fb.innerHTML = feedback(`<strong>Ainda não.</strong> ${tips.join(' ')}`, 'bad');
      }
    });

    function buildGenoRows() {
      const rows = genoPanel.querySelector('#geno-rows');
      rows.innerHTML = GENO_Q.map(g => {
        const m = MEMBERS.find(mm => mm.id === g.id);
        const opts = possibleGenotypes(m, PATTERN);
        // include a couple of plausible distractors for females
        const allOpts = m.sex === 'F'
          ? Array.from(new Set([...opts, 'XAXA', 'XAXa', 'XaXa']))
          : Array.from(new Set([...opts, 'XAY', 'XaY']));
        return `<div class="geno-row">
          <span><b>${g.id}</b> — ${m.affected ? 'afetado' : 'não-afetado'} (${m.sex === 'M' ? '♂' : '♀'})</span>
          <select data-geno="${g.id}">
            <option value="">—</option>
            ${allOpts.map(o => `<option value="${o}">${fmtGeno(o)}</option>`).join('')}
          </select>
        </div>`;
      }).join('');
    }

    on(genoPanel, 'click', '#check-geno', () => {
      const fb = genoPanel.querySelector('#geno-feedback');
      const errs = [];
      for (const g of GENO_Q) {
        const sel = genoPanel.querySelector(`[data-geno="${g.id}"]`);
        const val = sel.value;
        const m = MEMBERS.find(mm => mm.id === g.id);
        const row = sel.closest('.geno-row');
        row.classList.remove('chosen', 'wrong');
        // must be phenotype-consistent AND match the deduced required genotype
        const phenoOk = possibleGenotypes(m, PATTERN).includes(val);
        if (val === g.required && phenoOk) { row.classList.add('chosen'); }
        else { row.classList.add('wrong'); errs.push(`${g.id}: ${g.hint}`); }
      }
      if (errs.length === 0) {
        fb.innerHTML = feedback(`<strong>Heredograma resolvido!</strong> Todos os genótipos
          são consistentes com herança X-recessiva. As mães não-afetadas de filhos afetados
          são portadoras obrigatórias.`, 'good');
        finish();
      } else {
        fb.innerHTML = feedback(`<strong>Revise:</strong><ul>${errs.map(e => `<li>${esc(e)}</li>`).join('')}</ul>`, 'bad');
      }
    });

    function finish() {
      if (getState().chapterDone[1]) return;
      addEvidence({ id: 'ev-pedigree', chapter: 1, title: 'Padrão de herança',
        text: 'O traço familiar é ligado ao X, recessivo. Mães não-afetadas de afetados são portadoras (XᴬXᵃ).' });
      completeChapter(1, { insight: 100, tool: 'microscopio', codex: chapterByN(1).codex });
      setTimeout(() => {
        toast('✦ +100 perspicácia · Microscópio desbloqueado!', 'good');
        afterChapter(node, 1);
      }, 600);
    }
  });
});

function fmtGeno(g) {
  return g.replace(/X([AaB])/g, (m, a) => 'X' + sup(a)).replace(/Y([Aa])?/, (m, a) => 'Y' + (a ? sup(a) : ''));
}
function sup(c) { return ({ A: 'ᴬ', a: 'ᵃ', B: 'ᴮ' })[c] || c; }

export function afterChapter(node, n) {
  const next = n + 1;
  modal(`
    <h2>Capítulo ${n} concluído ✔</h2>
    <p>Uma nova ferramenta foi adicionada ao seu laboratório e o próximo local está aberto.</p>
    <div class="center row" style="justify-content:center;margin-top:14px">
      <button class="btn" data-close>Ficar aqui</button>
      ${next <= 5 ? `<button class="btn primary" id="go-next">Ir ao Capítulo ${next} →</button>` : `<button class="btn primary" id="go-end">Ver desfecho →</button>`}
    </div>
  `, {});
  const nx = document.getElementById('go-next');
  const ge = document.getElementById('go-end');
  if (nx) nx.addEventListener('click', () => go('chapter' + next));
  if (ge) ge.addEventListener('click', () => go('ending'));
}
