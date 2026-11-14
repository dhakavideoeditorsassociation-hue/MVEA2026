import type { Metadata } from "next";

import { MembersDirectoryView } from "@/components/members/members-directory-view";
import { repo } from "@/lib/data";

export const metadata: Metadata = {
  title: "Members Directory",
  description:
    "Searchable directory of verified broadcast and multimedia video editors in Bangladesh, ranked by the association's executive committee.",
  alternates: { canonical: "/members" },
};

export default async function MembersPage() {
  const members = await repo.listMembers({ status: "approved", ranked: true });
  return <MembersDirectoryView members={members} />;
}
