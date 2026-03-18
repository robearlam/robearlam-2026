# Run State Standard

## Purpose

This document defines how the harness tracks the live execution state of a task run.

The goal of run state is to provide a single, structured source of truth for:

- the currently executing task
- the current workflow stage
- the current run ID
- stage completion progress
- artifact locations
- approval requirements
- stop conditions

Run state exists to reduce manual coordination between agents while preserving human governance.

---

## Core Principles

### Single Source Of Live Execution State

The file `harness/run-state.md` is the authoritative live execution-state record for the currently active task run.

It should describe:

- which task is running
- which stage is active
- which stages are complete
- which artifacts have been produced
- whether approval is required before continuing
- whether execution is paused, blocked, or complete

If any other file contains overlapping state, `harness/run-state.md` takes precedence.

---

### No Separate Active Task File

The harness does not use a separate `active-task.md` file.

The active task is defined by `harness/run-state.md`.

This avoids duplication between:

- active task tracking
- current stage tracking
- current run ID tracking
- stop or approval state

All live task execution state should be read from `harness/run-state.md`.

---

### Task Files Are Durable Definitions

Files under `harness/tasks/` define the durable task record.

A task file should contain stable task information such as:

- task ID
- title
- summary
- related artifact paths
- approval section
- stable notes

Task files may include a human-readable status field if desired, but they are not the authoritative source of live execution state.

The orchestrator should not rely on task files as the primary source for current stage or active run state.

---

### Human Governance Still Applies

Automating run state does not remove human governance.

Run state may be updated automatically by the orchestrator, but approval-controlled transitions must still respect harness rules.

Examples:

- a task must not move to Complete without human approval
- the next task must not begin automatically if approval is required
- governance-controlled standards and roles remain human-managed

---

### Stage-Based Progress Tracking

Run state must track the workflow as a sequence of stages.

Expected stages are:

- Specification
- Design
- Implementation Planning
- Build
- QA
- Awaiting Approval
- Complete

The run state should show:

- current stage
- completed stages
- current run ID
- whether the stage succeeded, is blocked, or is awaiting approval

---

### Artifact Traceability

Run state should track the canonical artifact paths for the active task.

This allows downstream agents to discover prior outputs without depending on chat context.

Expected artifact categories include:

- feature specification
- design note
- implementation plan
- QA review
- run report

---

### Orchestrator-Owned Updates

Workflow execution state should be updated by the orchestrator, not by stage agents directly.

Stage agents should:

- read run state
- produce outputs
- report results

The orchestrator should:

- update current stage
- mark stages complete
- set the next stage
- record run IDs
- record artifact paths
- stop when approval is required

This keeps workflow control centralized and predictable.

---

## Required Run State Fields

The run-state file should track at least:

- Task ID
- Task File
- Current Status
- Current Stage
- Current Run ID
- Completed Stages
- Artifact Paths
- Approval Mode
- Stop Reason
- Notes

These fields must be structured clearly enough for both humans and agents to read reliably.

---

## Relationship To Task Lifecycle

The run-state file does not replace the task lifecycle standard.

Instead, it applies the lifecycle standard to the currently executing task.

Examples:

- a task in Build should still be lifecycle-valid under `task-lifecycle.md`
- a task must still move to QA Review before formal QA
- a task must still move to Awaiting Approval before completion if human approval is required

Run state is an execution-state mechanism, not a replacement for lifecycle rules.

---

## Relationship To Run IDs

Every stage execution should have a stage-appropriate run ID following:

`RUN-YYYY-MM-DD-TASKID-STAGE`

Examples:

- `RUN-2026-03-16-T002-SPEC`
- `RUN-2026-03-16-T002-DESIGN`
- `RUN-2026-03-16-T002-PLAN`
- `RUN-2026-03-16-T002-BUILD`
- `RUN-2026-03-16-T002-QA`

The current stage run ID should be stored in run state.

---

## Approval Modes

Run state should support explicit approval requirements.

Suggested fields include:

- Require Approval Before Build
- Require Approval Before Complete

This allows the harness to become more autonomous over time without losing control.

The orchestrator must stop automatically when a configured approval gate is reached.

---

## Stop Conditions

The orchestrator must stop updating execution state automatically when:

- approval is required
- a stage fails or becomes blocked
- required artifact generation fails
- lifecycle rules prevent progression
- the active task is unclear

When this happens, run state should clearly indicate the stop reason.

---

## Summary

`harness/run-state.md` is the authoritative live execution-state record for the currently active task.

Task files are durable task definitions, not the primary source of live workflow state.

The harness does not use a separate `active-task.md` file.

This model reduces duplication, prevents state drift, and provides a clean foundation for orchestration.