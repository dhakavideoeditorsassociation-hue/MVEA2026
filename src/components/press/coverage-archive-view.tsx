"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ExternalLink, Newspaper } from "lucide-react";

import { PageHero } from "@/components/common/page-hero";
import { PressCard } from "@/components/press/press-card";
import { buttonVariants } from "@/components/ui/button";
import { useSiteSettings } from "@/lib/cms/site-settings";
import { useI18n } from "@/lib/i18n/provider";
import { mergeEditorial, useLiveEditorial } from "@/lib/live/editorial";
import type { PressArticle } from "@/lib/types";
import { cn } from "@/lib/utils";

const PER_PAGE = 9;

type CoverageArchiveViewProps = {
  /** All seeded coverage; live Firestore items are merged in at runtime. */
  articles: PressArticle[];
  initialOutlet?: string;
  initialPage?: number;
};

/**
 * News archive.
 *
 * Pagination and the outlet filter run on the merged (seed + Firestore) list so
 * an item added, edited or removed in `/admin` is reflected immediately without a
 * rebuild. Page state is local; the initial values come from the URL.
 */
export function CoverageArchiveView({ articles, initialOutlet, initialPage = 1 }: CoverageArchiveViewProps) {
  const { t } = useI18n();
  const { settings } = useSiteSettings();
  const live = useLiveEditorial();

  const [outlet, setOutlet] = useState(initialOutlet ?? "");
  const [page, setPage] = useState(initialPage);

  const merged = useMemo(
    () => mergeEditorial(articles, live.coverage, { deleted: settings.deletedIds?.press, urlOf: (article) => article.url }),
    [articles, live.coverage, settings.deletedIds?.press],
  );

  const outlets = useMemo(() => Array.from(new Set(merged.map((article) => article.source))).sort(), [merged]);

  const filtered = outlet ? merged.filter((article) => article.source === outlet) : merged;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  function chooseOutlet(next: string) {
    setOutlet(next);
    setPage(1);
  }

  return (
    <>
      <PageHero eyebrow={t("coverage.eyebrow")} title={t("coverage.title")} subtitle={t("coverage.subtitle")}>
        <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => chooseOutlet("")}
            className={cn(
              "inline-flex shrink-0 items-center rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
              !outlet
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {t("common.all")}
          </button>
          {outlets.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => chooseOutlet(name)}
              className={cn(
                "inline-flex shrink-0 items-center rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                outlet === name
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {name}
            </button>
          ))}
        </div>
      </PageHero>

      <section className="container py-10 lg:py-14">
        {pageItems.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card/50 px-6 py-16 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground">
              <Newspaper className="h-5 w-5" aria-hidden />
            </span>
            <h2 className="mt-4 text-lg font-semibold text-foreground">{t("coverage.empty.title")}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{t("coverage.empty.body")}</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pageItems.map((article) => (
              <PressCard key={article.id} article={article} />
            ))}
          </div>
        )}

        {totalPages > 1 ? (
          <nav aria-label={t("coverage.eyebrow")} className="mt-10 flex flex-wrap items-center justify-center gap-1.5">
            <button
              type="button"
              onClick={() => setPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1", currentPage <= 1 && "opacity-40")}
            >
              <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
              {t("home.hero.prev")}
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
              <button
                key={number}
                type="button"
                onClick={() => setPage(number)}
                aria-current={number === currentPage ? "page" : undefined}
                className={cn(
                  "inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2.5 text-sm font-semibold transition-colors",
                  number === currentPage
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
                )}
              >
                {number}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1", currentPage >= totalPages && "opacity-40")}
            >
              {t("home.hero.next")}
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            </button>
          </nav>
        ) : null}

        <p className="mt-8 text-center text-xs text-muted-foreground">
          <Link href="/press-releases" className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline">
            {t("pressrelease.seeAll")}
            <ExternalLink className="h-3 w-3" aria-hidden />
          </Link>
        </p>
      </section>
    </>
  );
}
