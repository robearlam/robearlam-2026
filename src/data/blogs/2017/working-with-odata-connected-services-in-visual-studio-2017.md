---
title: 'Working with OData Connected Services in Visual Studio 2017'
slug: 'working-with-odata-connected-services-in-visual-studio-2017'
dateCreated: '2020-08-31'
lastUpdated: '2020-09-03'
abstract: "I've recently been working with a .NET core 2 application, which makes use of OData Connected Services"
publishDate: '2017-11-24'
disqusId: '49d8e561-6fcc-4d37-a2db-1cea2477d1d6'
tags: ['VS2017','OData','Connected Services']
---
I've recently been working with a .NET Core 2 application, which makes use of OData Connected Services to generate a client proxy. Now when I received the application the proxy had already been generated, however I had updated the target OData service and so needed to update the contents of the proxy, a task which ended up taking a bit of Googling to figure out, so I'm writing this in case anyone else ends up in the same place, but also in case I do and I forgot what I did to solve it!

I had the option to create a new Connected Service, but nothing that referenced OData at all. Also when I clicked on the existing service there was no *update* option. Now in VS2015 you could install the <a href="https://marketplace.visualstudio.com/items?itemName=bingl.ODatav4ClientCodeGenerator" target="_blank" rel="noopener">OData v4 Client Code Generator</a> extension to allow this functionality, however that isn't supported in VS2017, hmmm where to go from here then?

Some more searching led me to the <a href="https://marketplace.visualstudio.com/items?itemName=laylaliu.ODataConnectedService" target="_blank" rel="noopener">OData Connected Service</a>, which it turns out was the answer to my problem. When I installed the extension, it showed as already installed and gave me the *modify* option through the installer, which was a bit strange, however once it was setup I could now interact with my client proxy as required.

A couple of quick updates later and I was back writing code, fun times!

