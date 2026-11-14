"use client";

import { useMemo, useState } from "react";
import { Loader2, Plus, Trash2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label, Textarea } from "@/components/ui/form-controls";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n/provider";
import { isPdf, uploadFile } from "@/lib/upload";
import type { MembershipApplication } from "@/lib/types";

type ApplicationFormProps = {
  initial: MembershipApplication;
  onSave: (draft: MembershipApplication, submit: boolean) => Promise<void>;
  busy: boolean;
  locked: boolean;
};

function splitList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function ApplicationForm({ initial, onSave, busy, locked }: ApplicationFormProps) {
  const { t } = useI18n();
  const [form, setForm] = useState<MembershipApplication>(initial);
  const [skillsText, setSkillsText] = useState(initial.skills.join(", "));
  const [toolsText, setToolsText] = useState(initial.tools.join(", "));
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<"photo" | "cv" | null>(null);

  const derived = useMemo(
    () => ({
      ...form,
      skills: splitList(skillsText),
      tools: splitList(toolsText),
    }),
    [form, skillsText, toolsText],
  );

  function update<K extends keyof MembershipApplication>(key: K, value: MembershipApplication[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateWork(id: string, patch: Partial<MembershipApplication["workHistory"][number]>) {
    setForm((current) => ({
      ...current,
      workHistory: current.workHistory.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  }

  function addWork() {
    setForm((current) => ({
      ...current,
      workHistory: [
        ...current.workHistory,
        { id: `wh-${Date.now()}`, organization: "", role: "", startYear: "", endYear: "" },
      ],
    }));
  }

  function removeWork(id: string) {
    setForm((current) => ({ ...current, workHistory: current.workHistory.filter((item) => item.id !== id) }));
  }

  async function handleFile(file: File | undefined, kind: "photo" | "cv") {
    if (!file) return;
    setError(null);
    setUploading(kind);
    try {
      if (kind === "cv" && !isPdf(file)) throw new Error("invalid-type");
      const url = await uploadFile(file, kind === "cv" ? "pdf" : "image");
      update(kind === "cv" ? "cvUrl" : "photoUrl", url);
    } catch {
      setError(t("dashboard.upload.error"));
    } finally {
      setUploading(null);
    }
  }

  function validForSubmit(): boolean {
    return Boolean(
      derived.fullNameBn.trim() &&
        derived.fullNameEn.trim() &&
        derived.phone.trim() &&
        derived.mediaHouse.trim() &&
        derived.designation.trim() &&
        derived.yearsExperience > 0 &&
        derived.skills.length > 0 &&
        derived.bio.trim().length >= 40 &&
        derived.cvUrl,
    );
  }

  async function submit(submitForReview: boolean) {
    setError(null);
    if (submitForReview && !validForSubmit()) {
      setError(t("dashboard.validation.required"));
      return;
    }
    await onSave(derived, submitForReview);
  }

  const disabled = busy || locked;

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        void submit(true);
      }}
    >
      <fieldset disabled={disabled} className="space-y-6 disabled:opacity-70">
        <section className="rounded-lg border border-border bg-card p-5 shadow-card">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {t("dashboard.section.identity")}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="fullNameBn">
                {t("dashboard.field.fullNameBn")} <span className="text-primary">*</span>
              </Label>
              <Input
                id="fullNameBn"
                value={form.fullNameBn}
                onChange={(event) => update("fullNameBn", event.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="fullNameEn">
                {t("dashboard.field.fullNameEn")} <span className="text-primary">*</span>
              </Label>
              <Input
                id="fullNameEn"
                value={form.fullNameEn}
                onChange={(event) => update("fullNameEn", event.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">
                {t("dashboard.field.phone")} <span className="text-primary">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                dir="ltr"
                value={form.phone}
                onChange={(event) => update("phone", event.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="photo">{t("dashboard.field.photo")}</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={(event) => void handleFile(event.target.files?.[0], "photo")}
                  className="file:mr-3 file:rounded file:border-0 file:bg-muted file:px-2 file:py-1 file:text-xs file:font-semibold"
                />
                {uploading === "photo" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
              </div>
              {form.photoUrl ? (
                <p className="mt-1 truncate text-xs text-muted-foreground" dir="ltr">
                  {form.photoUrl}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card p-5 shadow-card">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {t("dashboard.section.professional")}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <Label htmlFor="mediaHouse">
                {t("dashboard.field.mediaHouse")} <span className="text-primary">*</span>
              </Label>
              <Input
                id="mediaHouse"
                value={form.mediaHouse}
                onChange={(event) => update("mediaHouse", event.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="years">
                {t("dashboard.field.years")} <span className="text-primary">*</span>
              </Label>
              <Input
                id="years"
                type="number"
                min={0}
                max={60}
                value={form.yearsExperience}
                onChange={(event) => update("yearsExperience", Number(event.target.value))}
                required
              />
            </div>
            <div className="sm:col-span-3">
              <Label htmlFor="designation">
                {t("dashboard.field.designation")} <span className="text-primary">*</span>
              </Label>
              <Input
                id="designation"
                value={form.designation}
                onChange={(event) => update("designation", event.target.value)}
                required
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {t("dashboard.section.history")}
            </h2>
            <Button type="button" variant="ghost" size="sm" onClick={addWork} className="gap-1.5">
              <Plus className="h-3.5 w-3.5" aria-hidden />
              {t("dashboard.work.add")}
            </Button>
          </div>

          <div className="mt-4 space-y-3">
            {form.workHistory.map((item) => (
              <div key={item.id} className="rounded-md border border-border/80 bg-muted/30 p-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor={`${item.id}-org`}>{t("dashboard.work.org")}</Label>
                    <Input
                      id={`${item.id}-org`}
                      value={item.organization}
                      onChange={(event) => updateWork(item.id, { organization: event.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`${item.id}-role`}>{t("dashboard.work.role")}</Label>
                    <Input
                      id={`${item.id}-role`}
                      value={item.role}
                      onChange={(event) => updateWork(item.id, { role: event.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`${item.id}-start`}>{t("dashboard.work.start")}</Label>
                    <Input
                      id={`${item.id}-start`}
                      inputMode="numeric"
                      placeholder="2019"
                      value={item.startYear}
                      onChange={(event) => updateWork(item.id, { startYear: event.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`${item.id}-end`}>{t("dashboard.work.end")}</Label>
                    <Input
                      id={`${item.id}-end`}
                      inputMode="numeric"
                      placeholder="2023"
                      value={item.endYear}
                      onChange={(event) => updateWork(item.id, { endYear: event.target.value })}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeWork(item.id)}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-destructive hover:underline"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden />
                  {t("dashboard.work.remove")}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card p-5 shadow-card">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {t("dashboard.section.skills")}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="skills">
                {t("dashboard.field.skills")} <span className="text-primary">*</span>
              </Label>
              <Input id="skills" value={skillsText} onChange={(event) => setSkillsText(event.target.value)} required />
              <p className="mt-1.5 text-xs text-muted-foreground">{t("dashboard.hint.skills")}</p>
            </div>
            <div>
              <Label htmlFor="tools">{t("dashboard.field.tools")}</Label>
              <Input id="tools" value={toolsText} onChange={(event) => setToolsText(event.target.value)} />
              <p className="mt-1.5 text-xs text-muted-foreground">{t("dashboard.hint.tools")}</p>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card p-5 shadow-card">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {t("dashboard.section.links")}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="showreel">{t("dashboard.field.showreel")}</Label>
              <Input
                id="showreel"
                dir="ltr"
                placeholder="https://www.youtube.com/watch?v=…"
                value={form.showreelUrl}
                onChange={(event) => update("showreelUrl", event.target.value)}
              />
              <p className="mt-1.5 text-xs text-muted-foreground">{t("dashboard.hint.showreel")}</p>
            </div>
            <div>
              <Label htmlFor="facebook">{t("dashboard.field.facebook")}</Label>
              <Input
                id="facebook"
                dir="ltr"
                value={form.facebook}
                onChange={(event) => update("facebook", event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="linkedin">{t("dashboard.field.linkedin")}</Label>
              <Input
                id="linkedin"
                dir="ltr"
                value={form.linkedin}
                onChange={(event) => update("linkedin", event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="youtube">{t("dashboard.field.youtube")}</Label>
              <Input
                id="youtube"
                dir="ltr"
                value={form.youtube}
                onChange={(event) => update("youtube", event.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card p-5 shadow-card">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {t("dashboard.section.cv")}
          </h2>
          <div className="mt-4 space-y-4">
            <div>
              <Label htmlFor="cv">
                {t("dashboard.field.cv")} <span className="text-primary">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="cv"
                  type="file"
                  accept="application/pdf"
                  onChange={(event) => void handleFile(event.target.files?.[0], "cv")}
                  className="file:mr-3 file:rounded file:border-0 file:bg-muted file:px-2 file:py-1 file:text-xs file:font-semibold"
                />
                {uploading === "cv" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
              </div>
              {form.cvUrl ? (
                <p className="mt-1 truncate text-xs text-muted-foreground" dir="ltr">
                  {form.cvUrl}
                </p>
              ) : null}
              <p className="mt-1.5 text-xs text-muted-foreground">{t("dashboard.upload.demo")}</p>
            </div>
            <div>
              <Label htmlFor="bio">
                {t("dashboard.field.bio")} <span className="text-primary">*</span>
              </Label>
              <Textarea
                id="bio"
                rows={5}
                value={form.bio}
                onChange={(event) => update("bio", event.target.value)}
                required
              />
              <p className="mt-1.5 text-xs text-muted-foreground">{form.bio.trim().length} / 40</p>
            </div>
          </div>
        </section>
      </fieldset>

      {error ? (
        <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {locked ? (
        <p className="rounded-md border border-secondary/40 bg-secondary/10 px-3 py-2 text-sm text-foreground">
          {t("dashboard.locked")}
        </p>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={busy} className="gap-2">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
            {busy ? t("dashboard.saving") : t("dashboard.submit")}
          </Button>
          <Button type="button" variant="outline" disabled={busy} onClick={() => void submit(false)}>
            {t("dashboard.saveDraft")}
          </Button>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Upload className="h-3.5 w-3.5" aria-hidden />
            {t("dashboard.demo.banner")}
          </span>
        </div>
      )}
    </form>
  );
}
