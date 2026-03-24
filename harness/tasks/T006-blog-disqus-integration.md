# Task T006 — Blog Disqus Integration

Status: Ready  
Backlog Item: B010  
Created: 2026-03-24

---

## Summary

Add full Disqus integration to individual blog post pages so existing comments render for imported posts and visitors can add new comments.

The implementation must use the existing `disqusId` value already present in each blog post frontmatter entry and render the Disqus embed automatically on blog detail pages only.

---

## Related Artifacts

Feature Specification: `harness/artifacts/specs/T006-feature-spec.md`  
Design Note: `harness/artifacts/design/T006-design-note.md`  
Implementation Plan: `harness/artifacts/plans/T006-implementation-plan.md`  
QA Review: `harness/artifacts/qa/T006-qa-review.md`  
Run Report: `harness/runs/RUN-2026-03-24-T006-BUILD.md`

---

## Acceptance Criteria

- Blog detail pages (`/blog/[slug]`) render a Disqus comment embed beneath the post content
- The Disqus embed loads automatically when a blog detail page is viewed
- Existing comments associated with a post are displayed correctly
- Visitors can submit new comments through the embedded Disqus experience
- The implementation uses each post's existing `disqusId` frontmatter value as the post identifier
- Disqus integration is added only to individual blog post pages and not to the blog listing or tag listing pages
- The integration does not break static generation or normal blog page rendering when Disqus is configured correctly
- The implementation follows the existing blog architecture and does not duplicate post metadata logic
- Any required site-level Disqus configuration is sourced in a maintainable way suitable for deployment
- The Disqus shortname for this site is `robearlam`

---

## Task Notes

- Existing blog content already includes a `disqusId` field in frontmatter and that field should be treated as the canonical per-post identifier for Disqus
- Scope is limited to embedded comment rendering and comment submission on blog post pages
- Comment count badges, listing-page integration, moderation workflows, and admin-side Disqus setup are out of scope unless later added by specification
- The task should preserve the current blog page structure and add the smallest integration surface needed for production use
- The final specification should define the exact configuration contract required for the Disqus site shortname and any related environment values

---

## Approval

Reviewer:  
Decision: Pending  
Notes: