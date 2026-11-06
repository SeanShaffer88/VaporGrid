# Changelog

Changes are grouped by release status. Future releases use [Semantic Versioning](https://semver.org/) for the documented token and interaction contracts. Design revisions identify guidance milestones.

## Unreleased

No changes yet.

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
