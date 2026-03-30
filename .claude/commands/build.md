---
description: Implement the active task defined in harness/run-state.md using the approved specification, design note, and implementation plan.
---

Follow the role definition in:

- `harness/roles/build-agent.md`

Follow these standards and references:

- `harness/standards/coding-standard.md`
- `harness/standards/testing-standard.md`
- `harness/standards/feature-workflow.md`
- `harness/standards/task-lifecycle.md`
- `harness/standards/run-id-standard.md`

Use this template:

- `harness/templates/run_report_template.md`

Read the live execution state in:

- `harness/run-state.md`

Use the task file referenced there as the only task for this run.

Read the approved artifacts referenced by the task file and/or run-state before making changes:

- feature specification
- design note
- implementation plan

Generate a stage-appropriate Build run ID using the run-id standard.

Determine the canonical run report path from the task file and/or run-state.

Create or update the run report with:

- task metadata
- current stage
- current run ID
- stage history entry for the Build stage
- validation evidence
- stop or pause state if relevant
- notes relevant to QA handoff

Do not modify governance-controlled files or paths as part of normal implementation work.

Governance-controlled paths include:

- `harness/run-state.md`
- `harness/tasks/`
- `harness/backlog/`
- `harness/standards/`
- `harness/roles/`
- `harness/templates/`
- `.github/agents/`
- `.cursor/rules/`
- `.claude/commands/`

If governance metadata appears inconsistent, report it in the implementation summary and run report instead of changing it.

Use the controlled validation loop defined by the Build role when command execution is available.

The validation loop may run only the approved commands and must stay within the retry and scope limits defined in the role.

Operate only within the approved task scope.

Make implementation changes, required test changes, and the run report update, but do not continue beyond this stage without orchestration or human review.
