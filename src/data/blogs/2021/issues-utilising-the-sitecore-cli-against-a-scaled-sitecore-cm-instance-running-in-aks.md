---
title: 'Issues utilising the Sitecore CLI against a scaled Sitecore CM instance running in AKS'
slug: 'issues-utilising-the-sitecore-cli-against-a-scaled-sitecore-cm-instance-running-in-aks'
dateCreated: '2021-11-18'
lastUpdated: '2021-11-18'
abstract: "I ran into an interesting issue this week when working on the rebuild of the Sitecore MVP site. To give a bit of background, this project is a rebuild of the MVP site using Sitecore’s DotNet rendering Host and is running on AKS."
publishDate: '2021-11-18'
disqusId: '706163e2-a587-4c72-af43-cb6b3d904a3c'
tags: ['Sitecore CLI','AKS', 'NGINX', 'k8s']
---

I ran into an interesting issue this week when working on the rebuild of the <a target="_blank" href="https://mvp.sitecore.com/">Sitecore MVP site</a>. To give a bit of background, this project is a rebuild of the MVP site using Sitecore’s DotNet rendering Host and is running on AKS. This is an open-source build and you can see the repository <a target="_blank" href="https://github.com/Sitecore/MVP-Site">here</a>.

We were running fine in production, but then had a requirement to scale out our CM instance to > 1 replica to enable more resiliency in the Content Editing experience. Now according to our <a target="_blank" href="https://doc.sitecore.com/en/developers/101/platform-administration-and-architecture/scaling-and-configuring-content-management.html">scaling guide</a> you can scale the CM instance horizontally, but you need to enable “sticky sessions” when you do, to ensure that the same users are directed to the same CM instance for each request. We already had <a target="_blank" href="https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#session-affinity">cookie affinity</a> enabled on our NGINX ingress so we increased the replica count and thought everything would be fine…… famous last words, right? 

![What could go wrong?][4]

After increasing the replica count to 2, our CLI calls to publish the database after doing a content sync during our CI process started failing with the following error:

```
Publish to [Internet(web)] started... 
Publish identifier was not found. This is likely caused by the service being restarted during a publish. 
Please verify the status of the environment and re-issue the publish request. 
```

It quickly became obvious that the affinity settings weren’t being applied to the CLI calls, and they were bouncing between the two different CM instances. I checked the logs on my Ingress Controller and could see that was the case, the CLI was polling the `/sitecore/api/management` endpoint to see when the publish had finished but when the request was sent to a different instance it failed, as that instance had no knowledge of the publish in progress.

If cookie affinity can’t be applied to the CLI requests, then how can you ensure that repeated requests from the same client are sent to the same instance inside the cluster? Well, it turns out you can use a different annotation called <a target="_blank" href="https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#custom-nginx-upstream-hashing">`upstream-hash-by`</a>, which is used for a similar purpose when cookies can’t be applied. So, I added this annotation into my Ingress and, no change, the CLI calls still aren’t “sticky”. Turns out if you have both `afinity` & ` upstream-hash-by` defined on the same Ingress object then the `upstream-hash-by` annotation will be ignored and just the `affinity` annotation applied. Ok, so easy fix right, just remove the `affinity` annotation and have all requests use ` upstream-hash-by` instead?

![Garth Too Easy][5]

Well, I tried that and straight away, my CLI started working again, the requests were sticky and my publishing worked fine. However, it turns out that when you remove the `affinity` annotation from the Ingress object, then it no longer passes cookies along in the same manner and this broke my ability to log into the CMS using my browser. It was throwing 404 errors for any identity requests. It was about now I could see the rabbit hole opening up in front of me & the time I was about to loose to this....

![Jordan Crying][1]

On we go with trying to get this to work, my next attempt was to create an entirely new Ingress object, but only for the `/sitecore/api/management` path being called by the CLI. It looked like this:

```
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: mvp-ingress-upstream-hash
  annotations:
    kubernetes.io/ingress.class: "nginx"
    nginx.ingress.kubernetes.io/upstream-hash-by: "$request_uri"
spec:
  rules:
  - host: <<CM_HOST>>
    http:
      paths:
      - path: /sitecore/api/management
        backend:
          serviceName: cm
          servicePort: 80
  tls:
  - secretName: sitecoredemo-tls
    hosts:
    - <<CM_HOST>>
```

This, I thought would allow me to target this specific path differently than the other paths to my CM server and as you can’t create annotations at the Path level, only the object level, this seemed like the best approach.

However, once I applied the changes to my cluster there was no change, my CMS logins were working as that Ingress definition contained the `affinity` annotation, but my CLI calls were still not sticky and so failed again. After much trial and error, I figured out that when I removed the `affinity` annotation from the main CM Ingress definition then my CLI started working again. 

![Jackie Chan What][2]

After a long time reading the NGINX documentation (and a good amount of trial and error), it became clear that even though they’re defined as separate objects here, because they are the same HostName & Service they are combined by NGINX when it builds out its routing table, meaning that then both the `affinity` and `upstream-hash-by` annotations are present on the combined build object, and we’re back to square one where the `affinity` annotation is once more taking preference.

So, what was the actual fix here? Well, it turns out the simplest fix I’ve come with so far is to provision a dedicated subdomain for my CLI requests. This means I can have a dedicated Ingress with a separate host, however that wasn’t quite enough - it was still being merged by NGINX. I also needed to create a dedicate CLI service for the CM pods as well. Once I had provisioned all of those, I had a working solution. NGINX stopped merging the Ingress objects and I now “finally” had working sticky sessions for both CMS browser based requests and also for CLI calls. You can view how the specs ended up being configured <a target="_blank" href="https://github.com/Sitecore/MVP-Site/tree/96613c92eb8e3914c8e165ed3fed33b306473997/k8s/specs/staging">here</a>.

![Vadar Victory][3]

I was certainly not expecting to have to do such a deep dive in to K8s networking and how NGINX builds out its routing tables when I started this, but I certainly learned a lot about how all of this works under the hood. I’m also not 100% happy with having to provision a dedicated subdomain, service & ingress just to get the CLI requests to “stick”, but I couldn’t think of a simpler solution, if you have one then please let me know in the comments below!

(Credit to <a target="_blank" href="https://twitter.com/techphoria414">Nick W</a> as well for pointing me towards the `upstream-hash-by` annotation as the way to initially get the CLI calls working.)

[1]: /img/blog-images/2021/jordan-crying.jpg
[2]: /img/blog-images/2021/jackie-chan-what.jpg
[3]: /img/blog-images/2021/vadar-victory.png
[4]: /img/blog-images/2021/what-could-go-wrong.webp
[5]: /img/blog-images/2021/garth-too-easy.png