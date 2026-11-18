"use client";

import { useCallback, useEffect, useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/provider";
import type { Member } from "@/lib/types";

const SHORTLIST_KEY = "***";

function readShortlist(): string[] {
  try {
    const raw = window.localStorage.getItem(SHORTLIST_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === "string") : [];
  } catch {
    return [];
  }
}

/**
 * Recruiter shortlist toggle for a member.
 *
 * The hire request itself lives in `HireRequestButton` / `HireRequestDialog` —
 * there is only one request flow in the app now; this component must not mount a
 * second (legacy) inquiry modal.
 */
export function MemberActions({ member }: { member: Member }) {
  const { t } = useI18n();
  const [shortlisted, setShortlisted] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    setShortlisted(readShortlist().includes(member.id));
  }, [member.id]);

  const toggleShortlist = useCallback(() => {
    const current = readShortlist();
    const next = current.includes(member.id) ? current.filter((id) => id !== member.id) : [...current, member.id];
    try {
      window.localStorage.setItem(SHORTLIST_KEY, JSON.stringify(next));
    } catch {
      /* storage disabled */
    }
    const isNowShortlisted = next.includes(member.id);
    setShortlisted(isNowShortlisted);
    setAnnouncement(isNowShortlisted ? t("member.recruit.saved") : "");
  }, [member.id, t]);

  return (
    <div className="flex flex-wrap items-center gap-2.5 print-hidden">
      <Button variant="outline" size="sm" onClick={toggleShortlist} aria-pressed={shortlisted} className="gap-1.5">
        {shortlisted ? (
          <BookmarkCheck className="h-4 w-4 text-primary" aria-hidden />
        ) : (
          <Bookmark className="h-4 w-4" aria-hidden />
        )}
        {shortlisted ? t("member.recruit.shortlisted") : t("member.recruit.shortlist")}
      </Button>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}
