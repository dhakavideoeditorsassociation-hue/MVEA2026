"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BadgeCheck, CalendarDays, Clock, LogOut, Plus, ShieldAlert } from "lucide-react";

import { ApplicationForm } from "@/components/dashboard/application-form";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/form-controls";
import { useAuth } from "@/lib/auth/auth-provider";
import { formatDate } from "@/lib/format";
import { useI18n } from "@/lib/i18n/provider";
import type { TranslationKey } from "@/lib/i18n/dictionaries";
import { getApplication, saveApplication } from "@/lib/store/admin-store";
import type { MembershipApplication } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_STYLE: Record<MembershipApplication["status"], { badge: string; key: TranslationKey; hint: TranslationKey }> = {
  draft: { badge: "bg-muted text-muted-foreground", key: "dashboard.status.draft", hint: "dashboard.status.noneHint" },
  pending: { badge: "bg-secondary/15 text-secondary", key: "dashboard.status.pending", hint: "dashboard.status.pendingHint" },
  approved: { badge: "bg-primary/12 text-primary", key: "dashboard.status.approved", hint: "dashboard.status.approvedHint" },
  rejected: {
    badge: "bg-destructive/12 text-destructive",
    key: "dashboard.status.rejected",
    hint: "dashboard.status.rejectedHint",
  },
};

function emptyApplication(user: { uid: string; email: string; displayName: string }): MembershipApplication {
  return {
    uid: user.uid,
    email: user.email,
    fullNameBn: "",
    fullNameEn: user.displayName,
    phone: "",
    photoUrl: "",
    mediaHouse: "",
    designation: "",
    yearsExperience: 0,
    workHistory: [{ id: `wh-${Date.now()}`, organization: "", role: "", startYear: "", endYear: "" }],
    skills: [],
    tools: [],
    showreelUrl: "",
    facebook: "",
    linkedin: "",
    youtube: "",
    cvUrl: "",
    bio: "",
    status: "draft",
    membershipId: null,
    rankOrder: null,
    submittedAt: null,
    updatedAt: new Date().toISOString(),
  };
}

export function DashboardView() {
  const { t, lang } = useI18n();
  const { user, ready, logout, mode } = useAuth();
  const router = useRouter();
  const [application, setApplication] = useState<MembershipApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    void getApplication(user.uid)
      .then((record) => {
        if (!cancelled) setApplication(record);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [ready, user]);

  const handleSave = useCallback(
    async (draft: MembershipApplication, submit: boolean) => {
      setBusy(true);
      setNotice(null);
      try {
        const next: MembershipApplication = {
          ...draft,
          status: submit ? "pending" : draft.status === "pending" ? "pending" : "draft",
          submittedAt: submit ? new Date().toISOString() : draft.submittedAt,
        };
        const saved = await saveApplication(next);
        setApplication(saved);
        setNotice(submit ? t("dashboard.submitted") : t("dashboard.savedDraft"));
      } finally {
        setBusy(false);
      }
    },
    [t],
  );

  async function handleLogout() {
    await logout();
    router.push("/");
    router.refresh();
  }

  if (!ready || loading) {
    return (
      <div className="container max-w-4xl space-y-4 py-16">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container max-w-lg py-20 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
          <ShieldAlert className="h-6 w-6" aria-hidden />
        </span>
        <h1 className="mt-5 text-2xl font-bold tracking-tight text-foreground">{t("auth.login.title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("dashboard.status.noneHint")}</p>
        <Link href="/login" className={`${buttonVariants({ size: "lg" })} mt-6`}>
          {t("auth.login.submit")}
        </Link>
      </div>
    );
  }

  const status = application?.status ?? null;
  const style = status ? STATUS_STYLE[status] : null;
  const locked = status === "approved";
  const formInitial = application ?? emptyApplication(user);

  return (
    <div className="container max-w-4xl py-10 lg:py-14">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">{t("dashboard.eyebrow")}</p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{t("dashboard.title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("dashboard.welcome")}{" "}
            <span className="font-semibold text-foreground">{user.displayName}</span>
            <span className="mx-1.5" aria-hidden>
              ·
            </span>
            <span dir="ltr">{user.email}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {user.role === "admin" ? (
            <Link href="/admin" className={buttonVariants({ variant: "outline", size: "sm" })}>
              {t("nav.admin")}
            </Link>
          ) : null}
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1.5">
            <LogOut className="h-3.5 w-3.5" aria-hidden />
            {t("admin.signOut")}
          </Button>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-border bg-card p-5 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {t("dashboard.status.label")}
            </span>
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-[0.7rem] font-bold",
                style ? style.badge : "bg-muted text-muted-foreground",
              )}
            >
              {style ? t(style.key) : t("dashboard.status.none")}
            </span>
          </div>
          {application?.membershipId ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <BadgeCheck className="h-3.5 w-3.5 text-primary" aria-hidden />
              {t("dashboard.membershipId")}: {application.membershipId}
            </span>
          ) : null}
          {application?.rankOrder ? (
            <Badge variant="secondary">
              {t("dashboard.rank")}: #{application.rankOrder}
            </Badge>
          ) : null}
        </div>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {style ? t(style.hint) : t("dashboard.status.noneHint")}
        </p>

        {application?.submittedAt ? (
          <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden />
            {t("dashboard.submittedOn")}: {formatDate(application.submittedAt, lang)}
          </p>
        ) : null}

        {mode === "demo" ? (
          <p className="mt-3 inline-flex items-start gap-1.5 rounded-md border border-secondary/35 bg-secondary/10 px-3 py-2 text-xs leading-relaxed text-foreground">
            <Clock className="mt-0.5 h-3.5 w-3.5 text-secondary" aria-hidden />
            {t("dashboard.demo.banner")}
          </p>
        ) : null}
      </div>

      {notice ? (
        <p aria-live="polite" className="mt-4 rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-foreground">
          {notice}
        </p>
      ) : null}

      {!application ? (
        <div className="mt-6 rounded-lg border border-dashed border-border bg-card/60 p-8 text-center">
          <h2 className="text-lg font-semibold text-foreground">{t("dashboard.form.title")}</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">{t("dashboard.form.subtitle")}</p>
          <Button
            className="mt-5 gap-1.5"
            onClick={() => {
              setApplication(emptyApplication(user));
            }}
          >
            <Plus className="h-4 w-4" aria-hidden />
            {t("dashboard.start")}
          </Button>
        </div>
      ) : (
        <div className="mt-8">
          <div className="mb-4">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">{t("dashboard.form.title")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("dashboard.form.subtitle")}</p>
          </div>
          <ApplicationForm initial={formInitial} onSave={handleSave} busy={busy} locked={locked} />
        </div>
      )}
    </div>
  );
}
