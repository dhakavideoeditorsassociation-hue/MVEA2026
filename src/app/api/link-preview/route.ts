import { NextResponse } from "next/server";

import { fetchLinkPreview, isFacebookUrl, normalizePreviewUrl } from "@/lib/server/link-preview";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Link preview for Facebook press releases (and any other page).
 *
 * Facebook frequently answers server-side requests with a login wall, so the
 * response distinguishes a genuine extraction failure (`blocked`) from a
 * network problem, and the admin form falls back to manual headline/image
 * entry in that case.
 *
 * POST { url } -> { ok: true, platform, data } | { ok: false, status, code, error, hint? }
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, status: 400, code: "invalid", error: "Expected a JSON body." }, { status: 400 });
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

  const normalized = normalizePreviewUrl(url);
  if (!("protocol" in normalized)) {
    return NextResponse.json(normalized, { status: normalized.status });
  }

  const result = await fetchLinkPreview(url);
  if (!result.ok) {
    return NextResponse.json(result, { status: result.status });
  }

  return NextResponse.json({
    ok: true,
    platform: result.platform,
    facebook: isFacebookUrl(normalized),
    data: result.data,
  });
}
