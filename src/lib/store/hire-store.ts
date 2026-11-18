"use client";

import { isFirebaseConfigured } from "@/lib/firebase";
import type { HireRequest } from "@/lib/types";

/**
 * Recruiter hire requests.
 *
 * Firestore is the source of truth (`hire_requests`): the public form writes
 * directly with `addDoc` + `serverTimestamp`, the admin dashboard subscribes with
 * `onSnapshot`, and a browser-local mirror keeps the flow usable in demo mode.
 * Write errors are propagated so the form can show them instead of pretending the
 * request was accepted.
 */

const KEY = "***";

export type HireDraft = {
  memberSlug: string;
  memberId: string;
  memberName: string;
  organization: string;
  requesterName: string;
  designation: string;
  phone: string;
  email: string;
  engagementType: HireRequest["engagement"];
  note: string;
};

type RawDoc = Record<string, unknown>;

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function readLocal(): HireRequest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as HireRequest[]) : [];
  } catch {
    return [];
  }
}

function writeLocal(items: HireRequest[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* storage disabled */
  }
}

/** Accepts both the documented schema and the earlier field names. */
export function mapHireDoc(id: string, data: RawDoc): HireRequest {
  const createdAt = data.createdAt;
  return {
    id,
    memberId: asString(data.targetMemberId) || asString(data.memberId),
    memberName: asString(data.targetMemberName) || asString(data.memberName),
    organization: asString(data.organization),
    requesterName: asString(data.requesterName),
    requesterRole: asString(data.designation) || asString(data.requesterRole),
    phone: asString(data.phone),
    email: asString(data.email),
    engagement: (asString(data.engagementType) || asString(data.engagement) || "full-time") as HireRequest["engagement"],
    note: asString(data.note),
    status: (asString(data.status) || "pending") as HireRequest["status"],
    createdAt:
      typeof createdAt === "string"
        ? createdAt
        : createdAt && typeof createdAt === "object" && "seconds" in createdAt
          ? new Date(Number((createdAt as { seconds?: number }).seconds ?? 0) * 1000).toISOString()
          : new Date().toISOString(),
  };
}

export async function submitHireRequest(draft: HireDraft): Promise<HireRequest> {
  const record: HireRequest = {
    id: `hire-${Date.now().toString(36)}`,
    memberId: draft.memberId,
    memberName: draft.memberName,
    organization: draft.organization,
    requesterName: draft.requesterName,
    requesterRole: draft.designation,
    phone: draft.phone,
    email: draft.email,
    engagement: draft.engagementType,
    note: draft.note,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  if (isFirebaseConfigured) {
    const { addDoc, collection, serverTimestamp } = await import("firebase/firestore");
    const { getFirebaseDb } = await import("@/lib/firebase");
    const created = await addDoc(collection(getFirebaseDb(), "hire_requests"), {
      targetMemberSlug: draft.memberSlug || null,
      targetMemberName: draft.memberName || null,
      targetMemberId: draft.memberId || null,
      organization: draft.organization,
      requesterName: draft.requesterName,
      designation: draft.designation,
      phone: draft.phone,
      email: draft.email,
      engagementType: draft.engagementType,
      note: draft.note,
      status: "pending",
      createdAt: serverTimestamp(),
    });
    return { ...record, id: created.id };
  }

  writeLocal([record, ...readLocal()]);
  return record;
}

export async function listHireRequests(): Promise<HireRequest[]> {
  if (isFirebaseConfigured) {
    const { collection, getDocs, orderBy, query } = await import("firebase/firestore");
    const { getFirebaseDb } = await import("@/lib/firebase");
    const snapshot = await getDocs(query(collection(getFirebaseDb(), "hire_requests"), orderBy("createdAt", "desc")));
    return snapshot.docs.map((docSnap) => mapHireDoc(docSnap.id, docSnap.data() as RawDoc));
  }
  return readLocal();
}

/**
 * Live admin feed: Firestore snapshot ordered newest-first, merged with any
 * browser-local demo requests. Returns an unsubscribe function.
 */
export function subscribeHireRequests(onChange: (requests: HireRequest[]) => void): () => void {
  if (!isFirebaseConfigured) {
    onChange(readLocal());
    return () => undefined;
  }

  let active = true;
  let unsubscribe: (() => void) | undefined;

  void (async () => {
    try {
      const { collection, onSnapshot, orderBy, query } = await import("firebase/firestore");
      const { getFirebaseDb } = await import("@/lib/firebase");
      const q = query(collection(getFirebaseDb(), "hire_requests"), orderBy("createdAt", "desc"));
      const stop = onSnapshot(
        q,
        (snapshot) => {
          if (!active) return;
          const remote = snapshot.docs.map((docSnap) => mapHireDoc(docSnap.id, docSnap.data() as RawDoc));
          const localOnly = readLocal().filter((item) => !remote.some((doc) => doc.id === item.id));
          onChange([...remote, ...localOnly]);
        },
        () => {
          if (active) onChange(readLocal());
        },
      );
      unsubscribe = stop;
    } catch {
      if (active) onChange(readLocal());
    }
  })();

  return () => {
    active = false;
    unsubscribe?.();
  };
}

export async function setHireStatus(id: string, status: HireRequest["status"]): Promise<void> {
  if (isFirebaseConfigured) {
    const { doc, updateDoc } = await import("firebase/firestore");
    const { getFirebaseDb } = await import("@/lib/firebase");
    await updateDoc(doc(getFirebaseDb(), "hire_requests", id), { status });
    return;
  }
  writeLocal(readLocal().map((item) => (item.id === id ? { ...item, status } : item)));
}

/** Official reply template used by the admin one-click mailto. */
export function officialReplyBody(request: HireRequest): string {
  return [
    `Subject: MVEA verification - ${request.organization}`,
    "",
    `Dear ${request.requesterName} (${request.requesterRole}),`,
    "",
    "Thank you for your editor request submitted to the Media Video Editors Association (MVEA).",
    `We have logged your request (${request.id}) for ${request.memberName || "a suitable editor"} for a ${request.engagement} engagement.`,
    "",
    "We are checking availability with the editor concerned. Once confirmed, this office will send the verified profile, showreel link and availability window to your official email address.",
    "",
    `Organisation: ${request.organization}`,
    `Requested editor: ${request.memberName || "General request"}`,
    `Official email on file: ${request.email}`,
    "",
    "Regards,",
    "Member Secretary",
    "Media Video Editors Association (MVEA)",
    "dhakavideoeditorsassociation@gmail.com | +8801957-452277",
  ].join("\n");
}
