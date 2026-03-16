# Harness Overview

## Purpose
This harness defines the workflow, standards, roles, templates, and logging requirements used to develop the personal site through structured AI-assisted feature delivery.

## Objectives
- Deliver features in small, testable slices
- Maintain long-term stability through tests
- Improve repeatability of AI-assisted development
- Make agent work observable and debuggable
- Preserve human approval at key checkpoints

## Core Principles
- Small scoped feature delivery
- Explicit specs before implementation
- Design considered before build
- TDD for logic, pragmatic testing for UI
- All meaningful runs logged
- No big-bang implementation
- Human remains final approver

## Feature Lifecycle
1. Feature request created
2. Spec generated
3. Design note generated
4. Task plan created
5. Build executed
6. Tests run
7. QA review completed
8. Run logged
9. Merge only after all gates pass

## Folder Guide
...