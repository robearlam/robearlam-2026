import { describe, it, expect, vi, beforeEach } from "vitest";
import type { BlogPostSummary } from "@/lib/blog/types";

vi.mock("@/lib/blog/posts", () => ({
  getAllBlogPosts: vi.fn(),
}));

import { getAllBlogPosts } from "@/lib/blog/posts";
import { GET } from "@/app/rss/route";

const mockPosts: BlogPostSummary[] = [
  {
    title: "First Post",
    slug: "first-post",
    publishDate: "2026-03-01",
    abstract: "A simple first post",
    disqusId: "first-post-id",
    tags: ["general"],
  },
  {
    title: "Post with <Special> & \"Characters\" 'Here'",
    slug: "special-chars",
    publishDate: "2026-02-15",
    abstract: "Abstracts can have <html> & \"quotes\" too",
    disqusId: "special-chars-id",
    tags: ["testing"],
  },
];

describe("RSS Feed Route Handler", () => {
  beforeEach(() => {
    vi.mocked(getAllBlogPosts).mockResolvedValue(mockPosts);
  });

  it("returns content type application/rss+xml", async () => {
    const response = await GET();
    expect(response.headers.get("Content-Type")).toBe(
      "application/rss+xml; charset=utf-8",
    );
  });

  it("returns RSS 2.0 XML structure", async () => {
    const response = await GET();
    const body = await response.text();

    expect(body).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(body).toContain('<rss version="2.0">');
    expect(body).toContain("<channel>");
    expect(body).toContain("</channel>");
    expect(body).toContain("</rss>");
  });

  it("includes correct channel metadata", async () => {
    const response = await GET();
    const body = await response.text();

    expect(body).toContain("<title>Rob Earlam</title>");
    expect(body).toContain("<link>https://robearlam.com</link>");
    expect(body).toContain("<language>en</language>");
    expect(body).toContain("<description>");
  });

  it("includes item fields for each post", async () => {
    const response = await GET();
    const body = await response.text();

    expect(body).toContain("<item>");
    expect(body).toContain("<title>First Post</title>");
    expect(body).toContain(
      "<link>https://robearlam.com/blog/first-post</link>",
    );
    expect(body).toContain(
      "<description>A simple first post</description>",
    );
    expect(body).toContain("<pubDate>");
    expect(body).toContain(
      '<guid isPermaLink="true">https://robearlam.com/blog/first-post</guid>',
    );
  });

  it("uses canonical URLs from SITE_URL for links and guids", async () => {
    const response = await GET();
    const body = await response.text();

    expect(body).toContain(
      "<link>https://robearlam.com/blog/first-post</link>",
    );
    expect(body).toContain(
      "<link>https://robearlam.com/blog/special-chars</link>",
    );
    expect(body).not.toContain("localhost");
  });

  it("escapes XML special characters in titles and abstracts", async () => {
    const response = await GET();
    const body = await response.text();

    expect(body).toContain(
      "&lt;Special&gt; &amp; &quot;Characters&quot; &apos;Here&apos;",
    );
    expect(body).toContain(
      "&lt;html&gt; &amp; &quot;quotes&quot;",
    );
    expect(body).not.toContain("<Special>");
    expect(body).not.toContain("<html>");
  });

  it("formats pubDate as RFC 822", async () => {
    const response = await GET();
    const body = await response.text();

    const expected = new Date("2026-03-01").toUTCString();
    expect(body).toContain(`<pubDate>${expected}</pubDate>`);
  });
});
