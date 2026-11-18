"use client";

import { isFirebaseConfigured } from "@/lib/firebase";
import type { HireRequest } from "@/lib/types";

/**
 * Recruiter hire requests.
 *
 * Firestore `hire_requests` when the project is configured (rules allow public
 * create with field validation, admin read/update); otherwise a browser-local
 * list so the 2-step flow is demonstrable without credentials.
 */

const KEY = "***";

export type HireDraft = Omit<HireRequest, "id" | "status" | "createdAt">;

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

export async function submitHireRequest(draft: HireDraft): Promise<HireRequest> {
  const record: HireRequest = {
    ...draft,
    id: `hire-${Date.now().toString(36)}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  if (isFirebaseConfigured) {
    const { addDoc, collection } = await import("firebase/firestore");
    const { getFirebaseDb } = await import("@/lib/firebase");
    const ref = await addDoc(collection(getFirebaseDb(), "hire_requests"), record);
    return { ...record, id: ref.id };
  }

  writeLocal([record, ...readLocal()]);
  return record;
}

export async function listHireRequests(): Promise<HireRequest[]> {
  if (isFirebaseConfigured) {
    const { collection, getDocs, orderBy, query } = await import("firebase/firestore");
    const { getFirebaseDb } = await import("@/lib/firebase");
    const snapshot = await getDocs(query(collection(getFirebaseDb(), "hire_requests"), orderBy("createdAt", "desc")));
    return snapshot.docs.map((docSnap) => ({ ...(docSnap.data() as HireRequest), id: docSnap.id }));
  }
  return readLocal();
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
