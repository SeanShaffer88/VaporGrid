import test from 'node:test';
import assert from 'node:assert/strict';
import { defaults, readPreferences, constrainWidth, transition } from './state.mjs';

test('untrusted display preferences cannot escape allowed values', () => {
  for (const raw of [null, '{', '[]', '{"version":2}', 'x'.repeat(2049)]) {
    assert.deepEqual(readPreferences(raw), defaults);
  }
  const prefs = readPreferences('{"version":1,"theme":"light","density":"touch","effects":true,"width":99999,"collapsed":true,"content":"private"}');
  assert.deepEqual(prefs, { ...defaults, theme:'light', density:'touch', effects:true, collapsed:true });
  assert.equal(constrainWidth(-100), 240);
  assert.equal(constrainWidth(999), 420);
  assert.equal(constrainWidth(NaN), 300);
});

test('pause freezes progress; resume, completion, cancellation and restart are bounded', () => {
  let state = transition({status:'ready', progress:0}, 'start');
  state = transition(state, 'tick');
  assert.equal(state.progress, 5);
  state = transition(state, 'pause');
  assert.deepEqual(transition(state, 'tick'), state);
  assert.equal(transition(state, 'resume').progress, 5);
  const cancelled = transition(state, 'cancel');
  assert.deepEqual(transition(cancelled, 'tick'), cancelled);
  assert.deepEqual(transition(cancelled, 'start'), {status:'running', progress:0});
  state = transition(state, 'resume');
  for (let i=0; i<25; i++) state = transition(state, 'tick');
  assert.deepEqual(state, {status:'completed', progress:100});
  assert.deepEqual(transition(state, 'tick'), state);
  assert.deepEqual(transition(state, 'pause'), state);
});

test('legacy preferences retain display choices and gain settings defaults', () => {
  const legacy = {version:1, theme:'dark', density:'compact', effects:true, width:360, collapsed:true};
  assert.deepEqual(readPreferences(JSON.stringify(legacy)), {
    ...legacy, accent:'crimson', settingsSection:'appearance', settingsPinned:false
  });
});

test('accent IDs persist independently of theme and invalid values fall back', () => {
  for (const theme of ['system', 'light', 'dark']) {
    for (const accent of ['crimson', 'blue', 'teal']) {
      const prefs = readPreferences(JSON.stringify({ version:1, theme, accent }));
      assert.equal(prefs.theme, theme);
      assert.equal(prefs.accent, accent);
    }
  }
  for (const accent of [null, [], {}, 1, '#76172A', 'Blue', 'blue; color: red']) {
    assert.equal(readPreferences(JSON.stringify({ version:1, accent })).accent, 'crimson');
  }
});

test('settings navigation fields accept only known sections and boolean pinning', () => {
  for (const settingsSection of ['appearance', 'layout', 'shortcuts']) {
    const prefs = readPreferences(JSON.stringify({version:1, settingsSection, settingsPinned:true}));
    assert.equal(prefs.settingsSection, settingsSection);
    assert.equal(prefs.settingsPinned, true);
  }
  for (const value of [null, [], {}, 1, 'unknown']) {
    const prefs = readPreferences(JSON.stringify({version:1, settingsSection:value, settingsPinned:value}));
    assert.equal(prefs.settingsSection, 'appearance');
    assert.equal(prefs.settingsPinned, false);
  }
});

test('density accepts the per-component default and keeps older stored choices', () => {
  assert.equal(defaults.density, 'auto');
  assert.equal(readPreferences('{"version":1,"density":"auto"}').density, 'auto');
  assert.equal(readPreferences('{"version":1,"density":"comfortable"}').density, 'comfortable');
  assert.equal(readPreferences('{"version":1,"density":"huge"}').density, 'auto');
});
