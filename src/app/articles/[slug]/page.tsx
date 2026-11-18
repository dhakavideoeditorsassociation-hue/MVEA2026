import type { Metadata } from "next";

import { PostView } from "@/components/programs/post-view";
import { RemoteArticle } from "@/components/press/remote-editorial";
import { repo } from "@/lib/data";

type PageProps = { params: { slug: string } };

export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await repo.listPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await repo.getPostBySlug(params.slug);
  if (!post) return { title: "Article", alternates: { canonical: `/articles/${params.slug}` } };
  return {
    title: post.title.en,
    description: post.excerpt.en,
    alternates: { canonical: `/articles/${post.slug}` },
    openGraph: {
      title: post.title.en,
      description: post.excerpt.en,
      type: "article",
      publishedTime: post.publishedAt,
      images: [{ url: post.coverImageUrl }],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const post = await repo.getPostBySlug(params.slug);
  if (!post) return <RemoteArticle slug={params.slug} />;

  const categoryPosts = await repo.listPosts({ category: post.category });
  const related = categoryPosts.filter((item) => item.id !== post.id).slice(0, 4);

  return <PostView post={post} related={related} />;
}
