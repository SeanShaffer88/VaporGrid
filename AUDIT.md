# Audit · revision 6

Independent review of revision 5.5.0, with what changed and the evidence. Method: read the README, guidelines, materials, tokens, mockups and demos; measured token contrast with WCAG relative luminance; rebuilt and tested the revision. Runtime and assistive-technology testing remain pending (see [verification](docs/verification.md#revision-6-verification)).

| # | Finding | Severity | Resolution | Evidence |
| --- | --- | --- | --- | --- |
| 1 | Accent fill `#76172A` measured 1.51:1 on `#1F1F21`, below the 3:1 non-text target | High | New crimson `action` tokens at 3.09–3.43:1 on dark surfaces. Deep accent restricted to large tinted regions with a marker | `demo/tokens.test.mjs` |
| 2 | Spec said neutral primary, mockups and PortableForge used crimson | High | Primary is crimson in the spec, both demos and the tokens | Demo CSS, README |
| 3 | Vaporwave identity removed, name and look disagreed | Medium | Grid signature in empty states, progress and the active-region rule. Texture is optional (soft wood grain) | [Materials](docs/materials.md#grid-signature) |
| 4 | Accent budget by coverage percentage did not measure what matters | Medium | One crimson element per region | [Guidelines](docs/design-guidelines.md) |
| 5 | Global Comfortable density clashed with the dense pitch | Medium | Per-component density, new Per component default and row heights | Tokens, tests |
| 6 | Elevation relied on 5–10% luminance steps | Medium | `edge` token and 1px borders at ≥1.4:1 | Tests |
| 7 | AI mockups drifted from the spec | Medium | Replaced with screenshots of running demos. Old images moved to `assets/history` | `assets/` |
| 8 | Presets recolored only focus and selection | Low | Presets recolor accent, primary action, selection and focus | Tests |
| 9 | Documentation volume hid the rules | Low | One-page quick reference. Old revisions moved to history | `docs/` |
| 10 | CC BY applied to code and tokens | Low | MIT for code and generated exports | `LICENSE-CODE` |
| 11 | Standard tied to one product type | Medium | Category layouts for eight archetypes and a decisions record | `docs/categories.md` |

| 12 | Standard lacked patterns for multi-mode creative tools | Medium | Modes, panels, value controls, timelines, Graphite preset, polish checklist| `docs/workspaces.md` |

## Not done

- Protanopia and other color-vision simulation.
- Screen-reader, keyboard and zoom passes on the new category demo.
- Screenshots of the light theme for the category demo.
- Real Windows high-contrast verification of the `HighContrast` XAML mapping.
