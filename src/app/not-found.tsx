"use client";

import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/provider";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
        <FileQuestion className="h-6 w-6" aria-hidden />
      </span>
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{t("common.notFound.title")}</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">{t("common.notFound.body")}</p>
      <Link href="/" className={`${buttonVariants({ size: "lg" })} mt-8`}>
        <Home className="h-4 w-4" aria-hidden />
        {t("common.notFound.cta")}
      </Link>
    </div>
  );
}
