# Contributing to VaporGrid

Propose focused improvements to the standard or interactive workspace. Describe the primary judgment or action the change supports and show how it fits the view. [Design guidelines](docs/design-guidelines.md) · [Component usage](docs/components.md)

## Propose a design change

Describe the task your change supports, the affected compartments, and the tradeoff you make. Include a photo or image mockup whenever you change the design. Explain behavior that a static image cannot show, including collapse, resize, focus order, shortcuts, and loading or error states.

Check text contrast, keyboard access, reduced motion, touch spacing where relevant, and alternatives to color-only meaning. Describe these as implementation targets until you have runtime evidence.

For the maintainer's projects, plan adoption for the next planned release and show project-specific photo or image mockups for review before implementation. This rollout policy adds no restriction to reuse under CC BY 4.0.

## Supply provenance

Use material you have permission to contribute under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Record the source, creator, license, and modifications in [ATTRIBUTION.md](ATTRIBUTION.md). Identify AI-generated images and update the [generation notes](docs/image-generation-notes.md) when you add or revise them.

Keep local machine paths, private email addresses, credentials, temporary files, raw phone screenshots, and work logs out of the public tree.

## Check your documentation

Verify relative links and asset names, parse edited JSON, and keep descriptions consistent with the supplied images and actual project state. Document measured contrast pairings rather than assuming the palette works in every combination. Preserve prior version context when you supersede guidance, and explain the change for readers who used the earlier direction.

## Interaction reference changes

Keep the demo dependency-free and explicitly simulated. Keep its runtime requests limited to site assets and persist only display preferences. Preserve keyboard and pointer resizing, command and modal focus restoration, validated preferences, reset cancellation, and terminal timer cleanup.

Run `node --test` from the repository root and use `node --check` on changed scripts. Keep the published CSS and JSON token values aligned and include contrast checks for changed pairs. Test actual keyboard behavior, touch targets, and contrast in the affected themes. Document what ran and what still needs coverage. Add an Unreleased note for changes to the token or interaction contract. [Verification](docs/verification.md) · [Changelog](CHANGELOG.md)

The Validate and publish workflow runs Node checks on pull requests. A validated commit on `main` can deploy the static reference through GitHub Pages. Keep deployment paths relative to the project site and review the curated artifact when adding runtime files. [Workflow](.github/workflows/validate.yml)

Edit the canonical [icon sprite](demo/icons.svg) first; update the standalone [sheet](assets/vaporgrid-icon-sheet.svg) from its definitions. Use original paths, retain visible labels/currentColor, and document inspiration without copying proprietary marks. New design changes still require a photo/image mockup shown before implementation. Educational code and vectors are included in the same CC BY 4.0 scope.
