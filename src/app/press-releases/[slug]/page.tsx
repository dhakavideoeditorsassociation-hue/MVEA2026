import type { Metadata } from "next";

import { PressReleaseView } from "@/components/press/press-release-view";
import { RemotePressRelease } from "@/components/press/remote-editorial";
import { repo } from "@/lib/data";

type PageProps = { params: { slug: string } };

export const dynamicParams = true;

export async function generateStaticParams() {
  const releases = await repo.listPressReleases();
  return releases.map((release) => ({ slug: release.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const release = await repo.getPressReleaseBySlug(params.slug);
  if (!release) {
    return { title: "Press release", alternates: { canonical: `/press-releases/${params.slug}` } };
  }
  return {
    title: release.title.en,
    description: release.excerpt.en,
    alternates: { canonical: `/press-releases/${release.slug}` },
    openGraph: {
      title: release.title.en,
      description: release.excerpt.en,
      type: "article",
      publishedTime: release.publishedAt,
      images: release.imageUrl ? [{ url: release.imageUrl }] : undefined,
    },
  };
}

export default async function PressReleasePage({ params }: PageProps) {
  const release = await repo.getPressReleaseBySlug(params.slug);
  if (!release) return <RemotePressRelease slug={params.slug} />;
  return <PressReleaseView release={release} />;
}
