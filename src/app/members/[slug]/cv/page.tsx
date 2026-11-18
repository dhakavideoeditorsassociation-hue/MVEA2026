import type { Metadata } from "next";

import { RemoteMemberCv } from "@/components/members/remote-member";
import { MemberCvView } from "@/components/members/member-cv-view";
import { repo } from "@/lib/data";

type PageProps = { params: { slug: string } };

export const dynamicParams = true;

export async function generateStaticParams() {
  const members = await repo.listMembers({ status: "approved" });
  return members.map((member) => ({ slug: member.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const member = await repo.getMemberBySlug(params.slug);
  return {
    title: member ? `${member.fullNameEn} — Official CV` : "Official CV",
    robots: { index: false, follow: false },
    alternates: { canonical: `/members/${params.slug}/cv` },
  };
}

export default async function MemberCvPage({ params }: PageProps) {
  const member = await repo.getMemberBySlug(params.slug);
  if (!member || member.membershipStatus !== "approved") return <RemoteMemberCv slug={params.slug} />;
  return <MemberCvView member={member} />;
}