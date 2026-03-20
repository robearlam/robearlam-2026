---
title: "API Versioning Without Chaos"
slug: "api-versioning-without-chaos"
publishDate: "2025-01-22"
disqusId: "blog-2025-01"
abstract: "A migration playbook for versioned APIs with minimal client breakage."
tags:
  - api-design
  - backend
  - compatibility
heroImage: "/images/blog/2025/api-versioning.jpg"
---

## The problem with breaking changes

Clients depend on contract stability. When changes arrive without notice, teams spend days debugging production failures that have nothing to do with their own code.

## Versioning principles

1. **Never break the current major version.** Additive changes — new fields, new endpoints — are always safe. Removal or type changes require a new major version.
2. **Set a deprecation window.** Announce the timeline at least 90 days before removing an old version.
3. **Respond with supported versions** when a client requests an unsupported one, and log that request.

## Request and response examples

```http
GET /accounts/42 HTTP/1.1
Accept: application/vnd.acme.v2+json
```

When the requested version is unavailable:

```http
HTTP/1.1 406 Not Acceptable
Content-Type: application/problem+json

{
  "status": 406,
  "title": "Version not supported",
  "supported_versions": ["v2", "v3"]
}
```

## Deprecation signals by channel

| Channel | Mechanism | Timing |
| --- | --- | --- |
| Response headers | `Deprecation: true`, `Sunset: <date>` | First request after announcement |
| Developer portal | Banner and migration guide | 90 days before removal |
| Changelog | Semver entry with callout | Each affected release |

> A migration is complete only when zero clients are calling the deprecated version — *monitoring*, not promises, confirms this.
