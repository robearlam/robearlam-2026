---
title: 'Rob.Commerce'
slug: 'rob-commerce'
dateCreated: '2020-08-31'
lastUpdated: '2020-09-03'
abstract: "So I’m happy to say that I can finally release something that I’ve been working on for a while. A sample Sitecore XC solution that also contains all of the Plugins"
publishDate: '2018-12-21'
disqusId: '9ABFB5C1-528B-4C5A-B522-03D9F8AC5A40'
tags: ['Sitecore','Commerce','Helix','Rob.Commerce']
---
So I’m happy to say that I can finally release something that I’ve been working on for a while. A sample Sitecore XC solution that also contains all of the Plugins that I’ve shown in my talks over the past couple of years. You can access it <a href="https://github.com/robearlam/Rob.Commerce" target="_blank" rel="noopener">here</a>.

It’s called Rob.Commerce (I know what you’re thinking, how did I come up with such an amazing and original name right?) and contains not only the plugins I showed in my sessions at Symposium 2017 & Symposium 2018 but is also structured to show how you can setup your XC solution to match the Helix principals.

## Helix
How to apply the Helix principals when working in XC is currently being debated by the community and the Helix Working Group, which I’m a member of for 2018. If you haven’t already, then you should make your opinion heard by commenting on the RFC <a href="https://github.com/Sitecore/Helix.Docs/issues/11" target="_blank" rel="noopener">here</a>. 
   
I firmly believe that the tight coupling between the engine and storefront requires a master solution and repository to bring the two together. I stated as much in my comment in the RFC, and I wanted this solution to stand as an example of how to achieve this, while leveraging your build tools to make the different publishing targets a breeze to work with.

## Features
There are many different features provided in the solution and I intend to add to them as I continue to develop new XC functionality. The main thing to remember though is that these are code samples and if you want to make use of them then please do, but please ensure you test them thoroughly. Some of the main features included are:
* Product Compare– presented at Symposium 2017
* Push Orders to Service Bus – presented at Symposium 2018
* Import Products from CSV – presented at Symposium 2018
* Custom commerce personalization rule – presented at Symposium 2018
* Custom commerce promotion – presented at Symposium 2018

## Support and Licensing
This is all released under the <a href="https://en.wikipedia.org/wiki/Beerware" rel="noopener" target="_blank">Beerware licence</a>. You’re free to use/modify/share and do anything you like with the source. If you find it useful and we meet and some point in the future then feel free to buy me a beer in return if you want.

As for whether I’m going to support this, yeah……no. As I said above the code is provided as a series of examples showing how you can implement certain features. I’m happy to discuss any improvements that can be made, accept PR’s, etc. but outside of that you need to run them all through your normal testing procedure and support them as if it were code your wrote yourselves.

## The Future
I’m planning to add to this solution as I create different functionality for Sitecore and will try to keep it updated and running on the latest version (no I’m not going to maintain compatibility with previous versions, sorry). Hopefully it can help people either save a few dev cycles if you need one of these features, or maybe just point you in the right direction if you’re wondering how to compete something similar.

