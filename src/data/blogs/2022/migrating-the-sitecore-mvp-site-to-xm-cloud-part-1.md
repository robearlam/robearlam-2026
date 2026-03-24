---
title: 'Migrating the Sitecore MVP site to XM Cloud – Part 1'
slug: 'migrating-the-sitecore-mvp-site-to-xm-cloud-part-1'
dateCreated: '2022-11-24'
lastUpdated: '2022-11-24'
abstract: "The Developer Advocacy team here at Sitecore recently completed a project to migrate the existing Sitecore MVP site, built with Sitecore XM 10.2, to XM Cloud."
publishDate: '2022-11-24'
disqusId: 'cdfa3976-e96a-4cde-8d28-e67721386497'
tags: ['Sitecore MVP','XM Cloud', '.NET', 'Experience Edge']
---

## Migrating the Sitecore MVP site to XM Cloud
The Developer Advocacy team here at Sitecore recently completed a project to migrate the existing <a href="https://mvp.sitecore.com/" target="_blank" rel="nofollow">Sitecore MVP site</a>, built with Sitecore XM 10.2, to XM Cloud. Now the original site was built headlessly using the <a href="https://doc.sitecore.com/xp/en/developers/hd/201/sitecore-headless-development/sitecore-asp-net-rendering-sdk.html" target="_blank" rel="nofollow">ASP.NET Rendering SDK</a> for the application, and content serialisation was handled using <a href="https://doc.sitecore.com/xp/en/developers/102/developer-tools/sitecore-content-serialization.html" target="_blank" rel="nofollow">Sitecore Content Serialisation</a>. The fact that both technologies are supported in XM Cloud made our migration much simpler. Now that won’t be the case for many Sitecore customers who have built against earlier versions or haven’t built their site using one of our headless SDKs.
The point of this blog series is to cover how the migration process went and highlight a couple of tasks we needed to complete in the process that other people might run into.
This will be split into the following four posts; this is the first in the series covering some of the initial changes we undertook as part of the migration. This will then be followed by:
- <a href="/blog/migrating-the-sitecore-mvp-site-to-xm-cloud-part-1">Part 1 – Migrating the Sitecore MVP site to XM Cloud</a>
- <a href="/blog/migrating-the-sitecore-mvp-site-to-xm-cloud-part-2">Part 2 – Custom Content Resolvers</a>
- <a href="/blog/migrating-the-sitecore-mvp-site-to-xm-cloud-part-3">Part 3 – The MVP Directory</a>
- <a href="/blog/migrating-the-sitecore-mvp-site-to-xm-cloud-part-4">Part 4 – Secure Pages</a>

## .NET 6 upgrade
The MVP site was originally built using v19 of the ASP.NET Core Rendering SDK, and since then v20 of the SDK had been released, which was built with .NET 6. So upgrading to the latest version meant we could leverage the new features that were released with .NET 6, you can learn all about what’s new in <a href="https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-6" target="_blank" rel="nofollow"> Microsofts release blog</a>. One of the nice things that this let us leverage was the <a href="https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis?view=aspnetcore-6.0" target="_blank" rel="nofollow">Minimal API</a> functionality. This lets you reduce the amount of code used to bootstrap an application. You can see this comparing the two versions of our `Program.cs` 

<a href="https://github.com/Sitecore/MVP-Site/blob/main/src/Project/MvpSite/rendering/Program.cs" target="_blank" rel="nofollow">Original Version</a>

```
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Mvp.Project.MvpSite.Rendering
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
```

<a href="https://github.com/Sitecore/XM-Cloud-Introduction/blob/main/src/Project/MvpSite/rendering/Program.cs" target="_blank" rel="nofollow">New Version</a>.

```
using Microsoft.AspNetCore.Builder;
using Mvp.Project.MvpSite.Rendering;

var builder = WebApplication.CreateBuilder(args);
var startup = new Startup(builder.Configuration);
startup.ConfigureServices(builder.Services);

var app = builder.Build();
startup.Configure(app, app.Environment);
app.Run();
```

Much cleaner!

## HTTPRequestHandler vs GraphQLHander
The next change we had to make was around how the head requested its data from Sitecore. The original version of the MVP site was built from the <a href="https://doc.sitecore.com/xp/en/developers/hd/201/sitecore-headless-development/walkthrough--using-the-getting-started-template.html" target="_blank" rel="nofollow">Getting Started Template</a>. This is a great place to start out when you looking to begin working with the ASP.NET Core Rendering SDK. It is built by default to connect to the LayoutService, however, with XM Cloud we’re going to be running against Sitecore Experience Edge instead. 

When we first connected the site to Edge, we noticed that our queries were failing. That was because we needed to change the RequestHandler. When you start a project, it will be provisioned to use the `HTTPRequestHandler`, if you look in the `Startup.cs` in the <a href="https://github.com/Sitecore/MVP-Site/blob/main/src/Project/MvpSite/rendering/Startup.cs" target="_blank" rel="nofollow">previous repo</a>, you will see the following lines:

```
services.AddSitecoreLayoutService()
    // Set default parameters for the Layout Service Client from our bound configuration object.
    .WithDefaultRequestOptions(request =>
    {
        request
        .SiteName(Configuration.DefaultSiteName)
        .ApiKey(Configuration.ApiKey);
    })
    .AddHttpHandler("default", Configuration.LayoutServiceUri)
    .AsDefaultHandler();
```

This won’t work with Experience Edge as it’s using a GraphQL endpoint instead, so we need to change this configuration to a new `GraphQLHander` that was introduced in v20 of the SDK. So if you check out the `Startup.cs` in the <a href="https://github.com/Sitecore/XM-Cloud-Introduction/blob/main/src/Project/MvpSite/rendering/Startup.cs" target="_blank" rel="nofollow">new repo</a>, you will see that those lines have now changed to:

```
// Register the GraphQL version of the Sitecore Layout Service Client for use against experience edge & local edge endpoint
services.AddSitecoreLayoutService()
    .AddGraphQlHandler("default", Configuration.DefaultSiteName, Configuration.ExperienceEdgeToken, Configuration.LayoutServiceUri)
    .AsDefaultHandler();
```

Much simpler than the previous implementation. There is also a preview GraphQL endpoint included in the CM application, so you don’t have to switch which provider you’re using for local development, that will work the same for both local and live published data.

One thing to note is that the path in the URL for the production Edge endpoint and the CM preview endpoints are different. For local development, you’ll want to use `/sitecore/api/graph/edge` whereas when working against Edge the path to use is `/api/graphql/v1`.

So that brings us to the end of the first post in this series. Next up I’ll be talking about Custom Content Resolvers and how Experience Edge changed how we worked with them.
