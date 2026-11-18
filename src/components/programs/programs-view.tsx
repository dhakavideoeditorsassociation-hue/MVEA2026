"use client";

import Link from "next/link";
import { FolderOpen } from "lucide-react";

import { PageHero } from "@/components/common/page-hero";
import { PostCard } from "@/components/programs/post-card";
import { categoryKey, POST_CATEGORIES } from "@/lib/categories";
import { useSiteSettings } from "@/lib/cms/site-settings";
import { mergeEditorial, useLiveEditorial } from "@/lib/live/editorial";
import { useI18n } from "@/lib/i18n/provider";
import type { CmsPost, PostCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

type ProgramsViewProps = {
  posts: CmsPost[];
  activeCategory?: PostCategory;
  counts: Record<string, number>;
  basePath?: string;
};

export function ProgramsView({ posts, activeCategory, counts, basePath = "/articles" }: ProgramsViewProps) {
  const { t } = useI18n();
  const { settings } = useSiteSettings();
  const live = useLiveEditorial();
  const merged = mergeEditorial(posts, live.articles, { deleted: settings.deletedIds?.articles });
  const visiblePosts = activeCategory ? merged.filter((post) => post.category === activeCategory) : merged;

  const tabs: Array<{ key: string; href: string; label: string; count: number }> = [
    { key: "all", href: basePath, label: t("programs.filter.all"), count: counts.all ?? 0 },
    ...POST_CATEGORIES.map((category) => ({
      key: category,
      href: `${basePath}?category=${category}`,
      label: t(categoryKey(category)),
      count: counts[category] ?? 0,
    })),
  ];

  return (
    <>
      <PageHero eyebrow={t("articles.eyebrow")} title={t("articles.title")} subtitle={t("articles.subtitle")}>
        <nav aria-label={t("articles.eyebrow")} className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto pb-1">
          {tabs.map((tab) => {
            const isActive = activeCategory ? tab.key === activeCategory : tab.key === "all";
            return (
              <Link
                key={tab.key}
                href={tab.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                )}
              >
                {tab.label}
                <span className={cn("text-[0.65rem]", isActive ? "text-primary-foreground/80" : "text-muted-foreground/70")}>
                  {tab.count}
                </span>
              </Link>
            );
          })}
        </nav>
      </PageHero>

      <section className="container py-10 lg:py-14">
        {visiblePosts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card/50 px-6 py-16 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground">
              <FolderOpen className="h-5 w-5" aria-hidden />
            </span>
            <h2 className="mt-4 text-lg font-semibold text-foreground">{t("articles.empty.title")}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{t("articles.empty.body")}</p>
            <Link href={basePath} className="mt-6 inline-block text-sm font-semibold text-primary hover:underline">
              {t("programs.filter.all")}
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visiblePosts.map((post, index) => (
              <PostCard key={post.id} post={post} className={index === 0 && !activeCategory ? "sm:col-span-2 lg:col-span-2" : undefined} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
