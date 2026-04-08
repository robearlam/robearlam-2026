import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, SITE_AUTHOR } from "./constants";
import { canonicalUrl } from "./canonical";

// ---- low-level types ----

type JsonLdGraph = {
  "@context": "https://schema.org";
  "@graph": Record<string, unknown>[];
};

// ---- shared identity ----

const AUTHOR_SOCIAL_PROFILES = [
  "https://bsky.app/profile/robearlam.com",
  "https://mastodon.social/@RobEarlam",
  "https://github.com/robearlam",
  "https://www.linkedin.com/in/rob-earlam/",
  "https://www.youtube.com/playlist?list=PLmTNwpFzRErCW5ibZAkSO8HFSW0Rkiplj",
  "https://dev.to/robearlam",
];

export function personJsonLd(): Record<string, unknown> {
  return {
    "@type": "Person",
    name: SITE_AUTHOR.name,
    url: SITE_AUTHOR.url,
    jobTitle: "Developer Advocate",
    description: SITE_DESCRIPTION,
    image: `${SITE_URL}/img/rob.jpg`,
    sameAs: AUTHOR_SOCIAL_PROFILES,
    knowsAbout: [
      "SitecoreAI",
      "AI Powered Development",
      "Next.js",
      "ASP.NET Core",
      "Docker",
      "Kubernetes",
      "Composable Architecture",
      "Headless CMS",
      "Developer Advocacy",
    ],
  };
}

// ---- global schemas ----

export function globalJsonLd(): JsonLdGraph {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
      },
      personJsonLd(),
    ],
  };
}

// ---- page-level schemas ----

type WebPageSchema = {
  name: string;
  description: string;
  path: string;
};

export function webPageJsonLd({ name, description, path }: WebPageSchema): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: canonicalUrl(path),
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
  };
}

// ---- blog post ----

type BlogPostingSchema = {
  title: string;
  description: string;
  slug: string;
  publishDate: string;
  heroImage?: string;
  wordCount?: number;
  articleSection?: string;
};

export function blogPostingJsonLd({
  title,
  description,
  slug,
  publishDate,
  heroImage,
  wordCount,
  articleSection,
}: BlogPostingSchema): Record<string, unknown> {
  const url = canonicalUrl(`/blog/${slug}`);
  const absoluteImage = heroImage
    ? heroImage.startsWith("http") ? heroImage : `${SITE_URL}${heroImage}`
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: publishDate,
    author: { "@type": "Person", name: SITE_AUTHOR.name, url: SITE_AUTHOR.url },
    publisher: { "@type": "Person", name: SITE_AUTHOR.name, url: SITE_AUTHOR.url },
    ...(absoluteImage ? { image: absoluteImage } : {}),
    ...(wordCount ? { wordCount } : {}),
    ...(articleSection ? { articleSection } : {}),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["article h1", "article header p"],
    },
  };
}

// ---- video ----

type VideoObjectSchema = {
  title: string;
  videoId: string;
  date: string;
  description?: string;
};

export function videoObjectJsonLd({ title, videoId, date, description }: VideoObjectSchema): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: title,
    description: description ?? title,
    uploadDate: date,
    thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    embedUrl: `https://www.youtube.com/embed/${videoId}`,
    contentUrl: `https://www.youtube.com/watch?v=${videoId}`,
  };
}

// ---- speaking event ----

type EventSchema = {
  name: string;
  sessionName: string;
  location: string;
  start: string;
  end?: string;
};

export function eventJsonLd({ name, sessionName, location, start, end }: EventSchema): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${sessionName} at ${name}`,
    startDate: start,
    ...(end ? { endDate: end } : {}),
    location: { "@type": "Place", name: location },
    performer: { "@type": "Person", name: SITE_AUTHOR.name },
  };
}

// ---- breadcrumb ----

type BreadcrumbItem = {
  name: string;
  path: string;
};

export function breadcrumbJsonLd(items: BreadcrumbItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  };
}

// ---- profile page (contact) ----

export function profilePageJsonLd({ name, description, path }: WebPageSchema): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name,
    description,
    url: canonicalUrl(path),
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    mainEntity: personJsonLd(),
  };
}

// ---- item list (blog index) ----

type ItemListEntry = {
  name: string;
  url: string;
};

export function itemListJsonLd(entries: ItemListEntry[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: entries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      url: entry.url,
    })),
  };
}
