import type { Metadata } from "next";

import { ProgramsView } from "@/components/programs/programs-view";
import { repo } from "@/lib/data";
import { isPostCategory } from "@/lib/categories";

export const metadata: Metadata = {
  title: "Articles & Features",
  description:
    "Craft notes, footage verification guides, visual journalism ethics and newsroom lab announcements published by the Media Video Editors Association.",
  alternates: { canonical: "/programs" },
};

type PageProps = { searchParams: { category?: string } };

export default async function ProgramsPage({ searchParams }: PageProps) {
  const activeCategory = isPostCategory(searchParams.category) ? searchParams.category : undefined;

  const [posts, allPosts] = await Promise.all([
    repo.listPosts(activeCategory ? { category: activeCategory } : {}),
    repo.listPosts(),
  ]);

  const counts: Record<string, number> = { all: allPosts.length };
  allPosts.forEach((post) => {
    counts[post.category] = (counts[post.category] ?? 0) + 1;
  });

  return <ProgramsView posts={posts} activeCategory={activeCategory} counts={counts} />;
}
