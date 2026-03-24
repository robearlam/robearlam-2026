---
title: 'Setting up HTTPS on RobEarlam.com, so easy!'
slug: 'setting-up-https-on-robearlamcom-so-easy'
dateCreated: '2020-08-31'
lastUpdated: '2020-09-03'
abstract: "So last weekend I finally got around to something I'd been meaning to tackle for a while, setting up HTTPS for my site robearlam.com"
publishDate: '2017-09-02'
disqusId: '1db0aee1-4bb7-4e91-ac38-26ec9f10e0df'
tags: ['HTTPS','RobEarlam.com','Security']
---
So last weekend I finally got around to something I'd been meaning to tackle for a while, setting up HTTPS for my site robearlam.com.

This has been on my todo list since Google & Firefox announced <a href="https://arstechnica.com/information-technology/2017/01/firefox-chrome-start-calling-http-connections-insecure/" rel="noopener" target="_blank">earlier in the year</a> that they will be starting to mark sites served over straight HTTP as insecure. After further reading I was also surprised to lean that HTTPS is significantly faster than HTTP (you can see a great example of this on <a href="https://www.httpvshttps.com/" target="_blank" rel="noopener">httpvshttps.com</a>), what's not to like!

I've been hosting the site as an Azure WebApp for a while now and am loving the setup I have there, however I'm only on a *Shared* tier and MS require you to be on *Basic* tier or above to be able to setup HTTPS. At first I looked into simply upgrading the tier however the *Basic* tier is over 5 times more expensive that the *Shared*, so I very quickly ruled that option out.

When looking into how to solve this problem I came across a <a href="https://www.troyhunt.com/how-to-get-your-ssl-for-free-on-shared/" target="_blank" rel="noopener">post</a> by Troy Hunt covering exactly this issue. I'm not going to replicate his post here, but he advocates for using <a href="https://www.cloudflare.com" target="_blank" rel="noopener">CloudFlare</a> as the HTTPS provider. Now as he mentions this does only provide a secure connection between the end user and the CloudFlare edge node, leaving the traffic between CloudFlare and the origin server insecure, but that is enough to stop most man-in-the-middle attacks.

Now as for the actual setup itself, I never imagined it to be as easy as it was. All I had to do was to sign-up to CloudFlare, for free no less,  then log into my Domain Name Registrar and update my nameserver settings to point to CloudFlare and I was done. It probably took less than 15mins to configure, and would be a lot less the second time round, then I had to wait for about 2hours for the cert to be issued.

The last thing I had to do was to add the redirect from HTTP to HTTPS to ensure that anyone who visits is forced onto the secure domain. It turns out there is an Azure extension for this very purpose, I added this and restarted the site, then I was finished.

![Secure page][1]

All in all the process probably took me about 3 hours to complete, including writing this blog post. Now when you visit the site you'll be forced onto HTTPS and I've got that little green padlock I was after, so easy!

[1]: /img/blog-images/robearlam-https.png

