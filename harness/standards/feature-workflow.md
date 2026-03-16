# Feature Workflow Standard

## Purpose

This document defines the end-to-end workflow used to implement features within the harness.

The workflow ensures that features are:

- clearly specified
- intentionally designed
- technically planned
- implemented according to standards
- validated through QA
- approved by a human reviewer

This process enables reliable and repeatable development using AI agents while maintaining human oversight.

---

## Core Principles

### Small Feature Slices

Work should be broken into small, clearly defined feature slices.

Each task should represent a focused piece of work that can move through the workflow safely and independently.

Large features should be decomposed into smaller tasks whenever possible.

---

### Implementation Slice Planning

Within a task, implementation planning must prefer small, reviewable slices over large monolithic build plans.

Implementation plans should break work into bounded increments that:

- can be understood easily
- reduce implementation risk
- support incremental validation
- make debugging easier if problems arise

A task may remain a single harness task while still being implemented through multiple internal slices.

Implementation slices should avoid bundling unrelated changes together.

---

### Explicit Design and Planning

Features must pass through specification, design, and implementation planning before code is written.

This prevents implementation agents from making product or architectural decisions that should have been made earlier in the workflow.

---

### Human-Guided Development

The harness is designed to assist human developers, not replace them.

AI agents may produce:

- feature specifications
- design notes
- implementation plans
- code changes
- QA reviews

However, a human reviewer remains responsible for approving completed work before it is considered finished.

---

### Governance State Is Human-Controlled

Workflow governance is controlled by the human reviewer.

Governance files include:

- `harness/active-task.md`
- files under `harness/tasks/`
- files under `harness/backlog/`
- files under `harness/standards/`
- files under `harness/roles/`
- files under `harness/templates/`

Agents may read these files when required by the workflow, but they must not modify them unless the human reviewer explicitly requests a harness change.

Implementation agents are responsible for application code, tests, and generated artifacts — not workflow state management.

---

### Controlled Build Validation Loop

The Build Agent may use a controlled validation loop during implementation.

This loop allows the Build Agent to:

- run approved validation commands
- inspect failures
- apply bounded implementation fixes
- rerun validation

The purpose of this loop is to resolve obvious in-scope implementation issues without requiring a separate human prompt for each failure.

The validation loop must remain controlled:

- only approved commands may be run
- only failures related to the active task may be fixed
- retries must be limited
- workflow governance files must never be modified
- the Build Agent must stop and escalate if validation still fails after the retry limit or if a failure implies broader scope

This loop improves efficiency without turning the harness into an uncontrolled autonomous system.

---

## Workflow Stages

Every task moves through the following stages:

### 1. Feature Specification

The PO / Spec Agent creates a feature specification.

This defines:

- feature goal
- user value
- scope
- acceptance criteria

The specification clarifies what must be built before design begins.

---

### Acceptance Criteria Standard

Acceptance criteria must be written so they can be clearly validated by a human reviewer or QA agent.

Good acceptance criteria should be:

- specific
- observable
- bounded
- testable

Acceptance criteria should avoid vague or subjective wording unless the judgment criteria are explicitly defined.

Prefer statements that describe visible or verifiable outcomes.

Examples of stronger acceptance criteria:

- A shared root layout wraps all pages under the main app route tree.
- Header navigation is visible on all pages using the shared layout.
- The layout uses the standard centered content container defined by the design system.

Examples of weaker acceptance criteria:

- The layout feels consistent.
- The page looks professional.
- Spacing is good.

If design system compliance is required, the criterion should reference the specific design rule or reusable pattern being followed.

---

### 2. Feature Design

The Feature Design Agent produces a design note.

This describes:

- layout structure
- section hierarchy
- component usage
- responsive behaviour

The design must follow the rules defined in the design system.

---

### 3. Implementation Planning

The Tech Lead Agent creates an implementation plan.

This plan defines:

- technical approach
- files or directories affected
- implementation steps
- required tests
- risks and assumptions

Implementation planning must use small implementation slices where possible.

The goal is to remove architectural ambiguity before implementation begins.

---

### 4. Implementation

The Build Agent implements the feature.

This includes:

- creating or modifying application code
- adding required tests
- following coding standards
- documenting implementation decisions
- using the controlled build validation loop when appropriate

The Build Agent must not modify workflow governance files or lifecycle state unless the human reviewer explicitly requests a harness change.

The implementation must follow the approved implementation plan.

---

### 5. QA Validation

The QA Agent validates the completed implementation.

The QA review checks:

- acceptance criteria
- alignment with the design note
- adherence to implementation plan
- presence of meaningful tests

Any issues discovered must be documented and resolved.

---

### 6. Human Approval

After QA validation passes, the task enters Awaiting Approval.

At this stage, a human reviewer must review the result and decide whether the task is complete.

The reviewer may:

- approve the task
- request revisions
- return the task to Blocked or In Progress

No task may be marked complete without human approval.

---

## Human Approval Requirement

This harness is human-guided.

AI agents assist with development, but they do not have authority to approve completion independently.

Human approval is required at the following points:

- after QA review, before the task is marked Complete
- before the next Ready task is allowed to move into In Progress

The harness must not continue automatically from one completed task to the next without explicit human approval.

---

## Sequential Execution Rule

Tasks must be executed sequentially.

Only one task may be active at a time.

A task is considered active when its status is:

- In Progress
- QA Review
- Awaiting Approval
- Blocked

A new task may not begin until the current task has been completed and approved.

This rule prevents:

- parallel work streams
- conflicting code changes
- context fragmentation between agents

---

## Expected Outputs

Each task should produce the following artifacts:

- feature specification
- design note
- implementation plan
- implementation summary
- QA review
- harness run report

Artifacts should be stored in the appropriate typed artifact directory under `harness/artifacts/`:

- `specs/`
- `design/`
- `plans/`
- `qa/`

These documents provide traceability and make the development process easier to review.

---

## Summary

The harness workflow ensures that every feature is built through a controlled sequence of steps:

Specification  
→ Design  
→ Implementation Plan  
→ Build  
→ QA Validation  
→ Human Approval

Only after human approval may the task be considered complete and the next task begin.