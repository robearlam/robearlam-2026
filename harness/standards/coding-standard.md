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

- UI components → `src/components`
- domain logic → `src/lib`
- content files → `src/content`

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