---
title: 'Sitecore Identity Service - Max Client Secret Length'
slug: 'sitecore-identity-service-max-client-secret-length'
dateCreated: '2020-09-07'
lastUpdated: '2020-09-07'
abstract: "So in the process of developing the new MVP site, we ran into a couple things that other developers might  encounter. So I wanted to start covering some of them here. The first of those are the rules about the Identity Server Client Secret."
publishDate: '2020-09-07'
disqusId: 'fefa570b-3943-41dc-b61c-2b2684451587'
tags: ['Sitecore','Identity Server']
---
So in the process of developing the new MVP site, we ran into a couple things that other developers might  encounter. So I wanted to start covering some of them here. The first of those are the rules about the Identity Server Client Secret.

With the release of Sitecore 10, a new Sitecore CLI was released. This allows for headless authentication when deserialising content automatically, say during a CI process. You can achieve this by using a command like so:
```
dotnet sitecore login --client-credentials true --auth https://mvp-id.sc.localhost/ --cm https://mvp-cm.sc.localhost/ --allow-write true --client-id "<<CLIENT_ID>>" --client-secret "<<TOKEN>>"
```
Now I was trying to use a very long Token value for this. I originally started with a 128 char token, but the authentication kept failing with the following error
```
Error while getting client credentials token: invalid_client
```
It took a bit to figure out, but the key to this became clear once I viewed the logs for my ID server instance, I did this using the following command:
```
docker logs mvp-site_id_1
```
After wading through the logs I saw the following entry that made it all very clear!
```
IdentityServer4.Validation.PostBodySecretParser [Error] Client secret exceeds maximum length.
```
So after some trial and error with tokens of different lengths, it turns out that the Max Length supported is 101 chars. So when creating Client Secrets for Sitecore 10 you need to make sure that you stay under that length!
