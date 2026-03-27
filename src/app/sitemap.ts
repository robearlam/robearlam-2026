import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/constants";
import { getAllBlogSlugs } from "@/lib/blog/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogSlugs = await getAllBlogSlugs();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/blog`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/videos`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/speaking`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes];
}
