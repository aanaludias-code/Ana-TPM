/* protagonists.js — three playable investigators. Stats (0-5) gently
   affect hints/attempts without changing the underlying science. */

export const PROTAGONISTS = [
  {
    id: 'alma',
    name: 'Dra. Alma Vasconcelos',
    role: 'Geneticista Forense',
    blurb: 'Meticulosa e movida por evidências. Lê um cariótipo como quem lê um poema.',
    stats: { analise: 5, deducao: 3, social: 2 },
    perk: 'Começa cada análise laboratorial com uma pista parcial revelada.',
    traits: { sex: 'F', skin: 'tan', hair: 'black', eyes: 'brown', accessory: 'glasses', expression: 'neutral' },
  },
  {
    id: 'tomas',
    name: 'Tomás Aguiar',
    role: 'Investigador Dedutivo',
    blurb: 'Pensa em probabilidades e hipóteses concorrentes. Erra menos quando o caso é lógico.',
    stats: { analise: 3, deducao: 5, social: 2 },
    perk: 'Ganha uma tentativa extra ao comparar hipóteses genéticas.',
    traits: { sex: 'M', skin: 'light', hair: 'brown', eyes: 'hazel', accessory: 'monocle', expression: 'neutral' },
  },
  {
    id: 'iara',
    name: 'Iara Mendonça',
    role: 'Conselheira Genética',
    blurb: 'Conquista a confiança das famílias. Entrevistas revelam segredos que outros não alcançam.',
    stats: { analise: 2, deducao: 3, social: 5 },
    perk: 'Entrevistas e registros familiares revelam pistas adicionais.',
    traits: { sex: 'F', skin: 'brown', hair: 'auburn', eyes: 'green', accessory: 'flower', expression: 'smile' },
  },
];

export function getProtagonist(id) { return PROTAGONISTS.find(p => p.id === id) || PROTAGONISTS[0]; }
