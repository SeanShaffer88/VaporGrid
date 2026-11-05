import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const tokens = JSON.parse(readFileSync(new URL('../docs/tokens.json', import.meta.url), 'utf8'));
const css = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8');
const cssNames = { background: 'bg', foreground: 'fg' };
const cssName = name => cssNames[name] ?? name.replace(/[A-Z]/g, char => `-${char.toLowerCase()}`);

function linearSrgb(value) {
  if (value.startsWith('#')) {
    return value.slice(1).match(/../g).map(channel => {
      const encoded = Number.parseInt(channel, 16) / 255;
      return encoded <= 0.04045 ? encoded / 12.92 : ((encoded + 0.055) / 1.055) ** 2.4;
    });
  }

  // CSS Color 4 OKLCH → OKLab → linear sRGB, with no early rounding.
  const [lightness, chroma, hue] = value.slice(6, -1).split(' ').map(Number);
  const angle = hue * Math.PI / 180;
  const a = chroma * Math.cos(angle);
  const b = chroma * Math.sin(angle);
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (lightness - 0.0894841775 * a - 1.2914855480 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  ];
}

function luminance(color) {
  const [r, g, b] = linearSrgb(color);
  // Allow numerical noise from the rounded conversion coefficients at white.
  for (const channel of [r, g, b]) {
    assert.ok(channel >= -1e-6 && channel <= 1 + 1e-6, `Out of sRGB gamut: ${color}`);
  }
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a, b) {
  const l1 = luminance(a);
  const l2 = luminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

test('CSS and machine-readable palette agree across fallback, OKLCH, and System light', () => {
  const [fallback, preferred] = css.split('@supports (color: oklch(0.5 0 0))');
  assert.ok(preferred, 'Missing OKLCH support guard');
  for (const [source, dark, light] of [
    [fallback, tokens.color, tokens.lightColor],
    [preferred, tokens.colorOklch.dark, tokens.colorOklch.light],
  ]) {
    const scopes = [...source.matchAll(/:root(\[data-theme=(light|system)\])?\s*\{([^}]*)\}/g)];
    assert.deepEqual(scopes.map(match => match[2]), [undefined, 'light', 'system']);
    for (const [, , theme, declarations] of scopes) {
      const actual = Object.fromEntries([...declarations.matchAll(/--([\w-]+):\s*([^;]+);/g)]
        .map(([, name, value]) => [name, value.trim()]));
      for (const [name, color] of Object.entries(theme ? light : dark)) {
        assert.equal(actual[cssName(name)], color, `${theme ?? 'dark'} ${name}`);
      }
    }
  }
  for (const [name, value] of [
    ['control-gap', `${tokens.space.controlGap}px`], ['group-gap', `${tokens.space.relatedGroupGap[1]}px`],
    ['section-gap', `${tokens.space.sectionGap}px`],
    ['touch-target', `${tokens.density.touchControlMinWidth}px`],
    ['motion-short', `${tokens.motion.shortTransition}ms`], ['motion-panel', `${tokens.motion.panelTransition}ms`],
  ]) assert.ok(css.includes(`--${name}: ${value};`), name);
  for (const [name, role] of Object.entries(tokens.surfaceAliases)) {
    assert.ok(css.includes(`--${name}: var(--${cssName(role)});`), name);
  }
  assert.ok(Math.max(tokens.motion.shortTransition, tokens.motion.panelTransition) <= tokens.motion.maximumTransition);
});

test('dark charcoal levels step 5–10% in relative luminance in both encodings', () => {
  for (const palette of [tokens.color, tokens.colorOklch.dark]) {
    const levels = [palette.background, palette.surface, palette.raised].map(luminance);
    const [min, max] = tokens.contrast.darkSurfaceRelativeLuminanceStep;
    for (let i = 1; i < levels.length; i++) {
      const step = levels[i] / levels[i - 1] - 1;
      assert.ok(step >= min && step <= max, `Relative luminance step: ${step}`);
    }
  }
});

test('both themes preserve unrounded text, primary, semantic, focus, and boundary contrast', () => {
  for (const palette of [tokens.color, tokens.lightColor, tokens.colorOklch.dark, tokens.colorOklch.light]) {
    const requireRatio = (foreground, background, minimum) => {
      const measured = ratio(palette[foreground], palette[background]);
      assert.ok(measured >= minimum, `${foreground} on ${background}: ${measured} < ${minimum}`);
    };
    for (const background of ['background', 'surface', 'raised']) {
      for (const text of ['foreground', 'muted', 'info', 'warning', 'success', 'danger']) {
        requireRatio(text, background, 4.5);
      }
      for (const indicator of ['accent', 'focus', 'border', 'progress']) {
        requireRatio(indicator, background, 3);
      }
    }
    for (const background of ['action', 'actionHover', 'actionPressed']) {
      requireRatio('foreground', background, 5);
      requireRatio('border', background, 3);
    }
  }
});
