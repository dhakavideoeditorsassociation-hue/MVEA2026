import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PostView } from "@/components/programs/post-view";
import { repo } from "@/lib/data";

type PageProps = { params: { slug: string } };

// Detail pages are pre-rendered from the current dataset (see generateStaticParams).
// Unknown slugs render the branded not-found page; Next caches that response, so
// the HTTP status stays 200. Use middleware or ISR if a hard 404 is required.
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
    description: post.excerpt.en,
    alternates: { canonical: `/programs/${post.slug}` },
    openGraph: {
      title: post.title.en,
      description: post.excerpt.en,
      type: "article",
      publishedTime: post.publishedAt,
      images: [{ url: post.coverImageUrl }],
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const post = await repo.getPostBySlug(params.slug);
  if (!post) notFound();

  const categoryPosts = await repo.listPosts({ category: post.category });
  const related = categoryPosts.filter((item) => item.id !== post.id).slice(0, 4);

  return <PostView post={post} related={related} />;
}
