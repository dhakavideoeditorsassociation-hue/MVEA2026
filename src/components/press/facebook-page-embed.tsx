"use client";

import { useEffect, useRef, useState } from "react";

import { FACEBOOK_PAGE } from "@/lib/brand";

const MIN_WIDTH = 280;
const MAX_WIDTH = 500;
const EMBED_HEIGHT = 640;

/**
 * Responsive Facebook Page plugin.
 *
 * The plugin only accepts a fixed pixel width, so the iframe width is measured
 * from its container with a ResizeObserver, clamped to 280–500px (Facebook's
 * supported range) and fed back into the URL. The iframe is never wider than the
 * container, so the timeline no longer gets clipped on the right inside the
 * sidebar, and vertical scrolling stays native (`scrolling="yes"`).
 */
export function FacebookPageEmbed({ pageUrl = FACEBOOK_PAGE, title }: { pageUrl?: string; title?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(MIN_WIDTH);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const measure = (nextWidth: number) => {
      const clamped = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Math.floor(nextWidth)));
      setWidth((current) => (current === clamped ? current : clamped));
    };

    measure(element.clientWidth);

    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) measure(entry.contentRect.width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const src =
    `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(pageUrl)}` +
    `&tabs=timeline&width=${width}&height=${EMBED_HEIGHT}` +
    "&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true";

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      <iframe
        key={width}
        src={src}
        title={title ?? "Facebook page"}
        width={width}
        height={EMBED_HEIGHT}
        style={{ width, maxWidth: "100%", height: EMBED_HEIGHT, border: "none", overflow: "hidden" }}
        scrolling="yes"
        frameBorder="0"
        allow="encrypted-media"
        loading="lazy"
        className="mx-auto block"
      />
    </div>
  );
}
