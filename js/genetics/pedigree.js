/* pedigree.js — heredograma model, consistency checks, genotype
   validation, and SVG rendering.

   Member: {
     id, sex: 'M'|'F', affected: bool,
     gen: 0-based generation row, x: column position (relative),
     parents: [idMother, idFather]  // optional
   }

   A "pattern" is { axis: 'autosomal'|'xlinked'|'ylinked', dominance: 'dominant'|'recessive' } */

/* ---------- Phenotype <-> possible genotypes for a given pattern ---------- */
// Allele convention: 'A' dominant, 'a' recessive (autosomal);
// X-linked written as X^A / X^a, here tokens 'XA','Xa','Y'.

export function possibleGenotypes(member, pattern) {
  const { axis, dominance } = pattern;
  const aff = member.affected;
  if (axis === 'autosomal') {
    if (dominance === 'dominant') return aff ? ['AA', 'Aa'] : ['aa'];
    return aff ? ['aa'] : ['AA', 'Aa'];
  }
  if (axis === 'xlinked') {
    if (member.sex === 'M') {
      // hemizygous: XA Y or Xa Y
      if (dominance === 'recessive') return aff ? ['XaY'] : ['XAY'];
      return aff ? ['XAY'] : ['XaY'];
    } else { // female
      if (dominance === 'recessive') return aff ? ['XaXa'] : ['XAXA', 'XAXa'];
      return aff ? ['XAXA', 'XAXa'] : ['XaXa'];
    }
  }
  if (axis === 'ylinked') {
    if (member.sex === 'F') return ['XX'];
    return aff ? ['XYa'] : ['XYA'];
  }
  return [];
}

/* ---------- Consistency: does a phenotype set fit the proposed pattern? ----------
   Returns array of human-readable violations (empty == consistent). */
export function findViolations(members, pattern) {
  const byId = Object.fromEntries(members.map(m => [m.id, m]));
  const viol = [];
  for (const m of members) {
    if (!m.parents) continue;
    const [mo, fa] = m.parents.map(id => byId[id]);
    if (!mo || !fa) continue;

    if (pattern.axis === 'autosomal' && pattern.dominance === 'recessive') {
      // affected child of two unaffected is fine; unaffected child of two affected impossible
      if (m.affected === false && mo.affected && fa.affected) {
        viol.push(`${m.id}: dois pais afetados (recessivo) não teriam filho não-afetado.`);
      }
    }
    if (pattern.axis === 'autosomal' && pattern.dominance === 'dominant') {
      // affected child must have >=1 affected parent
      if (m.affected && !mo.affected && !fa.affected) {
        viol.push(`${m.id}: traço dominante não pode surgir de dois pais não-afetados.`);
      }
    }
    if (pattern.axis === 'xlinked' && pattern.dominance === 'recessive') {
      // affected father -> all daughters are carriers (not necessarily affected),
      // affected daughter requires affected father
      if (m.sex === 'F' && m.affected && !fa.affected) {
        viol.push(`${m.id}: filha afetada (X recessivo) exige pai afetado.`);
      }
    }
  }
  return viol;
}

/* ---------- Validate the player's full genotype assignment ---------- */
export function validateAssignment(members, pattern, assignment) {
  const errors = [];
  for (const m of members) {
    const g = assignment[m.id];
    if (!g) { errors.push(`${m.id}: genótipo não preenchido.`); continue; }
    const ok = possibleGenotypes(m, pattern).includes(g);
    if (!ok) errors.push(`${m.id}: genótipo ${g} incompatível com o fenótipo/padrão.`);
  }
  return { valid: errors.length === 0, errors };
}

/* ---------- SVG rendering of the heredograma ---------- */
const NODE = 46, HGAP = 90, VGAP = 110, PAD = 30;

export function renderSVG(members, { width = 760 } = {}) {
  const byId = Object.fromEntries(members.map(m => [m.id, m]));
  // position: gen -> y; x provided in member.x (column units)
  const xs = members.map(m => m.x);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const cols = maxX - minX;
  const innerW = cols * HGAP;
  const w = innerW + PAD * 2 + NODE;
  const gens = Math.max(...members.map(m => m.gen));
  const h = gens * VGAP + PAD * 2 + NODE;

  const px = m => PAD + (m.x - minX) * HGAP;
  const py = m => PAD + m.gen * VGAP;
  const cx = m => px(m) + NODE / 2;
  const cy = m => py(m) + NODE / 2;

  let lines = '';
  // draw parent-child connectors
  const drawnMatings = new Set();
  for (const m of members) {
    if (!m.parents) continue;
    const [mo, fa] = m.parents.map(id => byId[id]);
    if (!mo || !fa) continue;
    const key = [mo.id, fa.id].sort().join('|');
    const midX = (cx(mo) + cx(fa)) / 2;
    const matingY = cy(mo);
    if (!drawnMatings.has(key)) {
      lines += `<line x1="${cx(mo)}" y1="${matingY}" x2="${cx(fa)}" y2="${matingY}" class="ped-link"/>`;
      drawnMatings.add(key);
    }
    const childTop = py(m);
    lines += `<line x1="${midX}" y1="${matingY}" x2="${midX}" y2="${matingY + VGAP/2}" class="ped-link"/>`;
    lines += `<line x1="${midX}" y1="${matingY + VGAP/2}" x2="${cx(m)}" y2="${matingY + VGAP/2}" class="ped-link"/>`;
    lines += `<line x1="${cx(m)}" y1="${matingY + VGAP/2}" x2="${cx(m)}" y2="${childTop}" class="ped-link"/>`;
  }

  let shapes = '';
  for (const m of members) {
    const x = px(m), y = py(m);
    const fill = m.affected ? 'var(--ink)' : 'var(--cream)';
    const stroke = 'var(--ink)';
    if (m.sex === 'M') {
      shapes += `<rect x="${x}" y="${y}" width="${NODE}" height="${NODE}" rx="3"
                  fill="${fill}" stroke="${stroke}" stroke-width="3"/>`;
    } else {
      shapes += `<circle cx="${x+NODE/2}" cy="${y+NODE/2}" r="${NODE/2}"
                  fill="${fill}" stroke="${stroke}" stroke-width="3"/>`;
    }
    const labelColor = m.affected ? 'var(--cream)' : 'var(--ink)';
    shapes += `<text x="${x+NODE/2}" y="${y+NODE/2+5}" text-anchor="middle"
                 font-family="Cinzel, serif" font-size="14" fill="${labelColor}">${m.id}</text>`;
  }

  return `<svg viewBox="0 0 ${w} ${h}" width="${Math.min(width, w)}" role="img"
            aria-label="Heredograma">
      <style>.ped-link{stroke:var(--wood-dark);stroke-width:2.5;}</style>
      ${lines}${shapes}
    </svg>`;
}
