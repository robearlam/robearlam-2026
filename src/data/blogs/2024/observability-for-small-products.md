---
title: "Observability for Small Products"
slug: "observability-for-small-products"
publishDate: "2024-05-21"
disqusId: "blog-2024-03"
abstract: "A lightweight telemetry stack that gives signal without enterprise overhead."
tags:
  - observability
  - sre
  - product-engineering
heroImage: "/images/blog/2024/observability.jpg"
---

You do not need a huge platform to get useful telemetry.

- Structured logs
- Request metrics
- Error tracking

```bash
curl -sS https://example.internal/health | jq .status
```

> Start with the questions your on-call person asks first.
