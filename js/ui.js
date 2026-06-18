/* ui.js — small DOM helpers and reusable render fragments.
   Keeps screens declarative without a framework. */

/** Create an element from an HTML string (first root node). */
export function h(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

/** Escape user/content text for safe insertion. */
export function esc(s) {
  return String(s).replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

/** Event delegation helper: on(root, 'click', '.sel', handler). */
export function on(root, type, selector, handler) {
  root.addEventListener(type, e => {
    const target = e.target.closest(selector);
    if (target && root.contains(target)) handler(e, target);
  });
}

/** Transient toast message. */
export function toast(msg, kind = '') {
  const layer = document.getElementById('toast-layer');
  const el = h(`<div class="toast ${kind}">${esc(msg)}</div>`);
  layer.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .4s'; }, 2200);
  setTimeout(() => el.remove(), 2700);
}

/** Modal dialog. content is an HTML string. Returns a close() fn. */
export function modal(contentHTML, { onClose } = {}) {
  const backdrop = h(`<div class="modal-backdrop"><div class="panel flourish modal">${contentHTML}</div></div>`);
  document.body.appendChild(backdrop);
  const close = () => { backdrop.remove(); onClose && onClose(); };
  backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });
  backdrop.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', close));
  return close;
}

/** Dialogue line block. */
export function dialogue(portraitSVG, speaker, line) {
  return `<div class="dialogue">
    <div class="portrait" style="width:64px;height:64px;flex:0 0 auto">${portraitSVG}</div>
    <div><div class="speaker">${esc(speaker)}</div><p class="line">${line}</p></div>
  </div>`;
}

/** Sticky cheat-sheet note (genetics rule). bodyHTML allows lists. */
export function note(title, bodyHTML, tag = '✦') {
  return `<div class="note"><span class="tag">${tag}</span><h4>${esc(title)}</h4>${bodyHTML}</div>`;
}

/** Stat bar row. */
export function statBar(label, value, max = 5, kind = 'skill') {
  const pct = Math.round((value / max) * 100);
  return `<div class="label">${esc(label)}</div>
          <div class="bar ${kind}"><span style="width:${pct}%"></span></div>`;
}

/** Scientific feedback block. */
export function feedback(text, kind = '') {
  return `<div class="feedback ${kind}">${text}</div>`;
}

export function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }
