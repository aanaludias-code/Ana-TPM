/* selftest.js — quick console assertions for the genetics modules.
   Run by adding ?selftest to the URL. Logs PASS/FAIL to the console. */

import { cross, phenotypes, probRecessivePhenotype } from './punnett.js';
import { possibleChildABO, possibleChildRh, canBeParents, impossibilityReason } from './blood.js';
import { fraction, combineAnd, combineOr, equals } from './probability.js';
import { possibleGenotypes, findViolations } from './pedigree.js';
import { classify } from './mutation.js';

export function run() {
  let pass = 0, fail = 0;
  const ok = (name, cond) => { cond ? pass++ : fail++; console[cond ? 'log' : 'error'](`${cond ? 'PASS' : 'FAIL'} — ${name}`); };

  // Punnett: Aa x Aa -> 3:1
  const ph = phenotypes('Aa', 'Aa', { mode: 'dominant', dominantAllele: 'A' });
  ok('Aa×Aa → 3 dominante : 1 recessivo',
    ph['dominante (A_)'] === 3 && ph['recessivo'] === 1);
  ok('Aa×Aa → P(aa) = 1/4', equals(probRecessivePhenotype('Aa', 'Aa', 'a'), fraction(1, 4)));

  // Incomplete dominance Rr x Rr -> 1:2:1
  const inc = phenotypes('Rr', 'Rr', { mode: 'incomplete' });
  ok('Rr×Rr (incompleta) → 1:2:1', inc['RR'] === 1 && inc['Rr'] === 2 && inc['rr'] === 1);

  // ABO
  ok('O × O → só O', [...possibleChildABO('O', 'O')].join() === 'O');
  ok('AB nunca de pai O (O×AB não dá O? dá A/B)', !possibleChildABO('O', 'AB').has('O'));
  ok('B × AB pode gerar B', possibleChildABO('B', 'AB').has('B'));
  ok('A × B pode gerar O', possibleChildABO('A', 'B').has('O') === true);

  // Rh
  ok('Rh− × Rh− → só Rh−', [...possibleChildRh('-', '-')].join() === '-');
  ok('Rh+ × Rh− pode gerar Rh+', possibleChildRh('+', '-').has('+'));

  // canBeParents (baby B+)
  const child = { abo: 'B', rh: '+' };
  ok('Drummond B+ × AB− pode ser pais de B+',
    canBeParents(child, { abo: 'B', rh: '+' }, { abo: 'AB', rh: '-' }));
  ok('Valverde O+ × O− NÃO pode gerar B+',
    !canBeParents(child, { abo: 'O', rh: '+' }, { abo: 'O', rh: '-' }));
  ok('Reinwald A− × A− NÃO pode gerar B+',
    !canBeParents(child, { abo: 'A', rh: '-' }, { abo: 'A', rh: '-' }));
  ok('impossibilityReason dá mensagem p/ O×O',
    !!impossibilityReason(child, { abo: 'O', rh: '+' }, { abo: 'O', rh: '-' }));

  // Probability combine
  ok('1/2 e 1/2 = 1/4', equals(combineAnd(fraction(1, 2), fraction(1, 2)), fraction(1, 4)));
  ok('1/4 ou 1/4 = 1/2', equals(combineOr(fraction(1, 4), fraction(1, 4)), fraction(1, 2)));

  // Pedigree X-linked recessive genotypes
  ok('Homem afetado X-rec → XaY',
    possibleGenotypes({ sex: 'M', affected: true }, { axis: 'xlinked', dominance: 'recessive' }).join() === 'XaY');
  ok('Mulher afetada X-rec → XaXa',
    possibleGenotypes({ sex: 'F', affected: true }, { axis: 'xlinked', dominance: 'recessive' }).join() === 'XaXa');

  // Mutation classify -> de novo scenario
  const clues = [
    { weights: { espontanea: 2, germinativa: 2, somatica: -3 } },
    { weights: { espontanea: 3, germinativa: -2 } },
    { weights: { reparo: -3, espontanea: 1 } },
  ];
  ok('Classificação de evidências → espontânea', classify(clues).best === 'espontanea');

  console.log(`\nSelf-test: ${pass} passaram, ${fail} falharam.`);
  return { pass, fail };
}
