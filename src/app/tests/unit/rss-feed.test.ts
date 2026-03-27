import { describe, it, expect, vi, beforeEach } from "vitest";
import type { BlogPost } from "@/lib/blog/types";

vi.mock("@/lib/blog/posts", () => ({
  getAllBlogPostsWithContent: vi.fn(),
}));

// Mock the unified markdown pipeline so tests don't depend on file I/O or full remark processing
vi.mock("unified", () => ({
  unified: vi.fn(() => ({
    use: vi.fn().mockReturnThis(),
    process: vi.fn().mockResolvedValue({ toString: () => "<p>Rendered content</p>" }),
  })),
}));

import { getAllBlogPostsWithContent } from "@/lib/blog/posts";
import { GET } from "@/app/rss/route";

const mockPosts: BlogPost[] = [
  {
    title: "First Post",
    slug: "first-post",
    publishDate: "2026-03-01",
    abstract: "A simple first post",
    disqusId: "first-post-id",
    tags: ["general"],
    content: "## Hello\n\nThis is the first post.",
  },
  {
    title: "Second Post",
    slug: "second-post",
    publishDate: "2026-02-15",
    abstract: "A second post abstract",
    disqusId: "second-post-id",
    tags: ["testing"],
    content: "## Second\n\nThis is the second post.",
  },
];

describe("RSS Feed Route Handler", () => {
  beforeEach(() => {
    vi.mocked(getAllBlogPostsWithContent).mockResolvedValue(mockPosts);
  });

  it("returns content type application/rss+xml", async () => {
    const response = await GET();
    expect(response.headers.get("Content-Type")).toBe(
      "application/rss+xml; charset=utf-8",
    );
  });

  it("returns RSS 2.0 XML structure with Atom and content namespaces", async () => {
    const response = await GET();
    const body = await response.text();

    expect(body).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(body).toContain('xmlns:atom="http://www.w3.org/2005/Atom"');
    expect(body).toContain('xmlns:content="http://purl.org/rss/1.0/modules/content/"');
    expect(body).toContain('version="2.0"');
    expect(body).toContain("<channel>");
    expect(body).toContain("</channel>");
    expect(body).toContain("</rss>");
  });

  it("includes correct channel metadata", async () => {
    const response = await GET();
    const body = await response.text();

    expect(body).toContain("<title>Rob Earlam - Blog</title>");
    expect(body).toContain("<link>https://robearlam.com</link>");
    expect(body).toContain("<description>Developer advocate, Software Developer, Movie Lover, Music Listener, Pizza Eater, Meat Smoker</description>");
    expect(body).toContain("<lastBuildDate>");
    expect(body).not.toContain("<language>");
  });

  it("includes atom:link self-reference", async () => {
    const response = await GET();
    const body = await response.text();

    expect(body).toContain('<atom:link href="https://robearlam.com/rss" rel="self" type="application/rss+xml"/>');
  });

  it("includes item fields for each post wrapped in CDATA", async () => {
    const response = await GET();
    const body = await response.text();

    expect(body).toContain("<item>");
    expect(body).toContain("<![CDATA[ First Post ]]>");
    expect(body).toContain(
      "<link>https://robearlam.com/blog/first-post</link>",
    );
    expect(body).toContain("<![CDATA[ A simple first post ]]>");
    expect(body).toContain("<pubDate>");
    expect(body).toContain("<content:encoded>");
  });

  it("uses guid without isPermaLink attribute", async () => {
    const response = await GET();
    const body = await response.text();

    expect(body).toContain("<guid>https://robearlam.com/blog/first-post</guid>");
    expect(body).not.toContain("isPermaLink");
  });

  it("uses canonical URLs from SITE_URL for links and guids", async () => {
    const response = await GET();
    const body = await response.text();

    expect(body).toContain(
      "<link>https://robearlam.com/blog/first-post</link>",
    );
    expect(body).toContain(
      "<link>https://robearlam.com/blog/second-post</link>",
    );
    expect(body).not.toContain("localhost");
  });

  it("formats pubDate as RFC 822", async () => {
    const response = await GET();
    const body = await response.text();

    const expected = new Date("2026-03-01").toUTCString();
    expect(body).toContain(`<pubDate>${expected}</pubDate>`);
  });

  it("includes lastBuildDate from most recent post", async () => {
    const response = await GET();
    const body = await response.text();

    const expected = new Date("2026-03-01").toUTCString();
    expect(body).toContain(`<lastBuildDate>${expected}</lastBuildDate>`);
  });

  it("includes content:encoded with rendered HTML", async () => {
    const response = await GET();
    const body = await response.text();

    expect(body).toContain("<content:encoded>");
    expect(body).toContain("</content:encoded>");
  });
});

