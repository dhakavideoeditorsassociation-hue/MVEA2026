"use client";

import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, ExternalLink, ShieldAlert } from "lucide-react";

import { Avatar } from "@/components/common/avatar";
import { PageHero } from "@/components/common/page-hero";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/provider";
import type { Member } from "@/lib/types";

/**
 * Public membership verification. Linked from the QR code printed on member
 * cards and CVs, so it must read clearly on a phone screen.
 */
export function VerifyView({ member, memberId }: { member: Member | null; memberId: string }) {
  const { t, lang, tx } = useI18n();

  return (
    <>
      <PageHero
        eyebrow={t("verify.eyebrow")}
        title={member ? t("verify.valid") : t("resources.verify.title")}
        subtitle={member ? `${t("verify.id")}: ${member.membershipId}` : t("resources.verify.body")}
      />

      <section className="container max-w-2xl py-10 lg:py-14">
        {member ? (
          <div className="overflow-hidden rounded-xl border border-primary/25 bg-card shadow-card">
            <div className="flex items-start gap-4 border-b border-border bg-primary/5 p-5">
              <span className="relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full bg-muted text-lg font-bold text-primary ring-2 ring-primary/25">
                <Avatar
                  name={lang === "bn" ? member.fullNameBn : member.fullNameEn}
                  src={member.photoUrl}
                  slug={member.slug}
                  memberId={member.id}
                  sizes="64px"
                  textClassName="text-base"
                />
              </span>
              <div className="min-w-0">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/12 px-2.5 py-0.5 text-[0.68rem] font-bold text-primary">
                  <BadgeCheck className="h-3 w-3" aria-hidden />
                  {t("verify.valid")}
                </span>
                <h1 className="mt-2 text-xl font-bold leading-tight text-foreground">
                  {lang === "bn" ? member.fullNameBn : member.fullNameEn}
                </h1>
                <p className="text-sm text-muted-foreground">{tx(member.designation)}</p>
              </div>
            </div>

            <dl className="grid gap-4 p-5 sm:grid-cols-2">
              <div>
                <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{t("verify.name")}</dt>
                <dd className="mt-0.5 text-sm text-foreground">{lang === "bn" ? member.fullNameBn : member.fullNameEn}</dd>
              </div>
              <div>
                <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{t("verify.organisation")}</dt>
                <dd className="mt-0.5 text-sm text-foreground">{member.mediaHouse}</dd>
              </div>
              <div>
                <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{t("verify.id")}</dt>
                <dd className="mt-0.5 font-mono text-sm font-semibold text-foreground" dir="ltr">
                  {member.membershipId}
                </dd>
              </div>
              <div>
                <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{t("verify.status")}</dt>
                <dd className="mt-1">
                  <Badge variant="default">{member.membershipStatus}</Badge>
                </dd>
              </div>
            </dl>

            <div className="flex flex-wrap items-center gap-3 border-t border-border px-5 py-4">
              <Link href={`/members/${member.slug}`} className={buttonVariants({ size: "sm" })}>
                {t("verify.profile")}
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </Link>
              <div className="ml-auto flex items-center gap-2">
                <Image
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(`/verify/${member.membershipId ?? memberId}`)}`}
                  alt=""
                  width={72}
                  height={72}
                  unoptimized
                  className="h-16 w-16 rounded border border-border bg-white p-1"
                />
                <p className="max-w-[8rem] text-[0.65rem] leading-snug text-muted-foreground">
                  {lang === "bn" ? "স্ক্যান করে যাচাই করুন" : "Scan to verify"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border bg-card/60 px-6 py-14 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground">
              <ShieldAlert className="h-5 w-5" aria-hidden />
            </span>
            <h2 className="mt-4 text-lg font-semibold text-foreground">{t("resources.verify.notFound")}</h2>
            <p className="mt-2 text-sm text-muted-foreground" dir="ltr">
              {memberId}
            </p>
            <Link href="/resources" className={`${buttonVariants({ variant: "outline" })} mt-5`}>
              {t("nav.resources")}
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
