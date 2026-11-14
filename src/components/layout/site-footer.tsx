"use client";

import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { FacebookIcon, InstagramIcon, LinkedinIcon, YoutubeIcon } from "@/components/brand-icons";
import type { AssociationInfo } from "@/lib/data/repository";
import { useI18n } from "@/lib/i18n/provider";
import type { TranslationKey } from "@/lib/i18n/dictionaries";

import { Logo } from "./logo";

const EXPLORE: Array<{ href: string; key: TranslationKey }> = [
  { href: "/members", key: "nav.members" },
  { href: "/programs", key: "nav.programs" },
  { href: "/media-coverage", key: "nav.coverage" },
  { href: "/committee", key: "nav.committee" },
];

const RESOURCES: Array<{ href: string; key: TranslationKey }> = [
  { href: "/about", key: "about.ethics.title" },
  { href: "/about", key: "footer.constitution" },
  { href: "/login", key: "footer.membership" },
  { href: "/members", key: "footer.recruiters" },
];

export function SiteFooter({ association }: { association: AssociationInfo }) {
  const { t, lang, tx } = useI18n();
  const year = new Date().getFullYear();

  const socials = [
    { href: association.socials.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: association.socials.youtube, label: "YouTube", Icon: YoutubeIcon },
    { href: association.socials.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
    { href: association.socials.instagram, label: "Instagram", Icon: InstagramIcon },
  ].filter((item) => Boolean(item.href));

  return (
    <footer className="mt-20 border-t border-border bg-card/40 print-hidden">
      <div className="container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">{t("footer.about")}</p>
          <div className="flex items-center gap-2">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid h-9 w-9 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">{t("footer.explore")}</h2>
          <ul className="mt-4 space-y-2.5">
            {EXPLORE.map((item) => (
              <li key={`${item.href}-${item.key}`}>
                <Link
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
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
                <Link
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
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
              <span>{tx(association.address)}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              <a href={`mailto:${association.email}`} className="link-underline">
                {association.email}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              <a href={`tel:${association.phone.replace(/\s+/g, "")}`} dir="ltr" className="link-underline">
                {association.phone}
              </a>
            </li>
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
