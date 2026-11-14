import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MemberProfileView } from "@/components/members/member-profile-view";
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
  // Resolving the record in generateMetadata lets Next answer with a real 404
  // status before the response starts streaming.
  if (!member || member.membershipStatus !== "approved") notFound();

  const title = `${member.fullNameEn} — ${member.designation.en}`;
  const description = `${member.designation.en} at ${member.mediaHouse}, ${member.yearsExperience} years of experience. Verified member of the Gonomadhyam Video Editor Association.`;

  return {
    title,
    description,
    alternates: { canonical: `/members/${member.slug}` },
    openGraph: {
      title,
      description,
      type: "profile",
      images: [{ url: member.photoUrl, alt: member.fullNameEn }],
    },
  };
}

export default async function MemberProfilePage({ params }: PageProps) {
  const member = await repo.getMemberBySlug(params.slug);
  if (!member || member.membershipStatus !== "approved") notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: member.fullNameEn,
    alternateName: member.fullNameBn,
    jobTitle: member.designation.en,
    worksFor: { "@type": "Organization", name: member.mediaHouse },
    image: member.photoUrl,
    url: `/members/${member.slug}`,
    description: member.bio.en,
    memberOf: {
      "@type": "Organization",
      name: "Gonomadhyam Video Editor Association",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // The payload is generated from local records only, never user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MemberProfileView member={member} />
    </>
  );
}
