import { describe, it, expect } from "vitest";
import { escapeMarkdownLinkText, formatLlmsFullBlogLine } from "@/lib/llms/llms-full-body";

describe("escapeMarkdownLinkText", () => {
  it("escapes brackets and backslashes for Markdown link labels", () => {
    expect(escapeMarkdownLinkText("Plain title")).toBe("Plain title");
    expect(escapeMarkdownLinkText("Has ] bracket")).toBe("Has \\] bracket");
    expect(escapeMarkdownLinkText("Has [x]")).toBe("Has \\[x\\]");
    expect(escapeMarkdownLinkText("a\\b")).toBe("a\\\\b");
  });
});

describe("formatLlmsFullBlogLine", () => {
  it("builds a markdown bullet with canonical URL and single-line abstract", () => {
    const line = formatLlmsFullBlogLine({
      title: "Hello",
      slug: "hello-world",
      publishDate: "2024-01-01T00:00:00.000Z",
      disqusId: "x",
      abstract: "First line.\nSecond line.",
      tags: ["a"],
    });
    expect(line).toBe(
      "- [Hello](https://robearlam.com/blog/hello-world): First line. Second line."
    );
  });
});
