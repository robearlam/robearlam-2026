---
title: 'Configuring forwarding headers for ASP.NET Core Applications running behind a reverse proxy'
slug: 'configuring-forwarding-headers-for-asp.net-core-applications-running-behind-a-reverse-proxy'
dateCreated: '2021-12-08'
lastUpdated: '2021-12-08'
abstract: "We’ve been working recently on an updated version of the Sitecore MVP Website. This site has been used for the MVP application process which has just been run, and we used an external federated authentication provider to allow people to create their accounts for the application process."
publishDate: '2021-12-08'
disqusId: 'b51bf04c-9988-4c87-9903-800599f1a347'
tags: ['ASP.NET Core','HTTP Headers', 'Docker', 'AKS', 'Traefik', 'NGINX', '.NET']
---

We’ve been working recently on an updated version of the <a href="https://mvp.sitecore.com/" target="_blank" rel="noopener">Sitecore MVP Website</a>. This site has been used for the MVP application process which has just been run, and we used an external federated authentication provider to allow people to create their accounts for the application process. The provider we ended up using for this was <a href="https://www.okta.com/" target="_blank" rel="noopener">Okta</a>.

The site was built out by beginning with the Sitecore Getting Started Template, designed to quickly get development teams up and running using Docker locally, with a headless rendering engine built using ASP.NET Core. You can read our documentation site to get more details about the <a href="https://doc.sitecore.com/xp/en/developers/101/developer-tools/walkthrough--using-the-getting-started-template.html" target="_blank" rel="noopener">Getting Started Template</a>.

When integrating with a federated authentication provider like Okta, the authentication process works on a callback model. So, when a user clicks the “Login” button, they’re taken over to Okta who handle the validation of their credentials. When the user has been successfully validated a “callback” is made to a route on your application that is used to register that the user has successfully been authenticated with the external provider.

We ran into an interesting issue when implementing this process though, we found that the process was working perfectly in development, but when we went into staging & production we noticed that redirect was returning the response via `HTTP` instead of via `HTTPS` like we wanted, causing the authentication flow to break.

After much debugging we discovered that this was due to the `X-Forwarded-Proto` header not being sent on the request to Okta, meaning that Okta defaulted to `HTTP` for its return URL. Reading this article from Microsoft about how to <a href="https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/proxy-load-balancer?view=aspnetcore-3.1" target="_blank" rel="noopener">Configure ASP.NET Core to work with proxy server and load balancers</a>. There is a section in there that discusses forwarding headers when working behind reverse proxies, this matched our configuration so it felt like I was on the right track.

As the application was running in `K8s`, the applications were all running through the `NGINX` ingress. This ingress was running as a reverse proxy that was terminating `HTTPS`, ensuring that all traffic within the cluster was running over `HTTP` as is best practise. This would make sense as then the application is running over `HTTP`, so that’s why Okta was sending the response back via `HTTP`. Hold on though… this all worked locally, and the local setup was running behind the <a href="https://traefik.io/traefik/" target="_blank" rel="noopener">Traefik</a> reverse proxy? I knew I was close to the source of the problem, but just wasn’t quite there.

After looking through the MVP Rendering Host application it quickly became obvious what the issue was, Microsoft recommended including the following code in your `startup.cs` to allow all networks to forward headers when running behind a reverse proxy as only loopback proxies are allowed by default.

```
options.KnownNetworks.Clear();
options.KnownProxies.Clear();
```

Looking at our implementation of this we had it included as so:

```
if (env.IsDevelopment())
{
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
}
```

This was because it was implemented in this way in the Getting Started Template, as while that runs behind a reverse proxy in development, you may not actually be doing so in production. This means that as we’re running a `release` build for our Staging and Production sites the code never ran and so the headers were not being forwarded.
The fix was easy in the end, we just had to remove the If statement to ensure that the code ran in all environments and then everything clicked into place, the Authentication flow was now running everywhere!

