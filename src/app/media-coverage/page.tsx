import type { Metadata } from "next";

import { CoverageView } from "@/components/press/coverage-view";
import { repo } from "@/lib/data";

export const metadata: Metadata = {
  title: "Media Coverage",
  description:
    "National dailies and broadcast outlets reporting on the Gonomadhyam Video Editor Association, its members, workshops and advocacy.",
  alternates: { canonical: "/media-coverage" },
};

export default async function MediaCoveragePage() {
  const articles = await repo.listPressArticles();
  return <CoverageView articles={articles} />;
}
