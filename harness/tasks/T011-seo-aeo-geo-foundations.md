# Task T011 — SEO, AEO & GEO Foundations

Status: Ready  
Backlog Item: B008  
Created: 2026-03-27

---

## Summary

Implement site-wide SEO foundations and modern AEO/GEO optimizations so traditional search engines and LLM crawlers can reliably discover, parse, and cite site content.

Scope covers the full site (global layout and all current page types), including baseline metadata quality, structured data coverage, crawl/index controls, and analytics tracking with GA4.

---

## Related Artifacts

Feature Specification: `harness/artifacts/specs/T011-feature-spec.md`  
Design Note: `harness/artifacts/design/T011-design-note.md`  
Implementation Plan: `harness/artifacts/plans/T011-implementation-plan.md`  
QA Review: `harness/artifacts/qa/T011-qa-review.md`  
Run Report: `harness/runs/{{RUN_ID}}.md`

---

## Acceptance Criteria

### Baseline SEO Metadata

- Every indexable page has a unique, meaningful `<title>` and `meta description`
- Canonical URLs are defined consistently for indexable routes
- Open Graph metadata is present and valid for key page types (home, blog post, videos, speaking, contact)
- Twitter/X card metadata is present and aligned with OG metadata
- Metadata is generated through Next.js metadata APIs rather than ad-hoc manual tags where possible

### Technical SEO Foundations

- A valid XML sitemap is generated and includes all intended indexable routes
- A valid `robots.txt` is present and reviewed to ensure intended crawler access
- Index/noindex behavior is explicit for indexable vs non-indexable pages
- Internal linking is sufficient for crawler discovery of all key content hubs

### Structured Data Coverage

- `WebSite` schema is implemented globally
- `Person` or `Organization` schema is implemented for site identity
- `WebPage` schema is implemented for key route types
- `BlogPosting` schema is implemented for blog post pages
- `VideoObject` schema is implemented for video detail/listing contexts where applicable
- `Event` schema is implemented for speaking engagement pages where applicable
- JSON-LD output validates without critical errors in rich result/schema validation checks

### AEO & GEO Readiness

- Key pages include concise, LLM-readable summary content blocks that accurately describe page intent
- Author and entity clarity signals are present (clear author identity, role/context, and consistent entity naming)
- Content is structured with semantic heading hierarchy to support answer extraction and chunking
- Citation-friendly canonical source cues are present (clear source URL/canonical consistency and stable section semantics)
- Machine-readable and human-readable content remain semantically aligned (no contradictory metadata vs visible content)
- Crawler accessibility is reviewed for major AI crawlers via robots/sitemap policy checks

### Analytics

- GA4 tracking is implemented and loaded in a privacy-conscious, production-safe way
- Core page view tracking is verified across all in-scope route types
- Tracking implementation avoids duplicate page view firing on route transitions

### Accessibility and Quality Guardrails

- SEO/AEO/GEO enhancements do not regress existing accessibility semantics
- Structured data and metadata changes pass lint/typecheck and existing test suites
- Any new helper utilities are typed, reusable, and covered by focused tests where practical

---

## Task Notes

- This task is mapped to backlog item B008 per clarification
- Scope is site-wide across all current routes, not limited to a single page
- Prioritize standards-compliant implementation through existing project conventions and Next.js-native APIs
- Favor deterministic, testable metadata/schema generation over hardcoded per-page duplication

---

## Approval

Reviewer:  
Decision: Pending  
Notes: