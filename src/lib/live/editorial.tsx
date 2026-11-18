"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { isFirebaseConfigured } from "@/lib/firebase";
import type { CmsPost, LocalizedText, PostCategory, PressArticle, PressRelease } from "@/lib/types";

/**
 * Live editorial data.
 *
 * Everything published from `/admin` lands in Firestore, but the public pages are
 * pre-rendered from `seed.ts`. This provider fetches the live collections once on
 * mount so newly added, edited or deleted coverage / press releases / articles
 * appear immediately, without waiting for a Vercel rebuild.
 *
 * Collections are read defensively from both the legacy and canonical names.
 */

const COVERAGE_COLLECTIONS = ["press_articles", "press_coverage"];
const RELEASE_COLLECTIONS = ["press_releases"];
const ARTICLE_COLLECTIONS = ["cms_posts", "articles"];

export type LiveEditorial = {
  coverage: PressArticle[];
  releases: PressRelease[];
  articles: CmsPost[];
  ready: boolean;
  reload: () => Promise<void>;
};

const LiveEditorialContext = createContext<LiveEditorial | null>(null);

const EMPTY: LiveEditorial = {
  coverage: [],
  releases: [],
  articles: [],
  ready: true,
  reload: async () => undefined,
};

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function localised(value: unknown, fallback = ""): LocalizedText {
  if (value && typeof value === "object") {
    const record = value as { bn?: unknown; en?: unknown };
    const bn = text(record.bn);
    const en = text(record.en);
    return { bn: bn || en || fallback, en: en || bn || fallback };
  }
  return { bn: fallback, en: fallback };
}

function paragraphs(value: unknown): LocalizedText[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? { bn: item, en: item } : localised(item)))
    .filter((item) => item.bn || item.en);
}

function iso(value: unknown): string {
  if (typeof value === "string" && value) return value;
  if (value && typeof value === "object" && "seconds" in (value as Record<string, unknown>)) {
    const seconds = Number((value as { seconds?: number }).seconds ?? 0);
    return new Date(seconds * 1000).toISOString();
  }
  return new Date().toISOString();
}

function mapCoverage(id: string, data: Record<string, unknown>): PressArticle | null {
  const url = text(data.url);
  const title = localised(data.title);
  if (!url || (!title.bn && !title.en)) return null;
  return {
    id: text(data.id) || id,
    title,
    excerpt: localised(data.excerpt, title.en),
    source: text(data.source) || text(data.outlet) || "Press",
    url,
    imageUrl: text(data.imageUrl),
    publishedAt: iso(data.publishedAt),
    featured: Boolean(data.featured),
  };
}

function mapRelease(id: string, data: Record<string, unknown>): PressRelease | null {
  const title = localised(data.title);
  if (!title.bn && !title.en) return null;
  return {
    id: text(data.id) || id,
    slug: text(data.slug) || id,
    title,
    subheadline: data.subheadline ? localised(data.subheadline) : undefined,
    excerpt: localised(data.excerpt, title.en),
    body: paragraphs(data.body),
    refNo: text(data.refNo) || undefined,
    url: text(data.url) || text(data.facebookUrl) || "",
    imageUrl: text(data.imageUrl),
    publishedAt: iso(data.publishedAt),
    featured: Boolean(data.featured),
  };
}

const CATEGORIES: PostCategory[] = ["feature", "interview", "guide", "workshop", "ethics"];

function mapArticle(id: string, data: Record<string, unknown>): CmsPost | null {
  const title = localised(data.title);
  if (!title.bn && !title.en) return null;
  const category = CATEGORIES.includes(data.category as PostCategory) ? (data.category as PostCategory) : "feature";
  return {
    id: text(data.id) || id,
    slug: text(data.slug) || id,
    category,
    title,
    subheadline: data.subheadline ? localised(data.subheadline) : undefined,
    excerpt: localised(data.excerpt, title.en),
    body: paragraphs(data.body),
    coverImageUrl: text(data.coverImageUrl),
    author: text(data.author) || "MVEA",
    publishedAt: iso(data.publishedAt),
    readingMinutes: typeof data.readingMinutes === "number" ? data.readingMinutes : 3,
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    featured: Boolean(data.featured),
  };
}

async function loadCollection<T>(names: string[], mapper: (id: string, data: Record<string, unknown>) => T | null): Promise<T[]> {
  if (!isFirebaseConfigured) return [];
  const { collection, getDocs } = await import("firebase/firestore");
  const { getFirebaseDb } = await import("@/lib/firebase");
  const db = getFirebaseDb();
  const results: T[] = [];

  for (const name of names) {
    try {
      const snapshot = await getDocs(collection(db, name));
      snapshot.docs.forEach((docSnap) => {
        const mapped = mapper(docSnap.id, docSnap.data() as Record<string, unknown>);
        if (mapped) results.push(mapped);
      });
    } catch {
      /* missing collection or rules — ignore, seed data still renders */
    }
  }
  return results;
}

export function LiveEditorialProvider({ children }: { children: React.ReactNode }) {
  const [coverage, setCoverage] = useState<PressArticle[]>([]);
  const [releases, setReleases] = useState<PressRelease[]>([]);
  const [articles, setArticles] = useState<CmsPost[]>([]);
  const [ready, setReady] = useState(false);

  const reload = useCallback(async () => {
    const [liveCoverage, liveReleases, liveArticles] = await Promise.all([
      loadCollection(COVERAGE_COLLECTIONS, mapCoverage),
      loadCollection(RELEASE_COLLECTIONS, mapRelease),
      loadCollection(ARTICLE_COLLECTIONS, mapArticle),
    ]);
    setCoverage(liveCoverage);
    setReleases(liveReleases);
    setArticles(liveArticles);
    setReady(true);
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const value = useMemo<LiveEditorial>(() => ({ coverage, releases, articles, ready, reload }), [coverage, releases, articles, ready, reload]);

  return <LiveEditorialContext.Provider value={value}>{children}</LiveEditorialContext.Provider>;
}

export function useLiveEditorial(): LiveEditorial {
  return useContext(LiveEditorialContext) ?? EMPTY;
}

/**
 * Merge live records over seed records.
 *
 * Live wins on ID/slug collisions (so an admin edit replaces the seed copy),
 * records listed in `deleted` disappear, optional URL de-duplication keeps one
 * card per article, and the result is newest-first.
 */
export function mergeEditorial<T extends { id: string; publishedAt: string }>(
  seed: T[],
  live: T[],
  options: { deleted?: string[]; urlOf?: (item: T) => string | undefined } = {},
): T[] {
  const deleted = new Set(options.deleted ?? []);
  const keyOf = (item: T) => (item as unknown as { slug?: string }).slug || item.id;

  const map = new Map<string, T>();
  [...seed, ...live].forEach((item) => {
    if (deleted.has(item.id) || deleted.has(keyOf(item))) return;
    map.set(keyOf(item), item);
  });

  const seenUrls = new Set<string>();
  return Array.from(map.values())
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .filter((item) => {
      const url = options.urlOf?.(item);
      if (!url) return true;
      if (seenUrls.has(url)) return false;
      seenUrls.add(url);
      return true;
    });
}