# Image generation notes

The Appearance study illustrates two combinations of the same preferences: Dark with Blue and Light with Teal. The running demo uses native selects and the generated token colors. [Mockup](../assets/history/vaporgrid-appearance.png) · [Public prompt](image-prompt-appearance.txt)

Sean Shaffer directed six fictional static interface mockups using ImageGen. The prompts express design direction, not a pixel-perfect production specification. Generated text, geometry, controls, and color values can vary; use the [guidelines](design-guidelines.md) and [tokens](tokens.json) when implementing a design.

## Shared prompt direction

Create a flat, straight-on view of the full interface only. Exclude desktop, taskbar, hardware, browser chrome, and surrounding margin. Use crisp Segoe UI-like text and line icons. Use background `#171719`, surface `#202023`, raised `#29292D`, foreground `#F1F1F3`, muted `#B7B7C1`, accent `#D61F45`, and focus `#FF4D73`.

Arrange dense, balanced compartments with narrow gutters and suggested collapse and resize controls. Add a subtle grid and soft active-edge glow. Exclude purple or cyan rainbow treatments, glassmorphism, and large marketing heroes. Depict a fictional static concept, not an implemented product.

## Scenario directions

| Image | Requested scenario |
| --- | --- |
| [File utility](../assets/history/vaporgrid-file-utility.png) | FileManager: folder tree, 12-row file table, selection details, and a transfer at 68% with Pause and Cancel. |
| [IDE](../assets/history/vaporgrid-ide.png) | IDE: explorer, Rust `main.rs`, symbols, and a terminal with a fictional “Build succeeded” message. |
| [Video editor](../assets/history/vaporgrid-video-editor.png) | VideoStudio: media bin, original abstract clips, red-ribbon viewer, inspector, multitrack timeline, and timecode. |
| [Analytics](../assets/history/vaporgrid-analytics-dashboard.png) | Analytics: KPIs, line and bar charts, category charts, a table, and filters. |
| [Planner](../assets/history/vaporgrid-productivity-planner.png) | Planner: weekly calendar, task table, details, and checklist. |
| [Mobile activity](../assets/history/vaporgrid-mobile-fitness.png) | MobileActivity: week summary, bars, session list, bottom details, progress, Pause and Finish actions, and touch spacing. |

These are prompt requests, not a claim that each render reproduces every detail or implements the depicted behavior.

## Synapse reference processing

The user supplied and authorized the [Synapse reference](../assets/reference/synapse-interface.png) for this repository. AI processing isolates the interface from the source screenshot and removes the surrounding desktop and taskbar. This modification can change interface detail; do not describe the result as pixel-identical to the input.

See [ATTRIBUTION.md](../ATTRIBUTION.md) for the seven-file inventory and reuse credit. The mockups do not claim affiliation with third-party software or demonstrate real builds, transfers, analytics, editing, scheduling, or fitness tracking.

## Revision 2 sheets

Three new ImageGen sheets were created and visually inspected before implementing the interaction reference:

- [Components and states](../assets/history/vaporgrid-component-states.png): controls, focus, validation, selection, and confirmation direction.
- [Feedback and recovery](../assets/history/vaporgrid-recovery-states.png): fictional empty, error, offline, and simulated progress examples.
- [One workspace, three sizes](../assets/history/vaporgrid-responsive-comparison.png): the same fictional task application adapted to wide, narrow, and mobile layouts.

The full public prompts are preserved in [image-prompts-v2.json](image-prompts-v2.json), mapped to final asset filenames. They include the darker filled action, semantic labels, readable density, restrained decoration, and responsive behavior. Prompted color values do not prove the generated pixels match those values.

These sheets are illustrative direction. Generated marks, text, icon-like geometry, and layouts are not canonical assets or evidence of working software. The original vector sprite and its presentation export were authored separately from these raster images; see [iconography](iconography.md). The original six concepts and reference processing provenance remain intact as historical context.

## Revision 3 material refinement

The coordinator generated, visually inspected, and showed [the subtle skeuomorphic mockup](../assets/history/vaporgrid-skeuomorphic-refinement.png) before CSS implementation. The [public prompt](image-prompt-v3.txt) requests opaque matte graphite panels, fine rims, shallow input wells, restrained control relief, and a flat content table. No glass, clay, same-color dual-shadow neumorphism, texture behind text, or heavy gloss is adopted. Raster glyphs are not replacement icons or exact runtime specifications. Implementation endpoints and state rules are recorded in [materials](materials.md).

## Revision 4 responsive Settings

The coordinator supplied [the responsive Settings sheet](../assets/history/vaporgrid-responsive-settings.png) as shown before code changes. Its [public prompt](image-prompt-v4.txt) requests a wide pinned drawer, narrow modal, responsive real action tiles, and at least six logical pixels between separate controls. The implementation uses Appearance, Layout, and Shortcuts, a staged width editor, full-width Start, and flexible Pause/Cancel tracks where they fit. Generated Display labels, tile sizes, glyphs, and geometry remain illustrative. Use [revision 4 guidance](design-guidelines.md#responsive-controls-and-settings--revision-4) for the behavior contract.

## Revision 5 keyboard and elevation study

The coordinator showed the keyboard and elevation concept before implementation. The prompt requests matte graphite layers, a neutral primary action, restrained functional crimson, and a command search for existing workspace actions. Fictional rows, shortcut badges, shapes, and color values in the raster serve as illustration. Check the running workspace for the actual shortcut and component contract. [Mockup](../assets/history/vaporgrid-keyboard-and-elevation.png) · [Public prompt](image-prompt-v5.txt) · [Demo](https://seanshaffer88.github.io/VaporGrid/demo/)
