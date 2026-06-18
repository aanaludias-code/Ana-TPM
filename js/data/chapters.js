/* chapters.js — narrative metadata + location info for each chapter.
   Puzzle data lives inside each chapter screen module; this file holds
   titles, objectives, tool unlocks and codex links shown on the map. */

export const CHAPTERS = [
  {
    n: 1,
    id: 'chapter1',
    titulo: 'O Heredograma Esquecido',
    local: 'Sótão da Mansão Drummond',
    icon: '🌳',
    resumo: 'Um heredograma empoeirado guarda o padrão de herança de um traço familiar.',
    objetivo: 'Classifique o padrão de herança e atribua os genótipos.',
    tool: null,
    toolUnlock: 'microscopio',
    codex: ['mendel', 'dom-rec', 'geno-feno', 'heredograma', 'sex-linked', 'autossomico'],
  },
  {
    n: 2,
    id: 'chapter2',
    titulo: 'Laços de Sangue',
    local: 'Laboratório de Hematologia',
    icon: '🩸',
    resumo: 'Amostras de sangue dos possíveis pais chegaram ao laboratório.',
    objetivo: 'Use ABO e Rh para eliminar casais impossíveis.',
    tool: 'kit-sangue',
    toolUnlock: 'analisador-cromossomos',
    codex: ['alelos-multiplos', 'abo', 'codominancia', 'rh'],
  },
  {
    n: 3,
    id: 'chapter3',
    titulo: 'Detetive Cromossômico',
    local: 'Sala de Citogenética',
    icon: '🧬',
    resumo: 'Cariótipos e mapas cromossômicos revelam marcadores e anomalias.',
    objetivo: 'Identifique a anomalia e o marcador que liga a criança a um ramo.',
    tool: 'analisador-cromossomos',
    toolUnlock: 'sequenciador',
    codex: ['dominancia-incompleta', 'cariotipo', 'ligacao-genica'],
  },
  {
    n: 4,
    id: 'chapter4',
    titulo: 'O Mistério da Mutação',
    local: 'Arquivo Médico & Banco de Mutações',
    icon: '⚠️',
    resumo: 'Uma condição surge na criança, ausente nas gerações anteriores.',
    objetivo: 'Reúna pistas e classifique a origem da mutação.',
    tool: 'banco-mutacoes',
    toolUnlock: 'reconstrutor',
    codex: ['mutacoes', 'germinativa-somatica', 'reparo-dna'],
  },
  {
    n: 5,
    id: 'chapter5',
    titulo: 'A Linhagem Final',
    local: 'Salão dos Retratos',
    icon: '👑',
    resumo: 'Todas as evidências convergem. Reconstrua a árvore e revele os pais.',
    objetivo: 'Combine as provas, calcule a probabilidade e nomeie os pais biológicos.',
    tool: 'reconstrutor',
    toolUnlock: null,
    codex: ['probabilidade', 'aconselhamento'],
  },
];

export const TOOLS = {
  'kit-sangue': 'Kit de Tipagem Sanguínea',
  'microscopio': 'Microscópio',
  'analisador-cromossomos': 'Analisador de Cromossomos',
  'sequenciador': 'Software de Sequenciamento de DNA',
  'banco-mutacoes': 'Banco de Mutações',
  'reconstrutor': 'Reconstrutor de Árvore Genealógica',
};

export function chapterByN(n) { return CHAPTERS.find(c => c.n === n); }
