---
title: 'Migrating the Sitecore MVP site to XM Cloud – Part 3'
slug: 'migrating-the-sitecore-mvp-site-to-xm-cloud-part-3'
dateCreated: '2022-11-28'
lastUpdated: '2022-11-28'
abstract: "In my last post, I talked about Custom Content Resolvers and how that functionality isn’t available with XM Cloud – but how you probably don’t need them for a large portion of the scenarios being created as you can get a long way with the OOTB Content Resolvers provided by the platform. What happens when you do need some complex functionality that they can’t provide though? Well, that’s what we’re going to be talking about here"
publishDate: '2022-11-28'
disqusId: 'e0a3694e-04fd-4c64-ac07-cacb524b6b14'
tags: ['Sitecore MVP','XM Cloud', '.NET', 'Experience Edge']
---

## Migrating the Sitecore MVP site to XM Cloud
This is the third post in a four part blog series about migrating the Sitecore MVP Site from Sitecore XM 10.2 to Sitecore XM Cloud, you can view the other posts in the series here:
- <a href="/blog/migrating-the-sitecore-mvp-site-to-xm-cloud-part-1">Part 1 – Migrating the Sitecore MVP site to XM Cloud</a>
- <a href="/blog/migrating-the-sitecore-mvp-site-to-xm-cloud-part-2">Part 2 – Custom Content Resolvers</a>
- <a href="/blog/migrating-the-sitecore-mvp-site-to-xm-cloud-part-3">Part 3 – The MVP Directory</a>
- <a href="/blog/migrating-the-sitecore-mvp-site-to-xm-cloud-part-4">Part 4 – Secure Pages</a>

## MVP Listing
In my last post, I talked about Custom Content Resolvers and how that functionality isn’t available with XM Cloud – but how you probably don’t need them for a large portion of the scenarios being created as you can get a long way with the OOTB Content Resolvers provided by the platform. What happens when you do need some complex functionality that they can’t provide though? Well, that’s what we’re going to be talking about here…

If you take a look at the Sitecore MVP site that we were migrating, you can see we have an <a href="https://mvp.sitecore.com/Directory" target="_blank" rel="nofollow">Mvp Directory</a> of all of the different people to have been awarded MVP status over the years.

On the old version of the site, this was provided by a `ViewComponent` which then made an asynchronous GraphQL request to the CD servers, which then queried the web Solr index to get the data. Now a lot of this doesn’t exist in XM Cloud, there are no CD servers and there is no Web index anymore – so we had to think about how we were going to rebuild this functionality.

## Pushing logic to the head!
With XM Cloud leveraging Experience Edge for delivery, there is no way to deploy delivery logic like you could with XM. So, you’ll find that this logic you used to host in your CD is either unpicked to use OOTB functionality like in my previous post or like we ended up doing here…. you push that logic down the head.

If you look at the screenshot below, you can see the functionality we were attempting to migrate:
 
![MVP Site Directory][1]

You can see we have a listing of the MVP’s, and we have the ability to refine those results using either the faceting control on the left, or with the text search box above. All of those refinement controls all work asynchronously, as we don’t want to do a full page refresh everytime someone chooses to change the list contents.

Now with XM this was very simple to do as we could handle this using the Solr Web index which has things like faceting built in, but there is no index included with Edge. There is a simple search entry point provided which you can read about on our <a href="https://doc.sitecore.com/xp/en/developers/hd/201/sitecore-headless-development/the-experience-edge-schema.html" target="_blank" rel="nofollow">documentation site</a>.

This had two main limitations that were going to affect how we used this. The first is that there is no faceting functionality, and the second was that the pagination was forwards only – meaning you can implement an “infinite scroll” feature easily, but it’s not simple to implement a numbered pagination control which we required.

The search end point currently is a simple tool used to locate items, it’s not really designed to build out an interactive search listing which we needed. So to achieve this, we pushed the logic down the head.

We were lucky, in that the total dataset size of all MVPs is < 1000 items, so we could request that full amount in a single GraphQL query from our head. The head then caches this full dataset in memory and can dynamically build out the listing, pagination, facets, and keyword search without ever having to go back to Edge. We also cache this set of data for 10mins to help improve performance. You can see the logic for this in the `MvpFinder` class in the <a href="https://github.com/Sitecore/XM-Cloud-Introduction/blob/main/src/Feature/People/rendering/PeopleFinder/MvpFinder.cs" target="_blank" rel="nofollow">repository</a>.

## Search providers  
Now as I said, we’re lucky in that we’re dealing with a very small set of items, which only increase by a small amount each year when the new MVP awards are announced. That obviously will not always be the case, you could be trying to build out a similar faceted style search over a much larger dataset. Or maybe you're trying to implement a full-text search across all of the content on your site. Now in both of those scenarios the approach above wouldn’t be recommended. 

Luckily there are a whole host of products on the market to cater to these scenarios, and they play nicely in the Composable Stack, just like XM Cloud. 

You could use <a href="https://www.sitecore.com/products/search" target="_blank" rel="nofollow">Sitecore Search</a>, <a href="https://www.coveo.com/en" target="_blank" rel="nofollow">Coveo</a>, or <a href="https://www.algolia.com/" target="_blank" rel="nofollow">Algolia</a> to name a few. All these products are designed to integrate seamlessly with your site regardless of which CMS is powering the content on the backend. We didn’t go down this route as the use case for the MVP site was very small and focussed, but you can see where Sitecore Search has been implemented on <a href="https://www.sitecore.com/" target="_blank" rel="nofollow">Sitecore.com</a> for example as their requirements were much broader and better suited to a dedicated Search Platform.

This was the third post in this series about us migrating the Sitecore MVP site to XM Cloud, coming up in the final post I’ll be talking about secure pages…

[1]: /img/blog-images/2022/mvplisting.png