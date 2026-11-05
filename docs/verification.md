# Verification record · revision 2

## Implementer evidence

The repository has no build pipeline or dependency installation. Node v26.13.0 and Python 3.15.2 were queried successfully. The coordinator's bounded read-only project inspection exited 0. XERJ indexing was attempted by the coordinator but stopped at its resource guard (exit 1, 95% usage at a 95% threshold); no project content was indexed. Targeted source reads were used instead, without overriding or retrying the guard.

| Check | Actual result |
| --- | --- |
| Test-first run before state module existed | `node --test demo/state.test.mjs` exited 1 with ERR_MODULE_NOT_FOUND, expected red stage |
| Preference and lifecycle tests | `node --test demo/state.test.mjs` exited 0; 2 tests passed |
| JavaScript parse | `node --check demo/app.js` exited 0 |
| Whitespace check | `git diff --check` exited 0 |
| Static integrity | Python inline checker exited 0: README exclusion, JSON parsing, SVG XML, 11 matching canonical/exported symbols, unique HTML IDs, local HTML/Markdown file references, PNG signatures, and no remote request sources |
| Contrast calculations | Python sRGB calculation exited 0; action label 5.763938013391299:1; hover 6.917166011852179:1, both exceed 5:1 unrounded |
| Source review | No remote script, stylesheet, font, request API, telemetry, registration, package dependency, or automatic job startup in demo source |
| Raster mockups | Coordinator generated and visually inspected all three sheets before implementation; illustrative direction, not runtime evidence |

The standard-library tests exercise malformed/oversized preferences, version and allowlist validation, unknown field removal, width bounds, paused progress stability, cancellation, terminal stability, bounded completion, and restart from zero. DOM wiring, timer ownership, native controls, and focus behavior require browser verification in addition to those pure tests.

## Coordinator browser observations · supplied evidence

Source: coordinator's in-app Chromium browser at `http://localhost:18773/demo/`, fresh after the selector fix; browser version not supplied. These observations precede the reviewer corrections and were not executed by this implementer.

- No exceptions. Dark/Light and Compact/Comfortable selection worked; reload retained Light, Compact, and inspector 420px.
- Initial Ready at 0 required explicit Start. Pause at 0 stayed at 0 beyond two ticks; Resume then Cancel showed Cancelled / No work running with Start focused. Prior Pause at 40 and completion at 100 were observed. Automatic-completion focus recovery was under check; focused Cancel completion remains unverified.
- Divider Home/End and pointer drag reached 240/420; collapse/restore worked. Reset initially focused Keep layout. Escape returned to Reset trigger, preserving 420; confirm restored 300 while preserving theme/density.
- Viewports 320/768/1440 had document widths 305/753/1425 without overflow. Narrow Details initially focused Close details; Escape returned to Details. Task-selection drawer focus remained pending.
- Error/offline Retry returned to validation; short input focused the invalid field with inline error; valid input showed local feedback. Original SVG icon board visually inspected.

## Reviewer corrections · local evidence and pending rerun

Task selection now uses the density minimum and the greater of density/44px at narrow widths. Touch specifies 48px at a 16px root; computed height requires coordinator rerun. Independent success/danger colors apply to existing labeled success, invalid, error recovery, and completed states. Offline uses warning; cancellation stays neutral. Focus keeps its separate outline token. Unrounded contrast ratios against actual Surface adjacencies are in the design guidelines; invalid input touches Surface inside and in the containing panel.

Rendering captures focus on either Pause or Cancel before disabling operation controls and returns focus to Start only when that captured control becomes disabled. Focus elsewhere is preserved. The existing zero-dependency harness covers pure state only; no DOM harness or dependencies were added. Coordinator will rerun Touch computed heights, both themes' semantic feedback, and automatic completion with Pause focused, Cancel focused, and focus elsewhere.

## Coordinator post-correction browser verification

The coordinator reran the affected behavior in the in-app browser after the corrections. Browser observations provide no shell exit code.

- Touch task buttons measured **48 CSS pixels high** at both 1440px and 320px viewports. The 320px document width was 305px, without document overflow.
- Completion at 100% returned focus from Cancel to Start. Completion with focus on Theme preserved that focus. The earlier Pause-focused completion also returned focus to Start; the correction extends that same recovery to Cancel.
- The fresh-page console contained no errors through progress, settings, selection, validation, and recovery checks. Ready/0% remained the initial state; Start/Pause/Resume/Cancel and bounded completion were exercised. Paused progress remained unchanged beyond two update intervals.
- Light validation showed a separate danger boundary and inline explanation. Dark error recovery showed its danger heading/boundary; Completed and valid-name feedback used success treatment. Labels remained present.
- Selecting Validate assets at 320px opened the modal with the selected task and initial focus on Close details. Escape returned focus to Validate assets. Switching from an open narrow drawer to 1440px restored the desktop inspector and a reachable Details trigger without an exception.
- Keyboard Home/End and pointer dragging reached both 240px and 420px bounds. Collapse/restore, reset confirmation/cancellation, and reload-visible preferences were exercised. At 768px and 1440px, document widths were 753px and 1425px respectively.

These are bounded checks in one browser, not certification. No OS preference changes, forced-colors or reduced-motion emulation, 200% zoom, in-browser denied-storage injection, screen-reader session, or physical-device check was performed. Storage rejection is covered by the unit tests and source review rather than browser injection. The reference makes no external request calls; source/static-asset inspection establishes that boundary, not a full browser network trace.

## Extended regression checklist

The checklist below retains required coverage; observations above establish only the explicitly reported portions. Changed behavior requires fresh execution.

These are a checklist, not claims that checks passed. Record browser/version, viewport, settings, and observations when executed.

- At 320, 768, 1024, and 1440 CSS pixels: readable text, reachable controls, no document overflow, unclipped statuses. Test all densities, long input, and 200% zoom/text.
- Keyboard: skip link, navigation, selection buttons, fields, settings, visible focus; divider Left/Right/Home/End (240–420). Collapse leaves Details reachable. Reset layout cancel and Escape preserve width/collapse; confirm restores 300px/expanded, preserving display settings.
- Pointer: divider uses capture and clamps width; pointer release/cancel ends persistence gesture. Drag past both limits and release outside the divider.
- At narrow widths: `#show-details` and task selection open `#details-dialog`; initial focus on Close details, Tab stays inside, Escape closes, focus returns to the opening control. Resize across 900px while open and recheck focus and unique IDs.
- Native `#reset-dialog`: initial focus on Keep layout, modal containment, Escape and cancellation, return focus to `#reset-layout`.
- Lifecycle: `#start`, `#pause`, `#cancel`, `#job-progress`, `#job-status`. Pause freezes progress for at least two tick intervals; Resume continues; cancel and completion stop updates; Start again begins at zero. Wait for completion while Pause owns focus. No operation starts on page load.
- Storage: reload valid preferences; inject malformed JSON, an oversized string, unknown version, invalid enums/types, widths outside 240–420 into `vaporgrid.display.v1`; deny storage and check usable startup. Only display preferences are persisted.
- Recovery: `#example` selects local empty/offline/error examples; `#retry` returns to validation without network. Submit blank/short `#workspace-name`: focused invalid input with associated explanation; valid input reports local success.
- Theme: test Light/Dark/System, live OS preference changes, forced colors/Windows contrast themes, reduced motion, focus and selected boundaries. Inspect original icons at 16/20/24px in each relevant mode.
- Browser console: no exceptions. Network: only same-origin static assets, no external requests. Capture screenshots of wide and narrow states and compare them with the design direction.

## Limits

No browser runtime tool was available to the implementer. Supplied coordinator observations are separate evidence; changed features await coordinator rerun. Node preference tests cover malformed/version/out-of-range negative cases, not actual in-browser storage denial. Live System theme, forced colors, reduced motion, 200% zoom, screen readers, and physical devices remain unperformed because CUA media emulation was unavailable and global Windows settings were not changed. CSS static review does not certify runtime behavior. No screen-reader session, physical touch-device check, cross-browser certification, Lighthouse/Core Web Vitals measurement, or deployment was performed by the implementer. Static contrast calculations and semantic markup do not certify WCAG compliance. The demo neither measures real work nor represents real network availability. See [local serving instructions](../demo/README.md).
