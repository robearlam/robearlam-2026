# robearlam-2026

[![Playwright Tests](https://github.com/robearlam/robearlam-2026/actions/workflows/playwright.yml/badge.svg?branch=main)](https://github.com/robearlam/robearlam-2026/actions/workflows/playwright.yml)

Personal site for [robearlam.com](https://robearlam.com) — a software engineering leadership blog with sections for writing, speaking engagements, and curated videos.

## About This Repository

This repository is published as a reference — primarily so blog posts on [robearlam.com](https://robearlam.com) can link to the actual code being discussed.

It is not maintained as a community project and isn't intended to be forked as a site template. External contributions are not actively sought, but feel free to open issues for discussion or fork the parts that are useful to you.

For security-related issues, please see [SECURITY.md](SECURITY.md).

## License

The **code and harness** in this repository are released under the [MIT License](LICENSE).

> **Content notice:** The blog posts (`src/data/`), personal images (`src/public/img/`), and all written content remain © Rob Earlam — all rights reserved. You are welcome to reference and link to the content, but please do not republish it as your own.

## Repository Structure

```
src/        Next.js application (the actual website)
harness/    Project operating system for feature delivery
```

## The App (`src/`)

Built with Next.js 16, React 19, and the App Router. Content is sourced from local markdown files in `src/data/`.

**Main sections:**
- `/` — editorial homepage with profile, latest posts, videos, and upcoming events
- `/blog` — paginated blog with tag and archive filtering
- `/blog/[slug]` — individual blog posts with hero images and Mermaid diagram support
- `/speaking` — upcoming and past speaking engagements
- `/videos` — featured and paginated video archive
- `/contact` — social profiles and community links

**Supporting routes:**
- `/rss` — RSS 2.0 feed
- `/llms-full.txt` — extended LLM-readable content index
- `/.well-known/webfinger` — ActivityPub/Mastodon identity discovery
- `/api/blog` and `/api/videos` — JSON API endpoints

See [src/README.md](src/README.md) for full details on routes, content model, and scripts.

### Quick Start

```bash
cd src
pnpm install
pnpm dev        # http://localhost:3000
```

### Environment Variables

Create `src/.env.local` with the following (all optional — the site works without them):

```
NEXT_PUBLIC_SITE_URL=https://robearlam.com          # canonical URL for SEO/OG tags
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX          # Google Analytics 4 measurement ID
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
