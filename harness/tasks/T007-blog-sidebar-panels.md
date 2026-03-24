# Task T007 — Blog Sidebar Panels

Status: Ready  
Backlog Item: B011  
Created: 2026-03-24

---

## Summary

Add a right-column sidebar to the blog listing page (`/blog`) and the tag listing pages (`/blog/tag/[tag]`) containing two panels:

1. **Top Tags** — the top 10 tags across all blog posts, each linking to its tag listing page. The currently active tag (if on a tag page) is highlighted.
2. **Monthly Archive** — all months and years that contain at least one post, shown as clickable links that navigate to a new archive route (`/blog/[year]/[month]`). Each link shows the month/year label only — no post count.

The new archive route (`/blog/[year]/[month]`) must be implemented to display only the posts published in that month and year, following the same layout pattern as the tag listing page.

The sidebar is hidden on smaller screens and visible only from medium breakpoints upward.

---

## Related Artifacts

Feature Specification: `harness/artifacts/specs/T007-feature-spec.md`  
Design Note: `harness/artifacts/design/T007-design-note.md`  
Implementation Plan: `harness/artifacts/plans/T007-implementation-plan.md`  
QA Review: `harness/artifacts/qa/T007-qa-review.md`  
Run Report: (not yet assigned)

---

## Acceptance Criteria

- The blog listing page (`/blog`) renders a two-column layout: main feed on the left, sidebar on the right
- The tag listing pages (`/blog/tag/[tag]`) render the same two-column layout with the sidebar
- The sidebar contains a **Top Tags** panel listing the top 10 tags, with each tag linking to `/blog/tag/[tag]`
- On tag listing pages, the active tag in the Top Tags panel is visually highlighted
- The sidebar contains a **Monthly Archive** panel listing all months/years that have at least one post, each rendered as a link to `/blog/[year]/[month]` (e.g. `/blog/2026/03`)
- The Monthly Archive panel shows all months with posts — none are hidden or truncated
- The archive route `/blog/[year]/[month]` is implemented and displays only posts from that month and year
- The archive listing page follows the same visual layout and pagination pattern as the tag listing page
- The Top Tags panel appears above the Monthly Archive panel in the sidebar
- Both panels follow the existing design system (restrained palette, editorial style, border/card treatment consistent with the site)
- The sidebar is hidden on small screens and displayed only from the `md` breakpoint upward (Tailwind responsive prefix)
- No post counts are displayed in either panel
- Navigating to a valid archive URL with no posts shows an appropriate empty state message consistent with the tag page empty state

---

## Task Notes

- The archive route URL format is `/blog/[year]/[month]` using zero-padded numeric month (e.g. `03` for March)
- The month/year label in the archive panel should be human-readable (e.g. "March 2026")
- The column width ratio for the two-column layout should be chosen from the closest match in the design system / Tailwind grid (e.g. `lg:grid-cols-[1fr_300px]` or a `3/4 + 1/4` split) — defer to what best suits editorial readability
- Static generation (`generateStaticParams`) should be used for the archive route where possible, consistent with how the tag route is handled
- The existing `getPaginatedBlogPosts` and related data functions should be extended or supplemented to support month/year filtering rather than duplicating query logic
- The sidebar component should be composed as a shared component usable on both the listing and tag pages
- Disqus and blog detail pages are out of scope

---

## Approval

Reviewer:  
Decision: Pending  
Notes:
