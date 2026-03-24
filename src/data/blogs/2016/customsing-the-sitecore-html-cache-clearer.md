---
title: 'Customsing the Sitecore HTML cache clearer'
slug: 'customsing-the-sitecore-html-cache-clearer'
dateCreated: '2020-08-31'
lastUpdated: '2020-09-03'
abstract: "The default Sitecore CacheClearer can be a bit heavy handed, dumping all of the HTML cache for a site every time an item is published. This isn't always what is required, sometimes there are certain"
publishDate: '2016-05-28'
disqusId: 'e5b50404-2063-48b4-9296-68ce06fdfd97'
tags: ['Cache','HtmlCache','Sitecore']
---
The default Sitecore CacheClearer can be a bit heavy handed, dumping all of the HTML cache for a site every time an item is published. This isn't always what is required, sometimes there are certain areas of the content tree that you're confident don't get cached, and as such you don't want a publish of these items to cause the cache clear to take place.

I worked with a customer recently who required just that functionality. It turns out it was rather easy to implement by overriding the default HtmlCacheClearer with a custom version. This would check a series of content paths stored in an app setting and if the published item was located under one then the publish would be ignored and the caches remain populated.

```
public class HtmlCacheClearer : Sitecore.Publishing.HtmlCacheClearer
    {
        private const string SettingName = "CustomHtmlCacheClearer.IgnoreItems";

        public new void ClearCache(object sender, EventArgs args)
        {
            if (sender == null)
            {
                return;
            }

            var sitecoreEventArgs = args as SitecoreEventArgs;
            if (sitecoreEventArgs == null || !sitecoreEventArgs.Parameters.Any())
            {
                return;
            }

            var publisher = sitecoreEventArgs.Parameters[0] as Publisher;
            if (publisher == null)
            {
                return;
            }

            if (IsCacheClearRequired(publisher.Options))
            {
                base.ClearCache(sender, args);
            }
        }

        protected bool IsCacheClearRequired(PublishOptions publishOptions)
        {
            var exemptPaths = Sitecore.Configuration.Settings.GetSetting(SettingName);
            if (string.IsNullOrWhiteSpace(exemptPaths))
            {
                return true;
            }

            return exemptPaths.Split('|')
                              .All(excemptPath => !publishOptions.RootItem.Paths.FullPath.StartsWith(excemptPath,StringComparison.OrdinalIgnoreCase));
        }
    }
```

My first attempt at this used a list of ID's instead of a list of paths, however as we wanted ignore an item and all of its children this required a look of the item from ID and then an Axes comparison, which was a lot slower than the string comparison on the path being used now.

To patch it in instead of the default HTMLCacheClearer, it is a simple case of replacing the existing instance with the new one and adding the new app setting

```
<settings>
      <!--
        A pipe separated list of content ID's. When a publish occurs if the item 
        being published is one of these items,
        or a child of one of these items then the HTML cache isn't cleared.
      -->
      <setting name="CustomHtmlCacheClearer.IgnoreItems" value="/sitecore/content"/>
    </settings>

    <events>
      <event name="publish:end">
        <handler type="Sitecore.Publishing.HtmlCacheClearer, Sitecore.Kernel" method="ClearCache">
          <patch:delete />
        </handler>
        <handler type="CustomHtmlCacheClearer.HtmlCacheClearer, CustomHtmlCacheClearer" method="ClearCache">
          <sites hint="list">
            <site>website</site>
          </sites>
        </handler>
      </event>
      <event name="publish:end:remote">
        <handler type="Sitecore.Publishing.HtmlCacheClearer, Sitecore.Kernel" method="ClearCache">
          <patch:delete />
        </handler>
        <handler type="CustomHtmlCacheClearer.HtmlCacheClearer, CustomHtmlCacheClearer" method="ClearCache">
          <sites hint="list">
            <site>website</site>
          </sites>
        </handler>
      </event>
      <event name="indexing:end">
        <handler type="CustomHtmlCacheClearer.IndexCacheClearer, CustomHtmlCacheClearer" method="Clear"/>
      </event>
    </events>
```

If you want to include this functionality in your project then you can download it from <a href="https://github.com/robearlam/CustomCacheClearer" target="_blank" rel="noopener">GitHub</a>

