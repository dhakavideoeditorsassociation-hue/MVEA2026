"use client";

import Link from "next/link";
import { Megaphone, X } from "lucide-react";
import { useState } from "react";

import { useSiteSettings } from "@/lib/cms/site-settings";

/**
 * Toggleable urgent notice shown above the header. Content and visibility come
 * from site_settings.announcement, so the committee can publish a notice without
 * a deploy.
 */
export function AnnouncementTicker() {
  const { settings, tx } = useSiteSettings();
  const [dismissed, setDismissed] = useState(false);

  const announcement = settings.announcement;
  if (!announcement?.enabled || dismissed || !tx(announcement.text)) return null;

  return (
    <div className="relative z-50 border-b border-primary/30 bg-primary/10 print-hidden">
      <div className="container flex items-center gap-3 py-2">
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-[0.1em] text-primary-foreground">
          <Megaphone className="h-3 w-3" aria-hidden />
          {announcement.href ? "LIVE" : "NOTICE"}
        </span>
        {announcement.href ? (
          <Link href={announcement.href} className="min-w-0 flex-1 truncate text-xs font-medium text-foreground hover:text-primary sm:text-sm">
            {tx(announcement.text)}
          </Link>
        ) : (
          <p className="min-w-0 flex-1 truncate text-xs font-medium text-foreground sm:text-sm">{tx(announcement.text)}</p>
        )}
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss announcement"
          className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>
    </div>
  );
}
