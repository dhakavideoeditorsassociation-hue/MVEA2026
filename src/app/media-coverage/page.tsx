import type { Metadata } from "next";

import { CoverageView } from "@/components/press/coverage-view";
import { repo } from "@/lib/data";

export const metadata: Metadata = {
  title: "Media Coverage",
  description:
    "National dailies reporting on the Media Video Editors Association — its launch, convener committee and events — plus official statements from the association's Facebook page.",
  alternates: { canonical: "/media-coverage" },
};

export default async function MediaCoveragePage() {
  const [articles, releases] = await Promise.all([repo.listPressArticles(), repo.listPressReleases()]);
  return <CoverageView articles={articles} releases={releases} />;
}
