---
name: po-spec
description: Produce a feature specification for the single active harness task.
tools: ['search/codebase', 'search', 'edit/editFiles']
handoffs:
  - label: Move to Feature Design
    agent: feature-design
    prompt: The feature specification has been reviewed and approved. Read the active task and approved feature specification, then produce a design note using the harness role, standards, design system, and template. Stop after producing the design note and wait for human review.
    send: false
---

Follow the role definition in:

- `harness/roles/po-spec-agent.md`

Follow these standards:

- `harness/standards/feature-workflow.md`
- `harness/standards/task-lifecycle.md`
- `harness/standards/testing-standard.md`

Use this template:

- `harness/templates/feature-spec-template.md`

Use the currently selected single active task as the only work item.

Do not continue beyond this stage without human review.