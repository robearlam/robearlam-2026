---
title: 'Migrating the Sitecore MVP site to XM Cloud – Part 2'
slug: 'migrating-the-sitecore-mvp-site-to-xm-cloud-part-2'
dateCreated: '2022-11-25'
lastUpdated: '2022-11-25'
abstract: "One of the key differences between working headlessly in Sitecore XM 10.2 and Sitecore XM Cloud is the introduction of Experience Edge. When working against Edge, there is no Web Database and there are no Content Delivery (CD) servers. Instead, when you publish a snapshot of your layout data is stored in our Content Delivery Network (CDN), this enables super-fast, low-latency, globally scaled delivery of your content to your head. However, it does change how you must think about your development processes"
publishDate: '2022-11-25'
disqusId: '655c74fd-5221-429b-a298-8a7761956394'
tags: ['Sitecore MVP','XM Cloud', '.NET', 'Experience Edge']
---

## Migrating the Sitecore MVP site to XM Cloud
This is the second post in a four part blog series about migrating the Sitecore MVP Site from Sitecore XM 10.2 to Sitecore XM Cloud, you can view the other posts in the series here:
- <a href="/blog/migrating-the-sitecore-mvp-site-to-xm-cloud-part-1">Part 1 – Migrating the Sitecore MVP site to XM Cloud</a>
- <a href="/blog/migrating-the-sitecore-mvp-site-to-xm-cloud-part-2">Part 2 – Custom Content Resolvers</a>
- <a href="/blog/migrating-the-sitecore-mvp-site-to-xm-cloud-part-3">Part 3 – The MVP Directory</a>
- <a href="/blog/migrating-the-sitecore-mvp-site-to-xm-cloud-part-4">Part 4 – Secure Pages</a>

## Update - 30/11/2022
After a Twitter conversation with <a href="https://twitter.com/MiguelMinoldo" target="_blank" rel="nofollow">Miguel Minoldo</a>, it turns out that you can use Custom Content Resolvers in Sitecore XM Cloud. They are used to generate a snapshot of the generated layout data at publish time. I would still recommend following the process below to unpick any custom ones you have where possible, but it is good to know that you can use them if you need to.

## Custom Content Resolvers
One of the key differences between working headlessly in Sitecore XM 10.2 and Sitecore XM Cloud is the introduction of Experience Edge. When working against Edge, there is no Web Database and there are no Content Delivery (CD) servers. Instead, when you publish a snapshot of your layout data is stored in our Content Delivery Network (CDN), this enables super-fast, low-latency, globally scaled delivery of your content to your head. However, it does change how you must think about your development processes.

When working with XM headless development, a common process would be to customise the Layout Service to match your requirements using Custom Content Resolvers, these would then be deployed to your CD servers and your custom code would be executed on each request. You might be wondering how you can achieve this same effect when working against Edge now there are no CD servers in this architecture. Well, the quick answer is you can’t follow the same process, so you need to change how you think about these customisations.

## Do you really need a Custom Content Resolver?
Now in the original version of the Sitecore MVP site, we had a whole heap of Custom Content Resolvers. If you take our Navigation feature for example, we had three different renderings for the Footer, TopLinks and MainNav components. You can see <a href="https://github.com/Sitecore/MVP-Site/tree/main/src/Feature/Navigation/platform/LayoutService" target="_blank" rel="nofollow">here</a> that all three of them were created using Custom Content Resolvers: . 

So, we started to look at the Content Resolvers that are provided out of the box and realised that with a bit of tweaking of our rendering model, we could get the same functionality with those.
With XM Cloud you get the following Content Resolves provided out of the box, and these will cover a large number of scenarios you’ll end up running into:

- `Context Item Children Resolver`
- `Context Item Resolver`
- `Datasource Item Children Resolver`
- `Datasource Resolver`
- `Folder Filter Resolver`

A good example of this is our `Footer`, we have the copyright text and the social links that are all content managed:

![MVP Site footer navigation bar][1]
 
Now in the old site, we had custom code to get a list of items for the social links, and another item had a text field containing the copyright text. To change this to work with an OOTB Content Resolver we simply moved these items to a single datasource item. This enabled us to then make use of the `Datasource Resolver` instead. So, you’ll need to perform this same sort of refactoring if you have any Custom Content Resolvers in use.

This also gives benefits looking forwards though, as we’re removing customisations from our implementation. That means we have a smaller footprint of functionality that exists in our codebase, meaning that we have less code to test should we end up upgrading or doing any large-scale refactors of the MVP head, this is a big win!

## What about complex functionality?
This approach of pivoting to using OOTB Content Resolvers will work for a lot of common content scenarios, but what happens if you have renderings that are more complex, that can’t be handled by the OOTB resolvers? Well in this case you’re going to need to push this functionality down into you head instead. We had a scenario just like this where we wanted to render out the MVP Directory and I’ll go into more detail on what we had to do to migrate this functionality in part 3….

[1]: /img/blog-images/2022/footer.png