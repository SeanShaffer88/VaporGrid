# Changelog

Changes are grouped by release status. Future releases use [Semantic Versioning](https://semver.org/) for the documented token and interaction contracts. Design revisions identify guidance milestones.

## Unreleased

### Added

- Dark workspace tread-plate guidance and a reusable SVG swatch with measured contrast against the brightest ridge.
- Generated token exports in `dist/`: W3C DTCG JSON, WinUI 3 ThemeDictionaries with a HighContrast mapping, WPF dark and light dictionaries, Rust, Slint, and Godot. `tools/build-tokens.mjs` builds them, and `demo/tokens.css`, from `docs/tokens.json`. CI fails when they are stale.
- A `selected` token (`--surface-4`) for selected rows, the current navigation item, and secondary control hover.
- Distinctness minimums in `tokens.json` → `contrast`, with tests: selected vs surface, primary action vs raised and between its states, and focus vs accent.
- Revision 5 OKLCH design tokens, including three charcoal elevation levels, with CSS custom properties and JSON data.
- A keyboard command palette for the workspace's existing actions.
- Component usage guidance, a public reference site, and GitHub Actions validation before deployment.

### Changed

- Light primary action `#E4E4E9` → `#D0D0D7` (hover `#CACAD1`, pressed `#C3C3CA`). It previously matched Raised exactly.
- Light focus `#9E1534` → `#D61F45`. It previously matched the light accent, so a focused selected item showed only one cue.
- Dark accent `#D61F45` → `#DC2749` (OKLCH lightness 0.566 → 0.582). This keeps the selection marker at 3:1 or more on the new selected fill.
- Revision 2 color tables moved to `docs/history/color-studies.md`. The guidelines now show only current values.
- Primary action emphasis uses a neutral raised treatment. Crimson serves focus, selection, and labeled destructive cues.
- Documentation defines a WCAG 2.2 AA target, a separate 44 × 44 CSS px touch policy, and a dominant judgment for each view.
- The README explains the audience, design decisions, visual studies, and ways to contribute.

### Earlier design revisions

- Revision 4 introduced responsive Settings, staged inspector width, and full action rows.
- Revision 3 explored tactile rims and recessed controls.
- Revision 2 introduced the interactive workspace, component studies, and original icons.
