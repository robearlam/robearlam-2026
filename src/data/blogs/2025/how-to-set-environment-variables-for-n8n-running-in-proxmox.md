---
title: 'How to set environment variables for n8n running in Proxmox'
slug: 'how-to-set-environment-variables-for-n8n-running-in-proxmox'
dateCreated: '2025-06-08'
lastUpdated: '2025-06-08'
abstract: "I setup a HomeLab last year running Proxmox and have been having fun running a variety of different workloads on it. This weekend I decided I wanted to get a local community instance of n8n running locally to test it out."
publishDate: '2025-06-08'
disqusId: 'f7bf6fe7-a249-43e0-9980-4bfd99f23cc8'
tags: ['n8n','Proxmox','Community Scripts','HomeLab','Linux']
---

I setup a HomeLab last year running <a href="https://www.proxmox.com/" target="_blank" rel="nofollow">Proxmox</a> and have been having fun running a variety of different workloads on it. This weekend I decided I wanted to get a local community instance of <a href="https://www.n8n.io/" target="_blank" rel="nofollow">n8n</a> running locally to test it out.

Now when setting up the various LXC Containers that are running my different workloads, I’ve been relying on the excellent <a href="https://community-scripts.github.io/ProxmoxVE/" target="_blank" rel="nofollow">Community Scripts repository</a>, originally created by tteck. There was a script to install the community edition of n8n, so I had it up and running pretty quickly…. once I had to connect to some external services though I soon ran into an issue.

I don’t expose any of my LXC’s to the outside world, for obvious reasons, but I do use some fake internal DNS values to make my applications easy to access via <a href="https://nginxproxymanager.com/" target="_blank" rel="nofollow">Nginx Proxy Manager</a>. Now when I went to connect n8n to Google to test out some different data flows, the Callback URL being generated from n8n was always using the `localhost` domain, which wasn’t correct in my scenario.

Some quick googling on this told me that I needed to set the WEBHOOK_URL environment variable in my docker-compose to change it. I wasn’t using Docker though, so this led me down a rabbit hole of how to set these env vars for an n8n instance running directly in Debian.

To cut a long story short, and to save anyone else who run into this issue. I found the issue on a <a href="https://github.com/tteck/Proxmox/issues/1600" target="_blank" rel="nofollow">GitHub issue</a> for the previous version of the Community Scripts when they were still maintained by tteck.

It turns out you need to modify the `n8n.service` definition to have the environment variables read by n8n when it loads. This can be found at `/etc/systemd/system/n8n.service`. You then need to add a new line for each env var that you want to add, in my case it now looks like this:

```ini
[Unit]
Description=n8n

[Service]
Type=simple
Environment="N8N_SECURE_COOKIE=false"
ExecStart=n8n start
Environment="WEBHOOK_URL=<<DOMAIN_FOR_N8N>>"
[Install]
WantedBy=multi-user.target
```

After setting the variable and rebooting the LXC I was back in business!