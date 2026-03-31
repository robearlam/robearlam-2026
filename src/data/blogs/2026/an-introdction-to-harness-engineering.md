---
title: "An Introdction to Harness Engineering"
slug: "an-introdction-to-harness-engineering"
publishDate: "2026-03-31"
disqusId: "4fbefe5f-d642-4789-a959-d8e391d63814"
abstract: "So for a decent amount of time now I've been on the Vibe Coding bandwaggon, like a large portion of the development community. When it works it really can seem like magic, the is the part 'when it works' though."
tags: ['AI Development', 'Harness Engineering', 'Agentic']
heroImage: "/img/blog-images/2026/intro-harness-engineering.jpg"
---

So for a decent amount of time now I've been on the Vibe Coding bandwaggon, like a large portion of the development community. When it works it really can seem like magic. Too often it does seem to go off on a tangent, editing unrelated parts of the codebase, or implementing a something in a way that I just wasn't happy with. I felt that it was making me more productive, but I also felt like I spent a good amount of my time chasing the LLM, going back and forth on the same problem and repeatedly proding it to get to the outcome that I wanted.

Another problem with this approach is repeatability, now rules files can help here to try and enforce some guidelines for how LLM's interact in certain scenarios, but when it comes to repeatability I was getting sick of constantly having to type prompts like "You are a senior developers with 10yrs of experience yadda yadda". I had played around with some Agents, and they were a step in the right direction, but the whole thing was still feeling very manual, in that I had to hand-hold the AI at each step.

Then last month I read a blog post published by Ryan Lopopolo from the OpenAI Tech Team about <a href="https://openai.com/index/harness-engineering/" target="_blank" rel="nofollow">Harness Engineering</a> and this got me interested. I had heard of people creating teams of Agents, so I decided it was time to jump in.

## Harness Engineering 101
As I said in my previous blog post the name is really clever, the basic concept is that you think of AI like a horse, it's fast and it's powerful, but for the vast amount of people, if you try an ride it bareback then you're going to have a bad time. Thats why you need to develop a Harness for the horse, allowing you to make use of the power and speed it provides while being much more in control of where the final destination is.

The harness also means you can repeatedly ride the horse to different destinations, but with the same ease. Now from time to time you might have to tighen the harness when you realise there's something you're not happy with. You might also make some slight adjustments depending on the journey your taking or the destination. Overall though, the harness remains pretty much the same for each trip. The same is true for Harness Engineering as well.

In this case the harness is a series of agents, roles, artifacts, and workflow rules that let you guide execution instead of hoping for a good result. 

If we look at the agents, I ended up having the following execution flow between each of them...

flowchart TD
    O[Orchestrator]

    O --> P[PO-Spec]
    P --> O

    O --> F[Feature Design]
    F --> O

    O --> T[Tech Lead]
    T --> O

    O --> B[Build]
    B --> BC{Build complete?}
    BC -->|No| B
    BC -->|Yes| O

    O --> Q[QA]
    Q --> QR{QA passed?}
    QR -->|No| B
    QR -->|Yes| O

    O --> C[Complete]





Show the shift from prompting to orchestration
A key idea is that the value stopped coming from a single clever prompt and started coming from how the work was decomposed, sequenced, and handed off between bounded stages.

Introduce the idea of bounded agent roles
Each agent should have a narrow purpose, clear responsibilities, and explicit limits. This reduces role leakage, keeps outputs focused, and makes the system easier to reason about and improve.

Highlight the importance of durable artifacts
Specs, plans, design notes, QA outputs, and run reports became the memory and control surface of the workflow. The system worked better once important decisions lived in files rather than only in chat context.

Emphasise why constraints improved quality
One of the biggest lessons is that tighter rules often produced better outcomes. Clear input contracts, required outputs, stage gates, and validation made the workflow more reliable than open-ended generation.

Position Harness Engineering as a repeatable pattern, not a one-off experiment
Close by making the point that this is bigger than one website or one build: it is an approach to AI-assisted software delivery that can be adapted to future projects, teams, and product domains.