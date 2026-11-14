import type { Lang, LocalizedText } from "@/lib/types";

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

/** Convert latin digits inside a string to Bengali digits. */
export function toBengaliDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (digit) => BN_DIGITS[Number(digit)] ?? digit);
}

export function formatNumber(value: number, lang: Lang): string {
  return lang === "bn" ? toBengaliDigits(value) : String(value);
}

/** Pick the correct side of a localized record. */
export function pick(text: LocalizedText, lang: Lang): string {
  return text[lang] || text.en;
}

/** Long, human readable date such as "১২ নভেম্বর ২০২৬". */
export function formatDate(iso: string, lang: Lang): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const label = new Intl.DateTimeFormat(lang === "bn" ? "bn-BD" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(date);
  return label;
}

export function formatShortDate(iso: string, lang: Lang): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(lang === "bn" ? "bn-BD" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(date);
}

export function formatYearRange(startYear: string, endYear: string | null, lang: Lang): string {
  const present = lang === "bn" ? "বর্তমান" : "Present";
  return `${formatNumber(Number(startYear), lang)} — ${endYear ? formatNumber(Number(endYear), lang) : present}`;
}

export function experienceLabel(years: number, lang: Lang): string {
  return lang === "bn" ? `${toBengaliDigits(years)} বছর` : `${years} year${years === 1 ? "" : "s"}`;
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part.charAt(0)).join("").toUpperCase();
}

/** Rank badge label, e.g. "#1" / "#১". */
export function rankLabel(rank: number, lang: Lang): string {
  return `#${formatNumber(rank, lang)}`;
}
