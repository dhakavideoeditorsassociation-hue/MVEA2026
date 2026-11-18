import type { Metadata } from "next";

import { ProgramsView } from "@/components/programs/programs-view";
import { isPostCategory } from "@/lib/categories";
import { repo } from "@/lib/data";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Educational tutorials, newsroom craft guides and journalism insight for Bangladeshi video editors, published by the Media Video Editors Association.",
  alternates: { canonical: "/articles" },
};

type PageProps = { searchParams: { category?: string } };

export default async function ArticlesPage({ searchParams }: PageProps) {
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
