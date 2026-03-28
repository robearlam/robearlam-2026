---
title: "New Site, Who Dis?"
slug: "new-site-who-dis"
publishDate: "2026-03-27"
disqusId: "2e9d3147-5b71-4141-859f-2b4e8dcdd619"
abstract: "Like the majority of the rest of the development community, I've spent the past couple of years both amazed and a little bit terrified about how AI powered development has taken over the industry."
tags: ['Personal Site', 'AI Development']
heroImage: "/img/blog-images/2026/new-website.jpg"
---

For anyone who's read my blog posts before, you're wont have seen much (if any) content on here about horses, but turns out there's a first for everything. Bear with me though as it looks like I saved my "horse content" for just the right time.

Like the majority of the rest of the development community, I've spent the past couple of years both amazed and a little bit terrified about how AI powered development has taken over the industry. I've always been a developer who's excited about learning new things though, and this was a big one I could sink my teeth into.

Every few years a new technology comes along that I want to learn, and in those cases I have generally rebuilt my personal site that you're on now as a way to but the technology into play. I knew that I wanted to follow the same process for AI based development, but with the rapid pace of advancement in the technology, I was never really sure about when to attack this, until last month when I read a blog post published by Ryan Lopopolo from the OpenAI Tech Team about <a href="https://openai.com/index/harness-engineering/" target="_blank" rel="nofollow">Harness Engineering</a>  and I knew now was the time to bite the bullet.

I'm planning to write much more on this subject as it has been a decent learning curve for me, but it's been some of the most fun I've have writting code (or not writing it as the case maybe), in a very long time!

The basic concept is that you think of AI like a horse, it's fast and it's powerful, but for the vast amount of people, if you try an ride it bareback then you're going to have a bad time. Thats why you need to develop a Harness for the horse, allowing you to make use of the power and speed it provides while being much in control of where the final destination is.

In reality the what you end up building is a team of agents, each with a tightly bound function. They can't stray outside of their designated function, and there is an orchestrator agent who is repsonsible for invoking each of them. The orchestrator is repsonsible for invoking them in the correct order, and also ensuring that they complete succesfully before invoking the next one.

All of this comes together through a series of markdown files that are used to define how this system comes together. This is everthing from how the agents themselves function, the different actions they can perform, the files in the repo they have access to in order to perform their job, and how communication and state management is handled throughout all of this.

I'm planning to write all of this up in the coming weeks, as it's been an amazingly enjoyable learning journey for me to pull it all together and I'm hoping this series will help others looking to build software in the same way.