"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { FACEBOOK_PAGE } from "@/lib/brand";
import { isFirebaseConfigured } from "@/lib/firebase";
import type { Lang, LocalizedText, SitePolicyKey, SiteSettings } from "@/lib/types";

/**
 * Site-wide editable content.
 *
 * Stored in Firestore `site_settings/main` (public read, admin write) with a
 * browser-local mirror for demo mode and for instant feedback after saving.
 * Every consumer falls back to `DEFAULT_SETTINGS`, which mirrors the shipped
 * copy, so the site renders identically before an admin edits anything.
 */

const L = (en: string, bn: string): LocalizedText => ({ en, bn });

const STORAGE_KEY = "***";

export const DEFAULT_SETTINGS: SiteSettings = {
  hero: {
    eyebrow: L(
      "National Platform for Media Video Editors & Visualizers in Bangladesh",
      "বাংলাদেশে মিডিয়া ভিডিও এডিটর ও ভিজ্যুয়ালাইজারদের জাতীয় প্ল্যাটফর্ম",
    ),
    headline: L(
      "Crafting Truth Frame by Frame, Setting New Standards in Visual Journalism",
      "ফ্রেমে ফ্রেমে সত্য নির্মাণ, ভিজ্যুয়াল সাংবাদিকতায় নতুন মানদণ্ড",
    ),
    subheadline: L(
      "A unified professional body for broadcast, digital and multimedia video editors, motion designers and visual storytellers — advancing post-production craft, editorial ethics and industry recognition.",
      "ব্রডকাস্ট, ডিজিটাল ও মাল্টিমিডিয়া ভিডিও এডিটর, মোশন ডিজাইনার ও ভিজ্যুয়াল স্টোরিটেলারদের অভিন্ন পেশাজীবী সংগঠন—যা পোস্ট-প্রোডাকশনের কারুকাজ, সম্পাদকীয় নৈতিকতা ও পেশাগত স্বীকৃতি এগিয়ে নেয়।",
    ),
    primaryCta: L("Apply for Membership", "সদস্যপদের আবেদন করুন"),
    secondaryCta: L("Explore Member Directory", "সদস্য তালিকা দেখুন"),
    backgrounds: [],
  },
  pillars: [
    {
      id: "rights",
      title: L("Professional Rights & Welfare", "পেশাগত অধিকার ও কল্যাণ"),
      desc: L(
        "Advocating for fair compensation, proper on-screen credit, healthy shift structures and workplace security for broadcast and digital editors.",
        "ব্রডকাস্ট ও ডিজিটাল এডিটরদের ন্যায্য পারিশ্রমিক, পর্দায় যথাযথ কৃতিত্ব, শিফটের ভারসাম্য ও কর্মক্ষেত্রের নিরাপত্তার পক্ষে কাজ করা।",
      ),
    },
    {
      id: "pipeline",
      title: L("Post-Production Pipeline & Tools", "পোস্ট-প্রোডাকশন পাইপলাইন ও টুলস"),
      desc: L(
        "Practical workflows covering Premiere Pro, After Effects, DaVinci Resolve, broadcast audio mixing and AI-assisted editing pipelines.",
        "প্রিমিয়ার প্রো, আফটার ইফেক্টস, দ্য ভিঞ্চি রিজলভ, ব্রডকাস্ট অডিও মিক্সিং ও এআই-সহায়ক এডিটিং পাইপলাইনের ব্যবহারিক ওয়ার্কফ্লো।",
      ),
    },
    {
      id: "lab",
      title: L("Hands-on Newsroom Lab", "হাতে-কলমে নিউজরুম ল্যাব"),
      desc: L(
        "Intensive workshops led by senior broadcast editors on breaking-news assembly, documentary pacing and tight deadline execution.",
        "সিনিয়র ব্রডকাস্ট এডিটরদের নেতৃত্বে নিবিড় কর্মশালা—ব্রেকিং নিউজ অ্যাসেম্বলি, ডকুমেন্টারির পেসিং ও ডেডলাইন সামলানোর কৌশল।",
      ),
    },
    {
      id: "ethics",
      title: L("Visual Journalism Ethics", "ভিজ্যুয়াল সাংবাদিকতার নীতিমালা"),
      desc: L(
        "Unified editorial standards for footage verification, anti-deepfake integrity and responsible handling of sensitive news visuals.",
        "ফুটেজ যাচাই, ডিপফেক প্রতিরোধে অখণ্ডতা এবং সংবেদনশীল সংবাদ-দৃশ্য ব্যবহারে অভিন্ন সম্পাদকীয় মানদণ্ড।",
      ),
    },
    {
      id: "storytelling",
      title: L("Visual Storytelling & Motion Design", "ভিজ্যুয়াল স্টোরিটেলিং ও মোশন ডিজাইন"),
      desc: L(
        "Mastering narrative rhythm, sound design, broadcast infographics and explainer graphics to make complex journalism compelling.",
        "ন্যারেটিভ রিদম, সাউন্ড ডিজাইন, ব্রডকাস্ট ইনফোগ্রাফিক্স ও এক্সপ্লেইনার গ্রাফিক্সে দক্ষতা—জটিল সংবাদকে দর্শকগ্রাহ্য করে তোলা।",
      ),
    },
    {
      id: "archive",
      title: L("Screening, Critique & Resource Archive", "স্ক্রিনিং, ক্রিটিক ও রিসোর্স আর্কাইভ"),
      desc: L(
        "Open screenings, peer critique sessions and a shared archive of broadcast templates, LUTs and visual journalism resources.",
        "ওপেন স্ক্রিনিং, সহকর্মী ক্রিটিক সেশন এবং ব্রডকাস্ট টেমপ্লেট, LUT ও ভিজ্যুয়াল সাংবাদিকতা রিসোর্সের শেয়ারড আর্কাইভ।",
      ),
    },
  ],
  policies: {
    about: L(
      "Media Video Editors Association represents the people who cut, colour, mix and finish the stories Bangladeshi audiences watch every day. The association exists to make video editing a recognised, fairly credited and ethically grounded profession.",
      "মিডিয়া ভিডিও এডিটরস অ্যাসোসিয়েশন তাদের প্রতিনিধিত্ব করে যারা বাংলাদেশের দর্শকের প্রতিদিনের গল্প কাটেন, গ্রেড করেন, মিক্স করেন এবং ফিনিশ করেন। সংগঠনের লক্ষ্য ভিডিও এডিটিংকে স্বীকৃত, ন্যায্য কৃতিত্বপ্রাপ্ত ও নৈতিকভাবে প্রতিষ্ঠিত পেশা হিসেবে গড়ে তোলা।",
    ),
    ethics: L(
      "Members commit to accuracy before spectacle, consent and dignity, no fabricated sound or image, credit where it is due, fair contracts and political independence. AI-assisted restoration is always disclosed on screen.",
      "সদস্যরা অঙ্গীকার করেন: দৃশ্যের চেয়ে সত্য আগে, সম্মতি ও সম্মান, বানানো শব্দ বা ছবি নয়, প্রাপ্য কৃতিত্ব, ন্যায্য চুক্তি ও রাজনৈতিক স্বাধীনতা। এআই-সহায়ক রেস্টোরেশন সর্বদা পর্দায় ঘোষণা করা হয়।",
    ),
    membership: L(
      "Applications are reviewed weekly by the member secretary. Editors working in television, broadcast, documentary, digital newsrooms or post-production houses may apply; students may join the lab list first. Approved members receive an MVEA-2026-XXX ID.",
      "সদস্য সচিব সাপ্তাহিকভাবে আবেদন যাচাই করেন। টেলিভিশন, ব্রডকাস্ট, ডকুমেন্টারি, ডিজিটাল নিউজরুম বা পোস্ট-প্রোডাকশন হাউসে কর্মরত এডিটররা আবেদন করতে পারেন; শিক্ষার্থীরা আগে ল্যাবের তালিকায় যুক্ত হতে পারেন। অনুমোদিত সদস্যরা MVEA-2026-XXX আইডি পান।",
    ),
    recruiters: L(
      "Recruiters submit organisation details, a contact person and the engagement type. The association verifies availability with the editor, then sends an official confirmation from its own address. Member contact details are never shared outside this process.",
      "রিক্রুটাররা প্রতিষ্ঠানের তথ্য, দায়িত্বপ্রাপ্ত ব্যক্তি ও কাজের ধরন জমা দেন। সংগঠন এডিটরের উপলব্ধতা যাচাই করে নিজের ঠিকানা থেকে অফিসিয়াল নিশ্চিতকরণ পাঠায়। সদস্যদের ব্যক্তিগত তথ্য এই প্রক্রিয়ার বাইরে হস্তান্তর করা হয় না।",
    ),
  },
  announcement: {
    enabled: false,
    text: L(
      "Convener committee formed on 13 March 2026 — 31 editors representing television, national dailies and digital newsrooms.",
      "১৩ মার্চ ২০২৬ তারিখে আহ্বায়ক কমিটি গঠিত—টেলিভিশন, জাতীয় দৈনিক ও ডিজিটাল নিউজরুমের ৩১ জন এডিটর।",
    ),
    href: "/committee",
  },
  contact: {
    emails: ["dhakavideoeditorsassociation@gmail.com"],
    phones: ["+8801957-452277", "+8801763-234375"],
    address: L("Dhaka, Bangladesh", "ঢাকা, বাংলাদেশ"),
    facebook: FACEBOOK_PAGE,
  },
  heroSlides: [],
  deletedIds: { press: [], releases: [], articles: [] },
};

type SiteSettingsContextValue = {
  settings: SiteSettings;
  ready: boolean;
  /** True when Firestore/local values differ from the shipped defaults. */
  customised: boolean;
  save: (next: SiteSettings) => Promise<void>;
  reload: () => Promise<void>;
  tx: (text: LocalizedText) => string;
  lang: Lang;
};

const SiteSettingsContext = createContext<SiteSettingsContextValue | null>(null);

function readLocal(): SiteSettings | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SiteSettings;
  } catch {
    return null;
  }
}

function writeLocal(settings: SiteSettings) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    /* storage disabled */
  }
}

async function readFirestore(): Promise<SiteSettings | null> {
  if (!isFirebaseConfigured) return null;
  const { doc, getDoc } = await import("firebase/firestore");
  const { getFirebaseDb } = await import("@/lib/firebase");
  const snapshot = await getDoc(doc(getFirebaseDb(), "site_settings", "main"));
  return snapshot.exists() ? (snapshot.data() as SiteSettings) : null;
}

async function writeFirestore(settings: SiteSettings): Promise<void> {
  if (!isFirebaseConfigured) return;
  const { doc, setDoc } = await import("firebase/firestore");
  const { getFirebaseDb } = await import("@/lib/firebase");
  await setDoc(
    doc(getFirebaseDb(), "site_settings", "main"),
    { ...settings, updatedAt: new Date().toISOString() },
    { merge: true },
  );
}

/** Shallow merge that keeps any missing field on the shipped default. */
function withDefaults(stored: Partial<SiteSettings> | null): SiteSettings {
  if (!stored) return DEFAULT_SETTINGS;
  return {
    hero: { ...DEFAULT_SETTINGS.hero, ...(stored.hero ?? {}) },
    pillars:
      Array.isArray(stored.pillars) && stored.pillars.length > 0
        ? stored.pillars.map((pillar, index) => ({
            ...(DEFAULT_SETTINGS.pillars[index] ?? DEFAULT_SETTINGS.pillars[0]),
            ...pillar,
          }))
        : DEFAULT_SETTINGS.pillars,
    policies: { ...DEFAULT_SETTINGS.policies, ...(stored.policies ?? {}) },
    announcement: { ...DEFAULT_SETTINGS.announcement, ...(stored.announcement ?? {}) },
    contact: { ...DEFAULT_SETTINGS.contact, ...(stored.contact ?? {}) },
    heroSlides: Array.isArray(stored.heroSlides) ? stored.heroSlides : [],
    deletedIds: {
      press: Array.isArray(stored.deletedIds?.press) ? stored.deletedIds.press : [],
      releases: Array.isArray(stored.deletedIds?.releases) ? stored.deletedIds.releases : [],
      articles: Array.isArray(stored.deletedIds?.articles) ? stored.deletedIds.articles : [],
    },
    updatedAt: stored.updatedAt,
  };
}

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);
  const [lang, setLang] = useState<Lang>("bn");

  const reload = useCallback(async () => {
    let stored: Partial<SiteSettings> | null = readLocal();
    try {
      const remote = await readFirestore();
      if (remote) stored = { ...(stored ?? {}), ...remote };
    } catch {
      /* offline / rules */
    }
    setSettings(withDefaults(stored));
    setReady(true);
  }, []);

  useEffect(() => {
    void reload();
    // Keep the provider language in sync with <html lang> set by the i18n layer.
    const sync = () => setLang(document.documentElement.lang === "en" ? "en" : "bn");
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    return () => observer.disconnect();
  }, [reload]);

  const save = useCallback(async (next: SiteSettings) => {
    const payload: SiteSettings = { ...next, updatedAt: new Date().toISOString() };
    setSettings(payload);
    writeLocal(payload);
    try {
      await writeFirestore(payload);
    } catch {
      /* saved locally; surfaced by the admin UI as demo mode */
    }
  }, []);

  const value = useMemo<SiteSettingsContextValue>(() => {
    const customised = JSON.stringify({ ...settings, updatedAt: undefined }) !== JSON.stringify({ ...DEFAULT_SETTINGS, updatedAt: undefined });
    return {
      settings,
      ready,
      customised,
      save,
      reload,
      lang,
      tx: (text: LocalizedText) => (text ? text[lang] || text.en : ""),
    };
  }, [settings, ready, save, reload, lang]);

  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}

const FALLBACK: SiteSettingsContextValue = {
  settings: DEFAULT_SETTINGS,
  ready: true,
  customised: false,
  save: async () => undefined,
  reload: async () => undefined,
  lang: "bn",
  tx: (text: LocalizedText) => text?.bn || text?.en || "",
};

export function useSiteSettings(): SiteSettingsContextValue {
  return useContext(SiteSettingsContext) ?? FALLBACK;
}

export type { SitePolicyKey };
