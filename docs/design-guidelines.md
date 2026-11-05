# VaporGrid design guidelines

Use these foundations to adapt VaporGrid to your application's tasks. Revision 2 adds a small [interactive reference](../demo/README.md) alongside the historical static concepts. It does not define a packaged toolkit. Use [tokens.json](tokens.json) as descriptive data and [the gallery](../README.md#concept-gallery) as visual direction.

## Foundations

Build with charcoal surfaces, crimson emphasis, and high-contrast text. Keep optional decoration outside content. The reference uses only a static edge accent, off by default; do not place grids or glow behind text. Avoid effects that obscure text, boundaries, or selection.

The direction starts with Windows workflows. Preserve task clarity when adapting it to another platform, rather than copying desktop density into every form factor. Follow the target platform's interaction conventions.

## Layout

Map navigation, primary work, contextual detail, and status to explicit regions. Align compartment edges, balance visual weight, without forcing symmetry between regions with different jobs. Keep narrow gutters consistent; introduce more space where users must distinguish actions or groups.

Start with the spacing values in the token file, then test real content, localization, and text scaling. Keep primary work usable at the smallest supported window size. Move secondary detail into a drawer or stacked view when columns no longer fit.

## Compartments

Give each compartment a clear heading and purpose. Define minimum sizes, resize limits, collapse behavior, and how users restore hidden regions. Keep critical status and recovery actions reachable when a compartment collapses.

In an implementation, make resize and collapse controls keyboard operable, label them for assistive technology, expose expanded state, and preserve a sensible focus destination. If you persist layout preferences, document their scope and provide a reset action. Do not start background work just because a view opens or a reusable module loads.

## Typography

Use a Segoe UI-like sans-serif hierarchy on Windows with native system fallbacks elsewhere. Reserve a monospace face for code, timecodes, and aligned technical values. The descriptive type sizes use CSS-pixel-equivalent values; map them to the native toolkit's units and scaling behavior.

Keep labels readable at the user's text size. Allow wrapping or provide a way to inspect truncated values. Use weight, placement, and labels to establish hierarchy before adding color or glow.

## Color and contrast

The following ratios use the standard sRGB relative-luminance calculation for opaque, solid colors. Ratios round to two decimals; evaluate thresholds using unrounded values. They measure specified color pairs, not pixels sampled from generated images.

| Text or indicator | Background | Contrast ratio |
| --- | --- | --- |
| Foreground `#F1F1F3` | Background `#171719` | 15.87:1 |
| Foreground `#F1F1F3` | Surface `#202023` | 14.41:1 |
| Foreground `#F1F1F3` | Raised `#29292D` | 12.84:1 |
| Muted `#B7B7C1` | Background `#171719` | 9.00:1 |
| Muted `#B7B7C1` | Surface `#202023` | 8.17:1 |
| Muted `#B7B7C1` | Raised `#29292D` | 7.28:1 |
| Foreground `#F1F1F3` | Accent `#D61F45` | 4.50:1 (rounded; below 4.5 unrounded) |
| Accent `#D61F45` | Surface `#202023` | 3.20:1 |
| Focus `#FF4D73` | Surface `#202023` | 5.08:1 |

Use foreground and muted text on the measured charcoal surfaces. Foreground on accent falls just below 4.5:1 before rounding, so do not use this pairing for normal-size text that requires 4.5:1. Place the label on a charcoal surface or adjust the colors and measure again. Accent on surface also falls below the normal-text target.

For implementation, target at least 4.5:1 for normal text, 3:1 for qualifying large text, and 3:1 for required non-text indicators against adjacent colors. Recheck borders, opacity, overlays, hover states, and actual neighboring colors. A measured focus color alone does not prove that the focus treatment is visible or accessible.

## Interaction and feedback

Provide a visible focus indicator, a logical keyboard order, and discoverable shortcuts that respect platform conventions. Pair selected, warning, and error colors with text, icons, or another perceptible cue. Keep hover, focus, selection, and disabled states distinguishable.

Explain loading with the current operation, meaningful units or percentage when known, and available pause or cancel actions. Use an indeterminate state when progress cannot be measured. Report completion and failure explicitly, including a recovery action where possible; do not fabricate progress.

Use restrained transitions. Honor reduced-motion preferences by removing decorative motion and replacing animated progress with stable status updates. Preserve status information when animation stops.

## Adaptation and validation

On desktop, test window resizing, keyboard-only operation, text scaling, long labels, and restored layouts. On mobile, stack compartments around the primary task, provide comfortable touch spacing, and test target sizes on actual devices. Keep consequential actions separate from navigation.

Treat accessibility requirements as implementation targets. Static images cannot establish keyboard behavior, screen-reader output, focus visibility during interaction, touch usability, or reduced-motion support. Test these in the target application and record the platform, settings, and results before claiming support.

Keep reusable visual foundations separate from application-specific navigation, persistence, and platform adapters when that boundary improves reuse. Choose the host framework that fits the existing application; VaporGrid does not require a framework or a broad rewrite.

## Next-release mockup-first policy

For the maintainer's projects, schedule adoption for the next planned release. First map the project's real tasks and constraints, then create project-specific photo or image mockups and show them for review before implementation. Use that review to refine layout and scope, then implement and verify the chosen changes in the target application.

This is the maintainer's rollout policy, not an additional CC BY 4.0 condition on reusers. It does not authorize immediate changes to existing projects or promise changes across all applications.

## Revision 2 interaction contract

Revision 2 replaces uniform density and decorative emphasis with purposeful information density. Keep the primary task dominant, balance visual weight, and avoid equal-width compartments when their content differs. The six older concepts remain historical explorations rather than normative specifications.

### Density and scaling

| Mode | Use | Panel padding | Minimum control height |
| --- | --- | --- | --- |
| Compact | Repeated expert keyboard/mouse work | 12 CSS px equivalent | 32 CSS px equivalent |
| Comfortable (default) | Mixed reading and manipulation | 16 | 40 |
| Touch | Direct touch or greater motor spacing | 20 | 48 |

Density changes spacing rather than shrinking typography. The demo uses a 16px root with relative text sizes, wraps labels, and raises narrow-window controls to at least 44px. Recheck 320, 768, 1024, and 1440 CSS pixels, 200% text/zoom, localization, and physical-device targets. Retain horizontal scrolling only for genuinely two-dimensional content when needed; do not hide essential controls.

### Brand and semantic feedback

Success and danger have independent theme tokens, separate from brand and focus. Success styles valid-name/recovery feedback and Completed; danger styles the invalid boundary, inline explanation, and labeled error recovery. Offline uses warning, empty recovery stays neutral, and Cancelled stays neutral. Explicit text remains present in every state. The focus outline continues to use the focus token.

Brand crimson marks selected regions and primary action emphasis. It never means error by itself. Pair status with explicit words and functional shape: In review, Needs check, Ready, Running, Paused, Completed, Cancelled. Add icons where useful without making dots or color the only signal. The reference's original icons use a clear silhouette first; see [iconography](iconography.md).

Filled actions use `#B8183A` with `#F1F1F3`; hover uses the darker `#A21533` with the same foreground. These pairings exceed the 5:1 design target before rounding. Light mode retains these action pairings while changing content surfaces and semantic foregrounds independently. Additional computed pairings:

| Foreground / indicator | Background | Contrast |
| --- | --- | --- |
| `#F1F1F3` | `#B8183A` | 5.7639:1 |
| `#F1F1F3` | `#A21533` | 6.9172:1 |
| `#202023` | `#FFFFFF` | 16.2502:1 |
| `#50505B` | `#FFFFFF` | 7.9557:1 |
| `#50505B` | `#E4E4E9` | 6.2785:1 |
| `#9E1534` | `#FFFFFF` | 8.0439:1 |
| `#174E85` | `#FFFFFF` | 8.5197:1 |
| `#735100` | `#FFFFFF` | 7.2266:1 |
| `#9FC9FF` | `#202023` | 9.4970:1 |
| `#F2CD82` | `#202023` | 10.7022:1 |
| `#777780` | `#202023` | 3.6639:1 |
| `#75757E` | `#FFFFFF` | 4.5631:1 |

Semantic pairings below retain the unrounded calculation output. Feedback, job status, and recovery headings/edges sit on Surface; the invalid field boundary touches Surface both inside the input and outside it in the containing panel. Each listed pairing exceeds 4.5:1 for text and 3:1 for boundaries.

| Semantic foreground / boundary | Actual adjacent color | Contrast |
| --- | --- | --- |
| Dark success `#8FD4AD` | Surface `#202023` | 9.43189928683773:1 |
| Dark danger `#FFB1A8` | Surface `#202023` | 9.368089693764144:1 |
| Light success `#236340` | Surface `#FFFFFF` | 7.166662802733971:1 |
| Light danger `#9D2B1F` | Surface `#FFFFFF` | 7.502796738092947:1 |

Ratios are calculated from sRGB relative luminance without rounding before comparison. These are token pairings, not whole-page certification. Check focus against each adjacent surface, control boundaries, hover/selected states, overlays, disabled recognizability, and browser-generated appearances independently.

### Theme and component states

Keep the dark signature, but offer System, Light, and Dark. System tracks OS preference changes. Forced colors must retain outlines, native controls, selected-row boundaries, and currentColor icons using system colors; do not force the brand palette through contrast themes. Preserve all meaning under reduced motion. No animation is required to understand progress.

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

[Verification evidence](verification.md) separates standard-library tests and static checks from pending runtime checks. A vanilla reference makes behavior inspectable without adding a framework, dependencies, or a build pipeline. Reuse the host application's own components when adopting these foundations; a package extraction would add maintenance without demonstrated reuse here.

Official behavior references: [MDN separator role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/separator_role), [native dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog), [forced colors](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors), [WCAG 2.2](https://www.w3.org/TR/WCAG22/), and [Windows contrast themes](https://learn.microsoft.com/en-us/windows/apps/design/accessibility/high-contrast-themes). These guide implementation; runtime and assistive-technology testing remain necessary.

## Revision 3 subtle skeuomorphic contract

The current [material contract](materials.md) extends the revision 2 rules above with opaque matte structural compartments, fine rim highlights, shallow inset fields, and slight control relief. It does not change compartment geometry or interactions. Keep the main content table flat, use explicit enabled/disabled state styling, and remove pressed translation. Text contrast must exceed 4.5:1 across actual fills; primary labels must exceed 5:1 at both gradient endpoints and hover/pressed. See [descriptive material tokens](tokens.json) and [revision 3 verification](verification.md#revision-3-static-verification). Earlier contrast and interaction requirements remain applicable.

## Responsive controls and Settings · revision 4

Measure separation edge to edge between distinct interactive controls in a logical group, including navigation, table actions, settings navigation, and wrapped action rows. Require at least 6 CSS pixels, default to 8px within groups, use 12–16px between related groups, and 24px between sections. Density preserves these gaps and the existing 32/40/48px control targets. Narrow or coarse-pointer contexts raise targets to at least 44px. A checkbox and its text label form one composite control, as do an icon and text inside a button. Their internal spacing is not separation between independently operable controls. Native select options and the native number field's steppers remain parts of their native composite control.

Use source-order Grid auto-fit tracks with a content-safe minimum clamped to the available width and fractional expansion. Start simulation fills its first row. Pause/Resume and Cancel share two equal tracks when space permits and stack otherwise, filling each row with 8px gaps. A half-container minimum caps the grid at two tracks so a third empty cell cannot remain on the final row. Allow labels and rows to grow. Preserve source order, disabled states, and the primary action emphasis. Avoid empty filler actions, dense packing, clipped labels, fixed row heights, and artificial viewport-height stretching. Related compartments stretch within their actual layout row. Independently stacked sections retain their natural content height.

Settings opens in the same window as a modal drawer aligned to the right edge. At 1640 CSS pixels and above, Pin reserves a nonmodal column beside the workspace. At a 16px root font size with default layout metrics, the 360px Settings allocation, 192px navigation, maximum 420px Details, 28px divider, padding, and margins leave at least 576px for primary work at the threshold. Saved pin preference remains intact below that width while the drawer is modal. Settings starts closed on reload and remembers Appearance, Layout, or Shortcuts and pin preference in the existing validated version-1 display record.

Keep one Settings DOM instance. Provide visible Close and Pin/Unpin controls, focus Close on opening, and return focus to the opening trigger on dismissal. Escape closes the topmost dialog, or closes a nonmodal Settings drawer when focus is inside. Native modal behavior contains focus. Relocate the focused control on a breakpoint transition, using Close if the former control becomes disabled. Coordinate Details and reset confirmation so that one modal owns focus at a time. Reset returns focus to its trigger inside Settings.

Appearance applies Theme, Density, and Decorative edge immediately. Layout stages the existing Details width from 240 to 420 whole CSS pixels. Editing creates a dirty draft. Apply validates and commits it. Cancel restores the latest committed width. Closing or changing section retains the draft for the visit. Divider gestures and confirmed layout resets update the committed width immediately. A clean draft follows those changes, while a dirty draft remains intact until explicit Apply or Cancel. Drafts are transient and never persisted. Reset continues to affect committed width and collapse only.

For extensive settings, use a same-window full settings view with section navigation, searchable section names where warranted, headings, scoped validation, and an explicit return to work. Keep immediate preferences clearly separate from staged transactional sections. State what Apply commits, validate before committing, and retain or explicitly resolve drafts on close. For multi-field transactions, apply a validated snapshot atomically and report failures without losing the draft. Show shortcuts only for implemented bindings and describe their focus context. The reference lists native keyboard navigation, dialog Escape, and focused divider keys.

Use the [mockup](../assets/vaporgrid-responsive-settings.png) as direction and the [runtime checklist](verification.md#revision-4-verification) as the verification gate. Geometry, focus, zoom, and assistive technology require actual browser evidence.
