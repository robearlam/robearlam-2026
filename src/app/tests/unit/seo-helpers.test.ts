import { describe, it, expect } from "vitest";
import { canonicalUrl } from "@/lib/seo/canonical";
import {
  globalJsonLd,
  webPageJsonLd,
  blogPostingJsonLd,
  videoObjectJsonLd,
  eventJsonLd,
} from "@/lib/seo/json-ld";

describe("canonicalUrl", () => {
  it("prepends the site URL to a path starting with /", () => {
    const result = canonicalUrl("/blog");
    expect(result).toBe("https://robearlam.com/blog");
  });

  it("normalizes a path without a leading slash", () => {
    const result = canonicalUrl("contact");
    expect(result).toBe("https://robearlam.com/contact");
  });

  it("handles root path", () => {
    expect(canonicalUrl("/")).toBe("https://robearlam.com/");
  });
});

describe("globalJsonLd", () => {
  it("returns a graph with WebSite and Person nodes", () => {
    const result = globalJsonLd();
    expect(result["@context"]).toBe("https://schema.org");
    expect(result["@graph"]).toHaveLength(2);

    const types = result["@graph"].map((node) => node["@type"]);
    expect(types).toContain("WebSite");
    expect(types).toContain("Person");
  });

  it("includes the site name in WebSite node", () => {
    const webSite = globalJsonLd()["@graph"].find((n) => n["@type"] === "WebSite");
    expect(webSite?.name).toBe("Rob Earlam");
  });
});

describe("webPageJsonLd", () => {
  it("builds a WebPage schema with correct URL", () => {
    const result = webPageJsonLd({
      name: "Blog",
      description: "All blog posts",
      path: "/blog",
    });
    expect(result["@type"]).toBe("WebPage");
    expect(result.url).toBe("https://robearlam.com/blog");
    expect(result.name).toBe("Blog");
  });
});

describe("blogPostingJsonLd", () => {
  it("builds a BlogPosting schema", () => {
    const result = blogPostingJsonLd({
      title: "My Post",
      description: "A test post",
      slug: "my-post",
      publishDate: "2026-01-15",
    });
    expect(result["@type"]).toBe("BlogPosting");
    expect(result.headline).toBe("My Post");
    expect(result.url).toBe("https://robearlam.com/blog/my-post");
    expect(result.datePublished).toBe("2026-01-15");
  });

  it("includes image when heroImage is provided", () => {
    const result = blogPostingJsonLd({
      title: "Post",
      description: "Desc",
      slug: "post",
      publishDate: "2026-01-01",
      heroImage: "/img/hero.png",
    });
    expect(result.image).toBe("/img/hero.png");
  });

  it("omits image when heroImage is undefined", () => {
    const result = blogPostingJsonLd({
      title: "Post",
      description: "Desc",
      slug: "post",
      publishDate: "2026-01-01",
    });
    expect(result).not.toHaveProperty("image");
  });
});

describe("videoObjectJsonLd", () => {
  it("builds a VideoObject schema with YouTube URLs", () => {
    const result = videoObjectJsonLd({
      title: "Demo Video",
      videoId: "abc123",
      date: "2026-02-10",
    });
    expect(result["@type"]).toBe("VideoObject");
    expect(result.name).toBe("Demo Video");
    expect(result.embedUrl).toBe("https://www.youtube.com/embed/abc123");
    expect(result.contentUrl).toBe("https://www.youtube.com/watch?v=abc123");
    expect(result.uploadDate).toBe("2026-02-10");
  });
});

describe("eventJsonLd", () => {
  it("builds an Event schema", () => {
    const result = eventJsonLd({
      name: "Conf2026",
      sessionName: "Building with Next.js",
      location: "London, UK",
      start: "2026-06-01",
    });
    expect(result["@type"]).toBe("Event");
    expect(result.name).toBe("Building with Next.js at Conf2026");
    expect(result.startDate).toBe("2026-06-01");
    expect(result).not.toHaveProperty("endDate");
  });

  it("includes end date when provided", () => {
    const result = eventJsonLd({
      name: "Conf",
      sessionName: "Talk",
      location: "NYC",
      start: "2026-06-01",
      end: "2026-06-03",
    });
    expect(result.endDate).toBe("2026-06-03");
  });
});
