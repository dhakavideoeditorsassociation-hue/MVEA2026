"use client";

import Image from "next/image";
import { Mail, Users } from "lucide-react";

import { PageHero } from "@/components/common/page-hero";
import { useI18n } from "@/lib/i18n/provider";
import type { CommitteeMember } from "@/lib/types";

export function CommitteeView({ committee }: { committee: CommitteeMember[] }) {
  const { t, tx } = useI18n();

  return (
    <>
      <PageHero eyebrow={t("committee.eyebrow")} title={t("committee.title")} subtitle={t("committee.subtitle")} />

      <section className="container py-10 lg:py-14">
        {committee.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card/50 px-6 py-16 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground">
              <Users className="h-5 w-5" aria-hidden />
            </span>
            <h2 className="mt-4 text-lg font-semibold text-foreground">{t("committee.empty.title")}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{t("committee.empty.body")}</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {committee.map((person, index) => (
              <article
                key={person.id}
                className="group flex items-start gap-4 rounded-lg border border-border bg-card p-4 shadow-card transition-all duration-300 ease-smooth hover:-translate-y-1 hover:border-primary/40"
              >
                <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted ring-1 ring-border">
                  <Image
                    src={person.photoUrl}
                    alt={tx(person.name)}
                    fill
                    sizes="64px"
                    priority={index < 3}
                    className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-105"
                  />
                </span>
                <div className="min-w-0">
                  <h2 className="text-base font-semibold leading-snug text-foreground">{tx(person.name)}</h2>
                  <p className="mt-0.5 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-primary">
                    {tx(person.role)}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{person.mediaHouse}</p>
                  {person.email ? (
                    <a
                      href={`mailto:${person.email}`}
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
                      aria-label={`${t("committee.contact")} ${tx(person.name)}`}
                    >
                      <Mail className="h-3.5 w-3.5" aria-hidden />
                      <span dir="ltr">{person.email}</span>
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
