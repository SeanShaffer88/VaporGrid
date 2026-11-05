# Revision 3 materials

Subtle skeuomorphism expresses structure through opaque matte panels, 1px inner rim highlights, shallow field wells, and slight button relief. This is the current material contract layered over revision 2 interaction rules; it introduces no behavior, density, or layout changes. CSS and descriptive tokens remain the appropriate boundary for this small vanilla reference.

| Role | Dark | Light and System-light |
| --- | --- | --- |
| Default button top → bottom | `#29292D → #202023` | `#FFFFFF → #E4E4E9` |
| Panel rim | `#404047` | `#FFFFFF` |
| Inset shade | `#111113` | `#C2C2CA` |
| Structural shadow | `0 2px 3px #0003` | `0 2px 3px #00000014` |
| Primary top → bottom | `#B8183A → #A21533` | Same, label `#F1F1F3` |

Panels and dialogs keep solid Surface backgrounds. The task table, row selection buttons, and text backgrounds receive no material gradient or texture. Bevels are decorative; existing borders, explicit labels, selection stripe/underline, and independent focus outlines convey meaning.

Enabled buttons use slight default relief, a solid Raised hover fill, and a shallow inset pressed state. Primary hover/pressed uses `#A21533`. Pressing never moves the control. Disabled buttons use solid Surface, Muted labels, a dashed border, and no shadow or fading. Fields and native selects retain solid Surface fills and shallow inset shadows. Invalid boundaries and danger explanations remain separate from keyboard focus.

Dark, Light, and System remain supported choices. Material depth does not depend on the Decorative edge checkbox. Forced colors removes material shadows and gradients and uses system colors while retaining outlines, native controls, selection boundaries, and currentColor icons. Reduced motion retains existing suppression; no material animation is introduced.

Do not add translucent panels, backdrop blur, clay bulges, same-color neumorphic dual shadows, heavy gloss, texture behind text, or replacement raster glyphs. Preserve the eleven original SVG icons and revision-2 density, responsive drawer, divider, and lifecycle contracts. See [verification](verification.md) for measured endpoints and unperformed runtime checks.
