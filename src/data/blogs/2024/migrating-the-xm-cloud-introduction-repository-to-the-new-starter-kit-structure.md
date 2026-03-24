---
title: 'Migrating the XM Cloud Introduction Repository to the new Starter Kit structure'
slug: 'migrating-the-xm-cloud-introduction-repository-to-the-new-starter-kit-structure'
dateCreated: '2024-09-26'
lastUpdated: '2024-09-26'
abstract: "I recently wrote a blog post talking a new repository structure we are migration to for the XM Cloud Starter kits. As I mentioned in that post, my next task was to migrate our XM Cloud Introduction repository over to that new structure, and this post is going to over the tasks I needed to perform."
publishDate: '2024-09-26'
disqusId: 'a18b1571-cf35-4c19-abfb-75deb828231b'
tags: ['Sitecore','XM Cloud']
---

I recently wrote a blog post talking a new repository structure we are migration to for the XM Cloud Starter kits. This has a bunch of benefits that you can read about in my post <a href="https://robearlam.com/blog/restructuring-the-sitecore-xm-cloud-foundation-head" target="_blank" rel="nofollow">Restructuring the Sitecore XM Cloud Foundation Head</a>. As I mentioned in that post, my next task was to migrate our XM Cloud Introduction repository over to that new structure, and this post is going to over the tasks I needed to perform. The process I decided to follow for this was move everything into the new folder structure, then fix everything that was broke!

## Moving Everything into Correct Folders
First up was to reorganize the folder structure to ensure everything was now matching the new structure. This was pretty straight forward, as I mentioned above, I wasn’t concerned with ensuring that things running at this point, I just wanted things in the correct structure. The biggest task here was probably moving all the Item Serialisation files out from the `src` folder to now live in the `authoring` folder and getting that structure correct.

## FED-First Development Flow
As we’re preferencing the FED-First development flow now, the first thing to test was that. This was really straight forward, it’s a super-easy way to setup your development machine – which is why we’re moving our default development flow over. Setting up the `.env` file for the SUGCON sites, and the `appsettings.Development.json` for the MVP site was all that was required and then they were up and running.

## Docker based Development Flow
Next, was getting the Docker-based development flow working, this ended up being a bit more complex. First up I pulled in the latest versions of the scripts that had already been updated to the new structure in the Foundation Head repository. I also did the same for the `docker-compose.yml` and `docker-compose.override.yml`. 

Now the key thing to bear in mind here, is that we had amended the scripts slightly, along with the `docker-compose.override.yml` file to match the functionality required for this implementation, and you have most likely done the same. For this reason, I couldn’t just copy-paste the default versions over ours, I had to go through and compare and pull the changes for each. This was a bit time consuming, but after this was completed I had all of the application instances running in containers!

I also took this opportunity to update any image references in the `env.template` file.

## Serialisation 
The final large task that I needed to complete was to get the Serialisation running locally when using the Docker-based development flow. I thought for a while on how to structure this, and decided it was best to maintain the separation between the SUGCON & MVP items that we already had. While this is a multi-site instance, those sites have no shared content or assets, so keeping them separate make sense.
I then had to update the `sitecore.json` in the root of the repository. This files tells XM Cloud and the CLI where to find the serialisation items when running serialisation commands. This needed to be updated to handle the new path structure.

## Updating the XMCloud.build.json 
Next up was `xmcloud.build.json`, whether you’re using automated CI/CD provided by the XM Cloud Deploy Application, or if you’ve rolled your own deployments using the CLI like we have here, this file is the key to telling XM Cloud how to build out your environments. They main changes here for our implementation were to update the `buildTarget` paths, and `renderingHost` paths to match the new structure.

## MVP Site Adjustments
While I was touching so much of the repo, I also made a few small changes to the MVP site. This site was originally built on Sitecore XP v10.0 and has been migrated a bunch of times through different versions, finally landing in  XM Cloud. This mean there is still  a lot of  ‘Helix” style artifacts hanging around in the project, when this is no longer recommended for XM Cloud builds. For this reason I flattened project structure, making it more manageable.

Since the site was originally built Microsoft has also introduced native support for `dotnet watch` inside containers, so I removed a bunch of custom PowerShell that was mimicking that functionality and  moved to the default `dotnet watch` functionality, making for a smoother development experience.

## Updating GitHub Actions
Another task I had to complete was updating the GitHub Actions that we use for our CI/CD processes. This process involved a few changes:
- **Local paths change**: I updated the paths in our `yml` definitions to reflect the new folder structure.
- **Path depths for Azure Publishing**: The new folder structure meant that we were running at a different path ‘depth’ when publishing the MVP site, so that needed to be factored in.
- **Vercel Project Paths**: Similarly, I need to update the project settings in Vercel to match the new folder structure, so that Vercel knew where in the repo to find the SUGCON site source.

## Updating the READMEs
The final task was to update the READMEs that are included in the repository to match the new FED-First development approach. This was pretty straight forward as it involved aligning it to the changes that had already been made to the Foundation Head README.

### PR Review Pains
I do want to call out that with so many changes being made once to the Repo, this made the PR review process pretty painful. Firstly, this was due to the number of files that were touched as part of the change, I think pretty much every file in the repo was moved or updated. This meant that GitHub had real issues loading that PR into the browser.
The second problem, was my fault. Looking back I shouldn’t made feature changes at the same time. So migrating to the `dotnet watch` functionality, updating the Docker image versions, etc should have been made as their own separate PR’s after the restructure had been completed. I would strongly recommend only performing the restructure on its own and not trying to roll in other changes at the same time….. believe me, your PR reviewer will thank you!

## Closing thoughts
This wasn't a super hard piece of work to complete, but it was a bit time consuming getting everything playing well in the new structure. As I mentioned in my previous post, it's not mandatory to update your repo to follow the new structure, but I think it's worth the effort as it will make it simpler for us to adopt any future features as they're rolled out to the XM Cloud Starter Kits. 

Another thing to call out is that what I've described above are the steps that we needed to take to get the XM Cloud Introduction repository migrated, but your project will most likely have different requirements and different implmentation requirements. For that reason, you can use this a guide, but understand that not everything I described above may apply to your repository, and there also maybe other implementation specific steps you need to factor in that we didn't need to complete.

If you want to see what a real-world live multi-site implementation, using the new starter kit structure, looks like, you can check out the <a href="https://github.com/Sitecore/XM-Cloud-Introduction" target="_blank" rel="nofollow">XM Cloud Introduction repository</a>.