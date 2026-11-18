import type { Metadata } from "next";

import { RemoteVerify } from "@/components/members/remote-member";
import { VerifyView } from "@/components/members/verify-view";
import { repo } from "@/lib/data";

type PageProps = { params: { memberId: string } };

export const metadata: Metadata = {
  title: "Membership verification",
  description: "Verify a Media Video Editors Association membership ID.",
  robots: { index: false, follow: false },
};

export default async function VerifyPage({ params }: PageProps) {
  const requested = decodeURIComponent(params.memberId ?? "").trim().toUpperCase();
  const members = await repo.listMembers({ status: "approved" });
  const member = members.find((item) => (item.membershipId ?? "").toUpperCase() === requested) ?? null;

  if (!member) return <RemoteVerify memberId={requested} />;
  return <VerifyView member={member} memberId={requested} />;
}
