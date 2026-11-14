"use client";

import { Newspaper } from "lucide-react";

import { PageHero } from "@/components/common/page-hero";
import { PressCard } from "@/components/press/press-card";
import { useI18n } from "@/lib/i18n/provider";
import type { PressArticle } from "@/lib/types";

export function CoverageView({ articles }: { articles: PressArticle[] }) {
  const { t } = useI18n();

  return (
    <>
      <PageHero eyebrow={t("coverage.eyebrow")} title={t("coverage.title")} subtitle={t("coverage.subtitle")} />

      <section className="container py-10 lg:py-14">
        {articles.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card/50 px-6 py-16 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground">
              <Newspaper className="h-5 w-5" aria-hidden />
            </span>
            <h2 className="mt-4 text-lg font-semibold text-foreground">{t("coverage.empty.title")}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{t("coverage.empty.body")}</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <PressCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
