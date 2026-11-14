"use client";

import { Newspaper } from "lucide-react";

import { PageHero } from "@/components/common/page-hero";
import { PressCard } from "@/components/press/press-card";
import { PressReleaseCard } from "@/components/press/press-release-card";
import { useI18n } from "@/lib/i18n/provider";
import type { PressArticle, PressRelease } from "@/lib/types";

export function CoverageView({
  articles,
  releases,
}: {
  articles: PressArticle[];
  releases: PressRelease[];
}) {
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

      <section id="press-releases" className="border-t border-border bg-muted/25">
        <div className="container py-12 lg:py-16">
          <p className="eyebrow">
            <span className="h-px w-6 bg-primary" aria-hidden />
            {t("releases.eyebrow")}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{t("releases.title")}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{t("releases.subtitle")}</p>

          {releases.length === 0 ? (
            <div className="mt-8 rounded-lg border border-dashed border-border bg-card/50 px-6 py-12 text-center">
              <h3 className="text-base font-semibold text-foreground">{t("releases.empty.title")}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t("releases.empty.body")}</p>
            </div>
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {releases.map((release) => (
                <PressReleaseCard key={release.id} release={release} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
