import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, SITE_AUTHOR } from "./constants";
import { canonicalUrl } from "./canonical";

// ---- low-level types ----

type JsonLdGraph = {
  "@context": "https://schema.org";
  "@graph": Record<string, unknown>[];
};

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
      {
        "@type": "Person",
        name: SITE_AUTHOR.name,
        url: SITE_AUTHOR.url,
      },
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
};

export function blogPostingJsonLd({
  title,
  description,
  slug,
  publishDate,
  heroImage,
}: BlogPostingSchema): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url: canonicalUrl(`/blog/${slug}`),
    datePublished: publishDate,
    author: { "@type": "Person", name: SITE_AUTHOR.name, url: SITE_AUTHOR.url },
    ...(heroImage ? { image: heroImage } : {}),
  };
}

// ---- video ----

type VideoObjectSchema = {
  title: string;
  videoId: string;
  date: string;
};

export function videoObjectJsonLd({ title, videoId, date }: VideoObjectSchema): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: title,
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
