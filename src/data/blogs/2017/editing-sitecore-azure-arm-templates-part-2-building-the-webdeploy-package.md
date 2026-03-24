---
title: 'Editing Sitecore Azure ARM Templates - Part 2 - Building the WebDeploy package'
slug: 'editing-sitecore-azure-arm-templates-part-2-building-the-webdeploy-package'
dateCreated: '2020-08-31'
lastUpdated: '2020-09-03'
abstract: "This is the second post in my series on Editing Sitecore Azure ARM Templates, if you haven't read the first one you might want to head back and read that one first, you can find at Editing Sitecore"
publishDate: '2017-04-15'
disqusId: 'f533001d-d18f-48a3-8dbc-6e107550e576'
tags: ['ARM','Azure','Sitecore']
---
This is the second post in my series on Editing Sitecore Azure ARM Templates, if you haven't read the first one you might want to head back and read that one first, you can find it at <a href="/blog/editing-sitecore-azure-arm-templates-part-1-introduction">Editing Sitecore Azure ARM Templates - Part 1 - Introduction</a>.

## Editing the WebDeploy package content
Sitecore provide a series of WebDeploy packages, one for each Sitecore Role to be created as part of the deployment process. In the default architecture that I'm basing mine off the included roles are:

- Content Management
- Reporting
- Processing
- Content Delivery

The first three roles are all set to use *InProc* session by default, which means we just have to update the Content Delivery package to use the  MongoDB session provider. When a WebDeploy package is extracted is looks like this on disk:

![WebDeploy package contents][1]

The files in the root are a series of dacpac & SQL files used for setting up the database and some configuration xml files used to patch the contents of the WebDeploy. The *Content* folder contains the actual files that will be deployed to the WebApp and this is where we need to make our changes to the Sitecore Role to switch over to use Mongo instead of Redis.

#### Web.config changes

The web.config in the */Content/Website* folder is the standard web.config that is distributed with a Sitecore package. This is where we need to change the *private* session provider to use MongoDB, when complete the *sessionState* node should look like this:

```
<sessionState mode="Custom" cookieless="false" timeout="20" sessionIDManagerType="Sitecore.SessionManagement.ConditionalSessionIdManager" customProvider="mongo">
    <providers>
        <add name="mongo" type="Sitecore.SessionProvider.MongoDB.MongoSessionStateProvider, Sitecore.SessionProvider.MongoDB" sessionType="private" connectionStringName="session" pollingInterval="2" compression="true"/>
        <add name="mssql" type="Sitecore.SessionProvider.Sql.SqlSessionStateProvider, Sitecore.SessionProvider.Sql" sessionType="Standard" connectionStringName="session" pollingInterval="2" compression="true"/>
        <add name="redis" type="Sitecore.SessionProvider.Redis.RedisSessionStateProvider, Sitecore.SessionProvider.Redis" applicationName="private" connectionString="redis.sessions" pollingInterval="2"/>
    </providers>
</sessionState>
```

#### ConnectionString.config changes

The ConnectionString.config file needs updating next, this can be found in */Content/Website/App_Config/*. When you open this configuration file you'll notice that all of them are empty or contain dummy values, this is because the contents of this file will be patched during deployment. The change we're going to make is to the *redis.sessions* connection. We're just going to rename this to *mongo.sessions*. Once complete the ConnectionString.config should look something like this:

```
<?xml version="1.0" encoding="utf-8"?>
<connectionStrings>
  <!-- 
    Sitecore connection strings.
    All database connections for Sitecore are configured here.
  -->
  <add name="core" connectionString="user id=user;password=password;Data Source=(server);Database=Sitecore_Core"/>
  <add name="web" connectionString="user id=user;password=password;Data Source=(server);Database=Sitecore_Web"/>
  <add name="analytics" connectionString="mongodb://localhost/Sitecore_analytics"/>
  <add name="tracking.live" connectionString="mongodb://localhost/Sitecore_tracking_live"/>
  <add name="tracking.contact" connectionString="mongodb://localhost/Sitecore_tracking_contact"/>
  <add name="cloud.search" connectionString=""/>
  <add name="appinsights.instrumentationkey" connectionString=""/>
  <add name="mongo.sessions" connectionString=""/>
</connectionStrings>
```

#### Sitecore.Analytics.Tracking.config changes

The final changes we need to make to the *Content* of the WebApp is to change the *Shared* session to also use MongoDB. This is achieved by editing the *Sitecore.Analytics.Tracking.config* file located in the */Content/Website/App_Config/* folder. We need to change the *sharedSessionState* node to now use MongoDB, once complete it should look something like this:

```
<sharedSessionState defaultProvider="mongo">
  <providers>
    <clear/>
    <add name="InProc" type="System.Web.SessionState.InProcSessionStateStore"/>
    <add name="redis" type="Sitecore.SessionProvider.Redis.RedisSessionStateProvider" connectionString="redis.sessions" applicationName="shared" operationTimeoutInMilliseconds="5000" pollingInterval="30"/>
    <add name="mongo" type="Sitecore.SessionProvider.MongoDB.MongoSessionStateProvider, Sitecore.SessionProvider.MongoDB" connectionStringName="session" pollingInterval="2" compression="true" sessionType="shared"/>
  </providers>
  ..... 
  .....
</sharedSessionState>
```

After this is complete we have a *Content* folder which contains a Sitecore Content Delivery Role configured to use MongoDB for its session provider, the final step in editing the WebDeploy Package is to edit the parameters used to populate it.

## Editing WebDeploy package parameters

Looking into the root of the WebDeploy package there is a file called *parameters.xml*, this controls the patching action mentioned above which updates the values in the *ConnectionStrings.config*. Looking in the parameters file there is a section that is responsible for patching the Redis connectionstring which we're going to change, out-of-the-box it looks like this:

```
<parameter name="Redis Connection String" description="Redis Connection string to enter into config" tags="Hidden,NoStore">
  <parameterEntry kind="XmlFile" scope="App_Config\\ConnectionStrings\.config$" match="//connectionStrings/add[@name='redis.sessions']/@connectionString" />
</parameter>
```

Looking in this parameter element we can see the various references to Redis in the *name*, *description* & *match* attributes. The *match* attribute is the key one here and is used to patch the value of the old *redis.sessions* connectionstring, we're going to update this to point to the new *mongo.sessions* value we setup above. Once complete the parameter element should look like this:

```
<parameter name="Mongo Connection String" description="Mongo Connection string to enter into config" tags="Hidden,NoStore">
  <parameterEntry kind="XmlFile" scope="App_Config\\ConnectionStrings\.config$" match="//connectionStrings/add[@name='mongo.sessions']/@connectionString" />
</parameter>
```

Now this is completed we have a built CD WebDeploy package which can now be zipped up and along with the default packages for the other Sitecore roles, uploaded into Azure Blob storage. There are a few ways to achieve this but a simple GUI based tool that Microsoft provides is the <a href="http://storageexplorer.com/" target="_blank" rel="noopener">Microsoft Azure Storage Explorer</a>.

Once these have been uploaded then we're left with the task of editing the ARM templates to reference the new WebDeploy package we created and pass in the MongoDB session connection string. This will be covered in my next post in this series <a href="/blog/editing-sitecore-azure-arm-templates-part-3-editing-the-arm-template/">Editing Sitecore Azure ARM Templates - Part 3 - Editing the ARM Template</a>.

[1]: /img/blog-images/webdeploy-package.png

