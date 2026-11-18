"use client";

import { useState } from "react";
import { Loader2, UserPlus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label, Textarea } from "@/components/ui/form-controls";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n/provider";
import { createMember, nextMembershipId, type MemberDraft } from "@/lib/store/member-store";
import type { Member } from "@/lib/types";
import { uploadFile } from "@/lib/upload";

const EMPTY: MemberDraft = {
  fullNameBn: "",
  fullNameEn: "",
  designationBn: "",
  designationEn: "",
  mediaHouse: "",
  mediaHouseBn: "",
  committeeRole: "",
  yearsExperience: 0,
  phone: "",
  email: "",
  skills: [],
  bioBn: "",
  bioEn: "",
  photoUrl: "",
  cvUrl: "",
};

/**
 * Add Member: creates an approved member with the next sequential MVEA ID,
 * optionally uploading a portrait and CV through the Cloudinary preset.
 */
export function MemberCreatePanel({ members }: { members: Member[] }) {
  const { t, lang } = useI18n();
  const [form, setForm] = useState<MemberDraft>(EMPTY);
  const [skillsText, setSkillsText] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState<"photo" | "cv" | null>(null);
  const [created, setCreated] = useState<Member[]>([]);
  const [error, setError] = useState(false);

  function update<K extends keyof MemberDraft>(key: K, value: MemberDraft[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function upload(kind: "photo" | "cv", file: File | undefined) {
    if (!file) return;
    setUploading(kind);
    try {
      const url = await uploadFile(file, kind === "cv" ? "pdf" : "image");
      update(kind === "cv" ? "cvUrl" : "photoUrl", url);
    } finally {
      setUploading(null);
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(false);
    try {
      const member = await createMember(
        { ...form, skills: skillsText.split(",").map((skill) => skill.trim()).filter(Boolean) },
        [...members.map((item) => item.membershipId), ...created.map((item) => item.membershipId)],
      );
      setCreated((current) => [member, ...current]);
      setForm(EMPTY);
      setSkillsText("");
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  const previewId = nextMembershipId([...members.map((item) => item.membershipId), ...created.map((item) => item.membershipId)]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">{t("members.add.title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("members.add.subtitle")}</p>
        <Badge variant="outline" className="mt-2">
          Next ID: {previewId}
        </Badge>
      </div>

      <form onSubmit={submit} className="space-y-4 rounded-lg border border-border bg-card p-5 shadow-card">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="m-name-bn">{t("members.add.nameBn")}</Label>
            <Input id="m-name-bn" value={form.fullNameBn} onChange={(event) => update("fullNameBn", event.target.value)} required />
          </div>
          <div>
            <Label htmlFor="m-name-en">{t("members.add.nameEn")}</Label>
            <Input id="m-name-en" value={form.fullNameEn} onChange={(event) => update("fullNameEn", event.target.value)} />
          </div>
          <div>
            <Label htmlFor="m-desig-bn">{t("members.add.designationBn")}</Label>
            <Input id="m-desig-bn" value={form.designationBn} onChange={(event) => update("designationBn", event.target.value)} />
          </div>
          <div>
            <Label htmlFor="m-desig-en">{t("members.add.designationEn")}</Label>
            <Input id="m-desig-en" value={form.designationEn} onChange={(event) => update("designationEn", event.target.value)} />
          </div>
          <div>
            <Label htmlFor="m-house">{t("members.add.mediaHouse")}</Label>
            <Input id="m-house" value={form.mediaHouse} onChange={(event) => update("mediaHouse", event.target.value)} required />
          </div>
          <div>
            <Label htmlFor="m-house-bn">{t("members.add.mediaHouseBn")}</Label>
            <Input id="m-house-bn" value={form.mediaHouseBn} onChange={(event) => update("mediaHouseBn", event.target.value)} />
          </div>
          <div>
            <Label htmlFor="m-role">{t("members.add.role")}</Label>
            <Input id="m-role" value={form.committeeRole} onChange={(event) => update("committeeRole", event.target.value)} />
          </div>
          <div>
            <Label htmlFor="m-years">{t("members.add.years")}</Label>
            <Input
              id="m-years"
              type="number"
              min={0}
              max={60}
              value={form.yearsExperience}
              onChange={(event) => update("yearsExperience", Number(event.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="m-phone">{t("members.add.phone")}</Label>
            <Input id="m-phone" dir="ltr" value={form.phone} onChange={(event) => update("phone", event.target.value)} />
          </div>
          <div>
            <Label htmlFor="m-email">{t("members.add.email")}</Label>
            <Input id="m-email" type="email" dir="ltr" value={form.email} onChange={(event) => update("email", event.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="m-skills">{t("members.add.skills")}</Label>
            <Input id="m-skills" value={skillsText} onChange={(event) => setSkillsText(event.target.value)} />
          </div>
          <div>
            <Label htmlFor="m-bio-bn">{t("members.add.bioBn")}</Label>
            <Textarea id="m-bio-bn" rows={3} value={form.bioBn} onChange={(event) => update("bioBn", event.target.value)} />
          </div>
          <div>
            <Label htmlFor="m-bio-en">{t("members.add.bioEn")}</Label>
            <Textarea id="m-bio-en" rows={3} value={form.bioEn} onChange={(event) => update("bioEn", event.target.value)} />
          </div>
          <div>
            <Label htmlFor="m-photo">{t("members.add.photo")}</Label>
            <div className="flex items-center gap-2">
              <Input
                id="m-photo"
                type="file"
                accept="image/*"
                onChange={(event) => void upload("photo", event.target.files?.[0])}
                className="file:mr-3 file:rounded file:border-0 file:bg-muted file:px-2 file:py-1 file:text-xs file:font-semibold"
              />
              {uploading === "photo" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
            </div>
          </div>
          <div>
            <Label htmlFor="m-cv">{t("members.add.cv")}</Label>
            <div className="flex items-center gap-2">
              <Input
                id="m-cv"
                type="file"
                accept="application/pdf"
                onChange={(event) => void upload("cv", event.target.files?.[0])}
                className="file:mr-3 file:rounded file:border-0 file:bg-muted file:px-2 file:py-1 file:text-xs file:font-semibold"
              />
              {uploading === "cv" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
            </div>
          </div>
        </div>

        {error ? (
          <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {t("dashboard.validation.required")}
          </p>
        ) : null}

        <Button type="submit" disabled={busy} className="gap-1.5">
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : <UserPlus className="h-3.5 w-3.5" aria-hidden />}
          {busy ? t("members.add.creating") : t("members.add.cta")}
        </Button>
      </form>

      {created.length > 0 ? (
        <section>
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">{t("members.add.created")}</h3>
          <ul className="mt-2 divide-y divide-border rounded-lg border border-border bg-card">
            {created.map((member) => (
              <li key={member.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-sm">
                <span className="font-medium text-foreground">{lang === "bn" ? member.fullNameBn : member.fullNameEn}</span>
                <span className="text-xs text-muted-foreground">
                  {member.membershipId} · {member.mediaHouse}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
