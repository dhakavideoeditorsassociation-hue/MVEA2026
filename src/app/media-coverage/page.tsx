import type { Metadata } from "next";

import { CoverageArchiveView } from "@/components/press/coverage-archive-view";
import { repo } from "@/lib/data";

export const metadata: Metadata = {
  title: "Media Coverage",
  description:
    "National dailies reporting on the Media Video Editors Association — launch, convener committee and events — with outlet filters and the full news archive.",
  alternates: { canonical: "/media-coverage" },
};

const PER_PAGE = 9;

type PageProps = { searchParams: { page?: string; outlet?: string } };

export default async function MediaCoveragePage({ searchParams }: PageProps) {
  const articles = await repo.listPressArticles();
  const outlets = Array.from(new Set(articles.map((article) => article.source))).sort();

  const activeOutlet = searchParams.outlet && outlets.includes(searchParams.outlet) ? searchParams.outlet : undefined;
  const filtered = activeOutlet ? articles.filter((article) => article.source === activeOutlet) : articles;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const requested = Number(searchParams.page ?? "1");
  const page = Number.isFinite(requested) ? Math.min(Math.max(1, Math.trunc(requested)), totalPages) : 1;
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <CoverageArchiveView
      articles={pageItems}
      outlets={outlets}
      activeOutlet={activeOutlet}
      page={page}
      totalPages={totalPages}
    />
  );
}
