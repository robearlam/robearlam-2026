---
name: new-task
description: Create a harness task definition in harness/tasks/ from a backlog item or a short feature description — allocates the next task ID, fills the task template, sets the workflow mode, and updates the backlog. Pass a backlog ID (e.g. B020) or a description.
argument-hint: "[backlog ID | feature description]"
disable-model-invocation: true
allowed-tools: Read, Glob, Grep, Write, Edit
---

You are creating a durable task definition — the input to the Specification stage. A good task file bounds the work clearly enough that the PO / Spec agent can write testable acceptance criteria without guessing at intent. You do not write the spec, design, or plan, and you do not start the run.

## Inputs

Read only:

- `harness/templates/task-template.md`
- `harness/backlog/backlog.md`
- the file names in `harness/tasks/`, and the Summary and Scope sections of earlier tasks only where you need them to identify dependencies or overlap
- the file and folder names under `src/app/`, `src/components/`, and `src/data/`, to see which routes, components, and content types already exist

Do not read the codebase beyond that, or any harness artifacts. Implementation detail belongs to later stages.

## Process

1. **Resolve the request** from `$ARGUMENTS`:
   - A backlog ID → use that entry. If its status is `Done`, stop and say so.
   - A description → look for a matching backlog entry. If there is one, use it; if not, the task gets a new backlog entry (step 6).
   - Nothing → ask what the task should be and stop.
2. **Allocate the ID**: one higher than the highest whole `T###` in `harness/tasks/` (ignore point releases such as `T009.1`), zero-padded to three digits. The file is `harness/tasks/T###-<kebab-case-title>.md`. If the human asks for a follow-up to an existing task instead, use the next free point ID (e.g. `T015.1`).
3. **Decide the workflow mode** and state your reasoning in the summary to the human: `Workflow: Standard` unless the task has no new UI surface and no design decisions (configuration, CI, data, content tooling) — then `Lightweight`.
4. **Ask before writing** only when a decision materially changes the scope and you cannot resolve it from the backlog entry and the human's request — for example, two plausible interpretations of the feature. Ask once, with your recommendation. Otherwise proceed.
5. **Write the task file** from the template, filling every section:
   - **Summary** — the user-facing outcome in a short paragraph: what the feature is, which route or section it appears on, and where its content comes from.
   - **In Scope** — the routes, components, behaviours, content model or frontmatter changes, and tests the task delivers, at the level of *what*, not *how*. Name new frontmatter fields and their types — later stages depend on it.
   - **Out of Scope** — the plausible extensions a reader might assume are included. This list is what keeps the spec bounded; make it specific.
   - **Acceptance Criteria** — the minimum the task must deliver, phrased so each one can be checked. The Specification stage finalises them.
   - **Dependencies** — earlier tasks, existing components, design-system tokens, or content this task relies on.
   - **Risks** — what is likely to go wrong or be underspecified, e.g. client/server boundaries, dark mode, accessibility, performance, SEO.
   - **Task Notes** — anything the human said about intent or context that doesn't fit elsewhere.

   Respect the project's standing constraints: content is local markdown under `src/data/`, read through the loaders in `src/lib/`; the UI follows the design system and its shadcn/ui primitives; no new npm dependencies unless the human asks for one.
6. **Update the backlog**: set the entry's status to `Ready for Spec` and add `**Task:** T###`. For a new request, add a `B###` entry (next free number) with a one-paragraph summary and the same status. While you're in the file, if a backlog entry's task is already Complete but the entry isn't `Done`, mark it `Done` and say so.
7. **Check your output**: the file name matches `T###-*.md` and is the only file for that ID; the header has `Status: Ready`, the backlog ID, today's date, and a valid `Workflow:` value; no `{{…}}` placeholders remain. `/run-task` refuses to start a task whose settings are invalid.

## Finish

Tell the human the task ID and file path, the workflow mode you chose and why, and any open questions you left in the task for the Specification stage. Then suggest `/run-task T###` — do not run it yourself, and do not commit (Build commits the task file with the first pass).
