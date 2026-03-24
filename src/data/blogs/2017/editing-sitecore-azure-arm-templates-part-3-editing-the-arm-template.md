---
title: 'Editing Sitecore Azure ARM Templates - Part 3 - Editing the ARM Template'
slug: 'editing-sitecore-azure-arm-templates-part-3-editing-the-arm-template'
dateCreated: '2020-08-31'
lastUpdated: '2020-09-03'
abstract: "This is the third post in my series on Editing Sitecore Azure ARM Templates, if you haven't read the others you might want to head back to the beginning and start from there, you can find it at"
publishDate: '2017-04-16'
disqusId: 'af6d543c-23ad-4b18-a4e9-74e7284851d2'
tags: ['ARM','Azure','Sitecore']
---
This is the third post in my series on Editing Sitecore Azure ARM Templates, if you haven't read the others you might want to head back to the beginning and start from there, you can find it at <a href="/blog/editing-sitecore-azure-arm-templates-part-1-introduction">Editing Sitecore Azure ARM Templates - Part 1 - Introduction</a>.

In my previous post in this series we built a Content Delivery WebDeploy package that would use MongoDB for its session provider instead of the default Redis provider which Sitecore setup out of the box. The next step is to edit the ARM templates provided by Sitecore to make use of this new WebDeploy package and to pass in the new MongoDB Session connection string.

## Setting up the Visual Studio Project
The example ARM templates that Sitecore provided can be downloaded from <a href="https://github.com/Sitecore/Sitecore-Azure-Quickstart-Templates" target="_blank" rel="noopener">GitHub</a>. Once the repo has been downloaded you'll see there are three different types of ARM templates included:

- xm - An ARM Template to deploy an Experience Management Sitecore setup.
- xp - An ARM Template to deploy a distributed Experience Platform setup.
- xp0 - An ARM Template to deploy a single instance Experience Platform setup.

The difference between these three setups is outside of the scope of this blog series, but we're going to be focusing on the *xp* templates as this gives us a distributed complete setup running the full Experience Platform including xDB. Now we can open Visual Studio and create a new Azure Resource Group project.

![Visual Studio -> New Project][1]

In the next prompt we select *blank template*, and then the project will load. You'll notice that the each of the different ARM Template folders mentioned above contain files with the same name as what were created in the blank Visual Studio project, this is the standard for an ARM Template project. Next we'll overwrite the empty ones created by Visual Studio with the versions from the *xp* Template folder, we're also going to overwrite the contents of the PowerShell script with the version provided on the Sitecore GitHub page.

## Updating the azuredeploy.parameters.json
The next task we have to do is to update the two json files to interact with the WebDeploy package that we created in the previous post. First up we'll edit the *azuredeploy.parameters.json* file. We're going to update this to add a new parameter for the MongoDB Session connection string. Once complete it should look something like this, notice the extra *session.mongodb.connectionstring* parameter that has been added:

```
{
  "deploymentId": {
    "value": ""
  },
  "sitecore.admin.password": {
    "value": ""
  },
  "rep.authentication.apikey": {
    "value": ""
  },
  "analytics.mongodb.connectionstring": {
    "value": ""
  },
  "tracking.live.mongodb.connectionstring": {
    "value": ""
  },
  "tracking.history.mongodb.connectionstring": {
    "value": ""
  },
  "tracking.contact.mongodb.connectionstring": {
    "value": ""
  },
  "session.mongodb.connectionstring": {
    "value": ""
  },
  "sqlserver.login": {
    "value": ""
  },
  "sqlserver.password": {
    "value": ""
  },
  "cm.msdeploy.packageurl": {
    "value": ""
  },
  "cd.msdeploy.packageurl": {
    "value": ""
  },
  "prc.msdeploy.packageurl": {
    "value": ""
  },
  "rep.msdeploy.packageurl": {
    "value": ""
  },
  "licenseXml": {
    "value": ""
  }
}
```

Now the parameters have been updated we need to edit the *azuredeploy.json* configuration.

## Updating the azuredeploy.json
This is the file that contains the majority of the work to be carried out during the deployment, it basically contains a manifest of the various Azure resources that are going to be created during the deployment. This is a very large JSON document that would be pretty painful to edit in a Text Editor, but luckily Visual Studio has some good inbuilt tools to help us out here. Once you open the *azuredeploy.json* you'll want to make sure you have the *JSON Outline* window open and this gives you a nice tree based way to navigate the document.

![JSON Outline Window][2]

As you can see in the image above the JSON document contains three sections, *variables*, *parameters* and *resources*, all of which will need to be edited. The aim of the edits we're going to make are twofold, we want to ensure that any reference to Redis is removed as it's no longer required and we also want to make sure that the new MongoDB Session connection string we created earlier is passed through to the WebDeploy package correctly.

We start by expanding the variables top level tree branch and there are two references to Redis in here *redisApiVersion* & *redisCacheNameTidy*. We can delete the first instance as it's no longer needed, however with the second we can repurpose it for the MongoDB Session connection string. It was originally setup as:


```
"redisCacheNameTidy": "[toLower(trim(parameters('rediscache.name')))]",
```

We're going to change this to now reference Mongo instead, also notice the string towards the end of the line, this must match the parameter name we created previously in the *azuredeploy.parameters.json* above.

```
"sessionMongoDbConnStrTidy": "[trim(parameters('session.mongodb.connectionstring'))]",
```

Next we move on to updating the *parameters* section, there are several mentions of Redis in here, *rediscache.name*, *rediscache.skuname*, *rediscache.skufamily* & *rediscache.skucapacity*. All of these were used to control how the Redis resource in Azure would be setup, as that's no longer being created all of these JSON elements can be deleted.

The *resources* section is the section that actually lists each of the features that will be deployed into Azure when this ARM Template is executed. If you expand the tree node you can see each of these features and it's pretty obvious which one is the Redis node.

![JSON Outline Resources][3]

Once this has been deleted then we're almost complete, we now need to search though the JSON document for *redis* to ensure that all elements have been removed. There will be one remaining which is in the *MSDeploy* section as a dependency for the CD WebApp, which states that the Redis cache must be created before the WebApp. As the Redis cache is no longer going to be created this dependency can be removed, afterwards the *dependsOn* section should like this:

```
"dependsOn": [
  "[concat('Microsoft.Web/sites/', variables('cdWebAppNameTidy'))]",
  "[concat('Microsoft.Web/sites/', variables('cmWebAppNameTidy'), '/Extensions/MSDeploy')]",
  "[resourceId('Microsoft.Search/searchServices', variables('searchServiceNameTidy'))]",
  "[resourceId('Microsoft.Insights/Components', variables('appInsightsNameTidy'))]",
  "[concat('Microsoft.Sql/servers/', variables('dbServerNameTidy'), '/databases/', variables('coreDbNameTidy'))]",
  "[concat('Microsoft.Sql/servers/', variables('webDbServerNameTidy'), '/databases/', variables('webDbNameTidy'))]"
],
```

The final task that we have to perform is to wire up the MongoDB Session connection string. In the same *MSDeploy* section there is a *setParameters* section, this is responsible for passing the value from JSON parameters file into the WebDeploy package. Each of the parameter names should match the name in the *parameters.xml* file created in the previous blog post, and it's value points to a *variable* set at the top of the *azuredeploy.json* file, including the new MongoDB connection string we created. When the new properties reference is added the completed section should look like this:

```
"properties": {
  "packageUri": "[parameters('cd.msdeploy.packageurl')]",
  "dbType": "SQL",
  "connectionString": "[concat('Data Source=tcp:', reference(concat('Microsoft.Sql/servers/', variables('dbServerNameTidy'))).fullyQualifiedDomainName, ',1433;Initial Catalog=master;User Id=', parameters('sqlserver.login'), '@', variables('dbServerNameTidy'), ';Password=', parameters('sqlserver.password'), ';')]",
  "setParameters": {
    "Application Path": "[variables('cdWebAppNameTidy')]",
    "Sitecore Admin New Password": "[parameters('sitecore.admin.password')]",
    "Core DB User Name": "[parameters('cd.core.sqldatabase.username')]",
    "Core DB Password": "[parameters('cd.core.sqldatabase.password')]",
    "Core Admin Connection String": "[concat('Encrypt=True;TrustServerCertificate=False;Data Source=', reference(concat('Microsoft.Sql/servers/', variables('dbServerNameTidy'))).fullyQualifiedDomainName, ',1433;Initial Catalog=',variables('coreDbNameTidy'),';User Id=', parameters('sqlserver.login'), ';Password=', parameters('sqlserver.password'), ';')]",
    "Core Connection String": "[concat('Encrypt=True;TrustServerCertificate=False;Data Source=', reference(concat('Microsoft.Sql/servers/', variables('dbServerNameTidy'))).fullyQualifiedDomainName, ',1433;Initial Catalog=',variables('coreDbNameTidy'),';User Id=', parameters('cd.core.sqldatabase.username'), ';Password=', parameters('cd.core.sqldatabase.password'), ';')]",
    "Web DB User Name": "[parameters('cd.web.sqldatabase.username')]",
    "Web DB Password": "[parameters('cd.web.sqldatabase.password')]",
    "Web Admin Connection String": "[concat('Encrypt=True;TrustServerCertificate=False;Data Source=', reference(concat('Microsoft.Sql/servers/', variables('webDbServerNameTidy'))).fullyQualifiedDomainName, ',1433;Initial Catalog=',variables('webDbNameTidy'),';User Id=', parameters('web.sqlserver.login'), ';Password=', parameters('web.sqlserver.password'), ';')]",
    "Web Connection String": "[concat('Encrypt=True;TrustServerCertificate=False;Data Source=', reference(concat('Microsoft.Sql/servers/', variables('webDbServerNameTidy'))).fullyQualifiedDomainName, ',1433;Initial Catalog=',variables('webDbNameTidy'),';User Id=', parameters('cd.web.sqldatabase.username'), ';Password=', parameters('cd.web.sqldatabase.password'), ';')]",
    "Cloud Search Connection String": "[concat('serviceUrl=https://', variables('searchServiceNameTidy'), '.search.windows.net;apiVersion=', variables('searchApiVersion'), ';apiKey=', listAdminKeys(resourceId('Microsoft.Search/searchServices', variables('searchServiceNameTidy')), variables('searchApiVersion')).primaryKey)]",
    "Analytics Connection String": "[variables('analyticsMongoDbConnStrTidy')]",
    "Tracking Live Connection String": "[variables('trackingLiveMongoDbConnStrTidy')]",
    "Tracking Contact Connection String": "[variables('trackingContactMongoDbConnStrTidy')]",
    "Mongo Session Connection String": "[variables('sessionMongoDbConnStrTidy')]",
    "Application Insights Instrumentation Key": "[reference(resourceId('Microsoft.Insights/Components', variables('appInsightsNameTidy'))).InstrumentationKey]",
    "Application Insights Role": "CD",
    "KeepAlive Url": "[concat('https://', reference(resourceId('Microsoft.Web/sites', variables('cdWebAppNameTidy'))).hostNames[0], '/sitecore/service/keepalive.aspx')]",
    "License Xml": "[variables('licenseXml')]"
  }
}
```

That was the final step and we now have a set of ARM Templates updated to remove the Redis feature, accept a new MongoDB Session connection string and then pass it through to our updated WebDeploy package which will use it to directly patch the *ConnnectionStrings.config* file on deployment. In the final post in this series we will populate the parameters in the *azuredeploy.parameters.json* and the PowerShell files and actually run the deployment to prove that the changes we made were successful.

You can read the final post here: <a href="/blog/editing-sitecore-azure-arm-templates-part-4-executing-the-deployment/">Editing Sitecore Azure ARM Templates - Part 4 - Executing the deployment</a>

[1]: /img/blog-images/azureresourcegroup.png
[2]: /img/blog-images/json-outline.png
[3]: /img/blog-images/json-outline-resources.png

