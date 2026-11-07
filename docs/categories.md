# Category layouts

Tessel applies to any desktop product by changing which region dominates, not by changing the system. Each archetype below keeps the same tokens, edges, one crimson element per region, and the same keyboard contract. See them live in the [category demo](https://seanshaffer88.github.io/Tessel/demo/categories/).

<img src="../assets/tessel-categories.png" alt="Eight Tessel layouts in the dark theme: data and records, editor, media, monitoring, wizard, communication, CAD, and settings" width="640">

*Screenshot of the running category demo. All names and data are fictional.*

## How to adapt

1. Name the view's one judgment ("Which order needs attention?").
2. Choose the archetype closest to the work. Mix them for compound products.
3. Give the dominant region its share, then place supporting regions around it.
4. Set density per component class. Choose the single primary action.
5. Check the [fit rule](design-guidelines.md#layout) and keyboard paths.

## Archetypes

| Archetype | Dominant region | Typical regions | Density notes | Primary action | Special rules |
| --- | --- | --- | --- | --- | --- |
| Data & records | Table (≈65%) | Filters, details inspector, status | Rows Compact, forms Comfortable | Export, Run, Save | Virtualize. Sort and selection are keyboard operable. Selected row uses `selected` fill plus marker |
| Editor & IDE | Editor (≈55%) | Explorer, symbols, terminal, status | Everything Compact | Run | Syntax colors never use brand crimson. Errors use `danger` with an icon |
| Media & creative | Canvas (≈70%) | Tool rail, properties, timeline | Toolbars Compact, properties Comfortable | Render, Export | Chrome recedes. Grid appears as the empty canvas. Canvas content is exempt from the palette |
| Monitoring & analytics | One metric or chart | Node list, events, filters | Rows Compact | Acknowledge, Resolve | Every chart has a table alternative and a text summary. Series colors do not use brand crimson. Status needs words |
| Utility & wizard | Current step | Step list, progress, actions | Comfortable | Continue, Start | No scrollbars. Preview before destructive work. Cancel always reachable |
| Communication | Conversation (≈50%) | Conversation list, contact detail | Rows Compact | Send | Asymmetric by design. Unread uses text and weight, not color alone |
| CAD & 3D | Viewport (≈70%) | Feature tree, properties, command line | Compact | Commit | The viewport may use depth, perspective and its own palette. Chrome stays flat. Provide keyboard orbit, pan and zoom |
| Settings & system tools | The form | Section list, staged Apply/Cancel | Comfortable | Apply | Immediate and staged settings are clearly separated. Draft survives section changes. Search sections when there are many |
| Document & reader | The page (≈60%) | Outline, comments, search, status | Rows Compact, reading text Comfortable | Save, Share | Text measure 60 to 80 characters. Zoom keeps layout. Outline and comments are keyboard reachable |
| Spreadsheet & grid | The grid (≈80%) | Formula bar, sheet tabs, side panel, status | Everything Compact | Calculate, Save | Row and column gridlines in `edge`. Frozen headers. Tabular figures right-aligned. Arrow keys move the cell; typing edits it |
| Admin & network console | Resource table (≈60%) | Tree, filters, detail drawer, log | Rows Compact | Apply, Restart | Destructive actions confirm with the target named. Status uses icon plus text. Logs are bounded and searchable |
| Launcher & hub | Recent items and tasks (≈60%) | Search, pinned items, shortcuts | Comfortable | Open, Create | Empty states show the primary action, recent items and shortcuts. Search is focused on open |
| Whiteboard & collaboration canvas | Canvas (≈75%) | Tool rail, layers, people, comments | Toolbars Compact | Share | Presence uses name plus color. Every canvas action has a keyboard path. Grid shows as the empty canvas |
| Scientific & instrument | Plot or readout (≈65%) | Channels, parameters, log | Compact | Run, Acquire | Units always shown. Live values use tabular figures. Every plot has a table alternative. Stop is always reachable |

## Multi-mode creative products

Video, audio and image tools combine several archetypes inside one window through modes. Use the [workspace patterns](workspaces.md) for the mode bar, panels, value controls, timelines and color-critical chrome, and the [polish checklist](polish.md) as a review gate. [Live workspace demo](https://seanshaffer88.github.io/Tessel/demo/workspaces/).

## Compound products

A video editor is Media with an Editor-style timeline. An email client is Communication with Data-style rows. A package installer is a Wizard whose last step is Monitoring. Keep one dominant region per window, and let secondary windows pick their own archetype.

## Adaptation matrix

Choose by the product's conditions, then check each row against the archetype.

| Condition | Choice |
| --- | --- |
| Pointer and keyboard, long sessions | Compact rows and controls, rich shortcuts, hint bar, more regions |
| Occasional use, one task | Comfortable, a wizard or hub layout, fewer regions, larger primary action |
| Touch first | Touch density (48 px), no hover-only controls, gestures have button equivalents |
| Color-critical work (grading, imaging, print) | Graphite preset, neutral `surround`, no tinted chrome near the work |
| Many windows or monitors | Panels detach and remember position. Each window keeps one active-region rule |
| High data volume | Virtualized gridded tables, bounded viewports, saved column sets |
| Safety or irreversible work | Preview before apply, named confirmations, undo where possible |

## Beyond these

Games and kiosks sit outside the standard's scope. Use the tokens and the accessibility rules, and choose density and input targets for the device.
