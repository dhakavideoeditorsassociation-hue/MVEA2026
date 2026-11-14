"use client";

import { isFirebaseConfigured } from "@/lib/firebase";
import type {
  CmsPost,
  MembershipApplication,
  PressArticle,
  PressRelease,
  RecruiterInquiry,
} from "@/lib/types";

/**
 * Admin/member data layer.
 *
 * With Firebase configured every mutation goes to Cloud Firestore. Without it
 * the same calls are served from a browser-local database so the dashboard and
 * admin tools remain fully usable in previews and local development. The UI
 * always shows a demo banner in that case, and nothing is presented as shared
 * or durable data.
 */

const DB_KEY = "***";

type DemoDb = {
  applications: MembershipApplication[];
  inquiries: RecruiterInquiry[];
  press: PressArticle[];
  pressReleases: PressRelease[];
  posts: CmsPost[];
  heroVisibility: Record<string, boolean>;
  heroOrder: string[];
  rankOverrides: Record<string, number>;
};

function nowIso() {
  return new Date().toISOString();
}

function seedDb(): DemoDb {
  const sampleApplications: MembershipApplication[] = [
    {
      uid: "demo-app-sumaiya",
      email: "sumaiya.akter@example.com",
      fullNameBn: "সুমাইয়া আক্তার",
      fullNameEn: "Sumaiya Akter",
      phone: "+880 1712 345678",
      photoUrl: "",
      mediaHouse: "Ekattor TV",
      designation: "News Package Editor",
      yearsExperience: 6,
      workHistory: [
        { id: "wh-1", organization: "Ekattor TV", role: "News Package Editor", startYear: "2021", endYear: "" },
        { id: "wh-2", organization: "Boishakhi TV", role: "Junior Editor", startYear: "2019", endYear: "2021" },
      ],
      skills: ["News packages", "Natural sound", "Bangla typography"],
      tools: ["Adobe Premiere Pro", "Adobe Audition"],
      showreelUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
      facebook: "",
      linkedin: "",
      youtube: "",
      cvUrl: "",
      bio: "I cut daily news packages and short field features for the evening bulletin.",
      status: "pending",
      membershipId: null,
      rankOrder: null,
      submittedAt: "2026-11-09T12:20:00+06:00",
      updatedAt: "2026-11-09T12:20:00+06:00",
    },
    {
      uid: "demo-app-rashed",
      email: "rashed.karim@example.com",
      fullNameBn: "রাশেদ করিম",
      fullNameEn: "Rashed Karim",
      phone: "+880 1811 223344",
      photoUrl: "",
      mediaHouse: "Channel 24",
      designation: "Senior Editor",
      yearsExperience: 9,
      workHistory: [
        { id: "wh-1", organization: "Channel 24", role: "Senior Editor", startYear: "2020", endYear: "" },
        { id: "wh-2", organization: "RTV", role: "Editor", startYear: "2017", endYear: "2020" },
      ],
      skills: ["Investigative editing", "Field editing", "Archive research"],
      tools: ["Avid Media Composer", "Adobe Premiere Pro", "DaVinci Resolve"],
      showreelUrl: "",
      facebook: "",
      linkedin: "",
      youtube: "",
      cvUrl: "",
      bio: "Nine years on the desk, mostly long-form investigations and election specials.",
      status: "pending",
      membershipId: null,
      rankOrder: null,
      submittedAt: "2026-11-11T09:05:00+06:00",
      updatedAt: "2026-11-11T09:05:00+06:00",
    },
    {
      uid: "demo-editor",
      email: "editor@mvea.org",
      fullNameBn: "ডেমো এডিটর",
      fullNameEn: "Demo Editor",
      phone: "+880 1700 000000",
      photoUrl: "",
      mediaHouse: "Daily Bangladesh Media",
      designation: "Video Editor",
      yearsExperience: 4,
      workHistory: [
        { id: "wh-seed-1", organization: "Daily Bangladesh Media", role: "Video Editor", startYear: "2022", endYear: "" },
      ],
      skills: ["News editing", "Motion graphics"],
      tools: ["Adobe Premiere Pro", "After Effects"],
      showreelUrl: "",
      facebook: "",
      linkedin: "",
      youtube: "",
      cvUrl: "",
      bio: "Demo account pre-filled so the membership form can be tried end to end.",
      status: "draft",
      membershipId: null,
      rankOrder: null,
      submittedAt: null,
      updatedAt: "2026-11-12T09:00:00+06:00",
    },
  ];

  return {
    applications: sampleApplications,
    inquiries: [
      {
        id: "demo-inquiry-1",
        memberId: "mem_rafid_billah",
        memberName: "Rafid Billah",
        recruiterName: "Farzana Haque",
        company: "Nexus Media Studio",
        email: "farzana@example.com",
        phone: "+880 1911 445566",
        message: "We are staffing a documentary series and would like to discuss a six week engagement.",
        status: "new",
        createdAt: "2026-11-10T15:40:00+06:00",
      },
    ],
    press: [],
    pressReleases: [],
    posts: [],
    heroVisibility: {},
    heroOrder: [],
    rankOverrides: {},
  };
}

export function readDemoDb(): DemoDb {
  if (typeof window === "undefined") return seedDb();
  try {
    const raw = window.localStorage.getItem(DB_KEY);
    if (!raw) {
      const seeded = seedDb();
      window.localStorage.setItem(DB_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw) as Partial<DemoDb>;
    return { ...seedDb(), ...parsed };
  } catch {
    return seedDb();
  }
}

function writeDemoDb(db: DemoDb): DemoDb {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(DB_KEY, JSON.stringify(db));
    } catch {
      /* storage disabled */
    }
  }
  return db;
}

function updateDemoDb(mutator: (db: DemoDb) => DemoDb): DemoDb {
  return writeDemoDb(mutator(readDemoDb()));
}

/* ------------------------------------------------------------------ */
/* Membership applications                                             */
/* ------------------------------------------------------------------ */

export async function listApplications(): Promise<MembershipApplication[]> {
  if (isFirebaseConfigured) {
    const { collection, getDocs } = await import("firebase/firestore");
    const { getFirebaseDb } = await import("@/lib/firebase");
    const snapshot = await getDocs(collection(getFirebaseDb(), "applications"));
    return snapshot.docs.map((docSnap) => docSnap.data() as MembershipApplication);
  }
  return readDemoDb().applications;
}

export async function getApplication(uid: string): Promise<MembershipApplication | null> {
  if (isFirebaseConfigured) {
    const { doc, getDoc } = await import("firebase/firestore");
    const { getFirebaseDb } = await import("@/lib/firebase");
    const snapshot = await getDoc(doc(getFirebaseDb(), "applications", uid));
    return snapshot.exists() ? (snapshot.data() as MembershipApplication) : null;
  }
  return readDemoDb().applications.find((item) => item.uid === uid) ?? null;
}

export async function saveApplication(application: MembershipApplication): Promise<MembershipApplication> {
  const next: MembershipApplication = { ...application, updatedAt: nowIso() };

  if (isFirebaseConfigured) {
    const { doc, setDoc } = await import("firebase/firestore");
    const { getFirebaseDb } = await import("@/lib/firebase");
    await setDoc(doc(getFirebaseDb(), "applications", application.uid), next, { merge: true });
    return next;
  }

  updateDemoDb((db) => {
    const others = db.applications.filter((item) => item.uid !== application.uid);
    return { ...db, applications: [next, ...others] };
  });
  return next;
}

export async function reviewApplication(
  uid: string,
  decision: "approved" | "rejected",
  membershipId?: string,
): Promise<void> {
  if (isFirebaseConfigured) {
    const { doc, updateDoc } = await import("firebase/firestore");
    const { getFirebaseDb } = await import("@/lib/firebase");
    await updateDoc(doc(getFirebaseDb(), "applications", uid), {
      status: decision,
      membershipId: membershipId ?? null,
      updatedAt: nowIso(),
    });
    return;
  }

  updateDemoDb((db) => ({
    ...db,
    applications: db.applications.map((item) =>
      item.uid === uid
        ? { ...item, status: decision, membershipId: membershipId ?? item.membershipId, updatedAt: nowIso() }
        : item,
    ),
  }));
}

export function nextMembershipId(existingCount: number): string {
  const year = new Date().getFullYear();
  return `MVEA-${year}-${String(existingCount + 1).padStart(3, "0")}`;
}

/* ------------------------------------------------------------------ */
/* Recruiter inquiries                                                 */
/* ------------------------------------------------------------------ */

export async function listInquiries(): Promise<RecruiterInquiry[]> {
  if (isFirebaseConfigured) {
    const { collection, getDocs } = await import("firebase/firestore");
    const { getFirebaseDb } = await import("@/lib/firebase");
    const snapshot = await getDocs(collection(getFirebaseDb(), "recruiter_inquiries"));
    return snapshot.docs.map((docSnap) => docSnap.data() as RecruiterInquiry);
  }
  return readDemoDb().inquiries;
}

/** Demo-only mirror of an inquiry that the API accepted. */
export function recordLocalInquiry(inquiry: RecruiterInquiry): void {
  if (isFirebaseConfigured) return;
  updateDemoDb((db) => ({ ...db, inquiries: [inquiry, ...db.inquiries] }));
}

/* ------------------------------------------------------------------ */
/* Committee order, press, releases, hero and articles                 */
/* ------------------------------------------------------------------ */

export async function setMemberRank(memberId: string, rank: number): Promise<void> {
  if (isFirebaseConfigured) {
    const { doc, updateDoc } = await import("firebase/firestore");
    const { getFirebaseDb } = await import("@/lib/firebase");
    await updateDoc(doc(getFirebaseDb(), "members", memberId), { rankOrder: rank });
    return;
  }
  updateDemoDb((db) => ({ ...db, rankOverrides: { ...db.rankOverrides, [memberId]: rank } }));
}

export function readRankOverrides(): Record<string, number> {
  return readDemoDb().rankOverrides;
}

export async function addPressArticle(article: PressArticle): Promise<void> {
  if (isFirebaseConfigured) {
    const { doc, setDoc } = await import("firebase/firestore");
    const { getFirebaseDb } = await import("@/lib/firebase");
    await setDoc(doc(getFirebaseDb(), "press_articles", article.id), article);
    return;
  }
  updateDemoDb((db) => ({ ...db, press: [article, ...db.press] }));
}

export function readPressOverrides(): PressArticle[] {
  return readDemoDb().press;
}

export async function listPressReleases(): Promise<PressRelease[]> {
  if (isFirebaseConfigured) {
    const { collection, getDocs } = await import("firebase/firestore");
    const { getFirebaseDb } = await import("@/lib/firebase");
    const snapshot = await getDocs(collection(getFirebaseDb(), "press_releases"));
    return snapshot.docs.map((docSnap) => docSnap.data() as PressRelease);
  }
  return readDemoDb().pressReleases;
}

export async function addPressRelease(release: PressRelease): Promise<void> {
  if (isFirebaseConfigured) {
    const { doc, setDoc } = await import("firebase/firestore");
    const { getFirebaseDb } = await import("@/lib/firebase");
    await setDoc(doc(getFirebaseDb(), "press_releases", release.id), release);
    return;
  }
  updateDemoDb((db) => ({ ...db, pressReleases: [release, ...db.pressReleases] }));
}

export async function setHeroVisibility(slideId: string, visible: boolean): Promise<void> {
  if (isFirebaseConfigured) {
    const { doc, updateDoc } = await import("firebase/firestore");
    const { getFirebaseDb } = await import("@/lib/firebase");
    await updateDoc(doc(getFirebaseDb(), "hero_slides", slideId), { visible });
    return;
  }
  updateDemoDb((db) => ({ ...db, heroVisibility: { ...db.heroVisibility, [slideId]: visible } }));
}

export function readHeroOverrides(): { visibility: Record<string, boolean>; order: string[] } {
  const db = readDemoDb();
  return { visibility: db.heroVisibility, order: db.heroOrder };
}

export async function addPost(post: CmsPost): Promise<void> {
  if (isFirebaseConfigured) {
    const { doc, setDoc } = await import("firebase/firestore");
    const { getFirebaseDb } = await import("@/lib/firebase");
    await setDoc(doc(getFirebaseDb(), "cms_posts", post.id), post);
    return;
  }
  updateDemoDb((db) => ({ ...db, posts: [post, ...db.posts] }));
}

export function readPostOverrides(): CmsPost[] {
  return readDemoDb().posts;
}
