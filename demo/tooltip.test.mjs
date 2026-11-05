import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { placeTooltip, rect, inflate, intersects, defaultPlacement, tooltipTiming } from './tooltip-placement.mjs';

const bounds = rect(0, 0, 800, 600);
const size = { width: 200, height: 32 };
const tooltipRect = (result, s = size) => rect(result.left, result.top, s.width, s.height);

test('prefers below the anchor with the contract gap when space is free', () => {
  const anchor = rect(300, 100, 100, 40);
  const result = placeTooltip({ anchor, size, bounds, obstacles: [] });
  assert.equal(result.placement, 'below');
  assert.equal(result.top, anchor.bottom + defaultPlacement.gap);
});

test('skips a side whose space holds text or a control, then flips', () => {
  const anchor = rect(300, 100, 100, 40);
  const textBelow = rect(250, 150, 300, 40);
  assert.equal(placeTooltip({ anchor, size, bounds, obstacles: [textBelow] }).placement, 'above');
  const textAbove = rect(250, 40, 300, 50);
  assert.equal(placeTooltip({ anchor, size, bounds, obstacles: [textBelow, textAbove] }).placement, 'end');
});

test('slides along the edge instead of clipping near the window border', () => {
  const anchor = rect(760, 100, 36, 36);
  const result = placeTooltip({ anchor, size, bounds, obstacles: [] });
  assert.equal(result.placement, 'below');
  assert.ok(result.left + size.width <= bounds.right - defaultPlacement.edgeInset);
});

test('never covers the anchor or its focus ring', () => {
  const anchor = rect(10, 10, 780, 580);
  assert.equal(placeTooltip({ anchor, size, bounds, obstacles: [] }), null);
});

test('returns null (hint lane) when every candidate touches content', () => {
  const anchor = rect(300, 100, 100, 40);
  const wall = rect(0, 0, 800, 600);
  assert.equal(placeTooltip({ anchor, size, bounds, obstacles: [wall] }), null);
});

test('fuzz: any returned position is inside bounds and clear of every obstacle and the anchor ring', () => {
  let seed = 7;
  const random = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
  let placed = 0;
  for (let i = 0; i < 2000; i++) {
    const anchor = rect(random() * 760, random() * 560, 20 + random() * 120, 24 + random() * 24);
    const obstacles = Array.from({ length: Math.floor(random() * 12) }, () => rect(random() * 780, random() * 580, 10 + random() * 200, 10 + random() * 40));
    const s = { width: 80 + random() * 240, height: 24 + random() * 48 };
    const result = placeTooltip({ anchor, size: s, bounds, obstacles });
    if (!result) continue;
    placed++;
    const r = tooltipRect(result, s);
    assert.ok(r.left >= 4 && r.top >= 4 && r.right <= 796 && r.bottom <= 596, `out of bounds ${JSON.stringify(r)}`);
    assert.ok(!intersects(r, inflate(anchor, defaultPlacement.anchorClearance)), 'covers anchor focus ring');
    for (const o of obstacles) assert.ok(!intersects(r, o), 'covers an obstacle');
  }
  assert.ok(placed > 500, `too few placements to be meaningful: ${placed}`);
});

// ---- Coverage: every element the contract lists carries a tooltip in the reference markup. ----
const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
const tags = [...html.matchAll(/<(button|a|input|select|progress|th|span)\b([^>]*)>/g)]
  .map(([, tag, attrs]) => ({ tag, attrs }))
  .filter(({ tag, attrs }) => tag !== 'span' || /class="(status|badge)\b/.test(attrs));

test('every interactive control, status chip, badge, header and progress bar has data-tip', () => {
  const missing = tags.filter(({ attrs }) => !/\bdata-tip="[^"]+"/.test(attrs) && !/aria-hidden="true"/.test(attrs));
  assert.deepEqual(missing.map(({ tag, attrs }) => `<${tag}${attrs}>`), []);
  assert.match(html, /role="separator"[^>]*data-tip="[^"]+"/, 'the Details divider needs a tooltip');
});

test('controls that can be disabled explain why', () => {
  const app = readFileSync(new URL('./app.js', import.meta.url), 'utf8');
  const toggled = [...app.matchAll(/\$\('([\w-]+)'\)\.disabled\s*=/g)].map(([, id]) => id);
  const startsDisabled = [...html.matchAll(/<button\b[^>]*\bid="([\w-]+)"[^>]*\bdisabled\b/g)].map(([, id]) => id);
  const ids = [...new Set([...toggled, ...startsDisabled])];
  assert.ok(ids.length >= 5, `expected the known disable-able controls, found ${ids}`);
  for (const id of ids) {
    assert.match(html, new RegExp(`id="${id}"[^>]*data-tip-disabled="[^"]+"|data-tip-disabled="[^"]+"[^>]*id="${id}"`), `${id} lacks data-tip-disabled`);
  }
  for (const [, attrs] of html.matchAll(/<button\b([^>]*data-command="[^"]+"[^>]*)>/g)) {
    assert.match(attrs, /data-tip-disabled="[^"]+"/, `command result lacks data-tip-disabled: ${attrs}`);
  }
});

test('the native title attribute is not used (its placement cannot be controlled)', () => {
  assert.doesNotMatch(html.replace(/<title>[^<]*<\/title>/, ''), /\stitle="/);
});

test('placement defaults and CSS custom properties match tokens.json', () => {
  const tokens = JSON.parse(readFileSync(new URL('../docs/tokens.json', import.meta.url), 'utf8'));
  const css = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8');
  const { tooltip } = tokens;
  assert.deepEqual(defaultPlacement.order, tooltip.placementOrder);
  for (const key of ['gap', 'anchorClearance', 'edgeInset']) assert.equal(defaultPlacement[key], tooltip[key], key);
  for (const key of ['showDelay', 'touchHoldDelay', 'hideGrace']) assert.equal(tooltipTiming[key], tooltip[key], key);
  for (const [name, value] of [['tooltip-gap', tooltip.gap], ['tooltip-max-width', tooltip.maxWidth], ['tooltip-font-size', tooltip.fontSize]]) {
    assert.ok(css.includes(`--${name}: ${value}px;`), name);
  }
  assert.ok(tooltip.gap >= tooltip.anchorClearance, 'gap must clear the anchor focus ring');
});
