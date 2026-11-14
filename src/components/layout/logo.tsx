"use client";

import Image from "next/image";
import Link from "next/link";

import { LOGO_SRC } from "@/lib/brand";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  /** Hide the wordmark and render the emblem alone. */
  markOnly?: boolean;
  /** Renders the emblem as a static mark without navigation (auth pages, footer). */
  asStatic?: boolean;
  /** Emblem size in pixels (square). */
  size?: number;
};

/**
 * The official emblem sits on white artwork with a transparent background, so it
 * is set inside a white circular chip. That keeps the red ring and the black
 * film strip legible on the dark studio theme as well as the editorial light one,
 * and the inner padding keeps the ribbon tips inside the circle.
 */
export function Logo({ className, markOnly = false, asStatic = false, size = 44 }: LogoProps) {
  const { t, lang } = useI18n();

  const mark = (
    <span
      className="relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-white ring-1 ring-border"
      style={{ width: size, height: size }}
    >
      <Image
        src={LOGO_SRC}
        alt=""
        width={size}
        height={size}
        priority
        unoptimized
        className="h-full w-full object-contain p-[7%]"
      />
    </span>
  );

  const words = markOnly ? null : (
    <span className="flex min-w-0 flex-col leading-tight">
      <span className="truncate text-[0.95rem] font-bold tracking-tight text-foreground">
        {lang === "bn" ? t("brand.name") : "Media Video Editors Association"}
      </span>
      <span className="truncate text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {lang === "bn" ? "MVEA · বাংলাদেশ" : "MVEA · Bangladesh"}
      </span>
    </span>
  );

  if (asStatic) {
    return (
      <span className={cn("inline-flex items-center gap-2.5", className)}>
        {mark}
        {words}
      </span>
    );
  }

  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5 rounded-md", className)}
      aria-label={t("brand.name")}
    >
      {mark}
      {words}
    </Link>
  );
}
