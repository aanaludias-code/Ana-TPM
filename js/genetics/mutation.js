/* mutation.js — classify the origin of a newly-appearing condition from
   collected evidence clues. Used by Chapter 4.

   Categories:
     'espontanea'  — de novo, no clear external cause, present from birth
     'germinativa' — arose in a parent's germ cells; heritable to offspring
     'somatica'    — in body tissue only (e.g. a tumour); not heritable
     'reparo'      — defective DNA repair (e.g. XP); often UV-linked, recessive */

export const MUTATION_TYPES = {
  espontanea:  'Mutação espontânea (de novo)',
  germinativa: 'Mutação germinativa',
  somatica:    'Mutação somática',
  reparo:      'Falha no reparo de DNA',
};

/**
 * Each evidence clue carries weights toward categories.
 * Player gathers clues; classify() sums the weights of gathered clues and
 * returns the best-supported category plus a confidence margin.
 */
export function classify(gatheredClues) {
  const score = { espontanea: 0, germinativa: 0, somatica: 0, reparo: 0 };
  for (const clue of gatheredClues) {
    for (const [k, v] of Object.entries(clue.weights || {})) {
      score[k] = (score[k] || 0) + v;
    }
  }
  const sorted = Object.entries(score).sort((a, b) => b[1] - a[1]);
  return {
    score,
    best: sorted[0][0],
    margin: sorted[0][1] - (sorted[1] ? sorted[1][1] : 0),
  };
}

/** Whether the player's chosen category matches the evidence's best answer. */
export function check(gatheredClues, chosen, expected) {
  const c = classify(gatheredClues);
  return { correct: chosen === expected, evidenceBest: c.best, score: c.score };
}
