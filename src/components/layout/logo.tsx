"use client";

import Link from "next/link";
import { Clapperboard } from "lucide-react";

import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  /** Hide the wordmark and render the mark alone (mobile). */
  markOnly?: boolean;
};

export function Logo({ className, markOnly = false }: LogoProps) {
  const { t, lang } = useI18n();

  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5 rounded-md", className)}
      aria-label={t("brand.name")}
    >
      <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-primary via-primary to-primary/70 text-primary-foreground shadow-sm transition-transform duration-300 ease-smooth group-hover:-translate-y-0.5">
        <Clapperboard className="h-5 w-5" aria-hidden />
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-secondary ring-2 ring-background" />
      </span>
      {markOnly ? null : (
        <span className="flex min-w-0 flex-col leading-tight">
          <span className="truncate text-[0.95rem] font-bold tracking-tight text-foreground">
            {lang === "bn" ? "গণমাধ্যম ভিডিও এডিটরস" : "Gonomadhyam Video Editors"}
          </span>
          <span className="truncate text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {lang === "bn" ? "অ্যাসোসিয়েশন" : "Association · Bangladesh"}
          </span>
        </span>
      )}
    </Link>
  );
}
