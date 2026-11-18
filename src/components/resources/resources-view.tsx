"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck, ExternalLink, Radio, ScanLine, Table2 } from "lucide-react";

import { PageHero } from "@/components/common/page-hero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n/provider";

const ORGANISATIONS = [
  { name: "MRDI", nameBn: "এমআরডিআই", href: "https://mrdibd.org/", note: { bn: "গণমাধ্যম গবেষণা ও প্রশিক্ষণ", en: "Media research and training" } },
  { name: "PIB", nameBn: "পিআইবি", href: "https://pib.gov.bd/", note: { bn: "তথ্য বিভাগ, বাংলাদেশ সরকার", en: "Press Information Department" } },
  { name: "NIMC", nameBn: "এনআইএমসি", href: "https://nimc.gov.bd/", note: { bn: "জাতীয় গণমাধ্যম ইনস্টিটিউট", en: "National Institute of Mass Communication" } },
  { name: "BCTI", nameBn: "বিসিটিআই", href: "https://bcti.gov.bd/", note: { bn: "বাংলাদেশ কমিউনিকেশন টেকনোলজি ইনস্টিটিউট", en: "Bangladesh Communication Technologies Institute" } },
];

const LOUDNESS_ROWS = [
  { label: { bn: "ব্রডকাস্ট টেলিভিশন (EBU R128)", en: "Broadcast television (EBU R128)" }, value: "-23 LUFS", note: { bn: "ইন্টিগ্রেটেড, ±0.5", en: "Integrated, ±0.5" } },
  { label: { bn: "অনলাইন / সোশ্যাল ডেলিভারি", en: "Online / social delivery" }, value: "-14 LUFS", note: { bn: "প্ল্যাটফর্ম নরমালাইজেশন", en: "Platform normalisation" } },
  { label: { bn: "ট্রু পিক সিলিং", en: "True peak ceiling" }, value: "-1 dBTP", note: { bn: "ক্লিপিং এড়াতে", en: "Avoid clipping" } },
  { label: { bn: "সংলাপের গড় মাত্রা", en: "Dialogue average" }, value: "-27 to -24 dB", note: { bn: "নিউজ প্যাকেজ", en: "News packages" } },
  { label: { bn: "নিরাপদ হেডরুম", en: "Safe headroom" }, value: "-6 dBFS", note: { bn: "মিক্স বাস", en: "Mix bus" } },
  { label: { bn: "এক্সপোর্ট (ব্রডকাস্ট)", en: "Export (broadcast)" }, value: "XDCAM HD422 · 1080i50 · 50 Mbps", note: { bn: "নিউজরুম ডেলিভারি", en: "Newsroom delivery" } },
  { label: { bn: "এক্সপোর্ট (ডিজিটাল)", en: "Export (digital)" }, value: "H.264 · 1080p25 · 12 Mbps", note: { bn: "ফেসবুক/ইউটিউব", en: "Facebook / YouTube" } },
  { label: { bn: "সাবটাইটেল নিরাপদ এলাকা", en: "Subtitle safe area" }, value: "90% action-safe", note: { bn: "লোয়ার থার্ড", en: "Lower thirds" } },
];

export function ResourcesView() {
  const { t, lang } = useI18n();
  const [memberId, setMemberId] = useState("");

  return (
    <>
      <PageHero eyebrow={t("resources.eyebrow")} title={t("resources.title")} subtitle={t("resources.subtitle")} />

      <section className="container py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">{t("resources.links.title")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t("resources.links.body")}</p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {ORGANISATIONS.map((org) => (
                <li key={org.name}>
                  <a
                    href={org.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full flex-col gap-1.5 rounded-lg border border-border bg-card p-4 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40"
                  >
                    <span className="flex items-center justify-between">
                      <span className="text-sm font-bold text-foreground">{lang === "bn" ? org.nameBn : org.name}</span>
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-primary" aria-hidden />
                    </span>
                    <span className="text-xs leading-relaxed text-muted-foreground">{lang === "bn" ? org.note.bn : org.note.en}</span>
                    <span className="mt-1 text-[0.7rem] font-medium text-primary" dir="ltr">
                      {org.href.replace("https://", "")}
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <h2 className="mt-10 flex items-center gap-2 text-xl font-semibold tracking-tight text-foreground">
              <ScanLine className="h-5 w-5 text-primary" aria-hidden />
              {t("resources.verify.title")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t("resources.verify.body")}</p>
            <form
              className="mt-4 flex flex-col gap-2 sm:flex-row"
              onSubmit={(event) => {
                event.preventDefault();
                const clean = memberId.trim().toUpperCase();
                if (clean) window.location.href = `/verify/${encodeURIComponent(clean)}`;
              }}
            >
              <Input
                value={memberId}
                onChange={(event) => setMemberId(event.target.value)}
                placeholder="MVEA-2026-001"
                aria-label={t("verify.id")}
                dir="ltr"
                className="sm:max-w-xs"
              />
              <Button type="submit" className="gap-1.5 sm:w-auto">
                {t("resources.verify.button")}
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </Button>
            </form>
          </div>

          <div>
            <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight text-foreground">
              <Table2 className="h-5 w-5 text-primary" aria-hidden />
              {t("resources.loudness.title")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t("resources.loudness.body")}</p>

            <div className="mt-5 overflow-hidden rounded-lg border border-border bg-card shadow-card">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-[0.68rem] uppercase tracking-[0.1em] text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2.5 text-left font-semibold">{lang === "bn" ? "প্যারামিটার" : "Parameter"}</th>
                    <th className="px-4 py-2.5 text-left font-semibold">{lang === "bn" ? "মান" : "Value"}</th>
                    <th className="hidden px-4 py-2.5 text-left font-semibold sm:table-cell">{lang === "bn" ? "নোট" : "Note"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {LOUDNESS_ROWS.map((row) => (
                    <tr key={row.value + row.label.en}>
                      <td className="px-4 py-2.5 text-foreground">{lang === "bn" ? row.label.bn : row.label.en}</td>
                      <td className="px-4 py-2.5 font-mono text-xs font-semibold text-primary" dir="ltr">
                        {row.value}
                      </td>
                      <td className="hidden px-4 py-2.5 text-xs text-muted-foreground sm:table-cell">
                        {lang === "bn" ? row.note.bn : row.note.en}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 rounded-lg border border-primary/25 bg-primary/5 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Radio className="h-4 w-4 text-primary" aria-hidden />
                {lang === "bn" ? "দ্রুত চেক" : "Quick check"}
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {lang === "bn"
                  ? "ডেলিভারির আগে লাউডনেস মিটার দিয়ে ইন্টিগ্রেটেড মান, ট্রু পিক ও চ্যানেল ম্যাপিং—তিনটিই একবার যাচাই করুন।"
                  : "Before delivery, check the integrated loudness, true peak and channel mapping once with a meter — all three."}
              </p>
              <Badge variant="muted" className="mt-2">
                {lang === "bn" ? "আন্তর্জাতিক মানদণ্ড" : "International reference"}
              </Badge>
            </div>

            <Link href="/press-releases" className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
              {t("pressrelease.seeAll")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
