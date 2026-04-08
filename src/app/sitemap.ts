import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/constants";
import { getAllBlogPosts } from "@/lib/blog/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogPosts = await getAllBlogPosts();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1.0, lastModified: new Date() },
    { url: `${SITE_URL}/blog`, changeFrequency: "daily", priority: 0.9, lastModified: new Date() },
    { url: `${SITE_URL}/videos`, changeFrequency: "weekly", priority: 0.8, lastModified: new Date() },
    { url: `${SITE_URL}/speaking`, changeFrequency: "weekly", priority: 0.8, lastModified: new Date() },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: new Date(post.publishDate),
  }));

  return [...staticRoutes, ...blogRoutes];
}
