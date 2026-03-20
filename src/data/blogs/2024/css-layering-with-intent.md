---
title: "CSS Layering With Intent"
slug: "css-layering-with-intent"
publishDate: "2024-04-22"
disqusId: "blog-2024-05"
abstract: "How to avoid style drift by treating CSS layers as explicit product boundaries."
tags:
  - css
  - frontend
  - architecture
heroImage: "/images/blog/2024/css-layering.jpg"
---

Layering is only useful when it encodes intent. If every selector can override every other selector, your CSS becomes negotiation instead of design.

## Start with explicit boundaries

Treat each layer as a product boundary with a clear contract:

- `tokens`: design values and global primitives
- `base`: default element styling and typography rhythm
- `components`: reusable UI parts with local structure
- `utilities`: narrow, one-purpose overrides

```css
@layer tokens, base, components, utilities;
```

When these boundaries are stable, teammates can change styles without guessing where to place a rule.

## A practical layering model

```css
@layer tokens {
  :root {
    --color-surface: #fffdf9;
    --color-text: #1f2937;
    --radius-md: 0.625rem;
    --space-3: 0.75rem;
    --space-6: 1.5rem;
  }
}

@layer base {
  body {
    margin: 0;
    color: var(--color-text);
    background: var(--color-surface);
    line-height: 1.55;
  }
}

@layer components {
  .card {
    border: 1px solid color-mix(in oklab, var(--color-text), white 82%);
    border-radius: var(--radius-md);
    padding: var(--space-6);
  }
}

@layer utilities {
  .u-stack-sm > * + * {
    margin-top: var(--space-3);
  }
}
```

## Why order matters

| Layer | Owns | Should avoid |
| --- | --- | --- |
| Tokens | Variables and theme values | Component geometry |
| Base | Element defaults | Product-specific layout |
| Components | Encapsulated UI patterns | Global resets |
| Utilities | Single-purpose exceptions | Semantic component styles |

If a utility class starts containing business meaning, it probably belongs in the component layer.

> A healthy cascade is not accidental. It is designed, named, and constrained.

## Team guardrails that reduce drift

1. Require new selectors to declare a layer.
2. Keep utility rules short and atomic.
3. Ban unlayered global selectors in code review.
4. Move repeated utility combinations into components.

## Migration strategy for existing codebases

```css
/* Step 1: declare order once */
@layer tokens, base, components, utilities;

/* Step 2: wrap legacy component rules */
@layer components {
  .site-nav {
    display: flex;
    gap: 1rem;
  }
}

/* Step 3: keep emergency overrides constrained */
@layer utilities {
  .u-hide-mobile {
    display: none;
  }

  @media (min-width: 48rem) {
    .u-hide-mobile {
      display: initial;
    }
  }
}
```

Move incrementally. You do not need a rewrite to get the benefits of intentional layering.
