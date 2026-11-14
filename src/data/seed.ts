import type {
  AssociationStat,
  CommitteeMember,
  CommitteeRole,
  CmsPost,
  HeroSlide,
  LocalizedText,
  Member,
  PressArticle,
  PressRelease,
  SocialLinks,
} from "@/lib/types";

/**
 * Official association records.
 *
 * Membership data below mirrors the published 31-member Convener Committee
 * (formed 13 March 2026) and the three national newspaper reports about it.
 * Photographs of individual editors are not on file yet, so `photoUrl` is left
 * empty and the UI renders initials until the committee uploads portraits.
 * Career histories, reels and skill lists are deliberately not invented — they
 * are filled in by each member from the member dashboard.
 */

const L = (en: string, bn: string): LocalizedText => ({ en, bn });

const FACEBOOK_PAGE = "https://www.facebook.com/MediaVideoEditorsAssociation";

const pressImages = {
  samakal: "https://samakal.com/media/imgAll/2026March/association-r-1773430467.jpg",
  banglanews:
    "https://bn-cdn.banglanews24.com/public/news_images/2026/03/14/og/1773461975-cb236a97ebdc79f624511fc4ac90b5f2.jpg",
  jugantor:
    "https://cdn.jugantor.com/assets/news_photos/2026/01/17/social-thumbnail/1768627984-4b62c9426992095bbffce02e80b178b6-(1)-696b2d547f575.jpg",
};

export const ASSOCIATION_NAME_BN = "গণমাধ্যম ভিডিও এডিটরস অ্যাসোসিয়েশন";
export const ASSOCIATION_NAME_EN = "Media Video Editors Association";

export const COMMITTEE_FORMED_AT = "2026-03-13";

type PersonSpec = {
  order: number;
  nameEn: string;
  nameBn: string;
  roleType: CommitteeRole;
  roleEn: string;
  roleBn: string;
  org: string;
};

const people: PersonSpec[] = [
  {
    order: 1,
    nameEn: "Rafid Billah",
    nameBn: "রাফিদ বিল্লাহ",
    roleType: "convener",
    roleEn: "Convener",
    roleBn: "আহ্বায়ক",
    org: "Daily Jugantor",
  },
  {
    order: 2,
    nameEn: "Shipon Ahmed",
    nameBn: "শিপন আহমেদ",
    roleType: "joint-convener",
    roleEn: "Joint Convener",
    roleBn: "যুগ্ম আহ্বায়ক",
    org: "Kaler Kantho",
  },
  {
    order: 3,
    nameEn: "Shahriar Hridoy",
    nameBn: "শাহরিয়ার হৃদয়",
    roleType: "joint-convener",
    roleEn: "Joint Convener",
    roleBn: "যুগ্ম আহ্বায়ক",
    org: "Jamuna TV",
  },
  {
    order: 4,
    nameEn: "Jahid Hasan Limon",
    nameBn: "জাহিদ হাসান লিমন",
    roleType: "joint-convener",
    roleEn: "Joint Convener",
    roleBn: "যুগ্ম আহ্বায়ক",
    org: "NPB News",
  },
  {
    order: 5,
    nameEn: "Sabbir Ahmed Tonu",
    nameBn: "সাব্বির আহমেদ তনু",
    roleType: "joint-convener",
    roleEn: "Joint Convener",
    roleBn: "যুগ্ম আহ্বায়ক",
    org: "Risingbd.com",
  },
  {
    order: 6,
    nameEn: "Nazrul Islam",
    nameBn: "নজরুল ইসলাম",
    roleType: "joint-convener",
    roleEn: "Joint Convener",
    roleBn: "যুগ্ম আহ্বায়ক",
    org: "Daily Sangram",
  },
  {
    order: 7,
    nameEn: "Ismail Hossain",
    nameBn: "ইসমাইল হোসেন",
    roleType: "joint-convener",
    roleEn: "Joint Convener",
    roleBn: "যুগ্ম আহ্বায়ক",
    org: "Kazi TV",
  },
  {
    order: 8,
    nameEn: "Sagar Pandit",
    nameBn: "সাগর পণ্ডিত",
    roleType: "joint-convener",
    roleEn: "Joint Convener",
    roleBn: "যুগ্ম আহ্বায়ক",
    org: "Prothom Alo",
  },
  {
    order: 9,
    nameEn: "Sujon Sorma",
    nameBn: "সুজন শর্মা",
    roleType: "member-secretary",
    roleEn: "Member Secretary",
    roleBn: "সদস্য সচিব",
    org: "Daily Bangladesh Media",
  },
  { order: 10, nameEn: "Tushar Ahmed", nameBn: "তুষার আহমেদ", roleType: "member", roleEn: "Member", roleBn: "সদস্য", org: "Bangladesh Pratidin" },
  { order: 11, nameEn: "Shatabdi Shuvo", nameBn: "শতাব্দী শুভ", roleType: "member", roleEn: "Member", roleBn: "সদস্য", org: "News24" },
  { order: 12, nameEn: "Jahirul Islam", nameBn: "জহিরুল ইসলাম", roleType: "member", roleEn: "Member", roleBn: "সদস্য", org: "DBC News" },
  { order: 13, nameEn: "Gopal Chandra", nameBn: "গোপাল চন্দ্র", roleType: "member", roleEn: "Member", roleBn: "সদস্য", org: "Jamuna TV" },
  { order: 14, nameEn: "Md. Rasel", nameBn: "মোঃ রাসেল", roleType: "member", roleEn: "Member", roleBn: "সদস্য", org: "ATN Bangla" },
  { order: 15, nameEn: "Abid Mia", nameBn: "আবিদ মিয়া", roleType: "member", roleEn: "Member", roleBn: "সদস্য", org: "Bangladesh Pratidin" },
  { order: 16, nameEn: "Shakil Ahmed", nameBn: "শাকিল আহমেদ", roleType: "member", roleEn: "Member", roleBn: "সদস্য", org: "The Daily Ittefaq" },
  { order: 17, nameEn: "Abdur Rahim", nameBn: "আব্দুর রহিম", roleType: "member", roleEn: "Member", roleBn: "সদস্য", org: "Kaler Kantho" },
  {
    order: 18,
    nameEn: "Nazmul Hossain Noyon",
    nameBn: "নজমুল হোসেন নয়ন",
    roleType: "member",
    roleEn: "Member",
    roleBn: "সদস্য",
    org: "Bangladesh Pratidin",
  },
  { order: 19, nameEn: "Mursalin Islam", nameBn: "মুরসালিন ইসলাম", roleType: "member", roleEn: "Member", roleBn: "সদস্য", org: "Daily Jugantor" },
  { order: 20, nameEn: "A H M Riduan", nameBn: "এ এইচ এম রিদুয়ান", roleType: "member", roleEn: "Member", roleBn: "সদস্য", org: "Daily Jugantor" },
  { order: 21, nameEn: "Ashikur Rahman", nameBn: "আশিকুর রহমান", roleType: "member", roleEn: "Member", roleBn: "সদস্য", org: "Daily Jugantor" },
  { order: 22, nameEn: "Rahim Sohag", nameBn: "রহিম সোহাগ", roleType: "member", roleEn: "Member", roleBn: "সদস্য", org: "Banglanews24" },
  { order: 23, nameEn: "Saiful Islam", nameBn: "সাইফুল ইসলাম", roleType: "member", roleEn: "Member", roleBn: "সদস্য", org: "ATN Bangla" },
  { order: 24, nameEn: "Rumman Billah", nameBn: "রুম্মান বিল্লাহ", roleType: "member", roleEn: "Member", roleBn: "সদস্য", org: "ATN Bangla" },
  { order: 25, nameEn: "Joy Chandra", nameBn: "জয় চন্দ্র", roleType: "member", roleEn: "Member", roleBn: "সদস্য", org: "The Business Standard" },
  {
    order: 26,
    nameEn: "Zahirul Kaysar Talukder",
    nameBn: "জহিরুল কায়সার তালুকদার",
    roleType: "member",
    roleEn: "Member",
    roleBn: "সদস্য",
    org: "Nagorik TV",
  },
  { order: 27, nameEn: "Zahirul Islam Tufan", nameBn: "জহিরুল ইসলাম তুফান", roleType: "member", roleEn: "Member", roleBn: "সদস্য", org: "Channel 24" },
  { order: 28, nameEn: "Rabbi Hossain", nameBn: "রাব্বি হোসেন", roleType: "member", roleEn: "Member", roleBn: "সদস্য", org: "Kaler Kantho" },
  { order: 29, nameEn: "Hasib Mahmud", nameBn: "হাসিব মাহমুদ", roleType: "member", roleEn: "Member", roleBn: "সদস্য", org: "Dhaka Post" },
  { order: 30, nameEn: "Jubilee Akter", nameBn: "জুবিলী আক্তার", roleType: "member", roleEn: "Member", roleBn: "সদস্য", org: "Daily Samakal" },
  { order: 31, nameEn: "Muhammad Tashrif", nameBn: "মুহাম্মদ তাশরিফ", roleType: "member", roleEn: "Member", roleBn: "সদস্য", org: "Times Today" },
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const seedMembers: Member[] = people.map((person) => ({
  id: `mem_${slugify(person.nameEn).replace(/-/g, "_")}`,
  slug: slugify(person.nameEn),
  membershipId: `MVEA-2026-${String(person.order).padStart(3, "0")}`,
  fullNameBn: person.nameBn,
  fullNameEn: person.nameEn,
  photoUrl: "",
  mediaHouse: person.org,
  designation: L(person.roleEn, person.roleBn),
  yearsExperience: 0,
  workHistory: [],
  skills: [],
  tools: [],
  socialLinks: {},
  bio: L(
    `${person.roleEn} of the MVEA Convener Committee, working at ${person.org}.`,
    `গণমাধ্যম ভিডিও এডিটরস অ্যাসোসিয়েশনের আহ্বায়ক কমিটির ${person.roleBn}। কর্মস্থল: ${person.org}।`,
  ),
  membershipStatus: "approved",
  rankOrder: person.order,
  featured: person.order <= 4,
  location: "Dhaka, Bangladesh",
  createdAt: "2026-03-13T12:00:00+06:00",
  updatedAt: "2026-03-13T12:00:00+06:00",
}));

export const seedCommittee: CommitteeMember[] = people.map((person) => ({
  id: `com_${slugify(person.nameEn).replace(/-/g, "_")}`,
  name: L(person.nameEn, person.nameBn),
  role: L(person.roleEn, person.roleBn),
  roleType: person.roleType,
  mediaHouse: person.org,
  photoUrl: "",
  order: person.order,
  socialLinks: {},
}));

const MEDIA_HOUSES = new Set(people.map((person) => person.org));

export const seedStats: AssociationStat[] = [
  { id: "stat-1", value: "31", label: L("Convener committee members", "আহ্বায়ক কমিটি সদস্য") },
  { id: "stat-2", value: String(MEDIA_HOUSES.size), label: L("Media houses represented", "মিডিয়া হাউস প্রতিনিধিত্ব") },
  { id: "stat-3", value: "3", label: L("National dailies reported", "জাতীয় দৈনিকে প্রতিবেদন") },
  { id: "stat-4", value: "13 Mar 2026", label: L("Committee formed", "কমিটি গঠনের তারিখ") },
];

export const seedHeroSlides: HeroSlide[] = [
  {
    id: "hero-1",
    title: L("Convener Committee formed: 13 March 2026", "আহ্বায়ক কমিটি গঠন: ১৩ মার্চ ২০২৬"),
    subtitle: L(
      "Thirty-one editors from television, national dailies and digital newsrooms now lead the association.",
      "টেলিভিশন, জাতীয় দৈনিক ও ডিজিটাল নিউজরুমের ৩১ জন এডিটর এখন সংগঠনের নেতৃত্বে।",
    ),
    imageUrl: pressImages.samakal,
    date: "2026-03-13",
    ctaLabel: L("Meet the committee", "কমিটি দেখুন"),
    ctaHref: "/committee",
    visible: true,
    order: 1,
  },
  {
    id: "hero-2",
    title: L("Broadcast Post-Production & Visual Journalism Lab", "ব্রডকাস্ট পোস্ট-প্রোডাকশন ও ভিজ্যুয়াল সাংবাদিকতা ল্যাব"),
    subtitle: L(
      "Hands-on lab for newsroom post-production teams: timeline discipline, colour, loudness and verification under deadline.",
      "নিউজরুম পোস্ট-প্রোডাকশন দলের জন্য হাতে-কলমে ল্যাব: টাইমলাইন শৃঙ্খলা, কালার, লাউডনেস ও ডেডলাইনে যাচাই।",
    ),
    imageUrl: pressImages.jugantor,
    date: "2026-04-18",
    ctaLabel: L("Programme details", "প্রোগ্রামের বিস্তারিত"),
    ctaHref: "/programs",
    visible: true,
    order: 2,
  },
  {
    id: "hero-3",
    title: L("National Video Editors Directory & recruiter access", "জাতীয় ভিডিও এডিটর তালিকা ও রিক্রুটার অ্যাক্সেস"),
    subtitle: L(
      "A verified public register of broadcast and digital editors, searchable by newsroom, craft and showreel.",
      "সম্প্রচার ও ডিজিটাল এডিটরদের যাচাইকৃত প্রকাশ্য তালিকা—নিউজরুম, দক্ষতা ও শোরিল অনুসারে অনুসন্ধানযোগ্য।",
    ),
    imageUrl: pressImages.banglanews,
    date: "2026-03-14",
    ctaLabel: L("Browse the directory", "তালিকা দেখুন"),
    ctaHref: "/members",
    visible: true,
    order: 3,
  },
];

export const seedPress: PressArticle[] = [
  {
    id: "press-samakal",
    title: L(
      "Rafid convener, Sujon member secretary of Media Video Editors Association",
      "গণমাধ্যম ভিডিও এডিটরস অ্যাসোসিয়েশনের আহ্বায়ক রাফিদ, সদস্য সচিব সুজন",
    ),
    excerpt: L(
      "The association of video editors working across Bangladeshi media launched with a formal ceremony.",
      "বর্ণাঢ্য আয়োজনের মধ্য দিয়ে আত্মপ্রকাশ করল দেশের বিভিন্ন গণমাধ্যমে কর্মরত ভিডিও এডিটরদের সংগঠন ‘গণমাধ্যম ভিডিও এডিটরস অ্যাসোসিয়েশন’।",
    ),
    source: "Daily Samakal",
    url: "https://samakal.com/bangladesh/article/342736",
    imageUrl: pressImages.samakal,
    publishedAt: "2026-03-13T20:00:00+06:00",
    featured: true,
  },
  {
    id: "press-banglanews24",
    title: L(
      "Convener committee of Media Video Editors Association launched",
      "গণমাধ্যম ভিডিও এডিটরস অ্যাসোসিয়েশনের আত্মপ্রকাশ",
    ),
    excerpt: L(
      "Editors from television, print and online newsrooms came together to form a single professional body.",
      "দেশের বিভিন্ন গণমাধ্যমে কর্মরত ভিডিও এডিটরদের সংগঠন ‘গণমাধ্যম ভিডিও এডিটরস অ্যাসোসিয়েশন’ আত্মপ্রকাশ করেছে।",
    ),
    source: "Banglanews24",
    url: "https://www.banglanews24.com/national/news/bd/1642621.details",
    imageUrl: pressImages.banglanews,
    publishedAt: "2026-03-14T10:19:36+06:00",
    featured: true,
  },
  {
    id: "press-jugantor",
    title: L(
      "MVEA winter reunion held in Purbachal",
      "পূর্বাচলে গণমাধ্যম ভিডিও এডিটরস অ্যাসোসিয়েশনের মিলনমেলা",
    ),
    excerpt: L(
      "Members met at a Purbachal café for the association's winter reunion and feast.",
      "রাজধানীর অদূরে পূর্বাচলের রিকশা ক্যাফেতে উৎসবমুখর পরিবেশে অনুষ্ঠিত হয়েছে গণমাধ্যম ভিডিও এডিটরস অ্যাসোসিয়েশনের শীতকালীন মিলনমেলা ও প্রীতিভোজ।",
    ),
    source: "Daily Jugantor",
    url: "https://www.jugantor.com/capital/1054033",
    imageUrl: pressImages.jugantor,
    publishedAt: "2026-01-17T12:33:56+06:00",
    featured: false,
  },
];

export const seedPressReleases: PressRelease[] = [
  {
    id: "release-committee",
    title: L(
      "Official: 31-member Convener Committee announced",
      "অফিসিয়াল: ৩১ সদস্যের আহ্বায়ক কমিটি ঘোষণা",
    ),
    excerpt: L(
      "The full committee list, published on the association's Facebook page on 13 March 2026.",
      "১৩ মার্চ ২০২৬ তারিখে সংগঠনের ফেসবুক পেজে প্রকাশিত পূর্ণ কমিটি তালিকা।",
    ),
    url: FACEBOOK_PAGE,
    imageUrl: pressImages.banglanews,
    publishedAt: "2026-03-13T22:00:00+06:00",
  },
  {
    id: "release-directory",
    title: L(
      "Statement: verified editor directory opens for recruiters",
      "বিবৃতি: রিক্রুটারদের জন্য যাচাইকৃত এডিটর তালিকা চালু",
    ),
    excerpt: L(
      "Media houses can now search verified broadcast and digital editors and send hiring inquiries directly.",
      "মিডিয়া হাউসগুলো এখন যাচাইকৃত ব্রডকাস্ট ও ডিজিটাল এডিটর খুঁজে সরাসরি নিয়োগের অনুরোধ পাঠাতে পারবে।",
    ),
    url: FACEBOOK_PAGE,
    imageUrl: pressImages.jugantor,
    publishedAt: "2026-03-20T19:30:00+06:00",
  },
];

export const seedPosts: CmsPost[] = [
  {
    id: "post-1",
    slug: "eight-pm-bulletin-edit-bay",
    category: "feature",
    title: L(
      "The 8pm bulletin: forty minutes inside the edit bay",
      "রাত ৮টার বুলেটিন: এডিট বে-র চল্লিশ মিনিট",
    ),
    excerpt: L(
      "How a broadcast bulletin is assembled after the last reporter files — shot selection, sound beds, graphics and the final check.",
      "শেষ রিপোর্টার ফাইল পাঠানোর পর একটি বুলেটিন কীভাবে তৈরি হয়—শট বাছাই, সাউন্ড বেড, গ্রাফিক্স ও শেষ যাচাই।",
    ),
    body: [
      L(
        "A bulletin is not a stack of reports. It is one continuous piece of television that has to breathe between stories. The first decision is never the edit — it is the order: which story opens, which one carries the weight, and where the audience gets a moment to absorb.",
        "বুলেটিন মানে রিপোর্টের স্তূপ নয়। এটি একটি চলমান টেলিভিশন, যেখানে প্রতিটি গল্পের মাঝে শ্বাস নেওয়ার জায়গা লাগে। প্রথম সিদ্ধান্ত এডিট নয়—ক্রম: কোন গল্প দিয়ে শুরু, কোনটি ভার বহন করবে, আর কোথায় দর্শক এক মুহূর্ত থামবে।",
      ),
      L(
        "Natural sound is cut before narration. If the pictures can carry the first eight seconds, the script gets shorter and the story gets stronger. Graphics follow the pictures, never the other way around, and every lower third is read twice before it goes on air.",
        "ন্যারেশনের আগে ন্যাচারাল সাউন্ড কাটা হয়। প্রথম আট সেকেন্ড যদি ছবিই বহন করতে পারে, স্ক্রিপ্ট ছোট হয় আর গল্প শক্তিশালী হয়। গ্রাফিক্স ছবির অনুসারী, উল্টো নয়; আর প্রতিটি লোয়ার থার্ড সম্প্রচারের আগে দুইবার পড়া হয়।",
      ),
      L(
        "The last five minutes belong to verification, not creativity: correct name spellings, the right clip for the right district, and a check that no archive shot is passing as today's footage.",
        "শেষ পাঁচ মিনিট সৃজনশীলতার নয়, যাচাইয়ের: নামের বানান, সঠিক জেলার সঠিক ক্লিপ, এবং কোনো আর্কাইভ শট আজকের ফুটেজ হিসেবে যাচ্ছে কি না তার পরীক্ষা।",
      ),
    ],
    coverImageUrl: pressImages.samakal,
    author: "MVEA Training Desk",
    publishedAt: "2026-09-12T09:00:00+06:00",
    readingMinutes: 5,
    tags: ["bulletin", "newsroom", "workflow"],
    featured: true,
  },
  {
    id: "post-2",
    slug: "first-ten-minutes-footage-verification",
    category: "guide",
    title: L(
      "The first ten minutes of footage verification",
      "ফুটেজ যাচাইয়ের প্রথম দশ মিনিট",
    ),
    excerpt: L(
      "A practical checklist editors can run before a single cut is made: source, time, location, consent and archive labels.",
      "একটি কাট দেওয়ার আগেই এডিটর যে চেকলিস্ট চালাতে পারেন: সোর্স, সময়, স্থান, সম্মতি ও আর্কাইভ লেবেল।",
    ),
    body: [
      L(
        "Confirm the source file's origin first. Who shot it, where it came from, and whether the same clip exists in another outlet with an earlier timestamp. Ten minutes here prevents the correction that costs a bulletin its credibility.",
        "প্রথমে সোর্স ফাইলের উৎস নিশ্চিত করুন। কে শুট করেছে, কোথা থেকে এসেছে, এবং একই ক্লিপ অন্য মাধ্যমে আগের টাইমস্ট্যাম্পে আছে কি না। এখানে দশ মিনিট ব্যয় করলে সেই সংশোধন এড়ানো যায়, যা বুলেটিনের বিশ্বাসযোগ্যতা নষ্ট করে।",
      ),
      L(
        "Check the frame, not the caption. Weather, signage, vehicle plates and the language on shopfronts usually settle place and time faster than any press note.",
        "ক্যাপশন নয়, ফ্রেম দেখুন। আবহাওয়া, সাইনবোর্ড, গাড়ির নম্বর ও দোকানের ভাষা সাধারণত যেকোনো প্রেস নোটের চেয়ে দ্রুত স্থান ও সময় নির্ধারণ করে।",
      ),
      L(
        "Label anything that has been enhanced, slowed or upscaled. A disclosure in the lower third is cheaper than a retraction.",
        "যা কিছুর উন্নয়ন, স্লো মোশন বা আপস্কেল করা হয়েছে তা লেবেল করুন। লোয়ার থার্ডে একটি ঘোষণা সংশোধনের চেয়ে অনেক সস্তা।",
      ),
    ],
    coverImageUrl: pressImages.banglanews,
    author: "MVEA Ethics Sub-committee",
    publishedAt: "2026-08-02T11:30:00+06:00",
    readingMinutes: 4,
    tags: ["verification", "ethics", "checklist"],
    featured: true,
  },
  {
    id: "post-3",
    slug: "broadcast-post-production-lab-registration",
    category: "workshop",
    title: L(
      "Broadcast Post-Production & Visual Journalism Lab: registration open",
      "ব্রডকাস্ট পোস্ট-প্রোডাকশন ও ভিজ্যুয়াল সাংবাদিকতা ল্যাব: নিবন্ধন শুরু",
    ),
    excerpt: L(
      "Two days with senior newsroom editors: timeline discipline, colour-managed delivery and verification under deadline.",
      "সিনিয়র নিউজরুম এডিটরদের সঙ্গে দুই দিন: টাইমলাইন শৃঙ্খলা, কালার-ম্যানেজড ডেলিভারি ও ডেডলাইনে যাচাই।",
    ),
    body: [
      L(
        "The lab runs inside a working post-production floor. Participants cut a real bulletin from supplied rushes, then rebuild the same bulletin after a review of their timeline.",
        "ল্যাবটি সক্রিয় পোস্ট-প্রোডাকশন ফ্লোরে অনুষ্ঠিত হবে। অংশগ্রহণকারীরা দেওয়া রাশ থেকে একটি বাস্তব বুলেটিন কাটবেন, তারপর টাইমলাইন পর্যালোচনার পর সেটি নতুন করে গড়বেন।",
      ),
      L(
        "Seats are capped at sixteen so every participant leaves with individual notes on their cut, their audio mix and their colour delivery.",
        "আসন সীমিত ষোলটি, যাতে প্রত্যেকে নিজের কাট, অডিও মিক্স ও কালার ডেলিভারি নিয়ে আলাদা মন্তব্য নিয়ে ফিরতে পারেন।",
      ),
    ],
    coverImageUrl: pressImages.jugantor,
    author: "MVEA Training Desk",
    publishedAt: "2026-07-15T10:00:00+06:00",
    readingMinutes: 3,
    tags: ["workshop", "post-production", "registration"],
    featured: false,
  },
  {
    id: "post-4",
    slug: "deepfake-labelling-guideline-tv",
    category: "ethics",
    title: L(
      "Deepfakes and reconstructions: labelling guidance for television",
      "ডিপফেক ও পুনর্নির্মাণ: টেলিভিশনের জন্য লেবেলিং নির্দেশিকা",
    ),
    excerpt: L(
      "Any frame that has been generated, restored or interpolated must be disclosed on screen for its full duration.",
      "যেকোনো ফ্রেম যদি জেনারেট, রেস্টোর বা ইন্টারপোলেট করা হয়, তা পুরো সময়টাই পর্দায় ঘোষণা করতে হবে।",
    ),
    body: [
      L(
        "Restoring is not recreating. Upscaling, denoising and interpolation change evidence, so the lower third must say so for as long as the material is on air — not for five seconds at the start.",
        "রেস্টোর করা মানে নতুন করে বানানো নয়। আপস্কেল, ডিনয়েজ ও ইন্টারপোলেশন প্রমাণ বদলে দেয়, তাই উপাদান পর্দায় যতক্ষণ থাকবে ততক্ষণ লোয়ার থার্ডে তা উল্লেখ থাকতে হবে—শুরুতে পাঁচ সেকেন্ড নয়।",
      ),
      L(
        "Keep the untouched source file with a checksum beside the published version. If a complaint is filed, the committee will ask for it, and a documented decision is defensible in a way a guess is not.",
        "প্রকাশিত সংস্করণের পাশে অপরিবর্তিত মূল ফাইল চেকসামসহ রাখুন। অভিযোগ এলে কমিটি তা চাইবে; নথিভুক্ত সিদ্ধান্ত যেভাবে রক্ষা করা যায়, অনুমান সেভাবে নয়।",
      ),
    ],
    coverImageUrl: pressImages.banglanews,
    author: "MVEA Ethics Sub-committee",
    publishedAt: "2026-06-08T14:00:00+06:00",
    readingMinutes: 4,
    tags: ["deepfake", "ethics", "archive"],
    featured: false,
  },
];

export const seedAssociation = {
  foundedYear: 2026,
  emails: ["dhakavideoeditorsassociation@gmail.com"],
  phones: ["+8801957-452277", "+8801763-234375"],
  address: L("Dhaka, Bangladesh", "ঢাকা, বাংলাদেশ"),
  facebook: FACEBOOK_PAGE,
  socials: {
    facebook: FACEBOOK_PAGE,
    youtube: "",
    linkedin: "",
    instagram: "",
  } satisfies SocialLinks,
};
