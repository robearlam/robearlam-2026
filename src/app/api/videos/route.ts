import { NextRequest } from "next/server";
import { getPaginatedVideos } from "@/lib/videos/videos";

const DEFAULT_LIMIT = 6;

export async function GET(request: NextRequest): Promise<Response> {
  const searchParams = request.nextUrl.searchParams;
  const limitParam = searchParams.get("limit") ?? String(DEFAULT_LIMIT);
  const offsetParam = searchParams.get("offset") ?? "0";

  const limit = Number.parseInt(limitParam, 10);
  const offset = Number.parseInt(offsetParam, 10);

  if (!Number.isFinite(limit) || limit <= 0 || !Number.isFinite(offset) || offset < 0) {
    return Response.json({ error: "Invalid query parameters. Provide positive limit and non-negative offset." }, { status: 400 });
  }

  const result = await getPaginatedVideos({ limit, offset });
  return Response.json(result, { status: 200 });
}