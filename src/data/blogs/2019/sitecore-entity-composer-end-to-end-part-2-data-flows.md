---
title: 'Sitecore Entity Composer, End-to-End: Part 2 - Data Flows'
slug: 'sitecore-entity-composer-end-to-end-part-2-data-flows'
dateCreated: '2020-08-31'
lastUpdated: '2020-09-03'
abstract: "This is the second part in a blog series demonstrating a complete end-to-end scenario for Sitecore Experience Commerce and the Entity Composer"
publishDate: '2019-01-16'
disqusId: '9037674A-6122-4F6F-A229-BC9EB1F341AA'
tags: ['Sitecore','Commerce','Entity Composer']
---
This is the second part in a blog series demonstrating a complete end-to-end scenario for Sitecore Experience Commerce and the Entity Composer. If you haven’t read part 1 already then you can find it <a href="/blog/sitecore-entity-composer-end-to-end-part-1-extending-the-entities">here</a>.

## The Content Editor
In the first post we used the Entity Composer to extend our Sellable Item definition to include two new fields. We then assigned those new fields to our Sellable Items and finally made sure that we populated some of them with data. In this post we’re going to take a look into how this data will make its way into the Sitecore Content tree and Solr indexes.
<br />
<br />
So we’re going to jump over to the Content Editor now, and the first thing we’re going to do is to use the Commerce Ribbon, and select the “Update Data Templates” button.

![The commerce ribbon][1]

This will cause Sitecore to pull in the data templates specified in the Commerce Databases and update the Sitecore templates based on these. Once this is complete you should now see the Manufacturer Details template we created in the Content Tree at this location: _/sitecore/templates/Commerce/Catalog Generated/Components/ManufacturerDetails_.

> Note: there is an issue with the sync here to do with the how the template inheritance works out of the box and we need to fix it up before we can carry on. If you look at the generated template you will see that it is mistakenly inheriting from itself creating a circular dependency, we first of all need to just remove that base template inheritance. The next thing we need to do is to make our Sellable Item template inherits from our generated ManufacturerDetails template. You’ll find the Sellable Item template at: /sitecore/templates/Commerce/Catalog Generated/ConnectSellableItem.

Now in the Content Tree you can can navigate to one of the Sellable Items who you previously populated our custom entity view fields on, and you should see the fields are populated!

![The Content Editor][2]

## Solr
What we want to do next is to get this data into the Solr index, the first thing we need to do is complete a site publish to push the changes we made previously to the web database.

> Note: if you’re using XC 9.0.3 there is an issue with the commerce environment being used by the web index which will stop the custom fields from being indexed. It is set to use the HabitatAuthoring environment by default but you’ll need to change this to use HabitatShops environment instead, this is found in the /App_Config/Include/Y.Commerce.Engine/Sitecore.Commerce.Engine.Connectors.Index.Solr.config, however you should change the value using a config patch to make future upgrades easier.

Now as we updated the template inheritance in the previous step that change won’t get picked up as an incremental change for the index provider to process, so we need to complete a full index rebuild to cause all of the Sellable Items to be reindexed with our new fields included.

Once you’ve completed the rebuild you can navigate to your Solr instance to test that the data has been indexed correctly.

![Solr][3]

If you look at the image above, you can see that we selected the web index from the dropdown, then we selected the Query menu, and finally we entered the query “_name: 6042749”. This will find all of the index documents which contain a field with the name “_name” and the value “6042749”, which is the product id of the product we’re searching for.

![Solr Document][4]

When we run the query, we’re returned the index document’s content in JSON format and we can search this document for the custom fields that we added. If you look at the JSON above you can see the various out of the box fields for the Microwave we searched for and also the two custom fields we added, which I’ve highlighted.
<br />

Now that data has made it into Solr, it opens up a lot of possibilities for what we can do with this data as most of the controls provided with SxA Storefront populate their data from the index, which means we can start to leverage the data on the Storefront and I’ll cover how you can do this in Part 3 of this series.

You can read the third and final post in this series <a href="/blog/sitecore-entity-composer-end-to-end-part-3-the-storefront">here</a>.
    
[1]: /img/blog-images/Image1-CommerceRibbon.png
[2]: /img/blog-images/Image2-ContentEditor.png
[3]: /img/blog-images/Image3-Solr.png
[4]: /img/blog-images/Image4-Solr-Document.png

