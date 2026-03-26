import { describe, expect, it } from "vitest";
import { getAllVideos, getLatestVideos, getPaginatedVideos, normalizeVideoFrontmatter, paginateVideos, sortVideosByDateDesc } from "@/lib/videos/videos";
import { formatVideoDate } from "@/lib/videos/utils";
import type { VideoEntry } from "@/lib/videos/types";

const sampleVideos: VideoEntry[] = [
  { title: "Older", videoId: "older123", date: "2025-01-01" },
  { title: "Newest", videoId: "newest123", date: "2026-02-10" },
  { title: "Middle", videoId: "middle123", date: "2025-07-05" },
];

describe("video helpers", () => {
  it("normalizes valid frontmatter and rejects invalid frontmatter", () => {
    const valid = normalizeVideoFrontmatter({
      title: "Video",
      videoId: "abc123",
      date: "2026-03-20",
    });

    expect(valid).not.toBeNull();
    expect(valid?.videoId).toBe("abc123");

    const invalid = normalizeVideoFrontmatter({
      title: "Video",
      videoId: "abc123",
      date: "2026-13-20",
    });

    expect(invalid).toBeNull();
  });

  it("sorts videos by date descending", () => {
    const sorted = sortVideosByDateDesc(sampleVideos);
    expect(sorted.map((video) => video.title)).toEqual(["Newest", "Middle", "Older"]);
  });

  it("formats dates for display", () => {
    expect(formatVideoDate("2026-03-20")).toBe("20 March 2026");
  });
});

describe("video file-backed queries", () => {
  it("loads videos across year folders, sorts newest first, and skips invalid entries", async () => {
    const videos = await getAllVideos();

    expect(videos.length).toBeGreaterThanOrEqual(3);
    expect(videos[0]?.date >= videos[1]?.date).toBe(true);
    expect(videos.map((video) => video.title)).toContain("Sitecore Stories - Marketplace, Blok & MCP");
  });
});

describe("paginateVideos (pure pagination utility)", () => {
  const makeVideos = (count: number): VideoEntry[] =>
    Array.from({ length: count }, (_, i) => ({
      title: `Video ${i + 1}`,
      videoId: `vid${i + 1}`,
      date: `2025-01-${String(i + 1).padStart(2, "0")}`,
    }));

  it("returns empty list and hasMore=false for zero input videos", () => {
    const result = paginateVideos([], 0, 6);
    expect(result.videos).toHaveLength(0);
    expect(result.total).toBe(0);
    expect(result.hasMore).toBe(false);
  });

  it("returns all videos and hasMore=false when count is within limit", () => {
    const result = paginateVideos(makeVideos(3), 0, 6);
    expect(result.videos).toHaveLength(3);
    expect(result.total).toBe(3);
    expect(result.hasMore).toBe(false);
  });

  it("returns first 6 and hasMore=true when more than 6 exist at offset=0", () => {
    const result = paginateVideos(makeVideos(8), 0, 6);
    expect(result.videos).toHaveLength(6);
    expect(result.total).toBe(8);
    expect(result.hasMore).toBe(true);
  });

  it("returns the correct next batch at offset=6", () => {
    const result = paginateVideos(makeVideos(8), 6, 6);
    expect(result.videos).toHaveLength(2);
    expect(result.hasMore).toBe(false);
  });

  it("hasMore is false at exact boundary (offset + limit == total)", () => {
    const result = paginateVideos(makeVideos(6), 0, 6);
    expect(result.videos).toHaveLength(6);
    expect(result.hasMore).toBe(false);
  });

  it("returns empty slice and hasMore=false when offset exceeds total", () => {
    const result = paginateVideos(makeVideos(3), 6, 6);
    expect(result.videos).toHaveLength(0);
    expect(result.hasMore).toBe(false);
  });
});

describe("getLatestVideos (file-backed integration)", () => {
  it("returns 3 most recently added videos sorted by date descending", async () => {
    const videos = await getLatestVideos(3);
    expect(videos).toHaveLength(3);
    expect(videos[0]!.date >= videos[1]!.date).toBe(true);
  });

  it("returns all videos when n exceeds total count", async () => {
    const all = await getAllVideos();
    const videos = await getLatestVideos(all.length + 100);
    expect(videos).toHaveLength(all.length);
  });

  it("returns empty array for n=0", async () => {
    const videos = await getLatestVideos(0);
    expect(videos).toHaveLength(0);
  });
});

describe("getPaginatedVideos (file-backed integration)", () => {
  it("never includes the featured video in results", async () => {
    const allVideos = await getAllVideos();
    const featuredVideoId = allVideos[0]?.videoId;
    const result = await getPaginatedVideos({ limit: 6, offset: 0 });
    expect(result.videos.map((v) => v.videoId)).not.toContain(featuredVideoId);
  });

  it("returns a valid result shape with correct types", async () => {
    const result = await getPaginatedVideos({ limit: 6, offset: 0 });
    expect(Array.isArray(result.videos)).toBe(true);
    expect(typeof result.total).toBe("number");
    expect(typeof result.hasMore).toBe("boolean");
  });

  it("returns hasMore=false when offset reaches end of list", async () => {
    const allVideos = await getAllVideos();
    const nonFeaturedCount = Math.max(0, allVideos.length - 1);
    const result = await getPaginatedVideos({ limit: 6, offset: nonFeaturedCount });
    expect(result.hasMore).toBe(false);
  });
});
