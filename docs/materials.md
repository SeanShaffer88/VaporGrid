# Revision 6 materials

Opaque matte compartments use three charcoal levels. The workspace background uses `--surface-1`, structural panels use `--surface-2`, and raised surfaces and row hover use `--surface-3`. Selected rows, the current navigation item and secondary control hover use `--surface-4` (`selected`). These levels differ by only 5–10% in luminance, so they do not carry structure. A 1px `--edge` border separates compartments and table rows. Fine rims and shallow field insets keep the tactile treatment. [Reusable CSS tokens](../demo/tokens.css) · [Machine-readable values](tokens.json)

The primary action is a crimson fill (`--action`) with a white label (`--action-foreground`). A lighter hover fill and a deeper pressed fill show feedback while keeping the control in place. The fill reaches 3:1 against every surface, so it needs no extra boundary. Secondary controls use `--raised` with a `--border`. Disabled controls use Surface, a muted label and a dashed boundary. Focus and selection use dedicated indicators. Error, warning, success and information keep their own semantic colors and labels.

Body typography starts at 16 CSS pixels under default browser settings and follows user font sizing. Smaller labels and metadata retain their contrast. Grouped controls default to 8px gaps with a 6px minimum. Narrow layouts and coarse pointers use a 44 by 44px minimum for standalone interactive controls and their clickable labels. The reference keeps the 180ms drawer entrance and limits nonessential transitions to 200ms. Reduced-motion and forced-color preferences use the browser's corresponding modes.

## Crimson roles

<img src="../assets/vaporgrid-accent.svg" alt="Deep crimson #76172A" width="96" height="32">

Crimson plays four separate roles. Do not use one value for all of them.

| Role | CSS token | Dark | Light | Application |
| --- | --- | --- | --- | --- |
| Primary action | `--action` · `--action-hover` · `--action-pressed` | `#D02946` · `#D6304B` · `#CA2141` | `#B40234` · `#A3052F` · `#920629` | The one primary action in a view. Label in `--action-foreground` (`#FFFFFF`) |
| Deep accent | `--accent` | `#76172A` | `#76172A` | Large tinted regions, such as a selected row band. Always with a marker and a label. Label in `--accent-foreground` measures 9.66:1 |
| Selection | `--selection-indicator` | `#DC2749` | `#9E1534` | Marker beside the selected item and the active-region rule |
| Focus | `--focus` | `#FF4D73` | `#D61F45` | Independent outline with a visible offset |

Use at most one crimson element per region. Do not use brand crimson for data series, syntax colors or decoration.

### Other roles

| Role | CSS token | Dark | Light | Application |
| --- | --- | --- | --- | --- |
| Edge | `--edge` | `#414144` | `#BFBFC3` | 1px compartment and table borders |
| Control boundary | `--border` | `#92929C` | `#676772` | Fields and secondary buttons |
| Viewport surround | `--surround` | `#262626` | `#D6D6D6` | Neutral, chroma-free surround for color-critical viewports. Text and indicators stay legible on it |
| Grid | `--grid` | `#28282B` | `#F2F2F5` | Grid lines in empty states, canvases and progress segments |
| Error | `--danger` | `#FFB1A8` | `#9D2B1F` | A labeled error with the affected input and next action |
| Warning | `--warning` | `#F2CD82` | `#735100` | A named warning with the required action |
| Success | `--success` | `#8FD4AD` | `#236340` | A labeled completion or recovery result |
| Information | `--info` | `#9FC9FF` | `#174E85` | An explanatory label or message |

### Appearance presets

Keep theme and accent color as independent choices. A preset recolors the deep accent, the primary action, the selection marker and the focus outline together, so a Blue or Teal product has no crimson buttons. Crimson uses the base theme values. Graphite is a neutral preset for color-critical work: its action, selection, focus and accent carry no visible tint. Semantic colors, edges and surfaces do not change.
| Preset | Dark action | Dark selection | Dark focus | Light action | Light selection | Light focus |
| --- | --- | --- | --- | --- | --- | --- |
| Crimson | `#D02946` | `#DC2749` | `#FF4D73` | `#B40234` | `#9E1534` | `#D61F45` |
| Blue | `#036DCD` | `#5FA8FF` | `#ACD1FF` | `#0059AA` | `#1558A6` | `#327AD1` |
| Teal | `#027B74` | `#37B7AF` | `#8FE4D9` | `#08645E` | `#00665F` | `#13877F` |
| Graphite | `#6D6D74` | `#94949C` | `#DCDCE3` | `#585860` | `#585860` | `#75757D` |

Web consumers set `data-accent` on the document root alongside `data-theme`. The generated CSS resolves Light, Dark and System and uses `Highlight` for both cues in forced colors. Native consumers keep the base dark and light palette API and apply the preset overrides for the effective theme. Store a validated preset ID and fall back to Crimson when it is missing or unknown. Alternate sRGB values are in `color.accentPresets` in the [generated DTCG JSON](../dist/vaporgrid.tokens.json) and as sRGB and OKLCH in the [source tokens](tokens.json).

## Grid signature

The grid is a static, quiet motif that appears in three places:

| Where | Spec |
| --- | --- |
| Empty states and canvases | 24 px square cells, 1px lines in `--grid`. Never behind text-dense content |
| Determinate progress | Ten equal segments with a gap between them. Indeterminate progress uses a moving segment and becomes static under reduced motion |
| Active-region rule | A 2px `--selection-indicator` line under the focused compartment's header. One per window |

`--grid` stays within 1.04–1.3:1 of every surface. Text, selection markers, focus outlines and control boundaries drawn over it keep their normal contrast. Forced colors and reduced-motion modes remove the pattern and keep the status text.

## Dark wood grain

This is an optional texture for exposed dark workspace backgrounds. The default signature is the [grid](#grid-signature). Use a soft, low-contrast wood grain: long, gently wavy horizontal lines of uneven spacing and weight, with a few nested rings for a cathedral figure. Keep the base charcoal, and draw the grain with near-neutral values slightly warmer than the base. The pattern is static and tiles seamlessly.

<img src="../assets/vaporgrid-wood-grain.svg" alt="Charcoal surface with faint, gently wavy horizontal wood-grain lines and a few nested rings" width="160" height="96">

Use the flat background in Light and forced-color modes, including when System resolves to Light. Check label, boundary, selection, and focus contrast against the brightest grain line. Apply the existing 4.5:1 normal-text and 3:1 required non-text contrast targets.

### Presets

| Preset | Tile geometry | Relief budget | Use |
| --- | --- | --- | --- |
| Wood grain | 160 × 96 CSS px seamless tile, 1 to 1.5 CSS px grain lines | At most 1.15:1 between the brightest and darkest pixels | Exposed dark workspace backgrounds. Repeat at the same size along both axes. |
| Flat | Solid surface | 1:1 within the fill | Light and forced-color modes, dense reading surfaces, fields, and controls. Also offer it as a dark workspace preference. |

The reference swatch uses `#1F1F21` for the base, `#262523` for the lightest grain, `#222220` for the mid tone and `#1C1C1B` for the darkest grain. The tests keep the lightest-to-darkest contrast at or below 1.15:1 and check text, boundary, focus and selection contrast against the lightest grain.

## Measured palette contract

The dark Background, Surface, and Raised OKLCH lightness values are 0.240, 0.247, and 0.254, with constant chroma and hue. Their linear-sRGB relative luminance increases by 9.01% and 8.75%. The rounded sRGB fallback steps are 9.78% and 6.70%. The 5–10% target applies to the relative change from each preceding dark surface. [CSS Color 4 conversion method](https://www.w3.org/TR/css-color/#color-conversion-code)

| Checked pairing | Dark minimum | Light minimum |
| --- | ---: | ---: |
| Body and muted labels on four surfaces | 7.32:1 | 5.89:1 |
| Semantic labels on four surfaces | 8.39:1 | 5.30:1 |
| Primary label at rest and pressed (hover) | 5.14:1 (4.79:1) | 7.00:1 (8.02:1) |
| Focus outline on four surrounding surfaces | 4.55:1 | 3.75:1 |
| Primary fill against background, surface and raised | 3.09:1 | 5.53:1 |
| Control boundary on surfaces | 3.28:1 | 3.19:1 |
| Edge against background, surface and raised | 1.56:1 | 1.45:1 |
| Selection indicator on four surfaces, including the selected fill | 3.07:1 | 5.95:1 |

Fills that mean different states must also differ from each other. These are fill-to-fill ratios, so they support recognition rather than replace boundaries, markers and labels.

| Distinctness check | Dark | Light | Minimum |
| --- | ---: | ---: | ---: |
| Selected fill against Surface | 1.11:1 | 1.35:1 | 1.10:1 |
| Primary action hover against rest | 1.07:1 | 1.15:1 | 1.05:1 |
| Primary action pressed against rest | 1.07:1 | 1.32:1 | 1.05:1 |
| Grid against surfaces (range) | 1.08–1.12:1 | 1.05–1.13:1 | 1.04–1.30:1 |
| Focus against selection indicator (a focused selected item shows two cues) | 1.48:1 | 1.59:1 | 1.30:1 |

Figures are rounded for display. `node --test demo/tokens.test.mjs` compares unrounded ratios in both encodings, checks CSS and JSON agreement, validates the dark surface steps, and enforces the distinctness minimums. `node tools/build-tokens.mjs --check` confirms that generated outputs match `tokens.json`. [W3C non-text contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast)
