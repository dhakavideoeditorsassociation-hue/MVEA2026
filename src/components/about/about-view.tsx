"use client";

import Link from "next/link";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";

import { PageHero } from "@/components/common/page-hero";
import { buttonVariants } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/provider";
import type { TranslationKey } from "@/lib/i18n/dictionaries";
import type { AssociationStat } from "@/lib/types";

const ETHICS: Array<{ title: TranslationKey; text: TranslationKey }> = [
  { title: "about.ethics.1.title", text: "about.ethics.1.text" },
  { title: "about.ethics.2.title", text: "about.ethics.2.text" },
  { title: "about.ethics.3.title", text: "about.ethics.3.text" },
  { title: "about.ethics.4.title", text: "about.ethics.4.text" },
  { title: "about.ethics.5.title", text: "about.ethics.5.text" },
  { title: "about.ethics.6.title", text: "about.ethics.6.text" },
];

const BENEFITS: TranslationKey[] = [
  "about.benefits.1",
  "about.benefits.2",
  "about.benefits.3",
  "about.benefits.4",
  "about.benefits.5",
];

const FAQ: Array<{ q: TranslationKey; a: TranslationKey }> = [
  { q: "about.faq.1.q", a: "about.faq.1.a" },
  { q: "about.faq.2.q", a: "about.faq.2.a" },
  { q: "about.faq.3.q", a: "about.faq.3.a" },
  { q: "about.faq.4.q", a: "about.faq.4.a" },
];

export function AboutView({ stats }: { stats: AssociationStat[] }) {
  const { t, tx } = useI18n();

  return (
    <>
      <PageHero eyebrow={t("about.eyebrow")} title={t("about.title")} subtitle={t("about.subtitle")} />

      <section className="container py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{t("about.mission.title")}</h2>
            <p className="mt-4 text-pretty text-base leading-[1.85] text-muted-foreground">{t("about.mission.body")}</p>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.id} className="rounded-lg border border-border bg-card px-3 py-4 text-center">
                  <p className="text-xl font-bold tracking-tight text-foreground">{stat.value}</p>
                  <p className="mt-1 text-[0.65rem] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                    {tx(stat.label)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 shadow-card">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">{t("about.benefits.title")}</h2>
            <ul className="mt-4 space-y-3">
              {BENEFITS.map((key) => (
                <li key={key} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/12 text-primary">
                    <Check className="h-3 w-3" aria-hidden />
                  </span>
                  {t(key)}
                </li>
              ))}
            </ul>
            <Link href="/login" className={`${buttonVariants({ size: "sm" })} mt-6 w-full`}>
              {t("about.join")}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted/25">
        <div className="container py-12 lg:py-16">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary">
              <ShieldCheck className="h-4 w-4" aria-hidden />
            </span>
            <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{t("about.ethics.title")}</h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">{t("about.ethics.intro")}</p>

          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ETHICS.map((item, index) => (
              <li key={item.title} className="rounded-lg border border-border bg-card p-5 shadow-card">
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-base font-semibold text-foreground">{t(item.title)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(item.text)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container py-12 lg:py-16">
        <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{t("about.faq.title")}</h2>
        <div className="mt-6 divide-y divide-border rounded-lg border border-border bg-card">
          {FAQ.map((item) => (
            <details key={item.q} className="group px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-foreground marker:hidden [&::-webkit-details-marker]:hidden">
                {t(item.q)}
                <span
                  className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-transform group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t(item.a)}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
