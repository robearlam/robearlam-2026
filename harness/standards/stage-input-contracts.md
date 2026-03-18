# Stage Input Contracts

## Purpose

This standard defines the allowed input set for each workflow stage.

Its purpose is to keep stage execution:

- bounded
- faster
- more deterministic
- aligned with stage responsibilities

The orchestrator should use these contracts when invoking stage agents.

Stage agents should treat these contracts as the default input boundary unless a true blocker requires escalation.

---

## General Rule

Each stage may read only:

- the live run-state
- the active task file
- the stage role file
- the stage template
- the standards explicitly required by that stage
- the approved upstream artifacts required for that stage
- the minimum repository files needed to complete that stage

Stages must not broaden context unless:

- a required input is missing
- the human explicitly instructs the agent to use additional reference material
- a genuine blocker requires limited additional inspection

If the required input set is insufficient, the correct behavior is to escalate, not to browse broadly.

---

## Specification Stage Contract

### Allowed Inputs

- `harness/run-state.md`
- active task file in `harness/tasks/`
- `harness/roles/po-spec-agent.md`
- `harness/templates/feature-spec-template.md`
- `harness/standards/feature-workflow.md`
- `harness/standards/task-lifecycle.md`
- `harness/standards/run-id-standard.md`
- `harness/standards/testing-standard.md`

### Optional Inputs

- `harness/design-system/design-system.md` only if needed to clarify scope wording or design-system alignment in acceptance criteria

### Disallowed By Default

- `active-task.md`
- prior task artifacts
- broad `harness/` searches
- codebase inspection
- shell/build scripts
- unrelated repo files

---

## Design Stage Contract

### Allowed Inputs

- `harness/run-state.md`
- active task file in `harness/tasks/`
- approved active feature specification
- `harness/roles/feature-design-agent.md`
- `harness/templates/design-note-template.md`
- `harness/design-system/design-system.md`
- `harness/standards/feature-workflow.md`
- `harness/standards/task-lifecycle.md`
- `harness/standards/run-id-standard.md`

### Disallowed By Default

- prior task design notes
- prior task specs
- implementation plans
- QA artifacts
- codebase inspection
- broad repository searches
- unrelated repo files

---

## Implementation Planning Stage Contract

### Allowed Inputs

- `harness/run-state.md`
- active task file in `harness/tasks/`
- approved active feature specification
- approved active design note
- `harness/roles/tech-lead-agent.md`
- `harness/templates/implementation-plan-template.md`
- `harness/standards/feature-workflow.md`
- `harness/standards/task-lifecycle.md`
- `harness/standards/run-id-standard.md`
- `harness/standards/coding-standard.md`
- `harness/standards/testing-standard.md`

### Optional Inputs

- limited codebase inspection only if required to identify likely affected areas or validate existing structure

### Disallowed By Default

- prior task plans
- prior task QA reviews
- broad repo searches
- unrelated codebase inspection
- harness-wide browsing

---

## Build Stage Contract

### Allowed Inputs

- `harness/run-state.md`
- active task file in `harness/tasks/`
- approved active feature specification
- approved active design note
- approved active implementation plan
- `harness/roles/build-agent.md`
- `harness/templates/run_report_template.md`
- `harness/standards/feature-workflow.md`
- `harness/standards/task-lifecycle.md`
- `harness/standards/run-id-standard.md`
- `harness/standards/coding-standard.md`
- `harness/standards/testing-standard.md`
- the minimum codebase files required by the approved implementation plan
- the terminal commands allowed by the build role

### Disallowed By Default

- prior task build artifacts
- unrelated repo files
- harness-wide browsing
- governance file editing
- unrelated codebase refactors

---

## QA Stage Contract

### Allowed Inputs

- `harness/run-state.md`
- active task file in `harness/tasks/`
- approved active feature specification
- approved active design note
- approved active implementation plan
- active task build run report
- `harness/roles/qa-agent.md`
- `harness/templates/qa-review-template.md`
- `harness/standards/feature-workflow.md`
- `harness/standards/task-lifecycle.md`
- `harness/standards/run-id-standard.md`
- `harness/standards/testing-standard.md`
- `harness/design-system/design-system.md`
- the implementation files and tests relevant to the active task

### Disallowed By Default

- prior task QA reviews
- unrelated repo browsing
- broad codebase inspection beyond the feature scope
- governance file editing

---

## Enforcement Expectations

The orchestrator should:

- identify the current stage
- determine the allowed input set for that stage
- instruct the stage agent to remain within that input set
- treat any need to expand beyond the contract as a blocker unless the expansion is minimal and clearly justified

The stage agent should:

- stay within the declared input contract
- escalate rather than broaden context arbitrarily
- avoid using prior task artifacts as templates or precedent unless explicitly instructed

---

## Escalation Rule

If a stage cannot proceed with its allowed inputs, the correct action is:

1. explain what required input is missing
2. explain why the current contract is insufficient
3. stop and request clarification or explicit permission to expand the input set

Do not broaden context silently.