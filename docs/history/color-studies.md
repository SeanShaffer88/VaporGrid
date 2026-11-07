# Historical color studies

These measurements describe superseded palettes. They are kept as a record of how Tessel's color contract evolved and are **not normative**. Use the current [tokens](../tokens.json), [CSS properties](../../demo/tokens.css) and [measured palette contract](../materials.md#measured-palette-contract) instead.

## Revision 2 palette

Revision 2 used Background `#171719`, Surface `#202023` and Raised `#29292D`, with crimson `#D61F45` for selection and filled primary actions.

The following ratios use the standard sRGB relative-luminance calculation for opaque, solid colors. Ratios round to two decimals; evaluate thresholds using unrounded values. They measure specified color pairs, not pixels sampled from generated images.

| Text or indicator | Background | Contrast ratio |
| --- | --- | --- |
| Foreground `#F1F1F3` | Background `#171719` | 15.87:1 |
| Foreground `#F1F1F3` | Surface `#202023` | 14.41:1 |
| Foreground `#F1F1F3` | Raised `#29292D` | 12.84:1 |
| Muted `#B7B7C1` | Background `#171719` | 9.00:1 |
| Muted `#B7B7C1` | Surface `#202023` | 8.17:1 |
| Muted `#B7B7C1` | Raised `#29292D` | 7.28:1 |
| Foreground `#F1F1F3` | Accent `#D61F45` | 4.50:1 (rounded; below 4.5 unrounded) |
| Accent `#D61F45` | Surface `#202023` | 3.20:1 |
| Focus `#FF4D73` | Surface `#202023` | 5.08:1 |

Use foreground and muted text on the measured charcoal surfaces. Foreground on accent falls just below 4.5:1 before rounding, so do not use this pairing for normal-size text that requires 4.5:1. Place the label on a charcoal surface or adjust the colors and measure again. Accent on surface also falls below the normal-text target.

## Revision 2 brand and action pairings

Revision 2 filled primary actions with crimson. Revision 5 replaced this with a neutral primary action and reserves crimson for focus, selection and labeled destructive cues.

Brand crimson marks selected regions and primary action emphasis. It never means error by itself. Pair status with explicit words and functional shape: In review, Needs check, Ready, Running, Paused, Completed, Cancelled. Add icons where useful without making dots or color the only signal. The reference's original icons use a clear silhouette first; see [iconography](../iconography.md).

Filled actions use `#B8183A` with `#F1F1F3`; hover uses the darker `#A21533` with the same foreground. These pairings exceed the 5:1 design target before rounding. Light mode retains these action pairings while changing content surfaces and semantic foregrounds independently. Additional computed pairings:

| Foreground / indicator | Background | Contrast |
| --- | --- | --- |
| `#F1F1F3` | `#B8183A` | 5.7639:1 |
| `#F1F1F3` | `#A21533` | 6.9172:1 |
| `#202023` | `#FFFFFF` | 16.2502:1 |
| `#50505B` | `#FFFFFF` | 7.9557:1 |
| `#50505B` | `#E4E4E9` | 6.2785:1 |
| `#9E1534` | `#FFFFFF` | 8.0439:1 |
| `#174E85` | `#FFFFFF` | 8.5197:1 |
| `#735100` | `#FFFFFF` | 7.2266:1 |
| `#9FC9FF` | `#202023` | 9.4970:1 |
| `#F2CD82` | `#202023` | 10.7022:1 |
| `#777780` | `#202023` | 3.6639:1 |
| `#75757E` | `#FFFFFF` | 4.5631:1 |

Semantic pairings below retain the unrounded calculation output. Feedback, job status, and recovery headings/edges sit on Surface; the invalid field boundary touches Surface both inside the input and outside it in the containing panel. Each listed pairing exceeds 4.5:1 for text and 3:1 for boundaries.

| Semantic foreground / boundary | Actual adjacent color | Contrast |
| --- | --- | --- |
| Dark success `#8FD4AD` | Surface `#202023` | 9.43189928683773:1 |
| Dark danger `#FFB1A8` | Surface `#202023` | 9.368089693764144:1 |
| Light success `#236340` | Surface `#FFFFFF` | 7.166662802733971:1 |
| Light danger `#9D2B1F` | Surface `#FFFFFF` | 7.502796738092947:1 |

Ratios are calculated from sRGB relative luminance without rounding before comparison. These are token pairings, not whole-page certification. Check focus against each adjacent surface, control boundaries, hover/selected states, overlays, disabled recognizability, and browser-generated appearances independently.
