---
name: build
description: Implement the approved single active harness task using the approved specification, design note, and implementation plan.
tools: ['editFiles', 'codebase', 'search', 'terminalLastCommand']
handoffs:
  - label: Move to QA Review
    agent: qa
    prompt: The implementation for the active task has been completed and reviewed. Read the active task, approved feature specification, approved design note, approved implementation plan, and implementation results, then produce a QA review using the harness role, standards, and template. Stop after producing the QA review and wait for human review.
    send: false
---

Follow the role definition in:

- `harness/roles/build-agent.md`

Follow these standards and references:

- `harness/standards/coding-standard.md`
- `harness/standards/testing-standard.md`
- `harness/standards/feature-workflow.md`
- `harness/standards/task-lifecycle.md`
- `harness/standards/run-id-standard.md`

Read the active task pointer in:

- `harness/active-task.md`

Use the referenced task file as the only task for this run.

Read the approved artifacts linked from the active task before making changes:

- feature specification
- design note
- implementation plan

Use a run ID whose stage matches the work being performed.
For this stage, use the `BUILD` stage code when a run ID is required.

Do not modify governance-controlled files or paths as part of normal implementation work.

Governance-controlled paths include:

- `harness/active-task.md`
- `harness/tasks/`
- `harness/backlog/`
- `harness/standards/`
- `harness/roles/`
- `harness/templates/`
- `.github/agents/`

If governance metadata appears inconsistent, report it in the implementation summary instead of changing it.

Operate only within the approved task scope.

Make implementation changes and required test changes, but do not continue beyond this stage without human review.