# Task Lifecycle Standard

## Purpose

This document defines how tasks move through the harness workflow.

The goal is to ensure that task execution is:

- sequential
- controlled
- observable
- repeatable

Only one task may be active at a time.

This standard prevents parallel work streams and ensures that each task is completed, validated, and approved before the next task begins.

---

## Core Principles

### Sequential Execution

Tasks must be executed one at a time.

The harness does not support parallel task execution.

Only one task may be active within the lifecycle at any time.

---

### Controlled State Transitions

Tasks must move through a defined set of states in order.

Tasks may not skip required lifecycle stages.

---

### Completion Before Progression

A task must pass validation and receive human approval before the harness proceeds to the next task.

Incomplete or failed work must be resolved before moving forward.

---

## Task States

The following states define the lifecycle of a task.

---

### Planned

The task exists conceptually but has not yet been selected for execution.

This state typically exists in the backlog rather than in the tasks directory.

---

### Ready

The task has been selected for upcoming work and is ready to enter the harness workflow.

Tasks in this state are candidates to become the next active task.

---

### In Progress

The task is currently being executed.

This includes the following workflow stages:

- feature specification
- feature design
- implementation planning
- implementation

Only one task may be in this state at a time.

---

### QA Review

The feature implementation is complete and is undergoing validation.

The QA Agent reviews the implementation against:

- the feature specification
- the design note
- the implementation plan
- the acceptance criteria

A task in QA Review is still considered active.

---

### Awaiting Approval

The task has passed QA validation and is waiting for human review.

In this state, the harness must pause until a human reviewer decides whether the task should be approved.

Possible outcomes:

- approval → move to Complete
- revision required → return to In Progress
- unresolved issue → move to Blocked

A task in Awaiting Approval is still considered active.

---

### Blocked

The task cannot proceed because an issue has been identified.

Examples include:

- missing information
- design conflicts
- technical constraints
- failed acceptance criteria
- human rejection during review

Blocked tasks must be resolved before the harness can continue.

---

### Complete

The task has passed QA validation and received human approval.

The task is finished and no longer active.

Only after a task reaches Complete may the harness begin the next Ready task.

---

## Allowed State Transitions

Tasks must move through the following transitions:

Planned → Ready  
Ready → In Progress  
In Progress → QA Review  
QA Review → Awaiting Approval  
Awaiting Approval → Complete

If issues are discovered, the following transitions are also allowed:

In Progress → Blocked  
QA Review → Blocked  
Awaiting Approval → Blocked  
Blocked → In Progress

No other transitions should occur without updating this standard.

---

## Single Active Task Rule

The harness supports only one active task at a time.

A task is considered active if it is in one of the following states:

- In Progress
- QA Review
- Awaiting Approval
- Blocked

If any task exists in an active state, no other task may move into In Progress.

This ensures:

- no parallel work streams
- simpler debugging
- reduced merge conflicts
- clearer run logs

---

## Task Selection Rule

When no task is active, the harness should select the next task from the Ready state.

Tasks should be selected in **task ID order**.

Example ordering:

T001  
T002  
T003

The lowest numbered Ready task should be selected first unless a deliberate exception is recorded.

---

## Human Approval Rule

The harness is not fully autonomous.

After QA validation passes, the task must move to **Awaiting Approval**.

At this stage a human reviewer must decide whether the work is acceptable.

Possible reviewer actions include:

- approving the task
- requesting revisions
- rejecting the work and returning the task to Blocked or In Progress

No task may move from Awaiting Approval to Complete without explicit human approval.

---

## Completion Rule

A task may only move to Complete when all of the following are true:

- the feature specification exists
- the design note exists where required
- the implementation plan exists
- implementation is complete
- required tests exist
- QA validation has passed
- human approval has been granted
- run logs or reports have been recorded

Code alone does not qualify a task as complete.

---

## Blocked Task Rule

If a task becomes Blocked, the harness must stop progressing to new tasks.

Blocked work must be resolved before the next Ready task may begin.

This prevents unresolved issues from being hidden by continued forward progress.

---

## Relationship to Backlog

Backlog items represent potential future work.

A backlog item becomes an active task only when it is moved into the task system and marked Ready.

The backlog is not the execution system.

Tasks are the execution system.

---

## Lifecycle Confirmation Requirement

Artifacts generated during active task execution should include a short lifecycle confirmation when relevant.

The purpose of lifecycle confirmation is to show that the agent has verified:

- the current task status
- that the task is the single active or next valid task
- that execution is allowed under the task lifecycle rules

Lifecycle confirmation should be brief and structured.

It should not become a long narrative section.

Preferred content includes:

- active task ID
- current task status
- confirmation that no conflicting active task exists
- confirmation that the task is valid to proceed

This check is especially useful in planning-stage artifacts such as feature specifications and implementation plans.

---

## Summary

The harness executes work as a sequence of validated task slices.

The lifecycle for each task is:

Planned  
→ Ready  
→ In Progress  
→ QA Review  
→ Awaiting Approval  
→ Complete

Only after a task is approved and completed may the next Ready task begin.