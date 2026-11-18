import type { Metadata } from "next";

import { HomeView } from "@/components/home/home-view";
import { repo } from "@/lib/data";

export const metadata: Metadata = {
  title: "গণমাধ্যম ভিডিও এডিটরস অ্যাসোসিয়েশন | Media Video Editors Association",
  description:
    "The national platform for media video editors and visualizers in Bangladesh: verified member directory, newsroom labs, visual journalism ethics and press coverage.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [slides, featured, press, releases, posts, committee] = await Promise.all([
    repo.listHeroSlides(),
    repo.listFeaturedMembers(4),
    repo.listPressArticles(6),
    repo.listPressReleases(2),
    repo.listPosts({ limit: 3 }),
    repo.listCommittee(),
  ]);

  return (
    <HomeView
      slides={slides}
      featured={featured}
      press={press.slice(0, 3)}
      pressMore={press.slice(3, 6)}
      releases={releases}
      posts={posts}
      committee={committee.slice(0, 6)}
    />
  );
}
