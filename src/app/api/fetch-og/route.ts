import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

import type { FetchOgResult } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 1_500_000;
const TIMEOUT_MS = 8_000;
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36 GVEA-LinkPreview/1.0";

type OgError = { ok: false; error: string; status: number };

/** Reject hosts that must never be reachable from the server (SSRF guard). */
function isBlockedHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/\.$/, "");

  if (host === "localhost" || host === "0.0.0.0" || host.endsWith(".localhost")) return true;
  if (host.endsWith(".local") || host.endsWith(".internal") || host.endsWith(".home.arpa")) return true;
  if (host === "[::1]" || host.startsWith("[")) return true;

  const v4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (v4) {
    const octets = v4.slice(1).map(Number);
    if (octets.some((part) => Number.isNaN(part) || part > 255)) return true;
    const [a, b] = octets;
    if (a === 0 || a === 10 || a === 127) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 100 && b >= 64 && b <= 127) return true;
    if (a >= 224) return true;
  }

  return false;
}

function parseTargetUrl(raw: string): URL | string {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return "Enter a complete URL, for example https://www.prothomalo.com/story";
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return "Only http and https links can be imported.";
  }
  if (url.username || url.password) {
    return "URLs with embedded credentials are rejected.";
  }
  if (url.port && url.port !== "80" && url.port !== "443") {
    return "Only standard web ports are allowed.";
  }
  if (isBlockedHost(url.hostname)) {
    return "That host is not allowed.";
  }
  return url;
}

function readMeta($: cheerio.CheerioAPI, key: string): string {
  const value =
    $(`meta[property="${key}"]`).attr("content") ??
    $(`meta[name="${key}"]`).attr("content") ??
    $(`meta[itemprop="${key}"]`).attr("content") ??
    "";
  return value.trim();
}

function absolutise(value: string, base: string): string | null {
  if (!value) return null;
  try {
    return new URL(value, base).toString();
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get("url") ?? "";
  return handle(url);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json<OgError>({ ok: false, error: "Expected a JSON body.", status: 400 }, { status: 400 });
  }

  const url = typeof (body as { url?: unknown })?.url === "string" ? (body as { url: string }).url : "";
  return handle(url);
}

async function handle(rawUrl: string) {
  if (!rawUrl) {
    return NextResponse.json<OgError>(
      { ok: false, error: "Query parameter `url` is required.", status: 400 },
      { status: 400 },
    );
  }

  const target = parseTargetUrl(rawUrl);
  if (typeof target === "string") {
    return NextResponse.json<OgError>({ ok: false, error: target, status: 400 }, { status: 400 });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(target, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "bn,en;q=0.8",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json<OgError>(
        { ok: false, error: `The publisher returned HTTP ${response.status}.`, status: 502 },
        { status: 502 },
      );
    }

    // A redirect could land on an internal address; re-check the final URL.
    const finalUrl = response.url || target.toString();
    if (isBlockedHost(new URL(finalUrl).hostname)) {
      return NextResponse.json<OgError>({ ok: false, error: "Redirected to a blocked host.", status: 400 }, { status: 400 });
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
      return NextResponse.json<OgError>(
        { ok: false, error: "That link is not an HTML article page.", status: 415 },
        { status: 415 },
      );
    }

    const declaredLength = Number(response.headers.get("content-length") ?? "0");
    if (declaredLength > MAX_BYTES) {
      return NextResponse.json<OgError>({ ok: false, error: "The page is too large to preview.", status: 413 }, { status: 413 });
    }

    const html = await response.text();
    if (html.length > MAX_BYTES) {
      return NextResponse.json<OgError>({ ok: false, error: "The page is too large to preview.", status: 413 }, { status: 413 });
    }

    const $ = cheerio.load(html);
    const siteName = readMeta($, "og:site_name") || new URL(finalUrl).hostname.replace(/^www\./, "");
    const title =
      readMeta($, "og:title") ||
      readMeta($, "twitter:title") ||
      $("h1").first().text().trim() ||
      $("title").first().text().trim();
    const description =
      readMeta($, "og:description") || readMeta($, "twitter:description") || readMeta($, "description");
    const image =
      absolutise(readMeta($, "og:image") || readMeta($, "twitter:image"), finalUrl) ??
      absolutise($('link[rel="image_src"]').attr("href") ?? "", finalUrl);
    const publishedAt =
      readMeta($, "article:published_time") ||
      readMeta($, "og:updated_time") ||
      $("time[datetime]").first().attr("datetime") ||
      null;

    if (!title) {
      return NextResponse.json<OgError>(
        { ok: false, error: "No headline could be extracted from that page.", status: 422 },
        { status: 422 },
      );
    }

    const data: FetchOgResult = {
      url: finalUrl,
      title: title.slice(0, 300),
      description: description.slice(0, 600),
      image,
      siteName: siteName.slice(0, 120),
      publishedAt,
    };

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";
    return NextResponse.json<OgError>(
      {
        ok: false,
        error: aborted ? "The publisher did not respond in time." : "Could not reach that link.",
        status: 504,
      },
      { status: aborted ? 504 : 502 },
    );
  } finally {
    clearTimeout(timer);
  }
}
