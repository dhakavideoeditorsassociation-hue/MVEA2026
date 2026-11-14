import type { Metadata } from "next";

import { AdminView } from "@/components/admin/admin-view";
import { repo } from "@/lib/data";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Membership review, ranking, press imports and content management.",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const [members, heroSlides, posts, pressArticles] = await Promise.all([
    repo.listMembers({ status: "approved", ranked: true }),
    repo.listHeroSlides(),
    repo.listPosts(),
    repo.listPressArticles(),
  ]);

  return <AdminView members={members} heroSlides={heroSlides} posts={posts} pressArticles={pressArticles} />;
}
