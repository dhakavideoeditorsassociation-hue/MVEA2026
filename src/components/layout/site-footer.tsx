"use client";

import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { FacebookIcon } from "@/components/brand-icons";
import { useSiteSettings } from "@/lib/cms/site-settings";
import type { TranslationKey } from "@/lib/i18n/dictionaries";
import { useI18n } from "@/lib/i18n/provider";

import { Logo } from "./logo";

const EXPLORE: Array<{ href: string; key: TranslationKey }> = [
  { href: "/members", key: "nav.members" },
  { href: "/articles", key: "nav.articles" },
  { href: "/media-coverage", key: "nav.coverage" },
  { href: "/committee", key: "nav.committee" },
];

const RESOURCES: Array<{ href: string; key: TranslationKey }> = [
  { href: "/about", key: "footer.ethics" },
  { href: "/about", key: "footer.constitution" },
  { href: "/login", key: "footer.membership" },
  { href: "/resources", key: "nav.resources" },
];

export function SiteFooter() {
  const { t, lang, tx } = useI18n();
  const { settings } = useSiteSettings();
  const year = new Date().getFullYear();
  const contact = settings.contact;

  return (
    <footer className="mt-20 border-t border-border bg-card/40 print-hidden">
      <div className="container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo asStatic />
          <p className="text-xs font-medium text-muted-foreground">
            {lang === "bn" ? t("brand.orgBn") : "Gonomadhyam Video Editor Association"}
          </p>
          <div className="flex items-center gap-2">
            <a
              href={contact.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("footer.facebook")}
              className="grid h-9 w-9 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">{t("footer.explore")}</h2>
          <ul className="mt-4 space-y-2.5">
            {EXPLORE.map((item) => (
              <li key={`${item.href}-${item.key}`}>
                <Link href={item.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">{t("footer.resources")}</h2>
          <ul className="mt-4 space-y-2.5">
            {RESOURCES.map((item) => (
              <li key={`${item.href}-${item.key}`}>
                <Link href={item.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">{t("footer.contact")}</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <span>{tx(contact.address)}</span>
            </li>
            {contact.emails.map((email) => (
              <li key={email} className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <a href={`mailto:${email}`} className="link-underline break-all" dir="ltr">
                  {email}
                </a>
              </li>
            ))}
            {contact.phones.map((phone) => (
              <li key={phone} className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                <a href={`tel:${phone.replace(/\s+/g, "")}`} dir="ltr" className="link-underline">
                  {phone}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border/70">
        <div className="container flex flex-col items-start justify-between gap-2 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>
            © {year} {t("brand.name")}. {t("footer.rights")}
          </p>
          <p className="flex items-center gap-2">
            <span>{t("footer.address")}</span>
            <span aria-hidden>·</span>
            <span>{lang === "bn" ? "ফ্রি-টিয়ার স্ট্যাকে নির্মিত" : "Built on a free-tier stack"}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
