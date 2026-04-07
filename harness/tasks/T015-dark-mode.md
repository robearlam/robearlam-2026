# Task T015 — Dark Mode Support

Status: Ready  
Backlog Item: B018  
Created: 2026-04-02

---

## Summary

Add site-wide dark mode support. The site defaults to the user's OS colour scheme preference (`prefers-color-scheme`) on first visit. A toggle in the header allows users to override this, and their choice is persisted to `localStorage` so it is restored on return visits without a flash of the wrong theme.

The dark mode colour palette must be derived from the existing design system. All pages and components must support both modes consistently.

---

## Related Artifacts

Feature Specification: `harness/artifacts/specs/T015-feature-spec.md`  
Design Note: `harness/artifacts/design/T015-design-note.md`  
Implementation Plan: `harness/artifacts/plans/T015-implementation-plan.md`  
QA Review: `harness/artifacts/qa/T015-qa-review.md`  
Run Report: `harness/runs/{{RUN_ID}}.md`

---

## Acceptance Criteria

### Theme Toggle

- A dark/light mode toggle is present in the site header on all pages
- The toggle clearly communicates the current mode (e.g. sun/moon icon)
- The toggle has a minimum 44×44px tap target for mobile usability
- The toggle is keyboard accessible with a visible focus state
- The toggle does not disrupt existing header layout or navigation on any breakpoint
- On mobile, the toggle integrates cleanly with the mobile nav layout

### Theme Behaviour

- On first visit, the site defaults to the user's OS `prefers-color-scheme` setting (light or dark)
- The user's manual toggle choice is saved to `localStorage` under a consistent key
- On return visits, the saved preference is applied before the page paints — no flash of the wrong theme (FOUC)
- If no preference is stored in `localStorage`, the site falls back to the system setting
- Switching mode via the toggle takes effect immediately without a page reload

### Visual Design

- Dark mode palette is derived from the existing design system neutral palette:
  - deep neutral background (not pure black)
  - light primary text with sufficient contrast
  - adjusted secondary text and border values
- The brand colour (`#7A1C1C`) remains recognisable in dark mode, adjusted if necessary to maintain contrast
- All text in both modes meets WCAG AA contrast ratio (4.5:1 for body text, 3:1 for large text)
- All existing pages and components support dark mode — no components left with hardcoded light-only colours
- Images and media are not inverted; only structural UI colours switch
- Code blocks, tags, and metadata elements are appropriately styled in both modes
- The design system document is updated to document the dark mode colour palette

### Technical Constraints

- Tailwind CSS `darkMode: 'class'` strategy is used
- The theme class is applied to the `<html>` element
- The theme is applied synchronously before render to prevent FOUC (inline script in `<head>` or equivalent Next.js approach)
- The toggle is a client component; no server components are converted to client components solely for this feature
- No hardcoded colour values in components — all colours use Tailwind dark variant classes or CSS custom properties
- TypeScript strict mode is observed; no use of `any`

### Accessibility

- Toggle has a descriptive `aria-label` that reflects the current mode (e.g. "Switch to dark mode")
- Colour is not the sole indicator of the active mode — icon or label is also present
- Focus states are visible and correct in both light and dark modes
- Heading hierarchy and reading flow are unaffected by the theme change

---

## Task Notes

- The existing design system (`harness/design-system/design-system.md`) defines the light mode palette; the feature design agent should propose the corresponding dark palette as part of the design note
- The toggle should sit alongside the existing nav items in the header — inspect the current header component before designing its placement
- Next.js App Router projects require careful handling of the initial theme script to avoid FOUC; the implementation plan should address this explicitly
- The backlog contains a duplicate B017 entry (the first is "Blog support for Mermaid Diagrams", which is Done). This task corresponds to the second B017 — Dark Mode Support. The backlog should be corrected to B018 at the next tidy-up.

---

## Approval

Reviewer:  
Decision: Pending  
Notes:
