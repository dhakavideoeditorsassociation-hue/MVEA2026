"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

import { formatDate, formatNumber } from "@/lib/format";
import { useI18n } from "@/lib/i18n/provider";
import type { HeroSlide } from "@/lib/types";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 7000;

/**
 * Homepage hero: a fixed editorial statement (association positioning) over a
 * rotating programme backdrop. The copy comes from the dictionary so both
 * languages stay in sync; the slides come from the CMS-managed hero records.
 */
export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const { t, lang, tx } = useI18n();
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const total = slides.length;
  const active = slides[index];

  const go = useCallback(
    (direction: 1 | -1) => {
      if (total < 2) return;
      setIndex((current) => (current + direction + total) % total);
    },
    [total],
  );

  useEffect(() => {
    if (paused || reduceMotion || total < 2) return;
    const timer = window.setInterval(() => go(1), AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [paused, reduceMotion, total, go, index]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label={t("hero.eyebrow")}
      className="relative isolate overflow-hidden border-b border-border bg-[#05070d]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") go(1);
        if (event.key === "ArrowLeft") go(-1);
      }}
      tabIndex={-1}
    >
      <div className="relative min-h-[640px] w-full lg:min-h-[720px]">
        {active ? (
          <AnimatePresence initial={false}>
            <motion.div
              key={active.id}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
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

        <div className="container relative flex min-h-[640px] flex-col justify-center py-20 lg:min-h-[720px] lg:py-24">
          <div className="max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white/90 backdrop-blur"
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
              className="mt-6 text-balance text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-[3.4rem]"
            >
              {t("hero.headline")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
              className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-white/80 sm:text-lg"
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

          {active ? (
            <div className="mt-12 flex flex-col gap-4 border-t border-white/15 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-primary">
                  {formatNumber(index + 1, lang)} / {formatNumber(total, lang)}
                  {active.date ? <span className="ml-2 text-white/50">{formatDate(active.date, lang)}</span> : null}
                </p>
                <Link
                  href={active.ctaHref ?? "/programs"}
                  className="mt-1 block truncate text-sm font-semibold text-white transition-colors hover:text-primary sm:text-base"
                >
                  {tx(active.title)}
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPaused((value) => !value)}
                  aria-label={paused ? "Play slideshow" : "Pause slideshow"}
                  className="grid h-9 w-9 place-items-center rounded-md border border-white/25 bg-white/5 text-white/80 backdrop-blur transition-colors hover:bg-white/15 hover:text-white"
                >
                  {paused ? <Play className="h-3.5 w-3.5" aria-hidden /> : <Pause className="h-3.5 w-3.5" aria-hidden />}
                </button>
                <div className="flex items-center gap-1.5">
                  {slides.map((slide, slideIndex) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setIndex(slideIndex)}
                      aria-label={`${t("home.hero.goTo")} ${slideIndex + 1}`}
                      aria-current={slideIndex === index}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300 ease-smooth",
                        slideIndex === index ? "w-8 bg-primary" : "w-3 bg-white/35 hover:bg-white/60",
                      )}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label={t("home.hero.prev")}
                  className="grid h-9 w-9 place-items-center rounded-md border border-white/25 bg-white/5 text-white/80 backdrop-blur transition-colors hover:bg-white/15 hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label={t("home.hero.next")}
                  className="grid h-9 w-9 place-items-center rounded-md border border-white/25 bg-white/5 text-white/80 backdrop-blur transition-colors hover:bg-white/15 hover:text-white"
                >
                  <ChevronRight className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
