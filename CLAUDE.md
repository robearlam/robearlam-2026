# CLAUDE.md

## Project Overview

This repository is Rob Earlam's personal site, [robearlam.com](https://robearlam.com), built with Next.js and delivered through a **custom AI development harness** on Claude Code. Every feature moves through a stage-based workflow (Specification → Design → Implementation Planning → Build → QA → Approval → Complete), with full traceability of every stage's inputs and outputs.

The repo has two distinct concerns:

- **`harness/` and `.claude/`** — the workflow itself: stage agents, skills, hooks, templates, tasks, artifacts, and run state.
- **`src/`** — the Next.js 16 / React 19 App Router application. Content is local markdown in `src/data/`. See [`src/README.md`](src/README.md) for routes, the content model, and scripts.

## How work flows through this repo

Every feature is delivered through the harness. `/new-task` turns a backlog item into a task definition, and `/run-task TASKID` makes the main session the orchestrator: it dispatches one stage agent per stage from `.claude/agents/`, and the human closes the gates with `/approve`. Before doing feature work, read `harness/README.md`.

| You want to… | Read… |
|---|---|
| Understand the workflow | `harness/README.md` |
| See how the orchestrator decides | `.claude/skills/run-task/SKILL.md` |
| Understand *why* the harness looks the way it does | `harness/decisions.md` |
| See what each stage agent does and may read | `.claude/agents/*.md` |
| See the coding, testing, or UI design standards | `.claude/skills/*/SKILL.md` |
| See the current live workflow state | `harness/run-state.md` |

## Repository Structure

```
.claude/agents/      Stage agents — role, input contract, model, tools, preloaded skills
.claude/skills/      /new-task, /run-task (orchestrator + state script), /approve, and the standards
.claude/hooks/       SessionStart (run-state context) and SubagentStop (artifact verification)
.claude/settings.json  Governance: permission allow/deny rules and hook wiring
harness/             Templates, tasks, artifacts, run reports, run state, decisions
src/                 Next.js App Router application (content in src/data/)
.github/workflows/   CI: Playwright end-to-end tests against a production build
```

## Setup, Build, and Test Commands

The app uses pnpm. Run from the repo root with `--dir src`, or from `src/` directly:

```bash
pnpm --dir src install
pnpm --dir src dev          # dev server on http://localhost:3000
pnpm --dir src build        # production build
pnpm --dir src lint         # ESLint
pnpm --dir src typecheck    # tsc --noEmit
pnpm --dir src test         # Vitest unit + integration tests
pnpm --dir src test:e2e     # Playwright end-to-end tests
```

## Operating rules

**Workflow state lives in `harness/run-state.md` and only there.** Only the `harness-state` script updates it — never by hand, and never from a stage agent. Task files under `harness/tasks/` are durable definitions and change only when the human asks.

**Governance is enforced by `.claude/settings.json`.** Edits to agents, skills, hooks, templates, and run-state are denied. Change the harness only when the human explicitly asks for a harness change — and the human, not Claude, lifts the relevant deny rule.

**Stay within your stage's input contract.** Each stage agent's Inputs section lists what it may read. If a required input is missing, escalate — do not search the codebase to fill the gap.

**Artifacts are verified, not narrated.** A stage is done only when its artifact exists at the canonical path and passes `harness/verify-stage.sh`. A hook runs it when each stage agent finishes, and the state script runs it again before advancing.

**Use the canonical artifact paths.**

- Specs → `harness/artifacts/specs/TASKID-feature-spec.md`
- Design notes → `harness/artifacts/design/TASKID-design-note.md`
- Plans → `harness/artifacts/plans/TASKID-implementation-plan.md`
- QA reviews → `harness/artifacts/qa/TASKID-qa-review.md`
- Run reports → `harness/runs/TASKID-run-report.md`

## Security Considerations

- Never commit `.env` or `.env.local` files; `.claude/settings.json` denies reading and editing them. The site's environment variables are optional (see the root `README.md`).
- Rendered markdown goes through `rehype-sanitize`; keep it that way when touching the Markdown pipeline.
- CI (`.github/workflows/playwright.yml`) runs end-to-end tests only — there is no dependency or secret scanning in the pipeline (backlog item B015 proposes one). Flag this if asked to harden it.
