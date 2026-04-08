import fs from "node:fs/promises";
import path from "node:path";
import { getAllBlogPosts } from "@/lib/blog/posts";
import { canonicalUrl } from "@/lib/seo/canonical";
import type { BlogPostSummary } from "@/lib/blog/types";

const PREAMBLE_PATH = path.join(process.cwd(), "lib", "llms", "llms-full-preamble.md");

/** Escape `\`, `[`, and `]` so titles are safe inside Markdown `[...](url)` link text. */
export function escapeMarkdownLinkText(text: string): string {
  return text.replaceAll("\\", "\\\\").replaceAll("[", "\\[").replaceAll("]", "\\]");
}

function singleLine(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export function formatLlmsFullBlogLine(post: BlogPostSummary): string {
  const title = escapeMarkdownLinkText(post.title);
  const url = canonicalUrl(`/blog/${post.slug}`);
  const blurb = singleLine(post.abstract);
  return `- [${title}](${url}): ${blurb}`;
}

export async function buildLlmsFullText(): Promise<string> {
  const [preamble, posts] = await Promise.all([fs.readFile(PREAMBLE_PATH, "utf8"), getAllBlogPosts()]);
  const lines = posts.map((post) => formatLlmsFullBlogLine(post));
  return `${preamble.trimEnd()}\n\n${lines.join("\n")}\n`;
}
