# Task T013 — Blog Hero Images

Status: Ready  
Backlog Item: B016  
Created: 2026-03-27

---

## Summary

Add hero image rendering to homepage and blog listing cards so blog discovery surfaces visually reflect the source content already present on blog posts.

Scope for this task is:
- updating the homepage blog preview presentation so each card displays the post hero image when one is available
- updating all blog listing pages so each listed post includes a thumbnail derived from the post hero image
- using the existing placeholder asset at `/src/public/img/blog-images/blog-placeholder.png` when a post does not define `heroImage`
- preserving the current latest-post selection, ordering, linking, pagination, filtering, and text content while extending list card layouts to support imagery

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

### Blog Listing Pages

- All blog listing pages render a thumbnail image for each listed post
- If a listed post defines `heroImage`, that image is used as the thumbnail on blog listing pages
- If a listed post does not define `heroImage`, blog listing pages use the existing placeholder asset located at `/src/public/img/blog-images/blog-placeholder.png`
- Thumbnail images on blog listing pages link to the same blog post destination as the associated title or card
- Existing listing behaviors remain intact, including current ordering, pagination, archive filtering, and tag filtering where applicable
- Existing post metadata shown on blog listing pages remains present and correct after thumbnail support is added

### Presentation and Accessibility

- The homepage blog cards remain visually coherent across mobile and desktop layouts after adding images
- Blog listing cards remain visually coherent across mobile and desktop layouts after adding thumbnail images
- Card images include meaningful alt text behavior that does not reduce accessibility quality
- The placeholder image is presented in a way that is visually intentional rather than appearing as a broken or missing asset
- Homepage and blog listing pages continue to avoid layout breakage or severe cumulative layout shift when blog images load

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
  - blog listing surfaces should be treated as in scope for the same image/fallback behavior, not just the homepage preview section
- The task should focus on blog discovery and listing surfaces; it does not require changing the source markdown schema or the existing blog post detail page behavior unless the feature specification identifies a necessary supporting adjustment
- The placeholder asset already exists in the repository, so this task should prefer wiring the existing asset into the homepage preview flow rather than introducing a new fallback image

---

## Approval

Reviewer:  
Decision: Pending  
Notes: