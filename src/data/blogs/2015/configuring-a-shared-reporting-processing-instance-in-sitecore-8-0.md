---
title: 'Sharing a Reporting & Processing role in Sitecore 8.0'
slug: 'configuring-a-shared-reporting-processing-instance-in-sitecore-8-0'
dateCreated: '2020-08-31'
lastUpdated: '2020-09-03'
abstract: "I have recently been working with a client to set up an new Sitecore 8.0 implementation. Their architecture included a shared Reporting / Processing instance, and so we looked for documentation on how"
publishDate: '2015-11-28'
disqusId: '82815d10-eb2a-4885-928b-36fe2577eec8'
tags: ['8.0','Reporting','xDB','Sitecore']
---
I have recently been working with a client to set up an new Sitecore 8.0 implementation. Their architecture included a shared Reporting / Processing instance, and so we looked for documentation on how to configure this. We could only find the two documents detailing how to configure each individual instance: <!--more-->
[Configure a processing server][1] [Configure a Reporting Service server][2]

The issue with these documents is that when attempting to follow both, they contain conflicting configuration advise e.g. the reporting configuration document states that you can disable the *Sitecore.Analytics.Processing.Aggregation.Services.config* file, however the processing document makes no mention of disabling this file, indicating that it is needed and cannot be disabled for this role.

After some trial and error we decided on the following approach to these conflicts. Any config file that both guides said to disable, we would disable. Any config either not mentioned, or only mentioned in one of the guides would remain in its default state. Finally, any config that either of the guides said to enable, would be enabled.

Following that rule we came up with the following list of configs that need to be disabled:

*   *Sitecore.Analytics.Tracking.config*
*   *Sitecore.Analytics.Tracking.Database.config*
*   *Sitecore.Analytics.Tracking.RobotDetection.config*
*   *Sitecore.Marketing.Client.config*
*   *Sitecore.WebDAV.config*
*   *Sitecore.PathAnalyzer.Client.config*
*   *Sitecore.PathAnalyzer.RemoteClient.config*
*   *Sitecore.ExperienceAnalytics.Client.config*
*   *Sitecore.ExperienceAnalytics.WebAPI.config*
*   *Sitecore.ExperienceProfile.Client.config*
*   *Sitecore.FXM.Speak.config*
*   *Sitecore.Services.Client.FXM.Enabler.config*
*   *Sitecore.ListManagement.Client.config*
*   *Sitecore.ListManagement.config*
*   *Sitecore.ListManagement.Services.config*
*   *Sitecore.Social.config*
*   *Sitecore.Social.ExperienceProfile.config*
*   *Sitecore.Social.Facebook.config*
*   Sitecore.Social.GooglePlus.config*
*   *Sitecore.Social.LinkedIn.config*
*   *Sitecore.Social.ProfileMapping.Facebook.config*
*   *Sitecore.Social.ProfileMapping.GooglePlus.config*
*   *Sitecore.Social.ProfileMapping.LinkedIn.config*
*   *Sitecore.Social.ProfileMapping.Twitter.config*
*   *Sitecore.Social.SocialMarketer.config*
*   *Sitecore.Social.Twitter.config*

And the following configs that needed to be enabled:

*   *Sitecore.Xdb.Remote.Server*
*   *Sitecore.Xdb.Remote.Server.MarketingAssets.config*
*   *Sitecore.PathAnalyzer.Services.RemoteServer.config*

The rest of the steps in the guides were straight forward to follow, however, there were a couple of the changes in the "Changes to configuration file settings" that needed to be skipped as well:

*   *Don't remove the Sitecore.Xdb.Remote.Server.config configuration/sitecore/customHandlers.*
*   *Don't remove the Sitecore.Xdb.Remote.Server.MarketingAssets.config configuration/sitecore/customHandlers*

Another point to note is that after loading up the shared instance we were getting a lot of errors in the log that looked like this:

*ManagedPoolThread #4 11:31:54 ERROR Cannot create tracker.* *Exception: System.InvalidOperationException* *Message: Could not get pipeline: createTracker (domain: )*

This ended up being because we had accidentally disabled the Sitecore.Analytics.Automation.TimeoutProcessing.config.

Hopefully this post can point you in right direction if you have to configure a similar shared instance in the future.

[1]: https://doc.sitecore.net/sitecore_experience_platform/80/xdb_configuration/configure_a_processing_server
[2]: https://doc.sitecore.net/sitecore_experience_platform/80/xdb_configuration/configure_a_reporting_service_server

