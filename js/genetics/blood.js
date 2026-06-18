/* blood.js — ABO blood group (multiple alleles + codominance) and
   Rh factor (simple dominant) inheritance.

   ABO alleles: 'A' (Iᴬ), 'B' (Iᴮ), 'i' (recessive i).
   Genotype examples: 'AA','Ai','BB','Bi','AB','ii'.
   Rh genotype: pair of '+' (D, dominant) and '-' (d). */

const ABO_PHENO = {
  AA: 'A', Ai: 'A', iA: 'A',
  BB: 'B', Bi: 'B', iB: 'B',
  AB: 'AB', BA: 'AB',
  ii: 'O',
};

export function aboPhenotype(geno) {
  const key = geno.length === 2 ? geno : geno;
  return ABO_PHENO[key] || ABO_PHENO[geno[1] + geno[0]] || '?';
}

/** All ABO genotypes that produce a given phenotype. */
export function aboGenotypesFor(pheno) {
  switch (pheno) {
    case 'A':  return ['AA', 'Ai'];
    case 'B':  return ['BB', 'Bi'];
    case 'AB': return ['AB'];
    case 'O':  return ['ii'];
    default:   return [];
  }
}

function gametes(geno) { return [geno[0], geno[1]]; }

/** Set of possible child ABO phenotypes from two parent phenotypes. */
export function possibleChildABO(phenoA, phenoB) {
  const result = new Set();
  for (const gA of aboGenotypesFor(phenoA)) {
    for (const gB of aboGenotypesFor(phenoB)) {
      for (const a of gametes(gA)) {
        for (const b of gametes(gB)) {
          result.add(aboPhenotype(a + b));
        }
      }
    }
  }
  return result;
}

/** Rh: '+' dominant. Phenotypes from genotype pair of '+'/'-'. */
export function rhPhenotype(geno) { return geno.includes('+') ? '+' : '-'; }

export function rhGenotypesFor(pheno) {
  return pheno === '+' ? ['++', '+-'] : ['--'];
}

export function possibleChildRh(phenoA, phenoB) {
  const result = new Set();
  for (const gA of rhGenotypesFor(phenoA)) {
    for (const gB of rhGenotypesFor(phenoB)) {
      for (const a of gametes(gA)) {
        for (const b of gametes(gB)) {
          result.add(a === '+' || b === '+' ? '+' : '-');
        }
      }
    }
  }
  return result;
}

/**
 * Can a (motherType, fatherType) pair biologically produce childType?
 * Types are objects like { abo:'A', rh:'+' }.
 */
export function canBeParents(child, p1, p2) {
  const abo = possibleChildABO(p1.abo, p2.abo).has(child.abo);
  const rh = possibleChildRh(p1.rh, p2.rh).has(child.rh);
  return abo && rh;
}

/** Human-readable reason a pairing is impossible (or null if possible). */
export function impossibilityReason(child, p1, p2) {
  if (!possibleChildABO(p1.abo, p2.abo).has(child.abo)) {
    return `Pais ${p1.abo} × ${p2.abo} não podem gerar filho do tipo ${child.abo}.`;
  }
  if (!possibleChildRh(p1.rh, p2.rh).has(child.rh)) {
    return `Pais Rh${p1.rh} × Rh${p2.rh} não podem gerar filho Rh${child.rh} ` +
           `(dois pais Rh− só geram filhos Rh−).`;
  }
  return null;
}

export function fullType(t) { return `${t.abo}${t.rh}`; }
