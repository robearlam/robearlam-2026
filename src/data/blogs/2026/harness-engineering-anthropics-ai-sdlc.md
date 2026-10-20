---
title: "Harness Engineering: Anthropic's AI SDLC"
slug: "harness-engineering-anthropics-ai-sdlc"
publishDate: "2026-10-20"
disqusId: "harness-engineering-anthropics-ai-sdlc"
abstract: "I've rebuilt my harness around Claude Code rather than keeping it IDE-agnostic. Here's what changed, what that buys me, and how Anthropic's AI-native SDLC playbook echoes the approach I've been documenting since April."
tags: ['AI Development', 'Harness Engineering', 'Agentic AI']
heroImage: "/img/blog-images/2026/ai-sdlc-loop.jpg"
---

---

This post is part of my series deep diving into **Harness Engineering**. You can find all of the posts in the series so far below:
- [An Introduction to Harness Engineering](/blog/an-introduction-to-harness-engineering)
- [Harness Engineering: Agents and Roles](/blog/harness-engineering-agents-and-roles)
- [Harness Engineering: Artifacts, Inputs and Context](/blog/harness-engineering-artifacts-inputs-and-context)
- [Harness Engineering: Orchestration and execution tracking](/blog/harness-engineering-orchestration-and-execution-tracking)
- [Harness Engineering: Running the pipeline end-to-end](/blog/harness-engineering-running-the-pipeline-end-to-end)
- Harness Engineering: Anthropic's AI SDLC

---

When I last wrote about **Harness Engineering** back in May, I walked through taking a backlog item all the way through specification, design, planning, build and QA. The idea was to stop treating AI development as one enormous conversation and instead give each stage a clear responsibility, defined inputs and an artifact to hand to the next stage.

That was a few months ago now, and things have moved on a bit since then. I've been evolving the harnesses that I'm using, so I figured it was probably time for an update.

In my original introduction in April, I called out **IDE independence** as a benefit. I kept the workflow in shared role files, with thin adapters for Claude, Cursor and GitHub Copilot. It meant I could change tools without rewriting the whole process. I've recently moved away from that. The harness in this repo now runs solely on **Claude Code**, using its native agents, skills, settings and hooks.

So why did I reverse something I'd previously described said was one of the advantages of this approach? Because sharing instructions between tools isn't the same thing as getting the same execution behaviour from them.

## From portable instructions to native execution

The old structure separated the agent definitions from the role definitions. That made sense for portability, but it also meant maintaining three sets of adapters and several documents describing how the workflow should behave.

There was a more important problem with the Claude implementation: the adapters lived in `.claude/commands/`. Those were slash commands, not isolated subagents. The stages ran inline in the main conversation, so by the time Build started, the conversation already contained the orchestrator's reading and the work from the earlier stages.

I'd described bounded context as a key benefit of the approach, and I realised that with the advances in the *off the shelf harnesses* I was builting on top of, I could get that benefit much more simply by choosing a single IDE to work with and aligning to its native tooling.

The workflow is still recognisable:

```text
Task definition
  -> Specification
  -> Design
  -> Implementation plan
  -> Build and tests
  -> Correctness review
  -> QA
  -> Human approval
```

The difference is that more of the structure now comes from the runtime and executable checks, rather than instructions asking the model to maintain that structure itself.

## What changed in the harness?

### Standards became skills

The coding, testing and UI design standards now live in `.claude/skills/`. Each stage agent preloads only the skills it needs through its frontmatter.

Previously, a stage loaded well over a thousand lines of roles, standards and templates before doing any actual work. Much of that was repeated workflow guidance. The new agent definitions are around 40 to 80 lines each, supplemented by the relevant skills and task inputs.

That doesn't mean the whole context is only 80 lines, it means the agent's own definition is smaller, with less duplicated guidance and a clearer separation between its job and the standards it applies.

It also lets me assign models by role much more easily. Design, technical planning and QA use Opus, while specification and implementation use Sonnet. I can make that trade-off explicitly rather than giving every stage the same configuration.

### The state machine became a script

One of the key changes I made though was to pivot the Orchestrator away from being an Agent, to now being a Skill instead. The orchestrator still needs judgment: which findings matter, whether a request changes the specification, and what information needs carrying forward. But deciding whether Build can advance to QA is largely a state-machine problem.

That machinery now lives in the `harness-state` script. It owns stage transitions, run IDs, retry limits, workflow modes and the recorded run history. The `/run-task` skill handles orchestration, while the script refuses invalid transitions.

I'm no longer asking an LLM to repeatedly interpret several pages of process rules to work out whether a transition is legal. Code handles the mechanical part; the model handles the judgment.

### Verification happens at the handoff

A `SubagentStop` hook runs artifact verification when a stage agent finishes. The verifier checks that the expected file exists, isn't empty and contains the required headings. The state script verifies the artifact again before advancing.

That's a structural check, not proof that the specification is good or the feature works. Tests, review and human judgment still have jobs to do. But it does mean that saying "I've finished the design note" isn't enough to move the pipeline forward when the note is missing.

A `SessionStart` hook also loads the live execution state, helping a new session pick up the current task rather than reconstructing it from conversation history.

### Governance moved into configuration

Claude Code's settings now deny file-tool edits to the harness control files and protect environment files. Changes to task definitions and the backlog, and a `git push`, prompt for permission. The `/approve` skill is human-invoked rather than something the model can choose to run itself.

There are limits here. The repo's decision record explicitly notes that file-tool permission rules don't block shell redirection into protected paths. This isn't a complete sandbox or an enterprise security boundary, but I've found its been good enough to work for my use cases.... so far anyway!

Still, there's a useful distinction between a rule written in a prompt and a restriction applied by the runtime. For the controls covered by those settings, I've moved from asking the agent not to do something to configuring the tool to refuse it.

### Review got a clearer stopping point

Before QA, the orchestrator now runs the built-in `/code-review high` correctness pass against the files changed by the task. The run records a base commit, so the review stays scoped even when the task didn't start directly from `main`.

QA then checks those findings against the specification. Broken acceptance criteria in normal use, security issues, regressions and task-caused validation failures block progress. Refactoring suggestions and other non-blocking findings become candidate follow-up work for me to consider.

That matters because an agent can always suggest another improvement. Without a consistent severity bar, a bounded delivery loop can become an endless polishing exercise. There are at most three Build passes before the run stops as blocked, I've generally found that most tasks are done in 1 or 2 passes and if it's trying to go past a third then there's something wrong with something earlier in the workflow like the task definition, or spec and the Human should step in at this point.

## What do I get out of giving up portability?

The immediate benefits are structural: fewer adapter files to maintain, less repeated instruction text, genuine context isolation between stages, and deterministic checks around workflow progression.

The boundaries are also easier to explain. An agent owns a stage. An artifact carries the handoff. A script owns execution state. Settings and hooks provide specific controls. I remain responsible for approval.

All of this has lead to a much smaller required token window for the tasks being executed, and I'm noticing that I seem to get much more output from my Claude Pro account than I was doing previously.

There is a cost however. If I wanted to pivot and use a different IDE again that would now require adapting the enforcement layer, not just adding a thin agent file. For now, it's a trade off I'm happy to make, but with the pace of change in this area, it's something I'm going to keep reviewing moving forwards.

## How this compares with Anthropic's AI-native SDLC playbook

While making these changes, I also read [The AI-native SDLC playbook](https://claude.com/resources/articles/the-ai-native-sdlc-playbook), by Louis Claxton, dated 21 August 2026.

Its central argument is that making code generation faster isn't enough. Planning, handoffs, verification and governance need to change too, otherwise they become the bottleneck around the build phase.

That felt very familiar after writing this series since April. The strongest similarities aren't the names of the agents. They're the mechanisms connecting the stages:

| Approach in this series and repo | Corresponding approach in the playbook |
| --- | --- |
| A task definition captures scope and intent before delivery starts. | An `intent.md` captures the problem, outcome and constraints. |
| Specification, design and implementation-plan artifacts guide later stages. | Version-controlled intent, spec and plan artifacts carry decisions into implementation. |
| Agents have narrow responsibilities and bounded inputs. | Scoped subagents have their own context windows and tool limits. |
| Coding, testing and design standards are shared, versioned guidance. | Skills encode institutional knowledge alongside the code. |
| Tests, correctness review and QA provide feedback before approval. | Agents verify their work and review findings inform human judgment. |
| Hooks, settings and the state script check specific workflow boundaries. | Deterministic guardrails back advisory instructions and preserve approval gates. |

The artifact chain is the clearest connection. In my [post on artifacts, inputs and context](/blog/harness-engineering-artifacts-inputs-and-context), I described outputs from one agent becoming the explicit inputs for another. The playbook makes that same principle central to its lifecycle: durable artifacts carry the decisions forward and provide an audit trail.

The shift in human involvement is familiar too. In my May walkthrough, I wasn't manually starting and supervising every stage. The orchestrator coordinated the work, and I came back to review the result. The playbook similarly moves human attention towards intent, risk and approval rather than supervising every edit.

## A shared direction, not an identical system

It's aways nice to see big players like Anthropic, advocating for the same agentic flow that I have been discovering on my own as well. I didn't invent this approach though, my first post mentioned OpenAI's [harness engineering article](https://openai.com/index/harness-engineering/) as the inspiration for rebuilding this site. Anthropic's playbook is another concrete example of major vendors describing development as a managed lifecycle around agents, rather than simply faster code completion.

If you want to see the workflow I'm using to build out this site, then it's all available in my [GitHub Repo
](https://github.com/robearlam/robearlam-2026/)
