---
title: 'Introducing the Sitecore Discover JavaScript SDK - Part 2 Components'
slug: 'introducing-the-sitecore-discover-javascript-sdk-part-2-components'
dateCreated: '2023-05-11'
lastUpdated: '2023-05-11'
abstract: "This post is the second in a two-part blog series, introducing a brand-new JavaScript SDK for Sitecore Discover. In this second part, we'll dive into the component model provided by the SDK and show the different ways you can leverage Discover data in your React application."
publishDate: '2023-05-11'
disqusId: '33dacee1-9f7d-4e24-a0e5-8855f8affd8d'
tags: ['Sitecore Discover','Nextjs', 'React']
---

## Introducing the Sitecore Discover JavaScript SDK - Part 2 Components
This post is the second in a two-part blog series, introducing a brand-new JavaScript SDK for Sitecore Discover. You can read the first part <a href="/blog/introducing-the-sitecore-discover-javascript-sdk-part-1-events" target="_blank" rel="nofollow">here</a>. In this second part, we'll dive into the component model provided by the SDK and show the different ways you can leverage Discover data in your React application.
This blog is the accompaniment for the YouTube video highlighting the same features. You can watch the video below:

<div class="video-container"><iframe src="https://www.youtube.com/embed/hNze4QQwu30" title="Introducing the Sitecore Discover JS SDK - Part 2 - Components" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>

## Adding Components to a Page
There are three different ways to add a component in to your React application:

- **Static components**: Created in the CEC (Customer Engagement Console) and dropped into the page by a developer. This is developer-centric and means the developer specifies that a specific widget will always appear in a specific area in the DOM. The merchandiser can configure the widget afterwards, but they cannot change it out for a different one.
- **Dynamic widgets**: The developer leverages a `widget` tag, similar to a placeholder in XM Cloud, allowing the merchandiser to dynamically insert widgets configured and created in the CEC. This means the developer can specify an area in the DOM, and the merchandiser can add and remove widgets from that area without the developer's involvement.
- **Global components**: These are components that appear on every page, such as the search bar in a header. They remain the same across different pages and routes of your site.

## Configuring Widgets in the CEC
Before adding any components to our application, they’ll need to be configured within the CEC. There are two different types of widgets when it comes to working with the SDK:

![Search Wigets in the CEC][1]

- **HTML widgets**: The layout is owned by the CEC, and the SDK can render them without any additional configuration.
- **Catalog widgets**: The layout and functionality are owned by your application. We need to tell the SDK which components in our app to use to render them by calling the `setWidgetType` function, you can find details on that function in our <a href="https://doc.sitecore.com/discover/en/developers/discover-js-sdk-for-react/setwidgettype-fucntion.html" target="_blank" rel="nofollow">documentation site</a>. 

An `rfk_id` is also assigned to each of your widgets allowing you to refer to them specifically. 

## Where to find a Widget examples?
So, you might be asking where you find examples of the widgets you can create? Well you have a few supporting elements that can help you here. 
- We have the <a href="https://doc.sitecore.com/discover/" target="_blank" rel="nofollow">documentation site</a> which will show you walkthroughs of how to complete common activities with the SDK. 
- We also have a <a href="https://developers.sitecorecloud.io/discover-sdk/react/1.x-alpha/storybook/index.html?path=/docs/introduction--page" target="_blank" rel="nofollow">StoryBook instance</a> which will give you examples of the different components included in the SDK’s UI package. 

## Adding Static & Dynamic Widgets to Our Site
In the video, we begin by adding some widgets to our site. In the `index.tsx` page of our Next.js application, we will use the `useEffect` hook to tie our application's route to the specific page definition in the CEC. We will then use the `usePageWidgets` function to get the widget data for rendering.
We can then begin to replace parts of our site with dynamic or static components, as shown in the examples below:

- **Dynamic Components**: We can render a `div` with a loading message, and when the loading is finished, we map through the widgets returned by the `usePageWidgets` to render the appropriate widget component.

```tsx
<div>
  {isLoading && <div>Loading...</div>}
  {!isLoading && widgets.map((w) => <Widget rfkId={w} key={w} />)}
</div>
```

- **Static Components**: We can use a different component tied to a specific widget in the CEC using the `widgetID` to always render that widget at that location in the DOM.

```tsx
<RecommendationGallery rfkId="rfkid_92" productsToDisplay={6} />
```

## Implementing Global Widgets
In the video we replace the existing search bar in our Next.js Commerce site with a preview search from Discover, using the code samples provided in <a href="https://developers.sitecorecloud.io/discover-sdk/react/1.x-alpha/storybook/index.html?path=/docs/widget-templates-preview-search--left-story" target="_blank" rel="nofollow">StoryBook</a>. The samples there will give you a styled, working interactive React component ready to be inserted directly into your application. 

## Conclusion
Discover can be used as much or as little as desired in your implementations. You can use Discover for every piece of catalog data in your channels or just for individual pieces of catalog data sprinkled throughout your channels. The other fact I liked about the platform is that it is just as easy to implement Discover in an existing storefront as it is a new greenfield project. 

Finally, when using the JavaScript SDK, be sure to take advantage of all the supporting features provided, such as Storybook, and the documentation site to help you build your app as quickly as possible.

[1]: /img/blog-images/2023/Widgets.png