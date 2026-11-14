import type {
  AssociationStat,
  CommitteeMember,
  CmsPost,
  HeroSlide,
  LocalizedText,
  Member,
  MembershipStatus,
  PostCategory,
  PressArticle,
  PressRelease,
  SocialLinks,
} from "@/lib/types";

export type AssociationInfo = {
  foundedYear: number;
  emails: string[];
  phones: string[];
  address: LocalizedText;
  facebook: string;
  socials: SocialLinks;
};

export type MemberQuery = {
  status?: MembershipStatus;
  /** When true, results are ordered by the committee order (nulls last). */
  ranked?: boolean;
};

export type PostQuery = {
  category?: PostCategory;
  limit?: number;
  featuredOnly?: boolean;
};

/**
 * The contract every content backend must satisfy.
 *
 * Phase 1 ships a seed-backed implementation (`seed-repository.ts`). A
 * Firestore implementation can be dropped in with the same surface, so pages
 * never need to know which backend is active.
 */
export interface ContentRepository {
  listMembers(query?: MemberQuery): Promise<Member[]>;
  getMemberBySlug(slug: string): Promise<Member | null>;
  getMemberById(id: string): Promise<Member | null>;
  listFeaturedMembers(limit?: number): Promise<Member[]>;
  listHeroSlides(): Promise<HeroSlide[]>;
  listPosts(query?: PostQuery): Promise<CmsPost[]>;
  getPostBySlug(slug: string): Promise<CmsPost | null>;
  listPressArticles(limit?: number): Promise<PressArticle[]>;
  listPressReleases(limit?: number): Promise<PressRelease[]>;
  listCommittee(): Promise<CommitteeMember[]>;
  listStats(): Promise<AssociationStat[]>;
  getAssociation(): Promise<AssociationInfo>;
}

/** Committee order first, then unordered members alphabetically. */
export function sortByRank(members: Member[]): Member[] {
  return [...members].sort((a, b) => {
    const rankA = a.rankOrder ?? Number.MAX_SAFE_INTEGER;
    const rankB = b.rankOrder ?? Number.MAX_SAFE_INTEGER;
    if (rankA !== rankB) return rankA - rankB;
    return a.fullNameEn.localeCompare(b.fullNameEn);
  });
}

/** Newest first. */
export function sortByDateDesc<T extends { publishedAt: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}
