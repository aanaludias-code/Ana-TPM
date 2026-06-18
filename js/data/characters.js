/* characters.js — the abandoned baby and the three suspect families.
   The genetics across all chapters consistently points to one family
   (Casa Drummond) and, ultimately, one couple. */

export const BABY = {
  id: 'bebe',
  nome: 'a criança enjeitada',
  apelido: 'Linho',
  blood: { abo: 'B', rh: '+' },
  traits: { skin: 'tan', hair: 'black', eyes: 'green' },
  // condition investigated in Chapter 4
  condicao: 'uma mancha cutânea sensível à luz',
};

export const FAMILIES = [
  {
    id: 'valverde',
    nome: 'Casa Valverde',
    cor: '#3f5d3a',
    lema: 'Raízes profundas, folhas ao vento.',
    membros: [
      { nome: 'Bernardo Valverde', sex: 'M', blood: { abo: 'O', rh: '+' }, traits: { skin: 'light', hair: 'gray', eyes: 'blue' } },
      { nome: 'Cláudia Valverde', sex: 'F', blood: { abo: 'O', rh: '-' }, traits: { skin: 'fair', hair: 'blond', eyes: 'blue' } },
    ],
    // Eliminated in Chapter 2: O × O não gera filho do tipo B.
    eliminadaPor: 'sangue',
  },
  {
    id: 'drummond',
    nome: 'Casa Drummond',
    cor: '#7a2d24',
    lema: 'O sangue lembra o que a memória esquece.',
    membros: [
      { nome: 'Helena Drummond', sex: 'F', blood: { abo: 'B', rh: '+' }, traits: { skin: 'tan', hair: 'black', eyes: 'green' } },
      { nome: 'Rafael Drummond', sex: 'M', blood: { abo: 'AB', rh: '-' }, traits: { skin: 'olive', hair: 'brown', eyes: 'brown' } },
    ],
    // Compatível em todos os exames — a verdadeira linhagem.
    verdadeira: true,
  },
  {
    id: 'reinwald',
    nome: 'Casa Reinwald',
    cor: '#3f6f9e',
    lema: 'Gelo no nome, ferro no brasão.',
    membros: [
      { nome: 'Otto Reinwald', sex: 'M', blood: { abo: 'A', rh: '-' }, traits: { skin: 'fair', hair: 'red', eyes: 'gray' } },
      { nome: 'Mathilde Reinwald', sex: 'F', blood: { abo: 'A', rh: '-' }, traits: { skin: 'fair', hair: 'auburn', eyes: 'hazel' } },
    ],
    // Eliminada: A− × A− não gera filho B nem Rh+.
    eliminadaPor: 'sangue',
  },
];

export const TRUTH = {
  familia: 'drummond',
  mae: 'Helena Drummond',
  pai: 'Rafael Drummond',
  resumo:
    'A criança é B+, com traço sensível à luz de origem recente. Apenas a Casa Drummond ' +
    'sobrevive a todos os exames: Helena (B, Iᴮi) × Rafael (AB) podem gerar um filho B; ' +
    'Helena Rh+ (Dd) × Rafael Rh− (dd) podem gerar Rh+; o marcador cromossômico e a ' +
    'mutação de novo confirmam a ligação.',
};

export function familyById(id) { return FAMILIES.find(f => f.id === id); }
