import type { Metadata } from "next";

import { CoverageArchiveView } from "@/components/press/coverage-archive-view";
import { repo } from "@/lib/data";

export const metadata: Metadata = {
  title: "Media Coverage",
  description:
    "National dailies reporting on the Media Video Editors Association — launch, convener committee and events — with outlet filters and the full news archive.",
  alternates: { canonical: "/media-coverage" },
};

type PageProps = { searchParams: { page?: string; outlet?: string } };

export default async function MediaCoveragePage({ searchParams }: PageProps) {
  // The full seed list is handed to the client view, which merges live Firestore
  // coverage and paginates the combined list.
  const articles = await repo.listPressArticles();
  const requestedPage = Number(searchParams.page ?? "1");
  const initialPage = Number.isFinite(requestedPage) ? Math.max(1, Math.trunc(requestedPage)) : 1;

  return <CoverageArchiveView articles={articles} initialOutlet={searchParams.outlet} initialPage={initialPage} />;
}