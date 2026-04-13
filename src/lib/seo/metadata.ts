import type { Metadata } from "next";
import { SITE_NAME, SITE_DESCRIPTION, SITE_AUTHOR, SITE_URL } from "./constants";
import { canonicalUrl } from "./canonical";

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  noIndex?: boolean;
};

/** Global default metadata applied in the root layout. */
export function defaultMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: SITE_NAME,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    authors: [SITE_AUTHOR],
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: SITE_NAME,
      url: SITE_URL,
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
    },
    twitter: {
      card: "summary",
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
    },
    alternates: {
      canonical: SITE_URL,
      types: {
        "application/rss+xml": `${SITE_URL}/rss`,
      },
    },
    icons: {
      icon: "/img/favicon.ico",
      shortcut: "/img/favicon.ico",
      apple: "/img/favicon.ico",
    },
  };
}

/** Build route-specific metadata with OG and Twitter alignment. */
export function pageMetadata({
  title,
  description,
  path,
  ogImage,
  noIndex,
}: PageMetadataOptions): Metadata {
  const url = canonicalUrl(path);

  return {
    title,
    description,
    alternates: { canonical: url, types: { "application/rss+xml": `${SITE_URL}/rss` } },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: "website",
      title,
      description,
      url,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}
