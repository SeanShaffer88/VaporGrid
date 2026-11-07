const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const root = document.documentElement;
const store = {
  get(key) { try { return localStorage.getItem(`vaporgrid.workspaces.${key}`); } catch { return null; } },
  set(key, value) { try { localStorage.setItem(`vaporgrid.workspaces.${key}`, value); } catch { /* storage may be denied */ } },
};

// Theme and color-critical chrome (Graphite preset).
const theme = $('#theme');
const critical = $('#critical');
const savedTheme = store.get('theme');
if (['system', 'dark', 'light'].includes(savedTheme)) { theme.value = savedTheme; root.dataset.theme = savedTheme; }
theme.addEventListener('change', () => { root.dataset.theme = theme.value; store.set('theme', theme.value); });
const applyCritical = on => { root.dataset.accent = on ? 'graphite' : 'crimson'; critical.checked = on; };
applyCritical(store.get('critical') === '1');
critical.addEventListener('change', () => { applyCritical(critical.checked); store.set('critical', critical.checked ? '1' : '0'); });

// Modes: a tablist with arrow keys, Home/End, Ctrl/Cmd+1..4, and a remembered selection.
const tabs = $$('.modes [role=tab]');
function show(mode, focus = false) {
  const target = tabs.find(tab => tab.dataset.mode === mode) ?? tabs[0];
  for (const tab of tabs) {
    const selected = tab === target;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    $(`#${tab.getAttribute('aria-controls')}`).hidden = !selected;
  }
  store.set('mode', target.dataset.mode);
  if (focus) target.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => show(tab.dataset.mode));
  tab.addEventListener('keydown', event => {
    const last = tabs.length - 1;
    const next = { ArrowRight: (index + 1) % tabs.length, ArrowLeft: (index + last) % tabs.length, Home: 0, End: last }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    show(tabs[next].dataset.mode, true);
  });
});
document.addEventListener('keydown', event => {
  if (!(event.ctrlKey || event.metaKey) || event.altKey || event.shiftKey) return;
  const index = Number(event.key) - 1;
  if (index >= 0 && index < tabs.length) { event.preventDefault(); show(tabs[index].dataset.mode, true); }
});
$$('[data-go]').forEach(button => button.addEventListener('click', () => show(button.dataset.go, true)));
show(tabs.some(tab => tab.dataset.mode === location.hash.slice(1)) ? location.hash.slice(1) : store.get('mode') ?? 'home');

// Hint bar: describe the hovered or focused control.
const hint = $('#hint');
const fallback = hint.textContent;
const describe = event => { const el = event.target.closest?.('[data-hint]'); if (el) hint.textContent = el.dataset.hint; };
document.addEventListener('pointerover', describe);
document.addEventListener('focusin', describe);
document.addEventListener('pointerout', () => { hint.textContent = fallback; });

// Value controls: Shift for fine steps, double-click or Backspace/Delete to reset, typed entry in sync.
for (const range of $$('input[type=range][data-default]')) {
  const fine = (Number(range.max) - Number(range.min)) / 200;
  const number = range.parentElement.querySelector('input[type=number]');
  const set = value => { range.value = value; if (number) number.value = range.value; };
  range.addEventListener('keydown', event => {
    if (event.key === 'Backspace' || event.key === 'Delete') { event.preventDefault(); set(range.dataset.default); }
    else if (event.shiftKey && (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
      event.preventDefault();
      const direction = event.key === 'ArrowLeft' || event.key === 'ArrowDown' ? -1 : 1;
      set(Math.min(Number(range.max), Math.max(Number(range.min), Number(range.value) + direction * fine)));
    }
  });
  range.addEventListener('dblclick', () => set(range.dataset.default));
  range.addEventListener('input', () => { if (number) number.value = range.value; });
  number?.addEventListener('change', () => set(Math.min(Number(number.max), Math.max(Number(number.min), Number(number.value) || Number(range.dataset.default)))));
}

// Step sequencer cells are static markers for the layout.
for (const row of $$('.steps')) {
  const on = new Set((row.dataset.on ?? '').split(',').map(Number));
  for (let step = 0; step < 16; step++) row.append(Object.assign(document.createElement('i'), { className: on.has(step) ? 'on' : '' }));
}
