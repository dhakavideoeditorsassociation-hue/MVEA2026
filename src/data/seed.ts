import type {
  AssociationStat,
  CommitteeMember,
  CmsPost,
  HeroSlide,
  LocalizedText,
  Member,
  PressArticle,
  SocialLinks,
} from "@/lib/types";

/**
 * Demo editorial content.
 *
 * Every record below is illustrative seed data used by the seed repository so
 * the platform looks complete on first run (no Firebase project required).
 * Phase 2 replaces this source with Cloud Firestore while keeping the same
 * shapes; press links point at publisher home pages because the real article
 * URLs are added by the admin through the OpenGraph importer.
 */

const L = (en: string, bn: string): LocalizedText => ({ en, bn });

const avatar = (id: number) => `https://i.pravatar.cc/480?img=${id}`;
const unsplash = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`;

type MemberSpec = {
  slug: string;
  nameBn: string;
  nameEn: string;
  photoId: number;
  house: string;
  houseBn: string;
  designationEn: string;
  designationBn: string;
  years: number;
  rank: number;
  featured?: boolean;
  skills: Array<[string, string]>;
  tools: string[];
  /** [organization, role English, role Bangla, start year, end year] */
  history: Array<[string, string, string, string, string | null]>;
  bioEn: string;
  bioBn: string;
  showreel?: string;
  socials?: SocialLinks;
};

const specs: MemberSpec[] = [
  {
    slug: "rafiqul-islam",
    nameBn: "রফিকুল ইসলাম",
    nameEn: "Rafiqul Islam",
    photoId: 12,
    house: "Channel i",
    houseBn: "চ্যানেল আই",
    designationEn: "Chief Broadcast Editor",
    designationBn: "চিফ ব্রডকাস্ট এডিটর",
    years: 18,
    rank: 1,
    featured: true,
    skills: [
      ["Broadcast News Editing", "ব্রডকাস্ট নিউজ এডিটিং"],
      ["Bulletin Structure", "বুলেটিন স্ট্রাকচার"],
      ["Crisis Coverage", "সংকট কভারেজ"],
      ["Sound Design", "সাউন্ড ডিজাইন"],
      ["Team Leadership", "টিম লিডারশিপ"],
      ["Archive Research", "আর্কাইভ রিসার্চ"],
    ],
    tools: ["Adobe Premiere Pro", "Avid Media Composer", "DaVinci Resolve", "Adobe Audition"],
    history: [
      ["Channel i", "Chief Broadcast Editor", "চিফ ব্রডকাস্ট এডিটর", "2016", null],
      ["Channel i", "Senior News Editor", "সিনিয়র নিউজ এডিটর", "2010", "2016"],
      ["Ekushey Television", "News Editor", "নিউজ এডিটর", "2005", "2010"],
    ],
    bioEn:
      "Rafiqul has cut every format a Bangladeshi newsroom produces, from a forty second flood update to a two hour election night special. He now leads the Channel i edit floor and trains bulletin editors across the network.",
    bioBn:
      "চল্লিশ সেকেন্ডের বন্যার আপডেট থেকে দুই ঘণ্টার নির্বাচনী বিশেষ অনুষ্ঠান—বাংলাদেশের নিউজরুমের প্রায় সব ফরম্যাটেই তাঁর হাত। এখন চ্যানেল আইয়ের এডিট ফ্লোরের নেতৃত্ব দেন এবং নেটওয়ার্কের বুলেটিন এডিটরদের প্রশিক্ষণ দেন।",
    showreel: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    socials: { linkedin: "https://www.linkedin.com/", youtube: "https://www.youtube.com/" },
  },
  {
    slug: "nusrat-jahan",
    nameBn: "নুসরাত জাহান",
    nameEn: "Nusrat Jahan",
    photoId: 45,
    house: "Somoy TV",
    houseBn: "সময় টিভি",
    designationEn: "Senior News Editor",
    designationBn: "সিনিয়র নিউজ এডিটর",
    years: 14,
    rank: 2,
    featured: true,
    skills: [
      ["Live News Editing", "লাইভ নিউজ এডিটিং"],
      ["Breaking News Packages", "ব্রেকিং নিউজ প্যাকেজ"],
      ["Fact-Check Editing", "ফ্যাক্ট-চেক এডিটিং"],
      ["Field Coordination", "ফিল্ড কোঅর্ডিনেশন"],
      ["Graphics Integration", "গ্রাফিক্স ইন্টিগ্রেশন"],
    ],
    tools: ["Adobe Premiere Pro", "After Effects", "ENPS", "DaVinci Resolve"],
    history: [
      ["Somoy TV", "Senior News Editor", "সিনিয়র নিউজ এডিটর", "2019", null],
      ["ATN News", "News Editor", "নিউজ এডিটর", "2014", "2019"],
      ["Banglavision", "Assistant Editor", "সহকারী এডিটর", "2012", "2014"],
    ],
    bioEn:
      "Nusrat runs the breaking news desk where a package can change three times before it hits air. She is known for holding accuracy under deadline and for mentoring young editors on verification.",
    bioBn:
      "ব্রেকিং নিউজ ডেস্কে কাজ করেন যেখানে সম্প্রচারের আগে প্যাকেজ তিনবার বদলায়। ডেডলাইনের চাপে নির্ভুলতা ধরে রাখা এবং তরুণ এডিটরদের যাচাইয়ের প্রশিক্ষণ দেওয়ার জন্য পরিচিত।",
    showreel: "https://vimeo.com/76979871",
    socials: { facebook: "https://www.facebook.com/" },
  },
  {
    slug: "tanvir-hasan",
    nameBn: "তানভীর হাসান",
    nameEn: "Tanvir Hasan",
    photoId: 33,
    house: "Jamuna Television",
    houseBn: "যমুনা টেলিভিশন",
    designationEn: "Documentary Editor",
    designationBn: "ডকুমেন্টারি এডিটর",
    years: 12,
    rank: 3,
    featured: true,
    skills: [
      ["Long-form Storytelling", "লং-ফর্ম স্টোরিটেলিং"],
      ["Interview Pacing", "ইন্টারভিউ পেসিং"],
      ["Archive Assembly", "আর্কাইভ অ্যাসেম্বলি"],
      ["Color Grading", "কালার গ্রেডিং"],
      ["Music Editing", "মিউজিক এডিটিং"],
    ],
    tools: ["DaVinci Resolve", "Adobe Premiere Pro", "Pro Tools", "Frame.io"],
    history: [
      ["Jamuna Television", "Documentary Editor", "ডকুমেন্টারি এডিটর", "2018", null],
      ["Independent Television", "Senior Editor", "সিনিয়র এডিটর", "2014", "2018"],
      ["Freelance", "Post-production Editor", "পোস্ট-প্রোডাকশন এডিটর", "2011", "2014"],
    ],
    bioEn:
      "Tanvir builds the slow, character-led documentaries that keep viewers past the first ad break. His work on river erosion and migration has screened at two Dhaka documentary festivals.",
    bioBn:
      "ধীরগতির, চরিত্রনির্ভর ডকুমেন্টারি নির্মাণে দক্ষ—যেগুলো প্রথম বিজ্ঞাপনের পরও দর্শক ধরে রাখে। নদীভাঙন ও অভিবাসন নিয়ে তাঁর কাজ ঢাকার দুটি ডকুমেন্টারি উৎসবে প্রদর্শিত হয়েছে।",
    showreel: "https://www.youtube.com/watch?v=LXb3EKWsInQ",
  },
  {
    slug: "sabrina-akter",
    nameBn: "সাবরিনা আক্তার",
    nameEn: "Sabrina Akter",
    photoId: 47,
    house: "Independent Television",
    houseBn: "ইন্ডিপেন্ডেন্ট টেলিভিশন",
    designationEn: "Colorist & Finishing Editor",
    designationBn: "কালারিস্ট ও ফিনিশিং এডিটর",
    years: 9,
    rank: 4,
    featured: true,
    skills: [
      ["Color Grading", "কালার গ্রেডিং"],
      ["Skin Tone Correction", "স্কিন টোন কারেকশন"],
      ["Online Finishing", "অনলাইন ফিনিশিং"],
      ["HDR Delivery", "এইচডিআর ডেলিভারি"],
      ["Broadcast Compliance", "ব্রডকাস্ট কমপ্লায়েন্স"],
    ],
    tools: ["DaVinci Resolve Studio", "Baselight", "Adobe Premiere Pro", "ScopeBox"],
    history: [
      ["Independent Television", "Colorist", "কালারিস্ট", "2020", null],
      ["Bongo", "Post-production Editor", "পোস্ট-প্রোডাকশন এডিটর", "2017", "2020"],
    ],
    bioEn:
      "Sabrina grades news features, drama promos and documentary series on the same resolve timeline. She is the association's go-to voice on broadcast-safe colour and loudness delivery.",
    bioBn:
      "নিউজ ফিচার, ড্রামা প্রোমো ও ডকুমেন্টারি সিরিজ—সবই তিনি একই রিজলভ টাইমলাইনে গ্রেড করেন। ব্রডকাস্ট-সেফ কালার ও লাউডনেস ডেলিভারি নিয়ে সংগঠনের প্রধান পরামর্শদাতা।",
    socials: { instagram: "https://www.instagram.com/", linkedin: "https://www.linkedin.com/" },
  },
  {
    slug: "mahmudul-hasan",
    nameBn: "মাহমুদুল হাসান",
    nameEn: "Mahmudul Hasan",
    photoId: 11,
    house: "ATN Bangla",
    houseBn: "এটিএন বাংলা",
    designationEn: "Motion Graphics Editor",
    designationBn: "মোশন গ্রাফিক্স এডিটর",
    years: 11,
    rank: 5,
    skills: [
      ["Motion Graphics", "মোশন গ্রাফিক্স"],
      ["Data Visualisation", "ডেটা ভিজ্যুয়ালাইজেশন"],
      ["Title Design", "টাইটেল ডিজাইন"],
      ["Election Graphics", "নির্বাচনী গ্রাফিক্স"],
      ["Template Systems", "টেমপ্লেট সিস্টেম"],
    ],
    tools: ["After Effects", "Cinema 4D", "Adobe Illustrator", "Photoshop"],
    history: [
      ["ATN Bangla", "Motion Graphics Editor", "মোশন গ্রাফিক্স এডিটর", "2017", null],
      ["Maasranga Television", "Graphics Designer", "গ্রাফিক্স ডিজাইনার", "2013", "2017"],
    ],
    bioEn:
      "Mahmudul designs the lower thirds, maps and result boards that explain a story in three seconds. He maintains the motion template library shared with six regional newsrooms.",
    bioBn:
      "তিন সেকেন্ডে গল্প বোঝানো লোয়ার থার্ড, ম্যাপ ও রেজাল্ট বোর্ড তাঁর ডিজাইন। ছয়টি আঞ্চলিক নিউজরুমের সঙ্গে শেয়ার করা মোশন টেমপ্লেট লাইব্রেরি তিনি রক্ষণাবেক্ষণ করেন।",
    socials: { website: "https://www.behance.net/" },
  },
  {
    slug: "farhana-yasmin",
    nameBn: "ফারহানা ইয়াসমিন",
    nameEn: "Farhana Yasmin",
    photoId: 44,
    house: "Ekattor TV",
    houseBn: "একাত্তর টিভি",
    designationEn: "Bulletin Editor",
    designationBn: "বুলেটিন এডিটর",
    years: 8,
    rank: 6,
    skills: [
      ["Bulletin Assembly", "বুলেটিন অ্যাসেম্বলি"],
      ["Script Timing", "স্ক্রিপ্ট টাইমিং"],
      ["Political Coverage", "রাজনৈতিক কভারেজ"],
      ["Sound Bite Editing", "সাউন্ড বাইট এডিটিং"],
    ],
    tools: ["Adobe Premiere Pro", "Avid Media Composer", "Dalet", "Adobe Audition"],
    history: [
      ["Ekattor TV", "Bulletin Editor", "বুলেটিন এডিটর", "2021", null],
      ["Channel 24", "Assistant Bulletin Editor", "সহকারী বুলেটিন এডিটর", "2018", "2021"],
    ],
    bioEn:
      "Farhana cuts the 8pm bulletin, which means she owns the hardest clock in the building. Her rundowns are used as training material for new intake editors.",
    bioBn:
      "রাত আটটার বুলেটিন তাঁর হাতে—অর্থাৎ ভবনের সবচেয়ে কঠিন ঘড়িটা তাঁর দায়িত্বে। তাঁর রানডাউন নতুন এডিটরদের প্রশিক্ষণ উপকরণ হিসেবে ব্যবহৃত হয়।",
  },
  {
    slug: "shahriar-kabir",
    nameBn: "শাহরিয়ার কবির",
    nameEn: "Shahriar Kabir",
    photoId: 15,
    house: "DBC News",
    houseBn: "ডিবিসি নিউজ",
    designationEn: "Senior Broadcast Editor",
    designationBn: "সিনিয়র ব্রডকাস্ট এডিটর",
    years: 16,
    rank: 7,
    skills: [
      ["Investigative Editing", "ইনভেস্টিগেটিভ এডিটিং"],
      ["Legal Compliance", "আইনি সম্মতি"],
      ["Source Protection", "সোর্স সুরক্ষা"],
      ["Field Editing", "ফিল্ড এডিটিং"],
      ["Mentoring", "মেন্টরিং"],
    ],
    tools: ["Adobe Premiere Pro", "Avid Media Composer", "Adobe Audition"],
    history: [
      ["DBC News", "Senior Broadcast Editor", "সিনিয়র ব্রডকাস্ট এডিটর", "2016", null],
      ["Channel 24", "Investigative Editor", "ইনভেস্টিগেটিভ এডিটর", "2012", "2016"],
      ["ATN Bangla", "News Editor", "নিউজ এডিটর", "2008", "2012"],
    ],
    bioEn:
      "Shahriar edits investigations where a cut can decide a court case. He writes the association's guidance on blurring, consent and protecting sources in visual material.",
    bioBn:
      "তদন্তী প্রতিবেদনের এডিটিং করেন যেখানে একটি কাট মামলার ফল নির্ধারণ করতে পারে। ব্লারিং, সম্মতি ও ভিজ্যুয়াল উপাদানে সোর্স সুরক্ষা নিয়ে সংগঠনের নির্দেশিকা তাঁর লেখা।",
  },
  {
    slug: "tasnim-rahman",
    nameBn: "তাসনিম রহমান",
    nameEn: "Tasnim Rahman",
    photoId: 26,
    house: "Nagorik TV",
    houseBn: "নাগরিক টিভি",
    designationEn: "Digital News Editor",
    designationBn: "ডিজিটাল নিউজ এডিটর",
    years: 6,
    rank: 8,
    skills: [
      ["Vertical Video", "ভার্টিক্যাল ভিডিও"],
      ["Social Cutdowns", "সোশ্যাল কাটডাউন"],
      ["Subtitling", "সাবটাইটেলিং"],
      ["Fast Turnaround", "দ্রুত টার্নঅ্যারাউন্ড"],
    ],
    tools: ["Adobe Premiere Pro", "CapCut", "After Effects", "Frame.io"],
    history: [
      ["Nagorik TV", "Digital News Editor", "ডিজিটাল নিউজ এডিটর", "2022", null],
      ["Dhaka Tribune", "Video Producer", "ভিডিও প্রডিউসার", "2020", "2022"],
    ],
    bioEn:
      "Tasnim turns broadcast packages into vertical stories that still respect the reporting. She tracks how each cut performs the same evening.",
    bioBn:
      "ব্রডকাস্ট প্যাকেজকে ভার্টিক্যাল গল্পে রূপ দেন—তবু রিপোর্টিংয়ের মান অটুট থাকে। প্রতিটি কাটের পারফরম্যান্স তিনি একই সন্ধ্যায় পর্যালোচনা করেন।",
    socials: { instagram: "https://www.instagram.com/" },
  },
  {
    slug: "ariful-islam",
    nameBn: "আরিফুল ইসলাম",
    nameEn: "Ariful Islam",
    photoId: 51,
    house: "Maasranga Television",
    houseBn: "মাছরাঙা টেলিভিশন",
    designationEn: "Programme Editor",
    designationBn: "প্রোগ্রাম এডিটর",
    years: 13,
    rank: 9,
    skills: [
      ["Studio Show Editing", "স্টুডিও শো এডিটিং"],
      ["Multi-camera Assembly", "মাল্টি-ক্যামেরা অ্যাসেম্বলি"],
      ["Music Programming", "মিউজিক প্রোগ্রামিং"],
      ["Audience Pacing", "দর্শক পেসিং"],
    ],
    tools: ["Adobe Premiere Pro", "DaVinci Resolve", "Pro Tools"],
    history: [
      ["Maasranga Television", "Programme Editor", "প্রোগ্রাম এডিটর", "2015", null],
      ["Desh TV", "Assistant Editor", "সহকারী এডিটর", "2012", "2015"],
    ],
    bioEn:
      "Ariful cuts talk shows and music programmes where the edit decides whether a studio hour feels alive. He runs the association's multi-camera workshop.",
    bioBn:
      "টক শো ও মিউজিক প্রোগ্রাম কাটেন যেখানে স্টুডিওর এক ঘণ্টা প্রাণবন্ত হবে কি না তা এডিটেই নির্ধারিত হয়। সংগঠনের মাল্টি-ক্যামেরা কর্মশালা তাঁর পরিচালনায় হয়।",
  },
  {
    slug: "sadia-sultana",
    nameBn: "সাদিয়া সুলতানা",
    nameEn: "Sadia Sultana",
    photoId: 49,
    house: "RTV",
    houseBn: "আরটিভি",
    designationEn: "News Package Editor",
    designationBn: "নিউজ প্যাকেজ এডিটর",
    years: 5,
    rank: 10,
    skills: [
      ["News Packages", "নিউজ প্যাকেজ"],
      ["Natural Sound", "ন্যাচারাল সাউন্ড"],
      ["Reporter Collaboration", "রিপোর্টার সহযোগিতা"],
      ["Bangla Typography", "বাংলা টাইপোগ্রাফি"],
    ],
    tools: ["Adobe Premiere Pro", "Adobe Audition", "Photoshop"],
    history: [
      ["RTV", "News Package Editor", "নিউজ প্যাকেজ এডিটর", "2023", null],
      ["Boishakhi TV", "Junior Editor", "জুনিয়র এডিটর", "2021", "2023"],
    ],
    bioEn:
      "Sadia is the editor reporters ask for when a story needs to breathe without losing its deadline. She joined the association's mentoring track in 2024.",
    bioBn:
      "ডেডলাইন না হারিয়ে গল্পকে শ্বাস নেওয়ার জায়গা দিতে রিপোর্টাররা সাদিয়াকেই খোঁজেন। ২০২৪ সালে সংগঠনের মেন্টরিং ট্র্যাকে যোগ দেন।",
  },
  {
    slug: "imran-khan",
    nameBn: "ইমরান খান",
    nameEn: "Imran Khan",
    photoId: 60,
    house: "Banglavision",
    houseBn: "বাংলাভিশন",
    designationEn: "Sports Editor",
    designationBn: "স্পোর্টস এডিটর",
    years: 7,
    rank: 11,
    skills: [
      ["Sports Highlights", "স্পোর্টস হাইলাইটস"],
      ["Slow Motion Editing", "স্লো মোশন এডিটিং"],
      ["Match Recaps", "ম্যাচ রিক্যাপ"],
      ["Licensed Footage Handling", "লাইসেন্সড ফুটেজ ব্যবস্থাপনা"],
    ],
    tools: ["Adobe Premiere Pro", "After Effects", "DaVinci Resolve"],
    history: [
      ["Banglavision", "Sports Editor", "স্পোর্টস এডিটর", "2021", null],
      ["Gazi TV", "Assistant Sports Editor", "সহকারী স্পোর্টস এডিটর", "2019", "2021"],
    ],
    bioEn:
      "Imran builds match recaps out of licensed feeds and lives by the rights sheet. His highlight reels are used in the association's rights-and-licensing sessions.",
    bioBn:
      "লাইসেন্সড ফিড থেকে ম্যাচ রিক্যাপ তৈরি করেন এবং স্বত্বের তালিকাই তাঁর মূল দলিল। তাঁর হাইলাইট রিল সংগঠনের স্বত্ব ও লাইসেন্সিং সেশনে ব্যবহৃত হয়।",
  },
  {
    slug: "mehedi-hasan",
    nameBn: "মেহেদী হাসান",
    nameEn: "Mehedi Hasan",
    photoId: 68,
    house: "Desh TV",
    houseBn: "দেশ টিভি",
    designationEn: "Archive & Library Editor",
    designationBn: "আর্কাইভ ও লাইব্রেরি এডিটর",
    years: 4,
    rank: 12,
    skills: [
      ["Archive Cataloguing", "আর্কাইভ ক্যাটালগিং"],
      ["Metadata Standards", "মেটাডেটা স্ট্যান্ডার্ড"],
      ["Footage Restoration", "ফুটেজ রেস্টোরেশন"],
      ["Rights Tracking", "স্বত্ব ট্র্যাকিং"],
    ],
    tools: ["Adobe Premiere Pro", "DaVinci Resolve", "CatDV", "Adobe Bridge"],
    history: [
      ["Desh TV", "Archive & Library Editor", "আর্কাইভ ও লাইব্রেরি এডিটর", "2023", null],
      ["Freelance", "Digitisation Assistant", "ডিজিটাইজেশন সহকারী", "2022", "2023"],
    ],
    bioEn:
      "Mehedi is digitising a decade of tape-bound news footage and making it searchable. Every restoration he finishes saves a newsroom an afternoon.",
    bioBn:
      "টেপে আটকে থাকা এক দশকের নিউজ ফুটেজ ডিজিটাইজ করে অনুসন্ধানযোগ্য করছেন। তাঁর প্রতিটি রেস্টোরেশন নিউজরুমের এক বিকেল বাঁচিয়ে দেয়।",
  },
];

export const seedMembers: Member[] = specs.map((spec) => ({
  id: `mem_${spec.slug.replace(/-/g, "_")}`,
  slug: spec.slug,
  membershipId: `GVEA-2026-${String(spec.rank).padStart(3, "0")}`,
  fullNameBn: spec.nameBn,
  fullNameEn: spec.nameEn,
  photoUrl: avatar(spec.photoId),
  mediaHouse: spec.house,
  mediaHouseBn: spec.houseBn,
  designation: L(spec.designationEn, spec.designationBn),
  yearsExperience: spec.years,
  workHistory: spec.history.map(([organization, roleEn, roleBn, startYear, endYear], index) => ({
    id: `${spec.slug}-h${index + 1}`,
    organization,
    role: L(roleEn, roleBn),
    startYear,
    endYear,
  })),
  skills: spec.skills.map(([en, bn]) => L(en, bn)),
  tools: spec.tools,
  showreelUrl: spec.showreel,
  socialLinks: spec.socials ?? {},
  bio: L(spec.bioEn, spec.bioBn),
  membershipStatus: "approved",
  rankOrder: spec.rank,
  featured: spec.featured ?? false,
  location: "Dhaka, Bangladesh",
  createdAt: "2026-01-14T10:00:00+06:00",
  updatedAt: "2026-10-02T18:30:00+06:00",
}));

export const seedHeroSlides: HeroSlide[] = [
  {
    id: "hero-1",
    title: L("Broadcast Editing Lab 2026", "ব্রডকাস্ট এডিটিং ল্যাব ২০২৬"),
    subtitle: L(
      "Three days inside a live newsroom workflow: ingest, cut, verify, air.",
      "তিন দিনের লাইভ নিউজরুম ওয়ার্কফ্লো: ইনজেস্ট, কাট, যাচাই, সম্প্রচার।",
    ),
    imageUrl: unsplash("photo-1574717024653-61fd2cf4d44d"),
    date: "2026-12-05",
    ctaLabel: L("See the programme", "প্রোগ্রাম দেখুন"),
    ctaHref: "/programs",
    visible: true,
    order: 1,
  },
  {
    id: "hero-2",
    title: L("Members ranked for 2026", "২০২৬ সালের সদস্য র‍্যাংকিং প্রকাশ"),
    subtitle: L(
      "The committee has published this year's peer-reviewed editor rankings.",
      "কমিটি এ বছরের সহকর্মী-মূল্যায়িত এডিটর র‍্যাংকিং প্রকাশ করেছে।",
    ),
    imageUrl: unsplash("photo-1598488035139-bdbb2231ce04"),
    date: "2026-10-18",
    ctaLabel: L("Browse the directory", "তালিকা দেখুন"),
    ctaHref: "/members",
    visible: true,
    order: 2,
  },
  {
    id: "hero-3",
    title: L("Ethics code, second revision", "নীতিমালা কোড, দ্বিতীয় সংশোধনী"),
    subtitle: L(
      "New guidance on AI-assisted restoration, archive labelling and consent.",
      "এআই-সহায়ক রেস্টোরেশন, আর্কাইভ লেবেলিং ও সম্মতি নিয়ে নতুন নির্দেশনা।",
    ),
    imageUrl: unsplash("photo-1522869635100-9f4c5e86aa37"),
    date: "2026-09-02",
    ctaLabel: L("Read the code", "কোড পড়ুন"),
    ctaHref: "/about",
    visible: true,
    order: 3,
  },
  {
    id: "hero-4",
    title: L("Market briefing: rates and hiring", "মার্কেট ব্রিফিং: রেট ও নিয়োগ"),
    subtitle: L(
      "What newsrooms are paying editors this quarter, and where the demand is moving.",
      "এই প্রান্তিকে নিউজরুমে এডিটরদের রেট কত, আর চাহিদা কোথায় সরে যাচ্ছে।",
    ),
    imageUrl: unsplash("photo-1492619375914-88005aa9e8fb"),
    date: "2026-11-01",
    ctaLabel: L("Read the briefing", "ব্রিফিং পড়ুন"),
    ctaHref: "/programs/market-briefing-q4-2026",
    visible: true,
    order: 4,
  },
];

export const seedPress: PressArticle[] = [
  {
    id: "press-1",
    title: L(
      "Video editors form association to set minimum rates",
      "ভিডিও এডিটরদের সংগঠন গঠন, ন্যূনতম পারিশ্রমিক নির্ধারণের উদ্যোগ",
    ),
    excerpt: L(
      "The new body will publish a rate card for broadcast and digital work and mediate disputes over unpaid invoices.",
      "নতুন সংগঠনটি ব্রডকাস্ট ও ডিজিটাল কাজের রেট কার্ড প্রকাশ করবে এবং বকেয়া বিল নিয়ে বিরোধে মধ্যস্থতা করবে।",
    ),
    source: "Prothom Alo",
    url: "https://www.prothomalo.com/",
    imageUrl: unsplash("photo-1504711434969-e33886168f5c"),
    publishedAt: "2026-03-11T09:00:00+06:00",
    featured: true,
  },
  {
    id: "press-2",
    title: L(
      "Inside the edit bay: the invisible craft behind the evening news",
      "এডিট বে-র ভেতরে: সন্ধ্যার সংবাদের অদৃশ্য কারুকাজ",
    ),
    excerpt: L(
      "A feature on how bulletin editors decide what a nation sees first, and what gets cut.",
      "বুলেটিন এডিটররা কীভাবে ঠিক করেন জাতি প্রথমে কী দেখবে আর কী বাদ যাবে, তা নিয়ে ফিচার।",
    ),
    source: "The Daily Star",
    url: "https://www.thedailystar.net/",
    imageUrl: unsplash("photo-1478720568477-152d9b164e26"),
    publishedAt: "2026-05-22T11:30:00+06:00",
    featured: true,
  },
  {
    id: "press-3",
    title: L("Editors' association launches ethics code for visual journalism", "ভিজ্যুয়াল সাংবাদিকতায় নীতিমালা কোড চালু করল এডিটরদের সংগঠন"),
    excerpt: L(
      "The code covers reconstruction labelling, graphic imagery and the use of AI tools in post-production.",
      "কোডে পুনর্নির্মাণের লেবেলিং, সহিংস দৃশ্য এবং পোস্ট-প্রোডাকশনে এআই ব্যবহারের বিষয় রয়েছে।",
    ),
    source: "bdnews24.com",
    url: "https://bdnews24.com/",
    imageUrl: unsplash("photo-1516035069371-29a1b244cc32"),
    publishedAt: "2026-09-04T16:10:00+06:00",
    featured: false,
  },
  {
    id: "press-4",
    title: L("Three-day editing workshop ends with a live bulletin", "তিন দিনের এডিটিং কর্মশালা শেষ হলো লাইভ বুলেটিন দিয়ে"),
    excerpt: L(
      "Forty editors from twelve newsrooms cut a full bulletin under real deadline pressure.",
      "বারোটি নিউজরুমের চল্লিশ জন এডিটর বাস্তব ডেডলাইনের চাপে একটি পূর্ণ বুলেটিন সম্পাদনা করেন।",
    ),
    source: "Somoy News",
    url: "https://www.somoynews.tv/",
    imageUrl: unsplash("photo-1601506521937-0121a7fc2a6b"),
    publishedAt: "2026-06-14T19:00:00+06:00",
    featured: false,
  },
  {
    id: "press-5",
    title: L("Why Bangladesh's newsrooms need colour-managed workflows", "কেন বাংলাদেশের নিউজরুমে কালার-ম্যানেজড ওয়ার্কফ্লো দরকার"),
    excerpt: L(
      "A senior colorist argues that consistent grading is a credibility issue, not a cosmetic one.",
      "একজন সিনিয়র কালারিস্ট argue করেন, ধারাবাহিক গ্রেডিং সৌন্দর্যের নয়, বিশ্বাসযোগ্যতার বিষয়।",
    ),
    source: "Dhaka Post",
    url: "https://www.dhakapost.com/",
    imageUrl: unsplash("photo-1550745165-9bc0b252726f"),
    publishedAt: "2026-07-30T12:00:00+06:00",
    featured: false,
  },
  {
    id: "press-6",
    title: L("Recruiters turn to a public register of verified editors", "যাচাইকৃত এডিটরদের প্রকাশ্য নিবন্ধনের দিকে ঝুঁকছেন নিয়োগকর্তারা"),
    excerpt: L(
      "Media houses say a searchable directory shortens hiring from weeks to days.",
      "মিডিয়া হাউসগুলোর ভাষ্য, অনুসন্ধানযোগ্য তালিকা নিয়োগের সময় সপ্তাহ থেকে দিনে নামিয়ে আনছে।",
    ),
    source: "The Business Standard",
    url: "https://www.tbsnews.net/",
    imageUrl: unsplash("photo-1521737711867-e3b97375f902"),
    publishedAt: "2026-08-19T10:15:00+06:00",
    featured: false,
  },
  {
    id: "press-7",
    title: L("Women editors on the night shift: changing the newsroom floor", "নাইট শিফটে নারী এডিটররা: বদলে যাচ্ছে নিউজরুম"),
    excerpt: L(
      "Members describe the practical changes — transport, childcare, shift rosters — that made night shifts viable.",
      "পরিবহন, শিশুযত্ন ও শিফট রোস্টারে বাস্তব পরিবর্তনের কথা বলেছেন সদস্যরা।",
    ),
    source: "Kaler Kantho",
    url: "https://www.kalerkantho.com/",
    imageUrl: unsplash("photo-1522071820081-009f0129c71c"),
    publishedAt: "2026-10-06T08:45:00+06:00",
    featured: false,
  },
  {
    id: "press-8",
    title: L("Archive digitisation project saves a decade of news footage", "আর্কাইভ ডিজিটাইজেশন প্রকল্পে রক্ষা পেল এক দশকের নিউজ ফুটেজ"),
    excerpt: L(
      "Tape libraries across four channels are being catalogued before the decks stop working.",
      "চারটি চ্যানেলের টেপ লাইব্রেরি ক্যাটালগ করা হচ্ছে—ডেক অচল হওয়ার আগেই।",
    ),
    source: "Jamuna TV",
    url: "https://www.jamuna.tv/",
    imageUrl: unsplash("photo-1598899134739-24c46f58b8c0"),
    publishedAt: "2026-11-02T14:20:00+06:00",
    featured: false,
  },
];

export const seedPosts: CmsPost[] = [
  {
    id: "post-1",
    slug: "market-briefing-q4-2026",
    category: "market-update",
    title: L("Market briefing: editor rates for Q4 2026", "মার্কেট ব্রিফিং: ২০২৬ সালের চতুর্থ প্রান্তিকের এডিটর রেট"),
    excerpt: L(
      "Bulletin editors, package editors and colorists are seeing different demand curves this quarter.",
      "এই প্রান্তিকে বুলেটিন এডিটর, প্যাকেজ এডিটর ও কালারিস্টদের চাহিদার ধরন আলাদা।",
    ),
    body: [
      L(
        "Newsroom hiring has shifted towards multi-skilled editors who can cut a package, build a graphic and deliver a vertical version of the same story within one shift. Requests for single-format editors fell for the second quarter in a row.",
        "নিউজরুমের নিয়োগ এখন এমন বহুমুখী এডিটরদের দিকে ঝুঁকছে যাঁরা এক শিফটেই প্যাকেজ কাটতে, গ্রাফিক বানাতে এবং একই গল্পের ভার্টিক্যাল সংস্করণ দিতে পারেন। একক ফরম্যাটের এডিটরদের চাহিদা টানা দ্বিতীয় প্রান্তিকে কমেছে।",
      ),
      L(
        "Rate cards published by the association put a minimum of BDT 3,500 per broadcast package and BDT 1,800 per digital cutdown. Members report that roughly half of private production houses now honour the floor without negotiation.",
        "সংগঠনের প্রকাশিত রেট কার্ড অনুযায়ী প্রতি ব্রডকাস্ট প্যাকেজের সর্বনিম্ন ৩,৫০০ টাকা এবং প্রতি ডিজিটাল কাটডাউনের ১,৮০০ টাকা। সদস্যদের ভাষ্য, প্রায় অর্ধেক বেসরকারি প্রোডাকশন হাউস এখন দরদাম ছাড়াই এই সর্বনিম্ন সীমা মানে।",
      ),
      L(
        "The committee will publish a separate sheet for documentary and long-form work next month, including revision rounds and delivery formats.",
        "কমিটি আগামী মাসে ডকুমেন্টারি ও লং-ফর্ম কাজের আলাদা তালিকা প্রকাশ করবে, যেখানে সংশোধনের সংখ্যা ও ডেলিভারি ফরম্যাটও থাকবে।",
      ),
    ],
    coverImageUrl: unsplash("photo-1551288049-bebda4e38f71"),
    author: "Membership & Market Committee",
    publishedAt: "2026-11-01T09:00:00+06:00",
    readingMinutes: 4,
    tags: ["rates", "hiring", "market"],
    featured: true,
  },
  {
    id: "post-2",
    slug: "broadcast-editing-lab-2026",
    category: "workshop",
    title: L("Broadcast Editing Lab 2026: applications open", "ব্রডকাস্ট এডিটিং ল্যাব ২০২৬: আবেদন শুরু"),
    excerpt: L(
      "Three days, twelve seats, one live bulletin. Applications close on 25 November.",
      "তিন দিন, বারোটি আসন, একটি লাইভ বুলেটিন। আবেদনের শেষ তারিখ ২৫ নভেম্বর।",
    ),
    body: [
      L(
        "The lab runs inside a working newsroom from 5 to 7 December. Participants ingest real rushes, cut to a rundown and publish a bulletin that is reviewed by the ethics sub-committee.",
        "ল্যাবটি ৫ থেকে ৭ ডিসেম্বর একটি সক্রিয় নিউজরুমে অনুষ্ঠিত হবে। অংশগ্রহণকারীরা বাস্তব রাশ ইনজেস্ট করবেন, রানডাউন অনুযায়ী কাটবেন এবং একটি বুলেটিন প্রকাশ করবেন—যা নীতিমালা উপ-কমিটি পর্যালোচনা করবে।",
      ),
      L(
        "Seats are limited to twelve so every participant gets a dedicated review of their timeline. Members with at least two years of experience are eligible; travel support is available for editors based outside Dhaka.",
        "আসন সীমিত বারোজন, যাতে প্রত্যেকে নিজের টাইমলাইনের আলাদা পর্যালোচনা পান। কমপক্ষে দুই বছরের অভিজ্ঞতাসম্পন্ন সদস্যরা আবেদন করতে পারবেন; ঢাকার বাইরের এডিটরদের জন্য যাতায়াত সহায়তা আছে।",
      ),
    ],
    coverImageUrl: unsplash("photo-1574717024653-61fd2cf4d44d"),
    author: "Training Sub-committee",
    publishedAt: "2026-10-28T10:30:00+06:00",
    readingMinutes: 3,
    tags: ["workshop", "broadcast", "applications"],
    featured: true,
  },
  {
    id: "post-3",
    slug: "resolve-20-broadcast-workflow",
    category: "software-tools",
    title: L("DaVinci Resolve 20: what changes for broadcast editors", "দ্য ভিঞ্চি রিজলভ ২০: ব্রডকাস্ট এডিটরদের জন্য কী বদলাচ্ছে"),
    excerpt: L(
      "Faster multicam, a rebuilt subtitle track and better ProRes handling — tested on a four-hour bulletin.",
      "দ্রুত মাল্টিক্যাম, নতুন সাবটাইটেল ট্র্যাক ও উন্নত প্রোরেস সাপোর্ট—চার ঘণ্টার বুলেটিনে পরীক্ষিত।",
    ),
    body: [
      L(
        "The headline change is multicam performance: eight angles of a parliament session now scrub without proxy generation on a mid-range workstation. For newsrooms still cutting on older hardware, that alone justifies the upgrade.",
        "প্রধান পরিবর্তন মাল্টিক্যাম পারফরম্যান্সে: একটি মাঝারি কনফিগারেশনের ওয়ার্কস্টেশনে প্রোক্সি ছাড়াই সংসদ অধিবেশনের আটটি অ্যাঙ্গেল স্ক্রাব করা যায়। পুরোনো হার্ডওয়্যারে কাজ করা নিউজরুমের জন্য এই একটি সুবিধাই আপগ্রেডের যুক্তি।",
      ),
      L(
        "Subtitle handling is finally timeline-native, which removes a round trip through external tools for our Bangla-language packages. We tested a four-hour bulletin export and saw no drift in the burned-in subtitles.",
        "সাবটাইটেল এখন সরাসরি টাইমলাইনে—যা বাংলা প্যাকেজের জন্য বাইরের টুলে যাওয়া-আসা বন্ধ করে। চার ঘণ্টার বুলেটিন এক্সপোর্টে বার্ন-ইন সাবটাইটেলে কোনো ড্রিফট পাওয়া যায়নি।",
      ),
      L(
        "Caveat: shared-database projects still require consistent versions across the team. Roll out to one edit bay first, as always.",
        "সতর্কতা: শেয়ারড-ডেটাবেজ প্রকল্পে পুরো দলের একই ভার্সন থাকা জরুরি। বরাবরের মতোই প্রথমে একটি এডিট বে-তে চালু করুন।",
      ),
    ],
    coverImageUrl: unsplash("photo-1536240478700-b869070f9279"),
    author: "Tools & Standards Desk",
    publishedAt: "2026-10-12T13:00:00+06:00",
    readingMinutes: 5,
    tags: ["resolve", "software", "review"],
    featured: false,
  },
  {
    id: "post-4",
    slug: "labelling-ai-restoration",
    category: "journalism-ethics",
    title: L("How to label AI-assisted restoration", "এআই-সহায়ক রেস্টোরেশন কীভাবে লেবেল করবেন"),
    excerpt: L(
      "Restoring is not recreating. A practical checklist for archive editors.",
      "রেস্টোর করা মানে নতুন করে বানানো নয়। আর্কাইভ এডিটরদের জন্য ব্যবহারিক চেকলিস্ট।",
    ),
    body: [
      L(
        "Any frame that has been upscaled, denoised or interpolated by a model must be disclosed in the lower third and in the description of the published video. The disclosure stays on screen for the duration of the restored material, not just the first five seconds.",
        "মডেল দিয়ে আপস্কেল, ডিনয়েজ বা ইন্টারপোলেট করা প্রতিটি ফ্রেম লোয়ার থার্ডে এবং প্রকাশিত ভিডিওর বর্ণনায় উল্লেখ করতে হবে। ঘোষণাটি প্রথম পাঁচ সেকেন্ড নয়, রেস্টোর করা উপাদানের পুরো সময়টাই পর্দায় থাকবে।",
      ),
      L(
        "Do not add detail that the original does not contain. If a face is unrecoverable, leave it soft. A sharper lie is still a lie, and in a legal context it can invalidate the footage entirely.",
        "মূল উপাদানে নেই এমন বিস্তারিত যোগ করবেন না। কোনো মুখ পুনরুদ্ধারযোগ্য না হলে তা নরমই রাখুন। স্পষ্ট মিথ্যা মিথ্যাই থাকে, আর আইনি প্রেক্ষিতে তা ফুটেজটিকেই অগ্রহণযোগ্য করে দিতে পারে।",
      ),
      L(
        "Keep the untouched source file alongside the restored version, with a checksum. The committee will ask for it if a complaint is filed.",
        "অপরিবর্তিত মূল ফাইলটি চেকসামসহ রেস্টোর করা ভার্সনের পাশে রাখুন। অভিযোগ এলে কমিটি তা চাইবে।",
      ),
    ],
    coverImageUrl: unsplash("photo-1518770660439-4636190af475"),
    author: "Ethics Sub-committee",
    publishedAt: "2026-09-05T11:00:00+06:00",
    readingMinutes: 4,
    tags: ["ethics", "archive", "ai"],
    featured: true,
  },
  {
    id: "post-5",
    slug: "natural-sound-first-sixty-seconds",
    category: "storytelling",
    title: L("The first sixty seconds: natural sound before narration", "প্রথম ষাট সেকেন্ড: ন্যারেশনের আগে ন্যাচারাল সাউন্ড"),
    excerpt: L(
      "Let the room speak before the reporter does. A short argument for holding the voiceover.",
      "রিপোর্টারের আগে ঘরটিকে বলতে দিন। ভয়েসওভার ধরে রাখার পক্ষে সংক্ষিপ্ত যুক্তি।",
    ),
    body: [
      L(
        "A package that opens with eight seconds of unbroken ambient sound tells the viewer where they are before it tells them what to think. Editors who rush to narration lose that geography and spend the rest of the cut rebuilding it.",
        "যে প্যাকেজ আট সেকেন্ড নিরবচ্ছিন্ন অ্যাম্বিয়েন্ট সাউন্ড দিয়ে শুরু হয়, সেটি মতামত দেওয়ার আগেই দর্শককে জানায় সে কোথায় আছে। যাঁরা তাড়াহুড়ো করে ন্যারেশনে যান, তাঁরা সেই ভূগোল হারান এবং বাকি সময়টা তা পুনর্গঠনে ব্যয় করেন।",
      ),
      L(
        "Practically: cut the natural sound bed first, then write the script to the pictures you already have. The script gets shorter, and the pictures get braver.",
        "ব্যবহারিকভাবে: আগে ন্যাচারাল সাউন্ডের বিছানা কাটুন, তারপর যে ছবি আছে তার সঙ্গে মিলিয়ে স্ক্রিপ্ট লিখুন। স্ক্রিপ্ট ছোট হয়, ছবি সাহসী হয়।",
      ),
    ],
    coverImageUrl: unsplash("photo-1493225457124-a3eb161ffa5f"),
    author: "Storytelling Desk",
    publishedAt: "2026-08-22T09:30:00+06:00",
    readingMinutes: 3,
    tags: ["storytelling", "sound"],
    featured: false,
  },
  {
    id: "post-6",
    slug: "premiere-pro-multicam-newsroom",
    category: "software-tools",
    title: L("Premiere Pro multicam settings that survive a deadline", "ডেডলাইন সামলানো প্রিমিয়ার প্রো মাল্টিক্যাম সেটিংস"),
    excerpt: L(
      "Proxy strategy, sequence settings and the two keyboard shortcuts that save a live bulletin.",
      "প্রোক্সি কৌশল, সিকোয়েন্স সেটিংস আর দুটি কীবোর্ড শর্টকাট যা লাইভ বুলেটিন বাঁচায়।",
    ),
    body: [
      L(
        "Generate proxies at ingest, not when the timeline complains. A 1080p ProRes Proxy ladder keeps scrubbing smooth even when four reporters drop footage an hour before air.",
        "টাইমলাইন সমস্যা করলে নয়, ইনজেস্টেই প্রোক্সি তৈরি করুন। ১০৮০p প্রোরেস প্রক্সি ল্যাডার স্ক্রাবিং মসৃণ রাখে, যদিও সম্প্রচারের এক ঘণ্টা আগে চারজন রিপোর্টার ফুটেজ দেন।",
      ),
      L(
        "Lock the audio channel mapping in the template. Most live errors we see are not creative — they are a swapped channel discovered ninety seconds before air.",
        "টেমপ্লেটে অডিও চ্যানেল ম্যাপিং লক করুন। লাইভে আমরা যে ভুলগুলো দেখি সেগুলো সৃজনশীল নয়—সম্প্রচারের নব্বই সেকেন্ড আগে ধরা পড়া চ্যানেল বদল।",
      ),
      L(
        "Keep one sequence per bulletin item and one master sequence that nests them. Fixes happen in the item, timing happens in the master.",
        "প্রতিটি বুলেটিন আইটেমের জন্য একটি সিকোয়েন্স এবং সেগুলো নেস্ট করা একটি মাস্টার সিকোয়েন্স রাখুন। সংশোধন হয় আইটেমে, টাইমিং হয় মাস্টারে।",
      ),
    ],
    coverImageUrl: unsplash("photo-1598488035139-bdbb2231ce04"),
    author: "Tools & Standards Desk",
    publishedAt: "2026-07-18T15:45:00+06:00",
    readingMinutes: 5,
    tags: ["premiere", "workflow"],
    featured: false,
  },
  {
    id: "post-7",
    slug: "minimum-fee-guidance-2026",
    category: "market-update",
    title: L("Minimum fee guidance for freelance editors", "ফ্রিল্যান্স এডিটরদের জন্য সর্বনিম্ন ফি নির্দেশিকা"),
    excerpt: L(
      "Revision rounds, delivery formats and the clauses worth negotiating before you start.",
      "সংশোধনের সংখ্যা, ডেলিভারি ফরম্যাট এবং কাজ শুরুর আগে যেসব ধারা নিয়ে দরকষাকষি করা দরকার।",
    ),
    body: [
      L(
        "The single most expensive omission in a freelance contract is an unlimited revision clause. Our template caps revisions at two rounds and prices further changes per hour.",
        "ফ্রিল্যান্স চুক্তিতে সবচেয়ে ব্যয়বহুল বাদ পড়া ধারাটি হলো সীমাহীন সংশোধনের শর্ত। আমাদের টেমপ্লেটে সংশোধন দুই রাউন্ডে সীমিত এবং পরবর্তী পরিবর্তনের মূল্য ঘণ্টাভিত্তিক।",
      ),
      L(
        "Specify delivery formats up front — broadcast master, social cutdowns, subtitled versions. Each format is a separate deliverable, not a courtesy.",
        "ডেলিভারি ফরম্যাট আগেই ঠিক করুন—ব্রডকাস্ট মাস্টার, সোশ্যাল কাটডাউন, সাবটাইটেল সংস্করণ। প্রতিটি ফরম্যাট আলাদা ডেলিভারেবল, সৌজন্য নয়।",
      ),
    ],
    coverImageUrl: unsplash("photo-1450101499163-c8848c66ca85"),
    author: "Membership & Market Committee",
    publishedAt: "2026-06-30T10:00:00+06:00",
    readingMinutes: 4,
    tags: ["freelance", "contracts", "rates"],
    featured: false,
  },
  {
    id: "post-8",
    slug: "ethics-of-crisis-footage",
    category: "journalism-ethics",
    title: L("Editing crisis footage without exploiting the bereaved", "শোকাহতদের ব্যবহার না করে সংকটের ফুটেজ সম্পাদনা"),
    excerpt: L(
      "Practical rules for blurring, distance and the moment to cut away.",
      "ব্লারিং, দূরত্ব এবং কখন ক্যামেরা সরাতে হবে—ব্যবহারিক নিয়ম।",
    ),
    body: [
      L(
        "Ask what the image adds to public understanding. If the answer is only shock, it does not run. That single test resolves most arguments on the desk.",
        "ভেবে দেখুন ছবিটি জনগণের বোঝাপড়ায় কী যোগ করে। উত্তর যদি শুধু আঘাত হয়, তবে তা চলবে না। এই একটি পরীক্ষাই ডেস্কের বেশিরভাগ বিতর্ক মিটিয়ে দেয়।",
      ),
      L(
        "When in doubt, go wide before going close. A wide shot can convey scale and grief without publishing a face that never consented to being a headline.",
        "সন্দেহ হলে ক্লোজ শটের আগে ওয়াইড শট নিন। ওয়াইড শট মাত্রা ও শোক বোঝাতে পারে—যে মুখ শিরোনাম হতে সম্মতি দেয়নি, তা প্রকাশ না করেই।",
      ),
      L(
        "Keep an internal log of the decision and who made it. The ethics sub-committee can defend a documented judgment; it cannot defend a guess.",
        "সিদ্ধান্ত ও সিদ্ধান্তগ্রহণকারীর অভ্যন্তরীণ লগ রাখুন। নীতিমালা উপ-কমিটি নথিভুক্ত বিচার রক্ষা করতে পারে, অনুমান নয়।",
      ),
    ],
    coverImageUrl: unsplash("photo-1504711434969-e33886168f5c"),
    author: "Ethics Sub-committee",
    publishedAt: "2026-05-09T08:15:00+06:00",
    readingMinutes: 4,
    tags: ["ethics", "crisis", "consent"],
    featured: false,
  },
];

export const seedCommittee: CommitteeMember[] = [
  {
    id: "com_1",
    name: L("Rafiqul Islam", "রফিকুল ইসলাম"),
    role: L("President", "সভাপতি"),
    mediaHouse: "Channel i",
    photoUrl: avatar(12),
    order: 1,
    email: "president@gvea.org",
    socialLinks: { linkedin: "https://www.linkedin.com/" },
  },
  {
    id: "com_2",
    name: L("Shahriar Kabir", "শাহরিয়ার কবির"),
    role: L("Vice President", "সহ-সভাপতি"),
    mediaHouse: "DBC News",
    photoUrl: avatar(15),
    order: 2,
    email: "vp@gvea.org",
    socialLinks: {},
  },
  {
    id: "com_3",
    name: L("Nusrat Jahan", "নুসরাত জাহান"),
    role: L("General Secretary", "সাধারণ সম্পাদক"),
    mediaHouse: "Somoy TV",
    photoUrl: avatar(45),
    order: 3,
    email: "secretary@gvea.org",
    socialLinks: { facebook: "https://www.facebook.com/" },
  },
  {
    id: "com_4",
    name: L("Tanvir Hasan", "তানভীর হাসান"),
    role: L("Joint Secretary", "যুগ্ম সম্পাদক"),
    mediaHouse: "Jamuna Television",
    photoUrl: avatar(33),
    order: 4,
    email: "joint@gvea.org",
    socialLinks: {},
  },
  {
    id: "com_5",
    name: L("Farhana Yasmin", "ফারহানা ইয়াসমিন"),
    role: L("Treasurer", "কোষাধ্যক্ষ"),
    mediaHouse: "Ekattor TV",
    photoUrl: avatar(44),
    order: 5,
    email: "treasurer@gvea.org",
    socialLinks: {},
  },
  {
    id: "com_6",
    name: L("Mahmudul Hasan", "মাহমুদুল হাসান"),
    role: L("Membership Secretary", "সদস্যপদ সম্পাদক"),
    mediaHouse: "ATN Bangla",
    photoUrl: avatar(11),
    order: 6,
    email: "membership@gvea.org",
    socialLinks: {},
  },
  {
    id: "com_7",
    name: L("Ariful Islam", "আরিফুল ইসলাম"),
    role: L("Training Secretary", "প্রশিক্ষণ সম্পাদক"),
    mediaHouse: "Maasranga Television",
    photoUrl: avatar(51),
    order: 7,
    email: "training@gvea.org",
    socialLinks: {},
  },
  {
    id: "com_8",
    name: L("Sabrina Akter", "সাবরিনা আক্তার"),
    role: L("Ethics Secretary", "নীতিমালা সম্পাদক"),
    mediaHouse: "Independent Television",
    photoUrl: avatar(47),
    order: 8,
    email: "ethics@gvea.org",
    socialLinks: {},
  },
  {
    id: "com_9",
    name: L("Tasnim Rahman", "তাসনিম রহমান"),
    role: L("Publicity Secretary", "প্রচার সম্পাদক"),
    mediaHouse: "Nagorik TV",
    photoUrl: avatar(26),
    order: 9,
    email: "press@gvea.org",
    socialLinks: { instagram: "https://www.instagram.com/" },
  },
];

export const seedStats: AssociationStat[] = [
  { id: "stat-1", value: "180+", label: L("Verified editors", "যাচাইকৃত এডিটর") },
  { id: "stat-2", value: "42", label: L("Workshops delivered", "কর্মশালা সম্পন্ন") },
  { id: "stat-3", value: "14", label: L("Media houses represented", "মিডিয়া হাউস প্রতিনিধিত্ব") },
  { id: "stat-4", value: "9", label: L("Committee members", "কমিটি সদস্য") },
];

export const seedAssociation = {
  foundedYear: 2019,
  email: "hello@gvea.org",
  phone: "+880 1711 000 000",
  address: L("House 12, Road 5, Dhanmondi, Dhaka 1205, Bangladesh", "বাড়ি ১২, রোড ৫, ধানমন্ডি, ঢাকা ১২০৫, বাংলাদেশ"),
  socials: {
    facebook: "https://www.facebook.com/",
    youtube: "https://www.youtube.com/",
    linkedin: "https://www.linkedin.com/",
    instagram: "https://www.instagram.com/",
  } satisfies SocialLinks,
};
