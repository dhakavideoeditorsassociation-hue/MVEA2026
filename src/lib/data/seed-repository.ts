import {
  seedAssociation,
  seedCommittee,
  seedHeroSlides,
  seedMembers,
  seedPosts,
  seedPress,
  seedPressReleases,
  seedStats,
} from "@/data/seed";
import type { CmsPost, CommitteeMember, HeroSlide, Member, PressArticle, PressRelease } from "@/lib/types";

import {
  type AssociationInfo,
  type ContentRepository,
  type MemberQuery,
  type PostQuery,
  sortByDateDesc,
  sortByRank,
} from "./repository";

/**
 * In-memory repository backed by the official association dataset.
 * Methods are async and return copies so a Firestore implementation can be
 * swapped in without touching the pages that consume them.
 */
export function createSeedRepository(): ContentRepository {
  const members = [...seedMembers];
  const posts = [...seedPosts];
  const press = [...seedPress];
  const releases = [...seedPressReleases];

  const approvedMembers = () => members.filter((member) => member.membershipStatus === "approved");

  return {
    async listMembers(query: MemberQuery = {}) {
      const filtered = query.status
        ? members.filter((member) => member.membershipStatus === query.status)
        : approvedMembers();
      return query.ranked === false ? [...filtered] : sortByRank(filtered);
    },

    async getMemberBySlug(slug: string) {
      return members.find((member) => member.slug === slug) ?? null;
    },

    async getMemberById(id: string) {
      return members.find((member) => member.id === id) ?? null;
    },

    async listFeaturedMembers(limit = 4) {
      const featured = sortByRank(approvedMembers().filter((member) => member.featured));
      return featured.slice(0, limit);
    },

    async listHeroSlides() {
      const visible: HeroSlide[] = seedHeroSlides.filter((slide) => slide.visible);
      return [...visible].sort((a, b) => a.order - b.order);
    },

    async listPosts(query: PostQuery = {}) {
      let result: CmsPost[] = sortByDateDesc(posts);
      if (query.category) result = result.filter((post) => post.category === query.category);
      if (query.featuredOnly) result = result.filter((post) => post.featured);
      return query.limit ? result.slice(0, query.limit) : result;
    },

    async getPostBySlug(slug: string) {
      return posts.find((post) => post.slug === slug) ?? null;
    },

    async listPressArticles(limit?: number) {
      const sorted = sortByDateDesc(press as PressArticle[]);
      return limit ? sorted.slice(0, limit) : sorted;
    },

    async listPressReleases(limit?: number) {
      const sorted = sortByDateDesc(releases as PressRelease[]);
      return limit ? sorted.slice(0, limit) : sorted;
    },

    async getPressReleaseBySlug(slug: string) {
      return releases.find((release) => release.slug === slug) ?? null;
    },

    async listCommittee() {
      const committee: CommitteeMember[] = [...seedCommittee];
      return committee.sort((a, b) => a.order - b.order);
    },

    async listStats() {
      return seedStats;
    },

    async getAssociation(): Promise<AssociationInfo> {
      return seedAssociation;
    },
  };
}

export type { Member };
