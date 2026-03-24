---
title: 'How to implement the WebFinger Protocol on a NextJS site'
slug: 'webfinger-on-nextjs'
dateCreated: '2022-12-20'
lastUpdated: '2022-12-20'
abstract: "With all the craziness that’s been happening over at Twitter recently, I’ve been taking a look at Mastodon. It’s similar to Twitter, but at the same time very different as well. One of the things that Twiter does well, which Mastodon struggles with a bit, is user discoverability."
publishDate: '2022-12-20'
disqusId: 'fbafbf37-b309-4b1d-88f9-1d8ecc41a775'
tags: ['Nextjs','WebFinger', 'Mastodon']
---


<a href="" target="_blank" rel="nofollow"></a>

## How to implement the WebFinger Protocol on a NextJS site
With all the craziness that’s been happening over at Twitter recently, I’ve been taking a look at <a href="https://joinmastodon.org/" target="_blank" rel="nofollow">Mastodon</a>. It’s similar to Twitter, but at the same time very different as well. One of the things that Twiter does well, which Mastodon struggles with a bit, is user discoverability. 

The benefits that the Fediverse provides through distribution does make it a little more difficult to discover users to follow as you need to know the server they’re running on. Also, one of the benefits of the Fediverse is that you can migrate your account to a different server when you like, but then you would have to update any references you have to your user which sounds a bit painful.

Then I stumbled across this <a href="https://www.hanselman.com/blog/use-your-own-user-domain-for-mastodon-discoverability-with-the-webfinger-protocol-without-hosting-a-server" target="_blank" rel="nofollow">post from Scott Hanselman</a> where he talks about the WebFinger protocol, allowing you to use your domain to host, what is in effect, a pointer to your Mastodon account. This is great as it allows me to have a single entry point for my Mastodon presence that can remain static even if I move to a new server down the track.

Scott’s example showed how to implement this in .NET but my blog is written in NextJS and hosted in Vercel, so I wanted to document how I achieved the same effect. 

I’m only hosting my account here, so I just needed a static webfinger file to always return my account details, and it turned out to be pretty easy to achieve with an API route and a Redirect.

## API Route
I first tried to just add a webfinger file into my `public` directory, but the browser didn’t end up processing it correctly and it downloaded the file instead of displaying its content as it didn’t know what MIME type to apply to that file type. So, an API route ended up being the best approach for this.

The route’s content itself was very simple as I just need to return the same content regardless of the user who is requested, as I’m only hosting the redirect for my own account here:

```
export default function handler(req, res) {
    res.send(`{
    "subject":"acct:RobEarlam@mastodon.social",
    "aliases":
    [
        "https://mastodon.social/@RobEarlam",
        "https://mastodon.social/users/RobEarlam"
    ],
    "links":
    [
        {
            "rel":"http://webfinger.net/rel/profile-page",
            "type":"text/html",
            "href":"https://mastodon.social/@RobEarlam"
        },
        {
            "rel":"self",
            "type":"application/activity+json",
            "href":"https://mastodon.social/users/RobEarlam"
        },
        {
            "rel":"http://ostatus.org/schema/1.0/subscribe",
            "template":"https://mastodon.social/authorize_interaction?uri={uri}"
        }
    ]
}`); 
}

```

Now this worked, and it returned the correct content, however it was running at `/api/.well-known/webfinger`, which was incorrect. I need it to now run at the root of the site, and not from withing the `/api` folder.

## NextJS Rewrite
Luckily NextJS has <a href="https://nextjs.org/docs/api-reference/next.config.js/rewrites" target="_blank" rel="nofollow">Rewrite functionality</a> built in that allows you to change the output for a specific URL. This was super easy to configure and allowed me to get the functionality that I needed. I just had to add the following section to my `next.config.js`

```
async rewrites() {
    return [
        {
          source: '/.well-known/webfinger',
          destination: '/api/.well-known/webfinger'
        }
    ];
  }
```

## Discoverability FTW!
So, this now gave me the setup that I wanted, you can now head to <a href="https://robearlam.com/.well-known/webfinger" target="_blank" rel="nofollow">https://robearlam.com/.well-known/webfinger</a> and see the webfinger protocol in action. You can see in the content that it is currently redirecting to my account on the <a href="https://mastodon.social/" target="_blank" rel="nofollow">Mastodon.Social</a> server where my account its currently hosted. 

Now I can give people the name `@rob@robearlam.com` and it will resolve to my account. The great thing is also that if I move to a new Mastodon server in the future, then I will just have to update my webfinger file to my new location and it will still resolve correctly! 