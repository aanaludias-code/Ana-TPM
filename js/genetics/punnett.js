/* punnett.js — single-gene crosses with support for dominant/recessive,
   incomplete dominance and codominance.

   A genotype is a 2-char string of alleles, e.g. "Aa", "AA", "aa".
   For multiple-allele systems (like ABO) any single-letter tokens work,
   but blood.js handles ABO/Rh specifically. */

/** All gametes (single alleles) from a genotype. */
export function gametes(genotype) {
  return [genotype[0], genotype[1]];
}

/** Normalise a 2-allele genotype to a canonical order so "aA" === "Aa".
   Uppercase (dominant) allele first, then alphabetical. */
export function canonical(genotype) {
  const a = genotype[0], b = genotype[1];
  const order = (x, y) => {
    const xUp = x === x.toUpperCase(), yUp = y === y.toUpperCase();
    if (xUp !== yUp) return xUp ? -1 : 1;           // uppercase first
    return x < y ? -1 : x > y ? 1 : 0;
  };
  return order(a, b) <= 0 ? a + b : b + a;
}

/** Cross two genotypes -> { genotypeCounts: {AA:1,...}, total } */
export function cross(g1, g2) {
  const counts = {};
  for (const a of gametes(g1)) {
    for (const b of gametes(g2)) {
      const geno = canonical(a + b);
      counts[geno] = (counts[geno] || 0) + 1;
    }
  }
  return { genotypeCounts: counts, total: 4 };
}

/**
 * Phenotype distribution from a cross.
 * @param mode 'dominant' | 'incomplete' | 'codominant'
 * @param dominantAllele the uppercase allele that dominates (for 'dominant')
 * @param phenoNames optional map genotype->label
 */
export function phenotypes(g1, g2, { mode = 'dominant', dominantAllele, phenoNames } = {}) {
  const { genotypeCounts } = cross(g1, g2);
  const pheno = {};
  for (const [geno, count] of Object.entries(genotypeCounts)) {
    let key;
    if (phenoNames && phenoNames[geno]) {
      key = phenoNames[geno];
    } else if (mode === 'incomplete' || mode === 'codominant') {
      key = geno;                               // every genotype is distinct
    } else {
      const dom = dominantAllele || guessDominant(geno);
      key = geno.includes(dom) ? `dominante (${dom}_)` : `recessivo`;
    }
    pheno[key] = (pheno[key] || 0) + count;
  }
  return pheno;
}

function guessDominant(geno) {
  for (const ch of geno) if (ch === ch.toUpperCase()) return ch;
  return geno[0].toUpperCase();
}

/** Probability (out of 4) of a given canonical genotype among offspring. */
export function probGenotype(g1, g2, targetGeno) {
  const t = canonical(targetGeno);
  const { genotypeCounts } = cross(g1, g2);
  return { n: genotypeCounts[t] || 0, d: 4 };
}

/** Probability offspring shows the recessive phenotype (homozygous recessive). */
export function probRecessivePhenotype(g1, g2, recessiveAllele) {
  const { genotypeCounts } = cross(g1, g2);
  let n = 0;
  for (const [geno, c] of Object.entries(genotypeCounts)) {
    if (geno[0] === recessiveAllele && geno[1] === recessiveAllele) n += c;
  }
  return { n, d: 4 };
}
