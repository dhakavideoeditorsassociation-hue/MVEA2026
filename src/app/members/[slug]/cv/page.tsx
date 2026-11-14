import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MemberCvView } from "@/components/members/member-cv-view";
import { repo } from "@/lib/data";

type PageProps = { params: { slug: string } };

// Detail pages are pre-rendered from the current dataset (see generateStaticParams).
// Unknown slugs render the branded not-found page; Next caches that response, so
// the HTTP status stays 200. Use middleware or ISR if a hard 404 is required.
export const dynamicParams = false;

export async function generateStaticParams() {
  const members = await repo.listMembers({ status: "approved" });
  return members.map((member) => ({ slug: member.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const member = await repo.getMemberBySlug(params.slug);
  if (!member || member.membershipStatus !== "approved") notFound();
  return {
    title: `${member.fullNameEn} — Official CV`,
    description: `Printable CV of ${member.fullNameEn}, ${member.designation.en} at ${member.mediaHouse}.`,
    robots: { index: false, follow: false },
    alternates: { canonical: `/members/${member.slug}/cv` },
  };
}

export default async function MemberCvPage({ params }: PageProps) {
  const member = await repo.getMemberBySlug(params.slug);
  if (!member || member.membershipStatus !== "approved") notFound();
  return <MemberCvView member={member} />;
}
