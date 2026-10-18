# Harness Decisions

Why the harness looks the way it does. Each entry records what was chosen, why, what was rejected, and when to revisit it.

---

## D-001: Claude Code is the only runtime — enforce with native agents, settings, and hooks

**What we chose (2026-10-19):** Drop GitHub Copilot and Cursor support and rebuild the harness on built-in Claude Code features, aligning it with the SitecoreAI harness-engineering reference repo (its D-001 to D-003). That reverses B013, which had made the harness IDE-agnostic.

1. **Stage agents.** Each role in `harness/roles/` was merged into a `.claude/agents/*.md` subagent, trimmed, with its input contract written into the agent's Inputs section. `harness/standards/stage-input-contracts.md` is gone.
2. **Standards as skills.** The coding and testing standards moved to `.claude/skills/`. The two design-system documents (`harness/design-system/design-system.md` and `harness/standards/ui-design-system.md`) and the UI Designer role were merged into one `ui-design-system` skill. The site's real palette, dark-mode tokens, and layout widths came from the first. The second added the shadcn/ui guidance, and the role added the process for changing the system. Each agent preloads only the skills its old contract allowed, through `skills:` frontmatter.
3. **Orchestrator as skill + script.** The orchestrator role and the four process standards (`feature-workflow.md`, `task-lifecycle.md`, `run-state-standard.md`, `run-id-standard.md`) are gone. The mechanics moved into `.claude/skills/run-task/scripts/harness-state`, which owns every run-state transition, run IDs (`-N`, `-REVN`), stage order, workflow modes, the approval gates, the 3-pass Build retry limit, artifact verification, the commit checks, and the task branch. The judgment moved into the `/run-task` skill: dispatch prompts, carry-forwards, outcome triage, and amendments.
4. **Human gate.** `/approve` is set so Claude cannot invoke it; only the human can. It records only what the human actually stated.
5. **Governance by configuration.** `.claude/settings.json` denies edits to agents, skills, hooks, templates, and run-state, and denies reading or editing `.env`/`.env.local`. It prompts on edits to tasks and the backlog and on `git push`, and allows the pnpm validation commands without prompting.
6. **Hooks.** SubagentStop runs `harness/verify-stage.sh` when a stage agent finishes and sends it back once to repair a failure. SessionStart injects the run-state Execution State block and warns when pnpm or `src/node_modules` is missing.
7. **Correctness pass.** Before QA, `/run-task` runs the built-in `/code-review high` on the task's changes and passes its findings to QA, which confirms or rejects each against the spec.
8. **Build commits its own work** on a per-task `feature/` branch, and the state script refuses to advance it with uncommitted code. `harness/run-state.md` is now tracked in git (it was ignored) so Build can commit it with the task.
9. **One task setting** shapes the stage sequence: `Workflow: Lightweight` skips Design.
10. **Run reports are per task**, at `harness/runs/TASKID-run-report.md`, with Stage History written by the state script. Historic reports (T001–T015) keep their `RUN-<date>-TASKID.md` names; they are a record, not inputs.

**Adapted from the reference:**

- **No CMS Configuration stage.** The reference delivers into Sitecore XM Cloud and has a `cms-config` agent, guide template, and verification step. This site's content is local markdown, so the stage, its task setting, its template, and the Sitecore-specific deny rules were left out.
- **pnpm, run from `src/`.** Build and QA validate with `lint`, `typecheck`, `test`, and `build`, plus `test:e2e` when end-to-end coverage is affected. The old Build role already ran `typecheck`; the reference has no equivalent.
- **Point task IDs.** This repo uses follow-up IDs such as `T009.1`. The hooks' task-ID parsing accepts the dot, and `/new-task` allocates whole IDs unless asked for a follow-up.
- **Library-over-parser rule.** The old Tech Lead and Build roles both said to use established libraries rather than custom Markdown/frontmatter parsers. That rule now lives in the coding standard, and both agents point to it.

**Why:**

- `.claude/commands/` are slash commands, not subagents, so under Claude Code every stage ran inline in the main conversation. By Build, the context held the orchestrator's reading plus every earlier stage's. Real subagents give each stage its own bounded context.
- Each stage loaded well over a thousand lines of role, standards, and templates before doing any work, much of it the same workflow rules restated across four process standards. The agents are now 40–80 lines each plus only the skills they need.
- Run-state transitions are a state machine. Asking a model to re-derive them from prose on every step cost tokens and invited drift. The script is deterministic and refuses invalid transitions.
- Rules enforced by configuration — artifact verification, protected paths, human-only gates — no longer depend on the model obeying prose.
- Three hand-synced adapter sets (`.github/agents`, `.cursor/rules`, `.claude/commands`) were a maintenance tax with no runtime benefit.

**Known limits:**

- Permission rules govern the file tools, not shell redirection, so a `Bash` write into a protected path is not blocked.
- Harness changes now require lifting the relevant deny rule temporarily.
- The state script's uncommitted-changes check counts untracked files too, so stray files in the working tree block Build from advancing.

**What we rejected:**

- **Keeping multi-tool support as thin pointers.** Hooks and settings only enforce anything under Claude Code, so the other tools would silently get a weaker harness.
- **A full Code Review stage agent.** QA already reviews conformance; the built-in `/code-review` pass covers runtime correctness at a fraction of the cost.
- **Renaming historic run reports** to the new convention. It would rewrite history for no runtime benefit.

**When to revisit:** If a second runtime becomes important again, or if B015 (security agent) is picked up — it may fit as a pre-QA pass alongside `/code-review` rather than a new stage.

---

## D-002: Task definitions are created with the /new-task skill

**What we chose (2026-10-19):** A human-invoked `/new-task` skill creates task files from a backlog ID or a short description. It allocates the next `T###` ID, fills the task template, chooses `Workflow` with stated reasoning, and updates the backlog. The task template was expanded to match the task files actually written (Scope, Dependencies, Risks, Task Notes).

**Why:** Task files were copied from the template by hand. Nothing allocated IDs or checked the workflow setting, the template was thinner than the real task files, and the backlog drifted — T015's notes record a duplicate B017 ID that had to be corrected by hand. The task file is the boundary every later stage works within, so it deserves the same consistency as the stage artifacts.

**What we rejected:**

- **A task-writing stage agent dispatched by `/run-task`.** Creating a task is a human decision about what to build next, made before a run exists; it doesn't belong inside the run.
- **Generating acceptance criteria in full.** That is the Specification stage's job; the task carries only the minimum.

**When to revisit:** If B019 moves the backlog to GitHub Issues — `/new-task` would then read and update issues instead of `backlog.md`.

---

## D-003: Explicit severity bar for QA, and a recorded base commit per run

**What we chose (2026-10-19):** Carried over from the reference harness, where both came out of a dry run.

1. **Severity rule.** The QA agent classifies every issue as blocking or non-blocking, and `/run-task` sends work back to Build only for blocking issues.
   - **Blocking:** an acceptance criterion broken in normal use, a security issue, a regression, or failing tests, lint, or type-check caused by the task.
   - **Non-blocking:** edge cases, refactoring suggestions, cleanups, and small design deviations. These are grouped into a candidate follow-up task for the human.
   - **Spec questions:** spec contradictions go to the human, never to Build.

   The bar is the same on every round.
2. **Base commit.** `harness-state init` records the commit HEAD was at before any task work. `harness-state review-scope` lists the files the task changed since then, outside `harness/`, and prints the `/code-review` invocation for exactly those files. Build's "made no commits" check counts from the base commit too.

**Why:**

- Without a defined bar, each `/code-review` pass surfaces new candidates and a task can burn all 3 Build passes on non-blocking findings. Prompt-dependent rules drift between runs; the agent definition is where they belong.
- Diffing against `main` only works when every task starts from `main`. A recorded base commit keeps the review scoped to the task on stacked or long-lived branches, and keeps Build's commit check honest there.

**What we rejected:**

- **Tightening the bar as Build passes run out.** That makes verdicts depend on run history instead of the code.
- **Letting `/code-review` diff against `main`.** See above.

**When to revisit:** If non-blocking findings pile up unaddressed in follow-up tasks.
