"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Award,
  BadgeCheck,
  Briefcase,
  Building2,
  Calendar,
  Download,
  ExternalLink,
  MapPin,
  Play,
} from "lucide-react";

import { Avatar } from "@/components/common/avatar";
import { FacebookIcon, InstagramIcon, LinkedinIcon, VimeoIcon, YoutubeIcon } from "@/components/brand-icons";
import { HireRequestButton } from "@/components/hire/hire-request-button";
import { MemberActions } from "@/components/members/member-actions";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { experienceLabel, formatNumber, formatYearRange, rankLabel } from "@/lib/format";
import { useI18n } from "@/lib/i18n/provider";
import { parseShowreel } from "@/lib/media";
import type { Member } from "@/lib/types";

export function MemberProfileView({ member }: { member: Member }) {
  const { t, lang, tx } = useI18n();
  const name = lang === "bn" ? member.fullNameBn : member.fullNameEn;
  const secondaryName = lang === "bn" ? member.fullNameEn : member.fullNameBn;
  const showreel = parseShowreel(member.showreelUrl);
  const cvHref = member.cvUrl ?? `/members/${member.slug}/cv`;
  const hasCareerData = member.workHistory.length > 0 || member.skills.length > 0 || member.tools.length > 0;

  const socials = [
    { href: member.socialLinks.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: member.socialLinks.youtube, label: "YouTube", Icon: YoutubeIcon },
    { href: member.socialLinks.vimeo, label: "Vimeo", Icon: VimeoIcon },
    { href: member.socialLinks.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
    { href: member.socialLinks.instagram, label: "Instagram", Icon: InstagramIcon },
  ].filter((item) => Boolean(item.href));

  return (
    <article className="pb-16">
      <div className="relative border-b border-border bg-gradient-to-b from-muted/40 to-background">
        <div className="container py-8 lg:py-12">
          <Link
            href="/members"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground print-hidden"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            {t("member.back")}
          </Link>

          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border border-border bg-muted shadow-card sm:h-36 sm:w-36">
              <Avatar name={name} src={member.photoUrl} slug={member.slug} memberId={member.id} sizes="144px" priority textClassName="text-4xl" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="default" className="gap-1">
                  <BadgeCheck className="h-3 w-3" aria-hidden />
                  {member.membershipId ?? "—"}
                </Badge>
                <Badge variant="secondary">{member.mediaHouse}</Badge>
                {member.membershipStatus === "approved" ? <Badge variant="outline">{t("member.cv.note")}</Badge> : null}
              </div>

              <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
                {name}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground" lang={lang === "bn" ? "en" : "bn"}>
                {secondaryName}
              </p>

              <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4 text-primary" aria-hidden />
                  {tx(member.designation)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-primary" aria-hidden />
                  {member.mediaHouse}
                </span>
                {member.yearsExperience > 0 ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-primary" aria-hidden />
                    {experienceLabel(member.yearsExperience, lang)}
                  </span>
                ) : null}
                {member.location ? (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-primary" aria-hidden />
                    {member.location}
                  </span>
                ) : null}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-2.5 print-hidden">
                <Link href={cvHref} className={buttonVariants({ size: "sm" })} target="_blank" rel="noopener">
                  <Download className="h-4 w-4" aria-hidden />
                  {t("member.cv.download")}
                </Link>
                <MemberActions member={member} />
                <HireRequestButton member={{ id: member.id, name: name }} />
              </div>

              {socials.length > 0 ? (
                <div className="mt-5 flex items-center gap-2 print-hidden">
                  <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {t("member.social")}
                  </span>
                  {socials.map(({ href, label, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="grid h-8 w-8 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="container grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:py-14">
        <div className="space-y-12">
          <section aria-labelledby="about-heading">
            <h2 id="about-heading" className="text-lg font-semibold tracking-tight text-foreground">
              {t("member.about")}
            </h2>
            <p className="prose-editorial mt-3 text-pretty leading-relaxed">{tx(member.bio)}</p>
          </section>

          {hasCareerData ? (
            <>
              <section aria-labelledby="showreel-heading">
                <h2 id="showreel-heading" className="text-lg font-semibold tracking-tight text-foreground">
                  {t("member.showreel")}
                </h2>
                {showreel ? (
                  <div className="mt-3 space-y-2">
                    <div className="relative aspect-video overflow-hidden rounded-lg border border-border bg-black">
                      <iframe
                        src={showreel.embedUrl}
                        title={`${name} — ${t("member.showreel")}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                        className="absolute inset-0 h-full w-full"
                      />
                    </div>
                    <a
                      href={showreel.watchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                      {t("member.showreel.watch")}
                    </a>
                  </div>
                ) : (
                  <div className="mt-3 flex items-center gap-3 rounded-lg border border-dashed border-border bg-card/60 px-4 py-6 text-sm text-muted-foreground">
                    <Play className="h-4 w-4 text-primary" aria-hidden />
                    {t("member.showreel.empty")}
                  </div>
                )}
              </section>

              {member.workHistory.length > 0 ? (
                <section aria-labelledby="timeline-heading">
                  <h2 id="timeline-heading" className="text-lg font-semibold tracking-tight text-foreground">
                    {t("member.timeline")}
                  </h2>
                  <ol className="mt-4 space-y-0">
                    {member.workHistory.map((item, index) => (
                      <li key={item.id} className="relative flex gap-4 pb-6 last:pb-0">
                        <div className="flex flex-col items-center">
                          <span
                            className={
                              index === 0
                                ? "mt-1.5 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-primary/15"
                                : "mt-1.5 h-2.5 w-2.5 rounded-full border-2 border-border bg-background"
                            }
                            aria-hidden
                          />
                          {index < member.workHistory.length - 1 ? (
                            <span className="mt-1 w-px flex-1 bg-border" aria-hidden />
                          ) : null}
                        </div>
                        <div className="min-w-0 flex-1 pb-1">
                          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                            {formatYearRange(item.startYear, item.endYear, lang)}
                          </p>
                          <h3 className="mt-1 text-base font-semibold leading-snug text-foreground">{tx(item.role)}</h3>
                          <p className="text-sm text-muted-foreground">{item.organization}</p>
                          {item.summary ? (
                            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{tx(item.summary)}</p>
                          ) : null}
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              ) : null}

              {member.skills.length > 0 ? (
                <section aria-labelledby="skills-heading">
                  <h2 id="skills-heading" className="text-lg font-semibold tracking-tight text-foreground">
                    {t("member.skills")}
                  </h2>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {member.skills.map((skill) => (
                      <li key={skill.en}>
                        <Badge variant="muted" className="px-3 py-1 text-[0.75rem]">
                          {tx(skill)}
                        </Badge>
                      </li>
                    ))}
                  </ul>

                  {member.tools.length > 0 ? (
                    <>
                      <h3 className="mt-6 text-sm font-semibold text-foreground">{t("member.tools")}</h3>
                      <ul className="mt-2.5 flex flex-wrap gap-2">
                        {member.tools.map((tool) => (
                          <li key={tool}>
                            <Badge variant="outline" className="px-3 py-1 text-[0.75rem]">
                              {tool}
                            </Badge>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                </section>
              ) : null}
            </>
          ) : (
            <section className="rounded-lg border border-dashed border-border bg-card/60 p-6">
              <h2 className="text-base font-semibold text-foreground">{t("member.pending.title")}</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{t("member.pending.body")}</p>
            </section>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <Award className="h-3.5 w-3.5 text-secondary" aria-hidden />
              {t("members.card.rank")}
            </div>
            <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">
              {member.rankOrder ? rankLabel(member.rankOrder, lang) : "—"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {member.membershipId ?? "—"} · {member.mediaHouse}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-5 shadow-card">
            <h2 className="text-sm font-semibold text-foreground">{t("member.cv.download")}</h2>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{t("member.cv.note")}</p>
            <Link href={cvHref} target="_blank" rel="noopener" className={`${buttonVariants()} mt-4 w-full`}>
              <Download className="h-4 w-4" aria-hidden />
              {t("member.cv.print")}
            </Link>
          </div>

          <div className="rounded-lg border border-primary/25 bg-primary/5 p-5 print-hidden">
            <h2 className="text-sm font-semibold text-foreground">{t("member.recruit.title")}</h2>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{t("member.recruit.body")}</p>
            <div className="mt-4">
              <MemberActions member={member} />
            </div>
          </div>

          <p className="text-[0.7rem] leading-relaxed text-muted-foreground">
            {formatNumber(member.workHistory.length, lang)} · {member.membershipId}
          </p>
        </aside>
      </div>
    </article>
  );
}
