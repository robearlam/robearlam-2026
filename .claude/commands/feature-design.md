---
description: Produce a design note for the active task defined in harness/run-state.md.
---

Follow the role definition in:

- `harness/roles/feature-design-agent.md`

Follow these standards and references:

- `harness/standards/feature-workflow.md`
- `harness/standards/task-lifecycle.md`
- `harness/standards/run-id-standard.md`
- `harness/design-system/design-system.md`

Use this template:

- `harness/templates/design-note-template.md`

Read the live execution state in:

- `harness/run-state.md`

Use the task file referenced there as the only task for this run.

Read the approved feature specification referenced by the task file and/or run-state before producing output.

Read only the files needed for this stage.

Do not read `active-task.md`.

Do not read prior task design notes, specifications, implementation plans, or QA artifacts unless the human explicitly instructs you to use them as reference material.

Do not perform broad repository searches if the required inputs are already known.

Do not read unrelated repository files to infer style or output shape when the template and role already define them.

Generate a stage-appropriate Design run ID using the run-id standard.

Write the design note directly to the canonical design-note path defined by the task file and/or run-state.

Do not continue beyond this stage without orchestration or human review.
