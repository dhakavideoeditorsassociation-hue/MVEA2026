"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { categoryKey } from "@/lib/categories";
import { formatShortDate, formatNumber } from "@/lib/format";
import { useI18n } from "@/lib/i18n/provider";
import type { CmsPost } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PostCard({ post, className, basePath = "/articles" }: { post: CmsPost; className?: string; basePath?: string }) {
  const { t, lang, tx } = useI18n();

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card transition-all duration-300 ease-smooth hover:-translate-y-1 hover:border-primary/40 hover:shadow-lift",
        className,
      )}
    >
      <Link href={`${basePath}/${post.slug}`} className="relative block aspect-[16/9] overflow-hidden bg-muted">
        <Image
          src={post.coverImageUrl}
          alt={tx(post.title)}
          fill
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-[1.04]"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="flex items-center gap-2">
          <Badge variant="default">{t(categoryKey(post.category))}</Badge>
          <span className="inline-flex items-center gap-1 text-[0.7rem] font-medium text-muted-foreground">
            <Clock className="h-3 w-3" aria-hidden />
            {formatNumber(post.readingMinutes, lang)} {t("programs.minutesSuffix")}
          </span>
        </div>
        <h3 className="text-balance text-base font-semibold leading-snug text-foreground">
          <Link href={`${basePath}/${post.slug}`} className="transition-colors hover:text-primary">
            {tx(post.title)}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{tx(post.excerpt)}</p>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/70 pt-3">
          <time className="text-xs text-muted-foreground" dateTime={post.publishedAt}>
            {formatShortDate(post.publishedAt, lang)}
          </time>
          <Link
            href={`${basePath}/${post.slug}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary"
          >
            {t("programs.card.read")}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}
