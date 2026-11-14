import type { Metadata } from "next";

import { CommitteeView } from "@/components/committee/committee-view";
import { repo } from "@/lib/data";

export const metadata: Metadata = {
  title: "Executive Committee",
  description:
    "The elected executive committee of the Gonomadhyam Video Editor Association: president, secretary, treasurer, membership, training and ethics secretaries.",
  alternates: { canonical: "/committee" },
};

export default async function CommitteePage() {
  const committee = await repo.listCommittee();
  return <CommitteeView committee={committee} />;
}
