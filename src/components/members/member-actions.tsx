"use client";

import { useCallback, useEffect, useState } from "react";
import { Bookmark, BookmarkCheck, Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Label, Textarea } from "@/components/ui/form-controls";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n/provider";
import type { Member } from "@/lib/types";

const SHORTLIST_KEY = "gvea.shortlist";

function readShortlist(): string[] {
  try {
    const raw = window.localStorage.getItem(SHORTLIST_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === "string") : [];
  } catch {
    return [];
  }
}

type InquiryState = "idle" | "sending" | "sent" | "error";

export function MemberActions({ member }: { member: Member }) {
  const { t } = useI18n();
  const [shortlisted, setShortlisted] = useState(false);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<InquiryState>("idle");
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    setShortlisted(readShortlist().includes(member.id));
  }, [member.id]);

  const toggleShortlist = useCallback(() => {
    const current = readShortlist();
    const next = current.includes(member.id)
      ? current.filter((id) => id !== member.id)
      : [...current, member.id];
    try {
      window.localStorage.setItem(SHORTLIST_KEY, JSON.stringify(next));
    } catch {
      /* storage disabled */
    }
    const isNowShortlisted = next.includes(member.id);
    setShortlisted(isNowShortlisted);
    setAnnouncement(isNowShortlisted ? t("member.recruit.saved") : "");
  }, [member.id, t]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setStatus("sending");
    try {
      const response = await fetch("/api/recruiter-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId: member.id,
          memberName: member.fullNameEn,
          recruiterName: formData.get("recruiterName"),
          company: formData.get("company"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          message: formData.get("message"),
        }),
      });
      if (!response.ok) throw new Error("request failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2.5 print-hidden">
      <Button variant="outline" size="sm" onClick={toggleShortlist} aria-pressed={shortlisted} className="gap-1.5">
        {shortlisted ? (
          <BookmarkCheck className="h-4 w-4 text-primary" aria-hidden />
        ) : (
          <Bookmark className="h-4 w-4" aria-hidden />
        )}
        {shortlisted ? t("member.recruit.shortlisted") : t("member.recruit.shortlist")}
      </Button>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)} className="gap-1.5">
        <Send className="h-3.5 w-3.5" aria-hidden />
        {t("member.recruit.inquiry")}
      </Button>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setStatus("idle");
        }}
        title={t("inquiry.title")}
        description={t("inquiry.body")}
      >
        {status === "sent" ? (
          <div className="space-y-4">
            <p className="rounded-md border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-foreground">
              {t("inquiry.success")}
            </p>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t("common.close")}
            </Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="recruiterName">{t("inquiry.name")}</Label>
                <Input id="recruiterName" name="recruiterName" required autoComplete="name" />
              </div>
              <div>
                <Label htmlFor="company">{t("inquiry.company")}</Label>
                <Input id="company" name="company" required autoComplete="organization" />
              </div>
              <div>
                <Label htmlFor="email">{t("inquiry.email")}</Label>
                <Input id="email" name="email" type="email" required autoComplete="email" dir="ltr" />
              </div>
              <div>
                <Label htmlFor="phone">
                  {t("inquiry.phone")} <span className="text-muted-foreground">({t("common.optional")})</span>
                </Label>
                <Input id="phone" name="phone" type="tel" autoComplete="tel" dir="ltr" />
              </div>
            </div>
            <div>
              <Label htmlFor="message">{t("inquiry.message")}</Label>
              <Textarea id="message" name="message" required rows={4} />
            </div>
            <p className="text-xs text-muted-foreground">
              {member.mediaHouse} · {member.fullNameEn}
            </p>
            {status === "error" ? (
              <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {t("inquiry.error")}
              </p>
            ) : null}
            <div className="flex items-center justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                {t("inquiry.cancel")}
              </Button>
              <Button type="submit" disabled={status === "sending"} className="gap-1.5">
                {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                {status === "sending" ? t("inquiry.sending") : t("inquiry.submit")}
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </div>
  );
}
