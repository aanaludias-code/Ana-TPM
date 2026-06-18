/* state.js — central game store with localStorage persistence. */

const KEY = 'herdeiro-genetico-save-v1';

const defaultState = () => ({
  protagonist: null,        // id from data/protagonists.js
  currentChapter: 1,        // 1..5
  maxChapterUnlocked: 1,
  toolsUnlocked: [],        // tool ids
  evidence: [],             // {id, chapter, title, text}
  codexUnlocked: [],        // concept ids
  chapterDone: {},          // {1:true,...}
  insight: 0,               // score / "pontos de perspicácia"
  lineageSolved: false,
});

let state = defaultState();
const listeners = new Set();

export function getState() { return state; }

export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
function notify() { listeners.forEach(fn => fn(state)); }

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
}

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) { state = { ...defaultState(), ...JSON.parse(raw) }; return true; }
  } catch (e) { /* ignore */ }
  return false;
}

export function hasSave() {
  try { return !!localStorage.getItem(KEY); } catch (e) { return false; }
}

export function reset() { state = defaultState(); save(); notify(); }

/* ---------- mutators ---------- */
export function setProtagonist(id) { state.protagonist = id; save(); notify(); }

export function addInsight(n) { state.insight += n; save(); notify(); }

export function unlockTool(id) {
  if (!state.toolsUnlocked.includes(id)) { state.toolsUnlocked.push(id); save(); notify(); }
}

export function unlockCodex(id) {
  const ids = Array.isArray(id) ? id : [id];
  let changed = false;
  for (const i of ids) if (!state.codexUnlocked.includes(i)) { state.codexUnlocked.push(i); changed = true; }
  if (changed) { save(); notify(); }
}

export function addEvidence(ev) {
  if (!state.evidence.find(e => e.id === ev.id)) { state.evidence.push(ev); save(); notify(); }
}

export function completeChapter(n, { insight = 0, tool, codex } = {}) {
  state.chapterDone[n] = true;
  if (insight) state.insight += insight;
  if (tool) unlockTool(tool);
  if (codex) unlockCodex(codex);
  if (n + 1 > state.maxChapterUnlocked) state.maxChapterUnlocked = Math.min(5, n + 1);
  state.currentChapter = Math.min(5, n + 1);
  save(); notify();
}

export function hasTool(id) { return state.toolsUnlocked.includes(id); }
