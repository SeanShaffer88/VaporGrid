# VaporGrid quick reference · revision 6

One page. Full rules: [design guidelines](design-guidelines.md). Numbers: [tokens.json](tokens.json).

## Six rules

1. **One dominant region** per view, 55–70% wide. Supporting regions 20–35%. No equal columns.
2. **One crimson per region.** Primary action, selection marker, or active-region rule.
3. **Edges build structure.** 1px `edge` between compartments. Fills mark hover and selection only.
4. **Density per component.** Rows, trees, toolbars Compact. Forms, dialogs, navigation Comfortable.
5. **Keyboard first.** Every task has a path. Ctrl/⌘+K opens commands. Focus is always visible.
6. **Static and honest.** No ambient motion. Real status, real cancel, text with every color.

## Anatomy

```
+-----------------------------------------------------------+
| Title                         [secondary] [PRIMARY]       |  toolbar
+----------+--------------------------------+---------------+
| Nav /    | Dominant region (55-70%)       | Detail        |
| tree     | ======== active rule =======   | (20-35%)      |
| 15-20%   |                                | collapsible   |
+----------+--------------------------------+---------------+
| status: operation, units, shortcuts hint                  |
+-----------------------------------------------------------+
```

## Color at a glance (dark)

| Role | Value | Use |
| --- | --- | --- |
| background / surface / raised / selected | `#1F1F21` `#202123` `#222225` `#28292B` | Surfaces |
| edge | `#414144` | Compartment borders |
| action / hover / pressed | `#D02946` `#D6304B` `#CA2141` | Primary fill, white label |
| selection indicator / focus | `#DC2749` / `#FF4D73` | Marker, rule / keyboard focus |
| accent (deep) | `#76172A` | Large tinted regions with a marker |
| grid | `#28282B` | Empty states, canvases, progress segments |

## Density

| Class | Control | Row |
| --- | --- | --- |
| Compact (rows, trees, toolbars) | 32 | 28 |
| Comfortable (forms, dialogs, nav) | 40 | 36 |
| Touch | 48 | 48 |

Gaps: 6 min, 8 default, 12–16 between groups, 24 between sections.

## Do / Don't

| Do | Don't |
| --- | --- |
| One primary action, clear verb | Crimson on several buttons at once |
| Scroll inside tables, logs, editors | Scroll the main window |
| Inline messages and drawers | Modals for non-blocking info |
| Text + icon with every status color | Color-only meaning |
| Hide secondary tools with a visible restore | Hide primary actions or commands |
| Follow OS theme, contrast, motion, text size | Track location or behavior |
| Brand crimson for chrome | Brand crimson in charts or syntax |

## Pick a layout

Data & records, Editor & IDE, Media & creative, Monitoring & analytics, Utility & wizard, Communication, CAD & 3D, Settings & system tools. [Category layouts](categories.md).
