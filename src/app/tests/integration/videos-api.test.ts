import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "@/app/api/videos/route";
import { getAllVideos } from "@/lib/videos/videos";

describe("videos API route", () => {
  it("returns status 200 with correct shape for a valid request", async () => {
    const request = new NextRequest("http://localhost:3000/api/videos?limit=6&offset=0");
    const response = await GET(request);
    const body = (await response.json()) as {
      videos: Array<{ title: string; videoId: string; date: string }>;
      total: number;
      hasMore: boolean;
    };

    expect(response.status).toBe(200);
    expect(Array.isArray(body.videos)).toBe(true);
    expect(typeof body.total).toBe("number");
    expect(typeof body.hasMore).toBe("boolean");
  });

  it("never includes the featured video in the response", async () => {
    const allVideos = await getAllVideos();
    const featuredVideoId = allVideos[0]?.videoId;

    const request = new NextRequest("http://localhost:3000/api/videos?limit=6&offset=0");
    const response = await GET(request);
    const body = (await response.json()) as {
      videos: Array<{ videoId: string }>;
    };

    expect(body.videos.map((v) => v.videoId)).not.toContain(featuredVideoId);
  });

  it("returns the correct subsequent batch at offset=6", async () => {
    const requestFirst = new NextRequest("http://localhost:3000/api/videos?limit=6&offset=0");
    const responseFirst = await GET(requestFirst);
    const firstBody = (await responseFirst.json()) as {
      videos: Array<{ videoId: string }>;
      total: number;
      hasMore: boolean;
    };

    if (!firstBody.hasMore) {
      // Not enough videos to test second page — skip
      return;
    }

    const requestSecond = new NextRequest("http://localhost:3000/api/videos?limit=6&offset=6");
    const responseSecond = await GET(requestSecond);
    const secondBody = (await responseSecond.json()) as {
      videos: Array<{ videoId: string }>;
    };

    const firstIds = new Set(firstBody.videos.map((v) => v.videoId));
    for (const video of secondBody.videos) {
      expect(firstIds.has(video.videoId)).toBe(false);
    }
  });

  it("returns status 400 for a negative limit", async () => {
    const request = new NextRequest("http://localhost:3000/api/videos?limit=-1&offset=0");
    const response = await GET(request);
    expect(response.status).toBe(400);
  });

  it("returns status 400 for a negative offset", async () => {
    const request = new NextRequest("http://localhost:3000/api/videos?limit=6&offset=-1");
    const response = await GET(request);
    expect(response.status).toBe(400);
  });
});