---
title: 'Building an Ubuntu VM in Azure running Solr, with a trusted LetsEncrypt certificate - Part 1'
slug: 'building-an-ubuntu-vm-in-azure-running-solr-with-a-trusted-letsencrypt-certificate-part-1'
dateCreated: '2020-08-31'
lastUpdated: '2020-09-03'
abstract: "So this week I've been building a Sitecore Experience Commerce deployment in Azure. This is using mostly PaaS based resources, so WebApps, Azure SQL and all that jazz. However I wanted to try to keep the spend down a bit and the easiest way to achieve that is to switch out Azure Search for Solr"
publishDate: '2019-03-01'
disqusId: '6c371c92-1bde-4ae8-856a-6a6521aa229e'
tags: ['Azure','Solr','Ubuntu','LetsEncrypt']
---
So this week I've been building a Sitecore Experience Commerce deployment in Azure. This is using mostly PaaS based resources, so WebApps, Azure SQL and all that jazz. However I wanted to try to keep the spend down a bit and the easiest way to achieve that is to switch out Azure Search for Solr.

I’ve been using Linux more and more in the past few years. Starting with playing around with WSL which seemed to get me hooked, so I figured I might as well attempt to build out an Ubuntu VM to set this up on.

It turned out that this was mostly fairly straightforward to do, except for wresting with getting Solr to recognise the LetsEncrypt cert. So I figured I would document the process here in case anyone else has a need to do the same.

This was going to be a bit too large for a single blog post, so I've broken it down into a few posts:
- <a href="/blog/building-an-ubuntu-vm-in-azure-running-solr-with-a-trusted-letsencrypt-certificate-part-1">Part 1: Creating the VM in Azure</a>
- <a href="/blog/building-an-ubuntu-vm-in-azure-running-solr-with-a-trusted-letsencrypt-certificate-part-2">Part 2: Installing Java & Solr</a>
- <a href="/blog/building-an-ubuntu-vm-in-azure-running-solr-with-a-trusted-letsencrypt-certificate-part-3">Part 3: Setting up the LetsEncrypt cert in Solr</a>
- <a href="/blog/building-an-ubuntu-vm-in-azure-running-solr-with-a-trusted-letsencrypt-certificate-part-4">Part 4: Setting up the Sitecore indexes</a>

## Building the VM
So the first thing we need to do is to build the VM in Azure. It turns out this is super easy and we can complete it in a couple of commands using the <a href="https://docs.microsoft.com/en-us/cli/azure/?view=azure-cli-latest" rel="noopener">Azure CLI</a>. The first thing we need to do is to authenticate, and thats a simple as running:

```
az login
```

Now we're authenticated, all it takes is a single command to create the VM. This is the command I used: 

```
az vm create \
    -g "SitecoreExperienceCommerce" \
    -n "Ubuntu-Solr" \
    -l "australiaeast" \
    --image UbuntuLTS \
    --admin-username "solr" \
    --generate-ssh-keys \
    --public-ip-address-dns-name "XXXXX" \
    --size Standard_B2S \
    --os-disk-size-gb 32 \
    --storage-sku Standard_LRS
```
So lets break down what it's doing, line by line:

- `az vm create`: This line is pretty straight forward, we're excuting the Azure CLI and stating we want to create a new VM.
- `-g "SitecoreExperienceCommerce"`: Here we're specifying the name of the resource group we want to set this VM inside of.
- `-n "Ubuntu-Solr"`: Here we're giving the VM a name.
- `-l "australiaeast"`: This sets which Azure data centre the VM will be created, I've chosen Sydney.
- `--image UbuntuLTS`: Now we're choosing the image to use to build the VM, in this case we're going to use Ubuntu Long Term Support
- `--admin-username "solr"`: This parameter specifies the name of the admin user for the machine.
- `--generate-ssh-keys`: This parameter will add the ssh keys for the machine running this command to the VM, meaning you will have access as soon as the VM is instantiated.
- `--public-ip-address-dns-name "XXXXX"`: This parameter will ensure a public IP is assigned to this machine and lets us choose a DNS name we'll use to connect.
- `--size Standard_B2S`: Now we're going to choose the machine size, in this case Standard_B2S which will give us 2xCPU and 8GB memory.
- `--os-disk-size-gb 32`: This parameter lets us choose the size of the primary HD, I chose 32gb.
- `--storage-sku Standard_LRS`: Finally this parameter lets us choose how the HD data is replicated for Disaster Recovery.

You execute this command, and then you a successful response telling you that the command completed and VM is has been created

```
{
  "fqdns": "XXXXX.australiaeast.cloudapp.azure.com",
  "id": "/subscriptions/XXXXX/resourceGroups/SitecoreExperienceCommerce/providers/Microsoft.Compute/virtualMachines/Ubuntu-Solr",
  "location": "australiaeast",
  "macAddress": "XXXXX",
  "powerState": "VM running",
  "privateIpAddress": "XXXXX",
  "publicIpAddress": "XXXXX",
  "resourceGroup": "SitecoreExperienceCommerce",
  "zones": ""
}
```
Now as we used the `generate-ssh-keys` parameter, all we need to do to test this is to attempt to open an SSH connection using the DNS & Username we specified. We can do this by using the following command:

```
ssh solr@XXXXX.australiaeast.cloudapp.azure.com
```

And there you have it, we're now securely connected to the remote machine

```
Welcome to Ubuntu 18.04.2 LTS (GNU/Linux 4.15.0-1037-azure x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  System information as of Fri Mar  1 23:43:40 UTC 2019

  System load:  0.08              Processes:           114
  Usage of /:   3.9% of 30.84GB   Users logged in:     0
  Memory usage: 7%                IP address for eth0: XXXXX
  Swap usage:   0%

  Get cloud support with Ubuntu Advantage Cloud Guest:
    http://www.ubuntu.com/business/services/cloud

0 packages can be updated.
0 updates are security updates.



The programs included with the Ubuntu system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Ubuntu comes with ABSOLUTELY NO WARRANTY, to the extent permitted by
applicable law.

To run a command as administrator (user "root"), use "sudo <command>".
See "man sudo_root" for details.

solr@Ubuntu-Solr:~$ 
```
## Conclusion
That's it, in three commands we managed to log into the <a href="https://docs.microsoft.com/en-us/cli/azure/?view=azure-cli-latest" rel="noopener">Azure CLI</a>, stand up a brand new Ubuntu VM and SSH into it ready to continue building out its functionality.

The next post in this series will handle installing Java and Solr on the machine.

Thanks for reading!

