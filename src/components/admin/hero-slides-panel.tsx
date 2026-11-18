"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Plus, Save, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/form-controls";
import { Input } from "@/components/ui/input";
import { useSiteSettings } from "@/lib/cms/site-settings";
import { useI18n } from "@/lib/i18n/provider";
import type { HeroSlide } from "@/lib/types";
import { uploadFile } from "@/lib/upload";

/**
 * Hero slider manager.
 *
 * Slides are stored in `site_settings.heroSlides`; when the admin has not saved
 * any, the seeded slides are shown as the starting draft so existing slides can
 * be edited in place. Supports upload/replace, bilingual text, show/hide,
 * reordering, deletion and unlimited new slides.
 */
export function HeroSlidesPanel({ seededSlides }: { seededSlides: HeroSlide[] }) {
  const { t } = useI18n();
  const { settings, save } = useSiteSettings();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  useEffect(() => {
    const current = settings.heroSlides ?? [];
    setSlides(
      current.length > 0
        ? [...current].sort((a, b) => a.order - b.order)
        : [...seededSlides].sort((a, b) => a.order - b.order).map((slide) => ({ ...slide })),
    );
  }, [settings.heroSlides, seededSlides]);

  function update<K extends keyof HeroSlide>(id: string, key: K, value: HeroSlide[K]) {
    setSlides((current) => current.map((slide) => (slide.id === id ? { ...slide, [key]: value } : slide)));
  }

  function updateText(id: string, key: "title" | "subtitle", lang: "bn" | "en", value: string) {
    setSlides((current) =>
      current.map((slide) => (slide.id === id ? { ...slide, [key]: { ...slide[key], [lang]: value } } : slide)),
    );
  }

  function move(id: string, direction: -1 | 1) {
    setSlides((current) => {
      const index = current.findIndex((slide) => slide.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next.map((slide, order) => ({ ...slide, order: order + 1 }));
    });
  }

  function addSlide() {
    setSlides((current) => [
      ...current,
      {
        id: `hero-${Date.now()}`,
        title: { bn: "", en: "" },
        subtitle: { bn: "", en: "" },
        imageUrl: "",
        visible: true,
        order: current.length + 1,
      },
    ]);
  }

  async function upload(id: string, file: File | undefined) {
    if (!file) return;
    setUploadingId(id);
    try {
      const url = await uploadFile(file, "image");
      update(id, "imageUrl", url);
    } finally {
      setUploadingId(null);
    }
  }

  async function persist() {
    setBusy(true);
    setSaved(false);
    try {
      await save({ ...settings, heroSlides: slides.map((slide, index) => ({ ...slide, order: index + 1 })) });
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2200);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">{t("admin.hero.title")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("admin.hero.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={addSlide} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" aria-hidden />
            Add new slide
          </Button>
          <Button type="button" size="sm" onClick={() => void persist()} disabled={busy} className="gap-1.5">
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : <Save className="h-3.5 w-3.5" aria-hidden />}
            {busy ? t("dashboard.saving") : t("admin.ranking.save")}
          </Button>
        </div>
      </div>

      {saved ? (
        <p aria-live="polite" className="rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-foreground">
          {t("admin.ranking.saved")}
        </p>
      ) : null}

      <div className="space-y-4">
        {slides.map((slide, index) => (
          <article key={slide.id} className="overflow-hidden rounded-lg border border-border bg-card shadow-card">
            <div className="grid gap-4 p-4 lg:grid-cols-[220px_minmax(0,1fr)]">
              <div>
                <div className="relative aspect-[16/10] overflow-hidden rounded-md border border-border bg-muted">
                  {slide.imageUrl ? (
                    <Image src={slide.imageUrl} alt="" fill unoptimized sizes="220px" className="object-cover" />
                  ) : (
                    <span className="grid h-full place-items-center text-xs text-muted-foreground">No image</span>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <label className="inline-flex h-8 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-border px-2 text-[0.7rem] font-semibold transition-colors hover:border-primary/50">
                    {uploadingId === slide.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                    ) : (
                      <ImagePlus className="h-3.5 w-3.5" aria-hidden />
                    )}
                    {slide.imageUrl ? "Replace" : "Upload"}
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(event) => void upload(slide.id, event.target.files?.[0])}
                    />
                  </label>
                </div>
                <Input
                  value={slide.imageUrl}
                  onChange={(event) => update(slide.id, "imageUrl", event.target.value)}
                  placeholder="/logo.png or https://res.cloudinary.com/…"
                  dir="ltr"
                  aria-label={`Slide ${index + 1} image URL`}
                  className="mt-2 h-8 text-[0.7rem]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    Slide {index + 1}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Button type="button" size="sm" variant="ghost" onClick={() => move(slide.id, -1)} disabled={index === 0} className="h-7 px-2">
                      <ArrowUp className="h-3.5 w-3.5" aria-hidden />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => move(slide.id, 1)}
                      disabled={index === slides.length - 1}
                      className="h-7 px-2"
                    >
                      <ArrowDown className="h-3.5 w-3.5" aria-hidden />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={slide.visible ? "outline" : "secondary"}
                      onClick={() => update(slide.id, "visible", !slide.visible)}
                      className="h-7 px-2 text-[0.68rem]"
                    >
                      {slide.visible ? t("admin.hero.visible") : t("admin.hero.hidden")}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setSlides((current) => current.filter((item) => item.id !== slide.id))}
                      className="h-7 px-2 text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    </Button>
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  <div>
                    <Label htmlFor={`${slide.id}-title-bn`}>Headline (BN)</Label>
                    <Input
                      id={`${slide.id}-title-bn`}
                      value={slide.title.bn}
                      onChange={(event) => updateText(slide.id, "title", "bn", event.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`${slide.id}-title-en`}>Headline (EN)</Label>
                    <Input
                      id={`${slide.id}-title-en`}
                      value={slide.title.en}
                      onChange={(event) => updateText(slide.id, "title", "en", event.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`${slide.id}-sub-bn`}>Caption (BN)</Label>
                    <Input
                      id={`${slide.id}-sub-bn`}
                      value={slide.subtitle.bn}
                      onChange={(event) => updateText(slide.id, "subtitle", "bn", event.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`${slide.id}-sub-en`}>Caption (EN)</Label>
                    <Input
                      id={`${slide.id}-sub-en`}
                      value={slide.subtitle.en}
                      onChange={(event) => updateText(slide.id, "subtitle", "en", event.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="flex justify-end">
        <Button type="button" size="sm" onClick={() => void persist()} disabled={busy} className="gap-1.5">
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : <Save className="h-3.5 w-3.5" aria-hidden />}
          {busy ? t("dashboard.saving") : t("admin.ranking.save")}
        </Button>
      </div>
    </div>
  );
}
