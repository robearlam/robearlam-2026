---
name: feature-design
description: Produce a design note for the active task defined in harness/run-state.md.
tools: ['edit/editFiles', 'search/codebase', 'search']
handoffs:
  - label: Move to Tech Lead Planning
    agent: tech-lead
    prompt: Continue the workflow for the current task.
    send: false
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

Generate a stage-appropriate Design run ID using the run-id standard.

Write the design note to the canonical design-note path defined by the task file and/or run-state.

Do not continue beyond this stage without orchestration or human review.