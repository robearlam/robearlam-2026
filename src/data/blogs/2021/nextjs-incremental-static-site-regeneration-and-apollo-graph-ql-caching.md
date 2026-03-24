---
title: 'Next.js Incremental Static Site Regeneration and Apollo GraphQL Caching'
slug: 'nextjs-incremental-static-site-regeneration-and-apollo-graph-ql-caching'
dateCreated: '2021-03-12'
lastUpdated: '2021-03-12'
abstract: "I’ve recently been working on a project built using Next.Js & Apollo GraphQL to pull data out of Sitecore Experience Edge for Content Hub. I’ve really enjoyed working with these technologies but ran into something that stumped me for a while the other day."
publishDate: '2021-03-12'
disqusId: '85aeabda-7ef7-43e3-8c77-11301029c0a4'
tags: ['Nextjs','Apollo GraphQL','ISR', 'Sitecore Experience Edge', 'Content Hub']
---
I’ve recently been working on a project built using <a href="https://nextjs.org/" target="_blank" rel="noopener">Next.js</a> & <a href="https://www.apollographql.com/" target="_blank" rel="noopener">Apollo GraphQL</a> to pull data out of <a href="https://www.sitecore.com/blog/content/were-thrilled-to-announce-groundbreaking-sitecore-experience-edge" target="_blank" rel="noopener">Sitecore Experience Edge for Content Hub</a>. I’ve really enjoyed working with these technologies but ran into something that stumped me for a while the other day.

I was testing the Incremental Static Regeneration (ISR) functionality in Next.Js, this allows for a partial regeneration of the static pages when some of the content changes. This is really helpful when pulling data from an external system like Sitecore Experience Edge for Content Hub. In this scenario if one piece of content changes you don’t want to republish all of your static pages as that could be really heavy, you just want to refresh the ones that have changed. This is where ISR comes in as it allows you to do just that, you can read more about how to configure it <a href="https://blog.logrocket.com/incremental-static-regeneration-with-next-js/" target="_blank" rel="noopener">here.</a>

The issue I ran into was that my content wasn’t refreshing on my page when I had changed it in Content Hub and the revalidate period had expired. If I stopped and started the project on my development machine, I would see the change, but the static page would never be regenerated through ISR.

![Homer Thinking][1]

After a lot of head scratching I figured out that this was due to the `InMemoryCache` configured by default when working with Apollo GraphQL. You can read more about how that is configured <a href="https://www.apollographql.com/docs/react/caching/cache-configuration/" target="_blank" rel="noopener">here</a>. By default Apollo will cache any GQL queries, so if it receives the same query again it will just return the same result as previously. Now this might be a good idea in a lot of cases, when it comes to ISR this means that our static pages will never be regenerated!

![Picard facepalm][2]

So how do we fix this? Well it turns out that when you create your `ApolloClient` you can specify a set of `DefaultOptions` and these include the caching policies for different GQL requests. It was a simple matter of turning caching off for queries by using the following code…..

```
export const client = new ApolloClient({
    link: from([
        authMiddleware,
        httpLink
    ]),
    cache: new InMemoryCache(),
    defaultOptions: {
        query: {
            fetchPolicy: 'no-cache',
        },
    }
});
```
Here you can see that the `fetchPolicy` for all `query` requests is now set to `no-cache`. After enabling this my ISR started working just as it should! Victory!

![Rocky Victory][3]

[1]: /img/blog-images/2021/homerthinking.jpg
[2]: /img/blog-images/2021/picard-meme-facepalm.jpg
[3]: /img/blog-images/2021/Rocky.jpg