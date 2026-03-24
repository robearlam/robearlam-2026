import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "@/app/api/blog/route";

describe("blog API route", () => {
  it("returns initial paginated blog results", async () => {
    const request = new NextRequest("http://localhost:3000/api/blog?limit=5&offset=0");
    const response = await GET(request);
    const body = (await response.json()) as {
      posts: Array<{ slug: string; tags: string[] }>;
      total: number;
      hasMore: boolean;
    };

    expect(response.status).toBe(200);
    expect(body.posts).toHaveLength(5);
    expect(body.total).toBeGreaterThanOrEqual(15);
    expect(typeof body.hasMore).toBe("boolean");
  });

  it("supports tag filtering", async () => {
    const request = new NextRequest("http://localhost:3000/api/blog?limit=10&offset=0&tag=Sitecore");
    const response = await GET(request);
    const body = (await response.json()) as {
      posts: Array<{ tags: string[] }>;
    };

    expect(response.status).toBe(200);
    expect(body.posts.length).toBeGreaterThan(0);
    expect(body.posts.every((post) => post.tags.includes("Sitecore"))).toBe(true);
  });

  it("rejects invalid pagination parameters", async () => {
    const request = new NextRequest("http://localhost:3000/api/blog?limit=-1&offset=0");
    const response = await GET(request);

    expect(response.status).toBe(400);
  });
});