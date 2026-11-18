import * as cheerio from "cheerio";

import type { FetchOgResult } from "@/lib/types";

/**
 * Server-side link preview extraction.
 *
 * Shared by `/api/fetch-og` (newspaper coverage) and `/api/link-preview`
 * (Facebook press releases). Everything here is defensive: the route is a
 * server-side fetch primitive, so it must never be usable to reach internal
 * hosts, and it must fail loudly rather than hang.
 */

const MAX_BYTES = 1_500_000;
const TIMEOUT_MS = 9_000;
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

export type LinkPreviewFailure = {
  ok: false;
  status: number;
  code: "invalid" | "blocked" | "unreachable" | "timeout" | "not-html" | "too-large" | "no-title";
  error: string;
  hint?: string;
};

export type LinkPreview = {
  ok: true;
  data: FetchOgResult;
  platform: "facebook" | "web";
};

export type LinkPreviewResult = LinkPreview | LinkPreviewFailure;

export function isFacebookUrl(url: URL): boolean {
  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  return host === "facebook.com" || host === "fb.com" || host === "fb.watch" || host.endsWith(".facebook.com");
}

/** Reject hosts that must never be reachable from the server (SSRF guard). */
function isBlockedHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/\.$/, "");

  if (host === "localhost" || host === "0.0.0.0" || host.endsWith(".localhost")) return true;
  if (host.endsWith(".local") || host.endsWith(".internal") || host.endsWith(".home.arpa")) return true;
  if (host.startsWith("[")) return true;

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

/**
 * Normalise mobile / share links so the same post resolves consistently.
 * `https://m.facebook.com/...`, `web.facebook.com`, `mbasic.facebook.com` and
 * older `facebook.com/story.php?id=` links are rewritten to canonical hosts.
 */
export function normalizePreviewUrl(raw: string): URL | LinkPreviewFailure {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return {
      ok: false,
      status: 400,
      code: "invalid",
      error: "Enter a complete URL, for example https://www.facebook.com/…",
    };
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return { ok: false, status: 400, code: "invalid", error: "Only http and https links can be imported." };
  }
  if (url.username || url.password) {
    return { ok: false, status: 400, code: "invalid", error: "URLs with embedded credentials are rejected." };
  }
  if (url.port && url.port !== "80" && url.port !== "443") {
    return { ok: false, status: 400, code: "invalid", error: "Only standard web ports are allowed." };
  }

  const host = url.hostname.toLowerCase();
  if (host === "m.facebook.com" || host === "web.facebook.com" || host === "mbasic.facebook.com") {
    url.hostname = "www.facebook.com";
  }

  if (isBlockedHost(url.hostname)) {
    return { ok: false, status: 400, code: "invalid", error: "That host is not allowed." };
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

/** Text that only appears on Facebook's login wall / bot interstitial. */
function looksLikeLoginWall(html: string): boolean {
  const sample = html.slice(0, 20_000).toLowerCase();
  return (
    sample.includes("you must log in to continue") ||
    sample.includes("log in to facebook") ||
    sample.includes("login_form") ||
    sample.includes("/login/?next=")
  );
}

export async function fetchLinkPreview(rawUrl: string): Promise<LinkPreviewResult> {
  const target = normalizePreviewUrl(rawUrl);
  if (!("protocol" in target)) return target;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(target.toString(), {
      redirect: "follow",
      signal: controller.signal,
      cache: "no-store",
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "bn-BD,bn;q=0.9,en;q=0.8",
        "Cache-Control": "no-cache",
      },
    });

    const finalUrl = response.url || target.toString();
    const finalHost = (() => {
      try {
        return new URL(finalUrl).hostname;
      } catch {
        return target.hostname;
      }
    })();

    if (isBlockedHost(finalHost)) {
      return { ok: false, status: 400, code: "invalid", error: "Redirected to a blocked host." };
    }

    if (!response.ok) {
      // Facebook answers bot requests with 400/403/429 rather than an empty page.
      const blocked =
        response.status === 401 ||
        response.status === 403 ||
        response.status === 429 ||
        (isFacebookUrl(target) && response.status === 400);
      return {
        ok: false,
        status: blocked ? 422 : 502,
        code: blocked ? "blocked" : "unreachable",
        error: `The publisher returned HTTP ${response.status}.`,
        hint: blocked ? "Use the manual fields in the admin form." : undefined,
      };
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
      return { ok: false, status: 415, code: "not-html", error: "That link is not an HTML page." };
    }

    const declaredLength = Number(response.headers.get("content-length") ?? "0");
    if (declaredLength > MAX_BYTES) {
      return { ok: false, status: 413, code: "too-large", error: "The page is too large to preview." };
    }

    const html = await response.text();
    if (html.length > MAX_BYTES) {
      return { ok: false, status: 413, code: "too-large", error: "The page is too large to preview." };
    }

    const $ = cheerio.load(html);
    const isFacebook = isFacebookUrl(target);

    if (isFacebook && looksLikeLoginWall(html) && !readMeta($, "og:title")) {
      return {
        ok: false,
        status: 422,
        code: "blocked",
        error: "Facebook served a login wall instead of the post.",
        hint: "Paste the headline and upload the image manually.",
      };
    }

    const siteName = readMeta($, "og:site_name") || finalHost.replace(/^www\./, "");
    const title =
      readMeta($, "og:title") ||
      readMeta($, "twitter:title") ||
      $("h1").first().text().trim() ||
      $("title").first().text().trim();
    const description =
      readMeta($, "og:description") || readMeta($, "twitter:description") || readMeta($, "description");
    // Some Bangla news sites only expose the lead image via JSON-LD, so check
    // schema.org data after the OpenGraph/Twitter meta tags.
    const jsonLdImage = (() => {
      const scripts = $('script[type="application/ld+json"]');
      for (let index = 0; index < scripts.length; index += 1) {
        try {
          const raw = $(scripts[index]).contents().text();
          if (!raw) continue;
          const parsed: unknown = JSON.parse(raw);
          const stack: unknown[] = Array.isArray(parsed) ? [...parsed] : [parsed];
          while (stack.length > 0) {
            const node = stack.shift();
            if (!node || typeof node !== "object") continue;
            const record = node as Record<string, unknown>;
            const image = record.image;
            if (typeof image === "string" && image) return image;
            if (image && typeof image === "object") {
              const imageRecord = image as Record<string, unknown>;
              if (typeof imageRecord.url === "string" && imageRecord.url) return imageRecord.url;
              if (Array.isArray(image) && typeof image[0] === "string") return image[0] as string;
            }
            if (Array.isArray(record["@graph"])) stack.push(...(record["@graph"] as unknown[]));
          }
        } catch {
          /* malformed JSON-LD is common; ignore */
        }
      }
      return "";
    })();
    const image =
      absolutise(
        readMeta($, "og:image") ||
          readMeta($, "twitter:image") ||
          readMeta($, "image") ||
          jsonLdImage ||
          $('link[rel="image_src"]').attr("href") ||
          "",
        finalUrl,
      );
    const publishedAt =
      readMeta($, "article:published_time") || readMeta($, "og:updated_time") || $("time[datetime]").first().attr("datetime") || null;

    if (!title) {
      return {
        ok: false,
        status: 422,
        code: "blocked",
        error: "No headline could be extracted from that page.",
        hint: isFacebook ? "Facebook often hides the headline from servers. Fill it in manually." : undefined,
      };
    }

    const data: FetchOgResult = {
      url: finalUrl,
      title: title.slice(0, 300),
      description: description.slice(0, 600),
      image,
      siteName: isFacebook ? "Facebook" : siteName.slice(0, 120),
      publishedAt,
    };

    return { ok: true, data, platform: isFacebook ? "facebook" : "web" };
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";
    return {
      ok: false,
      status: aborted ? 504 : 502,
      code: aborted ? "timeout" : "unreachable",
      error: aborted ? "The publisher did not respond in time." : "Could not reach that link.",
    };
  } finally {
    clearTimeout(timer);
  }
}
