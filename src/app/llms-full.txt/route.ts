import { buildLlmsFullText } from "@/lib/llms/llms-full-body";

export const revalidate = 3600;

export async function GET(): Promise<Response> {
  const body = await buildLlmsFullText();

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
