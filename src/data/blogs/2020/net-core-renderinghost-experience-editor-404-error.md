---
title: '.NET Core Rendering Host - Experience Editor 404 error'
slug: 'net-core-renderinghost-experience-editor-404-error'
dateCreated: '2020-09-23'
lastUpdated: '2020-09-23'
abstract: "So we've been rebuilding the Sitecore MVP site currently, and you can see how were going as the repository is Open Source, meaning you can see how we're progressing right here..."
publishDate: '2020-09-23'
disqusId: '22fb4661-2790-429e-90ed-6a74564c53b4'
tags: ['Sitecore','.NET Core','Rendering Host','Experience Editor']
---
So we've been rebuilding the Sitecore MVP site currently, and you can see how were going as the repository is Open Source, meaning you can see how we're progressing right <a href="https://github.com/Sitecore/MVP-Site" target="_blank" rel="noopener">here</a>.

One of the issues we ran into during this build stopped our site from loading in the Sitecore Experience Editor, we kept getting the following 404 error:

```
Error Rendering Sitecore.JavaScriptServices.ViewEngine.Presentation.JsLayoutRenderer: The remote server returned an error: (404) Not Found.
   at System.Net.WebClient.UploadDataInternal(Uri address, String method, Byte[] data, WebRequest& request)
   at System.Net.WebClient.UploadString(Uri address, String method, String data)
   at Sitecore.JavaScriptServices.ViewEngine.Http.RenderEngine.Invoke[T](String moduleName, String functionName, Object[] functionArgs)
   at Sitecore.JavaScriptServices.ViewEngine.Presentation.JssRenderer.PerformRender(TextWriter writer, IRenderEngine renderEngine, String moduleName, String functionName, Object[] functionArgs)
   at Sitecore.JavaScriptServices.ViewEngine.Presentation.JssRenderer.Render(TextWriter writer)
   at Sitecore.Mvc.Pipelines.Response.RenderRendering.ExecuteRenderer.Render(Renderer renderer, TextWriter writer, RenderRenderingArgs args)
```

After a bit of digging, it turns out we were missing a couple of environment variables in our Docker-Compose yaml. We only had the following values defined for our Rendering Host container:

```
    environment:
      ASPNETCORE_ENVIRONMENT: "Development"
      ASPNETCORE_URLS: "http://*:80"
      Sitecore__InstanceUri: "http://cd"
```

The two we were missing were the `Sitecore__RenderingHostUri` and `Sitecore__EnableExperienceEditor` values. Once we added those back in, our Experience Editor integration started working fine again. The final rendering container definition we ended up with was:

```
    environment:
      ASPNETCORE_ENVIRONMENT: "Development"
      ASPNETCORE_URLS: "http://*:80"
      Sitecore__InstanceUri: "http://cd"
      Sitecore__RenderingHostUri: "https://${RENDERING_HOST}"
      Sitecore__EnableExperienceEditor: "true"
```

You can see our full Docker-Compose yaml file <a href="https://github.com/Sitecore/MVP-Site" target="_blank" rel="noopener">here</a>.
