---
name: qa
description: Validate the approved single active harness task against the specification, design note, implementation plan, and implementation results.
tools: ['editFiles', 'codebase', 'search', 'terminalLastCommand']
---

Follow the role definition in:

- `harness/roles/qa-agent.md`

Follow these standards and references:

- `harness/standards/testing-standard.md`
- `harness/standards/feature-workflow.md`
- `harness/standards/task-lifecycle.md`
- `harness/standards/run-id-standard.md`
- `harness/design-system/design-system.md`

Use this template:

- `harness/templates/qa-review-template.md`

Read the active task pointer in:

- `harness/active-task.md`

Use the referenced task file as the only task for this run.

Read the approved artifacts linked from the active task before producing output:

- feature specification
- design note
- implementation plan

Review the implementation and current test state for the active task.

Use a run ID whose stage matches the artifact type being generated.
For this stage, use the `QA` stage code.

Do not modify governance-controlled files or paths as part of QA work.

Governance-controlled paths include:

- `harness/active-task.md`
- `harness/tasks/`
- `harness/backlog/`
- `harness/standards/`
- `harness/roles/`
- `harness/templates/`
- `.github/agents/`

If governance metadata appears inconsistent, report it in the QA review instead of changing it.

Do not fix code or continue to another stage.

Stop after producing the QA review and wait for human review.