# Component usage

Use the [live component examples](https://seanshaffer88.github.io/VaporGrid/#usage-heading) to inspect token surfaces and the [live workspace](https://seanshaffer88.github.io/VaporGrid/demo/) to try each interaction. The [local reference instructions](../demo/README.md) cover the same demo.

| Component | Use it when | Do | Avoid | Try it |
| --- | --- | --- | --- | --- |
| Primary action | One task advances the view | Use the crimson `action` fill with the `actionForeground` label ([crimson roles](materials.md#crimson-roles)). One per view. Give the action a clear verb and visual priority in source order | Giving every action the same emphasis or filling the entire action group with crimson | [Start simulation](https://seanshaffer88.github.io/VaporGrid/demo/#simulation-heading) |
| Destructive confirmation | An action discards a committed choice or resets a layout | Name the effect, keep Cancel reachable, and pair a restrained crimson indicator with text and a boundary | Meaning conveyed only through red or an ambiguous label such as Yes | [Settings Layout](https://seanshaffer88.github.io/VaporGrid/demo/#show-settings) |
| Secondary action | Other actions in the same group | Use `raised` with a `border`. Keep the same height as the primary action | Crimson fills on more than one action per region | [Pause and Cancel](https://seanshaffer88.github.io/VaporGrid/demo/#simulation-heading) |
| Task selection | A row drives a contextual inspector | Use the `selected` fill, `selectionIndicator` marker, and programmatic pressed state, then keep details reachable from the task. Rows follow the compact data-row density | Raising every row or relying on a colored stripe alone | [Tasks](https://seanshaffer88.github.io/VaporGrid/demo/#tasks-heading) |
| Drawer | Settings or context belong to the current workspace | Use one DOM instance, return focus on close, and pin only when space supports the main task | Hiding focused controls behind an overlay or silently discarding a draft | [Open Settings](https://seanshaffer88.github.io/VaporGrid/demo/#show-settings) |
| Command palette | Users repeat actions that already have visible controls | Label search, surface available commands, and describe only supported keys | Commands that bypass validation, simulate unavailable actions, or intercept typing in unrelated inputs | [Open Commands](https://seanshaffer88.github.io/VaporGrid/demo/#show-commands) |
| Progress and recovery | Work takes time or requires intervention | Name the phase, expose real Pause and Cancel choices, and pair status with text | Using an accent flash as the only signal or reporting simulated work as real | [Progress and recovery](https://seanshaffer88.github.io/VaporGrid/demo/#simulation-heading) |

## Apply one dominant judgment per view

Write the view's question before placing controls. In the reference workspace it is “Which task should I prepare?” Tasks and the selected Details support the decision. Prepare preview is the dominant action, while Settings and Commands provide ways to configure or operate the same work. In a monitoring view the dominant item could be a metric, with filters and historical context placed around it.

## Verify component states

Check default, hover, keyboard focus, active, selected, error, and disabled states where applicable. Measure contrast against the actual adjacent surface in both themes. Confirm reachability by Tab and visible focus in compact and touch layouts. Use a 44 × 44 CSS px project target for touch controls, and evaluate the separate WCAG 2.2 AA criteria for the intended product. [WCAG 2.2](https://www.w3.org/TR/WCAG22/) · [VaporGrid verification](verification.md)
