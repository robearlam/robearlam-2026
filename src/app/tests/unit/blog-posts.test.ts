import { describe, expect, it } from "vitest";
import {
  filterPostsByYearMonth,
  filterPostsByTag,
  getAllArchiveYears,
  getAllBlogPosts,
  getBlogPostBySlug,
  getLatestPosts,
  getMonthlyArchive,
  getPaginatedBlogPosts,
  getTopTags,
  getTopTagsWithCount,
  getYearlyArchiveGroups,
  isValidTagSlug,
  normalizeBlogFrontmatter,
  paginatePosts,
  sortPostsByDateDesc,
} from "@/lib/blog/posts";
import { getBlogTagHref, normalizeBlogTag } from "@/lib/blog/tags";
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

  it("normalizes encoded whitespace tags for routing and filtering", () => {
    const postsWithWhitespaceTags: BlogPostSummary[] = [
      {
        title: "Whitespace tag post",
        slug: "whitespace-tag-post",
        publishDate: "2026-03-01",
        disqusId: "whitespace-tag-post",
        abstract: "Whitespace tags should still resolve from encoded routes.",
        tags: ["power platform"],
      },
    ];

    expect(normalizeBlogTag("power%20platform")).toBe("power platform");
    expect(getBlogTagHref("power platform")).toBe("/blog/tag/power%20platform");
    expect(filterPostsByTag(postsWithWhitespaceTags, "power%20platform").map((post) => post.slug)).toEqual([
      "whitespace-tag-post",
    ]);
  });

  it("filters posts by year and month", () => {
    const filtered = filterPostsByYearMonth(samplePosts, "2026", "01");
    expect(filtered.map((post) => post.slug)).toEqual(["post-a"]);
    expect(filterPostsByYearMonth(samplePosts, "2026").map((post) => post.slug)).toEqual(["post-a", "post-b"]);
    expect(filterPostsByYearMonth(samplePosts)).toEqual(samplePosts);
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

  it("returns filtered paginated posts for an archive month", async () => {
    const archive = await getMonthlyArchive();
    const firstEntry = archive[0];

    expect(firstEntry).toBeDefined();

    const page = await getPaginatedBlogPosts({
      limit: 20,
      offset: 0,
      year: firstEntry!.year,
      month: firstEntry!.month,
    });

    expect(page.posts.length).toBe(firstEntry!.count);
    expect(page.posts.every((post) => post.publishDate.startsWith(`${firstEntry!.year}-${firstEntry!.month}`))).toBe(true);
  });

  it("returns filtered paginated posts for an archive year", async () => {
    const archiveYears = await getAllArchiveYears();
    const firstYear = archiveYears[0];

    expect(firstYear).toBeDefined();

    const page = await getPaginatedBlogPosts({
      limit: 50,
      offset: 0,
      year: firstYear!.year,
    });

    expect(page.posts.length).toBeGreaterThan(0);
    expect(page.posts.every((post) => post.publishDate.startsWith(firstYear!.year))).toBe(true);
  });

  it("returns top tags without counts and archive entries with counts", async () => {
    const [topTags, topTagsWithCount, archive, yearGroups] = await Promise.all([
      getTopTags(10),
      getTopTagsWithCount(10),
      getMonthlyArchive(),
      getYearlyArchiveGroups(),
    ]);

    expect(topTags.length).toBeGreaterThan(0);
    expect(topTags.length).toBeLessThanOrEqual(10);
    expect(topTagsWithCount[0]?.tag).toBe(topTags[0]);
    expect(topTagsWithCount[0]?.count).toBeGreaterThan(0);
    expect(archive.length).toBeGreaterThan(0);
    expect(archive[0]?.label).toMatch(/[A-Za-z]/);
    expect(archive[0]?.count).toBeGreaterThan(0);
    expect(yearGroups.length).toBeGreaterThan(0);
    expect(yearGroups[0]?.months.length).toBeGreaterThan(0);
    expect(yearGroups[0]?.count).toBeGreaterThanOrEqual(yearGroups[0]!.months[0]!.count);
  });

  it("finds posts by slug and returns null for missing slugs", async () => {
    const existing = await getBlogPostBySlug("upgrading-the-sugcon-sites-from-jss-to-the-content-sdk");
    expect(existing).not.toBeNull();
    expect(existing?.title).toContain("SUGCON");

    const missing = await getBlogPostBySlug("missing-slug");
    expect(missing).toBeNull();
  });
});

describe("getLatestPosts (file-backed integration)", () => {
  it("returns 3 most recent posts sorted by publishDate descending", async () => {
    const posts = await getLatestPosts(3);
    expect(posts).toHaveLength(3);
    expect(posts[0]!.publishDate >= posts[1]!.publishDate).toBe(true);
    expect(posts[1]!.publishDate >= posts[2]!.publishDate).toBe(true);
  });

  it("returns all posts when n exceeds total count", async () => {
    const all = await getAllBlogPosts();
    const posts = await getLatestPosts(all.length + 100);
    expect(posts).toHaveLength(all.length);
  });

  it("returns empty array for n=0", async () => {
    const posts = await getLatestPosts(0);
    expect(posts).toHaveLength(0);
  });
});