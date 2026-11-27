---
title: "SitecoreAI's Developer MCP: The Missing Piece for End-to-End Automated Development"
slug: "sitecoreai-developer-mcp-the-missing-piece-for-end-to-end-automated-development"
publishDate: "2026-11-27"
disqusId: "sitecoreai-developer-mcp-the-missing-piece-for-end-to-end-automated-development"
abstract: "My SitecoreAI harness could automate everything except the CMS. Every feature ended with a long guide for a human to follow in Content Editor. Here's how adopting the new Sitecore Developer MCP closed that gap, and the guardrails I needed to let an agent write to the CMS unattended."
tags: ['AI Development', 'Harness Engineering', 'Agentic AI', 'Sitecore', 'MCP']
heroImage: "/img/blog-images/2026/sitecore-developer-mcp-jigsaw.jpg"
---

Anyone who has seen my talks at SUGCON India, or more recently at Sitecore Symposium will know I've been working on a harness in my [sitecoreai-harness-engineering](https://github.com/robearlam/sitecoreai-harness-engineering) repo. It's a proof of concept showing how you can use AI to automate the build of a **SitecoreAI** site with Next.js and the Content SDK.

The workflow is almost the same as the one I've described in earlier posts on Harness Engineering: specification, design, implementation planning, build and QA, each run by its own agent and each producing an artifact for the next stage. A SitecoreAI site has one extra action that needs to happen though. The components created also need the related CMS items to be created as well.

That's where my automation always stopped... until now.

## The one stage that still needed a human

The harness has a **CMS Configuration** stage that runs after QA. Until recently, its agent couldn't touch the CMS. All it could do was write a guide for me to follow.

Those guides were long. Across the first six tasks (T001 to T006) they ran to between 323 and 595 lines each. Every one asked me to open Content Editor and to copy/paste a variety of data, step by step.

Looking back, a lot of the agent's rules for that stage existed to stop *me* making mistakes. Getting the Placeholder Key exactly right, escaping `#` characters in queries, using `@@templatename` until the real GUIDs were known: these were all instructions on how to write a guide designed to minimise the opportunities for the human to make a mistake.

So I had a pipeline where agents specified, designed, planned, built and tested a feature, and then handed me a 500-line document and waited. That's not end-to-end automation. That's automation with a big manual step hanging onto the end.

## Enter the Sitecore MCP servers

We recently released a beta of the [Sitecore Developer MCP](https://doc.sitecore.com/sai/en/developers/sitecoreai/sitecore-developer-mcp-server.html) server, and it, alongside the existing [Sitecore Marketer MCP](https://doc.sitecore.com/sai/en/users/sitecoreai/sitecore-marketer-mcp-server.html) were the pieces I'd been missing. I updated the harness ([PR #12](https://github.com/robearlam/sitecoreai-harness-engineering/pull/12)) so the CMS Configuration agent now creates and verifies all of the Sitecore items itself, rather than forcing me to do them manually.

It uses both MCP servers, which are defined in the repo's `.mcp.json`:

| Server | What the agent uses it for |
| --- | --- |
| `sc-developer` (Sitecore Developer MCP) | Creating components and content types, and adding fields to templates |
| `sc-marketer` (Sitecore Marketer MCP) | Looking up items, creating items, updating fields, pages and layout, page HTML and screenshots, and deleting items |

The developer authenticates with each server using their own browser OAuth login, so the repo doesn't hold any credentials.

## From a guide to a record

The biggest change in the CMS-Config stage is that the artifact used to be a set of **instructions**: "do these things". Now it's a **record**: "this is what I did".

The CMS Configuration Record contains:

- the **environment check** the agent ran before writing anything;
- **one row per write**, with the item's ID and the result of reading it back;
- the **verification** results for the component on a real page;
- the serialization coverage;
- any **Manual Steps** that are still left for me;
- a **Rollback** list showing how to undo everything the run changed.

This approach is a useful principle that can be followed beyond Sitecore. When an agent changes from advising to actually performing tasks itself, its artifact should change from telling someone what to do, to providing an audit trail of what was completed.

## Adding Guardrails

I wanted to ensure my Agent was interacting with the CMS in a safe and secure way. To do this I ended up creating a `PreToolUse` hook, `cms-mcp-guard.py`, which runs on every Sitecore MCP call. It:

- allows writes **only from the `cms-config` agent**, and **only while** the run-state shows the CMS Configuration stage as Active;
- allows deletes **only of items the Agent created in the current run**;
- **fails closed**: if the guard itself errors on a write, the write is denied.

A matching `PostToolUse` hook logs every write to `harness/runs/TASKID-cms-writes.jsonl`. The agent never writes to that log itself, giving a belt-and-braces approach that ensures only the correct items are writen to, and that the audit log is always exhaustive.

### A record that's checked against the log

When the stage finishes, `verify-stage.sh` checks the agent's record against the write log in both directions. Every logged write must appear in the record, every write in the record must appear in the log, and every item the run created must be in the Rollback list. If the agent leaves something out of its own record, or adds something that never happened, verification fails.

Then at the approval gate I review the record, look at the component in Pages, and check the `ser pull` diff. If something's wrong, the Rollback list tells me how to undo the run.

### Checking the environment

There was a problem I didn't see coming. The repo can't control which environment the agent writes to. Each MCP server is tied to an organization and tenant when you sign in, so two developers, or two servers, could be pointing at different places.

So before any write, the agent calls `list_sites` on both servers and only continues if both list the matching sites with the same site ID. If they don't, it stops and asks me to fix the connections. It's a small check, but it's the thing that stops the agent writing to the wrong tenant. This obviously might need to be tightened up a bit when working with a solution that would have the same site names across environments, e.g. in Dev, Staging & Prod, but it's enough for my PoC to provide some security.

### Allowing tools by name

`.claude/settings.json` allows the MCP read and write tools the stage needs **by name**, and denies the Marketer MCP's personalization, A/B testing, brief and asset tools. The agent's own definition lists its MCP tools one by one too.

I could have used wildcard permission rules for each server, but then any new tool the servers add later would be allowed without me noticing. Listing them explicitly means a new tool is blocked until I decide otherwise. The agent also can't publish or push serialized items: those tools aren't available to it at all. This helps to ensure that the Agent can only perform the tasks I want it to and nothing else. If I want to expand its remit in future that has to happen via an explicit action that I take myself to enable that.

## What's left for the human to do then?

"End-to-end automation" doesn't mean the human disappears. Aside from the obvious task creation used to kick off the pipeline, which I've talked about earlier. A few things in the CMS-Config stage still stay with me on purpose:

- **Uploading media.** There's no upload tool, so the agent leaves the field empty and adds a Manual Step for me.
- **Running `dotnet sitecore ser pull` and committing the result.** The agent could run it, since it only reads from the CMS, but it rewrites hundreds of files under `src/authoring/items/`. I want to double check what's being changed before adding those changes to the commit.
- **Publishing.** The agent can't publish at all.

If a write fails or the guard denies one, the agent doesn't try to work around it. It writes a partial record listing what it did and what's left under Manual Steps, so I can finish the job by hand or fix the cause and re-run the stage.

## Known limits

This is obviously a huge step forward from where I was previously with the large amount of manual effort involved, but there are still some areas that we need to build on.

- The Developer MCP is still in **beta**, and the functionality will be improved on in the coming weeks/months. We've got a good backlog of tools we want to introduce. As the tooling in the MCP expands, I'll be checking whether I can remove any customisations out of my harness in favour of leveraging the OOTB tooling instead.
- Currently all of the items created by the Developer MCP are created inside a module in the **Feature Layer**. This is something that we're looking to change so it's possible to create items in the other layers as desired, but for now this is something to bear in mind.
- My older components (T001 to T006) are still in the Project layer, and new ones are in Feature until I move the old ones across - this is a tidy up task that I need to get around to.

## Wrapping up

Before this change, my SitecoreAI harness was automated right up until the point where the CMS needed configuring, and then it handed the work back to me. The Sitecore Developer MCP closes that gap. The agent now creates the component, builds out its templates and content, places it on a page, and gives me a record I can check against a log it can't edit.

The bigger lesson for me is that trust comes from the structure around the agent, not from asking a human to approve every call. Clear boundaries on when it can write, a log it can't change, verification against that log, and a single review at the end turned out to be both safer and much less work than a bunch of approval prompts.

If you want to dig into the details, the full change is in [PR #12](https://github.com/robearlam/sitecoreai-harness-engineering/pull/12), and the reasoning behind it is written up in the repo's `harness/decisions.md` as D-004 and D-005.
