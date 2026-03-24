---
title: 'Accessing Container Environment Variables using Sitecore PowerShell Extensions'
slug: 'accessing-container-environment-variables-using-sitecore-powershell-extensions'
dateCreated: '2022-10-12'
lastUpdated: '2022-10-12'
abstract: "I recently had an issue where I needed to debug a Sitecore instance running in a Docker container. I needed to access the environment variables of the container, but didn't have access to the cluster to see the values."
publishDate: '2022-10-12'
disqusId: '377ec2d6-9e18-4623-954d-17513e227c9c'
tags: ['Sitecore','SPE', 'Docker']
---

## Accessing Container Environment Variables
I recently had an issue where I needed to debug a Sitecore instance running in a Docker container. I needed to access the environment variables of the container, but didn't have access to the cluster to see the values. So I had to figure out a way to list out the variables that had been used to setup the container, enter Sitecore PowerShell Extensions (SPE).

## SPE to the rescue!
I turns out that having access to run SPE scripts made this super easy. At first the ouput was being truncated which wasn't much use, but after a few tweaks I was able to get the output I needed with the following command:

```powershell
gci env: | Format-Table -Wrap -AutoSize
```

Hope that helps anyone else who needs to find out the values for the environment variables powering a Sitecore container, when you don't have access to the back end!