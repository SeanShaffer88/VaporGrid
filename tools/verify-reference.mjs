import assert from 'node:assert/strict';
import { stat, writeFile } from 'node:fs/promises';
import { isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { until, withReferenceChrome } from './reference-chrome.mjs';

const defaultRoot = fileURLToPath(new URL('..', import.meta.url));
const args = process.argv.slice(2);
const options = new Map();
for (let index = 0; index < args.length; index += 2) {
  const [name, value] = args.slice(index, index + 2);
  if (!['--root', '--screenshots'].includes(name) || !value || options.has(name)) {
    throw new Error('Usage: node tools/verify-reference.mjs [--root path-to-staged-site] [--screenshots absolute-directory]');
  }
  options.set(name, value);
}
const root = options.has('--root') ? resolve(options.get('--root')) : defaultRoot;
const screenshots = options.get('--screenshots');
if (screenshots) {
  assert.ok(isAbsolute(screenshots) && (await stat(screenshots)).isDirectory(),
    '--screenshots requires an existing absolute directory');
}
const PATH_OPENER = '[data-path-for="setup-path"]';
const PROFILE = 'Focus and recovery fixture';

await withReferenceChrome(root, async ({ call, origin, errors, requests, version }) => {
  async function read(expression) {
    const reply = await call('Runtime.evaluate', { expression, returnByValue: true });
    if (reply.exceptionDetails) throw new Error(reply.exceptionDetails.exception?.description ?? reply.exceptionDetails.text);
    return reply.result.value;
  }
  const query = (selector) => `document.querySelector(${JSON.stringify(selector)})`;
  const value = (selector) => read(`${query(selector)}?.value`);
  const text = (selector) => read(`${query(selector)}?.textContent.trim()`);
  const focused = (selector) => read(`document.activeElement.matches(${JSON.stringify(selector)})`);
  const isVisible = (selector) => read(`Boolean(${query(selector)}?.getClientRects().length)`);

  async function key(key, modifiers = 0) {
    const codes = { Tab: 9, Enter: 13, Escape: 27, Home: 36, End: 35, ArrowUp: 38, ArrowDown: 40, a: 65 };
    const virtualCode = codes[key];
    assert.ok(virtualCode, `Unknown test key ${key}`);
    const data = { key, code: key === 'a' ? 'KeyA' : key, modifiers, windowsVirtualKeyCode: virtualCode };
    await call('Input.dispatchKeyEvent', key === 'Enter'
      ? { ...data, type: 'keyDown', text: '\r', unmodifiedText: '\r' }
      : { ...data, type: 'rawKeyDown' });
    await call('Input.dispatchKeyEvent', { ...data, type: 'keyUp' });
  }

  async function tabTo(selector) {
    for (let attempt = 0; attempt < 40; attempt += 1) {
      if (await focused(selector)) return;
      await key('Tab');
    }
    throw new Error(`Tab did not reach ${selector}.`);
  }

  async function select(selector, next) {
    await tabTo(selector);
    const options = await read(`Array.from(${query(selector)}.options, (option) => option.value)`);
    const desired = options.indexOf(next);
    assert.notEqual(desired, -1, `${selector} lacks option ${next}`);
    const current = options.indexOf(await value(selector));
    for (let index = 0; index < Math.abs(desired - current); index += 1) {
      await key(desired > current ? 'ArrowDown' : 'ArrowUp');
    }
    assert.equal(await value(selector), next, `${selector} keyboard selection`);
  }

  async function click(selector) {
    const target = await read(`(() => {
      const element = ${query(selector)};
      if (!element || element.disabled) return null;
      const rect = element.getBoundingClientRect();
      const x = rect.x + rect.width / 2;
      const y = rect.y + rect.height / 2;
      return element.contains(document.elementFromPoint(x, y)) ? { x, y } : null;
    })()`);
    assert.ok(target, `${selector} must be visible, enabled, and unobstructed before clicking`);
    await call('Input.dispatchMouseEvent', { ...target, type: 'mousePressed', button: 'left', clickCount: 1 });
    await call('Input.dispatchMouseEvent', { ...target, type: 'mouseReleased', button: 'left', clickCount: 1 });
  }

  async function enterText(selector, next) {
    await tabTo(selector);
    await key('a', 2);
    await call('Input.insertText', { text: next });
    assert.equal(await value(selector), next);
  }

  async function viewport(width, height) {
    await call('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
    await until(() => read(`innerWidth === ${width} && innerHeight === ${height}`), `${width}×${height} viewport`);
  }

  async function navigate(queryString = '') {
    const result = await call('Page.navigate', { url: `${origin}/demo/portableforge/${queryString}` });
    assert.equal(result.errorText, undefined, 'navigation must succeed');
    await until(() => isVisible('#capture'), 'the capture form');
  }

  async function fit(label, fullViewport = true) {
    const geometry = await read(`(() => {
      const width = document.documentElement.clientWidth;
      const height = window.innerHeight;
      const box = document.documentElement;
      const visible = Array.from(document.querySelectorAll('[data-fit], button, label, textarea, select, input'))
        .filter((element) => element.getClientRects().length);
      const clipped = visible.flatMap((element) => {
        const rect = element.getBoundingClientRect();
        const horizontal = rect.left < -1 || rect.right > width + 1;
        const vertical = ${fullViewport} && (rect.top < -1 || rect.bottom > height + 1);
        const truncated = element.matches('button, label, textarea') &&
          (element.scrollWidth > element.clientWidth + 2 || element.scrollHeight > element.clientHeight + 2);
        return horizontal || vertical || truncated ? [element.id || element.className || element.tagName] : [];
      });
      const count = visible.filter((element) => element.hasAttribute('data-fit')).length;
      return { width, height, scrollWidth: box.scrollWidth, scrollHeight: box.scrollHeight, count, clipped };
    })()`);
    assert.ok(geometry.count, `${label}: expected visible data-fit elements`);
    assert.ok(geometry.scrollWidth <= geometry.width + 1, `${label}: horizontal overflow ${JSON.stringify(geometry)}`);
    if (fullViewport) {
      assert.ok(geometry.scrollHeight <= geometry.height + 1, `${label}: vertical overflow ${JSON.stringify(geometry)}`);
    }
    assert.deepEqual(geometry.clipped, [], `${label}: clipped content ${JSON.stringify(geometry)}`);
  }

  async function headingAfter(action, nextSelector) {
    await click(action);
    await until(() => isVisible(nextSelector), nextSelector);
    assert.ok(await focused('#step-heading'), `Heading receives focus after ${action}`);
  }

  async function screenshot(filename) {
    if (!screenshots) return;
    const { data } = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    await writeFile(join(screenshots, filename), Buffer.from(data, 'base64'), { flag: 'wx' });
  }

  const backgroundImage = () => read('getComputedStyle(document.body).backgroundImage');

  await viewport(640, 480);
  await navigate();
  await select('#text-size', '100');
  for (const selector of ['#theme', '#texture', '#setup-path', PATH_OPENER, '#installed-path']) {
    await key('Tab');
    assert.ok(await focused(selector), `Expected ${selector} next in the capture tab order`);
  }
  await fit('standard capture');
  await select('#theme', 'dark');
  await select('#texture', 'wood');
  assert.match(await backgroundImage(), /tessel-wood-grain\.svg/, 'dark wood-grain preset draws the texture');
  await select('#texture', 'flat');
  assert.equal(await backgroundImage(), 'none', 'flat preset clears the texture');
  await select('#texture', 'wood');
  await select('#theme', 'light');
  assert.equal(await backgroundImage(), 'none', 'light theme clears the texture');
  await select('#theme', 'dark');
  await call('Emulation.setEmulatedMedia', { features: [{ name: 'forced-colors', value: 'active' }] });
  assert.equal(await backgroundImage(), 'none', 'forced colors clear the texture');
  await call('Emulation.setEmulatedMedia', { features: [] });

  await click('#capture');
  assert.ok(await focused('#setup-path'), 'a missing setup returns focus to the required field');
  assert.equal(await read(`${query('#setup-path')}.getAttribute('aria-errormessage')`), 'status-message');
  await click('#use-sample');
  const originalSetup = await value('#setup-path');
  const originalInstalled = await value('#installed-path');
  assert.ok(originalSetup && originalInstalled, 'sample action fills both paths');
  await tabTo(PATH_OPENER);
  await key('Enter');
  await until(() => read(`${query('#path-dialog')}.open`), 'the full path dialog');
  assert.ok((await text('#path-dialog')).includes(originalSetup), 'dialog shows the full setup path');
  assert.ok(await focused('#close-path'), 'dialog initially focuses Close');
  for (const modifiers of [0, 8]) {
    await key('Tab', modifiers);
    assert.ok(await focused('#close-path'), 'Tab and Shift+Tab keep focus on the dialog’s sole action');
  }
  await key('Escape');
  await until(() => focused(PATH_OPENER), 'the restored path opener after Escape');
  await key('Enter');
  await tabTo('#close-path');
  await key('Enter');
  await until(() => focused(PATH_OPENER), 'the restored path opener after Close');

  const fontSize = () => read(`parseFloat(getComputedStyle(${query('#step-heading')}).fontSize)`);
  const standardFont = await fontSize();
  let previousFont = standardFont;
  for (const size of ['125', '150', '100']) {
    await select('#text-size', size);
    const measured = await fontSize();
    if (size === '100') assert.equal(measured, standardFont, 'standard text size returns to baseline');
    else assert.ok(measured > previousFont, `text size ${size} increases the rendered font`);
    previousFont = measured;
    assert.equal(await value('#setup-path'), originalSetup);
    assert.equal(await value('#installed-path'), originalInstalled);
    await fit(`populated capture at ${size}%`, size === '100');
    if (size !== '100') {
      const scale = Number(size) / 100;
      await viewport(640 * scale, 480 * scale);
      await fit(`populated capture at ${size}% in its proportional viewport`);
      await viewport(640, 480);
    }
  }

  await headingAfter('#capture', '#review-count');
  await fit('standard review');
  assert.equal(await text('#review-count'), 'Finding 1 of 4');
  await screenshot('tessel-reference-review.png');
  assert.ok(await read(`${query('#review-choice')}.checked`), 'sample preference begins selected');
  await click('#review-choice');
  await click('#review-next');
  assert.equal(await text('#review-count'), 'Finding 2 of 4');
  await click('#review-previous');
  assert.equal(await read(`${query('#review-choice')}.checked`), false, 'decision survives paging');
  async function acknowledgeWarnings() {
    await select('#review-filter', 'attention');
    await click('#review-continue');
    assert.ok(await isVisible('#review-filter'), 'unacknowledged warnings block continuing');
    assert.match(await text('#status-message'), /warning/i, 'warning gate explains the required review');
    await click('#review-choice');
    await click('#review-continue');
    assert.ok(await isVisible('#review-filter'), 'another warning still blocks continuing');
    await click('#review-choice');
    assert.ok(await isVisible('#review-empty'), 'both warnings acknowledged');
    await select('#review-filter', 'all');
    await headingAfter('#review-continue', '#profile-name');
  }
  await acknowledgeWarnings();
  await enterText('#profile-name', PROFILE);
  await fit('standard save');
  await headingAfter('#save-profile', '#rebuild-setup');
  await fit('standard rebuild');
  await select('#rebuild-setup', 'changed');
  await click('#rebuild');
  assert.ok(await focused('#status'), 'replay starts with focus on progress');
  assert.equal(await read(`${query('#stage-form')}.getAttribute('aria-busy')`), 'true');
  const failure = await until(async () => {
    const message = await text('#status-message');
    return /changed|differ|match/i.test(message ?? '') && message;
  }, 'the mismatched setup recovery message');
  assert.match(failure, /review|original|try again/i, 'failure describes a recovery action');
  assert.ok(await focused('#rebuild-setup'), 'recovery returns focus to the mismatched input');
  assert.equal(await read(`${query('#rebuild-setup')}.getAttribute('aria-errormessage')`), 'status-message');
  assert.equal(await value('#rebuild-setup'), 'changed', 'failed attempt retains the selected input');
  await fit('standard recovery');
  await select('#rebuild-setup', 'original');
  await click('#rebuild');
  await until(() => isVisible('#result-name'), 'the successful result');
  assert.equal(await text('#result-name'), PROFILE, 'replay uses the saved profile');
  assert.ok(await focused('#step-heading'), 'result heading receives focus');
  await fit('standard result');
  await screenshot('tessel-reference-result.png');

  await navigate('?fixture=long');
  await click('#use-sample');
  assert.ok((await value('#setup-path')).length > 200, 'long fixture uses a 200+ character setup path');
  await select('#text-size', '150');
  await fit('long German fixture at 150%', false);
  await viewport(320, 480);
  await fit('narrow German fixture at 150%', false);
  assert.ok(await read(`${query('#capture')}.getBoundingClientRect().height >= 44`), 'narrow primary target is at least 44 px high');
  await tabTo('#capture');
  assert.ok(await read(`(() => {
    const rect = ${query('#capture')}.getBoundingClientRect();
    return rect.left >= -1 && rect.right <= document.documentElement.clientWidth + 1 &&
      rect.top >= -1 && rect.bottom <= innerHeight + 1;
  })()`), 'focused narrow action is brought into view');
  await key('Enter');
  await until(() => isVisible('#review-filter'), 'the narrow review page');
  await fit('narrow review', false);
  assert.ok(await focused('#step-heading'), 'narrow review heading receives focus');
  await viewport(640, 720);
  await acknowledgeWarnings();
  await headingAfter('#save-profile', '#rebuild-setup');
  await select('#rebuild-setup', 'changed');
  await click('#rebuild');
  await until(async () => /versuchen Sie es erneut/i.test(await text('#status-message') ?? ''), 'localized recovery text');
  await fit('German recovery at 150%', false);
  await screenshot('tessel-reference-long-recovery.png');

  assert.deepEqual(errors, [], 'browser runtime and asset errors');
  assert.deepEqual(requests.filter(({ local }) => !local), [], 'all app requests stay on loopback');
  console.log(`${version}: compact layout, resize, keyboard, review, recovery, texture and offline checks passed.`);
});
