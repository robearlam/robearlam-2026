---
title: 'NETSDK1152 - Found multiple publish output files with the same relative path.'
slug: 'dotnet-6-view-imports-error'
dateCreated: '2022-08-25'
lastUpdated: '2022-08-25'
abstract: "Our team have recently been working on a project to migrate the existing Sitecore MVP site, to run against XM Cloud. One part of this involved upgrading the version of the Rendering Host, which was previously built using ASP.NET Core 3.1 to the latest version - .NET6"
publishDate: '2022-08-25'
disqusId: 'a45201d2-e66d-42a9-89b9-ca320ffc425e'
tags: ['.NET',]
---

## .NET 6 View Imports Error
Our team have recently been working on a project to migrate the existing Sitecore MVP site, to run against XM Cloud. One part of this involved upgrading the version of the Rendering Host, which was previously built using ASP.NET Core 3.1 to the latest version - .NET6. 

The upgrade path was a simple process and allowed us to leverage a lot of the new framework’s features, like the new <a href="https://docs.microsoft.com/en-us/aspnet/core/migration/50-to-60?view=aspnetcore-6.0&tabs=visual-studio#nhm" target="_blank" rel="nofollow">Minimal Hosting Model</a>. However, we did run into one small issue, the project was originally built following the Sitecore Helix standards which involved splitting different pieces of functionality into separate projects. This worked fine when running the application in Docker or directly from within Visual Studio, but I started getting a new error when I tried to publish the project…

```
Error NETSDK1152: Found multiple publish output files with the same relative path: 
    C:\Solutions\XM-Cloud-Introduction\src\Feature\BasicContent\rendering\Views\_ViewImports.cshtml, 
    C:\Solutions\XM-Cloud-Introduction\src\Feature\Navigation\rendering\Views\_ViewImports.cshtml, 
    C:\Solutions\XM-Cloud-Introduction\src\Feature\Social\rendering\Views\_ViewImports.cshtml, 
    C:\Solutions\XM-Cloud-Introduction\src\Feature\User\rendering\Views\_ViewImports.cshtml.
```

This was indicating there was an issue with each referenced project containing its own _ViewImports.cshtml file. This wasn’t an issue when building the app using .NET Core 3.1, so something must have changed with the migration to .NET 6.

## .NET 6 View Imports Error Solution
A bit of googling led me to this document from Microsoft that confirmed this was a feature included in .NET 6 to stop <a href="https://docs.microsoft.com/en-us/dotnet/core/compatibility/sdk/6.0/duplicate-files-in-output" target="_blank" rel="nofollow">duplicate files being included in publish artifacts</a>.

So how do we get around it, well it turns out it’s fairly simple. All we need to do is to add the following line to our Rendering Hosts project file and then everything worked again!

```
<ErrorOnDuplicatePublishOutputFiles>false</ErrorOnDuplicatePublishOutputFiles>
```