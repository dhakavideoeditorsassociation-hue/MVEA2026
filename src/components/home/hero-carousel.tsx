"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { useSiteSettings } from "@/lib/cms/site-settings";
import type { HeroSlide } from "@/lib/types";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 8000;

/**
 * Homepage hero.
 *
 * Slide order, text and photographs are managed in `/admin` → Hero Slider and
 * stored in `site_settings.heroSlides`; the seeded slides are the fallback while
 * nothing has been customised. Each rotation uses the slide's own headline when
 * one is set, otherwise the site-wide hero copy. Ken Burns push + cross-fade,
 * paused on hover, disabled for reduced motion.
 */
export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const { settings, tx, lang } = useSiteSettings();
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const customSlides = (settings.heroSlides ?? []).filter((slide) => slide.visible !== false);
  const activeSlides = (customSlides.length > 0 ? customSlides : slides).slice().sort((a, b) => a.order - b.order);
  const total = activeSlides.length;
  const active = activeSlides[index % Math.max(1, total)];

  const backgrounds = settings.hero.backgrounds;
  const image = (active && active.imageUrl) || backgrounds[index % Math.max(1, backgrounds.length)] || "";

  const headline = tx(settings.hero.headline);
  const slideTitle = active ? tx(active.title) : "";
  const slideCaption = active ? tx(active.subtitle) : "";
  const subheadline = slideCaption || tx(settings.hero.subheadline);

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
      aria-label={tx(settings.hero.eyebrow)}
      className="relative isolate overflow-hidden border-b border-border bg-[#05070d]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative min-h-[600px] w-full lg:min-h-[700px]">
        <AnimatePresence initial={false}>
          <motion.div
            key={`${image}-${index}`}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {image ? (
              <Image
                src={image}
                alt=""
                fill
                priority
                sizes="100vw"
                unoptimized
                className="ken-burns object-cover object-center"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-[#0a1020] via-[#05070d] to-[#1a0b12]" />
            )}
          </motion.div>
        </AnimatePresence>

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
              {tx(settings.hero.eyebrow)}
            </motion.p>

            <motion.h1
              key={`headline-${index}`}
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
              {headline}
            </motion.h1>

            {slideTitle && slideTitle !== headline ? (
              <p className={cn("mt-4 text-sm font-semibold text-primary", lang === "bn" ? "tracking-normal" : "uppercase tracking-[0.12em]")}>{slideTitle}</p>
            ) : null}

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
              className={cn(
                "mt-5 max-w-2xl text-pretty text-base text-white/80 sm:text-lg",
                lang === "bn" ? "leading-[1.95]" : "leading-relaxed",
              )}
            >
              {subheadline}
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
                {tx(settings.hero.primaryCta)}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/members"
                className="inline-flex h-12 items-center gap-2 rounded-md border border-white/25 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
              >
                {tx(settings.hero.secondaryCta)}
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
            </motion.div>
          </div>

          {total > 1 ? (
            <div className="mt-10 flex items-center gap-1.5">
              {activeSlides.map((slide, slideIndex) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setIndex(slideIndex)}
                  aria-label={`Slide ${slideIndex + 1}`}
                  aria-current={slideIndex === index % total}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    slideIndex === index % total ? "w-8 bg-primary" : "w-3 bg-white/35 hover:bg-white/60",
                  )}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
