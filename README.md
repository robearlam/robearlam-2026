# robearlam-2026

Personal site for robearlam.com — a software engineering leadership blog with sections for writing, speaking engagements, and curated videos.

## Repository Structure

```
src/        Next.js application (the actual website)
harness/    Project operating system for feature delivery
```

## The App (`src/`)

Built with Next.js 16, React 19, and the App Router. Content is sourced from local markdown files in `src/data/`.

**Main sections:**
- `/` — editorial homepage
- `/blog` — paginated blog with tag and archive filtering
- `/speaking` — upcoming and past speaking engagements
- `/videos` — featured and paginated video archive
- `/contact` — contact page

See [src/README.md](src/README.md) for full details on routes, content model, and scripts.

### Quick Start

```bash
cd src
pnpm install
pnpm dev        # http://localhost:3000
```

### Scripts

```bash
pnpm dev          # development server
pnpm build        # production build
pnpm lint         # ESLint
pnpm typecheck    # TypeScript check
pnpm test         # Vitest unit tests
pnpm test:e2e     # Playwright end-to-end tests
```

## The Harness (`harness/`)

A stage-based workflow for AI-assisted feature delivery. It provides role definitions, standards, templates, and artifact folders so every feature moves safely from idea to approved implementation.

**Typical flow:** Specification → Design → Implementation Plan → Build → QA → Approval → Complete

**Key folders:**
- `harness/tasks/` — canonical task definitions
- `harness/artifacts/` — stage outputs (specs, designs, plans, QA reviews)
- `harness/runs/` — run logs and reports
- `harness/standards/` — coding, testing, and workflow standards
- `harness/roles/` — agent role definitions
- `harness/backlog/` — task intake and backlog

See [harness/README.md](harness/README.md) for full workflow documentation.
