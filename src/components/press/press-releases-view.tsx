"use client";

import Link from "next/link";
import { ArrowUpRight, CalendarDays, FileText, Hash } from "lucide-react";

import { FacebookIcon } from "@/components/brand-icons";
import { PageHero } from "@/components/common/page-hero";
import { FacebookPageEmbed } from "@/components/press/facebook-page-embed";
import { CoverageThumb } from "@/components/press/coverage-thumb";
import { Badge } from "@/components/ui/badge";
import { FACEBOOK_PAGE } from "@/lib/brand";
import { formatShortDate } from "@/lib/format";
import { useSiteSettings } from "@/lib/cms/site-settings";
import { useI18n } from "@/lib/i18n/provider";
import type { PressRelease } from "@/lib/types";

/**
 * Press releases: full-text statements plus the live Facebook timeline.
 *
 * The embed is rendered by `FacebookPageEmbed`, which measures its container so
 * the 500px-wide plugin never overflows the sidebar. The surrounding card
 * explains where to go when a browser or network blocks third-party iframes.
 */
export function PressReleasesView({ releases }: { releases: PressRelease[] }) {
  const { t, lang, tx } = useI18n();
  const { settings } = useSiteSettings();
  const hidden = settings.deletedIds?.releases ?? [];
  const visibleReleases = releases.filter((release) => !hidden.includes(release.id));

  return (
    <>
      <PageHero eyebrow={t("pressrelease.eyebrow")} title={t("pressrelease.title")} subtitle={t("pressrelease.subtitle")} />

      <section className="container py-10 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-4">
            {visibleReleases.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border bg-card/60 px-6 py-14 text-center text-sm text-muted-foreground">
                {t("pressrelease.empty")}
              </p>
            ) : (
              visibleReleases.map((release) => (
                <article
                  key={release.id}
                  className="group overflow-hidden rounded-lg border border-border bg-card shadow-card transition-all duration-300 ease-smooth hover:border-primary/40 hover:shadow-lift"
                >
                  <div className="flex flex-col sm:flex-row">
                    <Link
                      href={`/press-releases/${release.slug}`}
                      className="relative block aspect-[16/10] shrink-0 overflow-hidden bg-muted sm:aspect-auto sm:w-56"
                    >
                      <CoverageThumb
                        src={release.imageUrl}
                        alt={tx(release.title)}
                        source="MVEA"
                        sizes="(min-width: 640px) 224px, 90vw"
                        proxied={false}
                      />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col gap-2 p-5">
                      <div className="flex flex-wrap items-center gap-2 text-[0.7rem] font-medium text-muted-foreground">
                        <Badge variant="default" className="gap-1">
                          <FacebookIcon className="h-3 w-3" aria-hidden />
                          {t("pressrelease.official")}
                        </Badge>
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                          <time dateTime={release.publishedAt}>{formatShortDate(release.publishedAt, lang)}</time>
                        </span>
                        {release.refNo ? (
                          <span className="inline-flex items-center gap-1">
                            <Hash className="h-3.5 w-3.5" aria-hidden />
                            {release.refNo}
                          </span>
                        ) : null}
                      </div>
                      <h2 className="text-balance text-lg font-semibold leading-snug text-foreground">
                        <Link href={`/press-releases/${release.slug}`} className="transition-colors hover:text-primary">
                          {tx(release.title)}
                        </Link>
                      </h2>
                      {release.subheadline ? (
                        <p className="text-sm font-medium leading-relaxed text-foreground/80">{tx(release.subheadline)}</p>
                      ) : null}
                      <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{tx(release.excerpt)}</p>
                      <Link
                        href={`/press-releases/${release.slug}`}
                        className="mt-auto inline-flex items-center gap-1.5 pt-1 text-xs font-semibold text-primary"
                      >
                        {t("pressrelease.readFull")}
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                      </Link>
                    </div>
                  </div>
                </article>
              ))
            )}
            <p className="pt-2 text-xs text-muted-foreground">{t("pressrelease.contact")}</p>
          </div>

          <aside className="space-y-3">
            <div className="rounded-lg border border-border bg-card p-4 shadow-card">
              <h2 className="text-sm font-semibold text-foreground">{t("pressrelease.fbTitle")}</h2>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t("pressrelease.fbBody")}</p>
              <div className="mt-3 w-full overflow-hidden rounded-md border border-border bg-background">
                <FacebookPageEmbed title={t("pressrelease.fbTitle")} />
              </div>
              <p className="mt-3 text-[0.7rem] leading-relaxed text-muted-foreground">{t("pressrelease.fbFallback")}</p>
              <a
                href={FACEBOOK_PAGE}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
              >
                <FacebookIcon className="h-3.5 w-3.5" />
                {t("pressrelease.fbOpen")}
              </a>
            </div>
            <div className="rounded-lg border border-dashed border-border p-4 text-xs leading-relaxed text-muted-foreground">
              <FileText className="mb-2 h-4 w-4 text-primary" aria-hidden />
              {t("pressrelease.subtitle")}
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
