import { defaults, readPreferences, constrainWidth, transition } from './state.mjs';
const $ = id => document.getElementById(id);
const storageKey = 'vaporgrid.display.v1';
let prefs;
try { prefs = readPreferences(localStorage.getItem(storageKey)); }
catch { prefs = {...defaults}; $('storage-status').textContent = 'Storage unavailable; display changes last for this visit.'; }
const narrow = matchMedia('(max-width: 900px)');
// Reserve at least 576px for primary work beside a 420px inspector and 360px Settings.
const pinFits = matchMedia('(min-width: 1640px)');
const drawer = $('details-dialog');
const inspector = $('inspector');
const settings = $('settings');
const settingsDialog = $('settings-dialog');
let settingsOpen = false;
let settingsTrigger = $('show-settings');
let widthDirty = false;
let detailsTrigger = $('show-details');
let job = {status:'ready', progress:0};
let timer = null;

function save() {
  try { localStorage.setItem(storageKey, JSON.stringify(prefs)); }
  catch { $('storage-status').textContent = 'Storage unavailable; display changes last for this visit.'; }
}
function applyDisplay() {
  for (const name of ['theme','density']) {
    document.documentElement.dataset[name] = prefs[name];
    $(name).value = prefs[name];
  }
  document.documentElement.dataset.effects = String(prefs.effects);
  $('effects').checked = prefs.effects;
  setWidth(prefs.width);
}
function setWidth(value) {
  prefs.width = constrainWidth(value);
  $('work-area').style.setProperty('--inspector-width', `${prefs.width}px`);
  $('resize').setAttribute('aria-valuenow', prefs.width);
  $('resize').setAttribute('aria-valuetext', `${prefs.width} pixels`);
  if (!widthDirty) $('inspector-width').value = prefs.width;
  renderWidthDraft();
}
function placeInspector() {
  const focused = inspector.contains(document.activeElement) || document.activeElement === $('resize')
    ? document.activeElement : null;
  if (drawer.open) drawer.close();
  $('inspector-slot').append(inspector);
  $('close-details').textContent = narrow.matches ? 'Close details' : 'Collapse';
  const collapsed = !narrow.matches && prefs.collapsed;
  $('work-area').classList.toggle('collapsed', collapsed);
  $('inspector-slot').hidden = collapsed;
  $('resize').hidden = narrow.matches || collapsed;
  $('show-details').setAttribute('aria-expanded', String(!narrow.matches && !collapsed));
  if (focused) (narrow.matches || collapsed ? $('show-details') : focused).focus();
}
function showDetails(trigger = $('show-details')) {
  detailsTrigger = trigger;
  if (narrow.matches) {
    closeSettings(false);
    $('drawer-slot').append(inspector);
    drawer.showModal();
    $('show-details').setAttribute('aria-expanded', 'true');
    $('close-details').focus();
  } else {
    prefs.collapsed = false;
    placeInspector();
    save();
    $('close-details').focus();
  }
}
$('show-details').addEventListener('click', () => showDetails());
$('close-details').addEventListener('click', () => {
  if (drawer.open) closeDetails();
  else {
    prefs.collapsed = true; placeInspector(); save(); $('show-details').focus();
  }
});
function closeDetails(restoreFocus = true) {
  if (!drawer.open) return;
  drawer.close();
  $('inspector-slot').append(inspector);
  $('show-details').setAttribute('aria-expanded', String(!narrow.matches && !prefs.collapsed));
  if (restoreFocus) (detailsTrigger.isConnected ? detailsTrigger : $('show-details')).focus();
}
drawer.addEventListener('cancel', event => { event.preventDefault(); closeDetails(); });
narrow.addEventListener('change', () => { placeInspector(); placeSettings(); });

function renderWidthDraft() {
  $('apply-width').disabled = !widthDirty;
  $('cancel-width').disabled = !widthDirty;
  $('width-status').textContent = widthDirty
    ? `Unapplied draft. Workspace width is ${prefs.width} pixels.`
    : `Width matches the workspace (${prefs.width} pixels).`;
}
function clearWidthError() {
  $('inspector-width').removeAttribute('aria-invalid');
  $('width-error').hidden = true;
}
$('inspector-width').addEventListener('input', () => {
  // Once edited, a draft belongs to the user until explicit Apply or Cancel.
  widthDirty = true;
  clearWidthError();
  renderWidthDraft();
});
$('width-form').addEventListener('submit', event => {
  event.preventDefault();
  const field = $('inspector-width');
  const width = field.valueAsNumber;
  if (!field.validity.valid || !Number.isInteger(width) || width < 240 || width > 420) {
    field.setAttribute('aria-invalid', 'true');
    $('width-error').hidden = false;
    field.focus();
    return;
  }
  widthDirty = false;
  clearWidthError();
  // Move focus before disabling the button that may own it.
  field.focus();
  setWidth(width); save();
});
$('cancel-width').addEventListener('click', () => {
  widthDirty = false;
  clearWidthError();
  $('inspector-width').focus();
  setWidth(prefs.width);
});

function selectSettingsSection(section) {
  prefs.settingsSection = section;
  document.querySelectorAll('[data-section]').forEach(button => {
    const selected = button.dataset.section === section;
    if (selected) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
    $(`settings-${button.dataset.section}`).hidden = !selected;
  });
}
document.querySelectorAll('[data-section]').forEach(button => button.addEventListener('click', () => {
  selectSettingsSection(button.dataset.section); save();
}));
function placeSettings() {
  const focused = settings.contains(document.activeElement) ? document.activeElement : null;
  if (settingsDialog.open) settingsDialog.close();
  $('settings-slot').append(settings);
  const canPin = pinFits.matches;
  const pinned = settingsOpen && prefs.settingsPinned && canPin;
  const modal = !pinned;
  document.querySelector('.app-shell').classList.toggle('settings-pinned', pinned);
  $('settings-slot').hidden = !settingsOpen || modal;
  $('pin-settings').disabled = !canPin;
  $('pin-settings').setAttribute('aria-pressed', String(prefs.settingsPinned));
  $('pin-settings').textContent = prefs.settingsPinned ? 'Unpin' : 'Pin';
  $('settings-mode').textContent = pinned ? 'Pinned beside your workspace.' : 'Settings drawer.';
  if (canPin && !pinned) $('settings-mode').textContent = 'Pin to reserve workspace space.';
  if (!canPin && prefs.settingsPinned) {
    $('settings-mode').textContent = 'Your pin preference resumes when the workspace is wider.';
  }
  $('show-settings').setAttribute('aria-expanded', String(settingsOpen));
  if (settingsOpen && modal) {
    closeDetails(false);
    $('settings-modal-slot').append(settings);
    // Reset confirmation temporarily owns the modal layer.
    if (!$('reset-dialog').open) settingsDialog.showModal();
  }
  if (focused && settingsOpen && !$('reset-dialog').open) {
    (focused.disabled ? $('close-settings') : focused).focus();
  }
}
function closeSettings(restoreFocus = true) {
  if (!settingsOpen) return;
  settingsOpen = false;
  placeSettings();
  if (restoreFocus) (settingsTrigger.isConnected ? settingsTrigger : $('show-settings')).focus();
}
$('show-settings').addEventListener('click', event => {
  settingsTrigger = event.currentTarget;
  settingsOpen = true;
  placeSettings();
  $('close-settings').focus();
});
$('close-settings').addEventListener('click', () => closeSettings());
settingsDialog.addEventListener('cancel', event => { event.preventDefault(); closeSettings(); });
settings.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !settingsDialog.open) {
    event.preventDefault(); closeSettings();
  }
});
$('pin-settings').addEventListener('click', () => {
  prefs.settingsPinned = !prefs.settingsPinned;
  placeSettings(); save();
});
pinFits.addEventListener('change', placeSettings);
for (const name of ['theme','density','effects']) $(name).addEventListener('change', event => {
  prefs[name] = name === 'effects' ? event.target.checked : event.target.value;
  applyDisplay(); save();
});
const reset = $('reset-dialog');
$('reset-layout').addEventListener('click', () => {
  if (settingsDialog.open) settingsDialog.close();
  reset.returnValue = ''; reset.showModal();
});
reset.addEventListener('close', () => {
  if (reset.returnValue === 'reset') {
    prefs.width = defaults.width; prefs.collapsed = defaults.collapsed;
    applyDisplay(); placeInspector(); save();
  }
  placeSettings();
  $('reset-layout').focus();
});
let drag = null;
const separator = $('resize');
separator.addEventListener('pointerdown', event => {
  if (event.button !== 0 || narrow.matches) return;
  drag = {id:event.pointerId, x:event.clientX, width:prefs.width};
  separator.setPointerCapture(event.pointerId); separator.focus(); event.preventDefault();
});
separator.addEventListener('pointermove', event => {
  if (drag && event.pointerId === drag.id) setWidth(drag.width + drag.x - event.clientX);
});
for (const type of ['pointerup','pointercancel','lostpointercapture']) separator.addEventListener(type, () => {
  if (drag) { drag = null; save(); }
});
separator.addEventListener('keydown', event => {
  const values = {ArrowLeft:prefs.width + 10, ArrowRight:prefs.width - 10, Home:240, End:420};
  if (Object.hasOwn(values, event.key)) { event.preventDefault(); setWidth(values[event.key]); save(); }
});

function renderJob() {
  const focusedOperation = [$('pause'), $('cancel')].find(control => control === document.activeElement);
  const status = job.status[0].toUpperCase() + job.status.slice(1);
  $('job-status').textContent = status + (['completed','cancelled'].includes(job.status) ? ' · No work running' : '');
  $('job-status').classList.toggle('success', job.status === 'completed');
  $('job-progress').value = job.progress;
  $('job-progress').textContent = `${job.progress}%`;
  $('percentage').value = `${job.progress}%`;
  const active = ['running','paused'].includes(job.status);
  $('start').disabled = active;
  $('pause').disabled = !active;
  $('pause').querySelector('span').textContent = job.status === 'paused' ? 'Resume' : 'Pause';
  $('pause').querySelector('use').setAttribute('href', `icons.svg#${job.status === 'paused' ? 'play' : 'pause'}`);
  $('cancel').disabled = !active;
  if (focusedOperation?.disabled) $('start').focus();
}
function dispatch(action) {
  job = transition(job, action);
  if (timer !== null) { clearInterval(timer); timer = null; }
  if (job.status === 'running') timer = setInterval(() => dispatch('tick'), 600);
  renderJob();
}
$('start').addEventListener('click', () => { dispatch('start'); $('pause').focus(); });
$('pause').addEventListener('click', () => dispatch(job.status === 'paused' ? 'resume' : 'pause'));
$('cancel').addEventListener('click', () => { dispatch('cancel'); $('start').focus(); });
addEventListener('pagehide', () => { if (timer !== null) { clearInterval(timer); timer = null; } });
addEventListener('pageshow', event => { if (event.persisted && job.status === 'running') dispatch('pause'); });
const tasks = [
  ['Review prototype','Avery','Check hierarchy, keyboard access, and readable task states before handoff.'],
  ['Validate assets','Morgan','Review original icon paths and record image provenance.'],
  ['Prepare handoff','Jules','Record what was tested and which runtime checks remain.']
];
document.querySelectorAll('[data-task]').forEach(button => button.addEventListener('click', () => {
  const [title,owner,description] = tasks[Number(button.dataset.task)];
  $('task-title').textContent = title; $('task-owner').textContent = owner; $('task-description').textContent = description;
  document.querySelectorAll('[data-task]').forEach(item => {
    const selected = item === button;
    item.setAttribute('aria-pressed', String(selected)); item.closest('tr').classList.toggle('selected', selected);
  });
  if (narrow.matches) showDetails(button);
}));
const recovery = {
  empty:['No tasks in this example','Create an example task to return to the populated workspace.','Create example task'],
  offline:['Offline example','Connection is simulated as unavailable. Nothing has been sent or saved to a server.','Retry simulated connection'],
  error:['Could not open example workspace','This is a demonstration error. Your current selection is preserved.','Retry example']
};
function showExample() {
  const value = $('example').value;
  $('validation-example').hidden = value !== 'normal'; $('recovery-example').hidden = value === 'normal';
  $('feedback').textContent = '';
  $('recovery-example').dataset.state = value;
  if (value !== 'normal') {
    const [title,copy,action] = recovery[value];
    $('recovery-title').textContent = title; $('recovery-copy').textContent = copy; $('retry').textContent = action;
  }
}
$('example').addEventListener('change', showExample);
$('retry').addEventListener('click', () => {
  $('example').value = 'normal'; showExample();
  $('feedback').textContent = 'Example recovered locally. No network request was made.'; $('example').focus();
});
$('name-form').addEventListener('submit', event => {
  event.preventDefault(); const invalid = $('workspace-name').value.trim().length < 3;
  $('workspace-name').setAttribute('aria-invalid', String(invalid)); $('name-error').hidden = !invalid;
  $('feedback').textContent = invalid ? '' : 'Name is valid for this example. It is not saved.';
  if (invalid) $('workspace-name').focus();
});
applyDisplay(); placeInspector(); selectSettingsSection(prefs.settingsSection); placeSettings(); renderJob();
