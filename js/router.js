/* router.js — minimal screen router. Screens register a render(app, params)
   function. go(id, params) clears #app and renders. */

const screens = new Map();
let current = null;

export function register(id, renderFn) { screens.set(id, renderFn); }

export function go(id, params = {}) {
  const app = document.getElementById('app');
  const render = screens.get(id);
  if (!render) { app.innerHTML = `<div class="panel">Tela desconhecida: ${id}</div>`; return; }
  current = { id, params };
  app.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'screen';
  app.appendChild(wrap);
  render(wrap, params);
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
}

export function reload() { if (current) go(current.id, current.params); }
export function currentScreen() { return current; }
