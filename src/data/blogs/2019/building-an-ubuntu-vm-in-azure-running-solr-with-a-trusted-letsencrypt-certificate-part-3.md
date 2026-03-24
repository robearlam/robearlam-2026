---
title: 'Building an Ubuntu VM in Azure running Solr, with a trusted LetsEncrypt certificate - Part 3'
slug: 'building-an-ubuntu-vm-in-azure-running-solr-with-a-trusted-letsencrypt-certificate-part-3'
dateCreated: '2020-08-31'
lastUpdated: '2020-09-03'
abstract: "So this is part 3 in my series walking you through how to setup an Ubuntu VM in Azure running Solr secured using LetsEncrypt. In the first two parts we used the Azure CLI to create the VM, we installed Java and Solr then finally opened port 8983 so we could access the Solr dashboard remotely. In this post we're going use LetsEncrypt to generate a certficate to allow us to secure our communication with Solr over HTTPS"
publishDate: '2019-03-04'
disqusId: 'b4c8967e-a0ff-4915-8f40-2fd9283470a5'
tags: ['Azure','Solr','Ubuntu','LetsEncrypt']
---
So this is part 3 in my series walking you through how to setup an Ubuntu VM in Azure running Solr secured using LetsEncrypt. In the first two parts we used the <a href="https://docs.microsoft.com/en-us/cli/azure/?view=azure-cli-latest" rel="noopener" target="_blank">Azure CLI</a> to create the VM, we installed Java and Solr then finally opened port 8983 so we could access the Solr dashboard remotely. In this post we're going use <a href="https://letsencrypt.org/" rel="noopener" target="_blank">LetsEncrypt</a> to generate a certficate to allow us to secure our communication with Solr over HTTPS.

You can find the other posts in this series here:
- <a href="/blog/building-an-ubuntu-vm-in-azure-running-solr-with-a-trusted-letsencrypt-certificate-part-1">Part 1: Creating the VM in Azure</a>
- <a href="/blog/building-an-ubuntu-vm-in-azure-running-solr-with-a-trusted-letsencrypt-certificate-part-2">Part 2: Installing Java & Solr</a>
- <a href="/blog/building-an-ubuntu-vm-in-azure-running-solr-with-a-trusted-letsencrypt-certificate-part-3">Part 3: Setting up the LetsEncrypt cert in Solr</a>
- <a href="/blog/building-an-ubuntu-vm-in-azure-running-solr-with-a-trusted-letsencrypt-certificate-part-4">Part 4: Setting up the Sitecore indexes</a>

## LetsEncrypt
If you haven't heard of LetsEncrypt, its an awesome service that you should read about. If you take a look over their site they describe themselves as follows.

> Let’s Encrypt is a free, automated, and open certificate authority (CA), run for the public’s benefit. It is a service provided by the Internet Security Research Group (ISRG).
> We give people the digital certificates they need in order to enable HTTPS (SSL/TLS) for websites, for free, in the most user-friendly way we can. We do this because we want to create a more secure and privacy-respecting Web.

It's a great service and anything that helps us move towards a more secure internet is a big win in my book. But enough of the sales pitch, lets put it to work!

## Generating the Certificate
So before we can generate the certificate we need to perform a few setup tasks. The first thing we need to is to install <a href="https://certbot.eff.org/" target="_blank" rel="noopener">Certbot</a>, this is what we will use to perform the generation of the certificate. So first we need to run the following two commands

```
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
```

Much like we did when we installed Java in the previous post, here we added the repository where Certbot is stored then we update the package manager to include the new repository. Next we want to actually install certbot and we do that with the following command:

```
sudo apt install certbot
```

Ok, now we have Certbot installed, but before we can generate the certificate we need to do one final setup task. When Certbot runs it calls an external service which then needs to communicate back with Certbot over port 80, if this doesn't work the certification generation will fail. So much like we did in the previous post we need to open port 80 in the Network Security Group and we can do this with the following command:

```
az network nsg rule create \
  -g SitecoreExperienceCommerce \
  -n "Allow Web Port" \
  --nsg-name Ubuntu-SolrNSG \
  --access Allow \
  --direction Inbound \
  --priority 110 \
  --destination-port-ranges 80
```
So lets take a look at this command line by line
- `az network nsg rule create`: This line is pretty straight forward, we're executing the Azure CLI and telling it we want to create a new Network Security Group Rule.
- `-g SitecoreExperienceCommerce`: Here we're specifying the Azure Resource Group that was created in the previous post.
- `-n "Allow Web Port"`: Now we give the rule a friendly name so we'll know what its for if we look back at it in the future.
- `--nsg-name Ubuntu-SolrNSG`: This parameter lets us specify the name of the Network Security Group that we want to add this rule to. Note that the Network Security Group is created for us automatically when we created the VM in the previous post.
- `--access Allow`: Here we say that this is an **allow** rule that we're creating, i.e. you can choose to **allow** or **deny** access, in our case we want to let traffic through on that port
- `--direction Inbound`: States that this rule applies to traffic attempting to access the VM, instead of traffic leaving the VM.
- `--priority 110`: The priortity value allows you set which rules have precidence, in Azure the lower value has priority. Note we have set a different priority than last time as Azue won't allow you to set multiple rules with the same priority with the same direction.
- `--destination-port-ranges 80`: Here we're setting which port we want to enable, in this case the default web port 80.

After the command completes we get a successful response back which looks like the following:

```
{
  "access": "Allow",
  "description": null,
  "destinationAddressPrefix": "*",
  "destinationAddressPrefixes": [],
  "destinationApplicationSecurityGroups": null,
  "destinationPortRange": "80",
  "destinationPortRanges": [],
  "direction": "Inbound",
  "etag": "W/\"XXXXX\"",
  "id": "/subscriptions/XXXXX/resourceGroups/SitecoreExperienceCommerce/providers/Microsoft.Network/networkSecurityGroups/Ubuntu-SolrNSG/securityRules/Allow Web Port",
  "name": "Allow Web Port",
  "priority": 110,
  "protocol": "*",
  "provisioningState": "Succeeded",
  "resourceGroup": "SitecoreExperienceCommerce",
  "sourceAddressPrefix": "*",
  "sourceAddressPrefixes": [],
  "sourceApplicationSecurityGroups": null,
  "sourcePortRange": "*",
  "sourcePortRanges": [],
  "type": "Microsoft.Network/networkSecurityGroups/securityRules"
}
```

Ok, so thats all of the setup tasks completed now we're finally ready to generate the certificate. We do that with the following command (replace the -d parameter with the domain for your Solr instance):

```
sudo certbot certonly --standalone -d XXXXX.australiaeast.cloudapp.azure.com
```

> Note if you have any other applications running on port 80 (i.e. Apache) then you will need to stop them to allow the certificate generation to proceed.

Once you execute this you'll be asked for your email address to be reminded about renewals, you'll also have to accept the LetsEncypt terms. Then it should run through and give you a completion message like the following:

```
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Plugins selected: Authenticator standalone, Installer None
Obtaining a new certificate
Performing the following challenges:
http-01 challenge for XXXXX.australiaeast.cloudapp.azure.com
Waiting for verification...
Cleaning up challenges

IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at:
   /etc/letsencrypt/live/XXXXX.australiaeast.cloudapp.azure.com/fullchain.pem
   Your key file has been saved at:
   /etc/letsencrypt/live/XXXXX.australiaeast.cloudapp.azure.com/privkey.pem
   Your cert will expire on 2019-06-01. To obtain a new or tweaked
   version of this certificate in the future, simply run certbot
   again. To non-interactively renew *all* of your certificates, run
   "certbot renew"
 - If you like Certbot, please consider supporting our work by:

   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
   Donating to EFF:                    https://eff.org/donate-le
```

So looking at this we can see that our certificates have been generated in the following location:

```
/etc/letsencrypt/live/XXXXX.australiaeast.cloudapp.azure.com/
```
However if you try to browse into the folder to view the certificates you'll recieve and error stating `-bash: cd: /etc/letsencrypt/live/XXXXX.australiaeast.cloudapp.azure.com/: Permission denied`. This is because as the folder was created by Certbot we currently don't have access to view it. You can fix that by setting the permissions on the folder with the following command:

```
sudo chmod 755 /etc/letsencrypt/live
```
Now we can browse into the folder and see that four certificates have been generated
- cert.pem
- chain.pem
- fullchain.pem
- privkey.pem

Now that we have the certificates created we need to convert them into a format that Solr can understand, then register Solr to use them. 

## Converting the certificate to the correct format

So we've generated the certificates in the previous step, however Certbot creates them in **PEM** format which Solr doesn't like. So first up we need to convert them to PKCS12 format and we do that with the following commands:

```
echo "cat /etc/letsencrypt/live/XXXXX.australiaeast.cloudapp.azure.com/*.pem > fullcert.pem" | sudo sh
sudo openssl pkcs12 -export -out fullchain.pkcs12 -in fullcert.pem
```
Now what we're doing here is firstly concatenating the certificate chain generated by LetsEncrypt into a single **PEM** format certificate, we're then taking that newly concatenated certificate and using openssl to generate a new certificate in the PKCS12 format that we need. The second script will also prompt you to enter a password for the generated certificate that we will use again later on.

Next up we need to generate a Java JKS Keystore that Solr will use to secure itself. Now the interesting think with JKS Keystores is that you can't create an empty keystore so we're going to generate a new keystore containing a temp cert, we'll then delete that temp cert and insert the PKCS format cert that we just created. We do this by running the following two commands

```
sudo keytool -genkey -keyalg RSA -alias tempCert -keystore solrKeystore.ks
sudo keytool -delete -alias tempCert -keystore solrKeystore.ks
```

The first command will ask you for a password for the keystore, and we'll use this password in the second command when we delete our temporary certificate. So now we have our empty JKS Keystore and we need to add our PKCS certficate that we generated previously to it using this command:

```
sudo keytool -v -importkeystore -srckeystore fullchain.pkcs12 -destkeystore solrKeystore.ks -deststoretype JKS
```

You'll be prompted for the password for both the Keystore and the Cert that we created previously, but once complete we now have our JKS keystore with our PKCS certificate stored inside it, next up is getting Solr to make use of this keystore.

## Getting Solr to use the generated certificates
You can see the guide for how to secure Solr on the official site <a href="https://lucene.apache.org/solr/guide/7_2/enabling-ssl.html" rel="noopener" target="_blank">here</a>, we've already done the certificate creation so we can skip straight to the section titled `Set Common SSL-Related System Properties`.

What we need to do is to edit the configuration file that is used to control how Solr functions and you can find this here: `/etc/default/solr.in.sh`. So we're going to use the inbuilt **nano** editor to set the values, you open it with the following command:

```
sudo nano /etc/default/solr.in.sh
```

Once the file is open you want to scroll down to find the various SSL settings and populate them as so (note that we've also removed the leading # from each line so they're no longer commented out):

```
SOLR_SSL_KEY_STORE=/etc/letsencrypt/live/XXXXX.australiaeast.cloudapp.azure.com/solrKeystore.ks
SOLR_SSL_KEY_STORE_PASSWORD=XXXXX
SOLR_SSL_KEY_STORE_TYPE=JKS
SOLR_SSL_TRUST_STORE=/etc/letsencrypt/live/XXXXX.australiaeast.cloudapp.azure.com/solrKeystore.ks
SOLR_SSL_TRUST_STORE_PASSWORD=XXXXX
SOLR_SSL_TRUST_STORE_TYPE=JKS
SOLR_SSL_NEED_CLIENT_AUTH=false
```

Once you've finished editing the file you can press Ctrl-X to exit the editor making sure to save the changes when prompted. Now we need to restart the solr service to make it pickup the changes using the following commands:

```
sudo service solr stop
sudo service solr start
```

Now we're done, we can head over to the browser and access the same URL as before but this time over HTTPS instead of HTTP and you will see that you're traffic is now securing using the LetsEncrypt certifcate that we generated!

![Java Prompt 1][1]

## Conclusion

So we had to run a few commands there, but all in all it wasn't too hard to generate the certificate, convert it, then finally register it to work with Solr. Now when setting up Solr previously i've used <a href="https://twitter.com/jermdavis" rel="noopener" target="_blank">Jeremy Davis</a> script which you can find <a href="https://jermdavis.wordpress.com/2017/10/30/low-effort-solr-installs/" rel="noopener" target="_blank">here</a> and that has always worked fine for development, however that works with a self-signed certificate which you shouldn't use in a production environment. The main advantage to using LetsEncrypt is that you end up with a **legitimate** certificate from a **legitimate** Certificate Authority and it didn't cost us a penny.

One main thing to remember when using LetsEncrypt though is that the certificates that are generated only have a three month expiry. Certbot has an auto-renewal feature built in, but if you're using this in production you would have to write scripts to automate the format conversion after the renewal happens.

Another thing to remember if you want to set this up for a production instance is that we haven't covered hardening of the SOLR instance at all in this series. You can find the documentation for how to complete that <a href="https://lucene.apache.org/solr/guide/7_2/taking-solr-to-production.html" rel="noopener" target="_blank">here</a>.

So now we have our secured Solr instance up and running, in the next and final post of this series i'll walk you through setting up the cores ready for Sitecore to index its data!

[1]: /img/blog-images/cert.png

