"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, ExternalLink, Newspaper } from "lucide-react";

import { PageHero } from "@/components/common/page-hero";
import { PressCard } from "@/components/press/press-card";
import { buttonVariants } from "@/components/ui/button";
import { useSiteSettings } from "@/lib/cms/site-settings";
import { useI18n } from "@/lib/i18n/provider";
import type { PressArticle } from "@/lib/types";
import { cn } from "@/lib/utils";

type CoverageArchiveViewProps = {
  articles: PressArticle[];
  outlets: string[];
  activeOutlet?: string;
  page: number;
  totalPages: number;
};

function pageHref(page: number, outlet?: string) {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (outlet) params.set("outlet", outlet);
  const query = params.toString();
  return query ? `/media-coverage?${query}` : "/media-coverage";
}

/**
 * Full news archive: outlet filter pills plus numbered pagination (9 per page).
 */
export function CoverageArchiveView({ articles, outlets, activeOutlet, page, totalPages }: CoverageArchiveViewProps) {
  const { t } = useI18n();
  const { settings } = useSiteSettings();
  const hidden = settings.deletedIds?.press ?? [];
  const visible = articles.filter((article) => !hidden.includes(article.id));

  return (
    <>
      <PageHero eyebrow={t("coverage.eyebrow")} title={t("coverage.title")} subtitle={t("coverage.subtitle")}>
        <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto pb-1">
          <Link
            href={pageHref(1)}
            className={cn(
              "inline-flex shrink-0 items-center rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
              !activeOutlet
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {t("common.all")}
          </Link>
          {outlets.map((outlet) => (
            <Link
              key={outlet}
              href={pageHref(1, outlet)}
              className={cn(
                "inline-flex shrink-0 items-center rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                activeOutlet === outlet
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {outlet}
            </Link>
          ))}
        </div>
      </PageHero>

      <section className="container py-10 lg:py-14">
        {visible.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card/50 px-6 py-16 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground">
              <Newspaper className="h-5 w-5" aria-hidden />
            </span>
            <h2 className="mt-4 text-lg font-semibold text-foreground">{t("coverage.empty.title")}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{t("coverage.empty.body")}</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((article) => (
              <PressCard key={article.id} article={article} />
            ))}
          </div>
        )}

        {totalPages > 1 ? (
          <nav aria-label={t("coverage.eyebrow")} className="mt-10 flex flex-wrap items-center justify-center gap-1.5">
            <Link
              href={pageHref(Math.max(1, page - 1), activeOutlet)}
              aria-disabled={page <= 1}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "gap-1",
                page <= 1 && "pointer-events-none opacity-40",
              )}
            >
              <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
              {t("home.hero.prev")}
            </Link>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
              <Link
                key={number}
                href={pageHref(number, activeOutlet)}
                aria-current={number === page ? "page" : undefined}
                className={cn(
                  "inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2.5 text-sm font-semibold transition-colors",
                  number === page
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
                )}
              >
                {number}
              </Link>
            ))}

            <Link
              href={pageHref(Math.min(totalPages, page + 1), activeOutlet)}
              aria-disabled={page >= totalPages}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "gap-1",
                page >= totalPages && "pointer-events-none opacity-40",
              )}
            >
              {t("home.hero.next")}
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
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
