---
title: 'So what is the Sitecore Commerce ServiceProxy'
slug: 'so-what-is-the-sitecore-commerce-serviceproxy'
dateCreated: '2020-08-31'
lastUpdated: '2020-09-03'
abstract: "So if you've been looking through the SDK provided with both Sitecore Experience Commerce 8.2.1 and new release Sitecore Experience Commerce 9"
publishDate: '2018-02-25'
disqusId: '105BA628-FFAC-4A31-A95A-6461A7F8589F'
tags: ['Sitecore','Commerce','ServiceProxy','XC9','OData','Connected Services']
---
So if you've been looking through the SDK provided with both Sitecore Experience Commerce 8.2.1 and the latest release Sitecore Experience Commerce 9, you should have noticed it included a project called *Sitecore.Commerce.ServiceProxy*, so what is it and when you do you need to use it?

## Why do you need the Sitecore.Commerce.ServiceProxy project?    
Well to demonstrate this I'm going to refer to a Product Compare module that I've been working on. Now the code for this module is split accross both the engine and the storefront. The engine has a new entity that contains a list of SellableItems and introduces a new controller to update the list, and also to return the SellableItems in the list.
    
Now the storefront code will call through to these controller endpoints as the users interact with the storefront creating, updating & viewing their compare collections. Great, this all sounds simple enough, I created the engine code and tested everything was fine using Postman, then began working on the storefront code.  Except you soon run into a problem, all of the entities and controllers are defined in the .NETCore project used in the Engine and as this is built against .NETCore we can't reference this in the storefront project.
    
So how do I reference those entities and the controller endpoints I created from my Storefront code?

This is where the *Sitecore.Commerce.ServiceProxy* project comes in!    
    
## So how does it work?
Well the Service Proxy acts a middleman between your engine code and your storefront code, allowing you to reference the types & controller endpoints defined in your engine, from your storefront code.
    
It does this through the use of <a href="https://marketplace.visualstudio.com/items?itemName=laylaliu.ODataConnectedService" taget="_blank" rel="noopener">OData Connected Services</a> & codegen. When you add the project to your solution you will see that there 2 connected services that it contains - *CommerceOps* & *CommerceShops*.

![Connected Services][1]
    
Each of these connects to the MetaData endpoint on the Engine and uses the data returned to generate copies of the entities & controllers, in a format that your storefront projects can reference.
    
So once you've generated the proxy you can then reference the project in your storefront projects and have full access to all of the engine entities
    
![Service Proxy Diagram][2]
    
So there you have it, you can now access all your engine entities in your storefront projects, but what's the process involved in extending the engine and making sure your customisations are included in the proxy?

## Updating the Service Proxy  

So you've built yourself a plugin, similar to my Product Compare plugin I mentioned above, and now you want to access it in the Storefront. What is the process you need to follow to set this up?

Well there are a couple of steps you need to follow, but overall it is a very simple process:

1. Build your version of the Engine from the SDK including your kick ass plugin.
2. Deploy the engine, or run from VS to ensure that its running on port 5000.
3. Add the Sitecore.Commerce.ServiceProxy project from the SDK to your solution
4. In VS2017 Expand the Connected Services folder within the ServiceProxy project
5. For each of the services (CommerceOps & CommerceShops) right click on them and select *Update OData Connected Service* - This will hit the Metadata data endpoint of the engine and rebuild the generated code files for each.
6. Reference the updated ServiceProxy project in your Storefront project and start to use your custom engine entities.

So that's it, you now have your custom plugin running in the engine, with its entities & controller endpoints exposed via the proxy to the storefront. How simple was that!
   
## Other Points
    
You can change the Connected Services to update their codegen files from a different url if you need, e.g. if you want to access the engine on a different port or even on a different machine all together. To do this, if you expand the Connected Service in VS you will see a JSON file in the folder with the same name, this contains the URL which you can change to match the location you need.
    
If you want further information about Connected Services, I wrote another post about the differences between using proxies in VS2015 & VS2017, which you can read <a href="/blog/working-with-odata-connected-services-in-visual-studio-2017">here</a>.

[1]: /img/blog-images/ConnectedServices.png
[2]: /img/blog-images/ServiceProxyDiagram.png

