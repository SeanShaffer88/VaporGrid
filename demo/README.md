# Workspace interaction reference

A small fictional task workspace demonstrates VaporGrid revision 2 with native HTML, CSS, JavaScript modules, and original local SVG icons. It has no framework, package installation, build step, external service, analytics, or file processing. The educational source uses the same [CC BY 4.0](../LICENSE) terms as the documentation and images.

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

The `vaporgrid.display.v1` localStorage entry contains only versioned theme, density, effects, inspector width, and collapse preference. Input is bounded to 2 KiB, checked against allowlists and width limits, and unrelated fields are discarded. Malformed, denied, or unavailable storage falls back to defaults: System, Comfortable, effects off, 300 pixels, expanded. No task content is persisted. Delete this one key in browser developer tools to clear all display choices. Reset layout only resets geometry.

The same inspector DOM moves into a native modal dialog below 901 CSS pixels. Native modal behavior provides focus containment and Escape; the script restores focus to the opening control. No service worker, PWA registration, automatic synchronization, or startup job exists.

## Verify

```powershell
node --test demo/state.test.mjs
node --check demo/app.js
```

Node's standard test runner covers hostile preference data and lifecycle invariants. These tests do not establish browser layout, pointer capture, focus containment, assistive technology, or performance. Follow [the runtime checklist](../docs/verification.md) before claiming those behaviors are verified. This is an educational interaction reference, not a certified accessible component library.
