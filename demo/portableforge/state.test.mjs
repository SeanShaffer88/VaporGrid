import assert from 'node:assert/strict';
import test from 'node:test';
import { createState, fixtures, reviewPage, transition } from './state.mjs';

function send(state, type, payload = {}) {
  return transition(state, { type, ...payload });
}

function review(fixture = 'standard') {
  let state = createState(fixture);
  state = send(state, 'useSample');
  state = send(state, 'capture');
  return send(state, 'complete');
}

test('capture shows actionable validation and retains typed paths', () => {
  let state = send(createState(), 'editPath', { key: 'setup', value: 'C:\\Example\\Setup.exe' });
  state = send(state, 'capture');
  assert.equal(state.error, 'installedRequired');
  assert.equal(state.paths.setup, 'C:\\Example\\Setup.exe');
  assert.equal(state.stage, 'capture');
  assert.equal(send(state, 'complete'), state);
});

test('text stress uses a separate fixture with long localized labels and paths', () => {
  const state = send(createState('long'), 'useSample');
  assert.equal(state.fixture.locale, 'de');
  assert.ok(state.fixture.labels.setup.length > fixtures.standard.labels.setup.length);
  assert.ok(state.paths.setup.length > 200);
  assert.equal(createState('missing').fixture, fixtures.standard);
});

test('review choices survive paging and filtering, and required items gate progression', () => {
  let state = review();
  const first = reviewPage(state).finding;
  state = send(state, 'choose', { id: first.id, value: false });
  state = send(state, 'page', { delta: 100 });
  assert.equal(reviewPage(state).index, 3);
  state = send(state, 'filter', { value: 'attention' });
  assert.equal(reviewPage(state).index, 0);
  assert.equal(reviewPage(state).total, 2);
  state = send(state, 'continueReview');
  assert.equal(state.stage, 'review');
  assert.equal(state.error, 'warningsRequired');
  while (reviewPage(state).finding) {
    state = send(state, 'choose', { id: reviewPage(state).finding.id, value: true });
  }
  assert.equal(reviewPage(state).total, 0);
  state = send(state, 'filter', { value: 'all' });
  assert.equal(state.choices[first.id], false);
  state = send(state, 'continueReview');
  assert.equal(state.stage, 'save');
});

test('replay rejects a changed sample and preserves its profile for retry', () => {
  let state = review();
  state = send(state, 'filter', { value: 'attention' });
  while (reviewPage(state).finding) {
    state = send(state, 'choose', { id: reviewPage(state).finding.id, value: true });
  }
  state = send(state, 'continueReview');
  state = send(state, 'editName', { value: ' ' });
  state = send(state, 'save');
  assert.equal(state.error, 'nameRequired');
  state = send(state, 'editName', { value: 'Reference sample' });
  state = send(state, 'save');
  const profile = state.profile;
  assert.deepEqual(profile.kept, ['preferences']);
  assert.deepEqual(profile.reviewed, ['service', 'documents']);
  assert.deepEqual(profile.setup, { id: 'sample-setup-v1', path: fixtures.standard.paths.setup });
  let revised = send(send(state, 'back'), 'back');
  revised = send(revised, 'filter', { value: 'all' });
  revised = send(revised, 'choose', { id: 'preferences', value: false });
  assert.equal(revised.choices.preferences, false);
  assert.deepEqual(revised.profile.kept, ['preferences']);
  state = send(state, 'editSample', { value: 'changed' });
  state = send(state, 'rebuild');
  assert.equal(state.pending, 'rebuild');
  assert.equal(send(state, 'editSample', { value: 'original' }), state);
  state = send(state, 'complete');
  assert.equal(state.error, 'setupMismatch');
  assert.equal(state.profile, profile);
  assert.equal(state.sample, 'changed');
  state = send(state, 'editSample', { value: 'original' });
  state = send(state, 'rebuild');
  state = send(state, 'complete');
  assert.equal(state.stage, 'result');
  assert.equal(state.error, null);
  assert.equal(state.profile, profile);
});
