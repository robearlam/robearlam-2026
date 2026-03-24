---
title: 'Working with the Commerce Engine & Docker in Sitecore Experience Commerce 10.1'
slug: 'working-with-the-commerce-engine-docker-in-sitecore-experience-commerce-10-1'
dateCreated: '2021-05-13'
lastUpdated: '2021-05-13'
abstract: "Recently got to work with a developer who was new to working with Sitecore Experience Commerce on Docker. Now we have a lot of examples for how to work with Sitecore Experience Platform with Docker, things like"
publishDate: '2021-05-13'
disqusId: '35cff85d-ec6a-4a74-b60d-c74901d05c97'
tags: ['Commerce','Docker', 'Sitecore']
---

Recently got to work with a developer who was new to working with Sitecore Experience Commerce on Docker. Now we have a lot of examples for how to work with Sitecore Experience Platform with Docker, things like the <a href="https://github.com/Sitecore/MVP-Site" target="_blank" rel="nofollow">MVP Site</a> build that I've talked about previously. 

When it comes to Experience Commerce, we have the installation guide showing people how to get the application running on a local developer machine, but what I quickly realised though, was that we didn’t have any good examples for how to containerise a custom solution that builds out the Commerce Engine!

So, I decided to put one together to work as a simple example for how to configure this. I started off by trying to find a solution that would be a good fit, and I quickly decided the `Customer.Sample.Solution.sln` that ships with XC on-prem would be a great fit for this.

## Modifying the solution
The first thing I did was to rename the solution to ` XCDocker.Sample.Solution` so people could tell it apart from the original. Next I imported the `docker-compose` and `.env` files provided with the ` Sitecore.Commerce.Container.SDK`. This gave me a solution that would stand up the out of the box XC 10.1 docker architecture – I chose `XC1-CXA` topology as I wanted to test Storefront as well.

Next up I need to start building this version of the engine, instead of using the one that Sitecore issue. I had two choices here, either start with a fresh container, or layer this engine code on top of the engine image that Sitecore issue. Now the first option seemed correct at first as when you build the engine, you build the full application. However, the engine image issued by Sitecore doesn’t just contain the engine code, it also containers things like the LogViewer EntryPoint, if I started a container a fresh I would need to add these in myself, so this made it a simple choice to go with my second option - layer my engine code on top of the engine image that Sitecore issues.

## Creating the Dockerfile
Next I had to actually create the `Dockerfile`, the plan as always is to setup a `multi-stage build`, meaning we use a different image at build compared to at runtime. This means we can keep the runtime image as lean as possible.

Looking into the Dockerfile here, you can see that we build the image first before taking the output asset and layering that on top of the Sitecore engine image. 
```
# Args
ARG BUILD_IMAGE
ARG RUNTIME_IMAGE

# Build Stage
FROM ${BUILD_IMAGE} as Build
WORKDIR  /app

COPY ./nuget.config ./nuget.config
COPY ./XCDocker.Sample.Solution.sln ./XCDocker.Sample.Solution.sln
COPY ./src/Plugin.Sample.AdventureWorks/Plugin.Sample.AdventureWorks.csproj ./src/Plugin.Sample.AdventureWorks/Plugin.Sample.AdventureWorks.csproj
COPY ./src/Plugin.Sample.Habitat/Plugin.Sample.Habitat.csproj ./src/Plugin.Sample.Habitat/Plugin.Sample.Habitat.csproj
COPY ./src/Plugin.Sample.Payments.Braintree/Plugin.Sample.Payments.Braintree.csproj ./src/Plugin.Sample.Payments.Braintree/Plugin.Sample.Payments.Braintree.csproj
COPY ./src/Sitecore.Commerce.Engine/Sitecore.Commerce.Engine.csproj ./src/Sitecore.Commerce.Engine/Sitecore.Commerce.Engine.csproj
RUN dotnet restore ./XCDocker.Sample.Solution.sln

COPY ./src ./src
RUN dotnet build ./XCDocker.Sample.Solution.sln -c Debug
RUN dotnet publish ./src/Sitecore.Commerce.Engine/Sitecore.Commerce.Engine.csproj -o /app/publish -c Debug

# Runtime Stage
FROM ${RUNTIME_IMAGE} as Runtime
WORKDIR C:/engine
COPY --from=Build /app/publish ./

USER ContainerUser
EXPOSE 5000

ENTRYPOINT ["C:\\LogMonitor\\LogMonitor.exe", "dotnet.exe", "Sitecore.Commerce.Engine.dll"]
```
Finally, we also use the standard `ENTRYPOINT` provided by the Sitecore engine image, as I mentioned above one of the main advantages from not rolling our own runtime image from scratch.

## Modifying the Docker-Compose
Now we have the build image, we need to update the docker-compose to use these new images. The Docker-Compose that I added to the solution was the standard `xc1-cxa` compose file issued by Sitecore. I did modify the volumes to be relative, but nothing else was changed.

I wanted to keep this file as close as possible to the version issued by Sitecore, so to do this I added my changes to a ` docker-compose.override.yml`. This is used to override values from within the `docker-compose`.

```
version: "2.4"
services:

  engineBuild:
    container_name: xc-engine-custom
    image: xc-engine-custom:latest
    build:
      context: ./
      dockerfile: ./Docker/build/engine/Dockerfile
      args:
        BUILD_IMAGE: ${ENGINE_BUILD_IMAGE}
        RUNTIME_IMAGE: ${XC_SITECORE_DOCKER_REGISTRY}sitecore-xc-engine:${XC_PACKAGES_TAG}
    scale: 0

  engine-authoring:
    image: xc-engine-custom:latest
    depends_on:
      - engineBuild

  engine-shops:
    image: xc-engine-custom:latest
    depends_on:
      - engineBuild

  engine-minions:
    image: xc-engine-custom:latest
    depends_on:
      - engineBuild

  engine-ops:
    image: xc-engine-custom:latest
    depends_on:
      - engineBuild    
```

Looking at the file above you can see I’ve first of all introduced the new service used to build the engine. I then also changed the 4 existing engine services to use the custom image instead, and also introduced a dependency on the new engine build service.

Now this setup is complete, I can now run a `docker-compose build` to create the new images. Once the build is complete, next time I start this topology up my new engine image will be used instead of the standard one from Sitecore.

## Conclusion
Hopefully this showed how easy it is get a customer Sitecore Commerce Engine running inside of a docker container. 
If you want to see all of this together then you can see it in this <a href="https://github.com/robearlam/XCDocker.Sample.Solution" target="_blank" rel="nofollow">GitHub Repository</a>.

I purposely kept this example as simple as possible, just wrapping the existing `Customer.Sample.Solution` inside of a docker container. I haven’t edited the solution to follow Helix guidelines or handled hot code refreshes like exist with XM. In a solution with a large number of projects you would also want to use robocopy to move the `csproj` files in the `dockerfile` as well, but for this small amount I found this was more readable. Hopefully this should be enough to get people started working with Sitecore Experience Commerce in Docker!
