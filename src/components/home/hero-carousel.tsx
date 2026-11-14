"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

import { formatDate, formatNumber } from "@/lib/format";
import { useI18n } from "@/lib/i18n/provider";
import type { HeroSlide } from "@/lib/types";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 7000;

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const { t, lang, tx } = useI18n();
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const regionRef = useRef<HTMLDivElement>(null);

  const total = slides.length;
  const active = slides[index];

  const go = useCallback(
    (direction: 1 | -1) => {
      setIndex((current) => (current + direction + total) % total);
    },
    [total],
  );

  useEffect(() => {
    if (paused || reduceMotion || total < 2) return;
    const timer = window.setInterval(() => go(1), AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [paused, reduceMotion, total, go, index]);

  if (!active) return null;

  return (
    <section
      ref={regionRef}
      aria-roledescription="carousel"
      aria-label={t("home.hero.eyebrow")}
      className="relative isolate overflow-hidden border-b border-border bg-background"
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
      <div className="relative min-h-[540px] w-full sm:min-h-[560px] lg:min-h-[660px]">
        <AnimatePresence initial={false}>
          <motion.div
            key={active.id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            drag={reduceMotion ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.08}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(1);
              else if (info.offset.x > 60) go(-1);
            }}
          >
            <Image
              src={active.imageUrl}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-[#05070d]/70 to-[#05070d]/25" aria-hidden />
            <div className="absolute inset-0 bg-gradient-to-r from-[#05070d]/85 via-[#05070d]/35 to-transparent" aria-hidden />
          </motion.div>
        </AnimatePresence>

        <div className="container relative flex h-full min-h-[540px] flex-col justify-end pb-12 pt-24 sm:min-h-[560px] lg:min-h-[660px] lg:pb-16">
          <div className="max-w-3xl">
            <motion.div
              key={`${active.id}-text`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
              className="space-y-5"
            >
              <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                {t("home.hero.eyebrow")}
              </p>

              <h1 className="text-balance text-3xl font-bold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-display-lg">
                {tx(active.title)}
              </h1>
              <p className="max-w-2xl text-pretty text-base leading-relaxed text-white/80 sm:text-lg">
                {tx(active.subtitle)}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                {active.ctaHref && active.ctaLabel ? (
                  <Link
                    href={active.ctaHref}
                    className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-transform duration-200 ease-smooth hover:-translate-y-0.5"
                  >
                    {tx(active.ctaLabel)}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                ) : null}
                <Link
                  href="/members"
                  className="inline-flex h-11 items-center gap-2 rounded-md border border-white/25 bg-white/5 px-5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
                >
                  {t("home.featured.cta")}
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </Link>
                {active.date ? (
                  <span className="text-xs font-medium text-white/60">{formatDate(active.date, lang)}</span>
                ) : null}
              </div>
            </motion.div>
          </div>

          <div className="mt-10 flex items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              {slides.map((slide, slideIndex) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setIndex(slideIndex)}
                  aria-label={`${t("home.hero.goTo")} ${slideIndex + 1}`}
                  aria-current={slideIndex === index}
                  className={cn(
                    "group flex items-center gap-2 text-[0.7rem] font-semibold transition-colors",
                    slideIndex === index ? "text-white" : "text-white/45 hover:text-white/80",
                  )}
                >
                  <span
                    className={cn(
                      "h-0.5 rounded-full transition-all duration-300 ease-smooth",
                      slideIndex === index ? "w-10 bg-primary" : "w-6 bg-white/30 group-hover:bg-white/60",
                    )}
                    aria-hidden
                  />
                  {formatNumber(slideIndex + 1, lang)}
                </button>
              ))}
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
        </div>

        {!reduceMotion && !paused && total > 1 ? (
          <motion.div
            key={`${active.id}-progress`}
            className="absolute bottom-0 left-0 h-0.5 bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
          />
        ) : null}
      </div>
    </section>
  );
}
