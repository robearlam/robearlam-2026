---
title: "Harness Engineering: Orchestration and execution tracking"
slug: "harness-engineering-orchestration-and-execution-tracking"
publishDate: "2026-04-24"
disqusId: "504e71a4-c2fa-454d-834c-b91e2299bda8"
abstract: "This post continues my series on Harness Engineering, this time I'm going to focus specifically on the Orchestrator Agent and Role to talk about how it is the workflow controller, ensuring that the artifacts the subagents create are generated successfully, then managing the following handoff as the execution flow continues."
tags: ['AI Development', 'Harness Engineering', 'Agentic AI']
heroImage: "/img/blog-images/2026/agent-orchestration.jpg"
---

--- 

This post is part of my series deep diving into **Harness Engineering**. You can find all of the posts in the series so far below:
- <a href="/blog/an-introduction-to-harness-engineering" target="_blank" rel="nofollow">An Introduction to Harness Engineering</a>
- <a href="/blog/harness-engineering-agents-and-roles" target="_blank" rel="nofollow">Harness Engineering: Agents and Roles</a>
- <a href="/blog/harness-engineering-artifacts-inputs-and-context" target="_blank" rel="nofollow">Harness Engineering: Artifacts, Inputs and Context</a>
- Harness Engineering: Orchestration and execution tracking
- <a href="/blog/harness-engineering-running-the-pipeline-end-to-end" target="_blank" rel="nofollow">Harness Engineering: Running the pipeline end-to-end</a>
- <a href="/blog/harness-engineering-anthropics-ai-sdlc" target="_blank" rel="nofollow">Harness Engineering: Anthropic's AI SDLC</a>
---

This post continues my series on **Harness Engineering**, this time I'm going to focus specifically on the **Orchestrator Agent** and **Role** to talk about how it is the **workflow controller**, ensuring that the **artifacts** the subagents create are generated successfully, then managing the following **handoff** as the execution flow continues.

## Why do we need orchestration?
Once you create a workflow that has **multiple stages**, you're left with a choice. You can either manually execute each of these steps yourself, passing in the **required artifacts** that each stage requires yourself, or you can automate that process. Obviously, with the power that AI provides today automating that process is much more achievable. What you need to create is something responsible for **sequencing the agents**, **validating handoffs**, and stopping the system from **drifting** or **skipping ahead**. This is where the **Orchestrator Agent** comes in.

The **Orchestrator Agent** is different from the other agents we have talked about already as it is responsible for **execution** rather than being a worker itself. It is responsible for controlling the current **workflow state**, determining the **valid next stage**, invoking the correct agent, checking that **required artifacts** were created, and updating **control artifacts** accordingly. Crucially it is also responsible for catching any possible issues with a subagents output and terminating the pipeline when this happens, returning a response back to the human for them to jump back in and resolve.

The important point to remember is that the Orchestrator is not here to write specs, design features, build code, or perform QA. It exists purely to **coordinate subagent roles** and **preserve workflow integrity** throughout the full execution of the pipeline.

## How do I start the pipeline?
Now you might be wondering how the pipeline execution is started? What provides the input for the first subagent that is executed? In my case that is the **PO-Spec Agent**, and it gets its input from a **Task Definition file**.

I maintain a very light **backlog** file in my harness that tracks **upcoming pieces of work** that I want to complete, and this is what I use to kick off the generation of a **Task Definition File**. Now, when I say that the backlog items are light, I'm not joking, here is the whole backlog item I had for generating the homepage content I built for my site:

```
### B003 — Homepage v1
**Status:** Done  
**Summary:** Create the homepage with hero content, introduction, and clear navigation to key areas.
```

What I do is I have a conversation with the LLM inside of my IDE to generate from the **Task Template**, we go back and forth a few times and I tell it to ask me any questions it needs to clarify what I want creating. Here is the exact back and forth conversation we had for that task:

```
Rob: 
  Please can you generate the task file for backlog item B003 - Homepage. I want the homepage to include the highlights of the content in the rest of the site. So showing the latest blogs & videos. If I have an upcoming speaking events registered also show those. 
  The homepage must be visually engaging. I also have a profile picture included in the img dir in the next app, so incorporating that somewhere would be good as well.  
  Please ask me any other questions to get the information you need for this.

LLM:
  Before I draft the task file, I have a few questions to make sure it captures your intent accurately:
    1. Hero / Intro section — Should the hero include your rob.png profile photo alongside the heading and intro text, or would you prefer the photo in a separate "About Me" section below the hero?
    2. Latest Blogs — How many recent blog posts should be shown on the homepage (e.g. 3 or 5)?
    3. Latest Videos — Same question — how many recent videos should be surfaced?
    4. Upcoming Speaking — Should this section only appear when there are upcoming events (i.e. hidden when none exist), or should it always be shown with an empty-state message?
    5. Call-to-action links — Should each content section (blogs, videos, speaking) include a "View all →" link to its respective page?
    6. Section ordering — What order would you like the sections in? My suggested default would be: Hero → Latest Blogs → Latest Videos → Upcoming Speaking. Does that work, or would you like a different arrangement?

Rob: 
    1. Lets try including it in the head and intro text please.
    2. Lets go for 3.
    3. 3 again.
    4. Only shown when there are upcoming events.
    5. yeah links to all sections of the site.
    6. Suggested order works for me!

LLM: 
    Now I have everything I need. Creating the task file.
    Task File is ready. Here's a summary of what's captured:
     - Hero — two-column layout (photo left, name + intro right) at desktop, stacked on mobile. Uses Next.js <Image> for rob.png. The generic HeroSection component is extended non-breakingly via a homepage-specific variant in src/components/homepage/.
     - Latest Blogs — 3 posts, reusing BlogPostCard, "View all posts →" link to /blog.
     - Upcoming Speaking — fully conditional; hidden when no upcoming events exist, "View all speaking →" link to /speaking when shown.
     - All data loaded at build time via existing lib layers — no new data fetching logic needed.
     - Section order locked: Hero → Blogs → Videos → Speaking.
```

After the LLM completed at the end, it generated a really good **Task Definition**. It's pretty long so I won't include it, but you can view the full contents for it in this here: <a href="https://gist.github.com/robearlam/6b6b9cdba1176825234a8e256059c720#file-t010-homepage-md" target="_blank" rel="nofollow">T010-homepage.md</a>. Once we have the generated Task Definition, it becomes super easy to start the execution pipeline, all I do is use the following prompt and away it goes!

```
Please execute the Orchestrator Agent for Task definition T010.
```

## How does the Orchestrator track state during pipeline execution?
Once I give the LLM the command above the pipeline is going to start executing and **Orchestrator Agent** will begin running the different subagents in the required order, checking the **required artifacts** are created after each. Now you might be wondering how does the Orchestrator know where it is in the pipeline? How does it know that, for example, the **Design Agent** has just completed and it's ok to move on to the **Tech Lead Agent**? Well this is where the **run-state.md** file comes in, as that is the **authoritative record** of what task is active, which stage is current, which artifacts have been completed, and whether the workflow is **blocked**, **awaiting approval**, or **ready to continue**.

The run-state.md file is pretty light, it purely lists current state of where things are and the locations of the generated artifacts ready to be picked up by the other subagents. I also don't persist the run-state after a feature is complete, as its only required during pipeline execution and doesn't give any benefit afterwards. You can see the run-state for the last update I did, where I added Dark Mode support to the site below

```
# Run State

## Task

Task ID: T015  
Task File: harness/tasks/T015-dark-mode.md

---

## Execution State

Current Status: Done  
Current Stage: Completed  
Current Run ID: RUN-2026-04-02-T015

Stop Reason: None

---

## Completed Stages

- Specification — RUN-2026-04-02-T015-SPEC — 2026-04-02 — PASS
- Design — RUN-2026-04-02-T015-DESIGN — 2026-04-02 — PASS
- Implementation Planning — RUN-2026-04-02-T015-PLAN — 2026-04-02 — PASS
- Build — RUN-2026-04-02-T015-BUILD — 2026-04-02 — PASS
- QA — RUN-2026-04-02-T015-QA — 2026-04-02 — PASS

---

## Artifact Paths

Feature Specification: harness/artifacts/specs/T015-feature-spec.md  
Design Note: harness/artifacts/design/T015-design-note.md  
Implementation Plan: harness/artifacts/plans/T015-implementation-plan.md  
QA Review: harness/artifacts/qa/T015-qa-review.md  
Run Report: harness/runs/RUN-2026-04-02-T015.md

---

## Approval Mode

Require Approval Before Build: false  
Require Approval Before Complete: true

---

## Notes

Run initialized 2026-04-02. Task is Dark Mode Support (B018). Specification, Design, Implementation Planning, Build, and QA completed 2026-04-02. QA result: Pass. Advancing to Awaiting Approval — gate requires human approval before Complete.

```

Another way I record state is in the **Run Report**, this acts as the execution log and is different from **run-state**. The run-state tells you the **current status of the workflow**, whereas the run report tells you **what happened during execution**, **what decisions were made**, **what validations ran**, and **what the outcomes of each stage were**. Keeping these separate gave me a nice clear **separation of concerns**, one file governs the **current state of the workflow**, while the other **preserves logs of execution output**. Unlike the run-state which I treat as ephemeral, created fresh to each run, the Run Report is one of the Artifacts of the Orchestrator and is persisted in the harness as such. Again, the generated file is quite large, so you can see the full contents of it here: <a href="https://gist.github.com/robearlam/6b6b9cdba1176825234a8e256059c720#file-run-2026-03-26-t010-md" target="_blank" rel="nofollow">RUN-2026-03-26-T010.md</a>


## How does the Orchestrator progress through the stages?
The **run-state** and **run-report** combined to give the Orchestrator the ability to know precise information about the current state of execution, and it uses that to decide on next steps once execution is returned by a subagent. When that happens the Orchestrator reads the **current stage**, verifies that the **required prior artifacts** all exist, ensures there are no **blocking conditions** present, then **invokes the next appropriate agent**. This gives a formal definition to how and when execution is passed between the orchestrator and various subagents. A crucial part of this is that the Orchestrator should not just assume a stage succeeded because an agent ran and completed. It has to explicitly confirm that the expected output artifact for the agent in question exists and is valid before progressing.

This is really important, if the Orchestrator just blindly executed one subagent after another without checking anything, then it wouldn't be much use as if there were issues with the output of one of the subagents then executing the subsequent ones would just compound that error and lead to the final output not matching what was required, if there even is an output at all. So there are a few scenarios that can cause the Orchestrator to pause or amend the pipeline depending on execution results. That could result in orchestrator pausing the workflow for human review, stopping all together if there are missing artifacts, halting on invalid state, or re-running previous subagents, for example when QA fails.

This results in the workflow becoming more trustworthy because progression is based on explicit state and durable outputs, not on the model vaguely *remembering* where it thinks it is at in the execution pipeline

## Conclusion
To finish this up, without orchestration agents can easily **overreach**, **perform work out of order**, or **continue past the boundary of their role**. The Orchestrator acts as the mechanism that keeps those boundaries solid and ensures that agents only perform the specific task they were built for.

Because workflow state is written down and readable by the orchestrator, this means you can stop and resume execution later without reconstructing the whole process from conversation history. You can stop the LLM, and just tell it to resume later when you're ready. This is super useful as trying to do that when you're in the middle of a large conversation with an LLM, and need to recreate that large context to pickup again is super painful!

If you're wondering how I actually configured my Orchestrator Agent and Role then you can see the current state of them in the links below. Note that this is this is the current state of the files as of writing this post, but they will continue to evolve as the harness is tweaked and amended.

- <a href="https://gist.github.com/robearlam/6b6b9cdba1176825234a8e256059c720#file-orchestrator-agent-md" target="_blank" rel="nofollow">orchestrator.agent.md</a>
- <a href="https://gist.github.com/robearlam/6b6b9cdba1176825234a8e256059c720#file-orchestrator-role-md" target="_blank" rel="nofollow">orchestrator.role.md</a>

Following on the series, I think next time. I'm going to cover how I used Harness Development in practice to build out my site. We'll take the different concepts that I've talked about in the past few posts and walk through an example of how I built out one of the features from my backlog using it. We'll follow a single task from a one-liner in my backlog to a completed and deployed feature, covering all of the artifacts generated by each of the agents and how it all came together to deliver the feature all the way to prod. 