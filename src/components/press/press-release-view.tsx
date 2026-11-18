"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Check, Copy, ExternalLink, Hash } from "lucide-react";
import { FacebookIcon } from "@/components/brand-icons";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { useI18n } from "@/lib/i18n/provider";
import type { PressRelease } from "@/lib/types";

/**
 * Full-statement reader. Journalists can copy the whole statement (headline,
 * reference, paragraphs and source link) with one click.
 */
export function PressReleaseView({ release }: { release: PressRelease }) {
  const { t, lang, tx } = useI18n();
  const [copied, setCopied] = useState(false);

  async function copyStatement() {
    const parts = [
      tx(release.title),
      release.subheadline ? tx(release.subheadline) : "",
      release.refNo ? `${t("pressrelease.refNo")}: ${release.refNo}` : "",
      formatDate(release.publishedAt, lang),
      ...release.body.map((paragraph) => tx(paragraph)),
      release.url,
    ].filter(Boolean);
    try {
      await navigator.clipboard.writeText(parts.join("\n\n"));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  }

  return (
    <article className="pb-16">
      <header className="border-b border-border bg-muted/25">
        <div className="container py-10 lg:py-14">
          <Link
            href="/press-releases"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground print-hidden"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            {t("pressrelease.back")}
          </Link>

          <div className="mt-6 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="default" className="gap-1">
                <FacebookIcon className="h-3 w-3" aria-hidden />
                {t("pressrelease.official")}
              </Badge>
              {release.refNo ? (
                <Badge variant="outline" className="gap-1">
                  <Hash className="h-3 w-3" aria-hidden />
                  {release.refNo}
                </Badge>
              ) : null}
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                <time dateTime={release.publishedAt}>{formatDate(release.publishedAt, lang)}</time>
              </span>
            </div>

            <h1 className="mt-4 text-balance text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
              {tx(release.title)}
            </h1>
            {release.subheadline ? (
              <p className="mt-3 text-pretty text-base font-medium leading-relaxed text-muted-foreground sm:text-lg">
                {tx(release.subheadline)}
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap items-center gap-2.5 print-hidden">
              <Button variant="outline" size="sm" onClick={() => void copyStatement()} className="gap-1.5">
                {copied ? <Check className="h-3.5 w-3.5 text-primary" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
                {copied ? t("pressrelease.copied") : t("pressrelease.copy")}
              </Button>
              <a
                href={release.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-xs font-semibold text-foreground transition-colors hover:border-primary/50"
              >
                <FacebookIcon className="h-3.5 w-3.5" aria-hidden />
                {t("pressrelease.fbOpen")}
                <ExternalLink className="h-3 w-3" aria-hidden />
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="container max-w-3xl py-10 lg:py-14">
        {release.imageUrl ? (
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-border bg-muted">
            <Image src={release.imageUrl} alt={tx(release.title)} fill priority sizes="768px" className="object-cover" unoptimized />
          </div>
        ) : null}

        <div className="mt-8 space-y-5">
          {release.body.map((paragraph, index) => (
            <p key={index} className="text-pretty text-base leading-[1.85] text-foreground/90">
              {tx(paragraph)}
            </p>
          ))}
        </div>

        <div className="mt-10 rounded-lg border border-border bg-muted/30 p-4 text-xs leading-relaxed text-muted-foreground">
          <p className="font-semibold text-foreground">{release.refNo ?? "MVEA"}</p>
          <p className="mt-1">{t("pressrelease.contact")}</p>
        </div>
      </div>
    </article>
  );
}
