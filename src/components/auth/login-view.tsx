"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Loader2, LogIn, ShieldCheck } from "lucide-react";

import { AuthError, useAuth, type AuthErrorCode } from "@/lib/auth/auth-provider";
import { useI18n } from "@/lib/i18n/provider";
import type { TranslationKey } from "@/lib/i18n/dictionaries";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/form-controls";
import { Input } from "@/components/ui/input";

const ERROR_KEYS: Record<AuthErrorCode, TranslationKey> = {
  "invalid-credentials": "auth.error.invalidCredentials",
  "email-in-use": "auth.error.emailInUse",
  "weak-password": "auth.error.weakPassword",
  "invalid-email": "auth.error.invalidEmail",
  "google-unavailable": "auth.error.googleUnavailable",
  generic: "auth.error.generic",
};

export function LoginView() {
  const { t } = useI18n();
  const { login, loginWithGoogle, mode } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<TranslationKey | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const session = await login(email, password);
      router.push(session.role === "admin" ? "/admin" : "/dashboard");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof AuthError ? ERROR_KEYS[caught.code] : "auth.error.generic");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    try {
      const session = await loginWithGoogle();
      router.push(session.role === "admin" ? "/admin" : "/dashboard");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof AuthError ? ERROR_KEYS[caught.code] : "auth.error.generic");
    }
  }

  return (
    <div className="container py-12 lg:py-16">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-lg border border-border bg-card p-6 shadow-card sm:p-8">
          <p className="eyebrow">{t("auth.eyebrow")}</p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{t("auth.login.title")}</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t("auth.login.subtitle")}</p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
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
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  dir="ltr"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
                  className="absolute right-1 top-1 grid h-8 w-9 place-items-center rounded text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
                </button>
              </div>
            </div>

            {error ? (
              <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {t(error)}
              </p>
            ) : null}

            <Button type="submit" disabled={busy} className="w-full gap-2">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <LogIn className="h-4 w-4" aria-hidden />}
              {busy ? t("auth.login.busy") : t("auth.login.submit")}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
            <span className="h-px flex-1 bg-border" aria-hidden />
            or
            <span className="h-px flex-1 bg-border" aria-hidden />
          </div>

          <Button variant="outline" className="w-full gap-2" onClick={handleGoogle} disabled={mode === "demo"}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
              <path
                fill="currentColor"
                d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.4Z"
              />
              <path
                fill="currentColor"
                d="M12 22c2.7 0 4.9-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.7-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z"
                opacity="0.75"
              />
              <path fill="currentColor" d="M6.4 14a6 6 0 0 1 0-3.8V7.6H3.1a10 10 0 0 0 0 8.9L6.4 14Z" opacity="0.5" />
              <path fill="currentColor" d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 3.1 7.6l3.3 2.6C7.2 7.7 9.4 5.9 12 5.9Z" opacity="0.35" />
            </svg>
            {t("auth.google")}
          </Button>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {t("auth.login.noAccount")}{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              {t("auth.login.createAccount")}
            </Link>
          </p>
        </div>

        <aside className="space-y-4">
          <div className="rounded-lg border border-primary/25 bg-primary/5 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" aria-hidden />
              {t("auth.demo.title")}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{t("auth.demo.body")}</p>

            <div className="mt-4 space-y-2">
              {[
                { role: t("auth.demo.admin"), email: "admin@gvea.org", password: "Gvea@2026" },
                { role: t("auth.demo.member"), email: "editor@gvea.org", password: "Gvea@2026" },
              ].map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => {
                    setEmail(account.email);
                    setPassword(account.password);
                  }}
                  className="w-full rounded-md border border-border bg-card px-3 py-2 text-left text-xs transition-colors hover:border-primary/50"
                >
                  <span className="font-semibold text-foreground">{account.role}</span>
                  <span className="ml-2 text-muted-foreground" dir="ltr">
                    {account.email} · {account.password}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <p className="text-sm font-semibold text-foreground">{t("home.cta.title")}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{t("home.cta.body")}</p>
            <Link href="/about" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
              {t("home.cta.secondary")}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
