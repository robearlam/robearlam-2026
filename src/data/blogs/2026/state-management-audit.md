---
title: "State Management Audit Checklist"
slug: "state-management-audit-checklist"
publishDate: "2026-08-25"
disqusId: "blog-2026-03"
abstract: "Audit client state patterns to simplify data flow and reduce regressions."
tags:
  - state-management
  - frontend
  - code-quality
heroImage: "/images/blog/2026/state-audit.jpg"
---

## Why state accumulates complexity

Client state grows through accretion. A prop is added, a local `useState` is introduced for a derived value, a cache layer is bolted on. Six months later, nobody is sure where the canonical value of a field lives.

## Audit checklist

Work through these questions for each major view:

- [ ] Is there a single, named source-of-truth for each piece of data?
- [ ] Are derived values computed at render time rather than stored separately?
- [ ] Are async transitions (loading, error, success) modelled explicitly?
- [ ] Is server state managed by a dedicated library rather than manual `useEffect` + `useState`?
- [ ] Are global stores limited to genuinely global concerns (auth, theme, locale)?

<details>
<summary>Common ownership anti-patterns</summary>

- **Duplicated server state**: fetching the same resource in two components and syncing manually
- **Derived state in the store**: persisting a value that is always a pure function of another stored value
- **Action-at-a-distance**: a dispatch that silently modifies state consumed by an unrelated module
- **Polymorphic loading states**: reusing one boolean for multiple concurrent async operations

</details>

## Scoring findings

| Finding | Severity | Suggested action |
| --- | --- | --- |
| Duplicated server state in 2+ components | High | Migrate to shared query key |
| Derived value persisted in store | Medium | Replace with selector or `useMemo` |
| Async transitions without error state | Medium | Add error boundary or error field |
| Global store used for local UI | Low | Move to component-local state |

## Running an initial scan

```bash
# Find useState calls in component files for manual review
grep -rn "useState" src/components --include="*.tsx" \
  | grep -v "//.*useState" \
  | sort > /tmp/useState-audit.txt

cat /tmp/useState-audit.txt
```

*After each audit cycle, archive findings and track the resolution rate. An unresolved finding from a prior cycle signals the team needs a convention, not a reminder.*
