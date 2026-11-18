"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays } from "lucide-react";

import { FacebookIcon } from "@/components/brand-icons";
import { LOGO_SRC } from "@/lib/brand";
import { formatShortDate } from "@/lib/format";
import { useI18n } from "@/lib/i18n/provider";
import type { PressRelease } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Official statement card.
 *
 * The card opens the full-text reader (journalists can copy the statement
 * there); the Facebook photocard stays one click away via the footer link. When
 * no thumbnail could be scraped the branded emblem is used, so the card never
 * renders a broken image.
 */
export function PressReleaseCard({ release, className }: { release: PressRelease; className?: string }) {
  const { t, lang, tx } = useI18n();
  const href = `/press-releases/${release.slug}`;

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card transition-all duration-300 ease-smooth hover:-translate-y-1 hover:border-primary/40 hover:shadow-lift",
        className,
      )}
    >
      <Link href={href} className="relative block aspect-[16/9] overflow-hidden bg-gradient-to-br from-primary/12 via-card to-secondary/10">
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
      </Link>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="flex items-center gap-2 text-[0.7rem] font-medium text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" aria-hidden />
          <time dateTime={release.publishedAt}>{formatShortDate(release.publishedAt, lang)}</time>
          {release.refNo ? <span className="truncate">· {release.refNo}</span> : null}
        </div>
        <h3 className="text-balance text-base font-semibold leading-snug text-foreground">
          <Link href={href} className="transition-colors hover:text-primary">
            {tx(release.title)}
          </Link>
        </h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{tx(release.excerpt)}</p>
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-border/70 pt-2.5">
          <Link href={href} className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
            {t("pressrelease.readFull")}
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
          <a
            href={release.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("pressrelease.fbOpen")}
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <FacebookIcon className="h-3.5 w-3.5" />
            Facebook
          </a>
        </div>
      </div>
    </article>
  );
}
