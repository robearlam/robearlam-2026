---
title: 'Nginx Ingress - Breaking change, Ingress.class now required'
slug: 'nginx-ingress-breaking-change-ingress.class-now-required'
dateCreated: '2021-10-11'
lastUpdated: '2021-10-11'
abstract: "I hit an issue today attempting to install a clean Sitecore 10.1 XM instance into a new AKS cluster. I followed the steps & instructions just the same as before, but when I went to test the sites, they all gave me a 404. This led me down a bit of a K8s Ingress debugging hole!"
publishDate: '2021-10-11'
disqusId: '7d735ed4-65f6-4e0e-9813-8b1f91c13a50'
tags: ['k8s','Ingress', 'NGINX']
---

## The issue
I hit an issue today attempting to install a clean Sitecore 10.1 XM instance into a new AKS cluster. I followed the steps & instructions just the same as before, but when I went to test the sites, they all gave me a 404. This led me down a bit of a K8s Ingress debugging hole! The service was configured correctly, I could see the external IPs assigned, but whenever I tried to hit the site I received the default Nginx 404 page. I started digging into it and saw some interesting records in the Nginx Controller logs
```
7 controller.go:952] Error obtaining Endpoints for Service "default/cd": no object matching key "default/cd" in local store                                                                                                                
7 controller.go:952] Error obtaining Endpoints for Service "default/cm": no object matching key "default/cm" in local store 
7 controller.go:952] Error obtaining Endpoints for Service "default/id": no object matching key "default/id" in local store
7 controller.go:1270] Error getting SSL certificate "default/global-cd-tls": local SSL certificate default/global-cd-tls was not found. Using default certificate
7 controller.go:1270] Error getting SSL certificate "default/global-cm-tls": local SSL certificate default/global-cm-tls was not found. Using default certificate
7 controller.go:1270] Error getting SSL certificate "default/global-id-tls": local SSL certificate default/global-id-tls was not found. Using default certificate
7 store.go:361] "Ignoring ingress because of error while validating ingress class" ingress="default/sitecore-ingress" error="ingress does not contain a valid IngressClass"
```
The last line stating `ingress does not contain a valid IngressClass` caught my attention as that didn’t sound good. After some googling it turns out the Nginx controller was updated back in August to now require a IngressClass to be specified on your ingresses. You can read about it in the release notes <a href="https://github.com/kubernetes/ingress-nginx/releases/tag/controller-v1.0.0" target="_blank">here</a>.

## The Fix
Turns out the fix was very simple, I just needed to ensure that my ingress annotations included the line `kubernetes.io/ingress.class: "nginx"` to specify the IngressClass. Once I added that and re-patched the ingress into my AKS instance everything worked fine again. Hurrah!

**Note:** This means that at the time of writing this the default Sitecore Installation specs will not work because of this issue. You will need to include the IngressClass to fix it. For the XM1 deployment I was attempting, this meant amended the ingress definition to look like this:

```
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: sitecore-ingress
  annotations:
    nginx.ingress.kubernetes.io/proxy-buffer-size: "32k"
    nginx.ingress.kubernetes.io/affinity: "cookie"
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/proxy-connect-timeout: "600"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "600"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "600"
    nginx.ingress.kubernetes.io/proxy-body-size: "512m"
    kubernetes.io/ingress.class: "nginx"
  ...
  ...
```