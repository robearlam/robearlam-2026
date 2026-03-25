# Task T009 — Videos Page

Status: Ready  
Backlog Item: B012  
Created: 2026-03-25

---

## Summary

Create a new videos listing page that showcases YouTube videos in a clear editorial layout, using the generated v0 output in `/tmp-v0-outputwithvideo` as the styling and component reference.

The page will be available at `/videos` and will present video content sourced from Markdown files stored by year. Videos are sorted by date descending so the newest video appears first. The latest video is displayed in a larger featured treatment at the top of the page, with the remaining videos displayed beneath it in a responsive grid layout.

Each video entry displays its embedded YouTube player, title, and publication date. The implementation should follow the same content-driven patterns already used elsewhere in the site so new videos can be added by creating a Markdown file in the correct year folder without needing code changes.

---

## Related Artifacts

Feature Specification: `harness/artifacts/specs/T009-feature-spec.md`  
Design Note: `harness/artifacts/design/T009-design-note.md`  
Implementation Plan: `harness/artifacts/plans/T009-implementation-plan.md`  
QA Review: `harness/artifacts/qa/T009-qa-review.md`  
Run Report: `harness/runs/{{RUN_ID}}.md`

---

## Acceptance Criteria

**Routing & Page Structure**
- A new page is available at route `/videos`
- The page presents a list of YouTube videos sorted by date in descending order (newest first)
- The newest video is rendered in a larger featured layout at the top of the page
- All remaining videos are rendered below the featured video in a responsive grid layout
- Each video displays its title and date
- If only one video exists, the page displays only the featured video block and no empty grid section
- If no videos exist, the page shows an appropriate empty state message

**Data Source & Content Model**
- Video source files are stored as Markdown files under `src/data/videos/YEAR/*.md`, where `YEAR` is a four-digit calendar year directory
- Video files use front matter to define the required data fields
- The required front matter fields are:
  - `title`: the video title
  - `videoId`: the YouTube video identifier used to generate the embed URL
  - `date`: the publication date in `YYYY-MM-DD` format
- The specification may define additional optional fields if they are useful, but the task requires at minimum title, videoId, and date
- Markdown body content is optional and should not be required for the listing page to function
- New video files added to the correct directory structure are automatically discovered and included without manual registration

**Sorting & Presentation**
- All videos are loaded into a unified collection across year folders and sorted by date descending before rendering
- The first item in the sorted list is treated as the featured video
- The featured video uses a visually larger presentation than the videos in the grid below
- Grid items use a smaller but visually consistent card treatment aligned with the v0 reference implementation
- Dates are rendered in a human-readable format on the page

**Styling & Component Guidance**
- The page styling and component treatment should follow the generated v0 reference in `/tmp-v0-outputwithvideo/app/videos/page.tsx` and related video components
- The featured video and non-featured video cards should reflect the same hierarchy shown in the v0 output
- The responsive grid below the featured video should match the intent of the v0 layout across mobile, tablet, and desktop breakpoints
- The final implementation must fit within the existing real project design system rather than copying temporary demo code verbatim where it conflicts with established patterns

**Accessibility & UX**
- Embedded video frames include meaningful titles derived from the video title
- The page remains usable and readable across mobile and desktop viewports
- Focus, keyboard navigation, and link behaviour remain consistent with the rest of the site
- Any empty state messaging is clear and accessible

**Architecture & Implementation Constraints**
- Data loading should follow the project’s existing file-based content patterns rather than introducing hardcoded arrays
- Front matter parsing should reuse established content-loading utilities or library patterns already used by the project where practical
- The implementation should use reusable video-related components instead of placing all rendering logic directly in the route file
- The solution should use static generation patterns where appropriate for content that is file-backed and known at build time

---

## Task Notes

**Reference Implementation**
- Use `/tmp-v0-outputwithvideo/app/videos/page.tsx` as the layout reference for the overall page structure
- Use `/tmp-v0-outputwithvideo/components/editorial/video-card.tsx` as the reference for the featured and standard video card visual treatment
- The v0 code is guidance for design intent and component behaviour, not a requirement to duplicate its temporary file structure exactly

**Content Structure**
- Canonical content location for this feature is `src/data/videos/YEAR/*.md` as requested for this task
- The feature specification should document the exact front matter schema and provide example files
- The year directory should be derived from organization needs rather than inferred from route params, since the page itself is a single listing page
- Filename conventions should be documented in the specification so new videos can be added consistently

**Component Architecture**
- The implementation should likely include reusable components for:
  - a featured video card
  - a standard video card
  - a videos grid/list section
  - an empty state for when no videos are available
- The page component should be responsible primarily for composition and passing prepared data into presentational components
- If the implementation chooses to use a single configurable card component for both featured and standard variants, that is acceptable provided the code remains clear

**Data Loading**
- Load all Markdown files from all year folders under `src/data/videos`
- Parse front matter into a typed video model
- Normalize and sort the videos centrally in the data layer before rendering
- The implementation should validate or safely handle malformed dates or missing required fields in a predictable way, as defined in the specification

**Out of Scope**
- Individual video detail pages
- Video categories, filtering, or search
- Pagination or infinite scroll
- Pulling data directly from the YouTube API
- Auto-generating metadata from YouTube at runtime

---

## Approval

Reviewer:  
Decision: Pending  
Notes: