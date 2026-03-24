import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import type { BlogFrontmatter, BlogPost, BlogPostSummary, BlogQueryParams, BlogQueryResult, MonthlyArchiveEntry } from "@/lib/blog/types";

const BLOG_DATA_ROOT = path.join(process.cwd(), "data", "blogs");
const MAX_LIMIT = 20;

type BlogFileRecord = {
  summary: BlogPostSummary;
  content: string;
};

function isString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string" && entry.trim().length > 0);
}

export function isValidTagSlug(tag: string): boolean {
  return /^[a-zA-Z0-9.\s]+(?:-[a-zA-Z0-9.\s]+)*$/.test(tag);
}

function isValidDateString(value: string): boolean {
  return !Number.isNaN(Date.parse(value));
}

export function normalizeBlogFrontmatter(frontmatter: Record<string, unknown>): BlogFrontmatter | null {
  const title = frontmatter.title;
  const slug = frontmatter.slug;
  const publishDate = frontmatter.publishDate;
  const disqusId = frontmatter.disqusId;
  const abstract = frontmatter.abstract;
  const tags = frontmatter.tags;
  const heroImage = frontmatter.heroImage;

  if (!isString(title) || !isString(slug) || !isString(publishDate) || !isString(disqusId) || !isString(abstract)) {
    return null;
  }

  if (!isValidDateString(publishDate)) {
    return null;
  }

  if (!isStringArray(tags) || tags.some((tag) => !isValidTagSlug(tag))) {
    return null;
  }

  if (heroImage !== undefined && !isString(heroImage)) {
    return null;
  }

  return {
    title: title.trim(),
    slug: slug.trim(),
    publishDate,
    disqusId: disqusId.trim(),
    abstract: abstract.trim(),
    tags: tags.map((tag) => tag.trim()),
    heroImage: heroImage?.trim(),
  };
}

export function sortPostsByDateDesc(posts: BlogPostSummary[]): BlogPostSummary[] {
  return [...posts].sort((left, right) => Date.parse(right.publishDate) - Date.parse(left.publishDate));
}

export function filterPostsByTag(posts: BlogPostSummary[], tag?: string): BlogPostSummary[] {
  if (!tag) {
    return posts;
  }

  return posts.filter((post) => post.tags.includes(tag));
}

export function filterPostsByYearMonth(posts: BlogPostSummary[], year?: string, month?: string): BlogPostSummary[] {
  if (!year || !month) {
    return posts;
  }

  return posts.filter((post) => {
    const publishDate = new Date(post.publishDate);
    const postYear = String(publishDate.getUTCFullYear());
    const postMonth = String(publishDate.getUTCMonth() + 1).padStart(2, "0");

    return postYear === year && postMonth === month;
  });
}

export function paginatePosts(posts: BlogPostSummary[], offset: number, limit: number): BlogQueryResult {
  const safeOffset = Math.max(0, offset);
  const safeLimit = Math.max(1, Math.min(limit, MAX_LIMIT));
  const paginatedPosts = posts.slice(safeOffset, safeOffset + safeLimit);

  return {
    posts: paginatedPosts,
    total: posts.length,
    hasMore: safeOffset + safeLimit < posts.length,
  };
}

async function getMarkdownFilesRecursively(directoryPath: string): Promise<string[]> {
  const directoryEntries = await fs.readdir(directoryPath, { withFileTypes: true });

  const nestedEntries = await Promise.all(
    directoryEntries.map(async (entry) => {
      const fullPath = path.join(directoryPath, entry.name);
      if (entry.isDirectory()) {
        return getMarkdownFilesRecursively(fullPath);
      }

      if (entry.isFile() && fullPath.endsWith(".md")) {
        return [fullPath];
      }

      return [];
    })
  );

  return nestedEntries.flat();
}

async function loadAllBlogFileRecords(): Promise<BlogFileRecord[]> {
  const markdownFiles = await getMarkdownFilesRecursively(BLOG_DATA_ROOT);

  const fileRecords = await Promise.all(
    markdownFiles.map(async (filePath) => {
      const source = await fs.readFile(filePath, "utf8");
      const parsed = matter(source);
      const frontmatter = normalizeBlogFrontmatter(parsed.data);

      if (!frontmatter) {
        console.log(`Invalid frontmatter in file: ${filePath}`);
        return null;
      }

      return {
        summary: frontmatter,
        content: parsed.content,
      } satisfies BlogFileRecord;
    })
  );

  return fileRecords.filter((fileRecord): fileRecord is BlogFileRecord => fileRecord !== null);
}

export async function getAllBlogPosts(): Promise<BlogPostSummary[]> {
  const records = await loadAllBlogFileRecords();
  const summaries = records.map((record) => record.summary);

  return sortPostsByDateDesc(summaries);
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const posts = await getAllBlogPosts();
  return posts.map((post) => post.slug);
}

export async function getAllBlogTags(): Promise<string[]> {
  const posts = await getAllBlogPosts();

  return [...new Set(posts.flatMap((post) => post.tags))].sort((left, right) => left.localeCompare(right));
}

export async function getTopTags(limit: number): Promise<string[]> {
  const posts = await getAllBlogPosts();
  const tagCounts = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }

  return [...tagCounts.entries()]
    .sort((left, right) => {
      if (right[1] !== left[1]) {
        return right[1] - left[1];
      }

      return left[0].localeCompare(right[0]);
    })
    .slice(0, limit)
    .map(([tag]) => tag);
}

function getArchiveLabel(year: string, month: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${year}-${month}-01T00:00:00.000Z`));
}

export async function getMonthlyArchive(): Promise<MonthlyArchiveEntry[]> {
  const posts = await getAllBlogPosts();
  const archiveMap = new Map<string, number>();

  for (const post of posts) {
    const publishDate = new Date(post.publishDate);
    const year = String(publishDate.getUTCFullYear());
    const month = String(publishDate.getUTCMonth() + 1).padStart(2, "0");
    const key = `${year}-${month}`;

    archiveMap.set(key, (archiveMap.get(key) ?? 0) + 1);
  }

  return [...archiveMap.entries()]
    .sort(([left], [right]) => right.localeCompare(left))
    .map(([key, count]) => {
      const [year, month] = key.split("-");

      return {
        year,
        month,
        label: getArchiveLabel(year, month),
        count,
      } satisfies MonthlyArchiveEntry;
    });
}

export async function getAllArchiveMonths(): Promise<Array<{ year: string; month: string }>> {
  const archiveEntries = await getMonthlyArchive();

  return archiveEntries.map(({ year, month }) => ({ year, month }));
}

export async function getPaginatedBlogPosts({ limit, offset, tag, year, month }: BlogQueryParams): Promise<BlogQueryResult> {
  const sortedPosts = await getAllBlogPosts();
  const tagFilteredPosts = filterPostsByTag(sortedPosts, tag);
  const filteredPosts = filterPostsByYearMonth(tagFilteredPosts, year, month);

  return paginatePosts(filteredPosts, offset, limit);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const records = await loadAllBlogFileRecords();
  const match = records.find((record) => record.summary.slug === slug);

  if (!match) {
    return null;
  }

  return {
    ...match.summary,
    content: match.content,
  };
}