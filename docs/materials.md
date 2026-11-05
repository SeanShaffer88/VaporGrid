# Revision 5 materials

Opaque matte compartments use three charcoal levels. The workspace background uses `--surface-1`, structural panels use `--surface-2`, and raised surfaces and row hover use `--surface-3`. Selected rows, the current navigation item and secondary control hover use `--surface-4` (`selected`), a fill that stays visible against the panel. Flat table content keeps its existing boundaries. Fine rims and shallow field insets retain the tactile treatment. [Reusable CSS tokens](../demo/tokens.css) · [Machine-readable values](tokens.json)

Primary actions use a neutral solid fill and a semibold label. A lighter hover fill and a deeper pressed fill show feedback while keeping the control in place. Disabled controls use Surface, a muted label, and a dashed boundary. Crimson identifies selection, focus, and explicitly labeled destructive actions. Progress, the brand mark, and the optional decorative edge use neutral tones. Error, warning, success, and information keep their own semantic colors and labels.

Body typography starts at 16 CSS pixels under default browser settings and follows user font sizing. Smaller labels and metadata retain their contrast. Grouped controls default to 8px gaps with a 6px minimum. Narrow layouts and coarse pointers use a 44 by 44px minimum for standalone interactive controls and their clickable labels. The reference keeps the 180ms drawer entrance and limits nonessential transitions to 200ms. Reduced-motion and forced-color preferences use the browser’s corresponding modes.

## Measured palette contract

The dark Background, Surface, and Raised OKLCH lightness values are 0.240, 0.247, and 0.254, with constant chroma and hue. Their linear-sRGB relative luminance increases by 9.01% and 8.75%. The rounded sRGB fallback steps are 9.78% and 6.70%. The 5–10% target applies to the relative change from each preceding dark surface. [CSS Color 4 conversion method](https://www.w3.org/TR/css-color/#color-conversion-code)

| Checked pairing | Dark minimum | Light minimum |
| --- | ---: | ---: |
| Body and muted labels on four surfaces | 7.32:1 | 5.89:1 |
| Semantic labels on four surfaces | 8.39:1 | 5.30:1 |
| Primary label in default, hover, and pressed states | 8.95:1 | 9.27:1 |
| Focus outline on four surrounding surfaces | 4.55:1 | 3.75:1 |
| Control boundary across surfaces and primary states | 3.28:1 | 3.19:1 |
| Selection indicator on four surfaces, including the selected fill | 3.07:1 | 5.95:1 |

Fills that mean different states must also differ from each other. These are fill-to-fill ratios, so they support recognition rather than replace boundaries, markers and labels.

| Distinctness check | Dark | Light | Minimum |
| --- | ---: | ---: | ---: |
| Selected fill against Surface | 1.11:1 | 1.35:1 | 1.10:1 |
| Primary action against Raised | 1.36:1 | 1.21:1 | 1.05:1 |
| Focus against accent (a focused selected item shows two cues) | 1.48:1 | 1.59:1 | 1.30:1 |

Figures are rounded for display. `node --test demo/tokens.test.mjs` compares unrounded ratios in both encodings, checks CSS and JSON agreement, validates the dark surface steps, and enforces the distinctness minimums. `node tools/build-tokens.mjs --check` confirms that generated outputs match `tokens.json`. [W3C non-text contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast)
