"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { isFirebaseConfigured } from "@/lib/firebase";

/**
 * Member portraits uploaded from the admin dashboard.
 *
 * A photo lives in two places:
 *  - Cloud Firestore (`members/{slug}.photoUrl`) when Firebase is configured, which is
 *    shared with every visitor;
 *  - a local map so the change appears instantly and survives a reload in demo mode.
 *
 * Components resolve a portrait through `useMemberPhotos()` and fall back to the
 * server-provided record (`member.photoUrl`) and finally to initials.
 */

const STORAGE_KEY = "***";

export type MemberPhotoMap = Record<string, string>;

type MemberPhotoContextValue = {
  photos: MemberPhotoMap;
  ready: boolean;
  setPhoto: (key: string, url: string) => void;
  reload: () => Promise<void>;
};

const MemberPhotoContext = createContext<MemberPhotoContextValue | null>(null);

function readLocal(): MemberPhotoMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    const result: MemberPhotoMap = {};
    Object.entries(parsed as Record<string, unknown>).forEach(([key, value]) => {
      if (typeof value === "string" && value) result[key] = value;
    });
    return result;
  } catch {
    return {};
  }
}

function writeLocal(map: MemberPhotoMap) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* storage disabled */
  }
}

async function loadFromFirestore(): Promise<MemberPhotoMap> {
  if (!isFirebaseConfigured) return {};
  const { collection, getDocs } = await import("firebase/firestore");
  const { getFirebaseDb } = await import("@/lib/firebase");
  const snapshot = await getDocs(collection(getFirebaseDb(), "members"));
  const map: MemberPhotoMap = {};
  snapshot.docs.forEach((docSnap) => {
    const data = docSnap.data() as { photoUrl?: unknown; slug?: unknown };
    const url = typeof data.photoUrl === "string" ? data.photoUrl : "";
    if (!url) return;
    map[docSnap.id] = url;
    if (typeof data.slug === "string" && data.slug) map[data.slug] = url;
  });
  return map;
}

/**
 * Persist a portrait. Writes Firestore when configured; the local map is always
 * updated by the caller so the UI reflects the change immediately.
 */
export async function saveMemberPhoto(input: { key: string; memberId: string; photoUrl: string }): Promise<void> {
  if (!isFirebaseConfigured) return;
  const { doc, setDoc } = await import("firebase/firestore");
  const { getFirebaseDb } = await import("@/lib/firebase");
  await setDoc(
    doc(getFirebaseDb(), "members", input.key),
    {
      id: input.memberId,
      slug: input.key,
      photoUrl: input.photoUrl,
      updatedAt: new Date().toISOString(),
    },
    { merge: true },
  );
}

export function MemberPhotoProvider({ children }: { children: React.ReactNode }) {
  const [photos, setPhotos] = useState<MemberPhotoMap>({});
  const [ready, setReady] = useState(false);

  const reload = useCallback(async () => {
    let remote: MemberPhotoMap = {};
    try {
      remote = await loadFromFirestore();
    } catch {
      remote = {};
    }
    // Local entries win so an upload made in this browser is visible even before
    // Firestore propagates (and in demo mode, where there is no Firestore).
    setPhotos({ ...remote, ...readLocal() });
    setReady(true);
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const setPhoto = useCallback((key: string, url: string) => {
    setPhotos((current) => {
      const next: MemberPhotoMap = { ...current };
      if (url) next[key] = url;
      else delete next[key];
      writeLocal(next);
      return next;
    });
  }, []);

  const value = useMemo<MemberPhotoContextValue>(
    () => ({ photos, ready, setPhoto, reload }),
    [photos, ready, setPhoto, reload],
  );

  return <MemberPhotoContext.Provider value={value}>{children}</MemberPhotoContext.Provider>;
}

const FALLBACK: MemberPhotoContextValue = {
  photos: {},
  ready: true,
  setPhoto: () => undefined,
  reload: async () => undefined,
};

/** Safe outside the provider (error boundaries, print pages) — returns empty map. */
export function useMemberPhotos(): MemberPhotoContextValue {
  return useContext(MemberPhotoContext) ?? FALLBACK;
}

/** Resolve the best portrait for a member record. */
export function resolvePhoto(
  photos: MemberPhotoMap,
  keys: { slug?: string; memberId?: string },
  fallback?: string,
): string {
  if (keys.slug && photos[keys.slug]) return photos[keys.slug];
  if (keys.memberId && photos[keys.memberId]) return photos[keys.memberId];
  return fallback ?? "";
}
