import type { Metadata } from "next";

import { RemoteMemberProfile } from "@/components/members/remote-member";
import { MemberProfileView } from "@/components/members/member-profile-view";
import { repo } from "@/lib/data";

type PageProps = { params: { slug: string } };

/** Seeded members are pre-rendered; members added from /admin render on demand. */
export const dynamicParams = true;

export async function generateStaticParams() {
  const members = await repo.listMembers({ status: "approved" });
  return members.map((member) => ({ slug: member.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const member = await repo.getMemberBySlug(params.slug);
  if (!member) {
    return { title: "Member profile", alternates: { canonical: `/members/${params.slug}` } };
  }

  const title = `${member.fullNameEn} — ${member.designation.en}`;
  const description = `${member.designation.en} at ${member.mediaHouse}. Verified member of the Media Video Editors Association.`;

  return {
    title,
    description,
    alternates: { canonical: `/members/${member.slug}` },
    openGraph: {
      title,
      description,
      type: "profile",
      images: member.photoUrl ? [{ url: member.photoUrl }] : undefined,
    },
  };
}

export default async function MemberProfilePage({ params }: PageProps) {
  const member = await repo.getMemberBySlug(params.slug);
  if (!member || member.membershipStatus !== "approved") {
    return <RemoteMemberProfile slug={params.slug} />;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: member.fullNameEn,
    alternateName: member.fullNameBn,
    jobTitle: member.designation.en,
    worksFor: { "@type": "Organization", name: member.mediaHouse },
    image: member.photoUrl || undefined,
    url: `/members/${member.slug}`,
    description: member.bio.en,
    memberOf: { "@type": "Organization", name: "Media Video Editors Association" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MemberProfileView member={member} />
    </>
  );
}