export function installCommandPalette() {
  const dialog = document.getElementById('command-palette');
  const trigger = document.getElementById('show-commands');
  const search = document.getElementById('command-search');
  const status = document.getElementById('command-status');
  const commands = [...dialog.querySelectorAll('[data-command]')].map(button => ({
    button,
    target: document.getElementById(button.dataset.command),
    row: button.closest('li'),
  }));
  let opener = null;
  let pending = null;

  const available = () => commands.filter(({ button, row }) => !row.hidden && !button.disabled);

  function refresh() {
    if (!dialog.open) return;
    const query = search.value.trim().toLowerCase();
    let matches = 0;
    let enabled = 0;
    for (const { button, target, row } of commands) {
      if (target.id === 'pause') {
        const label = `${target.textContent.trim()} simulation`;
        if (button.textContent !== label) button.textContent = label;
      }
      const match = button.textContent.toLowerCase().includes(query);
      if (document.activeElement === button && (!match || target.disabled)) search.focus();
      row.hidden = !match;
      button.disabled = target.disabled;
      if (match) {
        matches++;
        if (!target.disabled) enabled++;
      }
    }
    const message = matches
      ? `${enabled} available${enabled < matches ? `, ${matches - enabled} unavailable` : ''}.`
      : 'No commands match your search.';
    if (status.textContent !== message) status.textContent = message;
  }

  function open() {
    if (opener || document.querySelector('dialog[open]')) return;
    opener = document.activeElement;
    search.value = '';
    dialog.showModal();
    refresh();
    search.focus();
  }

  function run(command) {
    if (!command || command.row.hidden || command.target.disabled) return;
    pending = command.target;
    dialog.close();
  }

  trigger.addEventListener('click', open);
  document.getElementById('close-commands').addEventListener('click', () => dialog.close());
  search.addEventListener('input', refresh);
  for (const command of commands) command.button.addEventListener('click', () => run(command));

  dialog.addEventListener('close', () => {
    const previous = opener;
    const target = pending;
    opener = null;
    pending = null;
    if (document.querySelector('dialog[open]')) return;
    if (target && !target.disabled) {
      target.focus();
      target.click();
    } else {
      if (previous?.isConnected && previous !== document.body && !previous.matches(':disabled')) previous.focus();
      if (document.activeElement !== previous || previous === document.body) trigger.focus();
    }
  });

  dialog.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.isComposing || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const list = available();
    const index = list.findIndex(({ button }) => button === event.target);
    if (event.target !== search && index < 0) return;
    if (event.key === 'Enter' && event.target === search) {
      event.preventDefault();
      run(list[0]);
      return;
    }
    if (!list.length) return;
    let next;
    switch (event.key) {
      case 'ArrowDown': next = (index + 1) % list.length; break;
      case 'ArrowUp': next = index <= 0 ? list.length - 1 : index - 1; break;
      case 'Home': if (index >= 0) next = 0; break;
      case 'End': if (index >= 0) next = list.length - 1; break;
    }
    if (next === undefined) return;
    event.preventDefault();
    list[next].button.focus();
  });

  document.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.isComposing || event.repeat || event.altKey || event.shiftKey ||
        event.ctrlKey === event.metaKey || event.key.toLowerCase() !== 'k') return;
    const target = event.target;
    if (target instanceof HTMLElement &&
        (target.isContentEditable || target.closest('input, textarea, select, [role="textbox"]'))) return;
    if (opener || document.querySelector('dialog[open]')) return;
    event.preventDefault();
    open();
  });

  return refresh;
}
