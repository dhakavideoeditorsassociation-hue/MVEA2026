import type { Metadata } from "next";

import { HomeView } from "@/components/home/home-view";
import { repo } from "@/lib/data";

export const metadata: Metadata = {
  title: "গণমাধ্যম ভিডিও এডিটরস অ্যাসোসিয়েশন | Gonomadhyam Video Editor Association",
  description:
    "Verified broadcast and multimedia video editors of Bangladesh: ranked member directory, workshops, market briefings, press coverage and the association's ethics code.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [slides, stats, featured, press, posts, committee] = await Promise.all([
    repo.listHeroSlides(),
    repo.listStats(),
    repo.listFeaturedMembers(4),
    repo.listPressArticles(3),
    repo.listPosts({ limit: 3 }),
    repo.listCommittee(),
  ]);

  return (
    <HomeView
      slides={slides}
      stats={stats}
      featured={featured}
      press={press}
      posts={posts}
      committee={committee.slice(0, 6)}
    />
  );
}
