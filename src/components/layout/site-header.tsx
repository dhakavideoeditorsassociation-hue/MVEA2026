"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, LayoutDashboard, Menu, ShieldCheck, X } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/auth-provider";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";
import type { TranslationKey } from "@/lib/i18n/dictionaries";

import { LanguageToggle } from "./language-toggle";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";

const NAV_ITEMS: Array<{ href: string; key: TranslationKey }> = [
  { href: "/", key: "nav.home" },
  { href: "/members", key: "nav.members" },
  { href: "/programs", key: "nav.programs" },
  { href: "/media-coverage", key: "nav.coverage" },
  { href: "/about", key: "nav.about" },
  { href: "/committee", key: "nav.committee" },
];

export function SiteHeader() {
  const { t } = useI18n();
  const { user } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile sheet whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b transition-colors duration-300 print-hidden",
        scrolled
          ? "border-border/80 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70"
          : "border-transparent bg-background",
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
        <div className="flex items-center gap-6">
          <Logo />
          <nav aria-label={t("nav.primary")} className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "relative rounded-md px-3 py-2 text-[0.82rem] font-medium transition-colors",
                  isActive(item.href)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t(item.key)}
                {isActive(item.href) ? (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary" aria-hidden />
                ) : null}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <LanguageToggle className="hidden sm:inline-flex" />
          <ThemeToggle />
          {user ? (
            <>
              <Link
                href={user.role === "admin" ? "/admin" : "/dashboard"}
                className={cn(buttonVariants({ size: "sm" }), "hidden h-9 gap-1.5 px-3.5 md:inline-flex")}
              >
                {user.role === "admin" ? (
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                ) : (
                  <LayoutDashboard className="h-3.5 w-3.5" aria-hidden />
                )}
                {user.role === "admin" ? t("nav.admin") : t("nav.dashboard")}
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className={cn(buttonVariants({ size: "sm" }), "hidden h-9 gap-1.5 px-3.5 md:inline-flex")}
            >
              {t("nav.apply")}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          )}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
            className="grid h-9 w-9 place-items-center rounded-md border border-border text-foreground lg:hidden"
          >
            {open ? <X className="h-4 w-4" aria-hidden /> : <Menu className="h-4 w-4" aria-hidden />}
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-nav" className="border-t border-border bg-background lg:hidden">
          <nav aria-label={t("nav.primary")} className="container flex flex-col py-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "rounded-md px-2 py-3 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                )}
              >
                {t(item.key)}
              </Link>
            ))}
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-border pt-3">
              <LanguageToggle />
              {user ? (
                <Link
                  href={user.role === "admin" ? "/admin" : "/dashboard"}
                  className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
                >
                  <LayoutDashboard className="h-3.5 w-3.5" aria-hidden />
                  {user.role === "admin" ? t("nav.admin") : t("nav.dashboard")}
                </Link>
              ) : (
                <Link href="/login" className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}>
                  {t("nav.apply")}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              )}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
