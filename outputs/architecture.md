# Technical Architecture Document
## Personal Portfolio & Blog Website — Next.js 16

**Document Version:** 1.0  
**Date:** January 2025  
**Author:** Senior Software Architect  
**Status:** Final Architecture for Development

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Project Folder Structure](#2-project-folder-structure)
3. [Component Breakdown](#3-component-breakdown)
4. [Page Breakdown](#4-page-breakdown)
5. [TypeScript Interfaces and Types](#5-typescript-interfaces-and-types)
6. [Routing Plan](#6-routing-plan)
7. [Tailwind Configuration](#7-tailwind-configuration)
8. [Third-Party Packages](#8-third-party-packages)
9. [Environment Variables](#9-environment-variables)
10. [Build and Run Instructions](#10-build-and-run-instructions)
11. [Architectural Decision Log](#11-architectural-decision-log)

---

## 1. Executive Summary

This architecture defines a statically-generated Next.js 16 personal website with MDX-based content management. The design prioritises:

- **Performance:** Static generation with ISR fallback meets NFR-01 through NFR-05
- **Maintainability:** Clear separation between content, components, and pages
- **Content authoring:** MDX files with frontmatter enable FR-19 through FR-25 without deployments via webhook-triggered rebuilds
- **SEO:** Built-in metadata API, structured data components, sitemap generation satisfy NFR-16 through NFR-28
- **Accessibility:** Semantic HTML components, ARIA patterns, and focus management address NFR-07 through NFR-15

**Key Architectural Choices:**

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Content storage | MDX files in repo | Owner controls content, version history, no external CMS costs, supports FR-22/FR-23 code blocks |
| Styling | Tailwind CSS | Direct mapping from UI spec, utility-first matches design tokens |
| Date-based routing | `/blog/[year]/[month]/[slug]` | Supports large historical archives, SEO-friendly URLs |
| Form handling | Server Actions + Resend | No external form service, rate limiting via middleware |
| Deployment | Vercel | Native Next.js support, edge functions, preview deployments |

---

## 2. Project Folder Structure

```
portfolio-website/
├── .env.local                      # Local environment variables (gitignored)
├── .env.example                    # Template for environment variables
├── .eslintrc.json                  # ESLint configuration
├── .gitignore
├── .prettierrc                     # Prettier configuration
├── next.config.ts                  # Next.js configuration
├── package.json
├── pnpm-lock.yaml                  # Lock file (using pnpm)
├── postcss.config.js               # PostCSS for Tailwind
├── tailwind.config.ts              # Tailwind configuration (maps UI spec)
├── tsconfig.json                   # TypeScript configuration
├── README.md
│
├── content/                        # All MDX content files
│   ├── blog/                       # Blog posts organised by date
│   │   ├── 2024/
│   │   │   ├── 01/
│   │   │   │   └── building-resilient-systems.mdx
│   │   │   ├── 03/
│   │   │   │   └── typescript-best-practices.mdx
│   │   │   └── 12/
│   │   │       └── year-in-review.mdx
│   │   └── 2025/
│   │       └── 01/
│   │           └── architecture-principles.mdx
│   │
│   ├── speaking/                   # Speaking engagements by date
│   │   ├── 2024/
│   │   │   ├── 06/
│   │   │   │   └── react-summit-keynote.mdx
│   │   │   └── 11/
│   │   │       └── tech-conf-workshop.mdx
│   │   └── 2025/
│   │       └── 03/
│   │           └── upcoming-conference.mdx
│   │
│   └── pages/                      # Static page content
│       ├── about.mdx               # About page biography content
│       └── privacy.mdx             # Privacy policy content
│
├── public/                         # Static assets
│   ├── fonts/                      # Self-hosted fonts (optional fallback)
│   ├── images/
│   │   ├── profile/
│   │   │   └── headshot.jpg        # Professional photo
│   │   ├── blog/                   # Blog post images
│   │   │   └── 2024/
│   │   │       └── 01/
│   │   │           └── resilient-systems-hero.jpg
│   │   ├── speaking/               # Speaking event images
│   │   └── og/                     # Open Graph images
│   │       └── default-og.jpg
│   ├── favicon.ico
│   ├── apple-touch-icon.png
│   ├── robots.txt
│   └── site.webmanifest
│
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx              # Root layout (fonts, metadata, analytics)
│   │   ├── page.tsx                # Homepage (P1)
│   │   ├── not-found.tsx           # 404 page (P7)
│   │   ├── error.tsx               # Error boundary
│   │   ├── loading.tsx             # Global loading state
│   │   ├── globals.css             # Global styles + Tailwind imports
│   │   │
│   │   ├── about/
│   │   │   └── page.tsx            # About page (P2)
│   │   │
│   │   ├── blog/
│   │   │   ├── page.tsx            # Blog index (P3)
│   │   │   ├── [year]/
│   │   │   │   └── [month]/
│   │   │   │       └── [slug]/
│   │   │   │           └── page.tsx  # Blog article (P4)
│   │   │   └── category/
│   │   │       └── [category]/
│   │   │           └── page.tsx    # Blog category filter (P8)
│   │   │
│   │   ├── speaking/
│   │   │   ├── page.tsx            # Speaking index (P5)
│   │   │   └── [year]/
│   │   │       └── [month]/
│   │   │           └── [slug]/
│   │   │               └── page.tsx  # Speaking detail page
│   │   │
│   │   ├── contact/
│   │   │   ├── page.tsx            # Contact page (P6)
│   │   │   └── actions.ts          # Server actions for form
│   │   │
│   │   ├── privacy/
│   │   │   └── page.tsx            # Privacy policy (P9)
│   │   │
│   │   ├── api/
│   │   │   └── revalidate/
│   │   │       └── route.ts        # Webhook for content revalidation
│   │   │
│   │   └── sitemap.ts              # Dynamic sitemap generation
│   │
│   ├── components/
│   │   ├── layout/                 # Layout components
│   │   │   ├── Header.tsx          # Site header with navigation
│   │   │   ├── Footer.tsx          # Site footer
│   │   │   ├── Navigation.tsx      # Main navigation component
│   │   │   ├── MobileMenu.tsx      # Mobile navigation drawer
│   │   │   ├── SkipLink.tsx        # Skip to main content link
│   │   │   └── Container.tsx       # Max-width wrapper
│   │   │
│   │   ├── ui/                     # Reusable UI components
│   │   │   ├── Button.tsx          # Button variants (primary/secondary)
│   │   │   ├── Card.tsx            # Content card with hover states
│   │   │   ├── Badge.tsx           # Tags and categories
│   │   │   ├── Input.tsx           # Form input component
│   │   │   ├── Textarea.tsx        # Form textarea component
│   │   │   ├── FormField.tsx       # Label + input wrapper
│   │   │   ├── Alert.tsx           # Success/error messages
│   │   │   ├── Divider.tsx         # Horizontal rule
│   │   │   ├── Icon.tsx            # Icon wrapper component
│   │   │   └── LoadingSpinner.tsx  # Loading indicator
│   │   │
│   │   ├── home/                   # Homepage-specific components
│   │   │   ├── Hero.tsx            # Hero section
│   │   │   ├── ProfessionalSummary.tsx
│   │   │   ├── FeaturedPosts.tsx   # Featured blog articles
│   │   │   ├── SpeakingHighlight.tsx
│   │   │   └── HomeCTA.tsx         # Homepage call-to-action
│   │   │
│   │   ├── about/                  # About page components
│   │   │   ├── ProfilePhoto.tsx    # Optimised headshot
│   │   │   ├── Biography.tsx       # Biography content
│   │   │   ├── ExpertiseList.tsx   # Areas of expertise
│   │   │   ├── CareerHighlights.tsx
│   │   │   └── AboutCTA.tsx        # About page CTAs
│   │   │
│   │   ├── blog/                   # Blog components
│   │   │   ├── BlogPostCard.tsx    # Article preview card
│   │   │   ├── BlogPostList.tsx    # List of post cards
│   │   │   ├── BlogPostHeader.tsx  # Article title, meta, hero
│   │   │   ├── BlogPostContent.tsx # MDX rendered content
│   │   │   ├── BlogPostMeta.tsx    # Date, reading time, category
│   │   │   ├── CategoryFilter.tsx  # Category/tag filter
│   │   │   ├── TableOfContents.tsx # Auto-generated TOC
│   │   │   └── ShareButtons.tsx    # Social sharing (FR-18)
│   │   │
│   │   ├── speaking/               # Speaking components
│   │   │   ├── SpeakingEventCard.tsx
│   │   │   ├── SpeakingEventList.tsx
│   │   │   ├── UpcomingEvents.tsx  # Upcoming engagements section
│   │   │   ├── PastEvents.tsx      # Past engagements section
│   │   │   └── EventStatusBadge.tsx # Upcoming/Past indicator
│   │   │
│   │   ├── contact/                # Contact components
│   │   │   ├── ContactForm.tsx     # Form with validation
│   │   │   ├── ContactInfo.tsx     # Social links, email
│   │   │   └── SocialLinks.tsx     # Social profile buttons
│   │   │
│   │   ├── seo/                    # SEO components
│   │   │   ├── JsonLd.tsx          # Structured data wrapper
│   │   │   ├── PersonSchema.tsx    # Person JSON-LD
│   │   │   ├── BlogPostSchema.tsx  # BlogPosting JSON-LD
│   │   │   └── EventSchema.tsx     # Event JSON-LD
│   │   │
│   │   └── mdx/                    # MDX component overrides
│   │       ├── MDXComponents.tsx   # Component mapping for MDX
│   │       ├── CodeBlock.tsx       # Syntax highlighted code
│   │       ├── InlineCode.tsx      # Inline code styling
│   │       ├── Heading.tsx         # Heading with anchor links
│   │       ├── Image.tsx           # Optimised MDX images
│   │       ├── Callout.tsx         # Info/warning callouts
│   │       └── Link.tsx            # Smart link component
│   │
│   ├── lib/                        # Utility libraries
│   │   ├── content/
│   │   │   ├── blog.ts             # Blog content fetching
│   │   │   ├── speaking.ts         # Speaking content fetching
│   │   │   ├── pages.ts            # Static pages content
│   │   │   └── mdx.ts              # MDX parsing utilities
│   │   │
│   │   ├── utils/
│   │   │   ├── date.ts             # Date formatting utilities
│   │   │   ├── reading-time.ts     # Calculate reading time
│   │   │   ├── slug.ts             # Slug generation/parsing
│   │   │   └── cn.ts               # Tailwind class merging
│   │   │
│   │   ├── validators/
│   │   │   └── contact.ts          # Zod schemas for form validation
│   │   │
│   │   └── constants/
│   │       ├── site.ts             # Site-wide constants
│   │       ├── navigation.ts       # Navigation items
│   │       └── social.ts           # Social media links
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── useMediaQuery.ts        # Responsive breakpoints
│   │   ├── useFocusTrap.ts         # Focus trap for modals
│   │   └── useScrollProgress.ts    # Reading progress indicator
│   │
│   └── types/                      # TypeScript type definitions
│       ├── blog.ts                 # Blog post types
│       ├── speaking.ts             # Speaking event types
│       ├── content.ts              # Generic content types
│       └── forms.ts                # Form data types
│
└── scripts/                        # Build scripts
    └── generate-og-images.ts       # OG image generation script
```

---

## 3. Component Breakdown

### 3.1 Layout Components

#### `Header.tsx`

**Purpose:** Site-wide header containing logo/name, primary navigation, and mobile menu toggle.

**Visual Design Elements:**
- Navigation links use `Warm Gray 700` (#4A453E) default, `Dark Red` (#8B0000) on hover/active
- Font: Inter 500, 16px
- Height: 80px on desktop (space-10), 64px on mobile (space-8)

```typescript
interface HeaderProps {
  /** Whether header should have transparent background (for hero pages) */
  transparent?: boolean;
}
```

**Child Components:** `Navigation`, `MobileMenu`, `SkipLink`

---

#### `Navigation.tsx`

**Purpose:** Main navigation links with active state indicator.

**Visual Design Elements:**
- Active state: 3px border-bottom in `Dark Red` (#8B0000)
- Hover transition: 200ms ease
- Links spaced with `space-6` (48px)

```typescript
interface NavigationProps {
  /** Current pathname for active state */
  currentPath: string;
  /** Vertical layout for mobile menu */
  orientation?: 'horizontal' | 'vertical';
}

interface NavItem {
  label: string;
  href: string;
}
```

---

#### `MobileMenu.tsx`

**Purpose:** Slide-out mobile navigation drawer (< 768px).

**Visual Design Elements:**
- Full-height overlay with `Warm Gray 100` (#F8F6F4) background
- Entry animation: slide from right, 300ms ease-out
- Close button: 44x44px touch target (NFR-32)

```typescript
interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
}
```

**Accessibility:** Focus trap when open (useFocusTrap hook), ESC to close, aria-modal.

---

#### `