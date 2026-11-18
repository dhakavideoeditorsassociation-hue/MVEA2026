"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { HireRequestButton } from "@/components/hire/hire-request-button";
import { PageHero } from "@/components/common/page-hero";
import { MemberCard } from "@/components/members/member-card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/form-controls";
import { Input } from "@/components/ui/input";
import { formatNumber } from "@/lib/format";
import { fetchRemoteMembers } from "@/lib/store/public-members";
import { useI18n } from "@/lib/i18n/provider";
import type { Member } from "@/lib/types";
import { cn } from "@/lib/utils";

type ExperienceBucket = "all" | "b1" | "b2" | "b3" | "b4";

const BUCKETS: Record<Exclude<ExperienceBucket, "all">, [number, number]> = {
  b1: [0, 4],
  b2: [5, 9],
  b3: [10, 14],
  b4: [15, 99],
};

export function MembersDirectoryView({ members }: { members: Member[] }) {
  const { t, lang } = useI18n();
  const [remoteMembers, setRemoteMembers] = useState<Member[]>([]);
  const [query, setQuery] = useState("");
  const [mediaHouse, setMediaHouse] = useState("all");
  const [skill, setSkill] = useState("all");
  const [bucket, setBucket] = useState<ExperienceBucket>("all");

  useEffect(() => {
    let cancelled = false;
    void fetchRemoteMembers()
      .then((extra) => {
        if (!cancelled) setRemoteMembers(extra);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const allMembers = useMemo(() => {
    const seen = new Set(members.map((member) => member.slug));
    return [...members, ...remoteMembers.filter((member) => !seen.has(member.slug))];
  }, [members, remoteMembers]);

  const mediaHouses = useMemo(
    () => Array.from(new Set(allMembers.map((member) => member.mediaHouse))).sort(),
    [allMembers],
  );

  const skillOptions = useMemo(() => {
    const values = new Set<string>();
    allMembers.forEach((member) => {
      member.skills.forEach((item) => values.add(item.en));
      member.tools.forEach((tool) => values.add(tool));
    });
    return Array.from(values).sort();
  }, [allMembers]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return allMembers.filter((member) => {
      if (mediaHouse !== "all" && member.mediaHouse !== mediaHouse) return false;
      if (skill !== "all") {
        const hasSkill = member.skills.some((item) => item.en === skill) || member.tools.includes(skill);
        if (!hasSkill) return false;
      }
      if (bucket !== "all") {
        const [min, max] = BUCKETS[bucket];
        if (member.yearsExperience < min || member.yearsExperience > max) return false;
      }
      if (!needle) return true;
      return [
        member.fullNameBn,
        member.fullNameEn,
        member.mediaHouse,
        member.mediaHouseBn ?? "",
        member.designation.en,
        member.designation.bn,
      ]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [allMembers, query, mediaHouse, skill, bucket]);

  const hasFilters = query !== "" || mediaHouse !== "all" || skill !== "all" || bucket !== "all";

  const reset = () => {
    setQuery("");
    setMediaHouse("all");
    setSkill("all");
    setBucket("all");
  };

  return (
    <>
      <PageHero eyebrow={t("members.eyebrow")} title={t("members.title")} subtitle={t("members.subtitle")}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-primary/25 bg-primary/5 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-foreground">{t("hire.bannerTitle")}</p>
            <p className="mt-0.5 max-w-2xl text-xs leading-relaxed text-muted-foreground">{t("hire.bannerBody")}</p>
          </div>
          <HireRequestButton label={t("hire.cta")} />
        </div>
        <div className="grid gap-3 rounded-lg border border-border bg-card p-4 shadow-card lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("members.search")}
              aria-label={t("members.search")}
              className="pl-9"
            />
          </div>
          <Select
            value={mediaHouse}
            onChange={(event) => setMediaHouse(event.target.value)}
            aria-label={t("members.filter.mediaHouse")}
          >
            <option value="all">{t("members.filter.allMediaHouses")}</option>
            {mediaHouses.map((house) => (
              <option key={house} value={house}>
                {house}
              </option>
            ))}
          </Select>
          <Select value={skill} onChange={(event) => setSkill(event.target.value)} aria-label={t("members.filter.skill")}>
            <option value="all">{t("members.filter.allSkills")}</option>
            {skillOptions.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </Select>
          <Select
            value={bucket}
            onChange={(event) => setBucket(event.target.value as ExperienceBucket)}
            aria-label={t("members.filter.experience")}
          >
            <option value="all">{t("members.filter.allExperience")}</option>
            <option value="b1">{t("members.filter.bucket1")}</option>
            <option value="b2">{t("members.filter.bucket2")}</option>
            <option value="b3">{t("members.filter.bucket3")}</option>
            <option value="b4">{t("members.filter.bucket4")}</option>
          </Select>
        </div>
      </PageHero>

      <section className="container py-10 lg:py-14">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <SlidersHorizontal className="h-4 w-4" aria-hidden />
            <span className="font-semibold text-foreground">{formatNumber(filtered.length, lang)}</span>
            {t("members.countSuffix")}
          </p>
          {hasFilters ? (
            <Button variant="ghost" size="sm" onClick={reset} className="gap-1.5">
              <X className="h-3.5 w-3.5" aria-hidden />
              {t("common.reset")}
            </Button>
          ) : null}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-10 rounded-lg border border-dashed border-border bg-card/50 px-6 py-16 text-center">
            <h2 className="text-lg font-semibold text-foreground">{t("members.empty.title")}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{t("members.empty.body")}</p>
            <Button variant="outline" className="mt-6" onClick={reset}>
              {t("common.reset")}
            </Button>
          </div>
        ) : (
          <div className={cn("mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4")}>
            {filtered.map((member, index) => (
              <MemberCard key={member.id} member={member} priority={index < 4} />
            ))}
          </div>
        )}

        <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
          {t("members.note")}
        </p>
      </section>
    </>
  );
}
