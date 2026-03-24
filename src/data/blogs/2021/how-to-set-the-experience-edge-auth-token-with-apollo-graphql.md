---
title: 'How to set the Experience Edge Auth Token with Apollo GraphQL'
slug: 'how-to-set-the-experience-edge-auth-token-with-apollo-graphql'
dateCreated: '2021-03-03'
lastUpdated: '2021-03-03'
abstract: "So if you've been looking through the SDK provided with both Sitecore Experience Commerce 8.2.1 and new release Sitecore Experience Commerce 9"
publishDate: '2021-03-03'
disqusId: '70ae33e1-2526-4fde-9190-8cb688c46261'
tags: ['Sitecore','Experience Edge','Content Hub','Apollo GraphQL', 'Nextjs', 'TypeScript']
---
Sitecore recently announced the release of our new <a href="https://www.sitecore.com/blog/content/were-thrilled-to-announce-groundbreaking-sitecore-experience-edge" target="_blank" rel="noopener">Experience Edge</a> product, it's a GraphQL endpoint allowing you to serve your content globally at scale. It's an awesome piece of tech that allows you to build your head in whatever language you like and pull the content you need to power it via GraphQL. There are two flavours of the product `Sitecore Experience Edge for Content Hub` and `Sitecore Experience Edge for XM`, depending on which technology is underpinning it. In this post I’m going to be focussing on the `Sitecore Experience Edge for Content Hub` product.

It is provided with a GraphQL playground so you can start to interrogate that data and test out your queries. When you first come to try this though you may see an error stating `Server cannot be reached` and a response of 

```
{
  "error": "Unexpected end of JSON input"
}
```

In this case you most likely haven’t included your authentication data with your request!

## API Tokens
`Sitecore Experience Edge for Content Hub` is authenticated through the use of `API Tokens`. These are generated from with `Content Hub`, and you can see more information about how to create them on our <a href="https://docs.stylelabs.com/content/4.0.x/user-documentation/administration/data/openapi/authentication.html?redirect=true" target="_blank" rel="noopener">documentation site</a>.

Once you’ve generated your token, how do you use it with the playground? To do that you need to pass your API Token in the headers for your request. If you look at the bottom of the page you will see a `HTTP HEADERS` button that will give you pane used to add those to your request. You add them in the following format

```
{
"X-GQL-Token": "XXX_YOUR_TOKEN_HERE_XXX"
}
```

Once this has been added you will be able to query your data and see results returned. So, this is all well and good for querying data in the Playground, but what about when you come to integrate it with the client you’re building?

Well in this post I’m going to be working with a head written in JS, specifically a <a href="https://nextjs.org/" target="_blank" rel="noopener">NextJS</a> application. When working with NextJS you’re going to want to integrate a dedicated GraphQL library to give you a nice way of interacting with endpoints like Sitecore Experience Edge, in this case we’re going to be using <a href="https://www.apollographql.com/" target="_blank" rel="noopener">Apollo GraphQL</a>.

## Apollo GraphQL
This is a library that provides some simple methods to interact with GraphQL endpoints. We’re going to need to craft something a bit more complex than a standard request though to factor in our API Token, in the format specified above. How can we add this header to all of our different requests to the API? Well Apollo has a feature called `ApolloLink`, that will let us do this easily!

## ApolloLink
You can read more about `ApolloLink` on their <a href="https://www.apollographql.com/docs/link/" target="_blank" rel="noopener">documentation site</a>, but it basically allows us to specifically craft how the GraphQL request is built and how the response is handled. As we need to insert our token on all requests, this sounds like a pretty good fit!

First of all we’re going to build use `createHttpLink` to build the link that will be used by our Apollo Client
```
const httpLink = createHttpLink({
    uri: ‘https://YOUR_EXPERIENCE_EDGE_URL’,
});
```
Next we’re going to create our `ApolloLink` object and this where the magic happens. We’re going to extend the context of our operation so that headers collection will always contain the token we need to pass, in the format we need to pass it.
```
const authMiddleware = new ApolloLink((operation, forward) => {
    operation.setContext(({ headers = {} }) => ({
        headers: {
            ...headers,
            'X-GQL-Token': ‘XXX_YOUR_TOKEN_HERE_XXX’
        }
    }));
    return forward(operation);
});
```
Now we can use our `httpLink` & `ApolloLink` when we generate our `ApolloClient`
```
const client = new ApolloClient({
    link: from([
        authMiddleware,
        httpLink
    ]),
    cache: new InMemoryCache()
});
```
From there every request we make through that client will have our token attached, and we’ll be able to get the data we need from our Experience Edge!

## Putting it all together
So, lets take a look at an example page that pulls all of this together and shows a simple output on the page. This is a `TypeScript` page that will use all of the code snippets shown above to send an authenticated request through to the Edge endpoint and simply pull out the number of Content Types defined in that Content Hub instance.

```
import { GetStaticProps } from 'next'
import { ApolloClient, InMemoryCache, gql, createHttpLink, ApolloLink, from } from '@apollo/client'

const httpLink = createHttpLink({
    uri: ‘https://YOUR_EXPERIENCE_EDGE_URL’,
});

const authMiddleware = new ApolloLink((operation, forward) => {
    // add the authorization to the headers
    operation.setContext(({ headers = {} }) => ({
        headers: {
            ...headers,
            'X-GQL-Token': ‘XXX_YOUR_TOKEN_HERE_XXX’
        }
    }));

    return forward(operation);
});

const client = new ApolloClient({
    link: from([
        authMiddleware,
        httpLink
    ]),
    cache: new InMemoryCache()
});

export default function AuthenticationSample({ contentTypes }: { contentTypes: any }) {
    return (
        <div>
            <h1>Playground</h1>
            <p>A page to try things out without interfering with pages being built.</p>
            <p>There are {contentTypes.length} content types in the system.</p>
        </div>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const { data } = await client.query({
        query: gql`
        {
            allM_ContentType
            {
              results
              {
                contentType_Label,
                id
              }
            }
          }
        `
    });

    return {
        props: {
            contentTypes: data.allM_ContentType.results
        }
    }
}
```





## Further considerations
What you can see above is a pretty simplistic example of how to achieve this. There are a few things that you would most likely want to do differently in a real project. 

Firstly, you will most likely want to use GraphQL data on more than one page / component, so defining things like the `ApolloLink` and `client` directly on the page wouldn’t be the best way to achieve that. You would want to move that into some form of utility file and pull that in via an `import` instead. This means that if you need to change how this works in the future, say you need to add another header, you would only be making that change in a single location and having the update ripple through all of the GraphQL queries your client makes.

Secondly, and as someone with an interest in DevOps this is a big one for me, you REALLY don’t want to be hardcoding secrets like your `API Key` directly in your page. To be honest, you shouldn’t be including information like that in your repository at all, as they’re far more likely to be leaked that way. The best way to handle secrets like this is through the use of `environment variables`, and if you’re using a hosting platform like <a href="https://vercel.com/" target="_blank" rel="noopener">Vercel</a>, then they have a really nice way of setting this up so they’re not included in your repo, but really easy to reference in your code. Come to think of it, showing how to set that up sounds like a good idea for my next blog post!

