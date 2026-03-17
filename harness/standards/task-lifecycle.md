# Task Lifecycle Standard

## Purpose

This document defines the lifecycle of a task within the harness workflow.

The lifecycle describes the stages a task moves through from initial definition to completion.

The lifecycle exists to ensure:

- consistent execution across tasks
- predictable artifact generation
- controlled progression through build and QA
- clear approval points
- traceable task history

The lifecycle rules apply to the currently executing task as defined in `harness/run-state.md`.

---

# Lifecycle Model

A task moves through the following lifecycle stages:

1. Specification
2. Design
3. Implementation Planning
4. Build
5. QA
6. Awaiting Approval
7. Complete

These stages represent the canonical workflow of the harness.

Each stage is responsible for producing specific artifacts and validating specific aspects of the feature.

---

# Lifecycle State Authority

The authoritative record of the current lifecycle stage is:

```
harness/run-state.md
```

This file defines:

- the active task
- the current lifecycle stage
- the current run ID
- which stages are completed
- whether execution is blocked or awaiting approval

Task files and artifacts may reference lifecycle stages for context, but they are not the authoritative source of lifecycle state.

---

# Stage Definitions

## Specification

Purpose:

Define the feature in terms of user value and clear acceptance criteria.

Primary artifact:

```
Feature Specification
```

Expected output:

```
harness/artifacts/specs/TASKID-feature-spec.md
```

The specification must clearly describe:

- feature goal
- user value
- in-scope behavior
- out-of-scope items
- acceptance criteria
- dependencies
- risks

The next lifecycle stage after successful specification is **Design**.

---

## Design

Purpose:

Translate the feature specification into a design aligned with the design system and UX expectations.

Primary artifact:

```
Design Note
```

Expected output:

```
harness/artifacts/design/TASKID-design-note.md
```

The design note describes:

- feature structure
- layout and interaction behavior
- component usage
- responsive expectations
- accessibility considerations
- alignment with the design system

The next lifecycle stage after successful design is **Implementation Planning**.

---

## Implementation Planning

Purpose:

Define the technical implementation approach for the feature.

Primary artifact:

```
Implementation Plan
```

Expected output:

```
harness/artifacts/plans/TASKID-implementation-plan.md
```

The implementation plan defines:

- technical approach
- implementation slices
- affected areas of the codebase
- test strategy
- risks
- assumptions

The next lifecycle stage after successful planning is **Build**.

---

## Build

Purpose:

Implement the feature according to the specification, design note, and implementation plan.

Primary activities include:

- implementing the feature
- updating or creating tests
- aligning code with the design system
- running validation commands

Expected validation commands include:

- lint
- typecheck
- tests
- end-to-end tests

The build stage must produce a **run report** documenting:

- implementation summary
- validation results
- assumptions made
- any governance observations

The next lifecycle stage after a successful build is **QA**.

---

## QA

Purpose:

Validate that the implementation meets the specification, design, and plan.

Primary artifact:

```
QA Review
```

Expected output:

```
harness/artifacts/qa/TASKID-qa-review.md
```

QA must evaluate:

- acceptance criteria satisfaction
- design alignment
- implementation-plan alignment
- test coverage
- governance compliance

QA produces one of the following outcomes:

- **Pass**
- **Pass With Minor Issues**
- **Issues Found**

If blocking issues are found, the lifecycle returns to **Build** for corrective work.

If QA passes, the lifecycle moves to **Awaiting Approval**.

---

## Awaiting Approval

Purpose:

Allow a human maintainer to review the feature before final completion.

Approval review may consider:

- feature correctness
- design alignment
- code quality
- test coverage
- maintainability
- readiness for production use

Approval may result in:

- approval to complete the task
- a request for corrective build work
- a request for design or specification updates

If approved, the task moves to **Complete**.

---

## Complete

Purpose:

Mark the task as successfully completed.

Completion means:

- specification implemented
- QA passed
- approval granted
- artifacts archived
- run report recorded

The run-state should record the final lifecycle stage as **Complete**.

---

# Stage Progression Rules

Lifecycle progression should follow the canonical stage order:

```
Specification → Design → Implementation Planning → Build → QA → Awaiting Approval → Complete
```

Stages must not be skipped.

If a stage fails validation, the workflow returns to the previous appropriate stage.

Examples:

QA failure → return to Build  
Design issues discovered during planning → return to Design

---

# Run IDs

Each lifecycle stage execution should have a run ID following the standard format:

```
RUN-YYYY-MM-DD-TASKID-STAGE
```

Examples:

```
RUN-2026-03-16-T002-SPEC
RUN-2026-03-16-T002-DESIGN
RUN-2026-03-16-T002-PLAN
RUN-2026-03-16-T002-BUILD
RUN-2026-03-16-T002-QA
```

The run ID should be recorded in:

- the artifact generated by the stage
- the run-state file
- the run report

---

# Orchestrator Responsibility

Stage agents should not directly advance lifecycle state.

Instead:

- stage agents perform work and generate artifacts
- the orchestrator updates `harness/run-state.md`
- the orchestrator determines the next stage
- the orchestrator stops when approval gates are reached

This ensures lifecycle control remains centralized and predictable.

---

# Summary

The harness lifecycle ensures consistent feature development by guiding tasks through specification, design, planning, build, QA, and approval stages.

The authoritative lifecycle state is tracked in `harness/run-state.md`.

Task files define durable task information but are not the primary source of live execution state.

This separation allows the harness to support automated orchestration while maintaining human governance.