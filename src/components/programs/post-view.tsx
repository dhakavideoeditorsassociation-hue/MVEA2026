"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock, UserRound } from "lucide-react";

import { Markdown } from "@/components/common/markdown";
import { Badge } from "@/components/ui/badge";import { categoryKey } from "@/lib/categories";
import { formatDate, formatNumber } from "@/lib/format";
import { useI18n } from "@/lib/i18n/provider";
import type { CmsPost } from "@/lib/types";

export function PostView({ post, related }: { post: CmsPost; related: CmsPost[] }) {
  const { t, lang, tx } = useI18n();

  return (
    <article className="pb-16">
      <header className="border-b border-border bg-muted/25">
        <div className="container py-10 lg:py-14">
          <Link
            href="/articles"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            {t("articles.back")}
          </Link>

          <div className="mt-6 max-w-3xl">
            <Badge variant="default">{t(categoryKey(post.category))}</Badge>
            <h1 className="mt-4 text-balance text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
              {tx(post.title)}
            </h1>
            {post.subheadline ? (
              <p className="mt-4 text-pretty text-lg font-medium leading-relaxed text-foreground/85">{tx(post.subheadline)}</p>
            ) : (
              <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">{tx(post.excerpt)}</p>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <UserRound className="h-3.5 w-3.5 text-primary" aria-hidden />
                {t("programs.author")}: {post.author}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-primary" aria-hidden />
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, lang)}</time>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary" aria-hidden />
                {formatNumber(post.readingMinutes, lang)} {t("programs.minutesSuffix")}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:py-14">
        <div>
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-border bg-muted">
            <Image
              src={post.coverImageUrl}
              alt={tx(post.title)}
              fill
              priority
              sizes="(min-width: 1024px) 800px, 100vw"
              className="object-cover"
            />
          </div>

          <div className="mt-8">
            <Markdown text={post.body.map((paragraph) => tx(paragraph)).join("\\n\\n")} />
          </div>

          <div className="mt-8 flex flex-wrap gap-2 border-t border-border pt-5">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="muted">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>

        <aside>
          {related.length > 0 ? (
            <div className="rounded-lg border border-border bg-card p-4 shadow-card">
              <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {t("articles.related")}
              </h2>
              <ul className="mt-3 space-y-3">
                {related.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/articles/${item.slug}`}
                      className="block text-sm font-medium leading-snug text-foreground transition-colors hover:text-primary"
                    >
                      {tx(item.title)}
                    </Link>
                    <p className="mt-0.5 text-[0.7rem] text-muted-foreground">
                      {formatDate(item.publishedAt, lang)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </div>
    </article>
  );
}
