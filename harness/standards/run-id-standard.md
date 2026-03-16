# Run ID Standard

## Purpose

This document defines how run IDs should be named across the harness.

The goal is to make every generated artifact traceable to:

- the task it belongs to
- the date it was generated
- the workflow stage that produced it

Run IDs should be consistent, predictable, and easy to scan.

---

## Standard Format

Run IDs should use this format:

`RUN-YYYY-MM-DD-TASKID-STAGE`

Example:

`RUN-2026-03-16-T001-SPEC`

---

## Components

### Prefix

Always use:

`RUN`

---

### Date

Use the generation date in ISO format:

`YYYY-MM-DD`

Example:

`2026-03-16`

---

### Task ID

Use the harness task ID exactly as defined in the task file.

Example:

`T001`

---

### Stage

Use one of the following stage codes:

- `SPEC` — Feature Specification
- `DESIGN` — Design Note
- `PLAN` — Implementation Plan
- `BUILD` — Build / implementation summary if used as a standalone artifact
- `QA` — QA Review

---

## Examples

Feature specification for T001:

`RUN-2026-03-16-T001-SPEC`

Design note for T001:

`RUN-2026-03-16-T001-DESIGN`

Implementation plan for T001:

`RUN-2026-03-16-T001-PLAN`

QA review for T001:

`RUN-2026-03-16-T001-QA`

---

## Rules

- Each artifact should use the stage code that matches the artifact type.
- A spec artifact must not use a design, plan, build, or QA stage code.
- A plan artifact must not reuse a spec stage code.
- If an artifact is regenerated, the same stage code should still be used unless the harness introduces explicit rerun numbering later.

---

## Summary

Run IDs exist to make artifact provenance clear.

The stage code must always match the artifact type being generated.