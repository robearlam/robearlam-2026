---
title: 'Upgrading the XM Cloud Introduction repository to Docker Compose v2'
slug: 'docker-compose-v2'
dateCreated: '2023-04-19'
lastUpdated: '2023-04-19'
abstract: "In case you haven’t heard, Docker has slowly been pushing people to migrate the latest version of Docker Compose, which is `v2`. This has culminated in the end of life for `v1`, which means that the functionality will be removed from all Docker Desktop versions as of Jun 2023."
publishDate: '2023-04-19'
disqusId: '90f0210e-146d-41be-9906-26fc149797cd'
tags: ['Docker','Docker Compose', 'Sitecore', 'XM Cloud']
---

In case you haven’t heard, Docker has slowly been pushing people to migrate the latest version of Docker Compose, which is `v2`. This has culminated in the end of life for `v1`, which means that the functionality will be removed from all Docker Desktop versions as of Jun 2023.

Our team at Sitecore is responsible for the <a href="https://github.com/Sitecore/XM-Cloud-Introduction/" target="_blank" rel="nofollow">XM Cloud Introduction</a> project, which currently uses Docker Compose for its local developer experience, so we needed to update to the latest version to ensure we could continue to work in this way. This post will cover the steps we needed to complete to migrate the solution to `v2`.

Overall, the process was fairly simple, with most of the time being taken up by testing. In the end, it boiled down to a couple of tasks that I needed to complete:

- Updating our YAML definitions.
- Updated our PowerShell scripts.

I also used this as an opportunity to tidy up a few things with the docker-related files to clean up a few warnings that were being thrown after we move to `v2`.

I’ll talk through the different changes we needed to make below, but you can see the pull request that contained the changes that were required <a href="https://github.com/Sitecore/XM-Cloud-Introduction/pull/253" target="_blank" rel="nofollow">here</a>.

## Updating the YAML definitions
The first thing we needed to do was to remove the top-level `version` parameter from our main `docker-compose.yml` file as it is no longer required when running `v2`.  After completing this we then needed to update how we were scaling some of our containers. We use containers to perform build actions, but they aren’t actually used at runtime, previously this was achieved by using a `scale` parameter like this:
```
service-name:
    scale: 0
```
This syntax is incorrect when running Docker Compose v2 through, and now you should use the `deploy.replicas` property instead, so this involved changing all instances of this to the following syntax:
```
service-name:
    deploy:
      replicas: 0
```
The final change we needed to make was to one of our EntryPoint values, the previous version used the following value for the EntryPoint of the CM container:
```
entrypoint: powershell -Command "& C:\tools\entrypoints\iis\Development.ps1"
```
When attempting to use that with `v2` though, the container failed to start as the backslashes were being stripped out. The simple fix for this was to double escape those slashes, so the new version looks like this:
```
entrypoint: powershell -Command "& C:\\tools\\entrypoints\\iis\\Development.ps1"
```
Those were all of the changes I needed to make to our docker-compose yaml definitions, now there are other changes that have been implemented by this forced migration but they didn’t affect our solution. You can read about the full set of changes on the <a href="https://docs.docker.com/compose/" target="_blank" rel="nofollow">docker site</a>

## Updating the PowerShell scripts
Once we had our yml definitions updated the last thing we needed to complete to have compatibility was to update our PowerShell scripts used to run the solution locally. The only change here was to update how the docker compose commands were issued. 
We have a few different ways that our solution can be run, but they all executed the containers using a command similar to this:
```
docker-compose up -d
```
We had to change this slightly to remove the hyphen from the `docker-compose` command, forcing anyone running the repo to be executing it using the v2 format, so the above command became
```
docker compose up -d
```

## Final tidy up
After changing to run the solution using `v2` I noticed it was throwing some extra warnings about unpopulated environment variables. After looking into it, these variables were no longer actually used in our solution, so this proved to be a good time to tidy those up as well.
The final task was to update the `README` for the repository to state that it was now using Docker Compose v2.

## Conclusion
Overall, migrating to Docker Compose v2 was fairly straightforward for our solution and didn’t involve too many changes, though it may be more complex for you depending on which v1 features you’re leveraging.

You can read a short KB article highlighting this issue: <a href="https://support.sitecore.com/kb?id=kb_article_view&sysparm_article=KB1002998" target="_blank" rel="nofollow">here</a>


