import type { Metadata } from "next";

import { ResourcesView } from "@/components/resources/resources-view";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Editor daily toolkit: MRDI, PIB, NIMC and BCTI reference links, broadcast loudness and export cheatsheet, and member ID verification.",
  alternates: { canonical: "/resources" },
};

export default function ResourcesPage() {
  return <ResourcesView />;
}
