---
title: 'Building omni-channel experience with Sitecore Experience Edge & Mobile Blazor Bindings'
slug: 'building-omni-channel-experience-withsitecore-experience-edge-mobile-blazor-bindings'
dateCreated: '2021-07-07'
lastUpdated: '2021-07-07'
abstract: "A few months ago, I read about a new release from Microsoft called Mobile Blazor Bindings and it sounded really interesting, a way to embed a Blazor application inside of a Xamarin Forms application, meaning you could leverage web tech in building out your mobile experiences, how cool is that!"
publishDate: '2021-07-07'
disqusId: '4fe7d4d9-c7ef-4fec-9825-8f5ced8b40a2'
tags: ['Mobile Blazor Bindings','Sitecore Experience Edge', '.NET']
---

A few months ago, I read about a new release from Microsoft called <a href="https://docs.microsoft.com/en-us/mobile-blazor-bindings/" target="blank" rel="noopener">Mobile Blazor Bindings</a> and it sounded really interesting, a way to embed a Blazor application inside of a Xamarin Forms application, meaning you could leverage web tech in building out your mobile experiences, how cool is that! I recently released a video covering my learnings which you can see below, this is a post summarising what I was working on.

<div class="video-container"><iframe src="https://www.youtube.com/embed/MxfDqasm0No" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>

## Omni-channel experiences
Earlier this year we released <a href="https://www.sitecore.com/blog/content/were-thrilled-to-announce-groundbreaking-sitecore-experience-edge" target="blank" rel="noopener">Sitecore Experience Edge</a>, designed to power omni-channel experiences.  In our department at Sitecore we worked on a project to leverage Sitecore Experience Edge in building out a new <a href="https://github.com/Sitecore/edge-portal" target="blank" rel="noopener">Edge Portal</a>. This has been a really interesting project and I’ve got to learn some new technologies in the process, like <a href="https://nextjs.org/" target="blank" rel="noopener">Nextjs</a>, <a href="https://material-ui.com/" target="blank" rel="noopener">Material UI</a>, & <a href="https://vercel.com/" target="blank" rel="noopener">Vercel</a> to name a few. 
One of the main benefits to using Sitecore Experience Edge is how it can be used to power content for multiple channels, we had proved out the web channel as part of this project, but I wanted to add another channel. This gave me a great idea, why not replicate our portal site in app form using Mobile Blazor Bindings? What a great way to test out this new product we released and also get to play with some cool new tech. So, I fired up Visual Studio and dived straight in…

## Version 1 – Building for the mobile channel
Building out the mobile channel turned out to be very easy to do. As I could now build using web tech, it was a simple matter of lifting the markup & static assets that we’d used on the Edge Portal and re-using them in my mobile app. 
This worked like a charm and using standard <a href="https://github.com/graphql-dotnet/graphql-dotnet" target="blank" rel="noopener">GraphQL.NET</a> made it super simple to pull my dynamic data from Content Hub using Sitecore Experience Edge. The beauty of working with Mobile Blazor Bindings in this way is that I could now publish this application to Android, iOS, MacOS and Windows. This got me thinking though, how much more powerful would this use case have been if we had also built the web channel in Blazor? So that’s what I did next…

## Version 2 – Adding in the web channel
I started by splitting out any components & services that I would want to share between the different channels. I moved them into a couple of new projects, a <a href="https://docs.microsoft.com/en-us/aspnet/core/blazor/components/class-libraries?view=aspnetcore-5.0&tabs=visual-studio" target="blank" rel="noopener">Razor Component Library</a> to hold the components and a Class Library to hold the services used to pull data from my Experience Edge instance.
I then introduced a new Blazor WASM project that was going to hold my web application. What I now had was a true code sharing between all of the different channels that I was working with, a really powerful way of working.

## Conclusion
You can check out the video linked above to get a more detailed overview of this work, and also checkout the code in <a href="https://github.com/robearlam/edge-portal-apps" target="blank" rel="noopener">GitHub</a>. All in all, I really enjoyed working with Mobile Blazor Bindings and found it really simple to create cross channel experiences with large amounts of code sharing between them, I would recommend giving it a try!
