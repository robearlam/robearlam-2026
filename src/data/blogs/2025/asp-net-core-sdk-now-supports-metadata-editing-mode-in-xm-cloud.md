---
title: 'ASP.NET Core SDK now supports MetaData Editing mode in XM Cloud'
slug: 'asp-net-core-sdk-now-supports-metadata-editing-mode-in-xm-cloud'
dateCreated: '2025-05-29'
lastUpdated: '2025-05-29'
abstract: "This week we released an update to the ASP.NET Core SDK to support MetaData editing mode in XM Cloud"
publishDate: '2025-05-29'
disqusId: 'adf456b3-6f46-4c0e-b830-71a0eba7b68c'
tags: ['Sitecore','XM Cloud','ASP.NET Core']
---

This week we released an update to the ASP.NET Core SDK to support MetaData editing mode in XM Cloud.

This is a huge productivity increase for developers looking to leverage the SDK when building against XMC Cloud as it means that while we still don’t have support for Sitecore hosted Editing Hosts, it is now really simple to test your local development changes in XM Cloud before committing your changes.

You can now, when logged into the XM Cloud Pages app, use the editing host selector to change over and connect directly to a locally running instance of your head like you can see below.

![ASP.NET Core SDK leverging XM Cloud MetaDat Editing][1]

This is a great boost for developer productivity as it allows you to test how your changes will look directly in the SaaS editing interface, without actually having to deploy your changes. This means you can iterate on changes, only committing them into your repo when you’re truly happy that they’re ready to be deployed.

## Setup Steps

These changes have already been integrated into the <a href="https://github.com/Sitecore/xmcloud-starter-dotnet" target="_blank" rel="nofollow">XM Cloud DotNet Starter</a>, so anybody starting a new project based on that starter kit will get this functionality by default. If you started a project using the SDK beforehand though, it’s easy to add the functionality in to your project in just a few steps.

- Update your ASP.NET Core SDK project references to use >= v0.0.14, and ensure you’re referencing the new `Sitecore.AspNetCore.SDK.Pages Assembly`.
- Update your _ViewImports.cshtml to also include `@addTagHelper *, Sitecore.AspNetCore.SDK.Pages`
- Update your _Layout.cshtml to include the new `<sc-editingscripts></sc-editingscripts>` in your head section.
- Ensure you are calling the new Extension methods ` AddSitecorePagesHandler()`, `WithSitecorePages(sitecoreSettings.EdgeContextId ?? string.Empty, options => { options.EditingSecret = sitecoreSettings.EditingSecret; });` and `UseSitecorePages(pagesSettings);` in your program setup.

You can see a detailed description of how these changes were made by taking a look at the <a href="https://github.com/Sitecore/xmcloud-starter-dotnet/pull/21/files" target="_blank" rel="nofollow">merged PR</a> in the XM Cloud Starter DotNet repo.

This is another big step forward towards v1 of the SDK, which is when we have the majority of the XM Cloud features supported. If your interested in the current state of the SDK and what features we’re going to be building out next, then you can see our project in our <a href="https://github.com/orgs/Sitecore/projects/10" target="_blank" rel="nofollow">public GitHub project</a>. 

[1]: /img/blog-images/2025/asp-net-core-metadata.png