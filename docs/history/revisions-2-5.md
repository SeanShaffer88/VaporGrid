# Revisions 2–5 (historical)

These sections were the normative contracts for earlier revisions. Revision 6 supersedes them where they conflict: [design guidelines](../design-guidelines.md), [tokens](../tokens.json).

## Revision 2 interaction contract

Revision 2 replaces uniform density and decorative emphasis with purposeful information density. Keep the primary task dominant, balance visual weight, and avoid equal-width compartments when their content differs. The six older concepts remain historical explorations rather than normative specifications.

### Density and scaling

| Mode | Use | Panel padding | Minimum control height |
| --- | --- | --- | --- |
| Compact | Repeated expert keyboard/mouse work | 12 CSS px equivalent | 32 CSS px equivalent |
| Comfortable (default) | Mixed reading and manipulation | 16 | 40 |
| Touch | Direct touch or greater motor spacing | 20 | 48 |

Density changes spacing rather than shrinking typography. The demo uses a 16px root with relative text sizes, wraps labels, and raises narrow-window controls to at least 44px. Recheck 320, 768, 1024, and 1440 CSS pixels, 200% text/zoom, localization, and physical-device targets. For genuinely two-dimensional content, follow the [compact fit](../design-guidelines.md#compact-fit) viewport and control rules.

### Brand and semantic feedback

Success and danger have independent theme tokens, separate from brand and focus. Success styles valid-name/recovery feedback and Completed; danger styles the invalid boundary, inline explanation, and labeled error recovery. Offline uses warning, empty recovery stays neutral, and Cancelled stays neutral. Explicit text remains present in every state. The focus outline continues to use the focus token.

Use distinct focus, selection, and destructive indicators. Pair status with explicit words and functional shape, such as In review, Needs check, Ready, Running, Paused, Completed, and Cancelled. Add icons where useful. The reference's original icons use a clear silhouette. [Iconography](../iconography.md) · [Measured palette contract](../materials.md#measured-palette-contract) · [Historical color studies](color-studies.md)

### Theme and component states

Provide user-facing System, Light, and Dark theme choices. System tracks OS preference changes. Offer a separate Accent color choice with Crimson, Blue, and Teal. Apply the selected preset to the focus outline and selection marker for the effective theme, and persist it independently of the theme. Forced colors must retain outlines, native controls, selected-row boundaries, and currentColor icons using system colors. Preserve all meaning under reduced motion. [Appearance presets](../materials.md#appearance-presets)

| Component | Applicable states and behavior |
| --- | --- |
| Button | Default, hover, visible keyboard focus, active, disabled, running operation with explicit status; cancellation stays distinct |
| Field | Visible label, focus, invalid boundary and inline explanation, valid feedback; helper text stays associated |
| Task row | Default, hover, selected with explicit pressed selection control, independent keyboard focus |
| Navigation | Current destination indicated structurally; anchors retain native keyboard behavior |
| Tabs, if adopted | Distinguish selected from focused; tablist arrow keys, Home/End and associated panels. Demo uses navigation links, not tabs |
| Inspector | Open, collapsed, reachable restore, pointer and keyboard resize, bounded width |
| Drawer/dialog | Native modal, initial focus, containment, Escape, return to trigger; same detail content and IDs |
| Recovery | Empty action, explicit local error, simulated offline state, retry feedback, preserved selection |
| Progress | Ready → Running → Paused/Resume → Completed or Cancelled; no timer in paused/terminal states; restart begins at zero |

### Compartment recovery and persistence

The desktop inspector is 240–420 CSS pixels wide, initially 300. Pointer capture keeps dragging stable. Left/Right move its inner boundary in 10px steps; Home/End choose limits. Its focusable vertical separator exposes name, orientation, controlled region and min/max/current values. Collapse leaves Details reachable. At narrow widths the same DOM becomes a native modal drawer, preserving content and avoiding duplicate IDs.

Persist display preferences only: bounded, versioned, allowlisted and validated. Malformed or denied storage must not prevent startup. Reset layout restores inspector width and visibility after native confirmation; cancelling preserves geometry and returns focus to Reset layout. Theme, density, and effects are independent. Opening or importing a module never starts work.

### Verification and adoption

[Verification evidence](../verification.md) separates standard-library tests and static checks from pending runtime checks. A vanilla reference makes behavior inspectable without adding a framework, dependencies, or a build pipeline. Reuse the host application's own components when adopting these foundations; a package extraction would add maintenance without demonstrated reuse here.

Official behavior references: [MDN separator role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/separator_role), [native dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog), [forced colors](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors), [WCAG 2.2](https://www.w3.org/TR/WCAG22/), and [Windows contrast themes](https://learn.microsoft.com/en-us/windows/apps/design/accessibility/high-contrast-themes). These guide implementation; runtime and assistive-technology testing remain necessary.

## Revision 3 subtle skeuomorphic contract

Revision 3 used opaque matte structural compartments, fine rim highlights, shallow inset fields, and slight control relief. Its gradient and contrast measurements describe that historical implementation. Keep content tables flat, distinguish enabled and disabled states, and preserve layout when a control is pressed. [Revision 3 verification](../verification.md#revision-3-static-verification) · [Current materials](../materials.md)

## Responsive controls and Settings · revision 4

Measure separation edge to edge between distinct interactive controls in a logical group, including navigation, table actions, settings navigation, and wrapped action rows. Require at least 6 CSS pixels, default to 8px within groups, use 12–16px between related groups, and 24px between sections. Density preserves these gaps and the existing 32/40/48px control targets. Narrow or coarse-pointer contexts raise targets to at least 44px. A checkbox and its text label form one composite control, as do an icon and text inside a button. Their internal spacing is not separation between independently operable controls. Native select options and the native number field's steppers remain parts of their native composite control.

Use source-order Grid auto-fit tracks with a content-safe minimum clamped to the available width and fractional expansion. Start simulation fills its first row. Pause/Resume and Cancel share two equal tracks when space permits and stack otherwise, filling each row with 8px gaps. A half-container minimum caps the grid at two tracks so a third empty cell cannot remain on the final row. Allow labels and rows to grow. Preserve source order, disabled states, and the primary action emphasis. Avoid empty filler actions, dense packing, clipped labels, fixed row heights, and artificial viewport-height stretching. Related compartments stretch within their actual layout row. Independently stacked sections retain their natural content height.

Settings opens in the same window as a modal drawer aligned to the right edge. At 1640 CSS pixels and above, Pin reserves a nonmodal column beside the workspace. At a 16px root font size with default layout metrics, the 360px Settings allocation, 192px navigation, maximum 420px Details, 28px divider, padding, and margins leave at least 576px for primary work at the threshold. Saved pin preference remains intact below that width while the drawer is modal. Settings starts closed on reload and remembers Appearance, Layout, or Shortcuts and pin preference in the existing validated version-1 display record.

Keep one Settings DOM instance. Provide visible Close and Pin/Unpin controls, focus Close on opening, and return focus to the opening trigger on dismissal. Escape closes the topmost dialog, or closes a nonmodal Settings drawer when focus is inside. Native modal behavior contains focus. Relocate the focused control on a breakpoint transition, using Close if the former control becomes disabled. Coordinate Details and reset confirmation so that one modal owns focus at a time. Reset returns focus to its trigger inside Settings.

Appearance applies Theme, Accent color, Density, and Decorative edge immediately. Layout stages the existing Details width from 240 to 420 whole CSS pixels. Editing creates a dirty draft. Apply validates and commits it. Cancel restores the latest committed width. Closing or changing section retains the draft for the visit. Divider gestures and confirmed layout resets update the committed width immediately. A clean draft follows those changes, while a dirty draft remains intact until explicit Apply or Cancel. Drafts are transient and never persisted. Reset continues to affect committed width and collapse only.

For extensive settings, use a same-window full settings view with section navigation, searchable section names where warranted, headings, scoped validation, and an explicit return to work. Keep immediate preferences clearly separate from staged transactional sections. State what Apply commits, validate before committing, and retain or explicitly resolve drafts on close. For multi-field transactions, apply a validated snapshot atomically and report failures without losing the draft. Show shortcuts only for implemented bindings and describe their focus context. The reference lists native keyboard navigation, dialog Escape, and focused divider keys.

Use the [mockup](../../assets/history/vaporgrid-responsive-settings.png) as direction and the [runtime checklist](../verification.md#revision-4-verification) as the verification gate. Geometry, focus, zoom, and assistive technology require actual browser evidence.

## Revision 5 token and keyboard contract

- Define workspace, compartment, and raised surfaces as three OKLCH levels. Keep hue and chroma controlled within the charcoal family. Evaluate relative luminance in the rendered color space. Use borders, shape, or labels where small luminance steps alone cannot communicate meaning. [Materials and state guidance](../materials.md)
- Give the primary action visual priority through placement, weight, and a clear verb. Use a neutral fill by default or deep crimson for one deliberate accent action. Budget below 5% accent coverage as a review goal and record any measured screen with its viewport and state. [Component usage](../components.md)
- Start body typography at 16 CSS px in the reference. Check weight, line length, and contrast on each dark surface. Give each view one dominant judgment or action. Organize its compartments around the information needed to make that judgment. [CSS properties](../../demo/tokens.css) · [JSON tokens](../tokens.json)
- Provide logical Tab order and a visible command trigger. Ctrl/⌘+K opens the palette from the workspace. Let the search field accept ordinary editing keys and expose only implemented commands. Use native dialog containment and Escape. Restore focus to the invoker after dismissal and place focus where the executed action requires it. [W3C modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- Keep user-triggered transitions within 200 ms and respect reduced motion. Give motion a purpose, such as locating the edge of an opened drawer. Keep page load immediate.
- Keep state fills distinguishable. Selected differs from Surface, the neutral primary action differs from Raised, and focus differs from the selection indicator so a focused selected item shows two cues. The token tests enforce the minimums in `tokens.json`. [Measured palette contract](../materials.md#measured-palette-contract)
- Consume tokens from `docs/tokens.json` or its generated exports in `dist/`: W3C DTCG JSON, WinUI 3 and WPF resource dictionaries, Rust, Slint and Godot. Regenerate them with `node tools/build-tokens.mjs`; never edit them by hand.
- Target WCAG 2.2 AA. Check normal text at 4.5:1 and required non-text UI contrast at 3:1. Evaluate focus visibility, focus obscuration, keyboard paths, and target size separately. The project's 44 × 44 CSS px touch goal is distinct from AA's 24 × 24 CSS px criterion and its exceptions. [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) · [Verification record](../verification.md#revision-5-verification)
