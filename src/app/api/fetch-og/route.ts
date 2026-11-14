import { NextResponse } from "next/server";

import { fetchLinkPreview } from "@/lib/server/link-preview";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Newspaper link preview for the media-coverage manager.
 *
 * POST { url } -> { ok: true, data: FetchOgResult } | { ok: false, status, code, error }
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, status: 400, code: "invalid", error: "Expected a JSON body." },
      { status: 400 },
    );
  }

  const url = typeof (body as { url?: unknown })?.url === "string" ? (body as { url: string }).url : "";
  return respond(url);
}

export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get("url") ?? "";
  return respond(url);
}

async function respond(url: string) {
  if (!url) {
    return NextResponse.json(
      { ok: false, status: 400, code: "invalid", error: "Query parameter `url` is required." },
      { status: 400 },
    );
  }

  const result = await fetchLinkPreview(url);
  if (!result.ok) {
    return NextResponse.json(result, { status: result.status });
  }
  return NextResponse.json({ ok: true, data: result.data });
}
