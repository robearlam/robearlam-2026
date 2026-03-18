# Task T002 — Contact Page v1

## Task Metadata

Task ID: T002  
Title: Contact Page v1  
Type: Feature  
Priority: Normal  
Depends On: T001

---

## Summary

Create an initial contact page for the personal site that inherits the shared global shell from T001 and provides a clear, simple way for visitors to find contact details and external profile links.

This first version should be a static page only.

It should not include a contact form, backend integration, submission handling, or validation workflows.

---

## User Value

Visitors should be able to quickly understand how to contact the site owner and find key external profile links without unnecessary friction.

The page should feel consistent with the rest of the site, easy to scan, and usable across desktop and mobile devices.

---

## In Scope

- a contact page under the shared global site shell
- page title
- short introduction text
- one or more contact methods
- external/social profile links
- responsive layout aligned with the design system
- social profile links with recognizable icons for:
  - BlueSky - https://bsky.app/profile/robearlam.com
  - Mastodon - https://mastodon.social/@RobEarlam
  - GitHub - https://github.com/robearlam
  - LinkedIn - https://www.linkedin.com/in/rob-earlam/
  - YouTube - https://www.youtube.com/playlist?list=PLmTNwpFzRErCW5ibZAkSO8HFSW0Rkiplj
  - Dev.to - https://dev.to/robearlam

---

## Out Of Scope

The following are explicitly out of scope for this task:

- contact form submission
- backend or API integration
- spam prevention
- CAPTCHA
- client-side validation logic
- analytics instrumentation
- advanced profile cards or rich interaction components

---

## Initial Acceptance Intent

The final specification should refine this, but the intended outcome is:

- a contact page exists under the shared site shell
- the page clearly presents contact methods and external links
- the page is readable and responsive
- the page aligns with the design system
- no contact form or submission behavior is introduced
- the page includes social links with recognizable icons for BlueSky, Mastodon, GitHub, LinkedIn, YouTube, and Dev.to

---

## Dependencies

This task depends on:

- T001 — Global Site Layout being completed and available
- the shared design system defined in `harness/design-system/design-system.md`
- the workflow standards and templates in the harness

---

## Artifact Paths

Feature Specification: `harness/artifacts/specs/T002-feature-spec.md`  
Design Note: `harness/artifacts/design/T002-design-note.md`  
Implementation Plan: `harness/artifacts/plans/T002-implementation-plan.md`  
QA Review: `harness/artifacts/qa/T002-qa-review.md`  
Run Report: `harness/runs/RUN-2026-03-16-T002.md`

---

## Approval

Reviewer:  
Decision: Pending  
Notes:

---

## Stable Notes

This task is intended as the first orchestration test after T001.

It should be small enough to validate the orchestration flow end-to-end without requiring complex implementation decisions.

The feature intentionally excludes a contact form so the orchestration pipeline can be tested using a simple static page.