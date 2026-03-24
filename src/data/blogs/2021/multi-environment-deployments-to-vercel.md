---
title: 'Multi-Environment deployments to Vercel'
slug: 'multi-environment-deployments-to-vercel'
dateCreated: '2021-03-02'
lastUpdated: '2021-03-02'
abstract: "So this week I've been building a Sitecore Experience Commerce deployment in Azure. This is using mostly PaaS based resources, so WebApps, Azure SQL and all that jazz. However I wanted to try to keep the spend down a bit and the easiest way to achieve that is to switch out Azure Search for Solr"
publishDate: '2021-03-02'
disqusId: '0a5f49a1-5122-434a-9aa9-fea2d5e760c6'
tags: ['Vercel','DevOps']
---
In this post I’m going to take a look at Vercel and what is involved in setting up a multi-environment deployment, along with IP restrictions for non-production environments.

## Multi-environment deployments
Vercel by default has the concept of Production and Preview environments. Each project created in Vercel comes with the concept of a single Production environment and the ability to create multiple Preview environments. 

### Production Environment
The production environment is tied to a specific branch in your repo (commonly `main`). Each time something is merged to this branch the Production site is automatically updated to incorporate the new changes.

### Preview Environment
For the Preview Environments, each time a commit is made on a branch other than `main` a Preview environment is created for that commit, this is a really nice feature that allows for isolated feature branch testing, but isn’t really what we’re trying to configure here.

### Setting up Non-Production Environments
In our scenario I want to setup a `Staging` environment that will be deployed to before we go to Production. The thinking here is that feature testing would happen on the feature branches, using the Preview environments mentioned above. Once complete you would then use the `Staging` environment to get final approval before deploying to the actual Production site. This a fairly typical of a more enterprise style deployment flow, where you can see multiple non-production environments in use before the code makes it to production.

To achieve this in Vercel, you’re going to need to setup some domains you want to use for these environments. Once you have them you can tie them to your project in the projects Settings -> Domains section. Here you can see what it looks like with a staging domain added:
 
![Vercel Multiple Environments][1]

The key thing to notice here is the `Assigned to` note below the domain name, this shows which branch the domain is built from. You can see the Staging site is assigned to a branch named `staging` that has been created. 

This is how multiple environments are managed when working with Vercel, you need to control it using your branching strategy. This means that enforcing this requirement would require some management of commits and how they flow through your branches for example a new feature being worked on would need to be pushed through the branches as so: `Feature-branch -> staging -> main`

Adding more Non-Production environments into this flow as easy as just creating a new branch and inserting it into the flow before the merge to main.

## IP Restrictions
One of the nice things with the Preview environments provided by Vercel by default is that they automatically send the `x-robots-tag:nofollow` header so that indexers wont include your Preview domains in their search listings. This isn’t automatic for other domains you add though so you’ll need to set that up yourself. A common way to restrict access to non-production environments is to setup IP restrictions, allowing only certain IP’s to access those environments. This isn’t possible just using Vercel according to a discussion on their <a href="https://github.com/vercel/vercel/discussions/5304" target="_blank" rel="noopener">GitHub repo</a>. You instead need to configure a CDN like <a href="https://www.cloudflare.com/" target="_blank" rel="noopener">Cloudflare</a> in front of those environments and use that to restrict access.

## Conclusion
In conclusion Vercel offers a really nice setup process for simple direct deployments where every commit is pushed directly to your Production environment. If you need something more complex, then you can configure that but some work is required. They specialise in the hosting element alone, pushing other features like IP restrictions or deployment flows out to externally linked systems better suited to implementing them.

[1]: /img/blog-images/vercel-multi-env.png