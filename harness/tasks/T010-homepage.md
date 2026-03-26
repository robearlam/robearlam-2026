# Task T010 — Homepage v1

Status: Ready  
Backlog Item: B003  
Created: 2026-03-26

---

## Summary

Redesign the homepage to serve as a visually engaging entry point that highlights the best content across the site. The page replaces the current placeholder layout with a proper hero section incorporating the author's profile photo, followed by curated content sections for latest blogs, latest videos, and (conditionally) upcoming speaking events.

All content is loaded at build time. The page must be a server component throughout — no client-side data fetching is required.

---

## Related Artifacts

Feature Specification: `harness/artifacts/specs/T010-feature-spec.md`  
Design Note: `harness/artifacts/design/T010-design-note.md`  
Implementation Plan: `harness/artifacts/plans/T010-implementation-plan.md`  
QA Review: `harness/artifacts/qa/T010-qa-review.md`  
Run Report: `harness/runs/{{RUN_ID}}.md`

---

## Acceptance Criteria

### Hero Section

- The hero renders the author's name (`Rob Earlam`) as the primary `<h1>` heading
- The intro/lead text is displayed alongside the heading in the hero
- The profile photo (`/img/rob.png`) is displayed in the hero, visually integrated with the heading and intro text (e.g. side-by-side two-column layout at desktop, stacked at mobile)
- The existing `HeroSection` editorial component must be extended or replaced with a homepage-specific variant that supports the photo — it must not break existing uses of `HeroSection` on other pages
- The hero layout is responsive: photo and text stack vertically on mobile, sit side-by-side on desktop
- The profile photo is rendered using Next.js `<Image>` with appropriate `alt` text, `width`, `height`, and `priority` attributes
- The hero is visually engaging: sufficient vertical padding, strong typographic hierarchy, and clean proportions

### Latest Blogs Section

- Displays the 3 most recently published blog posts, sorted by `publishDate` descending
- Blog data is fetched at build time using the existing data layer in `src/lib/blog/`
- Each post entry displays at minimum: title, publish date, and abstract
- The existing `BlogPostCard` component must be reused where possible
- A "View all posts →" link navigates to `/blog`
- Section heading is present (e.g. "Latest Writing")
- Layout is responsive: cards stack on mobile, multi-column at desktop

### Latest Videos Section

- Displays the 3 most recently added videos
- Video data is fetched at build time using the existing data layer in `src/lib/videos/`
- Each video entry displays at minimum: thumbnail, title, and publish date
- The existing `VideoCard` component must be reused where possible
- A "View all videos →" link navigates to `/videos`
- Section heading is present (e.g. "Latest Videos")
- Layout is responsive: cards stack on mobile, multi-column at desktop

### Upcoming Speaking Section

- The section is **only rendered when at least one upcoming speaking engagement exists**
- If no upcoming events exist, the section is entirely omitted from the page — no empty state, no heading
- Speaking data is fetched at build time using the existing data layer in `src/lib/speaking/`
- An event is considered "upcoming" if its `start` date is on or after the current date at build time
- Each upcoming event displays at minimum: event name, session name, location, and start date
- All upcoming events are shown (no artificial cap)
- A "View all speaking →" link navigates to `/speaking`
- Section heading is present (e.g. "Upcoming Speaking")

### Page Structure & Section Ordering

Sections must appear in the following order from top to bottom:

1. Hero (photo + name + intro)
2. Latest Blogs
3. Latest Videos
4. Upcoming Speaking (conditional)

### Visual Design

- The page must feel visually engaging and polished, not a plain list of text
- Design follows the existing design system: typography-led, content-first, visual restraint
- Clear visual separation between sections (spacing, optional dividers)
- Section headings establish clear hierarchy without competing with the hero `<h1>`
- Each content section includes a prominent "View all" call-to-action link
- Tailwind CSS is used exclusively — no inline styles

### Technical Constraints

- `src/app/page.tsx` is updated to implement the new homepage
- Homepage-specific components are placed in `src/components/homepage/`
- No new data fetching logic is written — all data access goes through the existing `src/lib/` layer
- The page is a Next.js server component — no `"use client"` directive on the page itself
- TypeScript strict mode is observed; no use of `any`
- No hardcoded content in components (content sourced from data layer or passed as props)
- The existing `HeroSection`, `ContentBlock`, and `SectionWrapper` editorial components may be reused or extended as needed

### Accessibility

- Profile photo has a meaningful `alt` attribute
- Heading hierarchy is logical: `<h1>` in hero, `<h2>` for each content section
- "View all" links have descriptive text (e.g. "View all posts" not just "View all")
- Sufficient colour contrast is maintained throughout

---

## Task Notes

- Profile photo is located at `src/public/img/rob.png`
- The current `src/app/page.tsx` is a placeholder and should be fully replaced
- The existing `HeroSection` component (`src/components/editorial/hero-section.tsx`) does not currently support a photo; extend or create a homepage-specific hero variant rather than altering the generic component in a breaking way
- Data layers already exist for blogs (`src/lib/blog/`), videos (`src/lib/videos/`), and speaking (`src/lib/speaking/`) — the build agent should inspect these before implementing data access

---

## Approval

Reviewer:  
Decision: Pending  
Notes:
