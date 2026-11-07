# Workspaces for multi-mode and creative tools

Applies to products with several distinct jobs inside one window: video, audio and image tools, DAWs, disc and media utilities, CAD suites, dev environments. The patterns keep the same tokens and rules. [Live demo](https://seanshaffer88.github.io/VaporGrid/demo/workspaces/).


*Screenshot of the running workspace demo. All names and data are fictional.*

## Modes

A mode is a saved layout for one job (Edit, Mix, Deliver). Use modes when the user's goal changes enough that a different dominant region is needed.

- Show modes in a **mode bar** at the window's bottom or top edge. Use `role="tablist"`. Mark the current mode with a structural marker and a label, never color alone.
- Keep **3 to 9 modes**. Past that, group them or use the command palette.
- **Ctrl/⌘+1 to 9** switches. Arrow keys, Home and End move within the bar.
- Each mode **saves its own layout**: panel sizes, visible panels, zoom. Switching never loses work or selection.
- A **Home or hub** page can offer task tiles for the main jobs. Tiles are real actions with clear verbs. No promotions, news or unrelated offers. A disabled tile says why.
- Show only what the current mode needs. Rarely used functions live in menus and the palette.

## Panels

Panels are the movable compartments. Give every panel the same header anatomy: title, tab strip if grouped, a ⋯ menu, collapse, and optional float or maximize.

- Panel and tab headers are 28 px tall. Minimum panel size is 160 × 96 px.
- Dragging begins after a **4 px threshold** so clicks never move panels.
- **Every drag has a keyboard path** and a menu item: Dock, Float, Move to…, Collapse, Reset layout. Drag-only docking fails keyboard users.
- Tabbed groups use `role="tablist"`. The selected tab has a marker and bold weight.
- **Reset layout** is always available per mode and for all modes, with a confirmation that names what changes.
- Floating windows return to a visible monitor after display changes.
- A collapsed panel leaves a labeled restore control and a palette command.

## Options bar

A contextual bar under the toolbar shows options for the active tool or selection: brush size, trim mode, zoom. It changes with context but stays in one place. Its primary action sits at the far end. It is the region's one crimson element.

## Value controls

Sliders, knobs, faders and scrubbed fields are the heart of creative tools. They must be precise and discoverable.

- Show the **numeric value and unit** at all times.
- Provide **typed entry**: a number field next to the control, or edit-in-place.
- Arrow keys step. **Shift** gives fine steps and **Ctrl** coarse steps. Page Up and Page Down jump by ten. Home and End go to the limits.
- **Double-click** resets to the default. So do Backspace and Delete when focused.
- Scrub drags have a 4 px threshold and show a cursor that matches the direction.
- Draw rotary knobs as flat arcs with a value label. Skeuomorphic hardware imitation is optional content styling, not chrome.
- Minimum target 24 × 24 px. Compact panels keep this and enlarge on touch.
- Meters use `role="meter"` with a value text, tabular figures, and segments. Peak or clip uses a word as well as `warning` color.
- Any control with side effects has a description in the **hint bar** on hover and focus, and a tooltip after 500 ms.

## Timelines, rulers and step grids

Here the grid motif is functional, not decorative.

- Rulers and lanes use `grid` lines for time or beat divisions, stronger lines at bar or second boundaries.
- The **playhead** is a 2px `selectionIndicator` line, the region's one crimson element. Selected clips use `selected` fill and a neutral outline.
- Snap to the grid by default, with a modifier to disable. Show the snap state in the status bar.
- Zoom, pan and nudge have keyboard commands. Timecodes and positions use tabular figures.
- Step sequencer cells are buttons with `aria-pressed`. Beat groups have a stronger border.

## Color-critical work

Chrome tint changes color perception. For tools where color judgment matters:

- Offer the **Graphite** preset. It makes the primary action, selection, focus and accent neutral. The default stays Crimson.
- Draw the viewport on a **neutral surround** (`surround`). It stays chroma-free in dark and light.
- Keep UI chrome out of the image. Do not tint overlays on the picture.
- Provide a clean-feed or full-screen viewer mode with a visible exit and a palette command.


## Progress and long jobs

Name the job, the phase, units done and remaining, and the destination. Show real Pause and Cancel. Keep working elsewhere in the app. Report completion with a way to open the result.

## Pro-tool traps to avoid

- Tiny controls under 24 px for density. Use Compact (28 px rows, 32 px controls) instead.
- Hidden gestures with no menu or keyboard path.
- Modal dialogs for non-blocking settings. Use panels.
- Loud brand colors in chrome. Content is colorful, chrome is not.
- Mode explosions. Prefer panels and the palette over a tenth mode.

## Mix: a second layout

