---
title: 'Setting up an external XM Cloud Rendering Host to work with Experience Editor and Pages'
slug: 'setting-up-an-external-xm-cloud-rendering-host-to-work-with-experience-editor-and-pages'
dateCreated: '2022-09-26'
lastUpdated: '2022-09-26'
abstract: "We've recently been working on a migration project, moving, and rebuilding a series of sites to run against Sitecore XM Cloud. One of the key requirements was to ensure that all the sites could be edited in both Sitecore Experience Editor, and the next-generation editing interface included with XM Cloud - Sitecore Pages. This blog post will cover the steps we took to get this working."
publishDate: '2022-09-26'
disqusId: '377ec2d6-9e18-4623-954d-17513e227c9c'
tags: ['Sitecore','XM Cloud', 'Experience Editor', 'Pages', 'Headless', '.NET', 'Azure']
---

## Sitecore XM Cloud, Experience Editor & Pages
We've recently been working on a migration project, moving, and rebuilding a series of sites to run against Sitecore XM Cloud. One of the key requirements was to ensure that all the sites could be edited in both Sitecore Experience Editor, and the next-generation editing interface included with XM Cloud - Sitecore Pages. This blog post will cover the steps we took to get this working.

The project we’re working on is Open Source and you can follow our progress here: https://github.com/Sitecore/XM-Cloud-Introduction 

Now for the sites we rebuilt using SXA Headless this was a simple task. XM Cloud will automatically stand-up hosting Rendering Host (RH) instances used to power the different editing interfaces for those sites, but what about the site we needed to migrate? Well if this was a JavaScript-based head this would again have been simple as we could have created a new rendering definition in our `xmcloud.build.json` and the automated processes built into XM Cloud would have created and configured a RH instance for us. However, the site we were migrating over was the Sitecore MVP site which isn’t built with JS, it’s built using the <a href="https://doc.sitecore.com/xp/en/developers/hd/200/sitecore-headless-development/sitecore-asp-net-rendering-sdk.html" target="_blank" rel="nofollow">Sitecore ASP.NET Rendering SDK</a>, so we couldn’t use this automated process and had to configure both the Experience Editor and Pages to pull in a RH we hosted ourselves externally to XM Cloud.

## Deploy and configure the RH
We’re hosting the RH for the MVP site in a WebApp instance in Azure. So, the first task was to configure the RH run there. To do this we followed the same process we used to run the RH locally against Edge. If you look at the <a href="https://github.com/Sitecore/XM-Cloud-Introduction/blob/main/docker-compose.edge.yml" target="_blank" rel="nofollow">docker-compose.edge.yml</a> in the repo you can see that we needed to set the following Environment Variables in the Azure portal for the WebApp we created

* `Sitecore__InstanceUri`
* `Sitecore__LayoutServicePath`
* `Sitecore__ExperienceEdgeToken`

This gave us a running instance of the RH in Azure, but how did get Experience Editor and Pages to reference this instance? Well, the first thing was to enable the Experience Editor middleware for the RH. This is controlled by an app setting called `Sitecore__EnableExperienceEditor` which is a Boolean that needs to be set to `true`, that was only the first step in the process though…

## Configuring Experience Editor and Pages
Now the MVP site isn’t built with SXA so it doesn’t leverage the SXA Site Manager, instead, we use a manual site definition which you can see in our <a href="https://github.com/Sitecore/XM-Cloud-Introduction/blob/main/src/Project/MvpSite/platform/App_Config/Include/Project/Project.MvpSite.config" target="_blank" rel="nofollow">Project.MvpSite.config</a>. If you look at the `javaScriptServices` node you can see here we specify a couple of attributes that define the URL’s used to access the RH and its these values that the Experience Editor and Pages use in XM Cloud. 

* `serverSideRenderingEngineEndpointUrl`
* `serverSideRenderingEngineApplicationUrl`

When running locally the `serverSideRenderingEngineEndpointUrl` parameter points to the internal container name for the RH and the `serverSideRenderingEngineApplicationUrl` is the public URL. When running in XM Cloud with an externally hosted RH there is no internal name, so both params are set to the public URL for the rendering host. We do this by setting Environment Variables in XM Cloud for both values listed in the config above. This also means we can set different RH’s to be used for different Production and Non-Production XM Cloud environments which is nice:

![XM Cloud Environment Variables][1]

We set those values, deployed our XM Cloud instance, and fired up the Experience Editor and were hit with the following error: `Connection to your rendering host failed with an Unauthorized error. Ensure the JSS Editing Secret is configured.`

I went and checked the logs for the RH in the Log Stream in Azure and saw a matching error message there confirming the request was being denied: `The JSS_EDITING_SECRET environment variable is missing or invalid.`

## Getting and setting the JSS Editing Secret
Now you can manually set the JSS Editing Secret for the XM Cloud using a configuration patch, but we hadn’t done that for our instance, so what was our JSS Editing Secret set to? I fired up the `ShowConfig.aspx` administration page for our XM Cloud instance and looked for the setting named `JavaScriptServices.ViewEngine.Http.JssEditingSecret` and could see it existed. Turns out that XM Cloud will automatically patch in a generated JSS Editing secret if you don’t provide one yourself. This is generated when the environment is provisioned though, so you don’t need to worry about it being changed when each deployment happens, the same value will be persisted.

I took this back over to the configuration settings in Azure and created a new setting. Our RH is configured to use the setting named `Sitecore__JssEditingSecret` for its editing secret, so we created a setting with that name and value we pulled from XM Cloud and then everything fell into place.

## Experience Editor and Pages
Once all the settings were there, I headed back to XM Cloud and fired up the Experience Editor and everything loaded up correctly 

![MVP Site loaded in Sitecore Experience Editor][2]

But what about Sitecore Pages? I wanted to try the latest editing interface that has been released with XM Cloud as well. It turns out no other configuration was required to enable it as Sitecore Pages works from exactly the same settings as the Experience Editor, so when we loaded up Pages everything worked just as expected!

![MVP Site loaaded in Sitecore Pages][3]

[1]: /img/blog-images/2022/xm-cloud-env-vars.png
[2]: /img/blog-images/2022/mvp-ee.png
[3]: /img/blog-images/2022/mvp-pages.png