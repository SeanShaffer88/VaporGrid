const standardLabels = {
  setup: 'Setup file',
  installed: 'Installed app path',
  rebuild: 'Sample setup file',
  pathHelp: 'Use sample paths or type an example.',
  mismatch: 'This setup is different from the original sample. Your profile is still saved. Choose Original sample setup and try again.',
};

const findings = [
  { id: 'preferences', kind: 'keep', title: 'App preferences', path: '%APPDATA%\\Example\\Settings.json', description: 'Store these preferences alongside the portable app.' },
  { id: 'cache', kind: 'keep', title: 'Local cache', path: '%LOCALAPPDATA%\\Example\\Cache', description: 'Include the cache only if you need its contents.' },
  { id: 'service', kind: 'warning', title: 'Background service', path: 'HKLM\\SYSTEM\\CurrentControlSet\\Services\\Example', description: 'The sample app registers a Windows service. Review its effect on portability.' },
  { id: 'documents', kind: 'warning', title: 'Files outside the app folder', path: '%USERPROFILE%\\Documents\\Example', description: 'The sample app writes to Documents. Review which files belong in the portable app.' },
];

const sampleSetups = {
  original: 'sample-setup-v1',
  changed: 'sample-setup-v2',
};

export const fixtures = {
  standard: {
    locale: 'en',
    labels: standardLabels,
    paths: {
      setup: 'C:\\Sample Setups\\PortableForge Example\\SampleSetup.exe',
      installed: 'C:\\Program Files\\Example Application\\Example.exe',
    },
    findings,
  },
  long: {
    locale: 'de',
    labels: {
      setup: 'Pfad zur ursprünglichen Installationsdatei des Beispielprogramms',
      installed: 'Vollständiger Pfad zur installierten ausführbaren Beispieldatei',
      rebuild: 'Installationsdatei für den Wiederaufbau des gespeicherten Beispielprofils',
      pathHelp: 'Geben Sie die vollständigen Beispielpfade ein oder übernehmen Sie die vorgegebenen Werte für diesen Prüflauf.',
      mismatch: 'Die ausgewählte Beispielinstallationsdatei stimmt nicht mit der Datei überein, die beim Speichern des Profils verwendet wurde. Wählen Sie die ursprüngliche Beispieldatei und versuchen Sie es erneut.',
    },
    paths: {
      setup: 'C:\\Beispielinstallationen\\Archiv-der-bereits-geprüften-Anwendungsversionen\\Unternehmensinterne-Veröffentlichungen\\Mehrsprachige-Auslieferungsdateien\\Freigegebene-Installationsprogramme\\Vollständige-Installationsdatei-für-das-Beispielprogramm.exe',
      installed: 'C:\\Programme\\Mehrsprachiges-Beispielprogramm\\Vollständige-Programmdateien\\Beispielprogramm.exe',
    },
    findings: findings.map((finding, index) => index === 0 ? {
      ...finding,
      locale: 'de',
      title: 'Benutzerspezifische Programmeinstellungen',
      description: 'Speichern Sie die Einstellungen zusammen mit der portablen Beispielanwendung.',
    } : finding),
  },
};

export function createState(fixture = 'standard') {
  return {
    fixture: Object.hasOwn(fixtures, fixture) ? fixtures[fixture] : fixtures.standard,
    stage: 'capture',
    paths: { setup: '', installed: '' },
    choices: {},
    filter: 'all',
    page: 0,
    name: 'Example application',
    profile: null,
    sample: 'original',
    pending: null,
    error: null,
  };
}

export function reviewPage(state) {
  const { findings } = state.fixture;
  const pending = findings.filter(item => item.kind === 'warning' && !state.choices[item.id]);
  const visible = state.filter === 'attention' ? pending : findings;
  const index = Math.max(0, Math.min(state.page, visible.length - 1));
  return {
    index,
    total: visible.length,
    finding: visible[index],
    pending: pending.length,
    selected: findings.filter(item => item.kind === 'keep' && state.choices[item.id]).length,
  };
}

function changed(state, fields) {
  return { ...state, error: null, ...fields };
}

function failed(state, error) {
  return { ...state, pending: null, error };
}

export function transition(state, action) {
  if (state.pending) {
    if (action.type !== 'complete') return state;
    if (state.pending === 'capture') {
      return changed(state, {
        stage: 'review',
        pending: null,
        choices: { preferences: true },
        filter: 'all',
        page: 0,
        profile: null,
      });
    }
    if (sampleSetups[state.sample] !== state.profile.setup.id) return failed(state, 'setupMismatch');
    return changed(state, { stage: 'result', pending: null });
  }

  if (action.type === 'reset') return createState(state.fixture === fixtures.long ? 'long' : 'standard');
  if (action.type === 'back') {
    const stage = { review: 'capture', save: 'review', rebuild: 'save', result: 'rebuild' }[state.stage];
    return stage ? changed(state, { stage }) : state;
  }

  switch (state.stage) {
    case 'capture':
      if (action.type === 'useSample') return changed(state, { paths: { ...state.fixture.paths } });
      if (action.type === 'editPath' && Object.hasOwn(state.paths, action.key)) {
        return changed(state, { paths: { ...state.paths, [action.key]: action.value } });
      }
      if (action.type === 'capture') {
        if (!state.paths.setup.trim()) return failed(state, 'setupRequired');
        if (!state.paths.installed.trim()) return failed(state, 'installedRequired');
        return changed(state, { pending: 'capture' });
      }
      break;
    case 'review':
      if (action.type === 'filter') return changed(state, { filter: action.value, page: 0 });
      if (action.type === 'page') {
        const { index, total } = reviewPage(state);
        return changed(state, { page: Math.max(0, Math.min(index + action.delta, total - 1)) });
      }
      if (action.type === 'choose' && reviewPage(state).finding?.id === action.id) {
        const next = changed(state, { choices: { ...state.choices, [action.id]: action.value } });
        return { ...next, page: reviewPage(next).index };
      }
      if (action.type === 'continueReview') {
        if (reviewPage(state).pending) {
          return { ...failed(state, 'warningsRequired'), filter: 'attention', page: 0 };
        }
        return changed(state, { stage: 'save' });
      }
      break;
    case 'save':
      if (action.type === 'editName') return changed(state, { name: action.value });
      if (action.type === 'save') {
        if (!state.name.trim()) return failed(state, 'nameRequired');
        const profile = {
          name: state.name.trim(),
          setup: { id: sampleSetups.original, path: state.paths.setup },
          kept: state.fixture.findings.filter(item => item.kind === 'keep' && state.choices[item.id]).map(item => item.id),
          reviewed: state.fixture.findings.filter(item => item.kind === 'warning' && state.choices[item.id]).map(item => item.id),
        };
        return changed(state, { stage: 'rebuild', profile, sample: 'original' });
      }
      break;
    case 'rebuild':
      if (action.type === 'editSample' && Object.hasOwn(sampleSetups, action.value)) {
        return { ...state, sample: action.value };
      }
      if (action.type === 'rebuild') return changed(state, { pending: 'rebuild' });
      break;
  }
  return state;
}
