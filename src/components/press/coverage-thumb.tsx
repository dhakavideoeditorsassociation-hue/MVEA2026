"use client";

import { useState } from "react";
import Image from "next/image";
import { Newspaper } from "lucide-react";

import { cn } from "@/lib/utils";

type CoverageThumbProps = {
  src?: string;
  alt: string;
  source: string;
  sizes?: string;
  className?: string;
  /** Use the server-side proxy (default) instead of the raw URL. */
  proxied?: boolean;
};

function proxiedUrl(url: string): string {
  if (!url.startsWith("http")) return url;
  return `/api/image-proxy?url=${encodeURIComponent(url)}`;
}

/**
 * News thumbnail with a branded outlet fallback.
 *
 * Bangla news CDNs frequently reject foreign referers, expire paths or block
 * hotlinking; when the image 404s the card must still look intentional, so the
 * fallback is an editorial cover stamped with the outlet name instead of the
 * browser's broken-image icon.
 */
export function CoverageThumb({ src, alt, source, sizes = "(min-width: 1024px) 380px, 45vw, 90vw", className, proxied = true }: CoverageThumbProps) {
  const [failed, setFailed] = useState(false);
  const resolved = src ? (proxied ? proxiedUrl(src) : src) : "";

  if (!resolved || failed) {
    return (
      <span
        aria-label={source}
        className={cn(
          "relative flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary/12 via-card to-secondary/12 px-4 text-center",
          className,
        )}
      >
        <Newspaper className="h-7 w-7 text-primary/70" aria-hidden />
        <span className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-foreground/80">{source}</span>
        <span className="text-[0.6rem] uppercase tracking-[0.18em] text-muted-foreground">Press coverage</span>
      </span>
    );
  }

  return (
    <Image
      src={resolved}
      alt={alt}
      fill
      sizes={sizes}
      unoptimized
      onError={() => setFailed(true)}
      className={cn("object-cover transition-transform duration-500 ease-smooth group-hover:scale-[1.03]", className)}
    />
  );
}
