---
title: 'Sitecore XC9, Data Isolation & Artifact Stores'
slug: 'sitecore-xc9-data-isolation-artifact-stores'
dateCreated: '2020-08-31'
lastUpdated: '2020-09-03'
abstract: "If you've installed XC9 and started to take a look into what gets installed, you should have by now noticed there there a number of different environments that get setup for you out of the box, these are"
publishDate: '2018-03-17'
disqusId: 'EE52D892-6180-4411-A8F9-A16B1A277FD2'
tags: ['Sitecore','Commerce','Artifact Stores','XC9','Data Isolation']
---
If you've installed XC9 and started to take a look into what gets installed, you should have by now noticed there there a number of different environments that get setup for you out of the box, these include:
* HabitatAuthoring
* HabitatShops
* AdventureWorksAuthoring
* AdventureWorksShops

Now what you'll see when you look into these environments is that HabitatShops & HabitatAuthoring both share the same catalog data, as do AdventureWorksAuthoring & AdventureWorksShops. This makes sense, you would want your shops role for your Habitat site to be accessing the same data that your Authoring role is, as you would with the Adventure Works site. But how does this work under the hood? Well this data isolation is achieved using Artifact Stores.

### Artifact Stores
These allow you to provide a key that is used to store your data against, and you can then use that key in your environment definition to define which set of data the envinronment you're configuring is going to work against. This is important when you start to look into multi-shop or multi-tenancy installations as a lot of the time you would want to keep the commerce data for the different shops or tenants you're creating separate.

If you take a look into the json files for the environments that come included in XC9, you can see the _ArtifactStoreId_ is one of the first properties declared, you can see an example of this in the HabitatAuthoring environment.

```
{
  "$type": "Sitecore.Commerce.Core.CommerceEnvironment, Sitecore.Commerce.Core",
  "ArtifactStoreId": "78A1EA61-1F37-42A7-AC89-9A3F46D60CA5",
  "Components": {
    "$type": "System.Collections.Generic.List`1[[Sitecore.Commerce.Core.Component, Sitecore.Commerce.Core]], mscorlib",
    "$values": [{
      "$type": "Sitecore.Commerce.Plugin.ManagedLists.ListMembershipsComponent, Sitecore.Commerce.Plugin.ManagedLists",
      "Memberships": {
        "$type": "System.Collections.Generic.List`1[[System.String, mscorlib]], mscorlib",
        "$values": ["CommerceEnvironments"]
      },
      "Id": "efe49ff743d34b649fffcof293615cd9",
      "Policies": {
        "$type": "System.Collections.Generic.List`1[[Sitecore.Commerce.Core.Policy, Sitecore.Commerce.Core]], mscorlib",
        "$values": []
      },
      "ChildComponents": {
        "$type": "System.Collections.Generic.List`1[[Sitecore.Commerce.Core.Component, Sitecore.Commerce.Core]], mscorlib",
        "$values": []
      }
    }]
  }
```

Now if you take a look in the HabitatShops environment it will have the same _ArtifactStoreId_ value. Similarly if you take a look at the AdventureWorksAuthoring & AdventureWorksShops environments they will share a different ID to this one.

So that explains the concept, but how does this get reflected in the data stored in the database?

### Data Storage
It took me a little bit to figure out how this data key was translated to the entities that are stored in the database. I originally started searching inside the JSON data for each of the entites but couldn't find it? It was then that I released that it was right under my nose all along!

![SQL Structure][1]

The value is stored against the _EnvironmentId_ field above, meaning that all the entities that are shared between the Habitat environments have their ArtifactId value stored in that field, and the same for the AdventureWorks environments, and it will be the same for any custom environments that you create!

### Composite Primary Key
If you look at the image above you will see the _Primary Key_ on the table is actaully a _Composite Primary Key_ consisting of both the _EnvironmentId_ and the actual ID of the _Entity_ itself. Now there is some debate about whether Composite Primary Keys are a good idea, but I'm not going to into that here. I will say however that in my opinion the non-relational structure of the XC databases does remove the importance of this arguement _somewhat_. What this does mean though is that you can have the same element with the exactly the same Id exist in two different Artifact Stores.
    
Yay for Flexbility!

[1]: /img/blog-images/SQLStructure.png

