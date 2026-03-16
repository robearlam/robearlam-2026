# Design System

## Purpose

This document defines the visual design system used across the personal site.

The goal of this design system is to create a visual language that is:

- clean
- professional
- calm
- readable
- modern
- consistent

The site is **content-first**, meaning the visual system should support clarity and readability rather than decorative complexity.

This document serves as the **source of truth for visual design decisions** across the project.

All feature designs should follow the rules defined here.

---

# Design Principles

## Content First

Content should always be the primary focus.

Typography, spacing, and layout should make content easy to read and scan.

Avoid visual elements that distract from the content.

---

## Visual Restraint

The site should maintain a minimal, calm aesthetic.

Avoid:

- excessive colour usage
- unnecessary visual decoration
- overly complex layouts

Design decisions should favour clarity and simplicity.

---

## Consistency

Spacing, typography, layout patterns, and component styles should remain consistent across all pages.

Users should feel that every page belongs to the same visual system.

---

## Accessibility

Design choices must support accessibility:

- maintain strong colour contrast
- preserve logical heading hierarchy
- ensure readable font sizes
- support keyboard interaction where applicable

Accessibility should be treated as a first-class design concern.

---

# Colour System

The visual identity uses a **dark red primary colour** supported by neutral tones and subtle accent colours.

The palette is intentionally restrained to maintain a professional tone.

---

## Primary Colour

Dark red brand colour.

Hex value: #7A1C1C

Used for:

- primary buttons
- highlighted UI elements
- key accents
- active navigation states

The primary colour should not dominate the interface. Use it sparingly for emphasis.

---

## Secondary Colour

Supporting red tone.

Hex value: #B23A3A

Used for:

- hover states
- subtle highlights
- secondary accents

---

## Accent Colour

Warm complementary accent.

Hex value: #D97706

Used sparingly for:

- small visual highlights
- link hover states
- callouts or emphasis

Accent colour usage should remain limited.

---

## Neutral Palette

Neutrals provide the structural foundation of the UI.

Background: #F8F7F6  
Surface: #FFFFFF  
Primary text: #1F1F1F  
Secondary text: #6B6B6B  
Borders / dividers: #E5E5E5

Neutrals should dominate the interface, allowing accent colours to stand out when used.

---

# Typography

Typography prioritises readability and clear information hierarchy.

---

## Primary Font

Primary UI font: Inter

Reasons:

- excellent readability
- widely used in modern UI
- strong browser support
- performs well at many sizes

---

## Heading Hierarchy

Suggested heading scale:

- H1 — 36–48px
- H2 — 30–36px
- H3 — 24–28px
- H4 — 20–22px

Guidelines:

- maintain a clear hierarchy
- avoid skipping heading levels
- headings should separate sections clearly

---

## Body Text

Body text should prioritise reading comfort.

Guidelines:

- body font size around 16–18px
- generous line height
- avoid extremely long line lengths
- maintain consistent paragraph spacing

---

# Spacing System

Spacing should follow a consistent rhythm.

Base spacing scale:

- 4
- 8
- 16
- 24
- 32
- 48
- 64

Guidelines:

- avoid arbitrary spacing values
- reuse spacing consistently
- maintain strong vertical rhythm
- give sections generous breathing room

---

# Layout System

Pages should follow a predictable structural layout.

Typical structure:

Page  
→ Section  
→ Container  
→ Content  

This structure helps maintain visual consistency across pages.

---

## Container Width

Maximum content width: ~1100px

Guidelines:

- keep content centered
- avoid overly wide reading columns
- maintain comfortable reading widths

---

# Section Patterns

Most pages should follow predictable section patterns.

Typical structure:

Hero Section  
Content Section  
Content Section  
Call to Action  
Footer  

Sections should be separated by spacing rather than heavy visual borders.

---

# Component Strategy

This project uses **shadcn/ui** as the base component library.

Guidelines:

- prefer existing primitives when possible
- wrap primitives when reusable patterns emerge
- avoid unnecessary custom components
- maintain consistent component usage across pages

Reusable components should live in:

`src/components`

---

# Navigation

Navigation should remain simple and predictable.

Guidelines:

- clear top-level navigation
- minimal nesting
- consistent placement
- easy access to main site areas

Navigation should not become overly complex for a personal site.

---

# Responsive Design

The site must work cleanly across:

- mobile
- tablet
- desktop

Guidelines:

- mobile-first layout thinking
- maintain readable text sizes
- preserve hierarchy on small screens
- avoid layouts that collapse poorly on narrow devices

---

# Interaction Design

Interactive elements should behave consistently.

Examples include:

- button hover states
- link hover behaviour
- focus states
- navigation highlights

Interaction feedback should be subtle but clear.

---

# Accessibility Expectations

Design decisions should support accessibility by default.

Requirements include:

- sufficient colour contrast
- readable font sizes
- logical heading order
- clear focus states
- meaningful link text

Accessibility should not be treated as optional.

---

# When the Design System Should Change

The design system should evolve when:

- repeated layout issues appear
- new feature types require new patterns
- accessibility improvements are needed
- better component patterns emerge

Changes should be documented clearly in this file.

---

# Relationship to Feature Design

The **UI Designer role** maintains this design system.

The **Feature Design role** applies this system when designing individual features.

Feature designs should reuse existing patterns wherever possible rather than introducing new visual rules.