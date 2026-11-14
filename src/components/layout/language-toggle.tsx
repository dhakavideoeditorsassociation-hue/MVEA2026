"use client";

import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang, t } = useI18n();

  return (
    <div
      role="group"
      aria-label={t("lang.label")}
      className={cn(
        "inline-flex items-center rounded-md border border-border bg-background/60 p-0.5 text-[0.7rem] font-semibold",
        className,
      )}
    >
      {(["bn", "en"] as const).map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => setLang(value)}
          aria-pressed={lang === value}
          className={cn(
            "rounded-[5px] px-2 py-1 transition-colors",
            lang === value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {value === "bn" ? "বাংলা" : "EN"}
        </button>
      ))}
    </div>
  );
}
