"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/provider";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useI18n();

  useEffect(() => {
    // Surface the digest so the committee can correlate it with server logs.
    console.error("Unhandled application error", error);
  }, [error]);

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{t("common.error.title")}</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">{t("common.error.body")}</p>
      {error.digest ? <p className="mt-2 font-mono text-xs text-muted-foreground/80">ref: {error.digest}</p> : null}
      <Button size="lg" className="mt-8" onClick={reset}>
        <RotateCcw className="h-4 w-4" aria-hidden />
        {t("common.error.retry")}
      </Button>
    </div>
  );
}
