---
title: "Design Token Governance in Growing Teams"
slug: "design-token-governance-in-growing-teams"
publishDate: "2025-10-19"
disqusId: "blog-2025-05"
abstract: "A governance model for evolving tokens without breaking product consistency."
tags:
  - design-systems
  - tokens
  - frontend
heroImage: "/images/blog/2025/design-tokens.jpg"
---

## The governance gap

Design tokens are adopted quickly. Governance rarely keeps pace. The result: tokens proliferate, names diverge across platforms, and a colour change requires updating three files instead of one.

## Token categories and ownership

| Category | Owner | Change process |
| --- | --- | --- |
| Primitive tokens | Design system team | Full review and cross-platform audit |
| Semantic tokens | Feature teams | PR to design-system repository |
| Component tokens | Component owner | Local PR with design review |

## Defining tokens as code

```ts
// tokens/semantic.ts
export const tokens = {
  color: {
    surface: { value: '#ffffff', type: 'color' },
    surfaceRaised: { value: '#f5f5f5', type: 'color' },
  },
  space: {
    300: { value: '12px', type: 'dimension' },
    400: { value: '16px', type: 'dimension' },
  },
} as const;
```

## Change lifecycle

<details>
<summary>Step-by-step change process</summary>

1. Identify all surfaces affected using automated impact analysis.
2. Update the primitive or semantic value in the design-source file.
3. Run the token build to regenerate CSS variables, iOS Swift constants, and Android resources.
4. Open a PR with a visual diff for each affected Storybook component.
5. Get approval from at least one downstream platform owner before merging.

</details>

> Lint rules should _error_ — not warn — on raw colour literals inside component files. Hardcoded values defeat the token system.
