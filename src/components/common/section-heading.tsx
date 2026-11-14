"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  action?: { href: string; label: string };
  className?: string;
};

export function SectionHeading({ eyebrow, title, subtitle, action, className }: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="max-w-2xl">
        <p className="eyebrow">
          <span className="h-px w-6 bg-primary" aria-hidden />
          {eyebrow}
        </p>
        <h2 className="mt-3 text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">{subtitle}</p>
        ) : null}
      </div>
      {action ? (
        <Link
          href={action.href}
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-primary"
        >
          {action.label}
          <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-smooth group-hover:translate-x-0.5" aria-hidden />
        </Link>
      ) : null}
    </div>
  );
}
