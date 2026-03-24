---
title: 'Nextjs v11 - ENOENT: no such file or directory when deployed to Vercel'
slug: 'nextjs-v11-enoent-no-such-file-or-directory-when-deployed-to-vercel'
dateCreated: '2021-10-05'
lastUpdated: '2021-10-05'
abstract: "Earlier today I made a few updates to the site you're ready this blog on now. Nothing too major, but one of the things I decided to do was to bump my current Nextjs version from the version I was on previously v10.0.6 to the current latest version v11.1.2. This was super simple to do complete and everything fine in my local. I pushed it out to production, and it was then things got interesting."
publishDate: '2021-10-05'
disqusId: '93ca3aec-661d-454c-89d2-1491956bf328'
tags: ['Nextjs','Vercel']
---

Earlier today I made a few updates to the site you're reading this blog on now. Nothing too major, but one of the things I decided to do was to bump my current Nextjs version from the version I was on previously `v10.0.6` to the current latest version `v11.1.2`. This was super simple to complete and everything worked fine in my local. I pushed it out to production, and it was then things got interesting.

As I said the site ran fine locally, I also ran a `npm run build` locally to ensure that my static pages would generate successfully. So I pushed it out to production, and was very surprised when I hit the site and was receiving a 500 error! This was a static site, how was I getting a server error?

This was happening on my homepage and while most of the site is statically generated, that page isn’t. I use ` getServerSideProps` to load in my blog articles from md files on disk, and I use querystring parameters to handle things like paging, so those pages are created and cached each time they’re hit. So, what was going with these initial requests to cause them to error out?

I jumped into Vercel and checked the Function Logs and could straight away see an error being recorded for each request:

```
ERROR	Error: ENOENT: no such file or directory, scandir '/var/task/data/blog'
    at Object.readdirSync (fs.js:1043:3)
    at GetAllPosts (/var/task/.next/server/chunks/89.js:76:63)
    at getSortedPosts (/var/task/.next/server/chunks/89.js:41:17)
    at getServerSideProps (/var/task/.next/server/pages/index.js:93:49)
    at Object.renderToHTML (/var/task/node_modules/next/dist/server/render.js:428:30)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at async doRender (/var/task/node_modules/next/dist/server/next-server.js:1144:38)
    at async /var/task/node_modules/next/dist/server/next-server.js:1236:28
    at async /var/task/node_modules/next/dist/server/response-cache.js:64:36 {
  errno: -2,
  syscall: 'scandir',
  path: '/var/task/data/blog',
  page: '/'
}
RequestId: eaa43503-10a2-4dd4-8843-78b332172c68 Error: Runtime exited with error: exit status 1
Runtime.ExitError
```

This made no sense, all of the blog files were being correctly loaded when running locally, but for some reason they weren't resolving when running in Vercel.
After a lot of Googling I stumbled across a <a target="_blank" href="https://github.com/vercel/next.js/issues/8251">GitHub issue</a> which discussed the fact that it was down the use of `process.cwd()` to calculate the path, which will apparently give a different response in development compared with Production.
There were a few workarounds that apparently worked in previous versions, but no longer did with Nextjs v11. 

Luckily, there was an <a target="_blank" href="https://github.com/vercel/next.js/issues/8251#issuecomment-915287535">answer that worked</a>. This explained that the latest canary build of Nextjs actually fixed the error and it could be enabled by adding the following to my `next.config.js`

```
  experimental: { 
    nftTracing: true 
  }
```

I added the values in, pushed to production, and just like that everything started working again! Hopefully if anyone else if facing the same issue then this can save them a few hours of head scratching!
