---
title: 'Using VSCode to debug a .NET Core application running inside a Docker container'
slug: 'using-vscode-to-debug-a-netcore-application-running-inside-a-Docker-container'
dateCreated: '2020-08-31'
lastUpdated: '2020-09-03'
abstract: "I have recently been creating a new .NET Core application, which I've been running inside of a Docker container. I've been creating this using VSCode so had to spend some time linking the IDE to the container so that I could use the debugging features. I wanted to document the process here for anyone else who wants to work with this setup"
publishDate: '2019-05-24'
disqusId: '0a98884b-a2af-4926-94cb-685810eaa2a3'
tags: ['.NET Core','Docker','Docker-Compose','VSCode','Debugging']
---
I have recently been creating a new .NET Core application, which I've been running inside of a Docker container. I've been creating this using VSCode so had to spend some time linking the IDE to the container so that I could use the debugging features. I wanted to document the process here for anyone else who wants to work with this setup.

## Setting up the application

For this example, I’m going to use the sample .Net Core application that Microsoft use on their documentation site <a href="https://docs.microsoft.com/en-us/dotnet/core/docker/build-container" target="_blank" rel="noopener">here</a>. You can follow that document till the end of the **Create .NET Core app** section and you’ll then have the application ready to be loaded into a container. Don’t follow the next sections covering **Publishing .NET Core app** and **Create the Dockerfile** as I’m going to doing it slight differently in the following sections below.

## Setting up the Dockerfile
So first up we’re going to create the Dockerfile used to build our container. Now in the Microsoft docs example above, they show performing a manual publish of the .NET Core project, then packaging the output into the container. I don’t like this approach though as it means you need to install the .NET Core SDK on your host machine, and one of the joys of working with Docker is that it allows you to keep your host machine clean. No instead we’re going to create a **multi-stage** Dockerfile to first build our solution for us, and then to package it into the container image.

```
FROM microsoft/dotnet:2.2-sdk AS build
WORKDIR /app

# copy csproj and restore as distinct layers
COPY *.sln .
COPY myapp/*.csproj ./myapp/
RUN dotnet restore

# copy everything else and build app
COPY myapp/. ./myapp/
WORKDIR /app/myapp
RUN dotnet publish -c Debug -o out

FROM microsoft/dotnet:2.2-aspnetcore-runtime AS runtime
WORKDIR /app
COPY --from=build /app/myapp/out ./
RUN apt-get update 
RUN apt-get install -y --no-install-recommends apt-utils 
RUN apt-get install -y curl unzip procps
RUN curl -sSL https://aka.ms/getvsdbgsh | bash /dev/stdin -v latest -l /publish/vsdbg;
ENTRYPOINT ["dotnet", "myapp.dll"]
```

If you take a look at the Dockerfile you can see it performs a few actions, in the first stage we

1. Pull in the .NET Core SDK image.
2. Copy the project file into the stage.
3. Perform a dotnet restore to load the projects dependencies.
4. Copy in the files from the projects.
5. Perform a dotnet publish to a directory called _out_.

At this point we've got a published version of the application and we're ready to build the final stage which is going to be used for our image. Note that it is instead built against the .NET Core Runtime image instead of the SDK image. This is because we've already built the application in the previous stage so we don’t need to include the extra features the SDK image introduces, all we need are the Runtime features - allowing us to build a much smaller image. The final stage performs the following steps:

1. Pull in the .NET Core Runtime image.
2. Copy the built application files from the previous stage.
3. Updates the image then installs some extra packages (We’ll discuss this more in the next section).
4. Sets the EntryPoint for the image.

At this point we can use this **Dockerfile** to build the image, using the following command

```
docker build -t myapp .
```

Here we're executing the docker build command, we're passing in the **-t** switch to give the image a name of **myapp** and finally, the **.** path tells the command to execute at the current location.

Now we have a built image, we can create a container based on this image using the following command.

```
docker run myapp
```

So now we have a running docker container for our image, but how can we attach a debugger to this and the step through the code? Well for that we’re going to need to configure VSCode.

## Configuring VSCode
So in order to connect to the Docker container we need to install a couple of packages into the image at build time, this is what we performed in **step 3** of the **final stage** above that I said I would come back to. What we’re actually doing here is installing a couple of dependencies that allow us to install **VSDbg**, which is the **Visual Studio Remote Debugger**. Installing this allows VSCode to connect to the container and debug the code running there.

In order for VSCode to be able to connect to the container we need to edit its **launch.json** file which you will find in your **.vscode** folder. You can see the one I have used here:

```
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": ".NET Core Docker Attach",
            "type": "coreclr",
            "request": "attach",
            "processId": "${command:pickRemoteProcess}",
            "sourceFileMap": {
                "/app": "${workspaceFolder}"
            },
            "pipeTransport": {
                "pipeProgram": "docker",
                "pipeArgs": [ "exec", "-i", "myapp" ],
                "debuggerPath": "/publish/vsdbg/vsdbg",
                "pipeCwd": "${workspaceRoot}",
                "quoteArgs": false
            }
        }
    ]
}
```

Two of the key parts  are:

* **sourceFileMap**: This section is used to map the application in the container to the location of your source on the host machine.
* **pipeArgs**: This line tells VSCode how to connect to the container, in this case it’s going to run an exec command in **interactive** mode against a container named myapp.

So the last part that I want to do is to wrap the creation of this container up into a **docker-compose** action. This makes it very simple to control things like the **Container Name**, which means I wont have to update my launch.json everytime I want to connect to a new container.

## Setting up Docker-Compose
<a href="https://docs.docker.com/compose/" target="_blank">Docker-Compose</a> files are used to control how docker containers are created. They give you a way to store and version control the settings that are used to generate containers. In this case it will be a very simple docker-compose file as the only element we need to control here is the container name. You can see the docker-compose.yml contents I used here:

```
version: "3"
services:
    myapp:
        container_name: myapp
        build:
          context: .
```

You can see above that I only have a single **service** in my **docker-compose.yml** file. We specify the name to be the same name that was set in the **launch.json** file earlier and then we don’t actually point to an image, in this case we’re giving the **build** command. We can execute this docker-compose file with one simple command:

```
docker-compose up
```

This will instruct docker to go and build my image, then create a container based on the newly built image with the container name **myapp**.

Once the container is running we can then simply hit **F5** in vscode, choose the process and begin debugging our application, as easy as that!

## Credits

Shout out to <a href="https://twitter.com/slace" target="_blank" rel="noopener">Aaron Powell</a>, for his <a href="https://www.aaron-powell.com/posts/2019-04-04-debugging-dotnet-in-docker-with-vscode/" target="_blank" rel="noopener">blog post</a> that helped me get started with this!


