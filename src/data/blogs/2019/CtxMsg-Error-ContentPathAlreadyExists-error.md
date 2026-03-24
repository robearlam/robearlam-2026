---
title: 'Content Path Already Exists Error'
slug: 'CtxMsg-Error-ContentPathAlreadyExists-error'
dateCreated: '2020-08-31'
lastUpdated: '2020-09-03'
abstract: "This week I've finally found some time to start upgrading my Rob.Commerce solution to Sitecore Experience Commerce 9.2 which was released last month. Now this was the easiest XC installation that I've been through to date however when I came to bootstrapping and initializing my custom environment data into the engine, I ran into a problem that troubled me for a while"
publishDate: '2019-09-07'
disqusId: '9bc35324-8819-4484-b7b1-f8b57ef0fc9b'
tags: ['Sitecore','Commerce','XC92','Redis']
---
This week I've finally found some time to start upgrading my <a href="https://github.com/robearlam/Rob.Commerce" target="_blank" rel="noopener">Rob.Commerce</a> solution to Sitecore Experience Commerce 9.2 which was released last month. Now this was the easiest XC installation that I've been through to date however when I came to bootstrapping and initializing my custom environment data into the engine, I ran into a problem that troubled me for a while.

I managed to clean the existing environments out ok, the bootstratpping of the new configuration went fine as well, however when it came time to run the _EnsureSyncDefaultContentPaths_ task, it kept falling over and giving me the following error:

```
ERROR CtxMsg.Error.ContentPathAlreadyExists: Text=Content path '/sitecore/Commerce/Commerce Control Panel' already exists.
```

Now this task is responsible for taking the commerce control panel items and storing them in the Shared Envionments database for fast access by the commerce engine, but I’d already cleaned my existing environments so how could it already exist?

I went and checked the _[ContentEntities]_ table to make sure that the Clean Environment tasks had actually run to completion and sure enough the table was empty. I figured it must be a caching issue so I reset IIS and tried once, but again I got the same error. 
After a bit more thinking I remembered the introduction of the Redis cache with XC 9.2, and sure enough there were still items stored in there. It turns out the Clean Environment command will clean down your DB records, but not your Redis Cache. I ran a _FLUSHALL_ command using the _Redis-CLI_ and then everything ran smoothly from there.

