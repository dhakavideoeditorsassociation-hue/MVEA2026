"use client";

import { useEffect, useState } from "react";
import { ImagePlus, Loader2, Plus, Save, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label, Textarea } from "@/components/ui/form-controls";
import { Input } from "@/components/ui/input";
import { useSiteSettings } from "@/lib/cms/site-settings";
import { useI18n } from "@/lib/i18n/provider";
import type { SitePolicyKey, SiteSettings } from "@/lib/types";
import { uploadFile } from "@/lib/upload";

type LangPair = { bn: string; en: string };

const POLICY_KEYS: Array<{ key: SitePolicyKey; label: string }> = [
  { key: "about", label: "About the organisation" },
  { key: "ethics", label: "Code of ethics" },
  { key: "membership", label: "Membership rules" },
  { key: "recruiters", label: "Recruiter guidelines" },
];

/**
 * Site Content editor.
 *
 * Every field is bilingual and saved to `site_settings/main`. Empty fields fall
 * back to the shipped defaults, so an admin can change one headline without
 * having to re-author the whole site.
 */
export function SiteContentPanel() {
  const { t } = useI18n();
  const { settings, save, customised } = useSiteSettings();
  const [draft, setDraft] = useState<SiteSettings>(settings);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setDraft(settings);
  }, [settings]);

  function setHero(field: "eyebrow" | "headline" | "subheadline" | "primaryCta" | "secondaryCta", lang: keyof LangPair, value: string) {
    setDraft((current) => ({ ...current, hero: { ...current.hero, [field]: { ...current.hero[field], [lang]: value } } }));
  }

  function setPillar(index: number, field: "title" | "desc", lang: keyof LangPair, value: string) {
    setDraft((current) => ({
      ...current,
      pillars: current.pillars.map((pillar, pillarIndex) =>
        pillarIndex === index ? { ...pillar, [field]: { ...pillar[field], [lang]: value } } : pillar,
      ),
    }));
  }

  function setPolicy(key: SitePolicyKey, lang: keyof LangPair, value: string) {
    setDraft((current) => ({ ...current, policies: { ...current.policies, [key]: { ...current.policies[key], [lang]: value } } }));
  }

  async function uploadBackground(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file, "image");
      setDraft((current) => ({ ...current, hero: { ...current.hero, backgrounds: [...current.hero.backgrounds, url] } }));
    } finally {
      setUploading(false);
    }
  }

  async function submit() {
    setBusy(true);
    setSaved(false);
    try {
      await save(draft);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">{t("admin.tab.content")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {customised ? "Custom copy is live." : "Showing shipped defaults."}
          </p>
        </div>
        <Button onClick={() => void submit()} disabled={busy} className="gap-1.5">
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : <Save className="h-3.5 w-3.5" aria-hidden />}
          {busy ? t("dashboard.saving") : t("admin.ranking.save")}
        </Button>
      </div>

      {saved ? (
        <p aria-live="polite" className="rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-foreground">
          {t("admin.ranking.saved")}
        </p>
      ) : null}

      {/* Hero */}
      <section className="rounded-lg border border-border bg-card p-5 shadow-card">
        <h3 className="text-sm font-semibold text-foreground">Hero section</h3>
        <div className="mt-4 space-y-3">
          {([
            ["eyebrow", "Eyebrow badge"],
            ["headline", "Headline"],
            ["subheadline", "Sub-headline"],
            ["primaryCta", "Primary CTA label"],
            ["secondaryCta", "Secondary CTA label"],
          ] as const).map(([field, label]) => (
            <div key={field} className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor={`hero-${field}-bn`}>{label} (BN)</Label>
                <Input
                  id={`hero-${field}-bn`}
                  value={draft.hero[field].bn}
                  onChange={(event) => setHero(field, "bn", event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`hero-${field}-en`}>{label} (EN)</Label>
                <Input
                  id={`hero-${field}-en`}
                  value={draft.hero[field].en}
                  onChange={(event) => setHero(field, "en", event.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 border-t border-border/70 pt-4">
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Background photos</h4>
            <label className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-border px-2.5 text-xs font-semibold transition-colors hover:border-primary/50">
              {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : <ImagePlus className="h-3.5 w-3.5" aria-hidden />}
              {t("dashboard.upload.choose")}
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => void uploadBackground(event.target.files?.[0])}
              />
            </label>
          </div>
          {draft.hero.backgrounds.length === 0 ? (
            <p className="mt-2 text-xs text-muted-foreground">Using the seeded hero slides.</p>
          ) : (
            <ul className="mt-2 space-y-1.5">
              {draft.hero.backgrounds.map((url, index) => (
                <li key={`${url}-${index}`} className="flex items-center gap-2 rounded border border-border/70 px-2 py-1.5">
                  <span className="min-w-0 flex-1 truncate text-[0.7rem] text-muted-foreground" dir="ltr">
                    {url}
                  </span>
                  <button
                    type="button"
                    aria-label="Remove background"
                    onClick={() =>
                      setDraft((current) => ({
                        ...current,
                        hero: { ...current.hero, backgrounds: current.hero.backgrounds.filter((_, i) => i !== index) },
                      }))
                    }
                    className="rounded p-1 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Pillars */}
      <section className="rounded-lg border border-border bg-card p-5 shadow-card">
        <h3 className="text-sm font-semibold text-foreground">Core pillars</h3>
        <div className="mt-4 space-y-4">
          {draft.pillars.map((pillar, index) => (
            <div key={pillar.id} className="rounded-md border border-border/70 p-3">
              <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                {String(index + 1).padStart(2, "0")} · {pillar.id}
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                <Input
                  value={pillar.title.bn}
                  onChange={(event) => setPillar(index, "title", "bn", event.target.value)}
                  aria-label={`Pillar ${index + 1} title BN`}
                />
                <Input
                  value={pillar.title.en}
                  onChange={(event) => setPillar(index, "title", "en", event.target.value)}
                  aria-label={`Pillar ${index + 1} title EN`}
                />
                <Textarea
                  rows={2}
                  value={pillar.desc.bn}
                  onChange={(event) => setPillar(index, "desc", "bn", event.target.value)}
                  aria-label={`Pillar ${index + 1} description BN`}
                />
                <Textarea
                  rows={2}
                  value={pillar.desc.en}
                  onChange={(event) => setPillar(index, "desc", "en", event.target.value)}
                  aria-label={`Pillar ${index + 1} description EN`}
                />
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-1.5"
            onClick={() =>
              setDraft((current) => ({
                ...current,
                pillars: [
                  ...current.pillars,
                  { id: `pillar-${current.pillars.length + 1}`, title: { bn: "", en: "" }, desc: { bn: "", en: "" } },
                ],
              }))
            }
          >
            <Plus className="h-3.5 w-3.5" aria-hidden />
            Add pillar
          </Button>
        </div>
      </section>

      {/* Policies */}
      <section className="rounded-lg border border-border bg-card p-5 shadow-card">
        <h3 className="text-sm font-semibold text-foreground">About, ethics & policies</h3>
        <div className="mt-4 space-y-4">
          {POLICY_KEYS.map(({ key, label }) => (
            <div key={key}>
              <Label htmlFor={`policy-${key}-bn`}>{label}</Label>
              <div className="grid gap-2 sm:grid-cols-2">
                <Textarea
                  id={`policy-${key}-bn`}
                  rows={3}
                  value={draft.policies[key].bn}
                  onChange={(event) => setPolicy(key, "bn", event.target.value)}
                />
                <Textarea
                  rows={3}
                  value={draft.policies[key].en}
                  onChange={(event) => setPolicy(key, "en", event.target.value)}
                  aria-label={`${label} EN`}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Announcement + contact */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-5 shadow-card">
          <h3 className="text-sm font-semibold text-foreground">Announcement banner</h3>
          <div className="mt-3 flex items-center gap-2">
            <input
              id="announcement-enabled"
              type="checkbox"
              checked={draft.announcement.enabled}
              onChange={(event) =>
                setDraft((current) => ({ ...current, announcement: { ...current.announcement, enabled: event.target.checked } }))
              }
              className="h-4 w-4 rounded border-border"
            />
            <Label htmlFor="announcement-enabled" className="mb-0">
              Show the ticker
            </Label>
            <Badge variant={draft.announcement.enabled ? "default" : "outline"} className="ml-auto">
              {draft.announcement.enabled ? "ON" : "OFF"}
            </Badge>
          </div>
          <div className="mt-3 space-y-2">
            <Textarea
              rows={2}
              value={draft.announcement.text.bn}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  announcement: { ...current.announcement, text: { ...current.announcement.text, bn: event.target.value } },
                }))
              }
              aria-label="Announcement BN"
            />
            <Textarea
              rows={2}
              value={draft.announcement.text.en}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  announcement: { ...current.announcement, text: { ...current.announcement.text, en: event.target.value } },
                }))
              }
              aria-label="Announcement EN"
            />
            <Input
              value={draft.announcement.href ?? ""}
              onChange={(event) =>
                setDraft((current) => ({ ...current, announcement: { ...current.announcement, href: event.target.value } }))
              }
              placeholder="/press-releases/…"
              dir="ltr"
              aria-label="Announcement link"
            />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-5 shadow-card">
          <h3 className="text-sm font-semibold text-foreground">Footer contact</h3>
          <div className="mt-3 space-y-2">
            <Input
              value={draft.contact.emails.join(", ")}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  contact: { ...current.contact, emails: event.target.value.split(",").map((v) => v.trim()).filter(Boolean) },
                }))
              }
              dir="ltr"
              aria-label="Official emails"
            />
            <Input
              value={draft.contact.phones.join(", ")}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  contact: { ...current.contact, phones: event.target.value.split(",").map((v) => v.trim()).filter(Boolean) },
                }))
              }
              dir="ltr"
              aria-label="Official phones"
            />
            <Input
              value={draft.contact.address.bn}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  contact: { ...current.contact, address: { ...current.contact.address, bn: event.target.value } },
                }))
              }
              aria-label="Address BN"
            />
            <Input
              value={draft.contact.address.en}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  contact: { ...current.contact, address: { ...current.contact.address, en: event.target.value } },
                }))
              }
              aria-label="Address EN"
            />
            <Input
              value={draft.contact.facebook}
              onChange={(event) =>
                setDraft((current) => ({ ...current, contact: { ...current.contact, facebook: event.target.value } }))
              }
              dir="ltr"
              aria-label="Facebook page URL"
            />
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <Button onClick={() => void submit()} disabled={busy} className="gap-1.5">
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : <Save className="h-3.5 w-3.5" aria-hidden />}
          {busy ? t("dashboard.saving") : t("admin.ranking.save")}
        </Button>
      </div>
    </div>
  );
}
