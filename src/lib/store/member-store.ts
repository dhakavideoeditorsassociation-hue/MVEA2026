"use client";

import { isFirebaseConfigured } from "@/lib/firebase";
import { slugifyName } from "@/lib/slug";
import type { Member } from "@/lib/types";

/**
 * Manual member onboarding.
 *
 * The admin form produces a complete `approved` Member document and writes it to
 * Firestore `members/{slug}` (merge), which the photo/settings layer and the
 * public directory overlay read back. A browser-local copy keeps the record
 * visible in the same session when Firebase is not configured.
 */

const KEY = "***";

export type MemberDraft = {
  fullNameBn: string;
  fullNameEn: string;
  designationBn: string;
  designationEn: string;
  mediaHouse: string;
  mediaHouseBn: string;
  committeeRole: string;
  yearsExperience: number;
  phone: string;
  email: string;
  skills: string[];
  bioBn: string;
  bioEn: string;
  photoUrl: string;
  cvUrl: string;
};

function readLocal(): Member[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Member[]) : [];
  } catch {
    return [];
  }
}

function writeLocal(items: Member[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* storage disabled */
  }
}

export function nextMembershipId(existingIds: Array<string | null>): string {
  const year = new Date().getFullYear();
  const highest = existingIds.reduce((max, id) => {
    const match = (id ?? "").match(/(\d{3})$/);
    const value = match ? Number(match[1]) : 0;
    return value > max ? value : max;
  }, 0);
  return `MVEA-${year}-${String(highest + 1).padStart(3, "0")}`;
}

export function listCreatedMembers(): Member[] {
  return readLocal();
}

export async function createMember(draft: MemberDraft, existingIds: Array<string | null>): Promise<Member> {
  const slugBase = slugifyName(draft.fullNameEn || draft.fullNameBn);
  const slug = `${slugBase || "member"}-${Date.now().toString(36).slice(-4)}`;
  const now = new Date().toISOString();

  const member: Member = {
    id: `mem_${slug.replace(/-/g, "_")}`,
    slug,
    membershipId: nextMembershipId(existingIds),
    fullNameBn: draft.fullNameBn || draft.fullNameEn,
    fullNameEn: draft.fullNameEn || draft.fullNameBn,
    photoUrl: draft.photoUrl,
    mediaHouse: draft.mediaHouse,
    mediaHouseBn: draft.mediaHouseBn || draft.mediaHouse,
    designation: { bn: draft.designationBn || draft.designationEn, en: draft.designationEn || draft.designationBn },
    yearsExperience: draft.yearsExperience,
    workHistory: [],
    skills: draft.skills.map((skill) => ({ bn: skill, en: skill })),
    tools: [],
    socialLinks: {},
    cvUrl: draft.cvUrl || undefined,
    bio: { bn: draft.bioBn || draft.bioEn, en: draft.bioEn || draft.bioBn },
    membershipStatus: "approved",
    rankOrder: null,
    featured: false,
    location: "Dhaka, Bangladesh",
    createdAt: now,
    updatedAt: now,
  };

  if (isFirebaseConfigured) {
    const { doc, setDoc } = await import("firebase/firestore");
    const { getFirebaseDb } = await import("@/lib/firebase");
    await setDoc(
      doc(getFirebaseDb(), "members", slug),
      {
        ...member,
        committeeRole: draft.committeeRole || null,
        phone: draft.phone || null,
        email: draft.email || null,
      },
      { merge: true },
    );
  }

  writeLocal([member, ...readLocal()]);
  return member;
}
