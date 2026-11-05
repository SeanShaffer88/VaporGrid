# Revision 5 materials

Opaque matte compartments use three charcoal levels. The workspace background uses `--surface-1`, structural panels use `--surface-2`, and selected rows and secondary hover fills use `--surface-3`. Flat table content keeps its existing boundaries. Fine rims and shallow field insets retain the tactile treatment. [Reusable CSS tokens](../demo/tokens.css) · [Machine-readable values](tokens.json)

Primary actions use a neutral solid fill and a semibold label. A lighter hover fill and a deeper pressed fill show feedback while keeping the control in place. Disabled controls use Surface, a muted label, and a dashed boundary. Crimson identifies selection, focus, and explicitly labeled destructive actions. Progress, the brand mark, and the optional decorative edge use neutral tones. Error, warning, success, and information keep their own semantic colors and labels.

Body typography starts at 16 CSS pixels under default browser settings and follows user font sizing. Smaller labels and metadata retain their contrast. Grouped controls default to 8px gaps with a 6px minimum. Narrow layouts and coarse pointers use a 44 by 44px minimum for standalone interactive controls and their clickable labels. The reference keeps the 180ms drawer entrance and limits nonessential transitions to 200ms. Reduced-motion and forced-color preferences use the browser’s corresponding modes.

## Measured palette contract

The dark Background, Surface, and Raised OKLCH lightness values are 0.240, 0.247, and 0.254, with constant chroma and hue. Their linear-sRGB relative luminance increases by 9.01% and 8.75%. The rounded sRGB fallback steps are 9.78% and 6.70%. The 5–10% target applies to the relative change from each preceding dark surface. [CSS Color 4 conversion method](https://www.w3.org/TR/css-color/#color-conversion-code)

| Checked pairing | Dark minimum | Light minimum |
| --- | ---: | ---: |
| Body and muted labels on three surfaces | 7.95:1 | 6.28:1 |
| Semantic labels on three surfaces | 9.12:1 | 5.66:1 |
| Primary label in default, hover, and pressed states | 8.95:1 | 10.50:1 |
| Focus outline on three surrounding surfaces | 4.94:1 | 6.35:1 |
| Control boundary across surfaces and primary states | 3.28:1 | 3.61:1 |
| Selection indicator on three surfaces | 3.12:1 | 6.35:1 |

Figures are rounded for display. `node --test demo/tokens.test.mjs` compares unrounded ratios in both encodings, checks CSS and JSON agreement, and validates the dark surface steps. [W3C non-text contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast)
