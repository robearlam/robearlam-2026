---
title: "An Introduction to Harness Engineering"
slug: "an-introduction-to-harness-engineering"
publishDate: "2026-04-01"
disqusId: "4fbefe5f-d642-4789-a959-d8e391d63814"
abstract: "So for a decent amount of time now I've been on the Vibe Coding bandwagon, like a large portion of the development community. When it works it really can seem like magic, the is the part 'when it works' though."
tags: ['AI Development', 'Harness Engineering', 'Agentic AI']
heroImage: "/img/blog-images/2026/intro-harness-engineering.jpg"
---

--- 

This post is part of my series deep diving into **Harness Engineering**. You can find all of the posts in the series so far below:
- An Introduction to Harness Engineering
- <a href="/blog/harness-engineering-agents-and-roles" target="_blank" rel="nofollow">Harness Engineering: Agents and Roles</a>
- <a href="/blog/harness-engineering-artifacts-inputs-and-context" target="_blank" rel="nofollow">Harness Engineering: Artifacts, Inputs and Context</a>
- <a href="/blog/harness-engineering-orchestration-and-execution-tracking" target="_blank" rel="nofollow">Harness Engineering: Orchestration and execution tracking</a>
- <a href="/blog/harness-engineering-running-the-pipeline-end-to-end" target="_blank" rel="nofollow">Harness Engineering: Running the pipeline end-to-end</a>
- <a href="/blog/harness-engineering-anthropics-ai-sdlc" target="_blank" rel="nofollow">Harness Engineering: Anthropic's AI SDLC</a>

---

So for a decent amount of time now I've been on the Vibe Coding bandwagon, like a large portion of the development community. When it works it really can seem like magic. Too often though it does seem to go off on a tangent, editing unrelated parts of the codebase, or implementing a something in a way that I just wasn't happy with. I felt that it was making me more productive, but I also felt like I spent a good amount of my time chasing the LLM, going back and forth on the same problem and repeatedly prodding it to get to the outcome that I wanted.

It felt like one of the big problems with this approach was repeatability, now rules files can help here to try and enforce some guidelines for how LLM's interact in certain scenarios, but I was getting sick of constantly having to type prompts like *"You are a senior developer with 10yrs of experience yadda yadda"*. I had played around with some Agents, and they were a step in the right direction, but the whole thing was still feeling very manual, in that I had to hand-hold the AI at each step.

Then last month I read a blog post published by Ryan Lopopolo from the OpenAI Tech Team about <a href="https://openai.com/index/harness-engineering/" target="_blank" rel="nofollow">Harness Engineering</a> and this got me interested. I had heard of people creating teams of Agents, so I decided it was time to jump in. I ended up rebuilding the site you're reading this blog on now using this approach and I wanted to document how I ended up putting it together for anyone else looking to build software this way.

## Harness Engineering 101
As I said in my <a href="/blog/new-site-who-dis" target="_blank" rel="nofollow">previous blog post</a> the name is pretty apt. The basic concept is that you think of AI like a horse, it's fast and it's powerful, but for the vast amount of people, if you try an ride it bareback then you're going to have a bad time. That's why you need to develop a Harness for the horse, allowing you to make use of the power and speed it provides while being much more in control of where the final destination is.

The harness also means you can repeatedly ride the horse to different destinations, but with the same ease. Now from time to time you might have to tighten the harness when you realise there's something you're not happy with. You might also make some slight adjustments depending on the journey your taking or the destination. Overall though, the harness remains pretty much the same for each trip. The same is true for Harness Engineering as well. In this case the harness is a series of **agents**, **roles**, **artifacts**, and **workflow standards** that let you guide execution instead of hoping for a good result. 

The **workflow standards** define how everything should function. In my case this covers everything from Next.JS best practices, and testing standards, through to how the agents communicate with each other, and how the current state of the repo is tracked during execution.

The **agents** are autonomous workers, each with a very specific purpose to execute within the system. I keep the actual definition here very light, instead storing most of the definition in the **roles**. I have the following agents defined currently though:
- *Orchestrator* — Controls the workflow end to end, decides which stage should run next, invokes subagents, validates handoffs, keeps execution moving in the right order, and bails out if one of the subagents fails.
- *PO-Spec* — Turns the original idea or request into a clear feature specification with scope, intent, and acceptance criteria.
- *Feature Design* — Translates the feature requirements into a design direction, interaction model, and structural approach for the features being built.
- *Tech Lead* — Converts the spec and design into an implementation plan with technical decisions, architecture guidance, and delivery steps.
- *Build* — Actually does the coding work - it carries out the implementation work by creating or updating the code and assets needed to deliver the feature.
- *QA* — Reviews the output against the specification and expected behaviour, identifies gaps or defects, and decides whether the work is ready or needs to return to Build.

The **artifacts** are what is delivered by each if of the agents above, so for the **PO-Spec** agent, the artifact is the actual spec that it is created. For the **Build** agent however the artifact would be the code changes themselves.

The **roles** are where the vast majority of the agent logic is maintained and there is a 1-1 relationship from **agents** to **roles** meaning all of the agents listed above have a corresponding role definition. These each define things like the responsibilities of the agent, what pre-requisites need to exist before it can run, what areas of the codebase it can look at to perform it's actions, whether it can iterate on itself, which it can says its completed, and a detailed walkthrough of the process it should follow. One of the main benefits with keeping the definitions in role files with skinny agent files that reference them is that it helps to keep my harness **IDE agnostic** - I can have skinny definitions for agents in Claude, Cursor or VS-Code, but the logic is in the shared role file avoiding repetition.

## Advantages of Harness Engineering
So you might be reading through the items above and wondering why someone would go to the effort of configuring all of this, when you could just start directly talking with your LLM and creating the code for the feature you require. There's a few really nice things you get by following this approach that I want to cover.

### The shift from prompting to orchestration
One of the main ones for me is the change from having to repeatedly craft prompts to defining a lot of this in advance in the harness.  This allows the LLM to take the actual work request and break it down into discrete tasks, and hand them off to tightly bound agents with specific roles and outputs. It means that each agent has a narrow purpose, clear responsibilities, and explicit limits. Defining all of this up front reduces role leakage, keeps outputs focused, and makes the system easier to reason about and improve. If you find the Tech Lead Agent isn't creating a proper plan from the specs for the build agent, then it becomes very easy to tweak that agents role to get the result you want.

### Artifacts, tasks & the backlog
How I run the delivery process using the harness is that I have a backlog of desired features with a very basic high level description. When I want to implement one I have a conversation with an LLM to generate a much more detailed **Task Definition** with a unique id, which would describe in more detail the feature I want and any guidance for how I think it should and shouldn't work. This task is then passed through all of the agents to generate their artifacts. The nice thing here is that every artifact generated is created keyed with the task id, and stored in the artifacts folder. 

This means that if I want to look back in the future at how the blog feature was implemented, I can refer back to all of the artifacts that were generated by each of the agents to see why it was implemented the way it was. This can also be used as memory for future feature implementations, you can including instructions like *"following the same pagination pattern implemented in the blog features"* and the LLM will know how to do that and where to look for the information.

### Repetition, Repetition, Repetition
I keep mentioning the benefit of repetition with the project for future features, but this concept of repetition is actual broader than that. If I want to start a different project tomorrow on a different technology stack, then my existing harness can still help. Lets say I want to build an IOS application tomorrow, now coding standards will obviously need a large rewrite, but the concepts I described above about **agents**, **roles**, **artifacts**, and **workflow standards** will be largely transferable. I would move them over to the new project and tweak them to get the output tailored to that project. Coming back to the horse analogy, I'm once more tailoring the harness I'm going to be riding with to better suit the journey I'm on and the destination I want to get to.

## Conclusion
As I built out this harness, I released I was actually recreating a structure that I had seen and worked in at many different companies before when working on software projects. You have each role within the company responsible for producing the artifacts that the next team would use. Now the difference is that all of this is created by AI, and in a fraction of the time!

Hopefully this has been a good introduction to some of the key elements to Harness Engineering and how it all comes together. As I continue this series I want to deep dive in to each of the topics I've covered above. I want to talk about how you can craft a tightly defined agent and role, how you can enforce contractual boundaries to minimise agentic scope creep, and ensure the orchestrator can validate completion before continuing the execution pipeline. There's going to be lots to cover, so keep an eye out for future articles on this topic coming soon! 