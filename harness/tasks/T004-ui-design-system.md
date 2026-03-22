# Task T004 — Editorial UI System Refactor from Design Reference

Status: Ready  
Backlog Item: T004  
Created: 2026-03-22

---

## Summary

Refactor the production site UI to align with the editorial design system using the reference implementation in `/tmp-design-reference`.

The task focuses on improving layout, spacing, typography, and component consistency while preserving the existing application architecture, routing, and data logic.

The reference implementation is used strictly as a visual and structural guide and must not be copied directly into production.

---

## Related Artifacts

Feature Specification: `harness/artifacts/specs/T004-feature-spec.md`  
Design Note: `harness/artifacts/design/T004-design-note.md`  
Implementation Plan: `harness/artifacts/plans/T004-implementation-plan.md`  
QA Review: `harness/artifacts/qa/T004-qa-review.md`  
Run Report: `harness/runs/RUN-2026-03-22-T004.md`

---

## Acceptance Criteria

- The global layout reflects the editorial design system defined in `Design-System.md`
- The main content container uses a narrower, readable width (`max-w-3xl` to `max-w-4xl`)
- A new header is implemented with simple desktop navigation and a working collapsible mobile menu
- The footer is simplified and aligned with the editorial visual tone
- A reusable editorial component layer is introduced (header, footer, section wrapper, hero, content blocks)
- The homepage is redesigned using structured editorial sections and real content
- The blog page retains existing data logic but uses an improved editorial presentation
- The contact page is simplified and does not include fake or demo submission behaviour
- Spacing and typography are consistent across all pages
- Existing routing, blog logic, API behaviour, and tests remain unchanged
- No unnecessary dependencies or large UI libraries are introduced
- No files or components are copied directly from `/tmp-design-reference`
- The UI is cohesive and consistent across all routes

---

## Task Notes

- `/tmp-design-reference` contains a generated UI implementation and must be treated as **read-only reference material**
- The implementation approach is:
  - extract design patterns  
  - translate into production-ready components  
  - refactor existing UI to align with the system  

- The task must prioritise:
  - readability  
  - consistency  
  - minimalism  
  - reuse of components  

- If a pattern exists in both the current codebase and the reference:
  - preserve the production structure  
  - update styling and layout to match the editorial system  

- Avoid:
  - copying generated UI code  
  - introducing unnecessary complexity  
  - expanding scope beyond UI concerns  

- The `/tmp-design-reference` folder will be removed after completion and must not be relied on at runtime

---

## Approval

Reviewer:  
Decision: Pending  
Notes: