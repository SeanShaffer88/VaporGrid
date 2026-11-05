# Image generation notes

Sean Shaffer directed six fictional static interface mockups using ImageGen. The prompts express design direction, not a pixel-perfect production specification. Generated text, geometry, controls, and color values can vary; use the [guidelines](design-guidelines.md) and [tokens](tokens.json) when implementing a design.

## Shared prompt direction

Create a flat, straight-on view of the full interface only. Exclude desktop, taskbar, hardware, browser chrome, and surrounding margin. Use crisp Segoe UI-like text and line icons. Use background `#171719`, surface `#202023`, raised `#29292D`, foreground `#F1F1F3`, muted `#B7B7C1`, accent `#D61F45`, and focus `#FF4D73`.

Arrange dense, balanced compartments with narrow gutters and suggested collapse and resize controls. Add a subtle grid and soft active-edge glow. Exclude purple or cyan rainbow treatments, glassmorphism, and large marketing heroes. Depict a fictional static concept, not an implemented product.

## Scenario directions

| Image | Requested scenario |
| --- | --- |
| [File utility](../assets/vaporgrid-file-utility.png) | FileManager: folder tree, 12-row file table, selection details, and a transfer at 68% with Pause and Cancel. |
| [IDE](../assets/vaporgrid-ide.png) | IDE: explorer, Rust `main.rs`, symbols, and a terminal with a fictional “Build succeeded” message. |
| [Video editor](../assets/vaporgrid-video-editor.png) | VideoStudio: media bin, original abstract clips, red-ribbon viewer, inspector, multitrack timeline, and timecode. |
| [Analytics](../assets/vaporgrid-analytics-dashboard.png) | Analytics: KPIs, line and bar charts, category charts, a table, and filters. |
| [Planner](../assets/vaporgrid-productivity-planner.png) | Planner: weekly calendar, task table, details, and checklist. |
| [Mobile activity](../assets/vaporgrid-mobile-fitness.png) | MobileActivity: week summary, bars, session list, bottom details, progress, Pause and Finish actions, and touch spacing. |

These are prompt requests, not a claim that each render reproduces every detail or implements the depicted behavior.

## Synapse reference processing

The user supplied and authorized the [Synapse reference](../assets/reference/synapse-interface.png) for this repository. AI processing isolates the interface from the source screenshot and removes the surrounding desktop and taskbar. This modification can change interface detail; do not describe the result as pixel-identical to the input.

See [ATTRIBUTION.md](../ATTRIBUTION.md) for the seven-file inventory and reuse credit. The mockups do not claim affiliation with third-party software or demonstrate real builds, transfers, analytics, editing, scheduling, or fitness tracking.

## Revision 2 sheets

Three new ImageGen sheets were created and visually inspected before implementing the interaction reference:

- [Components and states](../assets/vaporgrid-component-states.png): controls, focus, validation, selection, and confirmation direction.
- [Feedback and recovery](../assets/vaporgrid-recovery-states.png): fictional empty, error, offline, and simulated progress examples.
- [One workspace, three sizes](../assets/vaporgrid-responsive-comparison.png): the same fictional task application adapted to wide, narrow, and mobile layouts.

The full public prompts are preserved in [image-prompts-v2.json](image-prompts-v2.json), mapped to final asset filenames. They include the darker filled action, semantic labels, readable density, restrained decoration, and responsive behavior. Prompted color values do not prove the generated pixels match those values.

These sheets are illustrative direction. Generated marks, text, icon-like geometry, and layouts are not canonical assets or evidence of working software. The original vector sprite and its presentation export were authored separately from these raster images; see [iconography](iconography.md). The original six concepts and reference processing provenance remain intact as historical context.
