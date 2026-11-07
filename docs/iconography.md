# Original Tessel iconography

Eleven original 24 × 24 action symbols use rounded geometric outlines and selective dot accents. The compositions were authored for Tessel by Sean Shaffer with AI assistance. No third-party glyph paths, icon packages, fonts, logos, or brand marks were copied or downloaded.

The broad inspiration is the hardware minimalism and secondary dot language associated with [Nothing OS](https://nothing.tech/nothing-os). This is an aesthetic reference, not an affiliation, endorsement, compatibility claim, or use of that company's iconography. The dots never carry the only meaning.

## Source and reuse

[demo/icons.svg](../demo/icons.svg) is the canonical sprite. Each `symbol` has a 24 × 24 viewBox, 1.6-unit outline, round joins, `currentColor`, and a meaningful ID: project, tasks, settings, details, play, pause, cancel, reset, check, warning, info. The [standalone sheet](../assets/tessel-icon-sheet.svg) is a presentation export derived from these symbols; it embeds their definitions so GitHub can render it without external files, fonts, scripts, or foreignObject. Change the sprite first and regenerate the sheet definitions when revising a path.

```html
<button>
  <svg width="20" height="20" aria-hidden="true" focusable="false">
    <use href="icons.svg#play"></use>
  </svg>
  Start simulation
</button>
```

Use a visible action label wherever possible. An icon-only control needs its own accessible name. Treat SVGs beside equivalent labels as decorative with `aria-hidden="true"`; do not put duplicate names on both. Use `currentColor` to follow foreground and forced-color settings. At small sizes, preserve the functional outline and label before preserving dot accents. Test 16, 20, and 24 CSS pixel renderings, contrast, and Windows contrast themes in the consuming application.

The sheet and sprite use the repository's [CC BY 4.0 license](../LICENSE), including attribution and indication of changes. See [ATTRIBUTION.md](../ATTRIBUTION.md). No separate icon license or font dependency is introduced.
