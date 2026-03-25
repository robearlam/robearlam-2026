# Task T008 — Speaking Engagements Page

Status: Ready  
Backlog Item: B006  
Created: 2026-03-25

---

## Summary

Create a new speaking engagements page that showcases the author's public speaking history, including upcoming events and past engagements. The page provides visitors with a clear view of where and when the author is or has spoken.

Speaking engagement data is stored as lightweight markdown files (front matter only, no body content) organized by year under `src/data/speaking/YEAR/`. Engagements are presented in a user-friendly layout with:

- **Upcoming** section listing all future engagements in reverse-chronological order
- **Past** section grouping engagements by year with collapsible year groups (collapsed by default) for easy browsing of historical content
- Consistent presentation of key event details: name, session name, location, start/end dates, and optional slides and recording links

---

## Related Artifacts

Feature Specification: `harness/artifacts/specs/T008-feature-spec.md`  
Design Note: `harness/artifacts/design/T008-design-note.md`  
Implementation Plan: `harness/artifacts/plans/T008-implementation-plan.md`  
QA Review: `harness/artifacts/qa/T008-qa-review.md`  
Run Report: `harness/runs/{{RUN_ID}}.md`

---

## Acceptance Criteria

**Data Structure & Loading**
- Speaking engagement data files are located at `src/data/speaking/YEAR/*.md` where YEAR is the calendar year (e.g., `src/data/speaking/2026/`, `src/data/speaking/2025/`, etc.)
- Each engagement file contains only front matter (no markdown body content) with the following fields:
  - `name` (required): Name or identifier for the speaking event (e.g., "React Summit")
  - `sessionName` (required): Title of the session/talk (e.g., "Building Next.js Apps at Scale")
  - `location` (required): Geographic or venue location (e.g., "Amsterdam, Netherlands" or "Online")
  - `start` (required): Event start date in `YYYY-MM-DD` format
  - `end` (optional): Event end date in `YYYY-MM-DD` format (for multi-day events)
  - `slides` (optional): URL to presentation slides
  - `recording` (optional): URL to video recording
- Data files are loaded at build time and processed into a unified engagement list

**Page Layout & Sections**
- The page is accessible at route `/speaking`
- The page displays two primary sections: **Upcoming** and **Past**
- The **Upcoming** section lists all engagements with start dates in the future (relative to the current date at build/render time)
- The **Past** section lists all engagements with start dates in the past
- If either section is empty, an appropriate empty state message is displayed

**Upcoming Section**
- Engagements are sorted by start date in ascending order (earliest upcoming first)
- Each engagement displays: name, session name, location, start date, and (if provided) end date
- Optional links to slides and recording are presented prominently if available
- Clean, readable list format

**Past Section**
- Engagements are grouped by year (the year from the start date), with groups sorted by year in descending order (newest years first)
- Each year group is presented as a collapsible accordion element
- All year groups are collapsed on initial page load
- Within each year group, engagements are sorted by start date in descending order (latest first within that year)
- Each engagement displays the same information as the Upcoming section (name, session name, location, dates, optional links)
- Year groups show only the year label as the toggle (e.g., "2026", "2025") without post counts or counts of any kind

**Visual Presentation & Accessibility**
- The page layout is responsive and readable across mobile and desktop viewports
- Collapsible year groups provide clear visual indicators of expanded/collapsed state (e.g., chevron icons)
- Year group toggles are keyboard accessible and support standard interaction patterns
- Proper ARIA labels and roles are used for collapsible elements
- Links to slides and recordings are semantically marked and accessible
- The page follows the existing design system (fonts, spacing, colors, borders consistent with the site)

**Edge Cases**
- Handle the case where no upcoming engagements exist (show empty state in Upcoming section)
- Handle the case where no past engagements exist (show empty state in Past section)
- Handle the case where an engagement has an `end` date before its `start` date (specification should note this as invalid; implementation may error or ignore)
- Handle engagements with identical start dates (stable sort order by filename or order in the data list)

---

## Task Notes

**Data Loading & Processing**
- Use dynamic file discovery to read all YEAR subdirectories under `src/data/speaking/` at build time
- Parse front matter from each `.md` file using existing front matter parsing utilities (consistent with blog post handling)
- Merge all engagement data from all years into a single unified list
- Separate engagements into "Upcoming" and "Past" based on comparing each engagement's `start` date to today's date
- This task should follow the same data fetching and static generation patterns used in the blog feature for consistency

**Component Architecture**
- Create reusable components for:
  - Engagement card (displays a single engagement with all details)
  - Year collapsible group (accordion wrapper for past-year engagements)
  - Upcoming section (list heading + engagement cards)
  - Past section (list heading + year accordion groups)
  - Empty state (shown when either Upcoming or Past has no content)
- The speaking page component should compose these reusable pieces
- Consider whether expandable engagement cards are needed; the specification should clarify if all details (slides, recording) are shown inline or require card expansion

**Routing**
- The speaking page is accessible at `/speaking`
- Use Next.js App Router conventions (route file at `app/speaking/page.tsx`)
- Static generation (`generateStaticParams` or full pre-rendering) is preferred for this page, consistent with blog architecture

**Accessibility & UX**
- Collapsible year groups must support keyboard navigation (Enter/Space to toggle)
- Use `aria-expanded` to indicate collapsed/expanded state
- Use `role="region"` or `role="group"` on year sections as appropriate
- Ensure sufficient color contrast for all text and interactive elements
- Test with screen readers to ensure the structure is clear
- Consider animation/transitions for opening/closing year groups (fade, slide) but ensure `prefers-reduced-motion` is respected

**Data Schema & Examples**
- The feature specification should include:
  - Full JSON front matter schema with type definitions and field descriptions
  - Multiple example engagement files (upcoming, past, with/without optional fields)
  - Instructions for adding new engagements (file naming, location, format)
- Document the expected directory structure clearly

**Out of Scope**
- Past/featured engagement filtering or pinning (all past engagements are treated equally)
- Search or filtering of engagements by name, location, or date range
- Event feeds (RSS, iCal) — these can be added in future iterations
- Integration with external event calendars or speaker directories
- User comments or engagement interaction beyond viewing
