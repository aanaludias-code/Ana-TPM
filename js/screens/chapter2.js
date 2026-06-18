/* chapter2.js — Laços de Sangue.
   Player runs the blood-typing kit and judges each candidate couple as
   compatible or impossible for the baby (B+), justified by ABO/Rh rules. */

import { register, go } from '../router.js';
import { completeChapter, unlockCodex, addEvidence, getState } from '../state.js';
import { on, toast, feedback, note, esc } from '../ui.js';
import { chapterByN } from '../data/chapters.js';
import { canBeParents, impossibilityReason, possibleChildABO, possibleChildRh, fullType } from '../genetics/blood.js';
import { BABY, FAMILIES } from '../data/characters.js';
import { chapterShell } from './common.js';
import { afterChapter } from './chapter1.js';

register('chapter2', (node) => {
  const ch = chapterByN(2);
  chapterShell(node, ch, (body) => {
    const child = BABY.blood; // {abo:'B', rh:'+'}

    const intro = document.createElement('div');
    intro.className = 'row';
    intro.innerHTML = `
      <div class="panel flourish grow" style="min-width:300px">
        <h3>Resultado da criança</h3>
        <p style="font-size:1.3rem">Tipo sanguíneo: <span class="pill blood">${fullType(child)}</span></p>
        <p class="muted">Cada casal foi tipado. Decida quais combinações são biologicamente
        possíveis como pais — e quais devem ser eliminadas.</p>
      </div>
      <div style="flex:0 0 320px">
        ${note('Regras do Sangue', `<ul>
          <li>O × O → só filhos <b>O</b></li>
          <li>Filho <b>AB</b> nunca tem pai/mãe O</li>
          <li>Rh− × Rh− → só filhos <b>Rh−</b></li>
          <li>Iᴬ e Iᴮ são <b>codominantes</b></li>
        </ul>`, '🩸')}
      </div>`;
    body.appendChild(intro);

    const couples = FAMILIES.map(f => {
      const [a, b] = f.membros;
      return { fam: f, a, b, possible: canBeParents(child, a.blood, b.blood) };
    });

    const decided = {};   // famId -> 'compativel' | 'impossivel'

    const grid = document.createElement('div');
    grid.className = 'panel flourish';
    grid.innerHTML = `<h3>Casais candidatos</h3>
      <div class="blood-cross">${couples.map(c => `
        <div class="card" data-fam="${c.fam.id}">
          <h4 style="color:${c.fam.cor}">${c.fam.nome}</h4>
          <p style="margin:4px 0">
            ${esc(c.a.nome)} <span class="pill blood">${fullType(c.a.blood)}</span><br>
            ${esc(c.b.nome)} <span class="pill blood">${fullType(c.b.blood)}</span>
          </p>
          <div class="row" style="gap:8px">
            <button class="btn success small" data-decide="compativel" data-fam="${c.fam.id}">✔ Compatível</button>
            <button class="btn small" data-decide="impossivel" data-fam="${c.fam.id}">✘ Impossível</button>
          </div>
          <div class="verdict" data-verdict="${c.fam.id}"></div>
        </div>`).join('')}</div>
      <div class="center" style="margin-top:14px">
        <button class="btn primary" id="conclude" disabled>Concluir análise</button>
      </div>
      <div id="c2-feedback"></div>`;
    body.appendChild(grid);

    on(grid, 'click', '[data-decide]', (e, t) => {
      const famId = t.dataset.fam;
      const decision = t.dataset.decide;
      const c = couples.find(x => x.fam.id === famId);
      const correct = (decision === 'compativel') === c.possible;
      const vEl = grid.querySelector(`[data-verdict="${famId}"]`);
      const card = grid.querySelector(`.card[data-fam="${famId}"]`);
      card.classList.remove('wrong', 'chosen');

      if (correct) {
        decided[famId] = decision;
        card.classList.add('chosen');
        if (c.possible) {
          vEl.innerHTML = feedback(`<strong>Correto — compatível.</strong>
            Filhos possíveis (ABO): ${[...possibleChildABO(c.a.blood.abo, c.b.blood.abo)].join(', ')};
            Rh: ${[...possibleChildRh(c.a.blood.rh, c.b.blood.rh)].join(', ')}.
            Inclui ${fullType(child)}.`, 'good');
        } else {
          vEl.innerHTML = feedback(`<strong>Correto — eliminado.</strong>
            ${esc(impossibilityReason(child, c.a.blood, c.b.blood))}`, 'good');
        }
      } else {
        card.classList.add('wrong');
        const reason = impossibilityReason(child, c.a.blood, c.b.blood);
        vEl.innerHTML = feedback(`<strong>Reveja.</strong> ` +
          (c.possible
            ? `Este casal <em>pode</em> gerar ${fullType(child)} — não elimine ainda.`
            : esc(reason)), 'bad');
        delete decided[famId];
      }
      const all = couples.every(x => decided[x.fam.id]);
      grid.querySelector('#conclude').disabled = !all;
    });

    on(grid, 'click', '#conclude', () => {
      const fb = grid.querySelector('#c2-feedback');
      const survivor = couples.find(c => c.possible);
      fb.innerHTML = feedback(`<strong>Análise concluída.</strong> Dois casais foram
        eliminados pelo sangue. Resta <b>${survivor.fam.nome}</b> como compatível —
        mas a compatibilidade sanguínea <em>não prova</em> a paternidade; ela apenas
        <em>exclui</em> os impossíveis. Será preciso mais evidência.`, 'good');
      unlockCodex(chapterByN(2).codex);
      if (!getState().chapterDone[2]) {
        addEvidence({ id: 'ev-blood', chapter: 2, title: 'Exclusão por sangue',
          text: `Criança ${fullType(child)}. Casa Valverde (O×O) e Casa Reinwald (A−×A−) eliminadas. Casa Drummond (B+ × AB−) compatível.` });
        completeChapter(2, { insight: 120, tool: chapterByN(2).toolUnlock, codex: chapterByN(2).codex });
        setTimeout(() => { toast('✦ +120 perspicácia · Analisador de Cromossomos desbloqueado!', 'good'); afterChapter(node, 2); }, 700);
      }
    });
  });
});
