---
title: 'Migrating the XM Cloud Introduction Repo to a new Nuget feed.'
slug: 'migrating-the-xm-cloud-introduction-repo-to-a-new-nuget-feed'
dateCreated: '2023-07-27'
lastUpdated: '2023-07-27'
abstract: "Today I had to go through the process of migrating the XM Cloud Introduction repository to a new Nuget feed. This was required as the old feed was no longer available, and we needed to move to a new one on short notice. This post will cover the steps I needed to complete to migrate the solution to the new feed"
publishDate: '2023-07-27'
disqusId: '9452c036-e63a-41e2-aced-8f62f3577779'
tags: ['Nuget','XM Cloud', 'Sitecore']
---

Today I had to go through the process of migrating the XM Cloud Introduction repository to a new Nuget feed. This was required as the old feed was no longer available, and we needed to move to a new one on short notice. This post will cover the steps I needed to complete to migrate the solution to the new feed.

## Machine Tidy Up
Now for anyone who hasn't run a Sitecore site before you can most likely skip this step. However, for anyone who has you should tidy up any references to the old feed that have been configured on your machine. In my case, this was the PowerShell Repository used to restore the `SitecoreDockerTools` module used by this, and other Sitecore repositories.

### Remove PS Repository
The first thing to check is whether you have the old Sitecore Feed registered as a PowerShell Repository, you can do this by running the following command `Get-PSRepository` and checking where there is a record named `SitecoreGallery`. If you have one registered, then you can remove it by running `Unregister-PSRepository -Name SitecoreGallery`.

### Remove PS Modules
Next, I tidied up any previous versions of the `SitecoreDockerTools` module installed from the old feed. You can test whether you have any versions of that module installed by running the `Get-Module -ListAvailable` and look for any named `SitecoreDockerTools`. If you have those installed, you can quickly remove all installed versions of that package by running ` Uninstall-Module -Name SitecoreDockerTools -AllVersions`.

## Update the Repository
So now we’ve tidied our developer machine, we can update the repository to reference the new feed. This involved making two changes, an update to the `init.ps1` script used to initialise the repository, and then an update to the `nuget.config` to define the new location for the NuGet packages in use by the solution.

### Updating the init.ps1 script
The first thing the script does is install the `SitecoreDockerTools` PowerShell module, so we need to update the location that it is installed from, in our case, we needed to use v2 of the Nuget feed to get it to work, so we needed to change it to `https://nuget.sitecore.com/resources/v2/`. After making this change the init script ran successfully and installed the module from the new feed.

### Updating the nuget.config
The final change we need to make is to update the `nuget.config` file in the root of the repository that controls where custom NuGet packages are installed from. We had a couple of older references in there that we removed and condensed down to the single new feed reference. This resulted in us having the following line in our config:

```
<add key="Sitecore" value="https://nuget.sitecore.com/resources/v3/index.json" />
```

## Conclusion
Updating the XM Cloud Introduction repository to the new feed location was straight forward in the end. I would recommend any developers who have been running existing Sitecore solutions before follow the tidy-up steps at the start to ensure they remove any legacy references they have to the old feed.
You can see the changes we had to make in the following <a href="https://github.com/Sitecore/XM-Cloud-Introduction/pull/270/commits/2a20e2b69486c128bda055e0564d7cc736820dc1" target="_blank" rel="nofollow">commit</a>.
There may be other changes that you will need to complete to bring your codebase in line, but hopefully, this will help to get you started with what tasks are required for you.
