---
name: coding-standard
description: Next.js App Router / TypeScript / Tailwind / shadcn conventions and architecture rules for this site, including how markdown content is loaded. Use when planning, writing, or reviewing application code.
---

# Coding Standard

## Purpose

Define the coding conventions and architectural guidelines for the project.

The goal is to ensure the codebase remains:

- consistent
- maintainable
- readable
- accessible

---

## Technology Stack

This project uses:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Markdown content stored in the repository

---

## Architectural Principles

### Prefer Simplicity

Solutions should favor clarity over cleverness.

Avoid unnecessary abstraction layers.

---

### Separate Concerns

Different responsibilities should live in different parts of the project.

Examples:

- routes, layouts, and API route handlers → `src/app`
- UI components → `src/components`
- domain logic and content loaders → `src/lib`
- markdown content (blogs, speaking, videos) → `src/data`
- static assets → `src/public`

---

### Prefer Established Libraries

Use a suitable, project-compatible library for standard concerns — Markdown parsing, frontmatter handling, content transformation, sanitisation — rather than writing a custom parser. The project already uses `gray-matter`, `unified`/`remark`/`rehype`, and `react-markdown`; reuse them.

Do not add a new dependency unless the implementation plan lists it.

---

### Content Is Local Markdown

Site content lives as markdown files with frontmatter under `src/data/`. Loaders in `src/lib/` read, validate, and sort it.

- extend the existing loaders rather than adding a parallel content-reading path
- validate frontmatter explicitly and handle missing optional fields
- do not hard-code content into components that should render it from `src/data/`

---

### Prefer Server Components

Use server components by default.

Client components should only be used when:

- browser APIs are required
- interactive state is required

---

## TypeScript Rules

- All exported functions must be typed.
- Avoid the use of `any`.
- Prefer narrow types over broad ones.
- Shared types should live in `src/lib`.

---

## Component Design Rules

Components should:

- have a single responsibility
- be composable
- avoid excessive nesting

Reusable components should live in `src/components`.

---

## Styling Rules

Styling should primarily use Tailwind utilities.

Avoid:

- large custom CSS files
- deeply nested selectors
- inconsistent spacing systems

---

## Accessibility Rules

All UI must maintain basic accessibility standards:

- semantic HTML should be used
- headings should follow a logical hierarchy
- form inputs must have labels
- interactive elements must be keyboard accessible

---

## Anti-Patterns

Avoid:

- mixing business logic into UI components
- untyped helper functions
- duplicating utility logic
- overly complex component trees
- writing a custom parser for a format an existing dependency already handles
- editing generated or vendored shadcn/ui primitives in place when a wrapper would do
