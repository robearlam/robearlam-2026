# Task T012 — Auxiliary Site Protocols

Status: Ready  
Backlog Item: B014  
Created: 2026-03-27

---

## Summary

Implement the remaining site-level auxiliary protocols needed for subscriptions, discovery, and crawler interoperability.

Scope for this task is:
- a blog RSS feed exposed at `/rss`
- a WebFinger endpoint exposed at `/.well-known/webfinger`
- validation and preservation of the current `robots.txt` and `sitemap.xml` behavior unless targeted corrections are required

The WebFinger response should replicate the currently live site payload so `robearlam.com` continues to act as a stable discovery domain for the Mastodon identity currently published there.

---

## Related Artifacts

Feature Specification: `harness/artifacts/specs/T012-feature-spec.md`  
Design Note: `harness/artifacts/design/T012-design-note.md`  
Implementation Plan: `harness/artifacts/plans/T012-implementation-plan.md`  
QA Review: `harness/artifacts/qa/T012-qa-review.md`  
Run Report: `harness/runs/{{RUN_ID}}.md`

---

## Acceptance Criteria

### RSS Feed

- A valid RSS feed is available at `/rss`
- The RSS feed is generated from the existing blog data source rather than duplicated hardcoded content
- Feed items represent published blog posts in reverse-chronological order
- Each feed item includes, at minimum: title, canonical URL, description/summary, publication date, and a stable identifier
- Feed metadata includes the site title, site URL, and feed description appropriate for the blog
- The feed returns the correct XML response format and content type for RSS consumers
- Generated feed URLs use the canonical site URL source of truth already used elsewhere in the app

### WebFinger

- A WebFinger endpoint is available at `/.well-known/webfinger`
- The endpoint returns a JSON document that matches the currently live site payload in substance, including:
  - subject: `acct:RobEarlam@mastodon.social`
  - aliases for the Mastodon profile and user URLs
  - links for profile-page, self ActivityPub URL, and OStatus subscribe template
- The response remains stable for the plain endpoint path and the standard `resource` query variant used by WebFinger clients
- The endpoint returns a WebFinger-appropriate JSON content type rather than a generic text response
- Implementation is done within Next.js app routing conventions and does not depend on legacy redirect hacks unless the design note justifies it

### Robots.txt Validation

- The current `robots.txt` implementation is reviewed and remains correct after this task
- `robots.txt` continues to allow intended public crawler access to the site
- `robots.txt` continues to advertise the canonical sitemap location
- If any crawler rules are changed, the change must be explicitly justified in the feature specification and must not unintentionally block search or AI crawlers from public content

### Sitemap Validation

- The current `sitemap.xml` implementation is reviewed and remains correct after this task
- The sitemap continues to include all current indexable routes in the app
- The sitemap continues to exclude routes that are intentionally non-indexable, such as blog archive and tag pages already marked with `robots: { index: false }`
- Any sitemap changes introduced by this task must be intentional, standards-compliant, and documented in the feature specification

### Technical Constraints

- Implementation should reuse the existing SEO constants and canonical URL helpers where practical
- No duplicate source-of-truth is introduced for site identity, canonical domain, or blog post metadata
- New protocol endpoints are covered by focused tests where practical, especially for response shape and content type
- Changes must pass lint, typecheck, and relevant test suites without regressing existing SEO behavior

---

## Task Notes

- This task complements T011 rather than replacing it; T011 established SEO foundations, while T012 adds missing subscription/discovery protocols and validates the existing crawler endpoints
- Current validation result at task creation time:
  - `src/app/robots.ts` already allows all crawlers and advertises `${SITE_URL}/sitemap.xml`
  - `src/app/sitemap.ts` currently includes the indexable route set present in the app today: home, blog, videos, speaking, contact, and blog post detail pages
  - blog archive and tag pages are already marked noindex and are correctly absent from the sitemap
- The currently live WebFinger payload at `https://robearlam.com/.well-known/webfinger` returns the following effective identity mapping and should be treated as the compatibility baseline:
  - subject `acct:RobEarlam@mastodon.social`
  - aliases `https://mastodon.social/@RobEarlam` and `https://mastodon.social/users/RobEarlam`
  - links for profile page, ActivityPub self URL, and subscribe template
- The live site currently returns the WebFinger payload for both the plain endpoint and the `?resource=acct:rob@robearlam.com` variant; the new site should preserve that functional compatibility while using a more correct response content type
- Service endpoints such as RSS and WebFinger do not need to be added to the XML sitemap unless the feature specification explicitly justifies doing so

---

## Approval

Reviewer:  
Decision: Pending  
Notes: