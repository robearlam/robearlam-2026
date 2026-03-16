---
name: build
description: Implement the approved single active harness task using the linked artifacts.
tools: ['edit/editFiles', 'search/codebase', 'search', 'read/terminalLastCommand']
handoffs:
  - label: Move to QA Review
    agent: qa
    prompt: The implementation for the active task is complete. Read the active task and all linked artifacts, then perform QA review using the harness role, standards, design system, and template. Stop after producing the QA review and wait for human review.
    send: false
---

Follow the role definition in:

- `harness/roles/build-agent.md`

Follow these standards:

- `harness/standards/coding-standard.md`
- `harness/standards/testing-standard.md`
- `harness/standards/task-lifecycle.md`
- `harness/standards/feature-workflow.md`

Use the currently selected single active task as the only work item.

Read the linked feature specification, design note, and implementation plan before making changes.

Do not continue beyond this stage without human review.