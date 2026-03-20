---
title: "Incident Retrospective Format That Scales"
slug: "incident-retrospective-format-that-scales"
publishDate: "2025-05-30"
disqusId: "blog-2025-03"
abstract: "A concise retro format that focuses on learning and systemic fixes."
tags:
  - incident-management
  - reliability
  - engineering-culture
heroImage: "/images/blog/2025/incident-retro.png"
---

## Why most retrospectives fail to produce change

Long incident reviews surface facts but rarely surface the system conditions that made the incident possible. Blameful narratives stop learning before it starts.

## The four-section format

Use this structure for every incident, regardless of severity. Fill each section within 48 hours while memory is fresh.

1. **Timeline** — Chronological events from first signal to resolution, including detection lag.
2. **Impact** — Quantified user and business effect: error rate, affected users, SLA breach.
3. **Detection gaps** — What made this incident harder to detect, slower to triage, or longer to resolve?
4. **Follow-up actions** — Concrete, assigned, time-bounded tasks. No action left unowned.

> Describe system behaviour, not individual choices. The goal is a safer system, not assigned fault.

## Sample populated entry

```text
Date: 2025-11-08
Severity: SEV-2
Duration: 47 minutes
Timeline:
  14:32 - Spike in 5xx errors detected by uptime monitor
  14:41 - On-call paged; initial hypothesis was database
  14:58 - Root cause: misconfigured rate-limit header in deploy
  15:19 - Rollback completed; error rate returned to baseline
Impact:
  ~3,400 affected requests. No data loss.
Actions:
  1. Add pre-deploy rate-limit header validation (Owner: Platform, Due: 2025-11-22)
  2. Lower alerting threshold for 5xx rate (Owner: SRE, Due: 2025-11-15)
```

## Archiving and follow-through

<aside>
Store all retrospective documents in a shared, searchable location. Running a monthly review of closed actions is the single most effective way to improve retrospective quality — it surfaces action drift before it becomes a habit.
</aside>

## Health signals

- Action completion rate above 80% within the agreed timeframe
- Detection gap section non-empty in all moderate and high severity incidents
- Documents published within 72 hours of incident resolution
