"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { PageHero } from "@/components/common/page-hero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n/provider";

/**
 * Member ID verification portal.
 *
 * Newsrooms, agencies and event organisers land here from the footer link; a
 * valid ID opens the official verified card at `/verify/[memberId]`, which is
 * also what the QR code on a member card points to.
 */
export function VerifyIndexView() {
  const { t } = useI18n();
  const router = useRouter();
  const [value, setValue] = useState("");

  return (
    <>
      <PageHero eyebrow={t("verify.eyebrow")} title={t("verify.index.title")} subtitle={t("verify.index.subtitle")} />

      <section className="container max-w-xl py-12 lg:py-16">
        <form
          className="rounded-lg border border-border bg-card p-6 shadow-card"
          onSubmit={(event) => {
            event.preventDefault();
            const clean = value.trim().toUpperCase();
            if (clean) router.push(`/verify/${encodeURIComponent(clean)}`);
          }}
        >
          <label htmlFor="member-id" className="field-label">
            {t("verify.id")}
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              id="member-id"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder={t("verify.index.placeholder")}
              dir="ltr"
              className="font-mono"
              autoComplete="off"
              required
            />
            <Button type="submit" className="gap-1.5 sm:w-auto">
              <ShieldCheck className="h-4 w-4" aria-hidden />
              {t("resources.verify.button")}
            </Button>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{t("resources.verify.body")}</p>
        </form>

        <div className="mt-6 rounded-lg border border-dashed border-border p-4 text-xs leading-relaxed text-muted-foreground">
          <p className="font-semibold text-foreground">MVEA · {t("verify.eyebrow")}</p>
          <p className="mt-1">{t("pressrelease.contact")}</p>
        </div>
      </section>
    </>
  );
}
