import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import type { VideoEntry, VideoFrontmatter, VideoQueryParams, VideoQueryResult } from "@/lib/videos/types";

const VIDEOS_DATA_ROOT = path.join(process.cwd(), "data", "videos");

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidDateString(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) {
    return false;
  }

  const date = new Date(parsed);
  const [year, month, day] = value.split("-").map(Number) as [number, number, number];
  return date.getUTCFullYear() === year && date.getUTCMonth() + 1 === month && date.getUTCDate() === day;
}

export function normalizeVideoFrontmatter(frontmatter: Record<string, unknown>): VideoFrontmatter | null {
  const title = frontmatter.title;
  const videoId = frontmatter.videoId;
  const date = frontmatter.date;

  if (!isNonEmptyString(title) || !isNonEmptyString(videoId)) {
    return null;
  }

  const normalizedDate = date instanceof Date ? date.toISOString().slice(0, 10) : date;
  if (!isNonEmptyString(normalizedDate) || !isValidDateString(normalizedDate.trim())) {
    return null;
  }

  return {
    title: title.trim(),
    videoId: videoId.trim(),
    date: normalizedDate.trim(),
  };
}

export function sortVideosByDateDesc(videos: VideoEntry[]): VideoEntry[] {
  return [...videos].sort((left, right) => right.date.localeCompare(left.date));
}

async function getMarkdownFilesRecursively(directoryPath: string): Promise<string[]> {
  let entries;
  try {
    entries = await fs.readdir(directoryPath, { withFileTypes: true });
  } catch {
    return [];
  }

  const nestedEntries = await Promise.all(
    entries.map(async (entry) => {
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

export async function getAllVideos(): Promise<VideoEntry[]> {
  const markdownFiles = await getMarkdownFilesRecursively(VIDEOS_DATA_ROOT);

  const results = await Promise.all(
    markdownFiles.map(async (filePath) => {
      const source = await fs.readFile(filePath, "utf8");
      const parsed = matter(source);
      const video = normalizeVideoFrontmatter(parsed.data);

      if (!video) {
        console.warn(`Invalid video frontmatter in file: ${filePath}`);
        return null;
      }

      return video;
    })
  );

  return sortVideosByDateDesc(results.filter((video): video is VideoEntry => video !== null));
}

const MAX_LIMIT = 20;

export function paginateVideos(videos: VideoEntry[], offset: number, limit: number): VideoQueryResult {
  const safeOffset = Math.max(0, offset);
  const safeLimit = Math.max(1, Math.min(limit, MAX_LIMIT));
  const paginatedVideos = videos.slice(safeOffset, safeOffset + safeLimit);

  return {
    videos: paginatedVideos,
    total: videos.length,
    hasMore: safeOffset + safeLimit < videos.length,
  };
}

export async function getPaginatedVideos({ limit, offset }: VideoQueryParams): Promise<VideoQueryResult> {
  const allVideos = await getAllVideos();
  const [, ...nonFeaturedVideos] = allVideos;
  return paginateVideos(nonFeaturedVideos, offset, limit);
}


