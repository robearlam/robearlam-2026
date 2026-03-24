---
title: 'Restructuring the Sitecore XM Cloud Foundation Head'
slug: 'restructuring-the-sitecore-xm-cloud-foundation-head'
dateCreated: '2024-09-20'
lastUpdated: '2024-09-20'
abstract: "Anyone who watches the Sitecore XM Cloud Foundation head repositories would have seen this PR get approved on the dev repo recently. This has implemented a significant restructuring, aimed at providing a more logical and streamlined approach to building sites with XM Cloud. This update brings several key changes and benefits for developers. "
publishDate: '2024-09-20'
disqusId: 'a18b1571-cf35-4c19-abfb-75deb828231b'
tags: ['Sitecore','XM Cloud','Foundation Head','Starter Kit', 'Getting Started']
---

## Restructuring the Sitecore XM Cloud Foundation Head: A Logical Approach to structuring code for Headless Sites
Anyone who watches the Sitecore XM Cloud Foundation head repositories would have seen this <a href="https://github.com/sitecorelabs/xmcloud-foundation-head-dev/pull/170" target="_blank" rel="nofollow">PR</a> get approved on the `dev` repo recently. This has implemented a significant restructuring, aimed at providing a more logical and streamlined approach to building sites with XM Cloud. This update brings several key changes and benefits for developers. 

We’ve been talking about these changes for a while now, <a href="https://www.linkedin.com/in/liznelsondev/" target="_blank" rel="nofollow">Liz Nelson</a> discussed these changes in detail at SUGCON EU and SUGCON India. For those interested in a deeper dive, you can watch the recording of her presentation at SUGCON EU below

<div class="video-container"><iframe src="https://www.youtube.com/embed/03kz_jsjHME" title="Liz Nelson - The Future of Developer Experience (Working Title)" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>


Let’s take a look at what we've changed and why…

## Favouring FED-First development
The changes made to the repo are designed to drive a shift towards FED-First development. This is when the developer just runs the “head” application locally, pulling data directly from XM Cloud, instead of mocking some of the services locally using Docker. This switch makes it much simpler for new developers to get up and running with Sitecore XM Cloud and improves the speed of development cycles for developers building day-to-day.

## Avoiding Customizations on the CM Instance
This switch makes more sense from a customization standpoint as well. This new structure is better aligned with the recommendation to avoid customizations on the Content Management (CM) instance where possible and push changes externally - either down to the head or to an Integration Platform as a Service (iPaaS) provider like <a href="https://developers.sitecore.com/products/connect" target="_blank" rel="nofollow">Sitecore Connect</a>. Mocking a bunch of application Instances like SQL and the CM locally, when we’re moving customisations away from them, adds a bunch of unnecessary overhead and restrictions to the developer machine e.g. forcing developers to use Windows machines to support Windows based containers.

## Does this mean Docker is Dead?
A common question we’ve heard with this approach is whether Docker is now dead? The answer is **NO**! Docker remains a perfectly valid development approach, we’re just changing the _default_ development approach. If you have a well-established development flow using Docker, feel free to stick with it. The restructuring simply changes the default approach, but Docker continues to be a great tool for many development teams who are skilled in it, and are already using it day-to-day.

## Should existing projects update?
Another question we’ve heard is whether customers with existing projects built on the previous structure should update to match to the new one? To me, this is a matter of personal preference and not a requirement. The Starter Kits are template repositories, so when you start a project from one, you don’t have an upstream link to the original repository by default. However, if you like to pull in changes from the starter kit into your repository as they are updated to keep yours in sync, the process will be simpler if you migrate to the new structure.

## Guidance for Restructuring
For those are interested in restructuring their existing projects, there will be guidance available. I recently went through the process for the <a href="https://github.com/Sitecore/XM-Cloud-Introduction/" target="_blank" rel="nofollow">XMC Introduction Repo</a>, and you can see the pull request <a href="https://github.com/Sitecore/XM-Cloud-Introduction/pull/481" target="_blank" rel="nofollow">here</a>. Once the review is complete and it’s merged, I’ll release a follow-up blog post covering how we found the process and what was entailed.

## The future…
This is one of the first of a few changes that you will see rolling out for the starter kits and the Getting Started process for XM Cloud in General. Anyone who has visited the Sitecore Documentation Site recently would have seen that we also published a new <a href="https://doc.sitecore.com/xmc/en/developers/xm-cloud/getting-started-with-xm-cloud.html" target="_blank" rel="nofollow">Getting Started Guide for XM Cloud</a> that also aligns to the FED-First development approach.

Stay tuned for further developments in the coming weeks and months as we look to make developers lives easier when working with the Sitecore products!