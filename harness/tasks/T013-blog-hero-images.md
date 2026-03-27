# Task T013 — Blog Hero Images

Status: Ready  
Backlog Item: B016  
Created: 2026-03-27

---

## Summary

Add hero image rendering to the homepage blog preview cards so the latest blog section visually reflects the source content already present on blog posts.

Scope for this task is:
- updating the homepage blog preview presentation so each card displays the post hero image when one is available
- using the existing placeholder asset at `/src/public/img/blog-images/blog-placeholder.png` when a post does not define `heroImage`
- preserving the current latest-post selection, ordering, linking, and text content while extending the card layout to support imagery

---

## Related Artifacts

Feature Specification: `harness/artifacts/specs/T013-feature-spec.md`  
Design Note: `harness/artifacts/design/T013-design-note.md`  
Implementation Plan: `harness/artifacts/plans/T013-implementation-plan.md`  
QA Review: `harness/artifacts/qa/T013-qa-review.md`  
Run Report: `harness/runs/{{RUN_ID}}.md`

---

## Acceptance Criteria

### Homepage Blog Preview

- The homepage "Latest Blogs" section renders an image for each preview card
- If a post defines `heroImage`, that image is shown on the homepage preview card for that post
- If a post does not define `heroImage`, the homepage preview card uses the existing placeholder asset located at `/src/public/img/blog-images/blog-placeholder.png`
- The preview card image links to the same blog post destination as the card title
- Existing post metadata shown on the homepage preview cards remains present and correct, including publish date, title, abstract, and tags
- Latest blog selection remains based on the existing `getLatestPosts(3)` behavior and current reverse-chronological ordering

### Presentation and Accessibility

- The homepage blog cards remain visually coherent across mobile and desktop layouts after adding images
- Card images include meaningful alt text behavior that does not reduce accessibility quality
- The placeholder image is presented in a way that is visually intentional rather than appearing as a broken or missing asset
- The homepage continues to avoid layout breakage or severe cumulative layout shift when blog images load

### Technical Constraints

- Implementation reuses the existing blog data model, which already exposes optional `heroImage` in the frontmatter normalization flow
- No duplicate image metadata source-of-truth is introduced for homepage previews
- The placeholder path used at runtime is consistent with how static assets are served from the existing Next.js public asset structure
- Changes are covered by focused tests where practical, especially for fallback behavior when `heroImage` is undefined
- Changes pass lint, typecheck, and relevant test suites without regressing existing homepage or blog behavior

---

## Task Notes

- Current state at task creation time:
  - blog post frontmatter already supports an optional `heroImage` field via `src/lib/blog/types.ts` and `src/lib/blog/posts.ts`
  - individual blog post pages already render `post.heroImage` when it is present
  - the homepage latest blog section currently renders `BlogPostCard` components without any image support
- The task should focus on the homepage preview surface first; it does not require changing the source markdown schema or the existing blog post detail page behavior unless the feature specification identifies a necessary supporting adjustment
- The placeholder asset already exists in the repository, so this task should prefer wiring the existing asset into the homepage preview flow rather than introducing a new fallback image

---

## Approval

Reviewer:  
Decision: Pending  
Notes: