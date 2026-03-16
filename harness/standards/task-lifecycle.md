# Task Lifecycle Standard

## Purpose

This document defines how tasks move through the harness workflow.

The goal is to ensure that task execution is:

- sequential
- controlled
- observable
- repeatable

Only one task may be active at a time.

This standard prevents parallel work streams and ensures that each task is completed and validated before the next task begins.

---

## Core Principles

### Sequential Execution

Tasks must be executed one at a time.

The harness does not support parallel task execution.

Only one task may be in an active execution state at any time.

---

### Controlled State Transitions

Tasks must move through a defined set of states in order.

Tasks may not skip required lifecycle stages.

---

### Completion Before Progression

A task must pass validation before the next task begins.

Incomplete or failed work must be resolved before the harness proceeds to the next task.

---

## Task States

The following states are used by the harness.

### Planned

The task exists conceptually but has not yet been selected for execution.

This state usually exists in the backlog rather than as an active task file.

---

### Ready

The task has been selected for upcoming work and is ready to enter the harness workflow.

A task in this state is eligible to become the next active task.

---

### In Progress

The task is currently moving through the harness workflow.

This includes:

- feature specification
- feature design
- implementation planning
- build execution

Only one task may be in this state at any time.

---

### QA Review

The task has been implemented and is under validation.

The QA Agent is reviewing the output against the specification, design note, and implementation plan.

Only one task may be in this state at any time.

A task in QA Review is still considered the active task.

---

### Blocked

The task cannot continue because of an unresolved issue.

Examples:

- missing information
- unresolved design conflict
- technical blocker
- failed acceptance criteria requiring clarification

A blocked task must be resolved before any new task begins.

---

### Complete

The task has passed QA validation and all required outputs have been recorded.

A complete task is finished and no longer active.

---

## Allowed State Transitions

Tasks must move through the following transitions:

Planned → Ready  
Ready → In Progress  
In Progress → QA Review  
QA Review → Complete

If issues are found, the following transitions are also allowed:

In Progress → Blocked  
QA Review → Blocked  
Blocked → In Progress

No other transitions should be used without explicitly updating this standard.

---

## Single Active Task Rule

The harness supports only one active task at a time.

An active task is any task in one of the following states:

- In Progress
- QA Review
- Blocked

If any task exists in an active state, no other task may move into In Progress.

This rule ensures:

- no parallel work streams
- simpler debugging
- reduced merge conflict risk
- clearer run logs

---

## Task Selection Rule

When no task is active, the harness should select the next task from the Ready state.

Selection should follow task ID order.

Example:

- T001
- T002
- T003

The lowest numbered Ready task should be selected first unless a deliberate exception is recorded.

This creates predictable execution order.

---

## Completion Rule

A task may only move to Complete when all of the following are true:

- the feature specification exists
- the design note exists where required
- the implementation plan exists
- implementation is complete
- required tests exist
- QA review has passed
- run logs or reports have been recorded

A task is not complete just because code was written.

---

## Blocked Task Rule

If a task becomes Blocked, the harness must stop progressing to new tasks.

Blocked work must be resolved before the next Ready task may begin.

This prevents unresolved issues from being hidden by continued forward progress.

---

## Relationship to Backlog

Backlog items represent candidate work.

A backlog item becomes an active task only when it is moved into the task system and marked Ready.

The backlog is not the execution system.

Tasks are the execution system.

---

## Relationship to QA

A task is not considered complete until the QA Agent has validated that:

- acceptance criteria are satisfied
- the implementation matches the design intent
- the implementation matches the task plan
- required tests are present and meaningful

QA is mandatory for task completion.

---

## Anti-Patterns

The following behaviours are not allowed:

- running multiple tasks in parallel
- starting a new task while another is Blocked
- marking a task Complete before QA
- skipping directly from Ready to Complete
- continuing to new work when the current task is unresolved

---

## Summary

The harness executes work as a sequence of validated task slices.

The rule is:

1. Select one Ready task
2. Move it to In Progress
3. Complete implementation
4. Move it to QA Review
5. Resolve any issues
6. Mark it Complete
7. Only then begin the next task