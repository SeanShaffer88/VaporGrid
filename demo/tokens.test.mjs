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

function actionTargets() {
  const [rest, hover] = tokens.contrast.actionLabelTarget.match(/at least ([\d.]+):1/g).map(text => Number.parseFloat(text.slice(9)));
  return { actionLabelMinimum: rest, actionHoverLabelMinimum: hover };
}

test('CSS and machine-readable palette agree across fallback, OKLCH, and System light', () => {
  const [regularColors] = css.split('@media (forced-colors: active)');
  const [fallback, preferred] = regularColors.split('@supports (color: oklch(0.5 0 0))');
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

test('appearance presets recolor the accent, primary action, selection and focus with usable contrast', () => {
  const tread = readFileSync(new URL('../assets/vaporgrid-tread-plate.svg', import.meta.url), 'utf8');
  const treadColors = [...tread.matchAll(/(?:fill|stroke)="(#[0-9a-f]{6})"/gi)].map(match => match[1]);
  const brightestTread = treadColors.sort((a, b) => luminance(a) - luminance(b)).at(-1);
  const exported = JSON.parse(readFileSync(new URL('../dist/vaporgrid.tokens.json', import.meta.url), 'utf8'));
  const roles = ['accent', 'action', 'actionHover', 'actionPressed', 'selectionIndicator', 'focus'];
  assert.equal(tokens.appearanceAccents.default, 'crimson');
  assert.doesNotMatch(css, /\[data-accent=crimson\]/);
  for (const id of ['blue', 'teal']) {
    const preset = tokens.appearanceAccents.presets[id];
    for (const [colors, dark, light, base] of [
      [preset, tokens.color, tokens.lightColor, true],
      [preset.oklch, tokens.colorOklch.dark, tokens.colorOklch.light, false],
    ]) {
      const selector = `:root[data-accent=${id}]`;
      for (const [theme, palette, scope] of [
        ['dark', dark, selector],
        ['light', light, `${selector}[data-theme=light]`],
        ['light', light, `${selector}[data-theme=system]`],
      ]) {
        const declared = colors[theme];
        const declarations = roles.map(role => `--${cssName(role)}: ${declared[role]};`).join(' ');
        assert.ok(css.includes(`${scope} { ${declarations} }`), `${id} ${theme} declarations`);
        const { selectionIndicator, focus } = declared;
        assert.ok(ratio(selectionIndicator, focus) >= tokens.contrast.focusSelectionMinimum);
        const surfaces = [palette.background, palette.surface, palette.raised, palette.selected];
        if (theme === 'dark') surfaces.push(brightestTread);
        for (const surface of surfaces) {
          assert.ok(ratio(selectionIndicator, surface) >= 3, `${id} ${theme} selection on ${surface}`);
          assert.ok(ratio(focus, surface) >= 3, `${id} ${theme} focus on ${surface}`);
        }
        const { actionLabelMinimum, actionHoverLabelMinimum } = actionTargets();
        assert.ok(ratio(palette.actionForeground, declared.action) >= actionLabelMinimum, `${id} ${theme} action label`);
        assert.ok(ratio(palette.actionForeground, declared.actionHover) >= actionHoverLabelMinimum, `${id} ${theme} hover label`);
        assert.ok(ratio(palette.actionForeground, declared.actionPressed) >= actionLabelMinimum, `${id} ${theme} pressed label`);
        assert.ok(ratio(palette.accentForeground, declared.accent) >= 5, `${id} ${theme} deep accent label`);
        for (const surface of [palette.background, palette.surface, palette.raised]) {
          for (const state of ['action', 'actionHover']) {
            assert.ok(ratio(declared[state], surface) >= tokens.contrast.actionSurfaceMinimum, `${id} ${theme} ${state} on ${surface}`);
          }
        }
        assert.ok(ratio(declared.actionHover, declared.action) >= tokens.contrast.distinctFillMinimum, `${id} ${theme} hover distinct`);
        assert.ok(ratio(declared.actionPressed, declared.action) >= tokens.contrast.distinctFillMinimum, `${id} ${theme} pressed distinct`);
      }
      void base;
    }
    for (const theme of ['dark', 'light']) {
      for (const role of roles) {
        assert.equal(exported.color.accentPresets[id][theme][role].$value.hex, preset[theme][role].toLowerCase());
      }
    }
  }
  assert.match(css, /@media \(forced-colors: active\)\s*\{\s*:root\s*\{ --selection-indicator: Highlight !important; --focus: Highlight !important;/);
});

test('the deep crimson accent matches the brand swatch and preserves label contrast', () => {
  const swatch = readFileSync(new URL('../assets/vaporgrid-accent.svg', import.meta.url), 'utf8');
  for (const palette of [tokens.color, tokens.lightColor]) {
    assert.equal(palette.accent, '#76172A');
    assert.ok(swatch.includes(`fill="${palette.accent}"`));
  }
  for (const palette of [tokens.color, tokens.lightColor, tokens.colorOklch.dark, tokens.colorOklch.light]) {
    assert.notEqual(palette.accent, palette.selectionIndicator);
    assert.ok(ratio(palette.accentForeground, palette.accent) >= 5);
    assert.ok(linearSrgb(palette.accent).every((channel, i) =>
      Math.abs(channel - linearSrgb('#76172A')[i]) < 1e-6));
  }
});

test('dark tread plate stays faint and preserves contrast at its brightest ridge', () => {
  const svg = readFileSync(new URL('../assets/vaporgrid-tread-plate.svg', import.meta.url), 'utf8');
  const colors = [...svg.matchAll(/(?:fill|stroke)="(#[0-9a-f]{6})"/gi)].map(match => match[1].toLowerCase());
  assert.ok(colors.includes(tokens.color.background.toLowerCase()));
  assert.ok(new Set(colors).size >= 4, 'Expected a base, highlight, shadow and seams');
  colors.sort((a, b) => luminance(a) - luminance(b));
  const brightest = colors.at(-1);
  assert.ok(ratio(colors[0], brightest) <= 1.15, 'Tread relief is too strong');
  for (const palette of [tokens.color, tokens.colorOklch.dark]) {
    for (const text of ['foreground', 'muted', 'info', 'warning', 'success', 'danger']) {
      assert.ok(ratio(palette[text], brightest) >= 4.5, `${text} on the tread ridge`);
    }
    for (const indicator of ['selectionIndicator', 'focus', 'border', 'progress']) {
      assert.ok(ratio(palette[indicator], brightest) >= 3, `${indicator} on the tread ridge`);
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
      for (const indicator of ['selectionIndicator', 'focus', 'border', 'progress']) {
        requireRatio(indicator, background, 3);
      }
    }
    const { actionLabelMinimum, actionHoverLabelMinimum } = actionTargets();
    requireRatio('actionForeground', 'action', actionLabelMinimum);
    requireRatio('actionForeground', 'actionPressed', actionLabelMinimum);
    requireRatio('actionForeground', 'actionHover', actionHoverLabelMinimum);
    for (const background of ['background', 'surface', 'raised']) {
      // The primary fill is its own 3:1 boundary, so it needs no extra rim.
      requireRatio('action', background, tokens.contrast.actionSurfaceMinimum);
      requireRatio('actionHover', background, tokens.contrast.actionSurfaceMinimum);
      requireRatio('edge', background, tokens.contrast.edgeMinimum);
      const grid = ratio(palette.grid, palette[background]);
      const [gridMin, gridMax] = tokens.contrast.gridRange;
      assert.ok(grid >= gridMin && grid <= gridMax, `grid vs ${background}: ${grid}`);
    }
    // Text drawn over the decorative grid keeps full contrast.
    for (const text of ['foreground', 'muted', 'info', 'warning', 'success', 'danger']) requireRatio(text, 'grid', 4.5);
    for (const indicator of ['selectionIndicator', 'focus', 'border']) requireRatio(indicator, 'grid', 3);
  }
});

test('density is chosen per component class and every target stays above the WCAG 2.2 minimum', () => {
  const { perClass, compact, comfortable, touch } = tokens.density;
  assert.equal(perClass.dataRows, 'compact');
  assert.equal(perClass.forms, 'comfortable');
  assert.equal(perClass.touch, 'touch');
  for (const mode of Object.values(perClass)) assert.ok(tokens.density[mode], `Unknown density: ${mode}`);
  for (const mode of [compact, comfortable, touch]) {
    assert.ok(mode.rowMinHeight >= 24 && mode.rowMinHeight <= mode.controlMinHeight);
  }
  assert.ok(compact.rowMinHeight < comfortable.rowMinHeight && comfortable.rowMinHeight < touch.rowMinHeight);
});

test('state fills and indicators that mean different things stay distinguishable', () => {
  const { distinctFillMinimum, selectedFillMinimum, focusSelectionMinimum } = tokens.contrast;
  for (const palette of [tokens.color, tokens.lightColor, tokens.colorOklch.dark, tokens.colorOklch.light]) {
    const requireRatio = (a, b, minimum) => {
      const measured = ratio(palette[a], palette[b]);
      assert.ok(measured >= minimum, `${a} vs ${b}: ${measured} < ${minimum}`);
    };
    // The primary action must not blend into secondary hover/raised fills or the panel.
    for (const surface of ['raised', 'surface']) requireRatio('action', surface, distinctFillMinimum);
    requireRatio('actionHover', 'action', distinctFillMinimum);
    requireRatio('actionPressed', 'action', distinctFillMinimum);
    requireRatio('actionPressed', 'actionHover', distinctFillMinimum);
    // A focused selected item shows two cues, not one.
    requireRatio('focus', 'selectionIndicator', focusSelectionMinimum);
    // Selection reads as a fill change, not only through its marker.
    requireRatio('selected', 'surface', selectedFillMinimum);
    requireRatio('selected', 'raised', distinctFillMinimum);
    // Content and focus remain legible on the selected fill.
    for (const text of ['foreground', 'muted', 'info', 'warning', 'success', 'danger']) requireRatio(text, 'selected', 4.5);
    for (const indicator of ['selectionIndicator', 'focus', 'border']) requireRatio(indicator, 'selected', 3);
  }
});
