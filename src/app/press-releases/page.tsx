import type { Metadata } from "next";

import { PressReleasesView } from "@/components/press/press-releases-view";
import { repo } from "@/lib/data";

export const metadata: Metadata = {
  title: "Press Releases",
  description:
    "Official statements and press releases from the Media Video Editors Association, in full text, with reference numbers and the original Facebook photocards.",
  alternates: { canonical: "/press-releases" },
};

export default async function PressReleasesPage() {
  const releases = await repo.listPressReleases();
  return <PressReleasesView releases={releases} />;
}
