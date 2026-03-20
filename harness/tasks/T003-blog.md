# Task T003 — Blog Feature Implementation

Status: Ready  
Backlog Item: B005  
Created: 20 March 2026

---

## Summary

Implement a fully functional blog feature using file-based Markdown content, supporting static generation, infinite scroll pagination via API, and tag-based filtering. The feature must adhere strictly to defined architectural and coding constraints, ensuring clean separation of concerns, reusable components, and a scalable content-driven structure suitable for both real-world usage and harness validation.

---

## Related Artifacts

Feature Specification: `harness/artifacts/specs/T003-feature-spec.md`  
Design Note: `harness/artifacts/design/T003-design-note.md`  
Implementation Plan: `harness/artifacts/plans/T003-implementation-plan.md`  
QA Review: `harness/artifacts/qa/T003-qa-review.md`  
Run Report: `harness/runs/RUN-2026-03-20-T003.md`

---

## Acceptance Criteria

- Blog posts are sourced from Markdown files located in `/src/data/blogs/{year}/{slug}.md`
- The `data` directory must not be located inside `/src/app`
- Each Markdown file includes required frontmatter fields:
  - `title`
  - `slug`
  - `publishDate`
  - `disqusId`
  - `abstract`
  - `tags` (array of manually defined URL-safe slugs)
  - `heroImage` (optional)
- Blog list page (`/blog`) renders the latest 5 posts at build time (SSG), sorted by `publishDate` descending
- Infinite scroll loads additional posts via an API route using `limit` and `offset` parameters
- API route supports optional `tag` parameter to filter posts
- Tag-specific listing page (`/blog/tag/[tag]`) displays filtered posts using identical pagination behaviour
- Clicking a tag from a post navigates to the corresponding tag listing page
- Blog detail page (`/blog/[slug]`) renders:
  - Title
  - Publish date
  - Abstract
  - Tags
  - Hero image (if present)
  - Markdown content
  - Social sharing links
- Social sharing links are provided for:
  - Facebook
  - LinkedIn
  - Reddit
  - X (Twitter)
  - Bluesky
- All social share links open in a new browser tab
- 404 page is shown with a friendly message for:
  - Non-existent blog slugs
- Empty state is handled gracefully when no posts are available for a tag
- New Markdown blog files are automatically included in the blog without requiring code changes
- Markdown rendering must use a maintained markdown parsing/rendering library.
- Do not implement custom handwritten markdown parsing logic except for trivial frontmatter extraction where explicitly approved.
- Prefer established libraries for parsing Markdown content and rendering it safely.
- Pagination functions correctly for any number of posts
- At least 15 sample blog posts are included to validate multi-page infinite scroll behaviour
- Ensure that the sample blog posts contain a variety of HTML elements to properly test the Markdown Parsing
- Sample content must support:
  - multiple pagination loads
  - tag-based filtering across pages
- No hardcoded content exists within UI components
- All data access is abstracted through a defined data layer
- Tailwind CSS is used exclusively (no inline styles)
- TypeScript strict mode is enabled and enforced
- No usage of `any` type in the implementation
- Blog-specific components must be located in `/src/components/blog/`
- Blog-specific library code must be located in `/src/lib/blog/`
- A `/src/features/blog/` directory must not be introduced
- Components are reusable and not tightly coupled to specific pages

---

## Task Notes

This task is intentionally scoped as an **aggressive harness validation scenario**. It is designed to test the system’s ability to:

- Handle structured content modeling via Markdown and frontmatter
- Implement a clean data access layer separating content from UI
- Generate reusable, composable components within a feature boundary
- Support hybrid rendering (SSG + client-side API-driven pagination)
- Maintain strict adherence to coding and architectural constraints

Key decisions:

- Tags are manually defined as URL-safe slugs in frontmatter (not derived)
- Infinite scroll is powered by an API route (e.g. `/api/blog`) supporting `limit`, `offset`, and `tag`
- Initial page load is statically generated (SSG) with subsequent data fetched client-side
- Tag routes reuse the same listing and pagination logic as the main blog page
- Social sharing is implemented via URL-based share links (no SDK integrations)
- Mastodon support has been intentionally excluded to reduce complexity

Additional implementation constraints:

- Canonical blog content path is `/src/data/blogs/{year}/{slug}.md`
- Blog content must not be placed inside `/src/app`
- Blog-specific components must be placed in `/src/components/blog/`
- Blog-specific library code must be placed in `/src/lib/blog/`
- Do not introduce `/src/features/blog/`
- Include a minimum of 15 sample blog posts to validate recursive pagination and tag filtering

Out of scope for this task:

- CMS integration
- Disqus rendering (only `disqusId` field is required)
- Search functionality
- Advanced markdown features (MDX, custom components)

---

## Approval

Reviewer:  
Decision: Pending  
Notes: