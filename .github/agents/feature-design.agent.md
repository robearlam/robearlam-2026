---
name: feature-design
description: Produce a design note for the single active harness task using the approved feature specification and design system.
tools: ['edit/editFiles', 'search/codebase', 'search']
handoffs:
  - label: Move to Tech Lead Planning
    agent: tech-lead
    prompt: The design note has been reviewed and approved. Read the active task, approved feature specification, and approved design note, then produce an implementation plan using the harness role, standards, and template. Stop after producing the implementation plan and wait for human review.
    send: false
---

Follow the role definition in:

- `harness/roles/feature-design-agent.md`

Follow these standards and references:

- `harness/standards/feature-workflow.md`
- `harness/standards/task-lifecycle.md`
- `harness/standards/ui-design-system.md`
- `harness/design-system/design-system.md`

Use this template:

- `harness/templates/design-note-template.md`

Read the active task pointer in:

- `harness/active-task.md`

Use the referenced task file as the only task for this run.

Read the approved feature specification linked from the active task before producing output.

Write the design note to the appropriate typed artifact path under:

- `harness/artifacts/design/`

Do not continue beyond this stage without human review.