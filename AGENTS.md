# Agent modes (Cursor)

The **canonical**, IDE-agnostic workflow definitions live in `harness/` (roles, standards, templates) and in `.github/agents/*.agent.md` (thin wrappers for GitHub Copilot–style agents).

For **Cursor**, each GitHub agent has a matching project rule under [`.cursor/rules/`](.cursor/rules/):

| Stage | GitHub agent | Cursor rule |
|--------|----------------|-------------|
| Orchestration | `orchestrator` | [`orchestrator.mdc`](.cursor/rules/orchestrator.mdc) |
| Specification | `po-spec` | [`po-spec.mdc`](.cursor/rules/po-spec.mdc) |
| Design | `feature-design` | [`feature-design.mdc`](.cursor/rules/feature-design.mdc) |
| Implementation planning | `tech-lead` | [`tech-lead.mdc`](.cursor/rules/tech-lead.mdc) |
| Build | `build` | [`build.mdc`](.cursor/rules/build.mdc) |
| QA | `qa` | [`qa.mdc`](.cursor/rules/qa.mdc) |

**How to use:** Attach the rule that matches the current stage (or use orchestrator when driving the full pipeline). Always treat [`harness/run-state.md`](harness/run-state.md) as live execution state and read [`harness/README.md`](harness/README.md) for harness structure.

Content in `.cursor/rules/*.mdc` mirrors the corresponding `.github/agents/*.agent.md` bodies; deeper behavior remains in `harness/roles/*-agent.md` and related standards.
