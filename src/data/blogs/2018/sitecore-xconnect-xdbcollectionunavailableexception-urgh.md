---
title: 'Sitecore XConnect Xdb Collection Unavailable Exception, urgh!'
slug: 'sitecore-xconnect-xdbcollectionunavailableexception-urgh'
dateCreated: '2020-08-31'
lastUpdated: '2020-09-03'
abstract: "So I had a bit of a head scratcher today trying to setup a clean instance of XC9, something I've done many times since it was released back in January. Everything went fine during the installation, but"
publishDate: '2018-04-20'
disqusId: 'EE52D892-6180-4411-A8F9-A16B1A277FD2'
tags: ['Sitecore','Certificates','Exception']
---
So I had a bit of a head scratcher today trying to setup a clean instance of XC9, something I've done many times since it was released back in January. Everything went fine during the installation, but then I noticed that i was getting the following error throughout xAnalytics
```
Exception: Sitecore.XConnect.XdbCollectionUnavailableException
Message: The HTTP response was not successful: Forbidden
Source: Sitecore.Xdb.Common.Web
at Sitecore.Xdb.Common.Web.Synchronous.SynchronousExtensions.SuspendContextLock[TResult](Func`1 taskFactory)
at Sitecore.XConnect.Client.XConnectSynchronousExtensions.SuspendContextLock(Func`1 taskFactory)
at Sitecore.XConnect.Client.Configuration.SitecoreXConnectClientConfiguration.Initialize(XmlNode configNode)
at Sitecore.Configuration.DefaultFactory.CreateObject(XmlNode configNode, String[] parameters, Boolean assert, IFactoryHelper helper)
at Sitecore.Configuration.DefaultFactory.CreateObject(XmlNode configNode, String[] parameters, Boolean assert)
at Sitecore.Configuration.DefaultFactory.CreateObject(String configPath, String[] parameters, Boolean assert)
at Sitecore.XConnect.Client.Configuration.SitecoreXConnectClientConfiguration.GetClient(String clientConfigPath)
at Sitecore.PathAnalyzer.Processing.Agents.TreeAggregatorAgent.Execute()
at Sitecore.Analytics.Core.BackgroundService.Run()
```
I had been lucky enough to avoid the certificate issues that some people had setting up XP & XC, but it seemed like my luck had run out :(

Now I knew I had analytics working previously, and I also knew that I'd had issues getting a trusted cert for my sxa.storefront.com domain after the last time I cleaned my instance and had tried a few different things with the certs. So all of this made me pretty sure I couldn't even blame anyone but myself for this mess, awesome!

However, the answer didn't take too long to figure out, a bit of googling took me to this <a href="https://sitecore.stackexchange.com/questions/8561/xconnect-the-http-response-was-not-successful-unauthorized" target="_blank" rel="noopener">Stack Overflow post</a>. There were a few suggestions in the post, but some related to fixes required for Initial Release and those didn't apply to as I was running Update-1.

There was another answer which had a long list of suggestions one of which jumped out at me _"Remove unused SC certificates from your 'current user' certificate stores. Maybe for some reason, you have it there"_. When I was playing around with my certificates trying to setup a trusted IIS cert, I did remember accidentally installing some certs in my **Current User** store instead of the **Local Computer** store. 
    
I went and loaded up my **Current User** store and surely enough there was a pair of xc901.sc & xc901.xconnect certs, but crucially they were an old set from a previous install which meant their thumbprint didn't match my current install.
    
So it looks like any certs you have in your **Current User** store will override any certs you have in your **Local Computer**, I deleted the old certs, bounced IIS and then everything came back to life!
    
All in all it didn't take my too long to get over the issue thanks to the SO post above, hopefully this will help anyone else should they run into the same issue as well!

