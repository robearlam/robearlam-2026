---
title: 'Using Styled Components with NextJs'
slug: 'using-styled-components-with-nextjs'
dateCreated: '2023-02-21'
lastUpdated: '2023-02-21'
abstract: "I've recently been working with a new JavaScript SDK for Sitecore Discover which is going to be released soon.  This is a React library which provides a series of prebuilt components designed to enable people to up and running with Sitecore Discover as quickly as possible."
publishDate: '2023-02-21'
disqusId: '492a3d7e-dae1-4dd2-818e-ea8ca8a4e70a'
tags: ['Nextjs','Styled Components', 'Sitecore Discover']
---

## Sitecore Discover JS SDK
I've recently been working with a new JavaScript SDK for Sitecore Discover which is going to be released soon.  This is a React library which provides a series of prebuilt components designed to enable people to up and running with Sitecore Discover as quickly as possible. You can read all about it on the <a href="https://doc.sitecore.com/discover/en/developers/discover-js-sdk-for-react/introduction-to-discover-js-sdk-for-react.html" target="_blank" rel="nofollow">Sitecore Documentation Site</a>. 

Now the components come in a few different versions, we have straight `JavaScript` and `TypeScript` flavours. We also have both `styled` and `unstyled` versions of the components to give developers options in how they want to get started.

I began testing the SDK by integrating it with <a href="https://nextjs.org/commerce" target="_blank" rel="nofollow">Nextjs Commerce</a>. I like this project for testing out JS SDK as its super quick and easy to get up and running, however I ran into some strange issues when using the styled versions of the components.

## Styled Components with Nextjs
Now when using the styled versions of the components, the styles are provided by <a href="https://styled-components.com/" target="_blank" rel="nofollow">Styled Components</a> – a library that uses tagged template literals to allow you write CSS to style your components easily. 

Now when the page first loaded the styled components were rendered correctly, however whenever the Nextjs router fired to change the page content the styles were removed?

After some googling it turns out that you need to tell Nextjs that you’re using Styled Components in your application in order for this error not to happen.

To do so, you need to add the following configuration to your Next.config.js

```js
compiler: {
  styledComponents: true
}
```  

Once this was included everything worked well and my component styles persisted after a route change!