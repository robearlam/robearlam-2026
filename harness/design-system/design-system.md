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

## Editorial Design

The site follows a **typography-led editorial design approach**.

- layout supports reading, not application behaviour  
- visual hierarchy is driven by typography and spacing  
- components should feel lightweight and unobtrusive  

Avoid “app-like” UI patterns where possible.

---

## Visual Restraint

The site should maintain a minimal, calm aesthetic.

Avoid:

- excessive colour usage  
- heavy shadows or gradients  
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

The visual identity uses a restrained palette built primarily on neutral tones, with a dark red used sparingly for emphasis.

The palette is intentionally minimal to maintain a calm and professional tone.

---

## Primary Colour

Dark red brand colour.

Hex value: #7A1C1C

Used sparingly for:

- key accents  
- active navigation states  
- subtle emphasis  

Primary colour should **not dominate the interface**.

---

## Secondary Colour

Supporting red tone.

Hex value: #B23A3A

Used for:

- subtle hover states  
- light emphasis  

Usage should remain minimal.

---

## Accent Colour

Warm complementary accent.

Hex value: #D97706

Used sparingly for:

- small highlights  
- occasional emphasis  

Accent usage should be rare and intentional.

---

## Neutral Palette

Neutrals provide the structural foundation of the UI.

Background: #FFFFFF  
Surface: #FFFFFF  
Primary text: #1F1F1F  
Secondary text: #6B6B6B  
Borders / dividers: #E5E5E5  

Neutrals should dominate the interface.

Colour should never be the primary tool for creating hierarchy.

---

## Dark Mode Colour Palette

The site supports a dark mode that is activated via a toggle in the site header and persists to `localStorage`. On first visit, the system `prefers-color-scheme` preference is respected.

Dark mode uses a warm dark palette derived from the brand's dark red identity. It is not a pure black/white inversion.

### Dark Mode Neutral Palette

Background: #1F1616  
Surface (cards, panels): #2A1E1E  
Primary text: #FFFFFF  
Secondary / metadata text: #C9BFBF  
Borders / dividers: #4A3939  
Muted surface: #352727  

### Dark Mode Brand Colours

| Colour | Light Mode | Dark Mode | Notes |
|---|---|---|---|
| Primary (brand red) | `#7A1C1C` | `#B23A3A` | Lightened for legibility on dark background |
| Secondary | `#B23A3A` | `#7A1C1C` | Roles swap in dark mode |
| Accent | `#D97706` | `#D97706` | Unchanged — amber works in both modes |

### Implementation

Dark mode colours are defined as CSS custom properties in `src/app/globals.css` under the `.dark` class selector. The Tailwind v4 `@custom-variant dark (&:is(.dark *))` variant activates when the `dark` class is present on any ancestor element (applied to `<html>`).

All colour tokens are accessible via standard Tailwind semantic utility classes (`bg-background`, `text-foreground`, `bg-card`, `border-border`, etc.).

---

# Typography

Typography is the **primary visual system driver**.

---

## Primary Font

Primary UI font: Inter

Reasons:

- excellent readability  
- widely used in modern UI  
- strong browser support  
- performs well across sizes  

---

## Heading Hierarchy

Suggested heading scale:

- H1 — 36–48px  
- H2 — 30–36px  
- H3 — 24–28px  
- H4 — 20–22px  

Guidelines:

- maintain clear hierarchy  
- avoid skipping heading levels  
- use spacing to reinforce structure  
- avoid decorative styling  

---

## Body Text

Body text should prioritise reading comfort.

Guidelines:

- body font size: 16–18px  
- generous line height  
- limit line length for readability  
- maintain consistent paragraph spacing  

---

## Supporting Text

- use muted colour for metadata (dates, tags, descriptions)  
- ensure supporting text does not compete with primary content  

---

# Spacing System

Spacing should follow a consistent vertical rhythm.

Base spacing scale:

- 4  
- 8  
- 16  
- 24  
- 32  
- 48  
- 64  

---

## Layout Rhythm

Common patterns:

- small grouping: `space-y-4`  
- standard grouping: `space-y-6`  
- section spacing: `space-y-10` to `space-y-16`  

---

## Guidelines

- avoid arbitrary spacing values  
- reuse spacing consistently  
- prioritise vertical rhythm  
- use spacing instead of borders or backgrounds where possible  

---

# Layout System

Pages follow a predictable structural layout:

Page  
→ Section  
→ Container  
→ Content  

---

## Container Width

Maximum content width:

- `max-w-3xl` to `max-w-4xl`

Guidelines:

- prioritise readable line length  
- avoid wide, application-style layouts  
- keep content centered  
- allow breathing room via padding  

---

## Page Structure

Typical structure:

- Header  
- Main Content  
- Footer  

Content should be structured into clearly defined sections using spacing.

---

# Section Patterns

Most pages follow predictable section patterns:

- Hero Section  
- Content Section  
- Content Section  
- Call to Action  
- Footer  

Sections should be separated primarily by spacing, not heavy visual elements.

---

# Component Strategy

The UI should be built from a **small, focused set of reusable components**.

Guidelines:

- prefer simple, composable components  
- avoid large or complex component systems  
- prioritise reuse over duplication  
- rely on layout and typography rather than visual decoration  

---

## Use of Component Libraries

Libraries such as shadcn/ui may be used as implementation primitives, but:

- they must not define the visual system  
- unnecessary components should not be imported  
- generated UI should not be copied wholesale  

All components must conform to this design system.

---

## Core Component Types

- layout containers  
- header and navigation  
- footer  
- section wrappers  
- typography blocks  
- blog list / content previews  
- minimal buttons  
- simple form inputs  

Components should remain lightweight and purpose-driven.

---

# Navigation

Navigation should remain simple and predictable.

Guidelines:

- clear top-level navigation  
- minimal nesting  
- consistent placement  
- calm visual presentation  

Avoid complex navigation patterns.

---

# Responsive Design

The site must work cleanly across:

- mobile  
- tablet  
- desktop  

Guidelines:

- use mobile-first layout thinking  
- maintain readable text sizes  
- preserve hierarchy across breakpoints  
- ensure container width does not become excessive on large screens  

---

# Interaction Design

Interactive elements should behave consistently and subtly.

Examples include:

- button hover states  
- link hover behaviour  
- focus states  
- navigation highlights  

Guidelines:

- interactions should be minimal and unobtrusive  
- avoid unnecessary animation  
- use simple visual feedback (underline, slight colour shift)  

---

# Accessibility Expectations

Design decisions should support accessibility by default.

Requirements include:

- sufficient colour contrast  
- readable font sizes  
- logical heading order  
- clear focus states  
- meaningful link text  

Accessibility is a core requirement, not optional.

---

# When the Design System Should Change

The design system should evolve when:

- repeated layout or readability issues appear  
- new content patterns emerge  
- accessibility improvements are required  
- better component patterns are identified  

Changes must be documented clearly in this file.

---

# Relationship to Feature Design

The **UI Designer role** maintains this design system.

The **Feature Design role** applies this system when designing features.

Feature designs must:

- reuse existing patterns  
- follow spacing and typography rules  
- avoid introducing new visual systems  

The goal is a cohesive, unified UI across the entire site.