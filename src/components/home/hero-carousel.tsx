"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { useI18n } from "@/lib/i18n/provider";
import type { HeroSlide } from "@/lib/types";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 8000;

/**
 * Homepage hero: a fixed editorial statement over a slowly rotating backdrop.
 *
 * Deliberately free of counters, arrows and caption strips — the backdrop is
 * atmosphere, not a slideshow the visitor has to operate. Autoplay pauses on
 * hover/focus and is disabled for `prefers-reduced-motion`.
 */
export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const { t, lang } = useI18n();
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const total = slides.length;
  const active = slides[index];

  const advance = useCallback(() => {
    if (total < 2) return;
    setIndex((current) => (current + 1) % total);
  }, [total]);

  useEffect(() => {
    if (paused || reduceMotion || total < 2) return;
    const timer = window.setInterval(advance, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [paused, reduceMotion, total, advance]);

  return (
    <section
      aria-label={t("hero.eyebrow")}
      className="relative isolate overflow-hidden border-b border-border bg-[#05070d]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative min-h-[600px] w-full lg:min-h-[700px]">
        {active ? (
          <AnimatePresence initial={false}>
            <motion.div
              key={active.id}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={active.imageUrl}
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
                unoptimized
              />
            </motion.div>
          </AnimatePresence>
        ) : null}

        <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-[#05070d]/85 to-[#05070d]/45" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-[#05070d]/95 via-[#05070d]/55 to-[#05070d]/20" aria-hidden />

        <div className="container relative flex min-h-[600px] flex-col justify-center py-20 lg:min-h-[700px] lg:py-24">
          <div className="max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[0.68rem] font-semibold uppercase text-white/90 backdrop-blur",
                lang === "bn" ? "tracking-normal" : "tracking-[0.14em]",
              )}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              {t("hero.eyebrow")}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
              className={cn(
                "mt-6 text-balance font-bold text-white",
                lang === "bn"
                  ? "text-[1.7rem] leading-[1.55] tracking-normal sm:text-[2.1rem] sm:leading-[1.5] lg:text-[2.6rem] lg:leading-[1.48]"
                  : "text-3xl leading-[1.08] tracking-tight sm:text-4xl lg:text-[3.4rem] lg:leading-[1.02]",
              )}
            >
              {t("hero.headline")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
              className={cn(
                "mt-5 max-w-2xl text-pretty text-base text-white/80 sm:text-lg",
                lang === "bn" ? "leading-[1.95]" : "leading-relaxed",
              )}
            >
              {t("hero.subheadline")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link
                href="/register"
                className="inline-flex h-12 items-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-transform duration-200 ease-smooth hover:-translate-y-0.5"
              >
                {t("hero.primaryCta")}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/members"
                className="inline-flex h-12 items-center gap-2 rounded-md border border-white/25 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
              >
                {t("hero.secondaryCta")}
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
