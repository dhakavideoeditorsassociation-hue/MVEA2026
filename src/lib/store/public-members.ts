"use client";

import { isFirebaseConfigured } from "@/lib/firebase";
import type { Member, MembershipStatus } from "@/lib/types";

/**
 * Members created from the admin dashboard live in Firestore `members/{slug}`
 * (public read). The public directory, profile, CV and verification views merge
 * those records with the seeded directory at runtime, so a newly onboarded
 * editor appears immediately without a rebuild.
 */

function normalise(id: string, data: Record<string, unknown>): Member | null {
  const fullNameEn = typeof data.fullNameEn === "string" ? data.fullNameEn : "";
  const fullNameBn = typeof data.fullNameBn === "string" ? data.fullNameBn : "";
  if (!fullNameEn && !fullNameBn) return null;

  const status = (typeof data.membershipStatus === "string" ? data.membershipStatus : "approved") as MembershipStatus;
  if (status !== "approved") return null;

  const designation =
    data.designation && typeof data.designation === "object"
      ? (data.designation as { bn?: string; en?: string })
      : { bn: "", en: "" };

  const bio = data.bio && typeof data.bio === "object" ? (data.bio as { bn?: string; en?: string }) : { bn: "", en: "" };

  return {
    id: typeof data.id === "string" ? data.id : `mem_${id}`,
    slug: typeof data.slug === "string" && data.slug ? data.slug : id,
    membershipId: typeof data.membershipId === "string" ? data.membershipId : null,
    fullNameBn: fullNameBn || fullNameEn,
    fullNameEn: fullNameEn || fullNameBn,
    photoUrl: typeof data.photoUrl === "string" ? data.photoUrl : "",
    mediaHouse: typeof data.mediaHouse === "string" ? data.mediaHouse : "",
    mediaHouseBn: typeof data.mediaHouseBn === "string" ? data.mediaHouseBn : undefined,
    designation: { bn: designation.bn ?? "", en: designation.en ?? "" },
    yearsExperience: typeof data.yearsExperience === "number" ? data.yearsExperience : 0,
    workHistory: Array.isArray(data.workHistory) ? (data.workHistory as Member["workHistory"]) : [],
    skills: Array.isArray(data.skills) ? (data.skills as Member["skills"]) : [],
    tools: Array.isArray(data.tools) ? (data.tools as string[]) : [],
    showreelUrl: typeof data.showreelUrl === "string" ? data.showreelUrl : undefined,
    socialLinks: (data.socialLinks as Member["socialLinks"]) ?? {},
    cvUrl: typeof data.cvUrl === "string" ? data.cvUrl : undefined,
    bio: { bn: bio.bn ?? "", en: bio.en ?? "" },
    membershipStatus: "approved",
    rankOrder: typeof data.rankOrder === "number" ? data.rankOrder : null,
    featured: Boolean(data.featured),
    location: typeof data.location === "string" ? data.location : "Dhaka, Bangladesh",
    createdAt: typeof data.createdAt === "string" ? data.createdAt : new Date().toISOString(),
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : new Date().toISOString(),
  };
}

export async function fetchRemoteMembers(): Promise<Member[]> {
  if (!isFirebaseConfigured) return [];
  const { collection, getDocs } = await import("firebase/firestore");
  const { getFirebaseDb } = await import("@/lib/firebase");
  const snapshot = await getDocs(collection(getFirebaseDb(), "members"));
  const members: Member[] = [];
  snapshot.docs.forEach((docSnap) => {
    const member = normalise(docSnap.id, docSnap.data() as Record<string, unknown>);
    if (member) members.push(member);
  });
  return members;
}

export async function fetchRemoteMemberBySlug(slug: string): Promise<Member | null> {
  if (!isFirebaseConfigured) return null;
  const { doc, getDoc } = await import("firebase/firestore");
  const { getFirebaseDb } = await import("@/lib/firebase");
  const snapshot = await getDoc(doc(getFirebaseDb(), "members", slug));
  return snapshot.exists() ? normalise(slug, snapshot.data() as Record<string, unknown>) : null;
}

export async function fetchRemoteMemberByMembershipId(membershipId: string): Promise<Member | null> {
  const members = await fetchRemoteMembers();
  const wanted = membershipId.trim().toUpperCase();
  return members.find((member) => (member.membershipId ?? "").toUpperCase() === wanted) ?? null;
}

/** Hide records the admin removed from the public site. */
export function filterDeleted<T extends { id: string; slug?: string }>(items: T[], deleted: string[]): T[] {
  if (deleted.length === 0) return items;
  return items.filter((item) => !deleted.includes(item.id) && !(item.slug && deleted.includes(item.slug)));
}
