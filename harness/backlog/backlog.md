# Backlog

This file tracks planned features and future work for the project.

Items in this file are not yet active implementation tasks.

A backlog item should only move into `harness/tasks/` once it has been selected for active work.

---

## Status Values

Suggested status values:

- Planned
- Ready for Spec
- Deferred
- Done

---

## Backlog Items

### B001 — Project Scaffold and Harness Setup
**Status:** Done  
**Summary:** Create the initial repository structure, harness folders, standards, design system, roles, and templates.

---

### B002 — Global Site Layout
**Status:** Done  
**Summary:** Create the base site shell including header, footer, navigation, and shared layout structure.

---

### B003 — Homepage v1
**Status:** Done  
**Task:** T010  
**Summary:** Create the first homepage with hero content, introduction, and clear navigation to key areas.

---

### B004 — Contact Page v1
**Status:** Done  
**Summary:** Create a simple contact page with contact details and links.

---

### B005 — Blog Structure
**Status:** Done  
**Summary:** Introduce blog listing and individual article pages using markdown content.

---

### B006 — Speaking Page
**Status:** Done  
**Summary:** Create a page to showcase speaking engagements, topics, and related content.

---

### B007 — UI Framework and Design System
**Status:** Done
**Summary:** Establish a basic design system and UI component library for consistent styling and faster development.

---

### B008 — SEO Foundations
**Status:** Done  
**Summary:** Add baseline metadata, social sharing support, and search-friendly structure, AEO & GEO enablement, Google Analytics Tracking.

---

### B009 - Import real blog content
**Status:** Done  
**Summary:** Import existing blog content from previous project.

---

### B010 - Blog Disqus integration
**Status:** Done 
**Summary:** Add Diqus integration for blog posts.

---

### B011 - Blog Right Columns Panels
**Status:** Done 
**Task:** T007  
**Summary:** Add right panels to the blog listing pages, one showing the top tags, the other showing blog counts by month/year with count.

---

### B012 - Videos Page
**Status:** Done  
**Summary:** A page listing all of the videos that I have created.

---

### B013 - Make Harness IDE Agnostic
**Status:** Done  
**Summary:** Replicate the defined agent definitions currently used for vscode into a format that can be leveraged by Cursor / Claude.

---

### B014 - Blog RSS, Sitemap, Robots.txt, Webfinger etc
**Status:** Done  
**Summary:** Implements other auxiliary protocols that are needed for general website subscriptions

---

### B015 - Introduce Security Agent
**Status:** Planned  
**Summary:** Add a new agent to perform security scans on the codebase after each change. This could leverage something like SEMGREP to perform the check as it has a free tier. Also have the agent run as a Github action on commit to ensure this isn't missed.

---

### B016 - Blog hero images
**Status:** Done  
**Task:** T013  
**Summary:** The blog hero images aren't used on the homepage preview component. We need to have them output there, if the blog doesn't have an image then use the default placeholder located at `/src/public/img/blog-images/blog-placeholder.jpg`

---

### B017 - Blog support for Mermaid Diagrams
**Status:** Done  
**Summary:** Add support for mermaid diagrams to be added into the blog post functionality for the site.

---

### B018 - Dark mode support
**Status:** Done
**Task:** T015  
**Summary:** Add support for Dark Mode on the site. This should default to the system setting, but include a toggle for people to change.


---

### B019 - Change backlog to run from GitHub issues
**Status:** Planned 
**Summary:** Change the backlog functionality to instead be run from GitHub Issues.