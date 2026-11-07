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

## Revision 3 static verification

The coordinator supplied the pre-code ImageGen review/display gate. Implementer used Node v26.13.0. No dependency, build configuration, JavaScript, HTML, canonical SVG, or license changes were made.

| Command/check | Actual result |
| --- | --- |
| `node --test demo/state.test.mjs` | Exit 0; both existing tests passed |
| `node --check demo/app.js` | Exit 0 |
| `git diff --check` | Exit 0 |
| Inline Python static checker | Exit 0: tokens JSON, local Markdown file links, SVG XML, 11 canonical symbols, unchanged SVG/JS/HTML/LICENSE source, README reference exclusion |
| Inline Python sRGB calculation | Exit 0: all following unrounded minima meet their targets |

The first static checker exited 1 because it compared Git LF bytes with working-tree CRLF bytes. Rerun normalized line endings and passed; protected source content was unchanged. Gradients interpolate between conservative channel-monotonic endpoints, so text contrast is bounded by these endpoints. Hover and pressed use endpoint fills. Disabled text uses the measured Muted/Surface pair without opacity fading. Panel text remains on opaque Surface. Focus has a 3px offset, so its adjacent colors are the surrounding content surfaces rather than the primary button fill. Decorative rims and shadows do not carry required boundaries.

| Pair/group | Tested backgrounds/endpoints | Minimum unrounded ratio |
| --- | --- | --- |
| Dark text `#f1f1f3` | `#171719`, `#202023`, `#29292d` | 12.844705688134075:1 |
| Dark muted `#b7b7c1` | `#171719`, `#202023`, `#29292d` | 7.283882286007498:1 |
| Light text `#202023` | `#ededf0`, `#ffffff`, `#e4e4e9` | 12.824364453636441:1 |
| Light muted `#50505b` | `#ededf0`, `#ffffff`, `#e4e4e9` | 6.278465444186843:1 |
| Primary `#f1f1f3` | `#b8183a`, `#a21533` | 5.763938013391299:1 |
| Dark focus `#ff4d73` | `#171719`, `#202023`, `#29292d` | 4.526931119891296:1 |
| Light focus `#9e1534` | `#ededf0`, `#ffffff`, `#e4e4e9` | 6.348093278343064:1 |
| Dark border `#777780` | `#171719`, `#202023`, `#29292d` | 3.2668558456139287:1 |
| Light border `#75757e` | `#ededf0`, `#ffffff`, `#e4e4e9` | 3.601083580013744:1 |
| Dark semantic (info, warning, success, danger) | Surface and Raised | 8.35290240378593:1 |
| Light semantic (info, warning, success, danger) | Surface and Raised | 5.655792251732237:1 |

### Revision 3 coordinator browser observations

The in-app browser (engine version not exposed) rendered the local reference in Light and Dark. These browser observations supply no shell exit code.

- At 320/768/1440px in both themes, document widths were 305/753/1425px respectively, with no document overflow. Light-mode task buttons measured 32/40/48px for Compact at 1440px, Comfortable at 768px, and Touch at 320px.
- Dark default controls computed a `#29292D` to `#202023` gradient with a fine inset rim and shallow shadow. Pointer hover computed a solid `#29292D` fill. The sampled control retained its 40px height, approximately 101.69px width, and `transform: none`.
- Keyboard focus remained a distinct outline. Disabled Pause computed no gradient and no shadow; Tab from Start skipped disabled operation controls to Example state. Task selection controls computed transparent backgrounds, no gradient, and no shadow.
- The name field computed an opaque `#202023` fill and shallow inset shadow. Light and Dark visual inspection retained readable flat table content. The 320px Light details modal opened with Close details focused; Escape returned to its trigger. Start/Cancel ended at Cancelled with Start focused, with no console errors.
- A duration-based pointer click was exercised, but observation occurred after release (`:active` was false); this is not evidence of a captured held-pressed state. Pressed styling was reviewed in source, not visually certified while held.

Static CSS review confirms explicit System-light values, independent edge preference, forced-colors flattening/system colors, and retained reduced-motion suppression; this does not establish their runtime behavior. Full geometry checks across every control/state and repeated pointer/keyboard divider testing remain extended regression work; divider logic and dimensions were unchanged.

No forced-colors OS/emulation, live System preference change, reduced-motion emulation, 200% zoom, assistive-technology session, physical device, cross-browser, or performance measurement was performed by this implementer. Earlier revision-2 browser observations above remain historical evidence, not revision-3 certification. Parent runtime evidence and independent audit must complete before the change is reported as fully verified.

## Revision 4 verification

The coordinator supplied the pre-code Settings mockup as already shown. Implementation uses native HTML/CSS/JavaScript and Node v26.13.0, with no added dependencies. XERJ indexing was reported by the coordinator as blocked at its 95% disk guard with exit 1. Scoped source reads provided the fallback. Earlier runtime observations above remain historical.

| Implementer command | Actual result |
| --- | --- |
| `node --test demo/state.test.mjs` before preference implementation | Exit 1. Existing two tests passed, both new migration/field tests failed as expected. |
| `node --test demo/state.test.mjs` after implementation | Exit 0. All four tests passed. |
| `node --check demo/app.js` | Exit 0. |
| `git diff --check` | Exit 0. |
| Inline Python static checker | Exit 0. Unique HTML IDs, valid ID references, HTML asset paths, local Markdown file links, and revision-4 tokens JSON. |

The unit tests cover version-1 preference migration, section and pin validation, hostile input handling, and simulation transitions. Independent review passed the four Node tests, JavaScript syntax, diff whitespace, and static checks of HTML references, links, tokens, and PNG structure. These commands exited 0.

### Coordinator browser observations

- The simulation actions filled every occupied row with 8px gaps and the document fit at 320, 400, 768, 900, 901, 1024, 1440, 1639, 1640, and 1920 CSS pixels. The Settings section buttons filled both rows at 320px, including the row with a single button. In all three densities, the sampled action and section gaps were 8px and field groups were 16px apart.
- At 1640px, pinning left 577px of primary workspace with Details at 420px. Unpinning opened a right-edge native modal. At 320px the drawer met the available right edge and suspended pinning. Widening restored the pinned column. Reload kept the last section and pin preference.
- Escape returned focus to the Settings trigger and reopening preserved the width draft. Apply committed the width. Entering 421 showed the range error and focused the field. Cancel restored the committed value. Escape from the reset confirmation returned focus to Reset layout in Settings.
- The simulation ran through Start, Pause, Resume, and Cancel. Focus returned to Start with Cancelled status. The browser reported zero console errors in the final pass.

Browser observations provide no shell exit code. The extended checks below include 200% zoom, physical touch, assistive technology, and cross-browser scenarios that were not run in this pass.

### Extended runtime checklist

- At 320, 768, 900, 901, 1024, 1440, 1639, 1640, and 1920 CSS pixels, inspect document overflow and actual control edges. Repeat all densities, long labels, and 200% zoom. Check Start fills its row and Pause/Cancel fill the next row together or separately with 8px gaps. Confirm row heights grow without clipping.
- Measure distinct grouped controls, including navigation, table selection, settings sections, Apply/Cancel, and reset confirmation. Require at least 6px, normally 8px. Check 16px related-group and 24px section spacing. Check 32/40/48px minimum heights and 44px narrow/coarse-pointer floor. Composite control internals use their native geometry.
- At 1640px and above, open the right-edge modal Settings drawer, verify that Tab stays inside, then pin and check that workspace controls become reachable in the reserved-column layout. Unpin to return to the modal. Below 1640px, verify temporary pin suspension. Grow again and verify saved pin preference resumes. Close and Escape return focus to Settings.
- Resize across 1640px with focus on Theme, a section button, the width field, and Pin. Verify the corresponding control retains focus or Close receives it when Pin becomes disabled. Confirm unique IDs, selected section, and values. Settings reopens on its last section and starts closed after reload.
- Edit width without Apply. Close/reopen and change sections, verifying the dirty draft remains while workspace width stays committed. Resize via divider and reset with a dirty draft, verifying it survives and status reports the new committed width. Apply updates width and storage. Cancel restores the latest committed width. Clean drafts track divider/reset. Test empty, fractional, and out-of-range drafts, inline error association, and focus on the invalid field.
- Test Settings → reset → Keep layout, Escape, and confirm. Reset must be the sole modal, return focus to Reset layout, preserve Appearance/section/pin, and retain any dirty width draft. Test narrow Details → Settings and Settings dismissal → Details, and resize an open Details dialog across 900px. Verify visible reachable focus and one modal at a time.
- Repeat existing task selection, keyboard/pointer divider limits and cancellation, collapse/restore, simulation Pause/Resume/Cancel/completion/restart, form validation, and local recovery examples. Verify Shortcuts describes only working keys in their actual focus context.
- Reload old and new preferences, corrupt new field types, deny storage, and inspect session-only feedback. Verify only allowlisted preferences persist and width drafts do not. Inspect console and requests for exceptions or external traffic.
- Recheck Light/Dark/System, forced colors, reduced motion, and visible focus. Screen readers, physical devices, cross-browser behavior, Lighthouse/Core Web Vitals, and real touch targets require separate evidence.

## Revision 5 verification

Revision 5 targets WCAG 2.2 AA. Evaluate normal-text contrast against a 4.5:1 threshold and required non-text indicators against 3:1. Evaluate keyboard operation, focus obscuration, and target size as separate criteria. The project uses a separate 44 × 44 CSS px touch policy. The below-5% crimson budget is a design review target without measured screen coverage here. [WCAG 2.2](https://www.w3.org/TR/WCAG22/)

The Validate and publish workflow runs `node --test` and JavaScript syntax checks. Its test suite includes preference, interaction, token consistency, and contrast coverage. Packaging requires successful validation and a `main` run. The deployment job publishes the curated static artifact through GitHub Pages. Deployment status is recorded by the workflow. [Workflow](../.github/workflows/validate.yml) · [GitHub Pages workflow guidance](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

### Local results

- Seven Node tests passed. JavaScript syntax, diff whitespace, local links, and the curated 11-file Pages artifact reference check exited 0. Independent review inspected the palette's action guards, token thresholds, deployment permissions, and published file list.
- In the in-app browser, the command palette handled no matches, Ctrl+K, Arrow Down, Enter, and Escape. Start transferred focus to Pause, Cancel returned it to Start, and the Settings command closed the palette before focusing the drawer. Escape restored focus to the opener. Reset opened on Keep layout and returned focus to Reset layout on dismissal. Its confirmation control rendered a 3px crimson border.
- At 320, 768, and 1440 CSS px, the dark workspace and palette fit the document. Sampled standalone demo controls met a 44px minimum height at 320 and 768px and exceeded 44px in width. Comfortable desktop controls retained their 40px minimum height. At 320px in Light, palette buttons measured at least 64 × 44px, and the component landing page links and disclosure measured at least 65 × 44px. The narrow settings checkbox label measured 271 × 44px.
- Rendered dark surfaces used OKLCH with 9.01% and 8.75% relative luminance increases. Token calculations set the minimum primary label contrast at 8.95:1 in Dark and 10.50:1 in Light. Focus pairs measured at least 4.94:1 and 6.35:1 respectively. [Measured pairs](materials.md)

Browser observations supply no shell exit code. The browser engine version was not exposed. Screen readers, physical touch, 200% zoom, live System theme changes, forced-colors and reduced-motion emulation, and cross-browser testing remain separate verification work.

### Appearance preferences

- The in-app browser verified all nine combinations of System, Light, and Dark with Crimson, Blue, and Teal. Light with Teal persisted across reload and a confirmed layout reset. The live System checks used the browser's current preference. System-light switching and forced-colors behavior were checked in generated source, with no live emulation run. Browser observations supply no shell exit code.
- Twelve focused preference and token tests passed. The tests cover legacy records, invalid accent IDs, role-specific contrast in both encodings, and generated CSS and DTCG mappings. The token generator's `--check` mode, JavaScript syntax checks, and `git diff --check` exited 0.

## Revision 6 verification

Revision 6 keeps the WCAG 2.2 AA target. This section records what ran and what did not. Evidence labels: Verified, Partially verified, Unverified.

### Local results

- **Verified.** `node --test` ran 18 tests with 0 failures, including new checks for primary label contrast, 3:1 primary fill against every surface, edge and grid ranges, per-preset action and accent contrast, and the Per component density default. `node tools/build-tokens.mjs --check` reported outputs current. The Rust export compiled with `rustc --edition 2021 --crate-type lib`. All XAML exports parsed as well-formed XML. JavaScript syntax checks and a relative-link check of the Markdown files passed.
- **Verified.** `node tools/verify-reference.mjs` against a staged site in Chrome 153 passed its compact layout, resize, keyboard, review, recovery, texture and offline checks for the PortableForge reference after its primary buttons moved to the crimson action tokens.
- **Partially verified.** Screenshots of the reference workspace and the eight category layouts were captured in headless Chrome in the dark and light themes and inspected by eye. This shows rendering, not keyboard or assistive-technology behavior.

### Measured contrast (WCAG relative luminance, unrounded in tests)

| Pairing | Dark | Light |
| --- | ---: | ---: |
| `actionForeground` on action, hover, pressed | 5.14, 4.79, 5.52 | 7.00, 8.02, 9.21 |
| Action and hover against background, surface, raised (minimum) | 3.09 | 5.53 |
| Edge against background, surface, raised (minimum) | 1.56 | 1.45 |
| Grid against surfaces | 1.08–1.12 | 1.05–1.13 |
| Foreground and muted text on grid | 13.03, 7.39 | 14.54, 7.12 |
| Selection indicator on grid | 3.10 | 7.20 |
| Focus on grid | 4.59 | 4.54 |
| Deep accent label (`accentForeground` on `accent`) | 9.66 | 9.66 |
| Deep accent against surface | 1.48 | 10.90 |

The deep accent fails 3:1 against dark surfaces on purpose. It is limited to large tinted regions and is always paired with a marker and a label.

Blue and Teal preset action fills were solved to the same luminance targets as Crimson and are tested in both themes.

- **Verified.** 21 Node tests passed after adding the neutral surround, the Graphite preset, per-preset contrast for Graphite and workspace token checks. The workspace demo's script passes `node --check`.
- **Partially verified.** The workspace demo rendered in headless Chrome in all four modes and in the Graphite color-critical state. Mode switching, value-control keys and the hint bar were implemented but not exercised by an automated keyboard pass.

### Unverified

- Keyboard-only passes through the workspace demo's mode bar, value controls and hint bar, including Ctrl/⌘+1 to 4 and Shift fine steps.
- Screen readers, keyboard-only passes and 200% zoom on the category demo and the revised reference workspace.
- Protanopia, deuteranopia and tritanopia simulation of the crimson primary, selection and status cues.
- Windows high-contrast themes against the `HighContrast` XAML mapping, and forced-colors emulation of the new grid and edge rules.
- Reduced-motion behavior of the segmented progress and indeterminate segment.
- Live System theme switching in the category demo.

## PortableForge workflow reference verification

Run `node tools/verify-reference.mjs` with an installed Chrome browser. Set `CHROME_PATH` if Chrome is outside the default location. Pass `--root` with the staged site directory to test the files that Pages will serve. The CI job runs this check before uploading the site artifact.

| Scenario | Checked behavior |
| --- | --- |
| Compact layout | Complete sample flow at 640 × 480 CSS px and 100% text. The populated capture form also fits at 800 × 600 and 125%, and 960 × 720 and 150%. |
| Text and paths | In-place text-size changes preserve inputs. A long German fixture checks wrapping, the error message, and action reachability at 150%. A 320 px viewport uses document reflow with zero horizontal overflow. |
| Keyboard | Tab order follows the form. Task headings receive focus after navigation. The path dialog contains Tab and Shift+Tab and restores its opener after Close or Escape. |
| Review and recovery | Choices survive paging. The attention filter exposes unresolved findings, and the save gate checks the entire review. A changed sample setup preserves the profile and selected input. The original setup succeeds on retry. |
| Appearance and requests | Square tread is present on the dark surface, with a flat surface in Light and forced colors. The browser checks for runtime errors and requests outside the local test origin. |

The browser gate uses a fresh Chrome profile and sample data. Its geometry and keyboard checks cover the exercised states. Native Windows containment, cleanup, and installer compilation were verified separately in [PortableForge PR #4](https://github.com/SeanShaffer88/PortableForge/pull/4).
