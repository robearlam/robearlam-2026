---
title: "Build Pipeline Caching Guide"
slug: "build-pipeline-caching-guide"
publishDate: "2025-03-11"
disqusId: "blog-2025-02"
abstract: "How to reduce CI time by using deterministic caches and smart cache keys."
tags:
  - ci-cd
  - devops
  - build-systems
---

## Why caches underperform

Teams add cache steps, hit rates sit below 30%, and engineers conclude caching does not work. The real problem is almost always the cache key, not the cache layer.

## Anatomy of a good cache key

A cache key must change *exactly when* the cached artifact is stale, and *not change* when the artifact is still valid.

```yaml
cache:
  key: ${{ runner.os }}-npm-${{ hashFiles('package-lock.json') }}
  restore-keys:
    - ${{ runner.os }}-npm-
  paths:
    - node_modules/
    - ~/.npm
```

`hashFiles` ensures the cache is invalidated when dependencies change, but not on every source code commit.

## Cache key strategy by artifact type

| Artifact | Recommended key inputs | Avoid |
| --- | --- | --- |
| Node modules | OS + lockfile hash | Branch name |
| Docker layers | Dependency manifest hash | Build number |
| Compiled output | Source tree hash + compiler version | Timestamp |
| Test result cache | Suite identifier + git tree hash | Commit SHA |

## Measuring effectiveness

<div>
Track two numbers: <strong>hit rate</strong> (fraction of builds that restored successfully) and <strong>time saved</strong> (restored vs cold build time). Review weekly and investigate any drop below 70%.
</div>

## Common pitfalls

- Over-broad keys invalidate the cache on every file change
- Caching only `node_modules/` but not `~/.npm` leaves partial misses
- Missing restore keys force first-run branches to cold-start every time
- Caching generated output — use build artifacts for that, not cache entries
