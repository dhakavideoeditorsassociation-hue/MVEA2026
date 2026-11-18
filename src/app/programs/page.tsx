import type { Metadata } from "next";

import { ProgramsView } from "@/components/programs/programs-view";
import { isPostCategory } from "@/lib/categories";
import { repo } from "@/lib/data";

/**
 * Legacy URL. `/articles` is canonical, so this route renders the same view with
 * a canonical tag and noindex to avoid duplicate indexing, and keeps old links
 * (and shared Facebook posts) working.
 */
export const metadata: Metadata = {
  title: "Articles",
  alternates: { canonical: "/articles" },
  robots: { index: false, follow: true },
};

type PageProps = { searchParams: { category?: string } };

export default async function ProgramsLegacyPage({ searchParams }: PageProps) {
  const activeCategory = isPostCategory(searchParams.category) ? searchParams.category : undefined;

  const [posts, allPosts] = await Promise.all([
    repo.listPosts(activeCategory ? { category: activeCategory } : {}),
    repo.listPosts(),
  ]);

  const counts: Record<string, number> = { all: allPosts.length };
  allPosts.forEach((post) => {
    counts[post.category] = (counts[post.category] ?? 0) + 1;
  });

  return <ProgramsView posts={posts} activeCategory={activeCategory} counts={counts} basePath="/articles" />;
}