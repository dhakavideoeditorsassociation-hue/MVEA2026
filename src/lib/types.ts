/**
 * Shared domain types for the Gonomadhyam Video Editor Association platform.
 *
 * All content that is shown to visitors carries Bangla and English variants.
 * Records are intentionally plain serialisable objects so the same shapes can
 * be served by the seed repository today and Cloud Firestore in phase 2.
 */

export type Lang = "bn" | "en";

/** A string that exists in both supported languages. */
export type LocalizedText = {
  bn: string;
  en: string;
};

export type MembershipStatus = "draft" | "pending" | "approved" | "rejected";

export type PostCategory =
  | "market-update"
  | "software-tools"
  | "workshop"
  | "journalism-ethics"
  | "storytelling";

export type WorkHistoryItem = {
  id: string;
  organization: string;
  role: LocalizedText;
  startYear: string;
  /** `null` means "present". */
  endYear: string | null;
  summary?: LocalizedText;
};

export type SocialLinks = {
  facebook?: string;
  linkedin?: string;
  youtube?: string;
  vimeo?: string;
  instagram?: string;
  website?: string;
};

export type Member = {
  id: string;
  slug: string;
  membershipId: string | null;
  fullNameBn: string;
  fullNameEn: string;
  photoUrl: string;
  mediaHouse: string;
  mediaHouseBn?: string;
  designation: LocalizedText;
  yearsExperience: number;
  workHistory: WorkHistoryItem[];
  skills: LocalizedText[];
  tools: string[];
  showreelUrl?: string;
  socialLinks: SocialLinks;
  cvUrl?: string;
  bio: LocalizedText;
  membershipStatus: MembershipStatus;
  rankOrder: number | null;
  featured: boolean;
  location?: string;
  createdAt: string;
  updatedAt: string;
};

export type HeroSlide = {
  id: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  imageUrl: string;
  date?: string;
  ctaLabel?: LocalizedText;
  ctaHref?: string;
  visible: boolean;
  order: number;
};

export type CmsPost = {
  id: string;
  slug: string;
  category: PostCategory;
  title: LocalizedText;
  excerpt: LocalizedText;
  body: LocalizedText[];
  coverImageUrl: string;
  author: string;
  publishedAt: string;
  readingMinutes: number;
  tags: string[];
  featured: boolean;
};

export type PressArticle = {
  id: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  source: string;
  url: string;
  imageUrl: string;
  publishedAt: string;
  featured: boolean;
};

export type CommitteeMember = {
  id: string;
  name: LocalizedText;
  role: LocalizedText;
  mediaHouse: string;
  photoUrl: string;
  order: number;
  email?: string;
  socialLinks: SocialLinks;
};

export type RecruiterInquiry = {
  id: string;
  memberId: string;
  memberName: string;
  recruiterName: string;
  company: string;
  email: string;
  phone?: string;
  message: string;
  status: "new" | "reviewed" | "archived";
  createdAt: string;
};

export type ApplicationWorkItem = {
  id: string;
  organization: string;
  role: string;
  startYear: string;
  endYear: string;
};

/**
 * A membership application as filled in by a signed-in editor.
 * Free-text fields are single-language: the applicant writes in the language
 * they are comfortable with and the committee normalises on approval.
 */
export type MembershipApplication = {
  uid: string;
  email: string;
  fullNameBn: string;
  fullNameEn: string;
  phone: string;
  photoUrl: string;
  mediaHouse: string;
  designation: string;
  yearsExperience: number;
  workHistory: ApplicationWorkItem[];
  skills: string[];
  tools: string[];
  showreelUrl: string;
  facebook: string;
  linkedin: string;
  youtube: string;
  cvUrl: string;
  bio: string;
  status: MembershipStatus;
  membershipId: string | null;
  rankOrder: number | null;
  submittedAt: string | null;
  updatedAt: string;
};

export type AssociationStat = {
  id: string;
  value: string;
  label: LocalizedText;
};

export type FetchOgResult = {
  url: string;
  title: string;
  description: string;
  image: string | null;
  siteName: string;
  publishedAt: string | null;
};
