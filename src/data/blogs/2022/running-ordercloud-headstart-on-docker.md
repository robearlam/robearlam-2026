---
title: 'Running OrderCloud Headstart on Docker'
slug: 'running-ordercloud-headstart-on-docker'
dateCreated: '2022-02-09'
lastUpdated: '2022-02-09'
abstract: "Headstart is an example solution, showing you an opinionated method for building out a B2B shopping experience targeting your web channel, powered by Sitecore OrderCloud. You don’t have to follow Headstart when building your experiences using Sitecore OrderCloud, but it is meant show some example patterns that can be used to help you develop the functionality you need."
publishDate: '2022-02-09'
disqusId: '377ec2d6-9e18-4623-954d-17513e227c9c'
tags: ['OrderCloud','Headstart', 'Docker']
---

## What is Headstart?

Headstart is an example solution, showing you an opinionated method for building out a B2B shopping experience targeting your web channel, powered by Sitecore OrderCloud. You don’t have to follow Headstart when building your experiences using Sitecore OrderCloud, but it is meant show some example patterns that can be used to help you develop the functionality you need. Headstart is available as Open Source Software, you can find it hosted here: <a href="" target="_blank" rel="nofollow">https://github.com/ordercloud-api/headstart</a>

Headstart itself consists of three applications and a couple of data storage elements. The applications are the Buyer & Seller portals, alongside a Middleware application designed to implement functionality not natively provided through the OrderCloud API’s. The data storage elements are an Azure Cosmos Database and Azure Storage account, both are used to store data used to enrich the data persisted in OrderCloud.

## How can you run Headstart?

There are currently two ways to run the different elements required by Headstart. Historically if you wanted to run an instance of Headstart you would have to provision the Azure resources for it. Well now that isn’t required, you can run all the different Headstart elements in Containers on your local machine.

When running locally in Docker you will have containers for all of the applications instances, as well as locally emulated Azure Storage using <a href="https://github.com/Azure/Azurite" target="_blank" rel="nofollow">Azurite</a>, and locally emulated Cosmos Database using the <a href="https://docs.microsoft.com/en-us/azure/cosmos-db/local-emulator" target="_blank" rel="nofollow">Azure Cosmos DB Emulator</a>.
Being able to run all the elements locally in containers makes for a much simpler way for developers to try out Headstart without having to incur the cost associated with running the different azure resources that was required previously.

## Running Headstart in Docker
If you clone the Headstart repository to your local developer machine, then you will find all the source required to run Headstart in Docker. Included is a sample <a href="https://github.com/ordercloud-api/headstart/blob/development/docker-compose.yml" target="_blank" rel="nofollow">docker-compose.yml</a> file defining how to run the Buyer/Seller/Middleware as well as emulated Azure Storage and Cosmos DB containers.

The containers are all configured to run from Linux base images, so you’ll need to ensure that you’ve set your docker instance to run in ‘Linux container mode’, you can read about how to do that <a href="https://docs.docker.com/desktop/windows/#:~:text=Switch%20between%20Windows%20and%20Linux,Linux%20containers%20(the%20default)." target="_blank" rel="nofollow">here</a>.

If look in the root of the repository then you will see there is a <a href="https://github.com/ordercloud-api/headstart/blob/development/.env.template" target="_blank" rel="nofollow">.env.template</a>. The first thing we need to do is to duplicate this file and name it `.env`. This new file will be used to store all the environment variables that are required for Headstart to run.

Earlier I mentioned that there are three different applications that are included as part of Headstart. For you to be able to access these, you will need to update your host file to include the URL’s that they will be accessible on:

- 127.0.0.1 buyer.headstart.localhost
- 127.0.0.1 seller.headstart.localhost
- 127.0.0.1 api.headstart.localhost

We’re now at the point we need to seed our initial data into our OrderCloud instance. Luckily the Middleware application is configurated to do all the seeding for us, so what we need to do now is to start the application instances. You can do that by running the following command

```
docker-compose up -d
```

This will first build the images and then run all of them, note that the Middleware container may take longer to start than the others as it depends on the Cosmos emulator being healthy and ready to serve data.

Once the containers have all started and are reporting a `healthy` state then its time to seed our OrderCloud instance with the required data to run the Headstart applications. You can achieve this by following the <a href="https://github.com/ordercloud-api/headstart#seeding-ordercloud-data" target="_blank" rel="nofollow">Seeding OrderCloud Data</a> section of the readme. This will talk you through using <a href="https://www.postman.com/downloads/" target="_blank" rel="nofollow">Postman</a> to send the initial `seed` request to the middleware application.

This seed request will provision all the initial data items in OrderCloud like the Marketplaces, Security Profiles, & API Clients amongst other things. When the request completes it will return a series of values back that we’re going to use to update the `.env` file we created earlier.

- SELLER_CLIENT_ID
- BUYER_CLIENT_ID
- OrderCloudSettings_MiddlewareClientID
- OrderCloudSettings_MiddlewareClientSecret
- SELLER_ID (This should be set to the MarketplaceID returned)

The final setup piece we need to do is to create accounts with <a href="https://www.easypost.com/" target="_blank" rel="nofollow">EasyPost</a> & <a href="https://www.smarty.com/" target="_blank" rel="nofollow">SmartyStreets</a>. Once you have accounts with each of those you can populate the final few required values in the `.env` file

- EasyPostSettings_APIKey
- SmartyStreetSettings_AuthID
- SmartyStreetSettings_AuthToken

Now we have finished populating our `.env` file we need to restart your docker containers to make use of the new env vars, we do this by running
```
docker-compose down 
docker-compose up -d.
```
Note you can't run a `docker-compose restart` here as the containers are already running and the Middleware app will restart before Cosmos is healthy which will cause issues.


Once all of the containers have started again, we can following the steps in the <a href="https://github.com/ordercloud-api/headstart#validating-setup" target="_blank" rel="nofollow">Validating Setup</a> section of the repo to walk through generating some sample data and testing each of the application instances. Then you’re finished, you now have a functioning B2B marketplace ready for you test out Sitecore OrderCloud.

## How to use Headstart
 
I wanted to finish up by talking about the intended use cases for Headstart. As I mentioned at the start of this article Headstart is an example solution, showing you an opinionated method for building out a B2B shopping experience targeting your web channel, powered by Sitecore OrderCloud. It’s an example of one type of eCommerce site you can build using OrderCloud but it’s not the only type, OrderCloud also supports B2C, Marketplace and many other eCommerce scenarios.

So how can you leverage Headstart for your build? Well that depends on your scenario, if you’re building a B2B store focusing on the web channel then it may be a close enough fit that you can clone the Headstart repository and use that a base, removing any integrations/features you don’t need then adding any new ones that you do.

There will however be a lot of builds that aren’t an exact fit for the scenario that Headstart is built for, so how can you still leverage it in that case? Well, then the best way I see is to use this repository as a collection of example code. Once you start your implementation, you’re no doubt going to have to integrate a list of different 3rd parties for a variety of different reasons. Things like Payments, Tax, Shipping, etc are generally managed by either 3rd party systems or internal systems that you will need to integrate with. If you look through the Headstart repository you will see sample integrations with systems for features such as

- Tax
- Payments
- Shipping
- Address Validation
- Transactional Emails
- Customer Tracking
- ERP Integration

The chances are you will be using different 3rd parties to the examples you can see in Headstart, so you won’t be able to copy the code as is, however you can use the examples as a guide. They will show you key things like which API calls need to be made and at which part of the process, where in the data model the returned information should be stored, which API calls can be made to retrieve the data needed to send to the 3rd party etc. 

So just to reiterate, you may be able to use Headstart as a starter kit in some specific scenarios where you can base your solution off it. However, even if your scenario is very different it can still be a valuable collection of examples to guide you in the best way to build out your implementation. 
