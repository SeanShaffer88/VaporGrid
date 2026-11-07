# Data lists

Any list of records (installed programs, files, history, layers, logs, orders, nodes) is a data list. It follows one pattern so every product reads the same way. The machine-readable rules are the `dataList` and `fill` sections of [tokens.json](tokens.json).

## Anatomy

| Part | Rule |
| --- | --- |
| Gridlines | Row and column lines in the `edge` token, 1 px. Both directions, always. The outer border uses `edge` too. |
| Header | One fixed row above the data. It stays visible while rows scroll. Sort state shows with an arrow and `aria-sort`, never color alone. |
| Rows | Compact density (28 px minimum). Keep the same height in every row. No zebra stripes: the gridlines already separate rows. |
| Selected row | The `selected` fill plus a 3 px `selectionIndicator` bar on the leading edge. One selected row (or a clear multi-select) per list. |
| Numbers | Right-aligned, tabular figures, same unit and precision in a column. The header aligns with its numbers. |
| Text | Left-aligned, truncated with an ellipsis. The full value is available in a tooltip and in the details panel. |
| Status | Text plus an icon or outlined tag. Color supports the text, never replaces it. |
| Empty list | Shows the primary action, recent items and shortcuts on the `grid` motif, not a blank box. See the [fill rule](design-guidelines.md#layout). |

## Columns

- Give the main column the flexible width and every other column a fixed or minimum width.
- Order columns by how often they are read: name first, then the fields that decide the next action, then metadata.
- Let people resize, reorder and hide columns. Save the set locally. Provide a reset.
- Keep a column visible when it is the sort key.

## Size and fill

A data list fills its region. It shows as many rows as fit and scrolls or virtualizes inside its own box, so a taller window shows more data instead of empty space. Never size a list to its content when it could use the room. The main window itself never scrolls.

## Keyboard

| Key | Action |
| --- | --- |
| Up, Down | Move the selected row |
| Home, End | First or last row |
| Page Up, Page Down | Move by one visible page |
| Space | Toggle selection when multi-select is on |
| Enter | Open or run the default action |
| Ctrl/⌘+F | Focus the list's search or filter |
| Ctrl/⌘+A | Select all, when multi-select is on |

Give the list an accessible name, expose it as a grid (or table) with row and column counts, and announce the selected row.

## Not a data list

Menus, tab bars, toolbars and short fixed option lists do not take gridlines. Use plain rows with the selected-row marker.

## Check

- Gridlines are visible on every surface and on a selected row in Dark and Light (`edge` is at least 1.4:1, checked in `demo/tokens.test.mjs`).
- Numbers align, the header stays put, and the last visible row does not leave a gap larger than one compact row.
- Everything works with the keyboard alone and at 200% text size.
