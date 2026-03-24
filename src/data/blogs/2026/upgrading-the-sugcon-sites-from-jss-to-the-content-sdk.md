---
title: "Upgrading the SUGCON sites from JSS to the Content SDK"
slug: "upgrading-the-sugcon-sites-from-jss-to-the-content-sdk"
publishDate: "2026-03-23"
disqusId: "dffef881-6f5c-4194-9919-5c9d9eb53280"
abstract: "Ok, so as the heading suggests, I want to start this blog post with a bit of a confession… We were bad developers and didn’t upgrade the SUGCON sites as the newer versions of JSS were released."
tags: ['SiecoreAI', 'Content SDK', 'JSS']
---

## Confession time
Ok, so as the heading suggests, I want to start this blog post with a bit of a confession… We were bad developers and didn’t upgrade the SUGCON sites as the newer versions of JSS were released. It was built on JSS 21.5, which was released over 2 years ago and we didn’t move it forward as the newer versions were released.

Now in our defense, the SUGCON sites are just used for the different SUGCON events that happen throughout the year, so each one is busy for a couple of months then generally lies dormant till the event comes around again the year after. So, they’re not constantly high traffic sites that required maintenance throughout the year.

## Content SDK replacing JSS for SitecoreAI
This worked fine for us, until the Content SDK was released last year. For those who don’t know, the Content SDK is the latest version of JSS tailored specifically for SitecoreAI. After the SDK made it to v1 we specified a <a href="https://support.sitecore.com/kb?id=kb_article_view&sysparm_article=KB1004260" target="_blank" rel="nofollow">Support Lifecycle</a> after which JSS will no longer be supported on SitecoreAI. This is due to happen at the middle of the year, so we knew we needed to upgrade the SUGCON sites to Content SDK, not only to keep in support, but also take advantage of the latest and greatest features that SitecoreAI has to offer.

Looking at the upgrade paths, with us having ignored the sites for so long going through each of the upgrade steps seemed super painful and error prone, so instead we decided to go for a “lift and shift” approach, of taking a clean Content SDK site and adding our components and customisations into the new site.

This ended up being a pretty smooth process, but with us being on some pretty old versions for things there were some bumps we encountered along the way. So, I wanted to document the steps we took to bring the site back up to date.

I will call out that we didn’t just upgrade the site, we also migrated to the newly supported next.js AppRouter and also updated some of the approaches that we went with in the original build.

## Initial lift-and-shift
So, the initial steps were super simple to complete. I renamed the existing headapp folder to `SUGCON-old`, and created a new empty Content-SDK site in a folder called `SUGCON`, I did this using <a href="https://doc.sitecore.com/sai/en/developers/content-sdk/20/create-a-content-sdk-app-locally.html#use-the-content-sdk-cli" target="_blank" rel="nofollow">NPX CLI Command</a> that made it super simple. From here I updated the `package.json` to have the correct Site name etc.

Next up I moved all of the Components from the old implementation into the new site, and started to tidy up any errors. The main one being updating all the imports to instead be pulling references from the Content SDK libraries and not the old JSS libraries.

After this I had to update all of my `Placeholder` Components to `AppPlaceholder`, but this was just required as we also migrating over to use the AppRouter functionality, if you’re staying on the Pages Router for now then this won’t be necessary.

Another thing that has changed is how to reference the page mode in your components. A lot of the time developers will have their components render differently in the Pages editor, to allow marketers to set different values as required. The object you now need to test in the Content SDK is `page.mode.isEditing`. This is common practice as sometimes your content editors need to also change values that aren’t rendered on the page. A good example of this is to ensure that empty fields are rendered correctly, e.g. we have a <a href="https://github.com/Sitecore/XM-Cloud-Introduction/blob/main/headapps/Sugcon2024/src/components/basic-components/person/Person.tsx" target="_blank" rel="nofollow">Person Component</a> in the SUGCON sites and use this functionality to ensure that a person’s social links are displayed correctly even if they don’t have an account for that social platform. 

At this point we could have stopped and had a working site, but with the sites having been a bit neglected for a while we decided to perform some other housekeeping activities as well.

## Extra Housekeeping Items
As I mentioned we decided to give the codebase a bit of a tidy as well, as since we first built the sites out things had changed on both the Next.js and SitecoreAI side, so there were nicer patterns that we could change over to.

### Dropping cslx
The first one of these was dropping the usage of cslx. This is a library that is used for string templating to allow you programmatically construct css class names using some basic logic.

When the site was built a few years back this was a good choice, but since then Next.js has increased it’s native support for string templating, so we could drop this dependency all together and just revert to the basic approach built into next. Anytime you can remove a dependency from your app is a win for me, so I was happy with this one.

### Restructuring Rendering Variants
Since we released the initial build of the SUGCON sites, we have introduced support for file based Rendering Variants. This means you can split each rendering variant into it’s own file, instead of having a single large component file containing all of the different exports.

We used Rendering Variants in a few places so made the effort to pull those out into dedicated files. This keeps each of the components much leaner and makes for a nicer developer experience, another win!

### AppRouter and Top Level Client Wrappers
The final one here was something we had specifically as we were switching to leverage AppRouter as well. The SUGCON sites are based on Chakra for their styling, and you need to have a top level Provider wrapper for your page, which is the `ChakraProvider`… and this needs to be run Client Side.

This was an issue as we didn’t want to change our main Layout to run Client Side as that would defeat the purpose of us switching over to AppRouter.

Luckily the Content SDK team had already factored this in, if you look in the `/src` of a Content-SDK project then you will see a `Providers.tsx` component, sitting alongside your main `Layout.tsx` component. This is designed for you to include all your top level Providers that are required to run Client-Side, meaning you don’t need to make your main Layout run in the client while building for AppRouter. Another Win!

### Changing from Storybook to Design Studio
We had initially implemented Storybook as part of the initial project as a way for developers to easily see all of the Components in the project in action. Since we build the project, some of the libraries our Storybook implementation hadn’t been maintained and upgraded to the later framework versions. Luckily in the same time SitecoreAI had released Design Studio, this is one of the key features that Content SDK was built to support. Design Studio gives the same ability to preview Components, along with much more as well. This meant that we could drop our Storybook implementation all together, another large dependency dropped!

## Deployment Changes
The final thing we needed to do to complete our work was to make some small changes to our deployment setup. As we were coming from such an old version of the SDK we didn’t have the ability to use ContextID’s and instead were having to use the older API KEY approach. This was an easy fix and just needed us to enter the new Environment Variables into Vercel and they were picked up. The final change was also bumping the Node version in Vercel, as again we were running a super older version and needed to bump it up to the latest node LTS.

## Conclusion
All in all, the upgrade process was really smooth and for anyone else who has a neglected JSS app running a super old version I can recommend following the “lift and shift” approach, instead of following all of the individual upgrade point guides. In total, I think there was probably about 3 days work in total to get all of this completed, but that also included the migration to AppRouter, so I would expect customers not completing that move as well to probably be able to complete it faster, depending on the size of the site and number of customisations that have been made.

Finally, this work was completed last month, it just took me a bit of time to get this post out. Since then Content SDK v2.0 has just been released though. Let me assure you we’re not going to make the same mistake as last time, and completing this upgrade will be happening very soon. If you keep up with upgrades as they’re released then the process is much simpler and removes the need for these bigger projects when the project drifts too far from current release.

I hope this information helps others who are looking to complete the upgrade to the Content SDK, and goes to show how simple it can actually be to complete, even if you’re on an older version like we were!