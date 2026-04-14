---
title: "Harness Engineering: Artifacts, Inputs and Context"
slug: "harness-engineering-artifacts-inputs-and-context"
publishDate: "2026-04-14"
disqusId: "885bc0ee-4b75-47a1-ade2-22bd573ba7ce"
abstract: "In this post I want to take a look at how the Artifacts from each Agent form the Input for other Agents, and how this form of Bounded Context helps to greatly improve accuracy in what your LLM is doing."
tags: ['AI Development', 'Harness Engineering', 'Agentic AI']
heroImage: "/img/blog-images/2026/artifacts-inputs-context.jpg"
---

--- 

This post is part of my series deep diving into **Harness Engineering**. You can find all of the posts in the series so far below:
- <a href="/blog/an-introduction-to-harness-engineering" target="_blank" rel="nofollow">An Introduction to Harness Engineering</a>
- <a href="/blog/harness-engineering-agents-and-roles" target="_blank" rel="nofollow">Harness Engineering: Agents and Roles</a>
- <a href="/blog/harness-engineering-artifacts-inputs-and-context" target="_blank" rel="nofollow">Harness Engineering: Artifacts, Inputs and Context</a>

---

We've already covered an overview of Harness Engineering, and also how the Agents and Roles in the system function. In this post I want to take a look at how the **Artifacts** from each **Agent** form the **Input** for other **Agents**, and how this form of **Bounded Context** helps to greatly improve accuracy in what your LLM is doing, leading to far fewer cases of Hallucinations.

We've been talking with LLM's to help with Coding tasks for a while, and while the quality has improved in that time, accuracy and reliability can still be an issue. Chatting directly like this is flexible, but it is also fragile as it drifts, expands, gets reinterpreted, and makes it harder to know which decisions are actually the source of truth to be trusted. This has been mitigated somewhat by vastly increasing the context we provide to the LLM's. Even with the higher token limits that the newer models support, this isn't foolproof, a lot of the time too much context can be provided and the model can get confused with what information to use for what task.

## Artifacts as the backbone of Harness Engineering

Artifacts are outputs produced at each stage of the workflow, such as a **feature spec**, **design note**, **implementation plan**, **QA review**, or the **code** itself. The important thing is that each artifact exists because a specific **role** is responsible for producing it, which makes it a **formal handoff** rather than just extra documentation to clog up the context some more. This means that each **Agent** will only produce the artifact that they are designed to output and nothing else. This stops, for example, the **Tech Lead agent** from getting confused and trying to actually implement the code changes and not just creating the implementation plan.

The crucial next step in this process, is that these artifacts then form the **input** for the next agents to execute in the workflow. This means that one agent completes its work by producing a defined artifact, and then next agent begins with that artifact as one of its approved inputs. Here is where the **bounded context** comes in. Instead of every agent pulling in everything it can find, each one works from a small, deliberate set of inputs, which helps keep the task bounded and reduces irrelevant context accumulation and the inaccuracies that can lead to.

Reliability improves when agents are not constantly trying to infer intent from long conversations, but are instead working from **stable artifacts** that already capture the decisions made by previous agents executions. An agent is less likely to invent requirements, expand past its defined scope, or make up missing detail when it is grounded in a constrained set of explicit inputs and expected outputs... the **bounded context** provides the power here.

This helps to enforce the difference between context and authority. Not all information that an agent can see should be given equal importance. Artifacts help distinguish between background noise and the valid sources that should be given the most consideration when executing.

## Human Legibility and Traceability

The other awesome thing about working with Artifacts in this way is that **handoffs** are legible to humans too! The same structure that helps the agents also helps you as the driver of the system. You can inspect what was decided, which agent decided it, and then see how the downstream work was affected. This means if you're not happy with the output you can go back and slightly tweak your initial instructions to better ensure that the artifacts are generated to your requirements.

As you execute the workflow, the artifacts are all persisted into your repository as well. This means that if in the future you want to go back and see why a certain feature works a certain way, then you can go and look back at the different artifacts from all of the different execution runs and review why something was built as it was. If you look at the image below you can see the different outputs listed from my PO-Spec Agent we discussed in the previous post, all keyed the Task ID of the work being completed

![List of artifacts produced by the Spec Agent](/img/blog-images/2026/Specs-Artifacts.jpg)

Here you can see here how easy it is for me to go back and look at the **spec** that was built for a **specific task**. The same is true for the artifacts from the **Tech Lead Agent**, **Design Agent**, and **QA Agent**. Now the **Builder Agent** is obviously different as it's artifact is the code itself.


## Artifacts as memory outside the model
Another of the key things to highlight here is that artifacts act as **externalized working memory**. This reduces dependency on the model remembering everything correctly across long running execution streams. It greatly reduces the need for **context compacting** which is required when running long conversations with huge contexts being evaluated.

It also gives you **consistency across iterations**, the thing with a harness is you do need to tweak what you're putting into it, and probably run it a couple of times to get the output that you want. Having the artifacts store the result of prior agent executions means that context is always available when re-running the harness again.

Another benefit this concept of memory gives you is **recoverability**. Externalized memory means you can **stop**, **resume**, **inspect**, or even **rerun** parts of the workflow without having to reconstruct a full chat history. This is important as it means that your harness is **repeatable**, while also **maintaining consistency** in those repetitions.

Just to repeat here, the goal is not to maximize how much the model sees, but to maximize the relevance and authority of what it sees. This allows the model to create successful executions with greatly reduced context load.


## The artifacts I'm producing in my harness
I've been talking in this series about the harness I created to rebuild my personal site. I've covered the **Agents** and **Roles** I created in a previous post, so I wanted to now cover what **artifacts** each of those is responsible for creating and which they each use as their input, as crucially not all artifacts are available for all agents to leverage.

So here are the list of agents I created, the artifacts they output and what they use as their inputs.

| Agent | Inputs | Artifact Created |
|-------|--------|------------------|
| *Orchestrator* | Task definition | Run-state, run report |
| *PO-Spec* | Task definition | Feature specification |
| *Feature Design* | Feature specification, design system | Design note |
| *Tech Lead* | Feature specification, Design note | Implementation plan |
| *Build* | Feature specification, Design note, Implementation plan | Code & tests, run report |
| *QA* | Feature specification, Design note, Implementation plan, code & tests | QA review |

Here you can see my **agent workflow** is actually executing like a real team of humans would work along a well defined **Software Development Lifecycle (SDLC)**. Each of them takes the output from the previous Agent and uses it to execute and produce the artifact they're responsible for, just like a team of humans working on those roles would.

Now the interesting edge case in the list above is the **Orchestrator**. This Agent has control over when and how the other subagents execute, it checks they successfully created their artifact and only then moves on to execute the next in the workflow. It has access to some items we haven't discussed so far, namely the **Run State**, **Run Report** and the **Task Definition**. These are what we're going to discuss in my next post, where we take a look at how execution is tracked and managed by the **Orchestrator**.