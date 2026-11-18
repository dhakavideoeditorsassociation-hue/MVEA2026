import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 6_000_000;
const TIMEOUT_MS = 10_000;

function isBlockedHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/\.$/, "");
  if (host === "localhost" || host === "0.0.0.0" || host.endsWith(".localhost")) return true;
  if (host.endsWith(".local") || host.endsWith(".internal")) return true;
  if (host.startsWith("[")) return true;
  const v4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (v4) {
    const [a, b] = v4.slice(1).map(Number);
    if (a === 0 || a === 10 || a === 127) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a >= 224) return true;
  }
  return false;
}

/**
 * Thumbnail proxy for Bangla news portals.
 *
 * Several outlets reject foreign `Referer` headers or serve protocol-relative
 * image paths, which shows up as a broken image in coverage cards. This route
 * fetches the image server-side with the outlet's own origin as referer and
 * streams it back, so the card renders reliably. It is deliberately narrow:
 * http(s) only, public hosts only, images only, 6 MB cap, 10 s timeout.
 */
export async function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get("url") ?? "";
  if (!raw) return NextResponse.json({ error: "url is required" }, { status: 400 });

  let target: URL;
  try {
    target = new URL(raw);
  } catch {
    return NextResponse.json({ error: "invalid url" }, { status: 400 });
  }
  if (target.protocol !== "https:" && target.protocol !== "http:") {
    return NextResponse.json({ error: "unsupported protocol" }, { status: 400 });
  }
  if (isBlockedHost(target.hostname)) {
    return NextResponse.json({ error: "blocked host" }, { status: 400 });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const browserHeaders: Record<string, string> = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      "Accept-Language": "bn-BD,bn;q=0.9,en;q=0.8",
      "Cache-Control": "no-cache",
    };

    const load = (withReferer: boolean) =>
      fetch(target, {
        signal: controller.signal,
        headers: withReferer ? { ...browserHeaders, Referer: `${target.origin}/` } : browserHeaders,
        cache: "no-store",
      });

    // Some CDNs reject a same-origin referer; retry once without it.
    let response = await load(true);
    if (!response.ok) response = await load(false);

    if (!response.ok) return NextResponse.json({ error: `upstream ${response.status}` }, { status: 502 });

    const type = response.headers.get("content-type") ?? "";
    if (!type.startsWith("image/")) return NextResponse.json({ error: "not an image" }, { status: 415 });

    const length = Number(response.headers.get("content-length") ?? "0");
    if (length > MAX_BYTES) return NextResponse.json({ error: "image too large" }, { status: 413 });

    const buffer = await response.arrayBuffer();
    if (buffer.byteLength > MAX_BYTES) return NextResponse.json({ error: "image too large" }, { status: 413 });

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "could not fetch image" }, { status: 504 });
  } finally {
    clearTimeout(timer);
  }
}
