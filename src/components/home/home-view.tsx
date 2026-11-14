"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Clapperboard,
  GraduationCap,
  Palette,
  ShieldCheck,
  Wrench,
} from "lucide-react";

import { SectionHeading } from "@/components/common/section-heading";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { MemberCard } from "@/components/members/member-card";
import { PostCard } from "@/components/programs/post-card";
import { PressCard } from "@/components/press/press-card";
import { buttonVariants } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/provider";
import type { TranslationKey } from "@/lib/i18n/dictionaries";
import type { AssociationStat, CmsPost, CommitteeMember, HeroSlide, Member, PressArticle } from "@/lib/types";

const PILLARS: Array<{ key: string; Icon: typeof Calendar; title: TranslationKey; desc: TranslationKey }> = [
  { key: "market", Icon: Calendar, title: "pillar.market.title", desc: "pillar.market.desc" },
  { key: "tools", Icon: Wrench, title: "pillar.tools.title", desc: "pillar.tools.desc" },
  { key: "workshops", Icon: GraduationCap, title: "pillar.workshop.title", desc: "pillar.workshop.desc" },
  { key: "ethics", Icon: ShieldCheck, title: "pillar.ethics.title", desc: "pillar.ethics.desc" },
  { key: "storytelling", Icon: Clapperboard, title: "pillar.storytelling.title", desc: "pillar.storytelling.desc" },
  { key: "creativity", Icon: Palette, title: "pillar.creativity.title", desc: "pillar.creativity.desc" },
];

type HomeViewProps = {
  slides: HeroSlide[];
  stats: AssociationStat[];
  featured: Member[];
  press: PressArticle[];
  posts: CmsPost[];
  committee: CommitteeMember[];
};

export function HomeView({ slides, stats, featured, press, posts, committee }: HomeViewProps) {
  const { t, tx } = useI18n();

  return (
    <>
      <HeroCarousel slides={slides} />

      {stats.length > 0 ? (
        <section aria-label={t("home.pillars.eyebrow")} className="container relative z-10 -mt-8">
          <div className="grid grid-cols-2 divide-border overflow-hidden rounded-lg border border-border bg-card shadow-lift sm:grid-cols-4 sm:divide-x">
            {stats.map((stat) => (
              <div key={stat.id} className="px-4 py-5 text-center sm:px-6">
                <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-[0.72rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  {tx(stat.label)}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="container py-16 lg:py-20">
        <SectionHeading
          eyebrow={t("home.pillars.eyebrow")}
          title={t("home.pillars.title")}
          subtitle={t("home.pillars.subtitle")}
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map(({ key, Icon, title, desc }) => (
            <article
              key={key}
              className="group relative overflow-hidden rounded-lg border border-border bg-card p-5 shadow-card transition-all duration-300 ease-smooth hover:-translate-y-1 hover:border-primary/40"
            >
              <span className="inline-grid h-11 w-11 place-items-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-4 text-base font-semibold text-foreground">{t(title)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(desc)}</p>
            </article>
          ))}
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
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {press.map((article) => (
            <PressCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-muted/25">
        <div className="container py-16 lg:py-20">
          <SectionHeading
            eyebrow={t("home.programs.eyebrow")}
            title={t("home.programs.title")}
            subtitle={t("home.programs.subtitle")}
            action={{ href: "/programs", label: t("home.programs.cta") }}
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16 lg:py-20">
        <SectionHeading
          eyebrow={t("home.committee.eyebrow")}
          title={t("home.committee.title")}
          subtitle={t("home.committee.subtitle")}
          action={{ href: "/committee", label: t("home.committee.cta") }}
        />
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {committee.map((person) => (
            <div
              key={person.id}
              className="rounded-lg border border-border bg-card p-3 text-center shadow-card transition-colors hover:border-primary/40"
            >
              <span className="relative mx-auto block h-16 w-16 overflow-hidden rounded-full bg-muted ring-2 ring-border">
                <Image src={person.photoUrl} alt={tx(person.name)} fill sizes="64px" className="object-cover" />
              </span>
              <p className="mt-3 text-sm font-semibold leading-snug text-foreground">{tx(person.name)}</p>
              <p className="mt-0.5 text-[0.7rem] font-medium uppercase tracking-[0.1em] text-primary">
                {tx(person.role)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{person.mediaHouse}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container pb-20">
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
              <Link href="/login" className={buttonVariants({ size: "lg" })}>
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
