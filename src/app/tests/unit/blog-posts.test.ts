import { describe, expect, it } from "vitest";
import {
  filterPostsByTag,
  getBlogPostBySlug,
  getPaginatedBlogPosts,
  isValidTagSlug,
  normalizeBlogFrontmatter,
  paginatePosts,
  sortPostsByDateDesc,
} from "@/lib/blog/posts";
import { DISQUS_SHORTNAME, getDisqusEmbedUrl } from "@/lib/blog/disqus";
import type { BlogPostSummary } from "@/lib/blog/types";

const samplePosts: BlogPostSummary[] = [
  {
    title: "Post A",
    slug: "post-a",
    publishDate: "2026-01-01",
    disqusId: "a",
    abstract: "A",
    tags: ["nextjs", "frontend"],
  },
  {
    title: "Post B",
    slug: "post-b",
    publishDate: "2026-02-01",
    disqusId: "b",
    abstract: "B",
    tags: ["testing"],
  },
  {
    title: "Post C",
    slug: "post-c",
    publishDate: "2025-12-01",
    disqusId: "c",
    abstract: "C",
    tags: ["nextjs"],
  },
];

describe("blog post helpers", () => {
  it("uses the configured Disqus shortname contract", () => {
    expect(DISQUS_SHORTNAME).toBe("robearlam");
    expect(getDisqusEmbedUrl(DISQUS_SHORTNAME)).toBe("https://robearlam.disqus.com/embed.js");
  });

  it("validates tag slugs", () => {
    expect(isValidTagSlug("nextjs")).toBe(true);
    expect(isValidTagSlug("platform-engineering")).toBe(true);
    expect(isValidTagSlug("NextJs")).toBe(true);
    expect(isValidTagSlug("bad tag")).toBe(true);
    expect(isValidTagSlug("tag.with.period")).toBe(true); 
  });

  it("normalizes valid frontmatter and rejects invalid frontmatter", () => {
    const valid = normalizeBlogFrontmatter({
      title: "Hello",
      slug: "hello-world",
      publishDate: "2026-01-01",
      disqusId: "hello",
      abstract: "Summary",
      tags: ["nextjs"],
      heroImage: "/hero.jpg",
    });

    expect(valid).not.toBeNull();
    expect(valid?.slug).toBe("hello-world");

    const invalid = normalizeBlogFrontmatter({
      title: "Hello",
      publishDate: "not-a-date",
      disqusId: "hello",
      abstract: "Summary",
      tags: ["bad tag"],
    });

    expect(invalid).toBeNull();
  });

  it("sorts by publishDate descending and filters by tag", () => {
    const sorted = sortPostsByDateDesc(samplePosts);
    expect(sorted.map((post) => post.slug)).toEqual(["post-b", "post-a", "post-c"]);

    const filtered = filterPostsByTag(sorted, "nextjs");
    expect(filtered.map((post) => post.slug)).toEqual(["post-a", "post-c"]);
  });

  it("paginates with hasMore and total values", () => {
    const page = paginatePosts(samplePosts, 1, 1);
    expect(page.posts).toHaveLength(1);
    expect(page.total).toBe(3);
    expect(page.hasMore).toBe(true);
  });
});

describe("blog file-backed queries", () => {
  it("returns initial paginated posts for blog listing", async () => {
    const page = await getPaginatedBlogPosts({ limit: 5, offset: 0 });

    expect(page.posts).toHaveLength(5);
    expect(page.total).toBeGreaterThanOrEqual(15);
    expect(page.posts[0]?.publishDate >= page.posts[1]?.publishDate).toBe(true);
  });

  it("finds posts by slug and returns null for missing slugs", async () => {
    const existing = await getBlogPostBySlug("upgrading-the-sugcon-sites-from-jss-to-the-content-sdk");
    expect(existing).not.toBeNull();
    expect(existing?.title).toContain("SUGCON");

    const missing = await getBlogPostBySlug("missing-slug");
    expect(missing).toBeNull();
  });
});