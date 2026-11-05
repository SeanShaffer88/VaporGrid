# VaporGrid design guidelines

Use these foundations to adapt VaporGrid to your application's tasks. This document describes the current static concept collection; it does not define a shipped toolkit or executable interface. Use [tokens.json](tokens.json) as descriptive data and [the gallery](../README.md#concept-gallery) as visual direction.

## Foundations

Build with charcoal surfaces, crimson emphasis, and high-contrast text. Keep a subtle vaporwave grid in low-priority background areas and use soft active-edge glow sparingly. Avoid effects that obscure text, boundaries, or selection.

The direction starts with Windows workflows. Preserve task clarity when adapting it to another platform, rather than copying desktop density into every form factor. Follow the target platform's interaction conventions.

## Layout

Map navigation, primary work, contextual detail, and status to explicit regions. Align compartment edges, balance visual weight, and use symmetry when it helps users scan related information. Keep narrow gutters consistent; introduce more space where users must distinguish actions or groups.

Start with the spacing values in the token file, then test real content, localization, and text scaling. Keep primary work usable at the smallest supported window size. Move secondary detail into a drawer or stacked view when columns no longer fit.

## Compartments

Give each compartment a clear heading and purpose. Define minimum sizes, resize limits, collapse behavior, and how users restore hidden regions. Keep critical status and recovery actions reachable when a compartment collapses.

In an implementation, make resize and collapse controls keyboard operable, label them for assistive technology, expose expanded state, and preserve a sensible focus destination. If you persist layout preferences, document their scope and provide a reset action. Do not start background work just because a view opens or a reusable module loads.

## Typography

Use a Segoe UI-like sans-serif hierarchy on Windows with native system fallbacks elsewhere. Reserve a monospace face for code, timecodes, and aligned technical values. The descriptive type sizes use CSS-pixel-equivalent values; map them to the native toolkit's units and scaling behavior.

Keep labels readable at the user's text size. Allow wrapping or provide a way to inspect truncated values. Use weight, placement, and labels to establish hierarchy before adding color or glow.

## Color and contrast

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

For implementation, target at least 4.5:1 for normal text, 3:1 for qualifying large text, and 3:1 for required non-text indicators against adjacent colors. Recheck borders, opacity, overlays, hover states, and actual neighboring colors. A measured focus color alone does not prove that the focus treatment is visible or accessible.

## Interaction and feedback

Provide a visible focus indicator, a logical keyboard order, and discoverable shortcuts that respect platform conventions. Pair selected, warning, and error colors with text, icons, or another perceptible cue. Keep hover, focus, selection, and disabled states distinguishable.

Explain loading with the current operation, meaningful units or percentage when known, and available pause or cancel actions. Use an indeterminate state when progress cannot be measured. Report completion and failure explicitly, including a recovery action where possible; do not fabricate progress.

Use restrained transitions. Honor reduced-motion preferences by removing decorative motion and replacing animated progress with stable status updates. Preserve status information when animation stops.

## Adaptation and validation

On desktop, test window resizing, keyboard-only operation, text scaling, long labels, and restored layouts. On mobile, stack compartments around the primary task, provide comfortable touch spacing, and test target sizes on actual devices. Keep consequential actions separate from navigation.

Treat accessibility requirements as implementation targets. Static images cannot establish keyboard behavior, screen-reader output, focus visibility during interaction, touch usability, or reduced-motion support. Test these in the target application and record the platform, settings, and results before claiming support.

Keep reusable visual foundations separate from application-specific navigation, persistence, and platform adapters when that boundary improves reuse. Choose the host framework that fits the existing application; VaporGrid does not require a framework or a broad rewrite.

## Next-release mockup-first policy

For the maintainer's projects, schedule adoption for the next planned release. First map the project's real tasks and constraints, then create project-specific photo or image mockups and show them for review before implementation. Use that review to refine layout and scope, then implement and verify the chosen changes in the target application.

This is the maintainer's rollout policy, not an additional CC BY 4.0 condition on reusers. It does not authorize immediate changes to existing projects or promise changes across all applications.
