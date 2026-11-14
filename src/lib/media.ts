/**
 * Media URL helpers: safe showreel embeds and external link validation.
 * Everything here is pure so it can run on the server and in the browser.
 */

export type ShowreelEmbed = {
  provider: "youtube" | "vimeo";
  embedUrl: string;
  watchUrl: string;
};

export function isSafeHttpUrl(raw: string): boolean {
  try {
    const url = new URL(raw);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function parseYouTubeId(url: URL): string | null {
  const host = url.hostname.replace(/^www\./, "");
  if (host === "youtu.be") {
    return url.pathname.slice(1).split("/")[0] || null;
  }
  if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
    if (url.pathname === "/watch") return url.searchParams.get("v");
    const match = url.pathname.match(/^\/(?:embed|shorts|v)\/([A-Za-z0-9_-]{6,})/);
    if (match) return match[1];
  }
  return null;
}

function parseVimeoId(url: URL): string | null {
  const host = url.hostname.replace(/^www\./, "");
  if (host !== "vimeo.com" && host !== "player.vimeo.com") return null;
  const match = url.pathname.match(/(\d{6,})/);
  return match ? match[1] : null;
}

/** Turn a YouTube/Vimeo watch link into a privacy friendly embed descriptor. */
export function parseShowreel(raw?: string | null): ShowreelEmbed | null {
  if (!raw) return null;
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  if (!isSafeHttpUrl(url.toString())) return null;

  const youTubeId = parseYouTubeId(url);
  if (youTubeId) {
    return {
      provider: "youtube",
      embedUrl: `https://www.youtube-nocookie.com/embed/${youTubeId}?rel=0`,
      watchUrl: `https://www.youtube.com/watch?v=${youTubeId}`,
    };
  }

  const vimeoId = parseVimeoId(url);
  if (vimeoId) {
    return {
      provider: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeoId}`,
      watchUrl: `https://vimeo.com/${vimeoId}`,
    };
  }

  return null;
}

/** Strip protocol/trailing slash so external links look tidy in the UI. */
export function prettyHost(raw: string): string {
  try {
    return new URL(raw).hostname.replace(/^www\./, "");
  } catch {
    return raw;
  }
}
