---
title: 'Sitecore Search SDK - Breaking Change'
slug: 'sitecore-search-sdk-breaking-change'
dateCreated: '2024-02-02'
lastUpdated: '2024-02-02'
abstract: "Recently my colleague Mark van Aalst was updating the package versions for the Sitecore Developer Portal. This also included updating the version of the Sitecore Search React SDK from v2.0.0 to v2.2.2, among other packages that were updated at the same time. Once this had been deployed, we got reports that faceting was no longer working on the search results page. We quickly rolled back and started to look into what had happened"
publishDate: '2024-02-02'
disqusId: '4de30159-8689-4168-9bc1-33fcf5ff7a6e'
tags: ['Sitecore Search','SDK']
---

## Updating packages in Sitecore’s Developer Portal
Recently my colleague <a href="https://twitter.com/markvanaalst" target="_blank" rel="nofollow">Mark van Aalst</a> was updating the package versions for the <a href="https://developers.sitecore.com/" target="_blank" rel="nofollow">Sitecore Developer Portal</a>. This also included updating the version of the Sitecore Search React SDK from `v2.0.0` to `v2.2.2`, among other packages that were updated at the same time.
Once this had been deployed, we got reports that faceting was no longer working on the search results page. We quickly rolled back and started to look into what had happened.

## Breaking changes in the Faceting UI component
I reached out to <a href="https://www.linkedin.com/in/pablo-barrenechea-4894181a/" target="_blank" rel="nofollow">Pablo Barrenechea</a> on the team that owns the SDK and apparently there was a breaking change introduced in a previous version and we needed to update how we were leveraging the UI components being used to render the Search Results page.

Previously we were wrapping out Facets in the `AccordionFacets.Root` component, like so

```
<AccordionFacets.Root defaultFacetTypesExpandedList={facets.map((x) => x.name)} onFacetValueClick={onFacetClick}>
	….
</AccordionFacets.Root>
```

However, this approach is no longer valid, we should now be using ` SearchResultsAccordionFacets` component instead. As follows:

```
<SearchResultsAccordionFacets defaultFacetTypesExpandedList={facets.map((x) => x.name)} onFacetValueClick={onFacetClick}>
	…
</SearchResultsAccordionFacets>
```

This was a fairly straightforward change, which meant we could bump the Developer Portal up to be running on the latest version of the Search SDK 🎉. 

To see the complete set of changes we had to make for the Developer Portal, you can view the PR that was opened for this fix <a href="https://github.com/Sitecore/developer-portal/pull/641" target="_blank" rel="nofollow">here</a>.

