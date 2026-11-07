# Adoption guide

How to bring the standard into a project. Take the generated token export for your stack, apply the rules in order, and record deviations. Never edit generated files: change [tokens.json](tokens.json), run `node tools/build-tokens.mjs`, and commit the outputs.

## 1. Pick your export

| Stack | File | Use |
| --- | --- | --- |
| Web, Tauri, Electron-free webviews | [demo/tokens.css](../demo/tokens.css) | Link it. Set `data-theme` (system, light, dark) and `data-accent` (crimson, blue, teal, graphite) on the root element. |
| Rust (Win32, windows-sys) | [dist/tessel.rs](../dist/tessel.rs) | Include as a module. Palettes are `[u8; 3]`. Sizes are CSS-pixel equivalents: scale by DPI. |
| Slint | [dist/Tessel.slint](../dist/Tessel.slint) | Import the `Tessel` global. Bind `dark` to the OS theme from Rust. |
| WPF | [dist/Tessel.Dark.xaml](../dist/Tessel.Dark.xaml), [dist/Tessel.Light.xaml](../dist/Tessel.Light.xaml) | Merge one dictionary and swap it to change theme. Use `SystemColors` when `SystemParameters.HighContrast` is true. |
| WinUI 3 | [dist/Tessel.xaml](../dist/Tessel.xaml) | Merge into `Application.Resources`. Theme dictionaries handle Light and High Contrast. |
| WinForms | [dist/tessel.tokens.json](../dist/tessel.tokens.json) | Read the colors at startup and assign them to controls. Draw lists with owner-draw or a custom grid. |
| Godot 4 | [dist/tessel_tokens.gd](../dist/tessel_tokens.gd) | Use the `TesselTokens` class to build a `Theme` resource. |
| Anything else | [dist/tessel.tokens.json](../dist/tessel.tokens.json) | Design Tokens Community Group format. Convert with your tool of choice. |

## 2. Apply in this order

1. **Color roles.** Set the surfaces (background, surface, raised, selected), text (foreground, muted), `edge` for structure and `border` for controls. Use `action*` only for the one primary action per region, and `selectionIndicator` for selection and the active-region rule.
2. **Density.** Rows, toolbars and trees Compact. Forms, dialogs and navigation Comfortable. Touch input uses Touch.
3. **Layout.** One dominant region, supporting regions at 20 to 35%, a status strip. Windows fit without scrollbars. Follow the [fill rule](design-guidelines.md#layout).
4. **Data lists.** Use the [data list pattern](data-lists.md) for every list of records.
5. **Keyboard.** A path for every task, visible shortcuts, Ctrl/⌘+K for commands. Resize and collapse work from the keyboard.
6. **States.** Empty, loading, success, error, disabled, offline and confirm. Status uses text plus an icon.
7. **Themes.** Dark and Light, plus High Contrast and forced colors using native system colors. Offer Graphite for color-critical work.
8. **Optional texture.** The [wood grain](materials.md#dark-wood-grain) is for exposed dark backgrounds only. Dense surfaces stay flat.

## 3. Native Windows notes

- Follow the OS theme and respect High Contrast. Do not hard-code colors where a system color should apply.
- Per-Monitor DPI v2. Scale pixel values from the token export by the display scale.
- Native controls first. Style the chrome with tokens, and keep native focus behavior unless you replace it with the 3 px `focus` outline at a 3 px offset.
- Remember window size, position and splitter positions, and restore them safely when displays or DPI change.
- No telemetry, no required network, and settings stored locally in a readable format.

## 4. Check your work

Use the [verification guide](verification.md). At minimum:

- Contrast of text, boundaries, selection and focus on every surface in Dark, Light and Graphite.
- Keyboard-only run of the core task. Tab order, Esc to cancel, Enter to submit.
- 100% to 200% scaling and 200% text without clipping or main-window scrollbars.
- Populated, empty, error and progress states for every list and form.
- No region leaves more than one compact row of unused height.

## 5. Record deviations

Keep a short list in the project: which token or rule you changed, why, and what you measured. A deviation that helps several projects belongs in [tokens.json](tokens.json) through a pull request, with a row in [rationale](rationale.md).

## 6. Rollout

Apply the standard to a project during its next planned release work, not as a separate restyle. Show screen mockups of the affected views for review before changing UI code.
