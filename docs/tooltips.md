# Tooltip contract

Every element a person can act on, or that needs explaining, has a tooltip. A tooltip never covers interface content: button text, labels, text fields, icons, focus rings and other controls stay fully visible. When there is no clear space next to an element, the tooltip text appears in a reserved hint lane instead of floating over content. [Tokens](tokens.json) (`tooltip`) · [Reference implementation](../demo/tooltip.mjs) · [Placement logic](../demo/tooltip-placement.mjs)

![Tooltip contract mockup: allowed placement in free space, forbidden overlap, hint-lane fallback, icon-only and disabled controls.](../assets/vaporgrid-tooltip-contract.png)

## Coverage

Tooltips are required on:

- every interactive control: buttons, links, fields, selects, checkboxes, tabs, menu items, dividers and resize handles
- icon-only controls, status chips and badges, column headers, and progress bars (with the current value)
- truncated text, showing the full value
- disabled controls, stating why they are unavailable and keeping the tooltip while disabled

Tooltips are not required on fully visible body text and headings.

## Placement

1. Try positions in this order: below, above, after (end) and before (start) the element, each with an 8px gap. For each side, try centered, start-aligned and end-aligned, slid inside the window.
2. Reject any position that touches text, a control, a field, an icon, the element itself including its 3px focus outline and 3px offset, another focus ring, or the edge of the window or open dialog.
3. If no position is clear, show the text in the hint lane: the window's status lane, or the lane at the bottom of the open dialog or drawer. Prefix it with the element's name and mark the element with a dashed outline while the lane shows its text.
4. Keep the width at most 320px and wrap the text. Never clip or scroll it.

Hint lanes take reserved space and never overlay content. The window lane sits at the bottom edge and the layout reserves its height.

## Behavior

| Trigger | Shows | Hides |
| --- | --- | --- |
| Pointer hover | After 500 ms; immediately when moving from one tooltip to the next | 100 ms after the pointer leaves both the element and the tooltip; Escape |
| Keyboard focus | Immediately on visible keyboard focus | On blur |
| Touch | Long-press for 500 ms; that press does not activate the control | On the next touch elsewhere |

- The pointer can move onto a tooltip without it closing.
- Escape hides a hover or touch tooltip and does nothing else. Keyboard-focus tooltips never obscure content, so Escape keeps its normal meaning there, such as closing a dialog.
- Expose the text as a stable accessible description (`aria-describedby`). The floating tooltip and hint lane are visual duplicates and are hidden from assistive technology.
- Content is one sentence, plus a shortcut when one exists. Never put information that exists only in a tooltip.
- Do not use the native `title` attribute or a toolkit's default tooltip when it cannot be positioned. Those draw over content wherever the pointer is.

## Style

Raised fill, border, 1px rim and the structural shadow; 13px text at 1.4 line height; a muted second line for the unavailable reason. No arrow tip, since it would intrude on content. No animation, so reduced motion needs no special case. In forced colors, use Canvas, CanvasText and system outlines.

## Native toolkits

| Toolkit | How to meet the contract |
| --- | --- |
| WinUI 3 | Use `ToolTipService.ToolTip` with `Placement` and `PlacementRect`. Compute the clear rectangle from sibling bounds with the same ordering. Use an `InfoBar`-height status row as the hint lane. |
| WPF | Use `ToolTipService.Placement="Custom"` with a `CustomPopupPlacementCallback` that tests candidates against the visual tree's text and control bounds. |
| Win32 | Use `TTM_TRACKPOSITION` (tracking tooltip) instead of automatic placement. Position it from your own candidate test, and set the status bar's text when nothing fits. |
| egui | `Response::on_hover_ui_at_pointer` cannot avoid content. Paint a tooltip `Area` at a position from the same placement function, using widget rects collected that frame. Otherwise write to a bottom `TopBottomPanel` hint lane. |
| Slint | Use a `PopupWindow` positioned from Rust with the placement function. Use a status `Text` row as the hint lane. |

`dist/vaporgrid.rs` and the other exports carry the tooltip timings and sizes. Port `demo/tooltip-placement.mjs` (about 50 lines, no dependencies) for the placement test.

## Verification

`node --test` checks:

- placement order and gap
- edge sliding
- anchor clearance and the hint-lane fallback
- a 2,000-case fuzz test that no returned position touches an obstacle
- that every interactive element, status chip, badge, header and progress bar in the reference markup has `data-tip`
- that every control that can be disabled has `data-tip-disabled`
- that no native `title` attribute is present
- that the timings and sizes match `tokens.json`

Browser checks are recorded in [verification](verification.md#tooltip-contract-verification).
