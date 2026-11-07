# Rationale

Each rule exists for a use-case reason, lives in a token or document, and has a check. If a rule has no reason, remove it.

| Principle | Use-case advantage | Where it lives | Check |
| --- | --- | --- | --- |
| Asymmetric regions with one dominant region | The user's main job gets most of the window in every category | [Layout](design-guidelines.md#layout), [categories](categories.md) | Review against the archetype table |
| Fill, no dead space | More data, canvas or timeline per screen; no wasted pixels on large displays | [Layout](design-guidelines.md#layout) | Resize to 1280×800 and 1920×1080 and look for gaps over one compact row |
| Gridded data lists | Row and column lines make dense records scannable and alignable | [Layout](design-guidelines.md#layout), `edge` token | Every list of records has both line sets and a header |
| One crimson element per region | The next action is unmistakable | [Color](design-guidelines.md#color), `action*` tokens | Contrast tests in `demo/tokens.test.mjs` |
| `edge` borders for structure | Compartments read without relying on shadows | `edge` token, minimum 1.4:1 | `node --test` |
| Density per component class | Compact for expert tables, Comfortable for forms, Touch for touch | [Density](design-guidelines.md#density), `density` tokens | Token test |
| Fit rule | Windows and forms never scroll; only data containers do | [Layout](design-guidelines.md#layout) | Manual at 200% text and smallest size |
| Modes, panels, value controls | Multi-job tools switch context without losing place; every drag has a key | [Workspaces](workspaces.md) | Keyboard walkthrough |
| Graphite preset and neutral `surround` | Color-critical work is not tinted by the interface | [Materials](materials.md), `surround` token | Neutral test |
| Zero telemetry, local settings only | Trust for professional and private work | Charter | Code review |

Review any new rule by adding a row here first.
