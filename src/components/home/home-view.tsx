"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Clapperboard,
  FileText,
  GraduationCap,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react";

import { Avatar } from "@/components/common/avatar";
import { useSiteSettings } from "@/lib/cms/site-settings";
import { mergeEditorial, useLiveEditorial } from "@/lib/live/editorial";
import { SectionHeading } from "@/components/common/section-heading";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { MemberCard } from "@/components/members/member-card";
import { PostCard } from "@/components/programs/post-card";
import { PressCard } from "@/components/press/press-card";
import { PressReleaseCard } from "@/components/press/press-release-card";
import { buttonVariants } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import type { TranslationKey } from "@/lib/i18n/dictionaries";
import { useI18n } from "@/lib/i18n/provider";
import { slugifyName } from "@/lib/slug";
import type {
  CmsPost,
  CommitteeMember,
  HeroSlide,
  Member,
  PressArticle,
  PressRelease,
} from "@/lib/types";

const PILLARS: Array<{ key: string; Icon: typeof Users; title: TranslationKey; desc: TranslationKey }> = [
  { key: "rights", Icon: Users, title: "pillar.rights.title", desc: "pillar.rights.desc" },
  { key: "pipeline", Icon: Wrench, title: "pillar.pipeline.title", desc: "pillar.pipeline.desc" },
  { key: "lab", Icon: GraduationCap, title: "pillar.lab.title", desc: "pillar.lab.desc" },
  { key: "ethics", Icon: ShieldCheck, title: "pillar.ethics.title", desc: "pillar.ethics.desc" },
  { key: "storytelling", Icon: Clapperboard, title: "pillar.storytelling.title", desc: "pillar.storytelling.desc" },
  { key: "archive", Icon: FileText, title: "pillar.archive.title", desc: "pillar.archive.desc" },
];

type HomeViewProps = {
  slides: HeroSlide[];
  featured: Member[];
  press: PressArticle[];
  pressMore: PressArticle[];
  releases: PressRelease[];
  posts: CmsPost[];
  committee: CommitteeMember[];
};

export function HomeView({ slides, featured, press, pressMore, releases, posts, committee }: HomeViewProps) {
  const { t, tx, lang } = useI18n();
  const { settings } = useSiteSettings();
  const live = useLiveEditorial();

  const allPress = mergeEditorial(press.concat(pressMore), live.coverage, {
    deleted: settings.deletedIds?.press,
    urlOf: (article) => article.url,
  });
  const allReleases = mergeEditorial(releases, live.releases, { deleted: settings.deletedIds?.releases });
  const allPosts = mergeEditorial(posts, live.articles, { deleted: settings.deletedIds?.articles });

  const visiblePress = allPress.slice(0, 3);
  const visiblePressMore = allPress.slice(3, 8);
  const visibleReleases = allReleases.slice(0, 3);
  const visiblePosts = allPosts.slice(0, 3);
  const ICONS = PILLARS.map((pillar) => pillar.Icon);

  return (
    <>
      <HeroCarousel slides={slides} />

      <section className="container py-16 lg:py-20">
        <SectionHeading
          eyebrow={t("home.pillars.eyebrow")}
          title={t("home.pillars.title")}
          subtitle={t("home.pillars.subtitle")}
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {settings.pillars.map((pillar, pillarIndex) => {
            const Icon = ICONS[pillarIndex % ICONS.length];
            return (
            <article
              key={pillar.id}
              className="group relative overflow-hidden rounded-lg border border-border bg-card p-5 shadow-card transition-all duration-300 ease-smooth hover:-translate-y-1 hover:border-primary/40"
            >
              <span className="inline-grid h-11 w-11 place-items-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-4 text-base font-semibold text-foreground">{tx(pillar.title)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tx(pillar.desc)}</p>
            </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-border bg-muted/25">
        <div className="container py-16 lg:py-20">
          <SectionHeading
            eyebrow={t("home.featured.eyebrow")}
            title={t("home.featured.title")}
            subtitle={t("home.featured.subtitle")}
            action={{ href: "/members", label: t("home.featured.cta") }}
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((member, index) => (
              <MemberCard key={member.id} member={member} priority={index < 2} />
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16 lg:py-20">
        <SectionHeading
          eyebrow={t("home.press.eyebrow")}
          title={t("home.press.title")}
          subtitle={t("home.press.subtitle")}
          action={{ href: "/media-coverage", label: t("home.press.cta") }}
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visiblePress.map((article) => (
              <PressCard key={article.id} article={article} />
            ))}
          </div>
          <aside className="rounded-lg border border-border bg-card p-4 shadow-card">
            <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{t("home.press.eyebrow")}</h3>
            <ul className="mt-3 space-y-3">
              {visiblePressMore.map((article) => (
                <li key={article.id} className="border-b border-border/60 pb-3 last:border-0 last:pb-0">
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="group block">
                    <span className="text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-primary">{article.source}</span>
                    <span className="mt-1 block text-sm font-medium leading-snug text-foreground transition-colors group-hover:text-primary">{tx(article.title)}</span>
                  </a>
                </li>
              ))}
            </ul>
            <Link href="/media-coverage" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
              {t("home.press.cta")}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </aside>
        </div>
      </section>

      {visibleReleases.length > 0 ? (
        <section id="press-releases" className="border-y border-border bg-muted/25">
          <div className="container py-16 lg:py-20">
            <SectionHeading
              eyebrow={t("home.releases.eyebrow")}
              title={t("home.releases.title")}
              subtitle={t("home.releases.subtitle")}
              action={{ href: "/press-releases", label: t("home.releases.cta") }}
            />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visibleReleases.map((release) => (
                <PressReleaseCard key={release.id} release={release} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="container py-16 lg:py-20">
        <SectionHeading
          eyebrow={t("home.programs.eyebrow")}
          title={t("home.programs.title")}
          subtitle={t("home.programs.subtitle")}
          action={{ href: "/articles", label: t("home.programs.cta") }}
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visiblePosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-muted/25">
        <div className="container py-16 lg:py-20">
          <SectionHeading
            eyebrow={t("home.committee.eyebrow")}
            title={t("home.committee.title")}
            subtitle={t("home.committee.subtitle")}
            action={{ href: "/committee", label: t("home.committee.cta") }}
          />
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {committee.map((person) => {
              const name = lang === "bn" ? person.name.bn : person.name.en;
              return (
                <Link
                  key={person.id}
                  href={`/members/${slugifyName(person.name.en)}`}
                  className="group rounded-lg border border-border bg-card p-3 text-center shadow-card transition-colors hover:border-primary/40"
                >
                  <span className="relative mx-auto block h-16 w-16 overflow-hidden rounded-full bg-muted text-lg font-bold text-primary ring-2 ring-border">
                    <Avatar
                      name={name}
                      src={person.photoUrl}
                      slug={slugifyName(person.name.en)}
                      sizes="64px"
                      textClassName="text-base"
                    />
                  </span>
                  <p className="mt-3 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                    {tx(person.name)}
                  </p>
                  <p className="mt-0.5 text-[0.7rem] font-medium uppercase tracking-[0.1em] text-primary">{tx(person.role)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{person.mediaHouse}</p>
                </Link>
              );
            })}
          </div>
          <p className="mt-6 inline-flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden />
            {t("committee.formerInfo")}: {formatDate("2026-03-13", lang)}
          </p>
        </div>
      </section>

      <section className="container pb-20 pt-16">
        <div className="relative overflow-hidden rounded-xl border border-primary/25 bg-gradient-to-br from-primary/12 via-card to-card p-8 sm:p-12">
          <span className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/15 blur-3xl" aria-hidden />
          <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {t("home.cta.title")}
              </h2>
              <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                {t("home.cta.body")}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/register" className={buttonVariants({ size: "lg" })}>
                {t("home.cta.primary")}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link href="/about" className={buttonVariants({ variant: "outline", size: "lg" })}>
                {t("home.cta.secondary")}
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
