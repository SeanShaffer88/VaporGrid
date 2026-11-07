# VaporGrid design guidelines · revision 6

A dense, tactile standard for long-session desktop software of any kind: editors, data tools, media tools, monitors, utilities, communication, CAD, and system settings. It defines tokens, regions, density, and behavior. It does not define your product's content. [One-page summary](quick-reference.md) · [Category layouts](categories.md) · [Workspaces](workspaces.md) · [Polish checklist](polish.md) · [Decisions](decisions.md) · [Live demo](https://seanshaffer88.github.io/VaporGrid/demo/) · [Category demo](https://seanshaffer88.github.io/VaporGrid/demo/categories/) · [Tokens](tokens.json)

Revisions 2–5 are kept in [history](history/revisions-2-5.md). Where they conflict with this page, this page wins.

## Principles

1. **One dominant region per view.** The task decides which region leads. Give it 55–70% of the width and let the rest support it. Equal columns signal that no one decided.
2. **Crimson means "here, now."** At most one crimson element per region: the primary action, the selection marker, or the active-region rule. Never for data series, syntax, or decoration.
3. **Structure from edges, state from fills.** Compartments are separated by a 1px `edge` border. Luminance steps only mark hover and selection.
4. **Every task has a keyboard path** and a visible shortcut. Ctrl/⌘+K opens commands.
5. **Density follows the component, not the app.** See [density](#density).
6. **Honest status.** Real operation names, real units, real cancel. Pair color with text or shape.
7. **Static by default.** No ambient motion. User-triggered transitions stay under 200 ms and respect reduced motion.

## Color

Three charcoal surfaces (`background`, `surface`, `raised`) plus `selected`. They differ by 5–10% relative luminance on purpose, so they are not a structural cue. Use `edge` for that.

| Role | Use | Rule |
| --- | --- | --- |
| `action`, `actionHover`, `actionPressed` | The primary action fill | Crimson. 3:1 against every surface, so it needs no extra rim. `actionForeground` label ≥5:1 (hover ≥4.5:1) |
| `accent` (`#76172A`) | Large tinted regions such as a selected row band or banner | 1.5:1 on dark surfaces. Never alone. Always with a marker and a label |
| `selectionIndicator` | Selection marker, active-region rule | ≥3:1 on every surface and the grid |
| `focus` | Keyboard focus outline | Independent of selection. A focused selected item shows both |
| `edge` | 1px compartment and table borders | ≥1.4:1 against all surfaces |
| `border` | Control boundaries (fields, secondary buttons) | ≥3:1 |
| `grid` | The grid motif lines | 1.04–1.3:1 against surfaces. Text over it stays ≥4.5:1 |
| `info` `warning` `success` `danger` | Status text | Always with a word. Never brand crimson |

Primary action: one per view, crimson fill, clear verb. Secondary actions use `raised` with a `border`. Destructive actions use `danger` text with an icon and a confirmation that names the effect.

Theme (System, Light, Dark) and accent preset (Crimson, Blue, Teal) are independent. A preset recolors `accent`, the primary action, selection, and focus together, so a Blue product does not carry crimson buttons. Forced-colors mode uses system colors.

## Layout

Map navigation, primary work, contextual detail, and status to explicit regions. Keep gutters narrow and consistent. Give each region a heading and a purpose.

- **Asymmetry is the default.** A dominant region, one or two supporting regions at 20–35%, and a status strip. Avoid equal-width compartments with different content.
- **Fit.** Windows, dialogs, forms and wizard pages fit without scrollbars. Data containers (tables, trees, logs, editors, terminals, canvases) scroll or virtualize inside their own bounded viewport with visible position and keyboard access. The main window never scrolls. Page unbounded lists and reports.
- **Fill, no dead space.** Every region has a job and grows to do it. Surplus width goes to the dominant region. Surplus height goes to the region that benefits most: a list, table, log, canvas or timeline shows more rows or a larger view. Fill with function (more data, a shortcut list, recent items, a primary action), never with decoration. An empty state is a useful state: it shows the primary action, recent items and shortcuts, and uses the `grid` motif, not a blank area. Reflow a short form into columns before leaving a gap. Intentional space is allowed only as padding between compartments, around a focus target, or as the neutral `surround` of a viewport.
- **Data lists are gridded.** Any list of records (installed programs, files, history, layers, logs) is a table with row and column gridlines drawn in `edge`, a fixed header, tabular figures right-aligned, and a selected row marked by a `selectionIndicator` bar plus the `selected` fill. It shows as many rows as its box allows and scrolls or virtualizes inside that box. Lists of fewer than a handful of fixed items, such as a menu or tab bar, are not data lists and take no gridlines.
- **Compartments** define minimum size, resize limits, collapse behavior and a visible restore. Keep status and recovery reachable when collapsed. Resize and collapse are keyboard operable, labeled, and expose expanded state.
- **Active-region rule.** A 2px `selectionIndicator` rule under the focused compartment's header. One per window.
- **Modal vs inline.** Use a modal only for a decision that blocks work. Prefer inline messages, drawers and non-modal panels. A modal uses a native dialog, contains focus, closes on Escape, and returns focus to its trigger.
- **Hidden controls.** Progressive disclosure is fine. Primary actions and commands are never hidden. A collapsed or auto-hidden region needs a visible restore control and a command-palette entry.
- **Resizing.** Test the smallest supported size, 200% text, long localized strings, and populated, error and progress states. Reflow instead of clipping.

## Modes and panels

Products with several jobs use saved-layout [modes](workspaces.md#modes) (3 to 9, Ctrl/⌘+1 to 9) and [panels](workspaces.md#panels) with a keyboard path for every drag. Value controls show a number and unit, accept typed entry, and reset on double-click. Color-critical tools offer the Graphite preset and the neutral `surround` for the viewport.

## Density

Density is per component class. [Tokens](tokens.json) hold the numbers.

| Class | Default | Control height | Row height |
| --- | --- | --- | --- |
| Data rows, trees, toolbars, panel headers, timelines, meters | Compact | 32 | 28 |
| Navigation, forms, dialogs | Comfortable | 40 | 36 |
| Touch input | Touch | 48 | 48 |

A user can override the whole app in Settings (Per component, Compact, Comfortable, Touch). Density changes spacing, never type size. Keep 6 px minimum between independent controls (8 default), 12–16 between groups, 24 between sections. Narrow or coarse-pointer contexts raise targets to 44 px.

## Typography

Windows: Segoe UI. macOS and Linux use the system UI font (`system-ui`). Monospace: Cascadia Mono, then Consolas, then the platform default. Body is 16 CSS px at the default text size and follows user scaling. Weight and placement set hierarchy before color or glow. Monospace is for code, timecodes and aligned technical values only.

## Signature: the grid

The grid is a quiet motif that carries meaning in three places and nowhere else:

1. **Empty states and canvases:** a 24 px line grid in `grid`. It says "space to fill." Never behind text-dense content.
2. **Determinate progress:** ten equal segments. Indeterminate progress uses a moving segment and stops under reduced motion.
3. **Active-region rule:** the crimson header rule is the grid's one bright line.

The grid is static and decorative. Fields, buttons, rows and state fills stay solid. The soft wood-grain treatment is an optional dark background; see [materials](materials.md#dark-wood-grain).

## Interaction and feedback

Provide a visible focus indicator, logical Tab order and discoverable shortcuts that follow platform conventions. Hover, focus, selection and disabled states stay distinguishable. Write the next action in plain language. Keep status and retry controls in a predictable place. Name the current operation, units and percentage when known, with Pause and Cancel where real. Report completion and failure explicitly with a recovery action. Do not fabricate progress.

Context awareness means OS signals only: theme, contrast, reduced motion, text scale, pointer type. VaporGrid does not use location, activity tracking or behavioral profiling.

## Accessibility

Target WCAG 2.2 AA: 4.5:1 normal text, 3:1 large text and required non-text indicators, a 44 × 44 CSS px touch policy (stricter than AA's 24 × 24 criterion). Static images cannot show keyboard behavior, screen-reader output or reduced-motion support. Test in the target application and record platform, settings and results before claiming support. Test crimson cues with a protanopia simulator: selection and status always have a text or shape cue.

## Adaptation

On desktop, test resizing, keyboard-only operation, text scaling, long labels and restored layouts. On touch devices, stack regions around the primary task and test on a device. Reuse the host framework's components; VaporGrid supplies tokens and rules, not a framework. [Category layouts](categories.md) show the same system in eight product types.

## Rollout policy

For the maintainer's projects, schedule adoption for each project's next planned release. First map the project's real tasks, then show project-specific mockups for review before implementation. This is the maintainer's policy, not a license condition on reusers.
