---
title: "I upgraded the SUGCON sites from to Content SDK v2 in under 1hr"
slug: "i-upgraded-the-sugcon-sites-from-to-content-sdk-v2-in-under-1hr"
publishDate: "2026-04-02"
disqusId: "d2df15a4-245a-40a4-a0c4-2251141e1079"
abstract: "Just a quick blog post about a win I just had. I blogged last month about the process of upgrading the SUGCON sites from JSS to the Content SDK, and how the sites had been a bit neglected and were running a super old version"
tags: ['SitecoreAI', 'Content SDK', 'AI Development', 'Adversarial Testing']
heroImage: "/img/blog-images/2026/sugcon-csdk-v2-upgrade-hero.jpg"
---

Just a quick blog post about a win I just had. I blogged last month about the process of <a href="/blog/upgrading-the-sugcon-sites-from-jss-to-the-content-sdk" target="_blank" rel="nofollow">upgrading the SUGCON sites from JSS to the Content SDK</a>, and how the sites had been a bit neglected and were running a super old version. I finished the post by promising not to let that happen, and how we were going to ensure we kept up to date with future releases of the Content SDK. Well shortly after v2 of the SDK was released, so I knew I had to get onboard and update the sites to the latest version.

I decided to see how far AI could get me in the process... and it turns out it basically did it all for me first time. All in all the upgrade took me less than an to go from nothing to an <a href="https://github.com/Sitecore/XM-Cloud-Introduction/pull/585" target="_blank" rel="nofollow">open PR</a> ready for my colleagues to review.

I did this by leveraging Copilot CLI and the Adversarial Testing feature that it supports. All I did was to create a new branch on my machine, open the root of the repo using the Copilot CLI and give it the following prompt.

``` 
Please upgrade the SUGCON Site located in this repo to Content SDK v2. You can find the upgrade guide here: https://doc.sitecore.com/sai/en/developers/content-sdk/20/upgrade-content-sdk-1-5-1-next-js-apps-to-version-2-0.html.

Do not make any changes to git, I will do that once I'm happy with the work at the end.

Once you can finished, please run an adversarial test of the changes using both Opus 4.6 and GPT 5.4
```

This went away thinking and making changes for a while and came back with the following response.

```
 Upgrade Complete — Sugcon2024 → Content SDK v2

  All files changed

  ┌──────────────────────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ File                                         │ What changed                                                                                                                                                                        │
  ├──────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ package.json                                 │ Removed @sitecore-cloudsdk/*; added analytics-core, events, personalize at ^2.0.0; bumped SDK + CLI to ^2.0.0; next → ^16.1.1; @types/node → ^24.10.4                               │
  ├──────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ src/Bootstrap.tsx                            │ CloudSDK().addEvents().initialize() → initContentSdk({config, plugins}) with analyticsPlugin + eventsPlugin                                                                         │
  ├──────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ src/middleware.ts                            │ Deleted                                                                                                                                                                             │
  ├──────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ src/proxy.ts                                 │ Created — Next.js 16 proxy format; *Middleware → *Proxy class names; defineProxy; default export                                                                                    │
  ├──────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ src/components/content-sdk/CdpPageView.tsx   │ pageView import: @sitecore-cloudsdk/events/browser → @sitecore-content-sdk/events                                                                                                   │
  ├──────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ src/byoc/index.tsx                           │ Events namespace import: @sitecore-cloudsdk/events/browser → @sitecore-content-sdk/events                                                                                           │
  ├──────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ sitecore.config.ts.example                   │ SITECORE_EDGE_URL → NEXT_PUBLIC_SITECORE_EDGE_PLATFORM_HOSTNAME; PERSONALIZE_MIDDLEWARE_* → PERSONALIZE_PROXY_*                                                                     │
  ├──────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ .env.remote.example                          │ Added NEXT_PUBLIC_SITECORE_EDGE_PLATFORM_HOSTNAME, SITECORE_EXPERIENCE_EDGE_HOSTNAME, SITECORE_RENDERINGHOST_NAME; renamed PERSONALIZE_MIDDLEWARE_* → PERSONALIZE_PROXY_*           │
  └──────────────────────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

  Bugs caught by adversarial review

   - Opus
    4.6 caught: BotTrackingProxy imported from the dev branch template but not yet in published v2.0.1 — removed
   - GPT
    5.4 confirmed the above, and also caught: PERSONALIZE_MIDDLEWARE_* env var names in .env.remote.example were misaligned with the updated PERSONALIZE_PROXY_* names in sitecore.config.ts.example — fixed
```

Now this was the first time I'd upgraded a site to v2 of the Content SDK, so I followed the <a href="https://doc.sitecore.com/sai/en/developers/content-sdk/20/upgrade-content-sdk-1-5-1-next-js-apps-to-version-2-0.html" target="_blank" rel="nofollow">upgrade guide</a> myself afterwards to double check the changes it had made to ensure nothing had been missed. Turns out, it nailed it first time!

The thing I really liked about this was the text output at the bottom above, covering the result of the Adversarial Testing I asked it to complete. It used both `Opus 4.5` and also `GPT 5.4` to validate the changes it had made, and each model found different issues that needed to be fixed. This is a a super powerful trick as it means you can play models off against each other leveraging the benefits of both to get you where you need to go faster, how cool is that!