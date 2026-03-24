---
title: 'Introducing the Sitecore Discover JavaScript SDK - Part 1 Events'
slug: 'introducing-the-sitecore-discover-javascript-sdk-part-1-events'
dateCreated: '2023-05-04'
lastUpdated: '2023-05-04'
abstract: "In this two-part blog series, I'll be introducing you to a brand-new JavaScript SDK for Sitecore Discover. In this first part, we'll dive into the different implementation options for Sitecore Discover, explore the JavaScript SDK, and discuss its eventing model."
publishDate: '2023-05-04'
disqusId: '0782dba9-5174-4f3b-82a1-8353fbd54e95'
tags: ['Sitecore Discover','Nextjs', 'React']
---

## Introducing the Sitecore Discover JavaScript SDK - Part 1 Events

In this two-part blog series, I'll be introducing you to a brand-new JavaScript SDK for Sitecore Discover. In this first part, we'll dive into the different implementation options for Sitecore Discover, explore the JavaScript SDK, and discuss its eventing model.
This blog is the accompaniment for the YouTube video highlighting the same features. You can watch the video below:

<div class="video-container"><iframe src="https://www.youtube.com/embed/_3EJWTU5UtI" title="Introducing the Sitecore Discover JS SDK - Part 1 - Events" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>

## Implementation Options

When working with Sitecore Discover there are three main integration options:

- **Hosted Pages:** Low developer effort but limited feature set; best for simple implementations where a merchandiser can configure everything from the Sitecore Discover Customer Engagement Center (CEC). Requires a reverse proxy or subdomain to serve pages directly from Discover.
- **Direct API Integration:** High developer effort but full feature set; best for more complex requirements where developers manually call APIs to create custom commerce experiences.
- **JavaScript SDK (our focus in this seres):** Moderate developer effort with full feature set; best for React-based applications and designed for a faster development process with boilerplate code and API calls automated for you. The SDK comprises two main elements, the eventing elements from the <a href="https://www.npmjs.com/package/@sitecore-discover/react" target="_blank" rel="nofollow">React NPM package</a>, and the component elements from the <a href="https://www.npmjs.com/package/@sitecore-discover/ui" target="_blank" rel="nofollow">UI NPM package</a>.


## JavaScript SDK Overview

The JavaScript SDK for Sitecore Discover is a React library, making it suitable for React-based applications and frameworks like Next.js. Don't worry if you're using another JavaScript library or language, though – you can still choose from the other integration options mentioned earlier.

Some key features of the SDK:

- Complete control over catalog experience design
- Flexibility in distribution of responsibilities between developers and merchandisers
- Eventing &amp; Custom Component models

## Eventing Model

To start with, we'll focus on the Eventing Model. Eventing is crucial for collecting valuable information about user interactions on your site, such as page views, product details, and cart actions. This data is then used by Sitecore Discover's AI to provide personalized product experiences for users.

Several events are pre-wired in the SDK, but others require manual wiring. The good news is that once you've integrated the SDK and wired up your events, Sitecore Discover automatically begins collecting data for use in its AI-powered recommendations.

In the second part of this series, we'll explore the Component Model, which allows you to connect your event data with personalized product experiences.


## Wiring up Events for Sitecore Discover

To use the SDK, you'll need to wrap your application in a `WidgetProvider`, which serves as the main entry point. After doing so you can begin to connect the events, some of which are automatically wired up by the SDK, while others require manual configuration. Here's a breakdown of which events fall into each category:

**Automatically Wired:**

- trackAppearEvent                  
- trackSearchResultsClickEvent     
- trackSearchResultsFacetClickEvent 
- trackRecommendationClick         
- trackPreviewSearchClick          
- trackPageViewEvent            

**Manually Wired:**

- trackAddToCartEvent
- trackOrderConfirmEvent
- trackPDPViewEvent
- trackStatusCartEvent
- trackUserLoginEvent

For the manual events, you'll need to call the corresponding event function provided by the SDK and pass in any required event data (for example, the product SKU).

## Customizing Event Tracking

Below you can see a couple of examples of how to wire up the manual events, we’re going to use the Product Details Page View and Add to cart events as examples…

### Product Detail Page View
To wire up the Product Details Page View event you need to follow a couple of steps:
- Import the `useEffect()` hook from React and the `trackPDPView` function from the Discover SDK.
- Call the `trackPDPView` function with the product's SKU inside the `useEffect` hook. An example of this is 

```JS
useEffect(() => {
    trackPDPViewEvent(product.id)
}, [product.id])
```


### Add-to-cart Action
To wire up the Add to cart Action you need to follow a couple of steps:
- Import the `useRouter()` hook from Next.js and the `trackCartEvent` function from the SDK.
- Modify the function responsible for handling the add-to-cart action in your application by calling the `trackCartEvent()` function with the product's SKU, price, and quantity after the original add-to-cart code executes.

```JS
const { asPath } = useRouter()
const eventModel: ProductEventModel[] = [
    {
        sku: product.id,
        quantity: 1,
        price: product.price.value,
    },
]
trackAddToCartEvent(eventModel, asPath)
```


By wiring these events, you'll start collecting valuable user interaction data that Sitecore Discover can use to generate personalized product recommendations.

## Conclusion
That brings us to the end of part one of this series. Be sure to check out part two where we'll look into the component model, and how you can use the event data we've collected to create contextual product interactions in your storefront. Thanks for reading!
