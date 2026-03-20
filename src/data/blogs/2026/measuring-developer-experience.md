---
title: "Measuring Developer Experience"
slug: "measuring-developer-experience"
publishDate: "2026-03-03"
disqusId: "blog-2026-02"
abstract: "Simple DX metrics that correlate with delivery speed and quality."
tags:
  - developer-experience
  - metrics
  - engineering-management
heroImage: "/images/blog/2026/dx-metrics.png"
---

## Why measure DX at all

Developer experience is often discussed but rarely tracked. A small, consistent scorecard turns subjective impressions into a signal that improves quarter over quarter.

## Core scorecard

| Metric | Collection method | Target |
| --- | --- | --- |
| Onboarding time | New-hire survey at day 5 | Under 4 hours to first PR |
| Local build time | Automated timing in CI | Under 90 seconds |
| PR cycle time | Git analytics | Under 24 hours median |
| Deploy frequency | Pipeline data | Multiple times per week |
| Flaky test rate | Test run reporting | Below 2% of suite |

## Querying cycle time

```sql
SELECT
  author,
  ROUND(AVG(cycle_hours), 1)                                    AS avg_cycle_hours,
  PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY cycle_hours)      AS p90_cycle_hours,
  COUNT(*)                                                       AS pr_count
FROM pull_requests
WHERE merged_at >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY author
ORDER BY avg_cycle_hours ASC;
```

## Interpreting results

1. Establish a baseline in the first measurement sprint.
2. Review the scorecard quarterly — monthly comparisons are too noisy.
3. Investigate outliers rather than averages. A single team at 10× the median cycle time signals a structural problem.
4. Pair quantitative data with a short quarterly survey. Numbers explain *what*; the survey explains *why*.

<aside>
DX metrics are a leading indicator of delivery quality. Teams that score well on setup time and cycle time consistently ship fewer regressions. Treat a deteriorating scorecard as an early warning, not an academic concern.
</aside>
