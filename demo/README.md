# Workspace interaction reference

A small fictional task workspace demonstrates VaporGrid revision 6 with native HTML, CSS, JavaScript modules, and original local SVG icons. It runs from static files under the MIT license (documentation and images are CC BY 4.0). [Live demo](https://seanshaffer88.github.io/VaporGrid/demo/) · [Licenses](../ATTRIBUTION.md)

## Run locally

From the repository root, using the installed Python interpreter:

```powershell
python -m http.server 8000 --bind 127.0.0.1 --directory .
```

Open `http://127.0.0.1:8000/demo/`. Stop the server with Ctrl+C. This binds to loopback and serves files without writing project files. Python's simple server is for local inspection; it is not a deployment service. Opening index.html through `file:` may block JavaScript modules.

## Controls

- Theme: System, Light, Dark. System follows OS color preference through CSS.
- Accent color: Crimson, Blue, or Teal for selection markers and focus. Changes apply immediately. The preset follows the effective theme and system highlights take precedence in forced colors.
- Decorative edge: optional neutral masthead edge, off by default.
- Density: Per component (default), Compact, Comfortable or Touch. Data rows default to Compact.
- Grid signature: empty-state grid, ten-segment progress and the active-region rule. The [category layouts](categories/index.html) show eight product types.
- Commands: open with the visible button or Ctrl/⌘+K from the workspace. Filter implemented actions in Search commands. Use the palette's keyboard hints, Tab, or click to select an available action. Escape closes the dialog and returns focus to the invoker.
- Details: restore the desktop inspector or open the narrow modal drawer. Select a task to update details; on narrow screens selection opens the drawer.
- Desktop divider: drag with pointer capture; Left expands the right inspector, Right shrinks it, Home sets 240 pixels, End sets 420. Steps are 10 pixels. Collapse and restore are always reachable.
- Reset layout: a native confirmation dialog restores 300-pixel width and expanded state. Keep layout and Escape preserve everything. Theme, accent color, density, and effects survive reset.
- Start simulation: begins at zero. Pause freezes progress; Resume continues. Cancel and completion stop the timer. A new start clears old progress. Only this explicit action starts a job.
- Feedback & recovery: select validation, empty, offline, or error examples. Retry is a local demonstration; it never contacts a service. Names validate locally and are not saved.

## Persistence and boundaries

The `vaporgrid.display.v1` localStorage entry contains versioned theme, accent ID, density, effects, inspector width, collapse preference, settings section, and pin preference. Input is bounded to 2 KiB, checked against allowlists and width limits, and unrelated fields are discarded. Older version-1 records retain their choices and gain Crimson, Appearance, and unpinned defaults. Malformed, denied, or unavailable storage falls back to defaults. No task content is persisted. Delete this one key in browser developer tools to clear all display choices. Reset layout only resets geometry.

The same inspector DOM moves into a native modal dialog below 901 CSS pixels. Native modal behavior provides focus containment and Escape; the script restores focus to the opening control. No service worker, PWA registration, automatic synchronization, or startup job exists.

## Verify

```powershell
node --test
node --check demo/app.js
node --check demo/palette.mjs
```

Node's standard test runner covers hostile preference data and lifecycle invariants. These tests do not establish browser layout, pointer capture, focus containment, assistive technology, or performance. Follow [the runtime checklist](../docs/verification.md) before claiming those behaviors are verified. This is an educational interaction reference, not a certified accessible component library.

## Revision 3 materials

Revision 3 explored opaque matte compartments, tactile rims, and inset fields. Revision 5 refines those ideas with three OKLCH elevation levels a crimson primary action, and 1px structural edges. The task table stays flat, and crimson marks focus, selection, or a labeled destructive cue. [Current materials](../docs/materials.md) · [CSS tokens](tokens.css) · [JSON tokens](../docs/tokens.json)

## Revision 4 Settings and action layout

Open Settings from navigation. The right-edge drawer contains focus while it is modal. At 1640 CSS pixels and above, Pin reserves a nonmodal column and Unpin returns to the modal drawer. A saved pin preference resumes when enough space returns. Close and Escape retain the selected section and width draft. Opening focuses Close. Dismissal returns focus to Settings. Breakpoint relocation preserves focus, with Close as fallback for a newly disabled Pin control.

Appearance changes immediately. In Layout, edit Details width and choose Apply to commit or Cancel changes to restore the current workspace width. The draft survives section changes and closing for this visit. Reload discards it. Clean drafts track divider changes and confirmed resets. Dirty drafts survive both, and the status identifies the current committed width. Reset confirms width/collapse restoration and returns focus to its Settings control. Only one modal is active at a time. Shortcuts lists the actual native controls and focused divider bindings.

Start simulation, Pause/Resume, and Cancel use an auto-fit Grid, stretching to fill every occupied row in source order. No filler actions are added. Distinct grouped controls retain 8px spacing with a 6px minimum. Related groups use 16px and sections use 24px. Checkbox labels and button icons are parts of composite controls. Target heights remain 32/40/48px, with at least 44px on narrow or coarse-pointer layouts. The [revision 4 rules](../docs/design-guidelines.md#responsive-controls-and-settings--revision-4) explain the same-window extensive-settings pattern and staged transactions.

Preference migration and field validation have standard-library unit tests. Refer to the verification record for actual runtime coverage and outstanding checks. [Revision 4 verification](../docs/verification.md#revision-4-verification) · [Revision 5 verification](../docs/verification.md#revision-5-verification)
