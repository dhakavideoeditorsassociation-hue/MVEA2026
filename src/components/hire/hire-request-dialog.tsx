"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Label, Select, Textarea } from "@/components/ui/form-controls";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n/provider";
import { submitHireRequest, type HireDraft } from "@/lib/store/hire-store";
import type { HireRequest } from "@/lib/types";

type HireRequestDialogProps = {
  open: boolean;
  onClose: () => void;
  /** Optional member being requested; omit for a general request. */
  member?: { id: string; name: string };
};

const EMPTY: HireDraft = {
  memberId: "",
  memberName: "",
  organization: "",
  requesterName: "",
  requesterRole: "",
  phone: "",
  email: "",
  engagement: "full-time",
  note: "",
};

/**
 * 2-step Request Editor flow: details → official confirmation.
 */
export function HireRequestDialog({ open, onClose, member }: HireRequestDialogProps) {
  const { t } = useI18n();
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<HireDraft>({ ...EMPTY });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [result, setResult] = useState<HireRequest | null>(null);

  function close() {
    setStep(1);
    setForm({ ...EMPTY });
    setError(false);
    setResult(null);
    onClose();
  }

  function update<K extends keyof HireDraft>(key: K, value: HireDraft[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function valid() {
    return Boolean(
      form.organization.trim() &&
        form.requesterName.trim() &&
        form.requesterRole.trim() &&
        form.phone.trim() &&
        /.+@.+\..+/.test(form.email),
    );
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!valid()) {
      setError(true);
      return;
    }
    setBusy(true);
    setError(false);
    try {
      const saved = await submitHireRequest({
        ...form,
        memberId: member?.id ?? form.memberId,
        memberName: member?.name ?? form.memberName,
      });
      setResult(saved);
      setStep(2);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={close}
      title={step === 1 ? t("hire.title") : t("hire.successTitle")}
      description={step === 1 ? t("hire.subtitle") : undefined}
    >
      {step === 2 && result ? (
        <div className="space-y-4">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-primary/12 text-primary">
            <CheckCircle2 className="h-6 w-6" aria-hidden />
          </span>
          <p className="text-sm leading-relaxed text-foreground">{t("hire.successBody")}</p>
          <dl className="rounded-md border border-border bg-muted/40 px-4 py-3 text-xs">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">{t("hire.successRef")}</dt>
              <dd className="font-mono font-semibold text-foreground">{result.id}</dd>
            </div>
            <div className="mt-1.5 flex justify-between gap-3">
              <dt className="text-muted-foreground">{t("hire.organization")}</dt>
              <dd className="text-right font-medium text-foreground">{result.organization}</dd>
            </div>
            {result.memberName ? (
              <div className="mt-1.5 flex justify-between gap-3">
                <dt className="text-muted-foreground">{t("hire.forMember")}</dt>
                <dd className="text-right font-medium text-foreground">{result.memberName}</dd>
              </div>
            ) : null}
          </dl>
          <Button onClick={close} className="w-full">
            {t("common.close")}
          </Button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          {member ? (
            <p className="rounded-md border border-primary/25 bg-primary/5 px-3 py-2 text-xs font-semibold text-foreground">
              {t("hire.forMember")}: {member.name}
            </p>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="hire-org">
                {t("hire.organization")} <span className="text-primary">*</span>
              </Label>
              <Input id="hire-org" value={form.organization} onChange={(e) => update("organization", e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="hire-name">
                {t("hire.requester")} <span className="text-primary">*</span>
              </Label>
              <Input id="hire-name" value={form.requesterName} onChange={(e) => update("requesterName", e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="hire-role">
                {t("hire.role")} <span className="text-primary">*</span>
              </Label>
              <Input id="hire-role" value={form.requesterRole} onChange={(e) => update("requesterRole", e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="hire-phone">
                {t("hire.phone")} <span className="text-primary">*</span>
              </Label>
              <Input id="hire-phone" type="tel" dir="ltr" value={form.phone} onChange={(e) => update("phone", e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="hire-email">
                {t("hire.email")} <span className="text-primary">*</span>
              </Label>
              <Input id="hire-email" type="email" dir="ltr" value={form.email} onChange={(e) => update("email", e.target.value)} required />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="hire-engagement">{t("hire.engagement")}</Label>
              <Select
                id="hire-engagement"
                value={form.engagement}
                onChange={(e) => update("engagement", e.target.value as HireDraft["engagement"])}
              >
                <option value="full-time">{t("hire.engagementFull")}</option>
                <option value="project">{t("hire.engagementProject")}</option>
                <option value="documentary">{t("hire.engagementDocumentary")}</option>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="hire-note">{t("hire.note")}</Label>
              <Textarea id="hire-note" rows={3} value={form.note} onChange={(e) => update("note", e.target.value)} />
            </div>
          </div>

          {error ? (
            <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {t("hire.error")}
            </p>
          ) : null}

          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="ghost" onClick={close}>
              {t("hire.cancel")}
            </Button>
            <Button type="submit" disabled={busy} className="gap-1.5">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-3.5 w-3.5" aria-hidden />}
              {busy ? t("hire.sending") : t("hire.submit")}
            </Button>
          </div>

          <p className="flex items-center gap-1.5 text-[0.7rem] text-muted-foreground">
            <ArrowLeft className="h-3 w-3" aria-hidden />
            {t("hire.step")} 1 / 2
            <ArrowRight className="ml-auto h-3 w-3" aria-hidden />
          </p>
        </form>
      )}
    </Dialog>
  );
}
