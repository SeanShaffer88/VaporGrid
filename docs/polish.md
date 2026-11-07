# Polish checklist

Small decisions that separate a professional tool from a prototype. Use it as a review gate. Items are testable.

## Alignment and rhythm

- [ ] Everything sits on a 4 px grid. Spacing comes from the scale (4, 8, 12, 16, 24, 32).
- [ ] Edges of adjacent compartments align. Baselines of labels and values match across a row.
- [ ] Icons share one 24 px grid, a 1.6 stroke and round joins. Icons and labels share a baseline.
- [ ] No layout shift when a state changes (hover, selection, error, loading).
- [ ] Border radius comes from one scale: 4 px controls, 8 px compartments.

## Numbers and text

- [ ] Timecodes, meters, rulers and numeric tables use tabular figures.
- [ ] Every value has a unit. Units follow the value in a muted color.
- [ ] Long paths truncate in the middle. Long names truncate at the end with a full-text tooltip.
- [ ] Copy names the next action in plain language. Errors say what happened, why, and what to do.
- [ ] Menus and buttons use sentence case, with an ellipsis only when more input follows.

## Interaction

- [ ] Hover, focus, active, selected, disabled, loading and error exist for every control.
- [ ] Hover feedback is immediate. Tooltips appear after 500 ms and never hold essential information.
- [ ] Clicks never move things: drag starts after 4 px.
- [ ] Undo and redo cover every user change. Destructive actions confirm only when undo is impossible.
- [ ] Multi-select follows platform rules: Shift for ranges, Ctrl/⌘ for toggles, Esc to clear.
- [ ] Cursors match the action: resize, grab, text, not-allowed.
- [ ] Double-click resets value controls. Enter commits. Esc cancels.

## States and feedback

- [ ] Empty, loading, success, error, offline and partial states are designed, not defaulted.
- [ ] Long work shows real progress with Cancel. No indeterminate spinner hides a stall.
- [ ] Success is quiet. Errors stay until resolved.
- [ ] No unprompted toasts, promotions or tips during work.

## Motion

- [ ] Transitions under 200 ms, ease-out for entrances. Nothing moves without a cause.
- [ ] Reduced-motion removes decoration and keeps status.
- [ ] Idle CPU is near zero. No ambient animation.

## Structure

- [ ] One dominant region per view and one crimson element per region.
- [ ] Edges separate compartments. Luminance marks state.
- [ ] Layouts survive resize, 200% text, long localized strings and a second monitor.
- [ ] Window size, position and layouts are restored, and validated against the current displays.
- [ ] Reset layout exists.

## Accessibility

- [ ] Logical Tab order, visible focus, accessible names, no color-only meaning.
- [ ] Every drag, scrub and gesture has a keyboard path.
- [ ] Contrast measured against actual neighbors in light, dark and forced colors.
