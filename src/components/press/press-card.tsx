"use client";

import Image from "next/image";
import { ArrowUpRight, CalendarDays, Newspaper } from "lucide-react";

import { formatShortDate } from "@/lib/format";
import { useI18n } from "@/lib/i18n/provider";
import { prettyHost } from "@/lib/media";
import type { PressArticle } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PressCard({ article, className }: { article: PressArticle; className?: string }) {
  const { lang, tx, t } = useI18n();

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card transition-all duration-300 ease-smooth hover:-translate-y-1 hover:border-primary/40 hover:shadow-lift",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <Image
          src={article.imageUrl}
          alt={tx(article.title)}
          fill
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-[1.04]"
        />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-background/92 px-2.5 py-1 text-[0.68rem] font-bold text-foreground shadow-sm backdrop-blur">
          <Newspaper className="h-3 w-3 text-primary" aria-hidden />
          {article.source}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="flex items-center gap-2 text-[0.7rem] font-medium text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" aria-hidden />
          <time dateTime={article.publishedAt}>{formatShortDate(article.publishedAt, lang)}</time>
          <span aria-hidden>·</span>
          <span dir="ltr">{prettyHost(article.url)}</span>
        </div>
        <h3 className="text-balance text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
          {tx(article.title)}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{tx(article.excerpt)}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-xs font-semibold text-primary">
          {t("coverage.readOriginal")}
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
        </span>
      </div>
    </a>
  );
}
