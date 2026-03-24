---
title: 'Running HashiCorp Vault on WSL2 secured with LetsEncrypt'
slug: 'running-hashicorp-vault-on-wsl2-secured-with-letsencrypt'
dateCreated: '2020-08-31'
lastUpdated: '2020-09-03'
abstract: "I've recently being getting my head around HashiCorp Vault. A great product for securing your secrets, certificates, passwords and much more besides. Vault can be enabled in 'dev' mode to allow you to test out its features, but I wanted to use this on an actual project so I needed to setup a properly secured instance"
publishDate: '2020-04-12'
disqusId: '37545295-de2f-411f-aab9-c3e44b1c9ce5'
tags: ['HashiCorp Vault','WSL2','LetsEncrypt','CertBot']
---
I've recently being getting my head around <a href="https://www.vaultproject.io/" rel="noopener" target="_blank">HashiCorp Vault</a>. A great product for securing your secrets, certificates, passwords and much more besides. Vault can be enabled in "dev" mode to allow you to test out its features, but I wanted to use this on an actual project so I needed to setup a properly secured instance.

I’ve been loving the developer experience involved with <a href="https://docs.microsoft.com/en-us/windows/wsl/wsl2-install" rel="noopener" target="_blank">WSL2</a> since it’s release, so I wanted to setup my Vault instance in there. I also wanted to have HTTPS enabled, so went to my go to nowadays for certificate generation - <a href="https://letsencrypt.org/" rel="noopener" target="_blank">Lets Encrypt</a>.

## Generating the Certificate
First of all, I’m going to generate the certificate that I want to use to secure my vault instance. We’re going to do this using <a href="https://certbot.eff.org/" rel="noopener" target="_blank">Certbot</a>, a free tool provided by the <a href="https://www.eff.org/" rel="noopener" target="_blank">EFF</a>. This is used to generate certificates for LetsEncrypt and is only available for Linux – another reason I’m loving WSL2 is that all of these tools are now available to us Windows developers! So first up, we run the following commands to install CertBot into my WSL2 instance:

```
sudo apt-get update
sudo apt-get install software-properties-common
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install certbot
```

Now if we were running a native instance of Ubuntu, we would be able to go ahead and generate the certificate now, but as we’re running WSL2 we need to do some extra configuration first. As part of the certificate process CertBot needs to able to receive a call back from the server. To do this we need to make sure that traffic on port 80 is being forwarded from my Windows instance into WSL2. 

We can do this with a PowerShell script:
```
$remoteport = bash.exe -c "ip addr show eth0 | grep 'inet '"
$found = $remoteport -match '\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}';

if( $found ){
  $remoteport = $matches[0];
} else{
  echo "The Script Exited, the ip address of WSL 2 cannot be found";
  exit;
}

Write-Host 'WSL2 IP:' $remoteport

#[Ports]
#All the ports you want to forward separated by coma
$ports=@(80,443,8200);

#[Static ip]
#You can change the addr to your ip config to listen to a specific address
$addresses=@('127.0.0.1', '192.168.1.128');
$ports_a = $ports -join ",";

#Remove Firewall Exception Rules
iex "Remove-NetFireWallRule -DisplayName 'WSL 2 Firewall Unlock' ";

#adding Exception Rules for inbound and outbound Rules
iex "New-NetFireWallRule -DisplayName 'WSL 2 Firewall Unlock' -Direction Outbound -LocalPort $ports_a -Action Allow -Protocol TCP";
iex "New-NetFireWallRule -DisplayName 'WSL 2 Firewall Unlock' -Direction Inbound -LocalPort $ports_a -Action Allow -Protocol TCP";

for( $j = 0; $j -lt $addresses.length; $j++) {
  for( $i = 0; $i -lt $ports.length; $i++ ){
    $port = $ports[$i];
    $addr = $addresses[$j];
    Write-Host "Adding mapping for port $($addr):$($port)"
    iex "netsh interface portproxy delete v4tov4 listenport=$port listenaddress=$addr";
    iex "netsh interface portproxy add v4tov4 listenport=$port listenaddress=$addr connectport=$port connectaddress=$remoteport";
  }
}
```

This will ensure that all traffic on the ports entered will be forwarded the IP assigned to my WSL2 instance. This is a slightly modified version of the fix listed on this <a href="https://github.com/microsoft/WSL/issues/4150" rel="noopener" target="_blank">GitHub Issue</a>. 

You’ll notice that we’re not just forwarding ports 80 & 443 to handle HTTP & HTTPS traffic, but also 8200. This is the port that Vault operates under and we’ll want Windows applications to be able to communicate with my Vault instance, so we’ll set this up now as well.

One annoying thing with WSL2 currently is that every time the instance starts up it is assigned a new IP address, meaning that we’ll need to run this PowerShell script again each time to forward the traffic on to the new IP. One simple way around this is to scheduled the script to be executed on startup and we can do this with a scheduled task:

```
schtasks /create /tn "WSL-Port-Mapping" /sc onstart /delay 0000:30 /rl highest /ru system /tr "powershell.exe -file "<<PATH_TO_POWERSHELL_SCRIPT>>"
```

So now we have everything setup, we can finally generate our certificate!

```
sudo certbot certonly --standalone -d <<DOMAIN_NAME>>
```

## Setting up Vault
We have our certificate ready, so now we need to install Vault. This is really simple to do with just a few commands in Linux. We’re going to download the archive, extract it, then move Vault to _/usr/local/bin_ so we can access it easily:

```
wget https://releases.hashicorp.com/vault/1.4.0/vault_1.4.0_linux_amd64.zip
unzip vault_1.4.0_linux_amd64.zip
mv vault /usr/local/bin/
```

Now we have Vault installed we’re ready to generate our config file to control how this instance of Vault will run. I’m going to be using Azure Storage as the back-end and link to the certificates that we just created:

```
disable_cache = true
disable_mlock = true
ui = true

listener "tcp" {
    address = "0.0.0.0:8200"
    tls_disable = 0
    tls_cert_file = "/etc/letsencrypt/live/<<DOMAIN_NAME>>/fullchain.pem"
    tls_key_file = "/etc/letsencrypt/live/<<DOMAIN_NAME>>/privkey.pem"
}

storage "azure" {
  accountName = "<<AZURE_STORAGE_ACCOUNT_NAME>>"
  accountKey  = "<<AZURE_STORAGE_ACCOUNT_KEY>>"
  container   = "<<AZURE_STORAGE_CONTAINER>>"
  environment = "<<AZURE_STORAGE_ENVIRONMENT>>"
}

max_lease_ttl = "10h"
default_lease_ttl = "10h"
```

I’m going to save that config file to _/etc/vault/config.json_. Now we have everything we need; we can start up our new instance of Vault! We can stand up a new instance of a Vault server and initialize it with the following two commands:

```
sudo vault server -config /etc/vault/config.json
vault operator init
```

After completing the _init_ command, you will be presented with Unseal keys & Root token so don't forget to make a note of them. Once you have these you're ready to start storing your secrets, as easy as that!

## Drawbacks
At this point if I was running on a native Ubuntu instance, I would configure Vault as a service using *systemd* so that it would always run on startup. However, unfortunately *systemd* isn’t supported on WSL2 at this stage, you can read more about it on this <a href="https://github.com/microsoft/WSL/issues/994" rel="noopener" target="_blank">GitHub Issue</a>. So for now I’m left having to manually run Vault when first boot up my machine. Not ideal, but hopefully the issue is fixed soon so that I can automate this last piece!

