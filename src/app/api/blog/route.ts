import { NextRequest } from "next/server";
import { getPaginatedBlogPosts } from "@/lib/blog/posts";

const DEFAULT_LIMIT = 5;

export async function GET(request: NextRequest): Promise<Response> {
  const searchParams = request.nextUrl.searchParams;
  const limitParam = searchParams.get("limit") ?? String(DEFAULT_LIMIT);
  const offsetParam = searchParams.get("offset") ?? "0";
  const tag = searchParams.get("tag") ?? undefined;
  const year = searchParams.get("year") ?? undefined;
  const month = searchParams.get("month") ?? undefined;

  const limit = Number.parseInt(limitParam, 10);
  const offset = Number.parseInt(offsetParam, 10);

  if (!Number.isFinite(limit) || limit <= 0 || !Number.isFinite(offset) || offset < 0) {
    return Response.json({ error: "Invalid query parameters. Provide positive limit and non-negative offset." }, { status: 400 });
  }

  const result = await getPaginatedBlogPosts({
    limit,
    offset,
    tag,
    year,
    month,
  });

  return Response.json(result, { status: 200 });
}