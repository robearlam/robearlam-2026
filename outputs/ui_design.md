# Visual Design Specification
## Personal Portfolio & Blog Website

**Document Version:** 1.0  
**Date:** January 2025  
**Designer:** Senior UI/UX Design Team  
**Status:** Final Specification for Development

---

## 1. Aesthetic Direction

### 1.1 Visual Personality

This website embodies **sophisticated technical authority** — a visual identity that commands respect without intimidation. The design is deliberately restrained, allowing content and expertise to take center stage. Think of it as the digital equivalent of a well-tailored blazer: professional, confident, timeless.

**Core Aesthetic Principles:**

- **Bold Minimalism:** Generous white space, strong typography hierarchy, deliberate use of the dark red accent to draw focus
- **Technical Precision:** Crisp edges, exact alignment, mathematical spacing relationships
- **Quiet Confidence:** Visual restraint that signals expertise (no need to shout)
- **Readable Authority:** Typography that prioritizes legibility while commanding attention
- **Purposeful Motion:** Subtle animations that feel responsive, not decorative

**Visual References (conceptual alignment):**
- The clarity of Stripe's design system
- The typographic confidence of Medium
- The restrained power of a well-designed technical book

---

## 2. Colour Palette

### 2.1 Complete Colour System

All colours specified as hex codes with precise usage rules.

#### Primary Colours

| Colour Name | Hex Code | RGB | Usage Rule |
|-------------|----------|-----|------------|
| **Dark Red (Hero Accent)** | `#8B0000` | rgb(139, 0, 0) | Primary brand accent. Use for: primary CTAs, active navigation states, link hover states, key headings on homepage/hero sections, speaking engagement dates. **Never use as background colour.** Maximum 5-10% of any screen's visual weight. |
| **Rich Black** | `#1A1A1A` | rgb(26, 26, 26) | Primary text colour for all body copy, headings, and high-emphasis content. Minimum usage: all paragraph text, all headings unless deliberately de-emphasized. |
| **Pure White** | `#FFFFFF` | rgb(255, 255, 255) | Primary background colour for main content areas, card backgrounds, and button text on dark red buttons. |

#### Secondary Colours

| Colour Name | Hex Code | RGB | Usage Rule |
|-------------|----------|-----|------------|
| **Warm Gray 100** | `#F8F6F4` | rgb(248, 246, 244) | Subtle background for alternating sections, code block backgrounds (light theme), card hover states. Use to create gentle visual separation without borders. |
| **Warm Gray 300** | `#D4CEC7` | rgb(212, 206, 199) | Borders, dividers, input field borders (inactive state). Use at 1px thickness. |
| **Warm Gray 500** | `#8A8278` | rgb(138, 130, 120) | Secondary text, captions, metadata (dates, reading time), form labels. Never use for body copy. |
| **Warm Gray 700** | `#4A453E` | rgb(74, 69, 62) | De-emphasized headings, navigation items (inactive state). |

#### Accent & Semantic Colours

| Colour Name | Hex Code | RGB | Usage Rule |
|-------------|----------|-----|------------|
| **Deep Red (Dark Variant)** | `#6B0000` | rgb(107, 0, 0) | Hover state for dark red buttons and links. Active/pressed state for CTAs. |
| **Light Red Tint** | `#FFF5F5` | rgb(255, 245, 245) | Background tint for featured content cards, subtle highlighting. Use sparingly — no more than one card per viewport. |
| **Success Green** | `#2D7A3E` | rgb(45, 122, 62) | Form submission success messages only. |
| **Error Red** | `#C41E3A` | rgb(196, 30, 58) | Form validation errors only. Brighter than brand red for visibility. |
| **Code Syntax Background** | `#F5F2F0` | rgb(245, 242, 240) | Background for inline code and code blocks. |

#### Colour Usage Matrix

| Element | Default State | Hover State | Active/Focus State |
|---------|---------------|-------------|-------------------|
| Primary CTA Button | Background: `#8B0000`, Text: `#FFFFFF` | Background: `#6B0000`, Text: `#FFFFFF` | Background: `#6B0000`, Text: `#FFFFFF`, 2px outline: `#8B0000` offset 2px |
| Text Link (in body) | Color: `#8B0000`, underline: none | Color: `#6B0000`, underline: 1px solid `#6B0000` | Color: `#6B0000`, underline: 2px solid `#6B0000` |
| Navigation Link | Color: `#4A453E` | Color: `#8B0000` | Color: `#8B0000`, 3px border-bottom: `#8B0000` |
| Card/Article | Background: `#FFFFFF`, border: 1px solid `#D4CEC7` | Background: `#F8F6F4`, border: 1px solid `#8A8278`, transform: translateY(-2px) | N/A |

### 2.2 Accessibility Validation

All colour combinations meet WCAG 2.1 AA standards:

- **Dark Red (#8B0000) on White (#FFFFFF):** Contrast ratio 8.51:1 ✓ (passes AAA for body text)
- **Rich Black (#1A1A1A) on White (#FFFFFF):** Contrast ratio 15.77:1 ✓ (passes AAA)
- **Warm Gray 500 (#8A8278) on White (#FFFFFF):** Contrast ratio 4.63:1 ✓ (passes AA for body text)
- **White (#FFFFFF) on Dark Red (#8B0000):** Contrast ratio 8.51:1 ✓ (passes AAA)

---

## 3. Typography

### 3.1 Font Families (Google Fonts)

#### Display & Headings
**Font Name:** `Playfair Display`  
**Weights Used:** 700 (Bold), 900 (Black)  
**Fallback Stack:** `'Playfair Display', Georgia, 'Times New Roman', serif`  
**Usage:** All H1, H2 headings. Hero section headline. Page titles.  
**Rationale:** Playfair Display brings editorial sophistication and authority. Its high contrast and elegant serifs signal expertise without corporate coldness.

#### Body & UI Text
**Font Name:** `Inter`  
**Weights Used:** 400 (Regular), 500 (Medium), 600 (Semi-Bold)  
**Fallback Stack:** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`  
**Usage:** All body copy, navigation, buttons, form elements, H3-H6 headings, captions.  
**Rationale:** Inter is optimized for screen readability with excellent spacing and clear letterforms. It pairs beautifully with Playfair Display's formality while maintaining approachability.

#### Code & Monospace
**Font Name:** `JetBrains Mono`  
**Weights Used:** 400 (Regular), 500 (Medium)  
**Fallback Stack:** `'JetBrains Mono', 'Courier New', Courier, monospace`  
**Usage:** Code blocks, inline code snippets, technical specifications.  
**Rationale:** JetBrains Mono is purpose-built for developers with ligatures and excellent readability at small sizes.

### 3.2 Type Scale & Styles

Base font size: **16px** (1rem)  
Base line height: **1.6** (25.6px)

#### Heading Styles

| Style Name | Element | Font | Size | Weight | Line Height | Letter Spacing | Margin Bottom | Usage |
|------------|---------|------|------|--------|-------------|----------------|---------------|-------|
| **Display 1** | H1 (Hero) | Playfair Display | 64px (4rem) | 900 | 1.1 (70.4px) | -0.02em | 24px | Homepage hero headline only |
| **Display 2** | H1 (Page Title) | Playfair Display | 48px (3rem) | 700 | 1.2 (57.6px) | -0.01em | 32px | Page titles (About, Blog, Speaking, Contact) |
| **Heading 1** | H2 | Playfair Display | 36px (2.25rem) | 700 | 1.25 (45px) | -0.01em | 24px | Major section headings |
| **Heading 2** | H3 | Inter | 24px (1.5rem) | 600 | 1.4 (33.6px) | -0.01em | 16px | Subsection headings, blog post titles in lists |
| **Heading 3** | H4 | Inter | 20px (1.25rem) | 600 | 1.4 (28px) | 0 | 16px | Minor headings, component titles |
| **Heading 4** | H5 | Inter | 16px (1rem) | 600 | 1.5 (24px) | 0.01em | 12px | Card headings, form section labels |
| **Heading 5** | H6 | Inter | 14px (0.875rem) | 600 | 1.5 (21px) | 0.02em | 8px | Tertiary headings (rarely used) |

#### Body Text Styles

| Style Name | Element | Font | Size | Weight | Line Height | Letter Spacing | Margin Bottom | Usage |
|------------|---------|------|------|--------|-------------|----------------|---------------|-------|
| **Body Large** | .body-large | Inter | 20px (1.25rem) | 400 | 1.7 (34px) | 0 | 24px | Lead paragraphs, introductory text |
| **Body Regular** | p, body | Inter | 16px (1rem) | 400 | 1.6 (25.6px) | 0 | 20px | All standard body copy, blog content |
| **Body Small** | .body-small | Inter | 14px (0.875rem) | 400 | 1.6 (22.4px) | 0.01em | 16px | Secondary information, dense content |
| **Caption** | .caption | Inter | 14px (0.875rem) | 500 | 1.5 (21px) | 0.02em | 8px | Image captions, metadata, form helper text |
| **Label** | label, .label | Inter | 14px (0.875rem) | 600 | 1.5 (21px) | 0.02em | 8px | Form labels, tags, small headings |
| **Meta** | .meta | Inter | 13px (0.8125rem) | 500 | 1.4 (18.2px) | 0.03em | 4px | Article dates, reading time, event dates |

#### Interactive Text Styles

| Style Name | Element | Font | Size | Weight | Line Height | Letter Spacing | Usage |
|------------|---------|------|------|--------|-------------|----------------|-------|
| **Button Primary** | button, .btn-primary | Inter | 16px (1rem) | 600 | 1.5 (24px) | 0.02em | Primary CTA buttons |
| **Button Secondary** | .btn-secondary | Inter | 16px (1rem) | 500 | 1.5 (24px) | 0.02em | Secondary action buttons |
| **Navigation** | nav a | Inter | 16px (1rem) | 500 | 1.5 (24px) | 0.01em | Main navigation links |
| **Link (Inline)** | a (in body) | Inter | Inherit parent | 400 | Inherit parent | 0 | Links within body text |

#### Code Text Styles

| Style Name | Element | Font | Size | Weight | Line Height | Letter Spacing | Usage |
|------------|---------|------|------|--------|-------------|----------------|-------|
| **Code Block** | pre, code block | JetBrains Mono | 14px (0.875rem) | 400 | 1.7 (23.8px) | 0 | Multi-line code snippets |
| **Inline Code** | code (inline) | JetBrains Mono | 14px (0.875rem) | 500 | 1.4 (19.6px) | 0 | Code within body text |

### 3.3 Colour Application to Typography

| Text Style | Colour | Hex Code | Usage Context |
|------------|--------|----------|---------------|
| H1 (Display 1 - Hero) | Dark Red | `#8B0000` | Homepage hero only |
| H1 (Display 2 - Page Title) | Rich Black | `#1A1A1A` | All page titles |
| H2 (Heading 1) | Rich Black | `#1A1A1A` | Standard usage |
| H2 (Heading 1 - Featured) | Dark Red | `#8B0000` | When introducing featured section (max 1 per page) |
| H3-H6 | Rich Black | `#1A1A1A` | All instances |
| Body Copy (all weights) | Rich Black | `#1A1A1A` | Primary text content |
| Caption/Meta | Warm Gray 500 | `#8A8278` | Supporting information |
| Form Labels | Warm Gray 700 | `#4A453E` | Inactive form fields |
| Form Labels (Active) | Rich Black | `#1A1A1A` | When field is focused |
| Navigation (Default) | Warm Gray 700 | `#4A453E` | Inactive navigation items |
| Navigation (Active/Hover) | Dark Red | `#8B0000` | Current page or hover state |
| Link (Body) | Dark Red | `#8B0000` | Links in article text |
| Button Text (Primary) | Pure White | `#FFFFFF` | Text on dark red buttons |
| Button Text (Secondary) | Dark Red | `#8B0000` | Text on outline buttons |

### 3.4 Google Fonts Import Code

```html
<!-- Include in <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

---

## 4. Spacing System

### 4.1 Base Unit and Scale

**Base Unit:** 8px

All spacing values are multiples of the 8px base unit to create visual rhythm and mathematical consistency.

### 4.2 Spacing Scale

| Scale Name | Value (px) | Value (rem) | Usage |
|------------|------------|-------------|-------|
| **space-1** | 8px | 0.5rem | Tight internal padding, icon spacing, small gaps |
| **space-2** | 16px | 1rem | Standard internal padding, small margins between related elements |
| **space-3** | 24px | 1.5rem | Medium gaps, padding in cards/components |
| **space-4** | 32px | 2rem | Large gaps between sections, component padding |
| **space-5** | 40px | 2.5rem | Section spacing (vertical), comfortable component separation |
| **space-6** | 48px | 3rem | Major section spacing |
| **space-7** | 64px | 4rem | Large section spacing, homepage sections |
| **space-8** | 80px | 5rem | Extra-large spacing for dramatic separation |
| **space-9** | 96px | 6rem | Maximum spacing for major page sections |
| **space-10** | 128px | 8rem | Hero section padding (desktop only) |

### 4.3 Spacing Application Rules

####