"use client";

import { cn } from "@/lib/utils";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
};

export function PageHero({ eyebrow, title, subtitle, children, className }: PageHeroProps) {
  return (
    <section className={cn("relative overflow-hidden border-b border-border bg-muted/25", className)}>
      <div
        className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_1px_1px,hsl(var(--foreground)/0.06)_1px,transparent_0)] [background-size:22px_22px]"
        aria-hidden
      />
      <div className="container relative py-12 sm:py-16">
        <div className="max-w-3xl">
          <p className="eyebrow">
            <span className="h-px w-6 bg-primary" aria-hidden />
            {eyebrow}
          </p>
          <h1 className="mt-4 text-balance text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-4 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">{subtitle}</p>
          ) : null}
        </div>
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}
