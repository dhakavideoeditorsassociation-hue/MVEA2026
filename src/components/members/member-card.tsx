"use client";

import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Trophy } from "lucide-react";

import { Avatar } from "@/components/common/avatar";
import { Badge } from "@/components/ui/badge";
import { experienceLabel, rankLabel } from "@/lib/format";
import { useI18n } from "@/lib/i18n/provider";
import type { Member } from "@/lib/types";
import { cn } from "@/lib/utils";

type MemberCardProps = {
  member: Member;
  className?: string;
  priority?: boolean;
};

export function MemberCard({ member, className, priority = false }: MemberCardProps) {
  const { t, lang, tx } = useI18n();
  const name = lang === "bn" ? member.fullNameBn : member.fullNameEn;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card transition-all duration-300 ease-smooth hover:-translate-y-1 hover:border-primary/40 hover:shadow-lift",
        className,
      )}
    >
      <Link href={`/members/${member.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-muted">
        <Avatar name={name} src={member.photoUrl} sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw" priority={priority} textClassName="text-4xl" />
        <span className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" aria-hidden />
        {member.rankOrder ? (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/90 px-2 py-1 text-[0.7rem] font-bold text-foreground shadow-sm backdrop-blur">
            <Trophy className="h-3 w-3 text-secondary" aria-hidden />
            {rankLabel(member.rankOrder, lang)}
          </span>
        ) : null}
        <span className="absolute bottom-3 left-3 inline-flex max-w-[85%] items-center gap-1 truncate rounded-full bg-black/55 px-2 py-1 text-[0.68rem] font-semibold text-white backdrop-blur">
          <BadgeCheck className="h-3 w-3 shrink-0 text-secondary" aria-hidden />
          {member.mediaHouse}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-base font-semibold leading-snug text-foreground">
            <Link href={`/members/${member.slug}`} className="transition-colors hover:text-primary">
              {name}
            </Link>
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{tx(member.designation)}</p>
        </div>

        {member.skills.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {member.skills.slice(0, 2).map((skill) => (
              <Badge key={skill.en} variant="muted" className="font-medium">
                {tx(skill)}
              </Badge>
            ))}
          </div>
        ) : null}

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/70 pt-3">
          <span className="text-xs font-medium text-muted-foreground">
            {member.yearsExperience > 0 ? experienceLabel(member.yearsExperience, lang) : member.mediaHouse}
          </span>
          <Link
            href={`/members/${member.slug}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-primary/80"
          >
            {t("members.card.viewProfile")}
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}
