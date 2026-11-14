import type { Metadata } from "next";

import { AboutView } from "@/components/about/about-view";
import { repo } from "@/lib/data";

export const metadata: Metadata = {
  title: "About & Ethics",
  description:
    "The mission, code of ethics, member benefits and frequently asked questions of the Gonomadhyam Video Editor Association.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const stats = await repo.listStats();
  return <AboutView stats={stats} />;
}
