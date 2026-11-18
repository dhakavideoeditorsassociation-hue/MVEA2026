"use client";

import { Loader2 } from "lucide-react";

import { PressReleaseView } from "@/components/press/press-release-view";
import { PostView } from "@/components/programs/post-view";
import { useLiveEditorial } from "@/lib/live/editorial";

/**
 * Fallback renderers for editorial items that exist only in Firestore (added or
 * edited from `/admin` after the last build). The live provider has already
 * fetched the collections, so these just wait for it and pick the record out.
 */

function Loading() {
  return (
    <div className="container flex min-h-[40vh] items-center justify-center py-20">
      <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        Loading…
      </span>
    </div>
  );
}

function Missing({ label }: { label: string }) {
  return (
    <div className="container max-w-lg py-24 text-center">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">{label}</h1>
      <p className="mt-2 text-sm text-muted-foreground">This item is not published, or it was removed from the site.</p>
    </div>
  );
}

export function RemotePressRelease({ slug }: { slug: string }) {
  const live = useLiveEditorial();
  if (!live.ready) return <Loading />;
  const release = live.releases.find((item) => item.slug === slug || item.id === slug);
  if (!release) return <Missing label="Press release not found" />;
  return <PressReleaseView release={release} />;
}

export function RemoteArticle({ slug }: { slug: string }) {
  const live = useLiveEditorial();
  if (!live.ready) return <Loading />;
  const article = live.articles.find((item) => item.slug === slug || item.id === slug);
  if (!article) return <Missing label="Article not found" />;

  const related = live.articles.filter((item) => item.id !== article.id && item.category === article.category).slice(0, 4);
  return <PostView post={article} related={related} />;
}
