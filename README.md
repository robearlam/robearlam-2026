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
├── .claude/
│   ├── agents/                 # Stage agents (po-spec, feature-design, tech-lead, build, qa)
│   ├── skills/                 # /new-task, /run-task orchestrator + state script, /approve, coding/testing/UI standards
│   ├── hooks/                  # Session-start context and stage-artifact verification
│   └── settings.json           # Governance: permission rules and hook wiring
├── harness/                    # Workflow records
│   ├── templates/              # Templates for all stage artifacts
│   ├── tasks/                  # Durable task definitions
│   ├── artifacts/              # Stage outputs (specs, designs, plans, QA reviews)
│   ├── runs/                   # Run reports for each task
│   ├── backlog/                # Future work items
│   ├── run-state.md            # Live workflow state (written only by the state script; created by the first run)
│   ├── decisions.md            # Why the harness looks the way it does
│   ├── README.md               # How the workflow runs
│   └── verify-stage.sh         # Deterministic artifact verification
├── src/                        # Next.js application (the actual website)
│   ├── app/                    # App Router routes, API routes, and tests
│   ├── components/             # UI components
│   ├── lib/                    # Content loaders and domain logic
│   ├── data/                   # Markdown content: blogs, speaking, videos
│   └── public/                 # Static assets and images
├── .github/workflows/          # Playwright end-to-end tests against a production build
├── CLAUDE.md                   # Entry point for Claude Code across the repo
└── SECURITY.md                 # Security reporting
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

### Prerequisites

- Node.js (current LTS, as used in CI)
- pnpm 10
- [Claude Code](https://claude.com/claude-code), to run the harness

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
pnpm test         # Vitest unit + integration tests
pnpm test:e2e     # Playwright end-to-end tests
```

## The Harness (`harness/` and `.claude/`)

Every feature on this site is delivered through a stage-based workflow for AI-assisted development, built on **Claude Code**. Each stage is a subagent, the orchestrator is a skill backed by a deterministic state script, and governance is enforced by Claude Code settings and hooks rather than by prose.

- **Stage-based workflow** — `/new-task` turns a backlog item into a task definition; `/run-task TASKID` takes it through Specification, Design, Implementation Planning, Build, and QA on a `feature/` branch; and a human closes it with `/approve`
- **Stage agents** — each stage is a Claude Code subagent with its own context, model, tools, and a bounded input contract
- **Deterministic state** — a script owns run-state, run IDs, stage order, approval gates, and retry limits, so the model only makes judgment calls
- **Enforced governance** — hooks verify every stage's artifact, and permission rules protect the harness and secrets
- **Correctness pass and severity bar** — a `/code-review` pass over the task's own changes feeds QA, and only blocking issues send work back to Build
- **Standards** — coding, testing, and design-system skills preloaded into the agents that need them
- **Traceability** — every decision and output is recorded in artifacts and run reports

Tasks with no new UI surface run the **Lightweight** workflow, which skips Design.

### Features Built Through the Harness

| Task | Description |
|------|-------------|
| T001 | Global site layout |
| T002 | Contact page |
| T003 | Blog |
| T004 | Editorial UI system |
| T006 | Blog Disqus integration |
| T007, T007.1 | Blog sidebar panels and refinements |
| T008 | Speaking engagements page |
| T009, T009.1 | Videos page and infinite-scroll paging |
| T010 | Homepage |
| T011 | SEO, AEO & GEO foundations |
| T012 | Auxiliary site protocols (RSS, sitemap, robots, WebFinger) |
| T013 | Blog hero images |
| T014 | Mermaid diagrams in blog posts |
| T015 | Dark mode |

T001–T015 were delivered on the earlier, multi-IDE version of the harness; `harness/decisions.md` (D-001) records the move to Claude Code.

### Claude Code Configuration

| What | Where |
|------|-------|
| Repo-wide instructions | `CLAUDE.md` |
| Stage agents | `.claude/agents/` |
| Task creation, orchestrator, approval gate, and standards | `.claude/skills/` |
| Hooks and governance rules | `.claude/hooks/`, `.claude/settings.json` |
| App routes, content model, and scripts | `src/README.md` |

To change how a stage behaves, edit its file in `.claude/agents/` — there is one definition per stage and nothing to keep in sync. Harness files are protected by deny rules in `.claude/settings.json`; see [harness/README.md](harness/README.md#modifying-the-harness-itself) for how harness changes are made.

See [harness/README.md](harness/README.md) for full workflow documentation and [CLAUDE.md](CLAUDE.md) for the operating rules.
