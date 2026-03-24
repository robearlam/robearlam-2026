---
title: 'Sitecore Commerce Id Generation Helper Methods'
slug: 'sitecore-commerce-id-generation-helper-methods'
dateCreated: '2020-08-31'
lastUpdated: '2020-09-03'
abstract: "If you've been working Sitecore Experience Commerce, the chances are you've using code like to generate an entity id in the correct format"
publishDate: '2019-02-25'
disqusId: '4F7A425D-CD90-4FB6-B0EE-083A5F816389'
tags: ['Sitecore','Commerce','EntityId','Helper Methods']
---
If you've been working with Sitecore Experience Commerce, the chances are you've been using code like this to generate an entity id in the correct format.

```
var catalogId = $"{CommerceEntity.IdPrefix<Catalog>()}{catalogName}";
var categoryId = $"{CommerceEntity.IdPrefix<Category>()}{catalogName}-{categoryName}";
```

Well it turns out that there are some handy helper methods built into the product to make this a bit simpler, instead of having to compose the entity ID's yourself like above you can instead use the following:

```
var catalogId = catalogName.ToEntityId<Catalog>();
var categoryId = categoryName.ToCategoryId(catalogName);
```

A much cleaner way of handling that for sure!

