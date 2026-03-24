---
title: 'Migrating the Sitecore MVP site to XM Cloud – Part 4'
slug: 'migrating-the-sitecore-mvp-site-to-xm-cloud-part-4'
dateCreated: '2022-11-30'
lastUpdated: '2022-11-30'
abstract: "In my last post, I talked about Custom Content Resolvers and how that functionality isn’t available with XM Cloud – but how you probably don’t need them for a large portion of the scenarios being created as you can get a long way with the OOTB Content Resolvers provided by the platform. What happens when you do need some complex functionality that they can’t provide though? Well, that’s what we’re going to be talking about here"
publishDate: '2022-11-30'
disqusId: '79586e2e-ebf2-4e0a-8ddc-7c88f925a741'
tags: ['Sitecore MVP','XM Cloud', '.NET', 'Experience Edge']
---

## Migrating the Sitecore MVP site to XM Cloud
This is the last post in a four part blog series about migrating the Sitecore MVP Site from Sitecore XM 10.2 to Sitecore XM Cloud, you can view the other posts in the series here:
- <a href="/blog/migrating-the-sitecore-mvp-site-to-xm-cloud-part-1">Part 1 – Migrating the Sitecore MVP site to XM Cloud</a>
- <a href="/blog/migrating-the-sitecore-mvp-site-to-xm-cloud-part-2">Part 2 – Custom Content Resolvers</a>
- <a href="/blog/migrating-the-sitecore-mvp-site-to-xm-cloud-part-3">Part 3 – The MVP Directory</a>
- <a href="/blog/migrating-the-sitecore-mvp-site-to-xm-cloud-part-4">Part 4 – Secure Pages</a>

## Secure Pages
The final feature I want to talk about for the MVP Migration is the MVP Application process. This is opened at the end of each year and allows applicants to log into the site and register all their contributions to the Sitecore community over the past year. These are then used to evaluate who will be awarded MVP status for the next year.

This application process is handled by the MVP site, users log in using Okta and then have access to the application page, anyone can create an Okta account and apply. Now this means we needed to have the ability to secure the page behind this Okta authentication. When someone attempted to access the application when they’re not authenticated then they get redirected to the login page.

The old instance of the site was built using Sitecore XM, which has really rich, role-based security provided out of the box. However, XM Cloud while being based off XM doesn’t have any CD servers, so there isn’t anywhere for this security processing to happen. The Security field that is used in the CMS to store this data isn’t sent to Edge when a publish happens. So, does this mean you can’t create secure account sections in your headless sites powered by XM Cloud? It is still possible, but just like in my previous post in this series, we’re going to have to handle this ourselves by pushing this logic down to the head again!

## Okta Authentication
Now, this site was a migration as I’ve mentioned throughout this blog series, so it means the Okta integration in the head was implemented in the previous version and didn’t require any updates to make it work in the new version. If you’re looking for information about how to integrate an authentication provider like Okta, then you can see an example in their <a href="https://developer.okta.com/code/dotnet/aspnetcore/" target="_blank" rel="nofollow">guide</a>.

So we had the ability to authenticate a user, and the ability to detect whether a user was authenticated or not. What we’re missing was the ability to selectively control access to pages based on that authentication status.

## Template changes
As I mentioned above the standard security model that is powered by the `__Security` field in XM doesn’t get published to Edge – so we need to handle this ourselves. Now our use case is super simple, a page is either only available to authenticated users, or it’s available for everyone. We didn’t have a need for complex role-based security, so the template changes needed were super simple. All we had to do was to add a simple checkbox to our page template used to designate whether a user had to be authenticated or not to access it.

![MVP Site Directory][1]

After adding this field, if we look at the JSON response from Edge that is output for a secure page then you will see there is a `RequiresAuthentication` property on the `route` object which has a `value` set to `true`. 

```
{
"RequiresAuthentication": {
"value": true
},
```

If a page doesn’t have the checkbox selected in the CMS, then the field isn’t output in the Edge response at all.

## Changes in the head
Now we have Edge correctly returning data indicating whether a page is secure or not. We now have to update our head to read this value and act accordingly. This involved making two edits for us, the first was updating the main navigation menu to selectively show the correct items based on a user’s authentication status. The second item was handling when an unauthenticated user accesses a secure URL directly, make sure we kick them straight off to the login page.

### Menu updates
Updating the menu to selectively show items based on a users authentication status ended up being super easy. We just had to add the logic into the view to detect whether a page is set to be secure, and whether a user is authenticated or not. You can see the full code for the view in the <a href="https://github.com/Sitecore/XM-Cloud-Introduction/blob/main/src/Feature/Navigation/rendering/Views/Shared/Components/SitecoreComponent/MainNav.cshtml" target="_blank" rel="nofollow">GitHub Repository</a>.

The logic ended up looking like this:
```
<ul class="navbar-nav">
    @foreach (var link in Model.Items)
    {
        if (link.Fields.IncludeInMenu.Value && 
            (!link.Fields.RequiresAuthentication.Value || (link.Fields.RequiresAuthentication.Value && User.Identity.IsAuthenticated)))
        {
            <li class="nav-item mx-2">
                    <a class="nav-link" href="@link.Url" asp-for="@link">@link.Fields.MenuTitle.Value</a>
            </li>
        }
    }
</ul>
```
### Redirecting unauthenticated users
The process of redirecting unauthenticated users to the login page when accessing a secure page, was little more involved. It was <a href="https://twitter.com/ivanlieckens" target="_blank" rel="nofollow">Ivan Lieckens</a> who figured this out in the end, and it involved changes to the `DefaultController` in use by the ASP.NET Core Rendering SDK. 

It involved adding an extra catch, where the LayoutResponse doesn’t contain any errors, to also check whether a user has the permission to view the page and if not to trigger the .NET `Challenge` functionality to redirect the user to the login page. You can see the full code for this functionality in the <a href="https://github.com/Sitecore/XM-Cloud-Introduction/blob/main/src/Project/MvpSite/rendering/Controllers/DefaultController.cs" target="_blank" rel="nofollow">GitHub Repository</a>.  

```
[UseSitecoreRendering]
public IActionResult Index(LayoutViewModel model)
{
    IActionResult result = null;
    ISitecoreRenderingContext request = HttpContext.GetSitecoreRenderingContext();
    if (request.Response?.HasErrors ?? false)
    {
        foreach (SitecoreLayoutServiceClientException error in request.Response.Errors)
        {
            switch (error)
            {
                case ItemNotFoundSitecoreLayoutServiceClientException notFound:
                    _logger.LogInformation(notFound, notFound.Message);
                    result = Render404();
                    break;
                default:
                    throw error;
            }
        }
    }
    else if (!(HttpContext.User.Identity?.IsAuthenticated ?? false) && IsSecurePage(request))
    {
        AuthenticationProperties properties = new()
        {
            RedirectUri = HttpContext.Request.GetEncodedUrl()
        };

        result = Challenge(properties, OktaDefaults.MvcAuthenticationScheme);
    }
    else
    {
        result = View(model);
    }

    return result;
}
```
Once we had these two features together, that gave us the secure pages functionality we needed. Users could only see the main navigation items they had access to, and if they tried to access a secure page directly they would be redirected to the login page. 

SUCCESSS 🎉

## Conclusion
So, this brings us to the end of my blog series covering some of the larger pieces of work involved in migrating the Sitecore MVP site over to XM Cloud. All in all, the migration was fairly straightforward – though this was made A LOT simpler by the fact that the site was already built headlessly and leveraging the latest Sitecore technologies like Sitecore Content Serialisation.

If you’re looking to migrate an existing XM/XP site over to XM Cloud then hopefully this will help you to define some of the tasks that you’re going to have to think about from a functionality perspective. 

If you have any questions about this series, then please reach out in the comments below or on the various links on my <a href="https://robearlam.com/about" target="_blank" rel="nofollow">About Page</a>.

[1]: /img/blog-images/2022/SecurePage.png