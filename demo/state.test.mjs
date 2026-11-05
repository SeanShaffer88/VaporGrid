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
