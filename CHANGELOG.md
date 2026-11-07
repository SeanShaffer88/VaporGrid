# Changelog

Changes are grouped by release status. Future releases use [Semantic Versioning](https://semver.org/) for the documented token and interaction contracts. Design revisions identify guidance milestones.

## 6.0.0 · 2026-11-06

- `docs/adoption.md`: which export to use per stack (web, Rust, Slint, WPF, WinUI 3, WinForms, Godot), the order to apply the rules, native Windows notes, a verification checklist and a rollout note.

- Light-theme mockup set and slideshow for all eight programs, and a Graphite-preset set for the image and video editors.
- `fill` and `dataList` token sections, `docs/data-lists.md`, and a test that keeps them consistent with density, edge and selection tokens.
- Light `edge` darkened from `#BFBFC3` to `#B8B8BD` so gridlines on a selected row reach the 1.4:1 minimum.

- Eight application mockups and an animated slideshow in the README, one for each program type: spreadsheet, file compare, music production, image editor, video editor, code editor, program manager and monitoring console.
- The optional dark workspace background texture is now a soft wood grain (`assets/vaporgrid-wood-grain.svg`, texture option `wood`). It replaces the tread plate.

- Layout rules: "Fill, no dead space" and "Data lists are gridded" (row and column gridlines in `edge`, fixed header, selected-row bar). Guidance only; no new demo pages.

Revision 6. Breaking token changes: see Changed.

### Added

- `actionForeground`, `edge` and `grid` color roles in every encoding and export.
- Category layouts: `docs/categories.md`, eight archetype wireframes in `demo/categories/`, and dark-theme screenshots.
- `docs/quick-reference.md` (one page), `docs/decisions.md` (adopted, adapted and declined ideas), `AUDIT.md`, `CREDITS.md`, `DESCRIPTION.md`.
- Signature grid motif: 24 px empty-state grid, ten-segment determinate progress and a 2px active-region rule.
- Per-component density (`density.perClass`), row heights, and a Per component default in Settings.
- Fit rule that exempts data containers, and guidance for modal versus inline use and hidden controls.
- `LICENSE-CODE` (MIT) for code and generated exports.
- Tests for primary action contrast, edge and grid ranges, per-preset action contrast and the new density default.

- `surround` role and a Graphite preset (neutral action, selection, focus and accent) for color-critical work. The demo adds a Graphite accent option.
- Workspace patterns: `docs/workspaces.md`, `docs/polish.md`, a `workspace` token section (modes, panels, value controls, tabular figures).
- Compact density for panel headers, timelines and meters.
- Tests for the neutral surround, the Graphite preset and workspace token sanity.

### Changed

- **Breaking:** `action`, `actionHover` and `actionPressed` are now the crimson primary fill (dark `#D02946`, `#D6304B`, `#CA2141`; light `#B40234`, `#A3052F`, `#920629`) with a white `actionForeground` label. They were neutral greys. Secondary controls use `raised` and `border`.
- **Breaking:** appearance presets now override `accent`, `action`, `actionHover`, `actionPressed`, `selectionIndicator` and `focus`. DTCG `accentPresets` gained these roles.
- `accent` (`#76172A`) is limited to large tinted regions with a marker.
- Primary label contrast targets: at least 5:1 at rest and pressed, 4.5:1 on hover. The primary fill reaches 3:1 on every surface.
- Replaced the below-5% accent coverage review with one crimson element per region.
- Structure comes from `edge` borders. Luminance steps mark state.
- Panels, dialogs and tables use `edge`. Controls keep `border`.
- Density default is `auto` (per component). Stored `compact`, `comfortable` and `touch` choices still load.
- Guidelines rewritten for revision 6. Revisions 2–5 moved to `docs/history/revisions-2-5.md`.
- README rewritten around six rules and category coverage.
- AI-generated mockups moved to `assets/history`. Revision 6 images are screenshots of the running demos.
- Documentation and images stay CC BY 4.0. Code and generated exports are MIT.
- The tread plate is an optional legacy texture. The grid is the signature.

### Removed

- The neutral-primary rule and the border-on-primary contrast check.

## 5.5.0 · 2026-11-05

First tagged VaporGrid release. It brings together the Revision 5 tokens, interaction reference, and earlier design foundations. [Release](https://github.com/SeanShaffer88/VaporGrid/releases/tag/v5.5.0)

### Added

- Independent Crimson, Blue, and Teal appearance presets for selection markers and focus, with generated CSS and DTCG values and backward-compatible preference storage.
- Compact workflow recipes for forms, review paging, progress, and results, with a text-size fit matrix and plain-language copy examples.
- An interactive PortableForge reference with sample capture, review, save, and rebuild states, including a recoverable setup mismatch.
- A square tread-plate preset table and separate accent, focus, selection, and status color roles.
- Dark workspace tread-plate guidance and a reusable SVG swatch with measured contrast against the brightest ridge.
- Generated token exports in `dist/`: W3C DTCG JSON, WinUI 3 ThemeDictionaries with a HighContrast mapping, WPF dark and light dictionaries, Rust, Slint, and Godot. `tools/build-tokens.mjs` builds them, and `demo/tokens.css`, from `docs/tokens.json`. CI fails when they are stale.
- A `selected` token (`--surface-4`) for selected rows, the current navigation item, and secondary control hover.
- Tested contrast minimums for selected fill against Surface, primary actions against Raised and between their states, and focus against the selection marker.
- Revision 5 OKLCH design tokens, including three charcoal elevation levels, with CSS custom properties and JSON data.
- A keyboard command palette for the workspace's existing actions.
- Component usage guidance, a public reference site, and GitHub Actions validation before deployment.

### Changed

- Set the canonical accent to `#76172A` in both themes. Use `accentForeground` for its labels and `selectionIndicator` for existing selection markers. Focus keeps its dedicated color.
- Light primary actions use `#D0D0D7`, `#CACAD1` on hover, and `#C3C3CA` when pressed. The resting fill is distinct from Raised.
- Light focus uses `#D61F45`, distinct from the default light selection marker `#9E1534`.
- The default dark selection marker uses `#DC2749` and reaches at least 3:1 contrast against the selected fill.
- Revision 2 color tables moved to `docs/history/color-studies.md`. The guidelines now show only current values.
- Primary action emphasis uses a neutral raised treatment. Crimson serves focus, selection, and labeled destructive cues.
- Documentation defines a WCAG 2.2 AA target, a separate 44 × 44 CSS px touch policy, and a dominant judgment for each view.
- The README explains the audience, design decisions, visual studies, and ways to contribute.

### Earlier design revisions

- Revision 4 introduced responsive Settings, staged inspector width, and full action rows.
- Revision 3 explored tactile rims and recessed controls.
- Revision 2 introduced the interactive workspace, component studies, and original icons.
