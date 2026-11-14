"use client";

import Image from "next/image";
import { CalendarDays, ExternalLink } from "lucide-react";

import { FacebookIcon } from "@/components/brand-icons";
import { LOGO_SRC } from "@/lib/brand";
import { formatShortDate } from "@/lib/format";
import { useI18n } from "@/lib/i18n/provider";
import type { PressRelease } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * A statement published by the association itself. The whole card is a link to
 * the Facebook post; when no thumbnail could be scraped, the branded emblem is
 * used instead so the card never looks broken.
 */
export function PressReleaseCard({ release, className }: { release: PressRelease; className?: string }) {
  const { t, lang, tx } = useI18n();

  return (
    <a
      href={release.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card transition-all duration-300 ease-smooth hover:-translate-y-1 hover:border-primary/40 hover:shadow-lift",
        className,
      )}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-primary/12 via-card to-secondary/10">
        {release.imageUrl ? (
          <Image
            src={release.imageUrl}
            alt=""
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-[1.03]"
            unoptimized
          />
        ) : (
          <span className="grid h-full place-items-center">
            <span className="grid h-24 w-24 place-items-center overflow-hidden rounded-full bg-white ring-1 ring-border">
              <Image src={LOGO_SRC} alt="" width={96} height={96} className="h-24 w-24 object-contain p-[8%]" unoptimized />
            </span>
          </span>
        )}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-background/92 px-2.5 py-1 text-[0.66rem] font-bold text-foreground shadow-sm backdrop-blur">
          <FacebookIcon className="h-3 w-3 text-[#1877F2]" />
          {t("releases.badge")}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="flex items-center gap-2 text-[0.7rem] font-medium text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" aria-hidden />
          <time dateTime={release.publishedAt}>{formatShortDate(release.publishedAt, lang)}</time>
        </div>
        <h3 className="text-balance text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
          {tx(release.title)}
        </h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{tx(release.excerpt)}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-xs font-semibold text-primary">
          {t("releases.open")}
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        </span>
      </div>
    </a>
  );
}
