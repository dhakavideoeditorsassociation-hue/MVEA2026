"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { LOGO_SRC } from "@/lib/brand";
import { resolvePhoto, useMemberPhotos } from "@/lib/photos/member-photos";
import { experienceLabel, formatYearRange, rankLabel } from "@/lib/format";
import { useI18n } from "@/lib/i18n/provider";
import type { Member } from "@/lib/types";

/**
 * Print-first CV layout. The "Download official CV" action opens this page and
 * the browser's print dialog produces the PDF, so no binary asset is required.
 */
export function MemberCvView({ member }: { member: Member }) {
  const { t, lang, tx } = useI18n();
  const { photos } = useMemberPhotos();
  const portrait = resolvePhoto(photos, { slug: member.slug, memberId: member.id }, member.photoUrl);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const shouldPrint = new URLSearchParams(window.location.search).get("print") === "1";
    if (shouldPrint) {
      const timer = window.setTimeout(() => window.print(), 600);
      return () => window.clearTimeout(timer);
    }
  }, []);

  return (
    <div className="container max-w-3xl py-10 print:max-w-none print:py-0">
      <div className="mb-6 flex items-center justify-between gap-3 print-hidden">
        <Link
          href={`/members/${member.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          {t("member.back")}
        </Link>
        <button type="button" onClick={() => window.print()} className={buttonVariants({ size: "sm" })}>
          <Printer className="h-4 w-4" aria-hidden />
          {t("member.cv.print")}
        </button>
      </div>

      <article className="cv-page rounded-lg border border-border bg-card p-8 text-card-foreground shadow-card print:border-0 print:bg-white print:p-0 print:text-black">
        <header className="cv-section flex items-start gap-5 border-b border-border pb-5 print:border-black/20">
          <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-border">
            {portrait ? (
              <Image src={portrait} alt="" fill sizes="80px" unoptimized className="object-cover" />
            ) : (
              <Image src={LOGO_SRC} alt="" width={80} height={80} className="h-20 w-20 object-contain p-[7%]" unoptimized />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold tracking-tight">{lang === "bn" ? member.fullNameBn : member.fullNameEn}</h1>
            <p className="text-sm text-muted-foreground print:text-black/70">
              {lang === "bn" ? member.fullNameEn : member.fullNameBn}
            </p>
            <p className="mt-2 text-sm font-medium">
              {tx(member.designation)} · {member.mediaHouse}
            </p>
          </div>
        </header>

        <dl className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground print:text-black/70">
          <div>
            <dt className="inline font-semibold">{t("member.membershipId")}: </dt>
            <dd className="inline">{member.membershipId ?? "—"}</dd>
          </div>
          <div>
            <dt className="inline font-semibold">{t("members.card.rank")}: </dt>
            <dd className="inline">{member.rankOrder ? rankLabel(member.rankOrder, lang) : "—"}</dd>
          </div>
          <div>
            <dt className="inline font-semibold">{t("member.location")}: </dt>
            <dd className="inline">{member.location ?? "Dhaka, Bangladesh"}</dd>
          </div>
          {member.yearsExperience > 0 ? (
            <div>
              <dt className="inline font-semibold">{t("member.experience")}: </dt>
              <dd className="inline">{experienceLabel(member.yearsExperience, lang)}</dd>
            </div>
          ) : null}
        </dl>

        <section className="cv-section mt-5">
          <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-primary print:text-black">
            {t("member.about")}
          </h2>
          <p className="mt-2 text-sm leading-relaxed">{tx(member.bio)}</p>
        </section>

        {member.workHistory.length > 0 ? (
          <section className="cv-section mt-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-primary print:text-black">
              {t("member.timeline")}
            </h2>
            <ul className="mt-3 space-y-3">
              {member.workHistory.map((item) => (
                <li key={item.id} className="text-sm">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-semibold">{tx(item.role)}</span>
                    <span className="text-xs text-muted-foreground print:text-black/60">
                      {formatYearRange(item.startYear, item.endYear, lang)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground print:text-black/70">{item.organization}</p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {member.skills.length > 0 || member.tools.length > 0 ? (
          <section className="cv-section mt-6 grid gap-5 sm:grid-cols-2">
            {member.skills.length > 0 ? (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-primary print:text-black">
                  {t("member.skills")}
                </h2>
                <p className="mt-2 text-sm leading-relaxed">{member.skills.map((skill) => tx(skill)).join(" · ")}</p>
              </div>
            ) : null}
            {member.tools.length > 0 ? (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-primary print:text-black">
                  {t("member.tools")}
                </h2>
                <p className="mt-2 text-sm leading-relaxed">{member.tools.join(" · ")}</p>
              </div>
            ) : null}
          </section>
        ) : null}

        {member.showreelUrl ? (
          <section className="cv-section mt-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-primary print:text-black">
              {t("member.showreel")}
            </h2>
            <p className="mt-2 break-all text-sm" dir="ltr">
              {member.showreelUrl}
            </p>
          </section>
        ) : null}

        <footer className="mt-8 border-t border-border pt-4 text-[0.7rem] leading-relaxed text-muted-foreground print:border-black/20 print:text-black/60">
          {t("brand.name")} · {t("brand.orgBn")} · {t("member.cv.note")}
        </footer>
      </article>
    </div>
  );
}
