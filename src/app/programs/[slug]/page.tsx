import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PostView } from "@/components/programs/post-view";
import { repo } from "@/lib/data";

type PageProps = { params: { slug: string } };

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await repo.listPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await repo.getPostBySlug(params.slug);
  if (!post) notFound();
  return {
    title: post.title.en,
    alternates: { canonical: `/articles/${post.slug}` },
    robots: { index: false, follow: true },
  };
}

export default async function ProgramLegacyPage({ params }: PageProps) {
  const post = await repo.getPostBySlug(params.slug);
  if (!post) notFound();

  const categoryPosts = await repo.listPosts({ category: post.category });
  const related = categoryPosts.filter((item) => item.id !== post.id).slice(0, 4);

  return <PostView post={post} related={related} />;
}