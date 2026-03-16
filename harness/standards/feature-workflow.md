# Feature Workflow Standard

## Purpose

This document defines the mandatory workflow used to deliver all new features in this repository.

The goal is to ensure development is:

- incremental
- testable
- observable
- repeatable

Features must be delivered in **small vertical slices**, not large multi-feature implementations.

---

## Core Principles

1. Features must be delivered incrementally.
2. Every feature must have explicit acceptance criteria.
3. Implementation must follow an approved task plan.
4. Tests must validate critical behavior.
5. All meaningful runs must be logged.
6. Features must be reviewable before merge.

---

## Feature Lifecycle

Every feature must pass through the following stages.

### Stage 1 — Feature Request

A new feature begins with a short request describing the desired outcome.

Example:

The request should focus on **user-visible outcomes**, not implementation details.

---

### Stage 2 — Feature Specification

The request is converted into a structured feature specification.

The specification defines:

- feature goal
- user value
- scope
- out-of-scope
- acceptance criteria
- risks

This prevents ambiguous implementations.

---

### Stage 3 — Design Note

If the feature affects UI or content structure, a design note must be created.

The design note defines:

- page structure
- section hierarchy
- component choices
- responsive considerations
- accessibility considerations

---

### Stage 4 — Task Plan

The feature specification and design note are translated into a technical implementation plan.

The task plan defines:

- files to create or modify
- implementation steps
- testing strategy
- potential risks

---

### Stage 5 — Implementation

The build agent implements the approved task plan.

Implementation must:

- follow coding standards
- remain within defined scope
- include required tests

---

### Stage 6 — Validation

Before a feature can be considered complete:

- lint must pass
- type checking must pass
- automated tests must pass

---

### Stage 7 — QA Review

A QA review confirms:

- acceptance criteria are satisfied
- tests adequately cover the feature
- no unintended regressions are introduced

---

### Stage 8 — Run Logging

Every meaningful feature implementation must produce:

- a machine-readable run log
- a human-readable run summary

These records enable debugging and learning from previous runs.

---

### Stage 9 — Merge

A feature may only be merged when:

- all acceptance criteria are satisfied
- required tests exist and pass
- QA review passes
- run logs are recorded

---

## Anti-Patterns

The following behaviors are explicitly discouraged:

- implementing features directly from vague prompts
- combining unrelated work into a single task
- skipping tests for domain logic
- declaring work complete without acceptance validation
- merging code without run logs

---

## Definition of Completion

A feature is considered complete when:

- acceptance criteria are satisfied
- implementation matches the task plan
- tests pass
- QA review confirms correctness
- run logs are stored in the repository

---

## Sequential Execution Rule

The harness executes work sequentially.
Only one task may be in the **In Progress** state at any time.
A new task may only begin once the current task has passed QA validation and been marked **Complete**.
This prevents parallel work streams and ensures that each feature slice is completed and verified before the next begins.