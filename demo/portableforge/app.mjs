import { createState, reviewPage, transition } from './state.mjs';

const get = id => document.getElementById(id);
const form = get('stage-form');
const primary = get('step-primary');
const dialog = get('path-dialog');
const settings = {
  'text-size': ['100', '125', '150'],
  theme: ['dark', 'light'],
  texture: ['wood', 'flat'],
};
const settingsKey = 'tessel.portableforge.display.v1';
let state = createState(new URLSearchParams(location.search).get('fixture'));
let opener;
let timer;

const steps = {
  capture: ['Capture an app', 'Enter the setup and installed app paths.', 'Capture sample', 'capture'],
  review: ['Review captured changes', 'Choose which items to keep and review each warning.', 'Continue to save', 'review-continue'],
  save: ['Save a profile', 'Give the reviewed profile a name you can recognize later.', 'Save profile', 'save-profile'],
  rebuild: ['Rebuild an installer', 'Choose the sample setup that matches the saved profile.', 'Rebuild sample', 'rebuild'],
  result: ['Sample build complete', 'The saved profile and setup check are shown below.'],
};

const errors = {
  setupRequired: ['Enter the setup path', 'Type an example path or use the sample paths.', 'setup-path'],
  installedRequired: ['Enter the installed app path', 'Type an example path or use the sample paths.', 'installed-path'],
  warningsRequired: ['Review the remaining warnings', 'Acknowledge each warning before saving the profile.', 'review-choice'],
  nameRequired: ['Enter a profile name', 'Choose a name that distinguishes this profile.', 'profile-name'],
  setupMismatch: ['The setup file does not match', '', 'rebuild-setup'],
};

function updatePath(input, value) {
  input.value = value;
  input.parentElement.dataset.value = value;
}

function useLocalizedText(id, key) {
  const element = get(id);
  element.textContent = state.fixture.labels[key];
  element.lang = state.fixture.locale;
}

function renderReview() {
  const { finding, index, total, pending, selected } = reviewPage(state);
  get('review-filter').value = state.filter;
  get('review-filter').options[1].textContent = `Needs attention (${pending})`;
  get('review-summary').textContent = `${selected} selected · ${pending} to review`;
  get('review-count').textContent = total ? `Finding ${index + 1} of ${total}` : '0 findings';
  get('review-previous').disabled = index === 0;
  get('review-next').disabled = index >= total - 1;
  get('finding').hidden = !finding;
  get('review-empty').hidden = Boolean(finding);
  if (!finding) return;

  get('finding').dataset.kind = finding.kind;
  get('finding').lang = finding.locale || 'en';
  get('finding-title').textContent = finding.title;
  get('finding-description').textContent = finding.description;
  get('finding-path').textContent = finding.path;
  get('review-choice').checked = Boolean(state.choices[finding.id]);
  get('choice-label').textContent = finding.kind === 'warning' ? 'I reviewed this warning' : 'Keep this item';
}

function renderStatus() {
  const box = get('status');
  const title = get('status-title');
  const message = get('status-message');
  let kind = 'info';
  let words = ['', ''];
  if (state.error) {
    kind = 'error';
    words = errors[state.error];
    if (state.error === 'setupMismatch') words = [words[0], state.fixture.labels.mismatch];
  } else if (state.pending) {
    kind = 'progress';
    words = [state.pending === 'capture' ? 'Preparing sample findings' : 'Checking the saved sample setup', 'Keep this page open.'];
  } else if (state.stage === 'rebuild') {
    kind = 'success';
    words = ['Profile saved for this session', 'Choose a sample setup to check the rebuild.'];
  }
  box.dataset.kind = kind;
  if (title.textContent !== words[0]) title.textContent = words[0];
  if (message.textContent !== words[1]) message.textContent = words[1];
  message.lang = state.error === 'setupMismatch' ? state.fixture.locale : 'en';
  for (const control of form.querySelectorAll('[aria-errormessage="status-message"]')) {
    control.removeAttribute('aria-invalid');
    control.removeAttribute('aria-errormessage');
  }
  if (state.error && !(state.error === 'setupMismatch' && state.sample === 'original')) {
    const control = get(errors[state.error][2]);
    control?.setAttribute('aria-invalid', 'true');
    control?.setAttribute('aria-errormessage', 'status-message');
  }
}

function renderControls() {
  const busy = Boolean(state.pending);
  form.setAttribute('aria-busy', String(busy));
  for (const control of form.elements) control.disabled = busy;
  primary.disabled = busy;
  get('step-back').disabled = busy;
  primary.textContent = state.error === 'setupMismatch' ? 'Try again' : (steps[state.stage][2] || '');
  if (state.stage === 'review') renderReview();
  renderStatus();
}

function renderStage() {
  const { stage } = state;
  const [heading, help, action, actionId] = steps[stage];
  const step = Object.keys(steps).indexOf(stage) + 1;
  get('workspace').dataset.stage = stage;
  get('step-count').textContent = step === 5 ? 'Workflow result' : `Step ${step} of 4`;
  get('step-heading').textContent = heading;
  get('step-help').textContent = help;
  primary.hidden = !action;
  primary.id = actionId || 'step-primary';
  get('step-back').hidden = stage === 'capture';
  get('step-reset').hidden = stage !== 'result';
  get('step-back').textContent = stage === 'result' ? 'Rebuild again' : 'Back';
  form.replaceChildren(get(`${stage}-template`).content.cloneNode(true));

  if (stage === 'capture') {
    useLocalizedText('setup-label', 'setup');
    useLocalizedText('installed-label', 'installed');
    useLocalizedText('capture-help', 'pathHelp');
    updatePath(get('setup-path'), state.paths.setup);
    updatePath(get('installed-path'), state.paths.installed);
  } else if (stage === 'save') {
    get('profile-name').value = state.name;
    get('save-summary').textContent = `${reviewPage(state).selected} selected · all warnings reviewed`;
  } else if (stage === 'rebuild') {
    useLocalizedText('rebuild-label', 'rebuild');
    get('profile-summary').textContent = `Saved profile: ${state.profile.name} · ${state.profile.kept.length} selected`;
    get('rebuild-setup').value = state.sample;
  } else if (stage === 'result') {
    get('result-name').textContent = state.profile.name;
  }
  renderControls();
}

function scheduleCompletion() {
  timer = window.setTimeout(() => {
    timer = undefined;
    send({ type: 'complete' });
  }, 600);
}

function send(action) {
  const previous = state;
  state = transition(state, action);
  if (previous === state) return;
  if (previous.stage !== state.stage) {
    renderStage();
    get('step-heading').focus();
  } else {
    renderControls();
  }

  if (state.error && state.error !== previous.error) {
    const control = get(errors[state.error][2]);
    control?.focus();
  }
  if (!previous.pending && state.pending) {
    get('status').focus();
    scheduleCompletion();
  }
}

function updateInput(action) {
  state = transition(state, action);
  renderStatus();
}

form.addEventListener('input', event => {
  const control = event.target;
  if (control.matches('textarea')) {
    const key = control.id === 'setup-path' ? 'setup' : 'installed';
    const value = control.value.replace(/\r?\n/g, '');
    updatePath(control, value);
    updateInput({ type: 'editPath', key, value });
  } else if (control.id === 'profile-name') {
    updateInput({ type: 'editName', value: control.value });
  }
});

form.addEventListener('change', event => {
  const control = event.target;
  if (control.id === 'review-filter') {
    send({ type: 'filter', value: control.value });
  } else if (control.id === 'review-choice') {
    const finding = reviewPage(state).finding;
    if (!finding) return;
    send({ type: 'choose', id: finding.id, value: control.checked });
    if (state.filter === 'attention') {
      const target = reviewPage(state).finding ? get('finding-title') : get('review-filter');
      target.focus();
    }
  } else if (control.id === 'rebuild-setup') {
    send({ type: 'editSample', value: control.value });
  }
});

form.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.pathFor) {
    opener = button;
    const input = get(button.dataset.pathFor);
    get('path-title').textContent = input.labels[0].textContent;
    get('path-title').lang = state.fixture.locale;
    get('path-value').textContent = input.value || 'No path entered.';
    dialog.showModal();
  } else if (button.id === 'use-sample') {
    send({ type: 'useSample' });
    for (const key of ['setup', 'installed']) {
      const input = get(`${key}-path`);
      updatePath(input, state.paths[key]);
    }
  } else if (button.id === 'review-previous' || button.id === 'review-next') {
    send({ type: 'page', delta: button.id === 'review-next' ? 1 : -1 });
    if (button.disabled) get('finding-title').focus();
  }
});

form.addEventListener('keydown', event => {
  if (event.key === 'Enter' && event.target.matches('textarea')) event.preventDefault();
});

form.addEventListener('submit', event => {
  event.preventDefault();
  const type = { capture: 'capture', review: 'continueReview', save: 'save', rebuild: 'rebuild' }[state.stage];
  if (type) send({ type });
});

dialog.addEventListener('close', () => {
  if (opener?.isConnected) opener.focus();
  opener = undefined;
});
dialog.addEventListener('keydown', event => {
  if (event.key === 'Tab') {
    event.preventDefault();
    get('close-path').focus();
  }
});
get('step-back').addEventListener('click', () => send({ type: 'back' }));
get('step-reset').addEventListener('click', () => send({ type: 'reset' }));

let stored;
try { stored = JSON.parse(localStorage.getItem(settingsKey)); } catch {}
for (const [key, options] of Object.entries(settings)) {
  const control = get(key);
  const value = options.includes(stored?.[key]) ? stored[key] : options[0];
  control.value = value;
  document.documentElement.setAttribute(`data-${key}`, value);
  control.addEventListener('change', () => {
    document.documentElement.setAttribute(`data-${key}`, control.value);
    const display = Object.fromEntries(Object.keys(settings).map(name => [name, get(name).value]));
    try { localStorage.setItem(settingsKey, JSON.stringify(display)); } catch {}
  });
}
window.addEventListener('pagehide', () => {
  window.clearTimeout(timer);
  timer = undefined;
});
window.addEventListener('pageshow', event => {
  if (event.persisted && state.pending && timer === undefined) scheduleCompletion();
});
renderStage();
