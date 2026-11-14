"use client";

import { Users } from "lucide-react";

import { Avatar } from "@/components/common/avatar";
import { PageHero } from "@/components/common/page-hero";
import { useI18n } from "@/lib/i18n/provider";
import type { CommitteeMember } from "@/lib/types";

function MemberTile({ person, prominent = false }: { person: CommitteeMember; prominent?: boolean }) {
  const { tx, lang } = useI18n();
  const name = lang === "bn" ? person.name.bn : person.name.en;

  return (
    <article
      className={
        prominent
          ? "group flex items-start gap-4 rounded-lg border border-primary/25 bg-card p-4 shadow-card transition-all duration-300 ease-smooth hover:-translate-y-1 hover:border-primary/50"
          : "group flex items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-card transition-colors hover:border-primary/40"
      }
    >
      <span
        className={
          prominent
            ? "relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-muted text-xl ring-2 ring-primary/25"
            : "relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-muted text-sm ring-1 ring-border"
        }
      >
        <Avatar
          name={name}
          src={person.photoUrl}
          sizes={prominent ? "64px" : "44px"}
          textClassName={prominent ? "text-lg" : "text-xs"}
        />
      </span>
      <div className="min-w-0">
        <h2 className={prominent ? "text-base font-semibold leading-snug text-foreground" : "text-sm font-semibold leading-snug text-foreground"}>
          {tx(person.name)}
        </h2>
        <p className="mt-0.5 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-primary">{tx(person.role)}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{person.mediaHouse}</p>
      </div>
    </article>
  );
}

export function CommitteeView({ committee }: { committee: CommitteeMember[] }) {
  const { t } = useI18n();
  const leadership = committee.filter((person) => person.roleType !== "member");
  const members = committee.filter((person) => person.roleType === "member");

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
          <div className="space-y-12">
            {leadership.length > 0 ? (
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {t("committee.group.leadership")}
                </h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {leadership.map((person) => (
                    <MemberTile key={person.id} person={person} prominent />
                  ))}
                </div>
              </div>
            ) : null}

            {members.length > 0 ? (
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {t("committee.group.members")} · {members.length}
                </h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {members.map((person) => (
                    <MemberTile key={person.id} person={person} />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </section>
    </>
  );
}
