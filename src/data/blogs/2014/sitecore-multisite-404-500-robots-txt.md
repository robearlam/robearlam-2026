---
title: 'Sitecore Multisite 404, 500 & Robots.txt'
slug: 'sitecore-multisite-404-500-robots-txt'
dateCreated: '2020-08-31'
lastUpdated: '2020-09-03'
abstract: "After working on many multisite Sitecore configurations, it's always surprised me that Sitecore doesn't provide the ability to specify different 404, 500 & robots.txt's for each site. In the past I've"
publishDate: '2014-07-19'
disqusId: '39717341-2cc6-4a2e-b113-87833692925b'
tags: ['404','500','MultiSite','Robots.txt','Sitecore']
---
After working on many multisite Sitecore configurations, it's always surprised me that Sitecore doesn't provide the ability to specify different 404, 500 & robots.txt's for each site. In the past I've implemented these pieces of functionality separately. I've now combined the three into single module which can handle all three cases. This has been released on <a title="Sitecore.MultisiteHttpModule" href="https://github.com/AuthenticEntertainment/Sitecore.MultisiteHttpModule" target="_blank" rel="noopener">Github</a> and <a title="Sitecore.MultisiteHttpModule" href="https://www.nuget.org/packages/Sitecore.MultisiteHttpModule/" target="_blank" rel="noopener">Nuget</a> and is available for use now.

## Installation Instructions

### Nuget

This module is hosted in Nuget and can be installed in Visual Studio via the package manager using the following command:

```
PM> Install-Package Sitecore.MultisiteHttpModule
```

All you need to do then is to manually edit your Global.ascx.cs to include the reference to the error handling code.

```
public void Application_Error(object sender, EventArgs args)
{
    Sitecore.MultisiteHttpModule.Errors.ErrorHandler.HandleError(Server.GetLastError());
}
```

### Manual

*   Get the project from <a title="Sitecore.MultisiteHttpModule" href="https://github.com/AuthenticEntertainment/Sitecore.MultisiteHttpModule" target="_blank" rel="noopener">Github</a> then build project and reference the DLL in your project.
*   Include the httpRequestBegin pipeline processor if you want to make use of the 404 functionality.

```
<httpRequestBegin>
    <processor type="Sitecore.MultisiteHttpModule.NotFound.NotFoundHandler, Sitecore.MultisiteHttpModule" patch:after="processor[@type='Sitecore.Pipelines.HttpRequest.ItemResolver, Sitecore.Kernel']" />
</httpRequestBegin>
```

*   Insert the required web.config sections.

```
<configSections>
    <section name="multisiteHttpModule" type="Sitecore.MultisiteHttpModule.Configuration.MultisiteHttpModuleSettings, Sitecore.MultisiteHttpModule" />
</configSections>

<multisiteHttpModule defaultErrorPage="/error.html" errorsEnabled="True" notFoundEnabled="True">
    <exclude404Rules>
        <add type="Contains" match="~/media/" />
        <add type="Contains" match="~/icon/" />
        <add type="Contains" match="~/link.aspx" />
        <add type="StartsWith" match="/sitecore" />
        <add type="Contains" match=".asmx" />
        <add type="Contains" match=".ashx" />
    </exclude404Rules>
</multisiteHttpModule>

<system.webServer>
    <handlers>
        <add name="RobotsHandler" path="/robots.txt" verb="GET" type="Sitecore.MultisiteHttpModule.Robots.RobotsHandler, Sitecore.MultisiteHttpModule" />
    </handlers>
</system.webServer>
```

*   Add the error handling code into Global.ascx.cs.

```
public void Application_Error(object sender, EventArgs args)
{
    Sitecore.MultisiteHttpModule.Errors.ErrorHandler.HandleError(Server.GetLastError());
}
```

## Usage

After installing the module, you need to include the new attributes on your existing Sitecore sites node. If you don't want to add one of the functions to a site, then don't include that attribute and the code will fallback to the default Sitecore functionality.

```
<site name="MySite" 
      ...
      notFoundPageId="{BFA65433-4552-4507-9375-C96137287640}"
      errorPagePath="/errors/MySite.html" 
      robotsTxtLocation="/robots/MySite.robots.txt" />
```

### 404 Page usage

The 404 page functionality can be configured by populating the **notFoundPageId** attribute on the site node. This needs to be populated with the ID of the item you wish to use for the 404 page. If the item isn't found then it will fallback to the default Sitecore 404 functionality.

If you want to exclude certain URL's from being processed by the 404 handler then you can use the **exclude404Rules** configuration section in the web.config, this will allow you to exclude URL's from being processed by checking for a string value in the URL. You can check whether a URL **Contains**, **StartsWith** or **EndsWith** the value. The default ones are as follows:

```
<add type="Contains" match="~/media/" />
<add type="Contains" match="~/icon/" />
<add type="Contains" match="~/link.aspx" />
<add type="StartsWith" match="/sitecore" />
<add type="Contains" match=".asmx" />
<add type="Contains" match=".ashx" />
```

#### Points to note:

This will not redirect to your 404 page as that results in a 302 response being returned to the browser (a known issue with Sitecore) which is incorrect. Instead it will simply render the 404 content on the requested URL. You then need set the response code to be 404 on that layout using the following code

```
HttpContext.Current.Response.StatusCode = 404;
```

### 500 Page usage

The 500 page functionality can be configured by populating the **errorPagePath** attribute on the site node. This needs to be populated with the url to forward the user to when an unhandled error is encountered. It is recommended to use a static page as the target and not a Sitecore URL, as this will then still function if major issues (e.g. database connectivity) occur.

### Robots.txt usage

The robots.txt functionality can be configured by populating the **robotsTxtLocation** attribute on the site node. This needs to be populated with the location of a text document containing the contents you wish to display when robots.txt is called for that site. If this is not specified then the standard robots.txt will be returned, if it exists.

## Credits

This module was built upon the excellent work in two blog posts by: [Anders Laub][1] & [Brian Pederson][2]

[1]: http://laubplusco.net/handling-404-sitecore-avoid-302-redirects/ "Handling 404 in a Sitecore multisite solution and avoid 302 redirects."
[2]: http://briancaos.wordpress.com/2013/03/21/sitecore-404-without-302/ "Sitecore 404 without 302"

