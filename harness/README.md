# Harness

## What This Is
The harness is the project operating system for feature delivery.

It provides:
- a stage-based workflow for building features safely
- clear role boundaries for each agent mode
- standards and templates to keep outputs consistent
- artifact folders so every stage has traceable inputs/outputs
- run records for auditability and debugging

In short: this is how work gets from idea to approved implementation.

## Why It Exists
The harness is optimized for reliable AI-assisted development:
- small, scoped increments instead of big-bang changes
- explicit artifacts before coding
- repeatable process across tasks
- test and QA gates before completion
- human approval where configured

## Core Workflow
The workflow is stage-driven and artifact-driven.

Typical flow:
1. Specification
2. Design
3. Implementation Planning
4. Build
5. QA
6. Awaiting Approval
7. Complete

The live workflow state is tracked in `harness/run-state.md`.
The detailed rules are defined in `harness/standards/feature-workflow.md`.

## Harness Structure

### `harness/tasks/`
Durable task definitions (one file per task), such as:
- `T001-global-layout.md`
- `T008-speaking-engagements.md`

Use these as the canonical task records.

### `harness/artifacts/`
Stage outputs grouped by type:
- `specs/` feature specifications
- `design/` design notes
- `plans/` implementation plans
- `qa/` QA reviews

File naming convention follows task IDs, for example:
- `T008-feature-spec.md`
- `T008-design-note.md`
- `T008-implementation-plan.md`
- `T008-qa-review.md`

### `harness/runs/`
Run logs/reports for completed or significant execution cycles.

Use these to inspect what happened during a run, what was produced, and why progression stopped or completed.

### `harness/roles/`
Role definitions for each stage agent (build, QA, orchestrator, etc.).

These define responsibilities and constraints for each role.

### `harness/standards/`
Process and engineering standards, including:
- lifecycle and workflow rules
- stage input contracts
- coding and testing standards
- run-state and run-id standards

### `harness/templates/`
Templates for all stage artifacts and logs:
- feature spec
- design note
- implementation plan
- QA review
- run report
- task and run-state templates

### `harness/backlog/`
Task intake and backlog tracking.

### `harness/design-system/`
Design system guidance used during design/build stages.

## How To Interact With The Harness

## 1. Start From `run-state.md`
Before doing feature work, open and review:
- `harness/run-state.md`

Confirm:
- current task ID
- current stage
- run ID
- approval gate requirements

Treat this file as the live source of truth for active execution state.

## 2. Work One Stage At A Time
Do not skip stages.

For the active stage:
- read the required inputs from `harness/standards/stage-input-contracts.md`
- produce the expected artifact in `harness/artifacts/`
- keep scope aligned to the active task file in `harness/tasks/`

## 3. Use Templates For Every Artifact
Create/update artifacts using the relevant file in `harness/templates/`.

This keeps outputs consistent and machine-parseable for downstream stages.

## 4. Follow Standards During Build
During implementation:
- follow `harness/standards/coding-standard.md`
- follow `harness/standards/testing-standard.md`
- keep changes scoped to the current task

## 5. Validate Before Stage Progression
Before moving from Build to QA (or from QA to approval):
- ensure required tests/validation pass
- ensure artifacts are complete and linked from the task/run context
- record evidence in the relevant run report/review artifact

## 6. Log Runs Clearly
For each meaningful run, maintain a run document in `harness/runs/`.

Include:
- run ID
- task ID
- stage outcomes
- blockers or stop reasons
- decisions/approvals

## 7. Respect Governance Boundaries
During normal feature execution:
- read governance files (`standards`, `roles`, `templates`, `tasks`, `backlog`)
- do not modify governance unless explicitly performing harness maintenance

## Quick Operating Checklist
1. Read `harness/run-state.md`.
2. Open the active task file in `harness/tasks/`.
3. Confirm stage inputs from `harness/standards/stage-input-contracts.md`.
4. Produce/update the stage artifact in `harness/artifacts/` using templates.
5. Run required validation for the stage.
6. Record outcomes in `harness/runs/` and advance only when gates are satisfied.

## Practical Examples

### Example: New Task Execution
1. Select task file in `harness/tasks/`.
2. Create spec in `harness/artifacts/specs/` from template.
3. Create design note in `harness/artifacts/design/`.
4. Create implementation plan in `harness/artifacts/plans/`.
5. Implement in codebase and run tests.
6. Create QA review in `harness/artifacts/qa/`.
7. Log run result in `harness/runs/`.

### Example: Resume An Interrupted Run
1. Read `harness/run-state.md` for `current_stage` and `stop_reason`.
2. Open the latest run file in `harness/runs/` for context.
3. Continue only the active stage.
4. Re-run validation.
5. Update run log and progress to next stage if gates pass.

## Related Docs
- `AGENTS.md` (Cursor: project rules mirroring `.github/agents/`)
- `harness/standards/feature-workflow.md`
- `harness/standards/task-lifecycle.md`
- `harness/standards/stage-input-contracts.md`
- `harness/standards/run-state-standard.md`
- `harness/standards/testing-standard.md`