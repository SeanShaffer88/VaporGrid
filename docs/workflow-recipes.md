# Compact workflow recipes

Use these patterns for a task that starts with inputs, requires review, and ends with a result. Keep the heading, current decision, and next action together. Give each page one primary action. [Interactive PortableForge reference](https://seanshaffer88.github.io/Tessel/demo/portableforge/) · [Compact fit rules](design-guidelines.md#compact-fit)

## Page layouts

| Page | Order from top to bottom | What changes when space is limited |
| --- | --- | --- |
| Setup | Task heading, one sentence of help, labeled inputs, validation message, action row | Stack fields and their related actions. Give long values the full row width. |
| Review | Task heading, totals, filter, current finding, page navigation, continue action | Show one finding per page and keep the complete decision available. |
| Save | Profile name, summary of what will be saved, save action | Wrap the summary above the action. Keep the user's choices when they return to review. |
| Progress | Current operation, known progress or waiting state, available actions | Keep the current operation readable. Move optional detail to a separate view. |
| Result | Outcome, artifact name or location, one useful next action | Wrap the location and provide a full-value view for exceptionally long values. |

Keep visible labels above inputs and size controls to their content. Use the available width before adding a row. Start with 8 CSS px between distinct controls and 12–16 CSS px between related groups. Use 44 × 44 CSS px targets for narrow layouts and coarse pointers. [Spacing and target rules](design-guidelines.md#density-and-scaling)

## Text-size fit

Use this matrix as an acceptance plan. Record the actual viewport, effective zoom, platform, and outcome for every run. Test the smallest supported viewport even when it differs from the reference dimensions.

| Scenario | Reference setup | Pass condition |
| --- | --- | --- |
| Desktop minimum | 640 × 480 CSS px at 100% | The current task fits without page or nested scrollbars. Labels, status, focus outlines, and actions remain visible. |
| Change text size mid-task | Switch 100% → 125% → 150% → 100% after entering values and making review choices | Inputs and choices survive the transition. The same decision remains available, and controls stay readable and operable. |
| Large text and localization | 150% in-app text, a localized string or deliberately expanded label, a long path with spaces, and a populated error | Text wraps without overlapping controls. The full value is accessible, and the recovery action remains reachable. |
| Constrained browser | 320 CSS px wide or 200% browser zoom | Content reflows in source order. If the viewport is outside the fit envelope, vertical document flow keeps everything reachable. Verify zero horizontal overflow and no nested scroll trap. |
| Interaction states | Repeat with an empty form, warning, pending operation, failure, and result | Verify both the content and the active control's focus indicator. Include the dialog at the smallest supported size. |

Check bounding boxes or overflow in automation and inspect the rendered page. Walk the whole flow with keyboard only and record what assistive technology was used. Geometry checks establish fit for the tested states.

## Plain-language copy

Put the next action first when the user needs to act. Name the same object consistently across pages. State the outcome separately from the next step. Use verb-led buttons that make sense out of context. Place file formats, checksums, and detailed diagnostics near the action that needs them or in a clearly labeled detail view.

| Before | After |
| --- | --- |
| Initialize capture session | Capture sample changes |
| Configuration deltas detected | Review captured changes |
| Hash validation failure | The setup file does not match this profile. Choose the original setup file and try again. |
| Operation aborted | The rebuild stopped. Your saved profile is still available. |
| OK | Save profile |

Use the saved-state sentence only when the application can verify that the profile remains available. Identify the affected item and explain the next action in one or two sentences.

## Responsive fields and full values

Use a flexible input track and a content-sized action track. Wrap them into separate rows when they no longer fit. Preserve the field label and helper text when the layout changes. In web grids, give the flexible track a zero minimum with `minmax(0, 1fr)` so an unbroken value can shrink its track.

Wrap path previews in place without changing the underlying value. Offer a named action such as **View setup path** for values that exceed the preview's useful height. Open a labeled full-value view with selectable text and a visible Close action. Keep validation linked to the input through the platform's accessibility API. After dismissal, return focus to the opener or to its associated field if the opener is gone.

## Paged review

Store choices by stable finding ID. Derive the visible list from the filter and clamp the page when the list changes. Show a count such as **Finding 2 of 4** plus the outstanding warning count. Provide Previous and Next actions with explicit disabled states at the ends. An empty filtered view says which filter is active and offers a way back to all findings.

Define **Needs attention** as unresolved required decisions. Preserve choices through paging, filtering, and back navigation. Validate required decisions against the full review before saving. If a required finding blocks progress, explain the block and make the finding reachable.

## Keyboard and focus

- Keep Tab order aligned with reading order. Use native labels and interactive elements. Keep a visible focus outline distinct from the selected marker. [Color roles](materials.md#color-roles)
- On a task-page change, place focus on its heading. After Previous or Next within the same review, keep focus on the paging control when it remains available. Announce the current finding and count without moving focus on every update.
- In a modal, set initial focus inside it and contain navigation. Support Escape and a visible Close action. Return focus to the opening control on every dismissal path. Test open, Tab, Shift+Tab, Close, and Escape.
- For invalid input, associate the message with the field and focus the first invalid field when the user submits. Leave other entered values intact.

## Status and recovery

Reserve a stable place for progress, completion, and errors. Use a polite live status for ordinary phase changes and announce a blocking error when it appears. Keep messages stable enough to read. Give a determinate progress bar only when the task has measurable work remaining.

| State | What to show | What to preserve |
| --- | --- | --- |
| Working | Current operation and measurable progress when available | Inputs and review choices while an operation runs. |
| Blocked | What failed, which input or step needs attention, and the next action | Every valid input and the last completed step. |
| Retry | A visible Try again action in the same action region | The saved profile and unchanged inputs. Check the corrected input again. |
| Complete | The result and one useful action | Enough context to identify the result or return to the task. |

## PortableForge case study

The Windows wizard captures an application in a dedicated Sandboxie-Plus box, opens review after cleanup, saves an approved profile, and rebuilds a PortableApps.com installer using setup bytes that match the recorded SHA-256. The Windows Home x64 verification for the linked change used Sandboxie-Plus 1.18.8 and an owned test application. It checked box cleanup, rejection of changed setup bytes, unattended replay from byte-identical renamed setup, the generated installer hash and icons, and populated-form readability across all three text sizes. [PortableForge verification and change](https://github.com/SeanShaffer88/PortableForge/pull/4) · [Pinned Windows wizard source](https://github.com/SeanShaffer88/PortableForge/tree/8b3f91efda6e1167a62c6fbb6c3b83d81313c8bc/apps/portableforge/src/wizard)

The Tessel browser reference is a deterministic simulation with sample paths, findings, and results. Use it to try text-size changes, long paths, review paging, and recovery from a mismatched sample setup. Real capture and installer generation run in the Windows application. [Try the browser reference](https://seanshaffer88.github.io/Tessel/demo/portableforge/)
