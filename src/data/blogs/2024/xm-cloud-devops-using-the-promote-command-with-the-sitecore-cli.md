---
title: 'XM Cloud DevOps - Using the promote command with the Sitecore CLI'
slug: 'xm-cloud-devops-using-the-promote-command-with-the-sitecore-cli'
dateCreated: '2024-07-29'
lastUpdated: '2024-07-29'
abstract: "I recently made a small change to the CI/CD process for the XM Cloud Introduction repository that we maintain. Since we first built the project it has been using GitHub Actions for its CI/CD processes, and leveraging the Sitecore CLI for the XM Cloud deployment elements"
publishDate: '2024-07-29'
disqusId: 'adf456b3-6f46-4c0e-b830-71a0eba7b68c'
tags: ['Sitecore','XM Cloud','CLI','DevOps']
---

## Using the Sitecore CLI for XM Cloud CI/CD pipelines
I recently made a small change to the CI/CD process for the XM Cloud Introduction repository that we maintain. Since we first built the project it has been using GitHub Actions for its CI/CD processes, and leveraging the Sitecore CLI for the XM Cloud deployment elements.

Since this was originally built, we have been blocked from building out the CI/CD process as we wanted though, due to a limitation with the data being returned from the Sitecore CLI. 

## XM Cloud Promote
Since XM Cloud was first released, it has included the ability to promote the CM image from one environment to another. The reason for this is that it allows you to test your changes in a lower, typically non-production, environment. Then when you’re happy you can move that same image to your Production environment. 

Promoting an image instead of building it again has a couple of advantages. Firstly, it ensures that you’re comparing apples to apples. While running the same build again for the next environment should give you the same result, you can never be sure. Promoting an existing image ensures that exact same built asset you tested against, is the one you’re running Production. Secondly, it’s heaps faster – moving an existing image is significantly more efficient than running the build process again!

## Sitecore CLI Promote
Now you can read about how to use the Promote command with the Sitecore CLI on the <a href="https://doc.sitecore.com/xmc/en/developers/xm-cloud/the-cloud-environment-command.html#the-promote-subcommand" target="_blank" rel="nofollow">documentation site</a>.

You might be wondering why we couldn’t use this command when we first build out our CI/CD pipeline a while back. Well if you look at the parameters required by the `promote` command you can see it needs both the `environment-id` and `source-id` params to be set. 

The `source-id` refers to the ID of the successful deployment that you now want to promote to higher environment, and this where our problem lay. While the promote command was set up correctly, the `deploy` command wasn’t returning the id of the successful deployment when it had finished, meaning we didn’t have the value to pass into the `promote` command 🤦

## XM Cloud Introduction repo pipelines.
You can see that we were tracking this limitation in a <a href="https://github.com/Sitecore/XM-Cloud-Introduction/issues/230" target="_blank" rel="nofollow">GitHub Issue</a> for quite a while. Well, an update to the CLI was published recently, meaning we now had the data we needed returned from the `deploy` command.

This meant we could change the CI/CD process for the XM Cloud elements to now successfully leverage the `promote` command as they always should have. You can see the PR with the files that were changed <a href="https://github.com/Sitecore/XM-Cloud-Introduction/pull/473" target="_blank" rel="nofollow">here</a>.

You might be wondering what the result of this action was? Well, we’ve saved about 30% of the deploy time required for the push to our Production environment – 2 minutes each deploy that we’re not waiting for assets to be re-built unnecessarily! 

A great result!