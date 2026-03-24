---
title: 'Exclude specific routes from HTTPS redirect in .NET'
slug: 'exclude-specific-routes-from-https-redirect-in-dotnet'
dateCreated: '2021-12-13'
lastUpdated: '2021-12-13'
abstract: "I’ve recently been working on a web project built using ASP.NET Core. One of the features we implemented was to automatically redirect all traffic coming in on HTTP over to HTTPS as it’s far more preferable for a heap of reasons."
publishDate: '2021-12-13'
disqusId: '61539dec-bb44-44d9-89d0-ee5310f471eb'
tags: ['.NET', 'ASP.NET Core', 'HTTPS', 'K8s']
---

I’ve recently been working on a web project built using ASP.NET Core. One of the features we implemented was to automatically redirect all traffic coming in on HTTP over to HTTPS as it’s far more preferable for a heap of reasons. You can read a good write up of some of those <a href="https://https.cio.gov/everything/" target="_blank" rel="noopener">here</a>. This turned out to be super simple to implement with .NET, as there was a built-in piece of middleware designed to handle this exact scenario. It’s a simple as adding the following piece of code into your `strartup.cs`

```
app.UseHttpsRedirection();
```

So, this all worked really well until we needed to have one of our routes respond over HTTP. Hold on, you might be wondering why we would want to just have a single route not trigger the redirect?

![Why][1]

Well, this was due to how we were hosting the site in production. We were running inside of a Kubernetes (k8s) cluster and its standard practice when doing this to terminate HTTPS at the ingress, so all traffic moving inside the cluster is over HTTP. We quickly noticed that this was an issue as when we deployed the code update that included the redirect, the containers were always returning a status of `unhealthy`.

![Visible Confusion][2]

After much head scratching, I figured out the issue was due to our `/healthz` route. This is the route that is used the `liveness` probe by the K8s cluster. The cluster will call that route and if it gets a 200 response then it knows that the container is ‘healthy’ and it can start to send traffic to it. Now as I mentioned above traffic on the K8s cluster happens over HTTP, not HTTPS. So, when the cluster called the liveness probe, the middleware was redirecting the request to the HTTPS endpoint, however the container isn’t configured to listed on HTTPS only HTTP…… so the container was never giving a 200 response on the `/healthz` route, meaning that the k8s cluster never got the healthy response it was waiting for.

The fix ended up being relatively simple, we just need to only load the ` UseHttpsRedirection` middleware for routes that weren’t the `healthz` route. To do this we utilised the `MapWhen` extension that ships with `.NET` to only load the middleware when a certain condition is met, in this case when the request wasn’t for the `/healthz` route. You can see the final line of code we used to load the middleware here:

```
app.UseWhen(context => !context.Request.Path.StartsWithSegments("/healthz"),
                           builder => builder.UseHttpsRedirection());
```

After that everything worked well, our app was forcing traffic over to HTTPS when required, but also allowed for HTTP requests to be made by the liveness probe!

![Success][3]

[1]: /img/blog-images/2021/why.jpg
[2]: /img/blog-images/2021/visible-confusion.webp
[3]: /img/blog-images/2021/Rocky.jpg