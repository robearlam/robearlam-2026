import { describe, expect, it } from "vitest";
import { formatVideoDate, getAllVideos, normalizeVideoFrontmatter, sortVideosByDateDesc } from "@/lib/videos/videos";
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
    expect(videos.map((video) => video.title)).toContain("Building Editorial Next.js Pages");
  });
});
