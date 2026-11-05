# Workspace interaction reference

A small fictional task workspace demonstrates VaporGrid revision 3 with native HTML, CSS, JavaScript modules, and original local SVG icons. It has no framework, package installation, build step, external service, analytics, or file processing. The educational source uses the same [CC BY 4.0](../LICENSE) terms as the documentation and images.

## Run locally

From the repository root, using the installed Python interpreter:

```powershell
python -m http.server 8000 --bind 127.0.0.1 --directory .
```

Open `http://127.0.0.1:8000/demo/`. Stop the server with Ctrl+C. This binds to loopback and serves files without writing project files. Python's simple server is for local inspection; it is not a deployment service. Opening index.html through `file:` may block JavaScript modules.

## Controls

- Theme: System, Light, Dark. System follows OS color preference through CSS.
- Density: Compact, Comfortable, Touch. Narrow windows keep controls at least 44 CSS pixels high.
- Decorative edge: optional static accent; off by default. No effects appear behind text.
- Details: restore the desktop inspector or open the narrow modal drawer. Select a task to update details; on narrow screens selection opens the drawer.
- Desktop divider: drag with pointer capture; Left expands the right inspector, Right shrinks it, Home sets 240 pixels, End sets 420. Steps are 10 pixels. Collapse and restore are always reachable.
- Reset layout: a native confirmation dialog restores 300-pixel width and expanded state. Keep layout and Escape preserve everything. Theme, density, and effects survive reset.
- Start simulation: begins at zero. Pause freezes progress; Resume continues. Cancel and completion stop the timer. A new start clears old progress. Only this explicit action starts a job.
- Feedback & recovery: select validation, empty, offline, or error examples. Retry is a local demonstration; it never contacts a service. Names validate locally and are not saved.

## Persistence and boundaries

The `vaporgrid.display.v1` localStorage entry contains versioned theme, density, effects, inspector width, collapse preference, settings section, and pin preference. Input is bounded to 2 KiB, checked against allowlists and width limits, and unrelated fields are discarded. Older version-1 records retain their choices and gain Appearance and unpinned defaults. Malformed, denied, or unavailable storage falls back to defaults. No task content is persisted. Delete this one key in browser developer tools to clear all display choices. Reset layout only resets geometry.

The same inspector DOM moves into a native modal dialog below 901 CSS pixels. Native modal behavior provides focus containment and Escape; the script restores focus to the opening control. No service worker, PWA registration, automatic synchronization, or startup job exists.

## Verify

```powershell
node --test demo/state.test.mjs
node --check demo/app.js
```

Node's standard test runner covers hostile preference data and lifecycle invariants. These tests do not establish browser layout, pointer capture, focus containment, assistive technology, or performance. Follow [the runtime checklist](../docs/verification.md) before claiming those behaviors are verified. This is an educational interaction reference, not a certified accessible component library.

## Revision 3 materials

Opaque matte compartments use fine rim highlights; fields are shallowly inset, and buttons have slight default relief, solid hover, and inset pressed states without movement. Disabled buttons are flat with dashed boundaries. The task table and its selection controls stay flat. Light and System-light define their own material values. The Decorative edge checkbox still controls only the masthead accent. See [materials](../docs/materials.md) and [verification](../docs/verification.md); styling is not accessibility certification.

## Revision 4 Settings and action layout

Open Settings from navigation. The right-edge drawer contains focus while it is modal. At 1640 CSS pixels and above, Pin reserves a nonmodal column and Unpin returns to the modal drawer. A saved pin preference resumes when enough space returns. Close and Escape retain the selected section and width draft. Opening focuses Close. Dismissal returns focus to Settings. Breakpoint relocation preserves focus, with Close as fallback for a newly disabled Pin control.

Appearance changes immediately. In Layout, edit Details width and choose Apply to commit or Cancel changes to restore the current workspace width. The draft survives section changes and closing for this visit. Reload discards it. Clean drafts track divider changes and confirmed resets. Dirty drafts survive both, and the status identifies the current committed width. Reset confirms width/collapse restoration and returns focus to its Settings control. Only one modal is active at a time. Shortcuts lists the actual native controls and focused divider bindings.

Start simulation, Pause/Resume, and Cancel use an auto-fit Grid, stretching to fill every occupied row in source order. No filler actions are added. Distinct grouped controls retain 8px spacing with a 6px minimum. Related groups use 16px and sections use 24px. Checkbox labels and button icons are parts of composite controls. Target heights remain 32/40/48px, with at least 44px on narrow or coarse-pointer layouts. The [revision 4 rules](../docs/design-guidelines.md#responsive-controls-and-settings--revision-4) explain the same-window extensive-settings pattern and staged transactions.

Preference migration and new field validation have standard-library unit tests. Browser geometry, modal transitions, draft interactions, storage denial, and focus behavior await the coordinator's runtime pass. See [revision 4 verification](../docs/verification.md#revision-4-verification).
