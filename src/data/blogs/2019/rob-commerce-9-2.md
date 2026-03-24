---
title: 'Rob.Commerce 9.2'
slug: 'rob-commerce-9-2'
dateCreated: '2020-08-31'
lastUpdated: '2020-09-03'
abstract: "This week I finally got around to upgrading my Rob.Commerce solution to Sitecore Experience Commerce 9.2. The software was released around a month ago and was looking forward to seeing the new version in action"
publishDate: '2019-09-17'
disqusId: '4467cb49-4762-4f46-8de9-af5eba4e2315'
tags: ['Sitecore','Commerce','XC92','Sitecore TDS']
---
This week I finally got around to upgrading my <a href="https://github.com/robearlam/Rob.Commerce" target="_blank" rel="noopener">Rob.Commerce</a> solution to <a href="https://dev.sitecore.net/Downloads/Sitecore_Commerce/92/Sitecore_Experience_Commerce_92_Initial_Release.aspx" target="_blank" rel="noopener">Sitecore Experience Commerce 9.2</a>. The software was released around a month ago and was looking forward to seeing the new version in action.

## List Changes
As part of the performance improvements introduced with XC 9.2, there have been some changes to how the system functions and one of these that tripped me up during the upgrade was a change to how Lists are handled now. My solution includes a custom Product Compare feature which is stored as a list in the **SharedEnvironments** database. After upgrading the solution this functionality stopped working, I could see the list being created in the **CommerceEntities** table, however whenever I tried to retrieve the list it was always empty and no errors were logged. After getting some help from the Geovannia on the product team, it became clear that this was due to by list being stored in the wrong table now. It was a list containing catalog data, but it wasn’t being stored in the **CatalogLists** table, it was stored in the **CommerceLists** table.

To fix this I had to add my list definition to the **PlugIn.SQL.Sharding.PolicySet-1.0.0.json** definition. So, my sharding policy for the Catalog lists now looks like:

```
{
    "$type": "Sitecore.Commerce.Plugin.SQL.ListShardingPolicy, Sitecore.Commerce.Plugin.SQL",
    "Expressions": {
        "$type": "System.Collections.Generic.List`1[[System.String, mscorlib]], mscorlib",
        "$values": [
            "^List-CatalogItems.*?$",
            "^List-Catalogs.*?$",
            "^List-Categories.*?$",
            "^List-SellableItems.*?$",
            "^List-Categories.*?$",
            "^List-SellableItems.*?$",
            "^List-PurgeCatalogs.*?$",
            "^List-PurgeCategories.*?$",
            "Entity-Catalog.*?$",
            "Entity-Category.*?$",
            "Entity-SellableItem.*?$",
            "^List-Entity-ProductCompare.*?$"
        ]
    },
    "TableName": "CatalogLists"
}
```

You can see the last line in the Values array will now ensure that my ProductCompare list entities will be stored in the **CatalogLists** table instead of the **CommerceLists** table. Once this change was bootstrapped into the engine then everything started working again, SUCCESS!

## Change to from Unicorn to TDS
As part of the upgrade process I also changed the solution from using Unicorn for its serialization framework, over to using Sitecore TDS. I hadn’t used TDS in many years and again I was keen to see how the software had moved on since I used it last. Overall the change went very smoothly, it just involved me removing the Unicorn references and serialized files from the repository, then setting up TDS projects instead.
The product hasn’t gone through any large scale changes since it used it last, however there were some nice touches that have been introduced, things like Quick Push and the ability to Sync all projects in one go. Next on my list is looking into moving to make use of the new YML serialization feature.

## Conclusion
The upgrade to XC92 is one that is worth undertaking, purely from the performance increases it gives you. That’s before you even consider improvements that have been made to the Marketing Automation and EXM functionality – something else on my list to investigate in more detail.
As with the list issue I ran into, there a few other changes introduced to give the performance improvements that have been delivered, e.g. the difference in how Localization of data is handled, which can be seen in this <a href="https://sitecore.stackexchange.com/questions/14250/add-localization-to-entity" rel="noopener">Stack Overflow</a> question. So, while there are some changes you will have to factor in for your upgrade, the performance boost you’ll receive it certainly worth the effort!

