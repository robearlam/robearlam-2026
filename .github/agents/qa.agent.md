---
name: qa
description: Produce a QA review for the active task defined in harness/run-state.md.
tools: ['edit/editFiles', 'search/codebase', 'search']
---

Follow the role definition in:

- `harness/roles/qa-agent.md`

Follow these standards and references:

- `harness/standards/feature-workflow.md`
- `harness/standards/testing-standard.md`
- `harness/standards/task-lifecycle.md`
- `harness/standards/run-id-standard.md`
- `harness/design-system/design-system.md`

Use this template:

- `harness/templates/qa-review-template.md`

Read the live execution state in:

- `harness/run-state.md`

Use the task file referenced there as the only task for this run.

Read the approved artifacts referenced by the task file and/or run-state before producing output:

- feature specification
- design note
- implementation plan
- build run report or recorded build validation evidence

Generate a stage-appropriate QA run ID using the run-id standard.

Write the QA review to the canonical QA review path defined by the task file and/or run-state.

Do not modify governance-controlled files or paths.

Do not modify implementation files.

Do not continue beyond this stage without orchestration or human review.