---
title: 'XM Cloud - External Editing Hosts Revisited'
slug: 'xm-cloud-external-editing-hosts-revisited'
dateCreated: '2025-08-06'
lastUpdated: '2025-08-06'
abstract: "With the shift to Pages Metadata editing mode, your external rendering host setup for Sitecore XM Cloud might need some love. Here’s how the Sitecore MVP site was updated to support the new flow of data."
publishDate: '2025-08-06'
disqusId: 'd6b940cc-b56e-45d6-81f4-70b984935d82'
tags: ['XM Cloud', 'Pages', 'Rendering Host', 'DevOps', 'Azure' ]
---

In a [previous post](https://robearlam.com/blog/setting-up-an-external-xm-cloud-rendering-host-to-work-with-experience-editor-and-pages), I walked through how to configure an external rendering host for Sitecore XM Cloud that plays nicely with Pages using the default Chrome-based editing mode. It turns out that with the release of MetaData editing mode for pages, things have changed a bit!

The Sitecore MVP site was recently updated to take advantage of the new **Pages Metadata editing mode** and it changes how your rendering host behaves when handling editing requests. Let’s take a look at what’s different, how you might be affected, and what to do if you are.

## A Quick Recap: Chrome Editing Mode

When Pages was operating in `Chromes` editing mode, it managed all of the editing data sent to the Editing Host. Pages would build all of the required data then send it down into the Editing host via a `POST` request.

You could use this process as a bit of cheat to simplify your architecture, as it meant you could configure a **single rendering host** with your **live context ID**, and it would serve both production traffic and editing traffic. As Pages would always send the correct preview editing data in the POST request, including all of the editing chromes, regardless of what Context ID the app had configured in its `.env` file.

## Enter Metadata Editing Mode

Now Sitecore released MetaData editing mode, which led to a hugely improved developer experience when working with Pages. However, those improvements involved a flip of that data request pattern.

Now, instead of Pages sending the editing data to the head via the `POST` request, it’s your rendering host that now makes a `GraphQL` request to Pages for its editing data. This means that these metadata requests are now tied to your apps configured `ContextId`. So if your host is pointing to the **live context**, you won't get the editing data the app needs to render correctly in Pages.

## What This Means for Your Host Setup

In practice, this means you can **no longer share a single rendering host** between production and editing traffic, while enabling MetaData editing.

Instead, you now need **two separate hosts**:

- A **production host**, configured with your **live context ID**
- An **editing host**, configured with your **preview context ID**

Each host should point to the corresponding context in your XM Cloud environment to ensure it receives the correct data for its role.

## What We Did on the MVP Site

The [Sitecore MVP site](https://mvp.sitecore.com) has now been updated to follow this pattern.

We’re using GitHub Actions to build and deploy the rendering host(s), and the workflow now provisions **two separate Azure Web Apps** for each env, one for the customer-facing site, one for editing each with the appropriate context ID baked into their environment settings.

You can see the GitHub Actions config here:

👉 [CI-CD_MVP.yml](https://github.com/Sitecore/XM-Cloud-Introduction/blob/main/.github/workflows/CI-CD_MVP.yml)

Even though this example is for a .NET rendering host deployed to Azure, the same principle applies across different tech stacks and cloud providers. The important bit is to deploy two distinct apps with the correct context IDs in place.

## Wrapping Up

If you’re planning to move to Metadata editing mode (which you most definitely should!) make sure to double check how your rendering host(s) are set up. You might have to introduce another app instance like we did, but with a bit of deployment automation, the split-host approach is pretty simple to implement.