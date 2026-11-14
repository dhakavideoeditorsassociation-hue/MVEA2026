"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, UserPlus } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/form-controls";
import { Input } from "@/components/ui/input";
import { AuthError, useAuth, type AuthErrorCode } from "@/lib/auth/auth-provider";
import type { TranslationKey } from "@/lib/i18n/dictionaries";
import { useI18n } from "@/lib/i18n/provider";

const ERROR_KEYS: Record<AuthErrorCode, TranslationKey> = {
  "invalid-credentials": "auth.error.invalidCredentials",
  "email-in-use": "auth.error.emailInUse",
  "weak-password": "auth.error.weakPassword",
  "invalid-email": "auth.error.invalidEmail",
  "google-unavailable": "auth.error.googleUnavailable",
  generic: "auth.error.generic",
};

export function RegisterView() {
  const { t } = useI18n();
  const { register, mode } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<TranslationKey | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await register({ name, email, password });
      router.push("/dashboard");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof AuthError ? ERROR_KEYS[caught.code] : "auth.error.generic");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container py-12 lg:py-16">
      <div className="mx-auto max-w-lg">
        <div className="rounded-lg border border-border bg-card p-6 shadow-card sm:p-8">
          <Logo asStatic className="mb-5" size={48} />
          <p className="eyebrow">{t("auth.eyebrow")}</p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{t("auth.register.title")}</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t("auth.register.subtitle")}</p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <Label htmlFor="name">{t("auth.name")}</Label>
              <Input
                id="name"
                name="name"
                autoComplete="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                dir="ltr"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password">{t("auth.password")}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                dir="ltr"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <p className="mt-1.5 text-xs text-muted-foreground">{t("auth.passwordHint")}</p>
            </div>

            {error ? (
              <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {t(error)}
              </p>
            ) : null}

            <Button type="submit" disabled={busy} className="w-full gap-2">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <UserPlus className="h-4 w-4" aria-hidden />}
              {busy ? t("auth.register.busy") : t("auth.register.submit")}
            </Button>
          </form>

          {mode === "demo" ? (
            <p className="mt-5 rounded-md border border-border bg-muted/50 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
              {t("auth.demo.body")}
            </p>
          ) : null}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {t("auth.register.haveAccount")}{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              {t("auth.register.signIn")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
