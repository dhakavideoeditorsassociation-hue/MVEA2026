"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  Check,
  Download,
  ExternalLink,
  FileText,
  ImagePlus,
  Loader2,
  LogOut,
  Newspaper,
  Send,
  ShieldAlert,
  Trash2,
  Users,
  X,
} from "lucide-react";

import { FacebookIcon } from "@/components/brand-icons";
import { Avatar } from "@/components/common/avatar";
import { Markdown } from "@/components/common/markdown";
import { HeroSlidesPanel } from "@/components/admin/hero-slides-panel";
import { MemberCreatePanel } from "@/components/admin/member-create-panel";
import { SiteContentPanel } from "@/components/admin/site-content-panel";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label, Select, Textarea } from "@/components/ui/form-controls";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth/auth-provider";
import { LOGO_SRC } from "@/lib/brand";
import { categoryKey, POST_CATEGORIES } from "@/lib/categories";
import { experienceLabel, formatShortDate } from "@/lib/format";
import type { TranslationKey } from "@/lib/i18n/dictionaries";
import { useI18n } from "@/lib/i18n/provider";
import { useSiteSettings } from "@/lib/cms/site-settings";
import { saveMemberPhoto, useMemberPhotos } from "@/lib/photos/member-photos";
import { listHireRequests, officialReplyBody, setHireStatus } from "@/lib/store/hire-store";
import { uploadFile } from "@/lib/upload";
import {
  addPost,
  addPressArticle,
  addPressRelease,
  listApplications,
  listPressReleases,
  listInquiries,
  nextMembershipId,
  readPostOverrides,
  readPressOverrides,
  readRankOverrides,
  reviewApplication,
  setMemberRank,
} from "@/lib/store/admin-store";
import type {
  CmsPost,
  HireRequest,
  HeroSlide,
  Member,
  MembershipApplication,
  PressArticle,
  PressRelease,
  RecruiterInquiry,
} from "@/lib/types";
import { cn } from "@/lib/utils";

type Tab = "overview" | "applications" | "ranking" | "press" | "releases" | "inquiries" | "requests" | "content" | "add-member" | "hero" | "posts";

const TABS: Array<{ id: Tab; key: TranslationKey }> = [
  { id: "overview", key: "admin.tab.overview" },
  { id: "applications", key: "admin.tab.applications" },
  { id: "ranking", key: "admin.tab.ranking" },
  { id: "press", key: "admin.tab.press" },
  { id: "releases", key: "admin.tab.releases" },
  { id: "inquiries", key: "admin.tab.inquiries" },
  { id: "requests", key: "hire.cta" },
  { id: "content", key: "admin.tab.content" },
  { id: "add-member", key: "admin.tab.addMember" },
  { id: "hero", key: "admin.tab.hero" },
  { id: "posts", key: "admin.tab.posts" },
];

type AdminViewProps = {
  members: Member[];
  heroSlides: HeroSlide[];
  posts: CmsPost[];
  pressArticles: PressArticle[];
};

export function AdminView({ members, heroSlides, posts, pressArticles }: AdminViewProps) {
  const { t } = useI18n();
  const { user, ready, logout, mode } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const { settings } = useSiteSettings();

  const [applications, setApplications] = useState<MembershipApplication[]>([]);
  const [inquiries, setInquiries] = useState<RecruiterInquiry[]>([]);
  const [pressOverrides, setPressOverrides] = useState<PressArticle[]>([]);
  const [releaseOverrides, setReleaseOverrides] = useState<PressRelease[]>([]);
  const [postOverrides, setPostOverrides] = useState<CmsPost[]>([]);
  const [rankOverrides, setRankOverrides] = useState<Record<string, number>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    let cancelled = false;
    void Promise.all([listApplications(), listInquiries(), listPressReleases()]).then(([apps, requests, releases]) => {
      if (cancelled) return;
      setApplications(apps);
      setInquiries(requests);
      setReleaseOverrides(releases);
      setPressOverrides(readPressOverrides());
      setPostOverrides(readPostOverrides());
      setRankOverrides(readRankOverrides());
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const pending = applications.filter((item) => item.status === "pending");
  const rankedMembers = useMemo(() => {
    return [...members]
      .map((member) => ({ ...member, rankOrder: rankOverrides[member.id] ?? member.rankOrder }))
      .sort((a, b) => (a.rankOrder ?? 9999) - (b.rankOrder ?? 9999));
  }, [members, rankOverrides]);

  const allPress = [...pressOverrides, ...pressArticles];
  const allPosts = [...postOverrides, ...posts];

  if (!ready) {
    return (
      <div className="container flex min-h-[50vh] items-center justify-center py-20">
        <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          {t("admin.guard.checking")}
        </p>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="container max-w-lg py-24 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-destructive/10 text-destructive">
          <ShieldAlert className="h-6 w-6" aria-hidden />
        </span>
        <h1 className="mt-5 text-2xl font-bold tracking-tight text-foreground">{t("admin.guard.denied")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("admin.guard.deniedBody")}</p>
        <Link href="/login" className={`${buttonVariants({ size: "lg" })} mt-6`}>
          {t("admin.guard.login")}
        </Link>
      </div>
    );
  }

  async function handleLogout() {
    await logout();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="container py-10 lg:py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">{t("admin.eyebrow")}</p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{t("admin.title")}</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{t("admin.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="h-7 px-3">
            {user.email}
          </Badge>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1.5">
            <LogOut className="h-3.5 w-3.5" aria-hidden />
            {t("admin.signOut")}
          </Button>
        </div>
      </div>

      {mode === "demo" ? (
        <p className="mt-4 rounded-md border border-secondary/35 bg-secondary/10 px-3 py-2 text-xs leading-relaxed text-foreground">
          {t("admin.demo.banner")}
        </p>
      ) : null}

      <nav aria-label={t("admin.eyebrow")} className="no-scrollbar mt-6 flex gap-1.5 overflow-x-auto border-b border-border pb-2">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            aria-current={tab === item.id ? "page" : undefined}
            className={cn(
              "shrink-0 rounded-md px-3 py-1.5 text-sm font-semibold transition-colors",
              tab === item.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            {t(item.key)}
          </button>
        ))}
      </nav>

      {!loaded ? (
        <p className="mt-10 inline-flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          {t("admin.loading")}
        </p>
      ) : (
        <div className="mt-8">
          {tab === "overview" ? (
            <div className="space-y-6">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label={t("admin.stats.pending")} value={pending.length} icon={<FileText className="h-4 w-4" />} />
                <StatCard label={t("admin.stats.approved")} value={members.length} icon={<BadgeCheck className="h-4 w-4" />} />
                <StatCard label={t("admin.stats.inquiries")} value={inquiries.length} icon={<Users className="h-4 w-4" />} />
                <StatCard label={t("admin.stats.press")} value={allPress.length} icon={<Newspaper className="h-4 w-4" />} />
              </div>

              <section className="rounded-lg border border-border bg-card p-5 shadow-card">
                <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {t("admin.applications.title")}
                </h2>
                {pending.length === 0 ? (
                  <p className="mt-3 text-sm text-muted-foreground">{t("admin.applications.empty")}</p>
                ) : (
                  <ul className="mt-3 divide-y divide-border">
                    {pending.slice(0, 4).map((application) => (
                      <li key={application.uid} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                        <span className="text-sm font-medium text-foreground">
                          {application.fullNameEn || application.email}
                          <span className="ml-2 text-xs text-muted-foreground">{application.mediaHouse}</span>
                        </span>
                        <Button size="sm" variant="outline" onClick={() => setTab("applications")}>
                          {t("admin.tab.applications")}
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          ) : null}

          {tab === "applications" ? (
            <ApplicationsPanel
              applications={applications}
              onReviewed={(updated) =>
                setApplications((current) => current.map((item) => (item.uid === updated.uid ? updated : item)))
              }
              approvedCount={members.length + applications.filter((item) => item.status === "approved").length}
            />
          ) : null}

          {tab === "ranking" ? (
            <div className="space-y-10">
              <RankingPanel members={rankedMembers} onRanksChanged={setRankOverrides} />
              <MemberPhotosPanel members={rankedMembers} />
            </div>
          ) : null}

          {tab === "press" ? (
            <PressPanel
              articles={allPress.filter((article) => !(settings.deletedIds?.press ?? []).includes(article.id))}
              onPublished={(article) => setPressOverrides((current) => [article, ...current])}
              onDeleted={(id) => setPressOverrides((current) => current.filter((item) => item.id !== id))}
            />
          ) : null}

          {tab === "releases" ? (
            <PressReleasePanel
              releases={[...releaseOverrides]}
              onPublished={(release) => setReleaseOverrides((current) => [release, ...current])}
            />
          ) : null}

          {tab === "inquiries" ? <InquiriesPanel inquiries={inquiries} /> : null}

          {tab === "requests" ? <HireRequestsPanel /> : null}
          {tab === "content" ? <SiteContentPanel /> : null}
          {tab === "add-member" ? <MemberCreatePanel members={members} /> : null}

          {tab === "hero" ? <HeroSlidesPanel seededSlides={heroSlides} /> : null}

          {tab === "posts" ? (
            <PostsPanel posts={allPosts} onPublished={(post) => setPostOverrides((current) => [post, ...current])} />
          ) : null}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-card">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        <span className="text-primary">{icon}</span>
        {label}
      </div>
      <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">{value}</p>
    </div>
  );
}

function ApplicationsPanel({
  applications,
  onReviewed,
  approvedCount,
}: {
  applications: MembershipApplication[];
  onReviewed: (application: MembershipApplication) => void;
  approvedCount: number;
}) {
  const { t, lang } = useI18n();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function review(application: MembershipApplication, decision: "approved" | "rejected") {
    setBusyId(application.uid);
    try {
      const membershipId = decision === "approved" ? application.membershipId ?? nextMembershipId(approvedCount) : undefined;
      await reviewApplication(application.uid, decision, membershipId);
      onReviewed({ ...application, status: decision, membershipId: membershipId ?? application.membershipId });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {t("admin.applications.title")}
      </h2>

      {applications.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border bg-card/60 px-5 py-10 text-center text-sm text-muted-foreground">
          {t("admin.applications.empty")}
        </p>
      ) : (
        applications.map((application) => (
          <article key={application.uid} className="rounded-lg border border-border bg-card p-5 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                {application.photoUrl ? (
                  <span className="relative h-14 w-14 overflow-hidden rounded-lg bg-muted">
                    <Image src={application.photoUrl} alt="" fill sizes="56px" className="object-cover" />
                  </span>
                ) : (
                  <span className="grid h-14 w-14 place-items-center rounded-lg bg-muted text-muted-foreground">
                    <Users className="h-5 w-5" aria-hidden />
                  </span>
                )}
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    {application.fullNameEn || application.fullNameBn}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {application.designation} · {application.mediaHouse}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground" dir="ltr">
                    {application.email} · {application.phone}
                  </p>
                </div>
              </div>
              <Badge
                variant={application.status === "approved" ? "default" : application.status === "rejected" ? "outline" : "secondary"}
              >
                {application.status === "approved"
                  ? t("admin.applications.approved")
                  : application.status === "rejected"
                    ? t("admin.applications.rejected")
                    : t("dashboard.status.pending")}
              </Badge>
            </div>

            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {t("admin.applications.experience")}
                </dt>
                <dd className="text-sm text-foreground">{experienceLabel(application.yearsExperience, lang)}</dd>
              </div>
              <div>
                <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {t("dashboard.rank")}
                </dt>
                <dd className="text-sm text-foreground">
                  {application.membershipId ?? t("admin.applications.membershipId")}: {application.membershipId ?? nextMembershipId(approvedCount)}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {t("dashboard.field.skills")}
                </dt>
                <dd className="mt-1 flex flex-wrap gap-1.5">
                  {application.skills.map((skill) => (
                    <Badge key={skill} variant="muted">
                      {skill}
                    </Badge>
                  ))}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {t("dashboard.field.bio")}
                </dt>
                <dd className="text-sm leading-relaxed text-muted-foreground">{application.bio}</dd>
              </div>
            </dl>

            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/70 pt-3">
              {application.cvUrl ? (
                <a
                  href={application.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}
                >
                  <Download className="h-3.5 w-3.5" aria-hidden />
                  {t("admin.applications.cv")}
                </a>
              ) : (
                <span className="text-xs text-muted-foreground">{t("admin.applications.cvMissing")}</span>
              )}
              {application.showreelUrl ? (
                <a
                  href={application.showreelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1.5")}
                >
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  {t("member.showreel")}
                </a>
              ) : null}
              <div className="ml-auto flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={busyId === application.uid || application.status === "rejected"}
                  onClick={() => void review(application, "rejected")}
                  className="gap-1.5"
                >
                  <X className="h-3.5 w-3.5" aria-hidden />
                  {t("admin.applications.reject")}
                </Button>
                <Button
                  size="sm"
                  disabled={busyId === application.uid || application.status === "approved"}
                  onClick={() => void review(application, "approved")}
                  className="gap-1.5"
                >
                  {busyId === application.uid ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                  ) : (
                    <Check className="h-3.5 w-3.5" aria-hidden />
                  )}
                  {t("admin.applications.approve")}
                </Button>
              </div>
            </div>
          </article>
        ))
      )}
    </div>
  );
}

function RankingPanel({
  members,
  onRanksChanged,
}: {
  members: Member[];
  onRanksChanged: (overrides: Record<string, number>) => void;
}) {
  const { t, lang, tx } = useI18n();
  const [draft, setDraft] = useState<Record<string, number>>(
    Object.fromEntries(members.map((member) => [member.id, member.rankOrder ?? 0])),
  );
  const [savedId, setSavedId] = useState<string | null>(null);

  async function save(memberId: string) {
    await setMemberRank(memberId, draft[memberId]);
    setSavedId(memberId);
    onRanksChanged({ ...draft });
    window.setTimeout(() => setSavedId(null), 1600);
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">{t("admin.ranking.title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("admin.ranking.subtitle")}</p>
      </div>
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-[0.7rem] uppercase tracking-[0.1em] text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5 text-left font-semibold">{t("admin.ranking.rank")}</th>
              <th className="px-4 py-2.5 text-left font-semibold">{t("nav.members")}</th>
              <th className="hidden px-4 py-2.5 text-left font-semibold sm:table-cell">{t("member.mediaHouse")}</th>
              <th className="px-4 py-2.5 text-right font-semibold">{t("admin.ranking.save")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {members.map((member) => (
              <tr key={member.id}>
                <td className="px-4 py-2.5">
                  <Input
                    type="number"
                    min={1}
                    value={draft[member.id] ?? 0}
                    onChange={(event) => setDraft((current) => ({ ...current, [member.id]: Number(event.target.value) }))}
                    aria-label={`${t("admin.ranking.rank")} ${member.fullNameEn}`}
                    className="h-8 w-20"
                  />
                </td>
                <td className="px-4 py-2.5">
                  <Link href={`/members/${member.slug}`} className="font-medium text-foreground hover:text-primary">
                    {lang === "bn" ? member.fullNameBn : member.fullNameEn}
                  </Link>
                  <p className="text-xs text-muted-foreground">{tx(member.designation)}</p>
                </td>
                <td className="hidden px-4 py-2.5 text-muted-foreground sm:table-cell">{member.mediaHouse}</td>
                <td className="px-4 py-2.5 text-right">
                  <Button size="sm" variant={savedId === member.id ? "secondary" : "outline"} onClick={() => void save(member.id)}>
                    {savedId === member.id ? t("admin.ranking.saved") : t("admin.ranking.save")}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type OgPreview = {
  url: string;
  title: string;
  description: string;
  image: string | null;
  siteName: string;
  publishedAt: string | null;
};

function PressPanel({
  articles,
  onPublished,
  onDeleted,
}: {
  articles: PressArticle[];
  onPublished: (article: PressArticle) => void;
  onDeleted?: (id: string) => void;
}) {
  const { t, lang, tx } = useI18n();
  const { settings, save } = useSiteSettings();

  async function removeItem(id: string) {
    if (!window.confirm(t("admin.delete.confirm"))) return;
    await save({
      ...settings,
      deletedIds: { ...settings.deletedIds, press: [...(settings.deletedIds?.press ?? []), id] },
    });
    onDeleted?.(id);
  }
  const [url, setUrl] = useState("");
  const [preview, setPreview] = useState<OgPreview | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [published, setPublished] = useState(false);
  const [customImage, setCustomImage] = useState("");
  const [manual, setManual] = useState({ title: "", source: "", publishedAt: "", imageUrl: "" });
  const [uploadingThumb, setUploadingThumb] = useState(false);

  async function fetchPreview() {
    setBusy(true);
    setError(false);
    setPublished(false);
    try {
      const response = await fetch("/api/fetch-og", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const payload = (await response.json()) as { ok: boolean; data?: OgPreview; error?: string };
      if (!payload.ok || !payload.data) throw new Error(payload.error ?? "failed");
      setPreview(payload.data);
      setManual({
        title: payload.data.title ?? "",
        source: payload.data.siteName ?? "",
        publishedAt: (payload.data.publishedAt ?? new Date().toISOString()).slice(0, 10),
        imageUrl: payload.data.image ?? "",
      });
    } catch {
      setPreview(null);
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  async function publish() {
    const headline = (manual.title || preview?.title || "").trim();
    if (!headline || !url.trim()) return;
    const article: PressArticle = {
      id: `press-${Date.now()}`,
      title: { bn: headline, en: headline },
      excerpt: { bn: preview?.description || headline, en: preview?.description || headline },
      source: (manual.source || preview?.siteName || "Press").trim(),
      url: url.trim(),
      imageUrl: customImage || manual.imageUrl || preview?.image || "",
      publishedAt: manual.publishedAt ? new Date(manual.publishedAt).toISOString() : preview?.publishedAt ?? new Date().toISOString(),
      featured: false,
    };
    await addPressArticle(article);
    onPublished(article);
    setPublished(true);
    setPreview(null);
    setUrl("");
    setCustomImage("");
    setManual({ title: "", source: "", publishedAt: "", imageUrl: "" });
  }
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-card p-5 shadow-card">
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">{t("admin.press.title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("admin.press.subtitle")}</p>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Input
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://www.prothomalo.com/…"
            dir="ltr"
            aria-label={t("admin.press.urlLabel")}
          />
          <Button onClick={() => void fetchPreview()} disabled={busy || !url.trim()} className="gap-2 sm:w-48">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Newspaper className="h-4 w-4" aria-hidden />}
            {busy ? t("admin.press.fetching") : t("admin.press.fetch")}
          </Button>
        </div>

        <div className="mt-4 rounded-md border border-border/70 p-3">
          <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            {t("admin.press.manual")}
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="press-manual-title">{t("admin.press.headline")}</Label>
              <Input
                id="press-manual-title"
                value={manual.title}
                onChange={(event) => setManual((current) => ({ ...current, title: event.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="press-manual-outlet">{t("admin.press.publisher")}</Label>
              <Input
                id="press-manual-outlet"
                value={manual.source}
                onChange={(event) => setManual((current) => ({ ...current, source: event.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="press-manual-date">{t("admin.releases.publishedOn")}</Label>
              <Input
                id="press-manual-date"
                type="date"
                value={manual.publishedAt}
                onChange={(event) => setManual((current) => ({ ...current, publishedAt: event.target.value }))}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="press-manual-image">{t("admin.press.image")}</Label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  id="press-manual-image"
                  value={manual.imageUrl}
                  onChange={(event) => setManual((current) => ({ ...current, imageUrl: event.target.value }))}
                  placeholder="https://res.cloudinary.com/..."
                  dir="ltr"
                />
                <label className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md border border-border px-3 text-xs font-semibold transition-colors hover:border-primary/50">
                  {uploadingThumb ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : <ImagePlus className="h-3.5 w-3.5" aria-hidden />}
                  {t("admin.thumb.upload")}
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      setUploadingThumb(true);
                      const targetUrl = url.trim();
                      void uploadFile(file, "image")
                        .then((uploaded) => setManual((current) => ({ ...current, imageUrl: uploaded })))
                        .finally(() => setUploadingThumb(false));
                      void targetUrl;
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button size="sm" onClick={() => void publish()} disabled={!manual.title.trim() || !url.trim()} className="gap-1.5">
              <Check className="h-3.5 w-3.5" aria-hidden />
              {t("admin.press.publish")}
            </Button>
            {published ? <span className="text-xs font-semibold text-primary">{t("admin.press.published")}</span> : null}
          </div>
        </div>
        {error ? (
          <p role="alert" className="mt-3 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {t("admin.press.error")}
          </p>
        ) : null}

        {preview ? (
          <div className="mt-4 overflow-hidden rounded-md border border-border">
            <div className="grid gap-4 p-4 sm:grid-cols-[200px_minmax(0,1fr)]">
              <div className="relative aspect-[16/10] overflow-hidden rounded bg-muted">
                {preview.image ? (
                  <Image src={preview.image} alt="" fill sizes="200px" className="object-cover" unoptimized />
                ) : (
                  <span className="grid h-full place-items-center text-muted-foreground">
                    <ImagePlus className="h-6 w-6" aria-hidden />
                  </span>
                )}
              </div>
              <div>
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-primary">{preview.siteName}</p>
                <h3 className="mt-1 text-base font-semibold leading-snug text-foreground">{preview.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{preview.description}</p>
                <p className="mt-2 break-all text-xs text-muted-foreground" dir="ltr">
                  {preview.url}
                </p>
              </div>
            </div>
            <div className="border-t border-border px-4 py-3">
              <Label htmlFor="press-thumb">{t("admin.thumb.override")}</Label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  id="press-thumb"
                  value={customImage}
                  onChange={(event) => setCustomImage(event.target.value)}
                  placeholder={preview.image ?? "https://res.cloudinary.com/..."}
                  dir="ltr"
                />
                <label className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md border border-border px-3 text-xs font-semibold transition-colors hover:border-primary/50">
                  {uploadingThumb ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : <ImagePlus className="h-3.5 w-3.5" aria-hidden />}
                  {t("admin.thumb.upload")}
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      setUploadingThumb(true);
                      void uploadFile(file, "image")
                        .then((uploaded) => setCustomImage(uploaded))
                        .finally(() => setUploadingThumb(false));
                    }}
                  />
                </label>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 border-t border-border bg-muted/40 px-4 py-3">
              <Button size="sm" onClick={() => void publish()} className="gap-1.5">
                <Check className="h-3.5 w-3.5" aria-hidden />
                {t("admin.press.publish")}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setPreview(null)}>
                {t("common.cancel")}
              </Button>
              {published ? <span className="text-xs font-semibold text-primary">{t("admin.press.published")}</span> : null}
            </div>
          </div>
        ) : null}
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">{t("nav.coverage")}</h2>
        <ul className="mt-3 divide-y divide-border rounded-lg border border-border bg-card">
          {articles.map((article) => (
            <li key={article.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{tx(article.title)}</p>
                <p className="text-xs text-muted-foreground">
                  {article.source} · {formatShortDate(article.publishedAt, lang)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  {t("coverage.readOriginal")}
                  <ExternalLink className="h-3 w-3" aria-hidden />
                </a>
                <button
                  type="button"
                  onClick={() => void removeItem(article.id)}
                  className="inline-flex items-center gap-1 rounded-md border border-destructive/40 px-2 py-1 text-[0.7rem] font-semibold text-destructive transition-colors hover:bg-destructive/10"
                >
                  <Trash2 className="h-3 w-3" aria-hidden />
                  {t("admin.delete")}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function InquiriesPanel({ inquiries }: { inquiries: RecruiterInquiry[] }) {
  const { t, lang } = useI18n();

  if (inquiries.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-card/60 px-5 py-10 text-center text-sm text-muted-foreground">
        {t("admin.inquiries.empty")}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">{t("admin.inquiries.title")}</h2>
      {inquiries.map((inquiry) => (
        <article key={inquiry.id} className="rounded-lg border border-border bg-card p-5 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-foreground">
              {inquiry.company}
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                {formatShortDate(inquiry.createdAt, lang)}
              </span>
            </p>
            <Badge variant={inquiry.status === "new" ? "secondary" : "muted"}>{inquiry.status}</Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("admin.inquiries.from")}: {inquiry.recruiterName} ·{" "}
            <a href={`mailto:${inquiry.email}`} className="link-underline" dir="ltr">
              {inquiry.email}
            </a>
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {t("admin.inquiries.member")}: {inquiry.memberName}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-foreground">{inquiry.message}</p>
        </article>
      ))}
    </div>
  );
}

function PostsPanel({ posts, onPublished, onDeleted }: { posts: CmsPost[]; onPublished: (post: CmsPost) => void; onDeleted?: (id: string) => void }) {
  const { t, lang, tx } = useI18n();
  const { settings, save } = useSiteSettings();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingSlug, setEditingSlug] = useState<string>("");
  const [removed, setRemoved] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [published, setPublished] = useState(false);
  const [form, setForm] = useState({
    category: POST_CATEGORIES[0],
    titleBn: "",
    titleEn: "",
    subheadlineBn: "",
    subheadlineEn: "",
    excerptBn: "",
    excerptEn: "",
    bodyBn: "",
    bodyEn: "",
    coverImageUrl: "",
  });
  const [preview, setPreview] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  function startEdit(post: CmsPost) {
    setEditingId(post.id);
    setEditingSlug(post.slug);
    setForm({
      category: post.category,
      titleBn: post.title.bn,
      titleEn: post.title.en,
      subheadlineBn: post.subheadline?.bn ?? "",
      subheadlineEn: post.subheadline?.en ?? "",
      excerptBn: post.excerpt.bn,
      excerptEn: post.excerpt.en,
      bodyBn: post.body.map((paragraph) => paragraph.bn).join("\n\n"),
      bodyEn: post.body.map((paragraph) => paragraph.en).join("\n\n"),
      coverImageUrl: post.coverImageUrl,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  async function removePost(id: string) {
    if (!window.confirm(t("admin.delete.confirm"))) return;
    await save({ ...settings, deletedIds: { ...settings.deletedIds, articles: [...(settings.deletedIds?.articles ?? []), id] } });
    try {
      const { deleteDoc, doc } = await import("firebase/firestore");
      const { getFirebaseDb, isFirebaseConfigured } = await import("@/lib/firebase");
      if (isFirebaseConfigured) {
        await deleteDoc(doc(getFirebaseDb(), "cms_posts", id));
      }
    } catch {
      /* seeded item: hiding via deletedIds is enough */
    }
    setRemoved((current) => [...current, id]);
    onDeleted?.(id);
  }

  async function publish(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    try {
      const post: CmsPost = {
        id: editingId ?? `post-${Date.now()}`,
        slug:
          editingSlug ||
          `${form.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "resource"}-${Date.now()
          .toString()
          .slice(-4)}`,
        category: form.category,
        title: { bn: form.titleBn || form.titleEn, en: form.titleEn || form.titleBn },
        subheadline: { bn: form.subheadlineBn || form.subheadlineEn, en: form.subheadlineEn || form.subheadlineBn },
        excerpt: { bn: form.excerptBn || form.excerptEn, en: form.excerptEn || form.excerptBn },
        body: [
          { bn: form.bodyBn || form.bodyEn, en: form.bodyEn || form.bodyBn },
        ].filter((paragraph) => paragraph.en.trim().length > 0),
        coverImageUrl:
          form.coverImageUrl ||
          "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1600&q=80",
        author: "Association secretariat",
        publishedAt: new Date().toISOString(),
        readingMinutes: 3,
        tags: [form.category],
        featured: false,
      };
      await addPost(post);
      onPublished(post);
      setPublished(true);
      setForm({
        category: POST_CATEGORIES[0],
        titleBn: "",
        titleEn: "",
        subheadlineBn: "",
        subheadlineEn: "",
        excerptBn: "",
        excerptEn: "",
        bodyBn: "",
        bodyEn: "",
        coverImageUrl: "",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="rounded-lg border border-border bg-card p-5 shadow-card">
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">{t("admin.posts.title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("admin.posts.subtitle")}</p>

        <form onSubmit={publish} className="mt-4 space-y-3">
          <div>
            <Label htmlFor="post-category">{t("admin.posts.category")}</Label>
            <Select
              id="post-category"
              value={form.category}
              onChange={(event) => setForm((current) => ({ ...current, category: event.target.value as CmsPost["category"] }))}
            >
              {POST_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {t(categoryKey(category))}
                </option>
              ))}
            </Select>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="titleBn">{t("admin.posts.titleB")}</Label>
              <Input
                id="titleBn"
                value={form.titleBn}
                onChange={(event) => setForm((current) => ({ ...current, titleBn: event.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="titleEn">{t("admin.posts.titleE")}</Label>
              <Input
                id="titleEn"
                value={form.titleEn}
                onChange={(event) => setForm((current) => ({ ...current, titleEn: event.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="subheadlineBn">{t("articles.subheadlineBn")}</Label>
              <Input id="subheadlineBn" value={form.subheadlineBn} onChange={(event) => setForm((current) => ({ ...current, subheadlineBn: event.target.value }))} />
            </div>
            <div>
              <Label htmlFor="subheadlineEn">{t("articles.subheadlineEn")}</Label>
              <Input id="subheadlineEn" value={form.subheadlineEn} onChange={(event) => setForm((current) => ({ ...current, subheadlineEn: event.target.value }))} />
            </div>
            <div>
              <Label htmlFor="excerptBn">{t("admin.posts.excerptB")}</Label>
              <Textarea
                id="excerptBn"
                rows={2}
                value={form.excerptBn}
                onChange={(event) => setForm((current) => ({ ...current, excerptBn: event.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="excerptEn">{t("admin.posts.excerptE")}</Label>
              <Textarea
                id="excerptEn"
                rows={2}
                value={form.excerptEn}
                onChange={(event) => setForm((current) => ({ ...current, excerptEn: event.target.value }))}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="coverImageUrl">{t("articles.cover")}</Label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  id="coverImageUrl"
                  value={form.coverImageUrl}
                  onChange={(event) => setForm((current) => ({ ...current, coverImageUrl: event.target.value }))}
                  placeholder="https://res.cloudinary.com/..."
                  dir="ltr"
                />
                <label className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md border border-border px-3 text-xs font-semibold transition-colors hover:border-primary/50">
                  {uploadingCover ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : <ImagePlus className="h-3.5 w-3.5" aria-hidden />}
                  {t("dashboard.upload.choose")}
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      setUploadingCover(true);
                      void uploadFile(file, "image")
                        .then((uploaded) => setForm((current) => ({ ...current, coverImageUrl: uploaded })))
                        .finally(() => setUploadingCover(false));
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="sm:col-span-2">
              <div className="mb-2 flex flex-wrap items-center gap-1.5">
                {[
                  { label: "## " + t("articles.toolbar.h2"), snippet: "\n## Subheading\n" },
                  { label: "B", snippet: " **bold text** " },
                  { label: "• " + t("articles.toolbar.bullets"), snippet: "\n- first point\n- second point\n" },
                  { label: "1. " + t("articles.toolbar.numbered"), snippet: "\n1. first step\n2. second step\n" },
                  {
                    label: "| " + t("articles.toolbar.table"),
                    snippet: "\n| Column | Column |\n| --- | --- |\n| Value | Value |\n",
                  },
                ].map((tool) => (
                  <button
                    key={tool.label}
                    type="button"
                    onClick={() => setForm((current) => ({ ...current, bodyEn: `${current.bodyEn}${tool.snippet}` }))}
                    className="rounded-md border border-border px-2 py-1 text-[0.7rem] font-semibold text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                  >
                    {tool.label}
                  </button>
                ))}
                <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border px-2 py-1 text-[0.7rem] font-semibold text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground">
                  <ImagePlus className="h-3 w-3" aria-hidden />
                  {t("articles.toolbar.image")}
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      void uploadFile(file, "image").then((uploaded) =>
                        setForm((current) => ({ ...current, bodyEn: `${current.bodyEn}\n![image](${uploaded})\n` })),
                      );
                    }}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setPreview((value) => !value)}
                  className="ml-auto rounded-md border border-primary/40 px-2 py-1 text-[0.7rem] font-semibold text-primary"
                >
                  {preview ? t("articles.edit") : t("articles.preview")}
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="bodyBn">{t("admin.posts.bodyB")}</Label>
                  <Textarea
                    id="bodyBn"
                    rows={10}
                    value={form.bodyBn}
                    onChange={(event) => setForm((current) => ({ ...current, bodyBn: event.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="bodyEn">{t("articles.body")}</Label>
                  {preview ? (
                    <div className="max-h-72 overflow-y-auto rounded-md border border-border bg-background p-3">
                      <Markdown text={form.bodyEn || form.bodyBn} />
                    </div>
                  ) : (
                    <Textarea
                      id="bodyEn"
                      rows={10}
                      value={form.bodyEn}
                      onChange={(event) => setForm((current) => ({ ...current, bodyEn: event.target.value }))}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={busy} className="gap-1.5">
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : <Check className="h-3.5 w-3.5" aria-hidden />}
              {busy ? t("admin.posts.publishing") : t("admin.posts.create")}
            </Button>
            {published ? <span className="text-xs font-semibold text-primary">{t("admin.posts.published")}</span> : null}
          </div>
        </form>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">{t("nav.programs")}</h2>
        <ul className="mt-3 divide-y divide-border rounded-lg border border-border bg-card">
          {posts
            .filter((post) => !removed.includes(post.id))
            .map((post) => (
              <li key={post.id} className="px-4 py-3">
                <p className="text-sm font-medium text-foreground">{tx(post.title)}</p>
                <p className="text-xs text-muted-foreground">
                  {t(categoryKey(post.category))} - {formatShortDate(post.publishedAt, lang)}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(post)}
                    className="rounded-md border border-border px-2 py-1 text-[0.7rem] font-semibold text-foreground transition-colors hover:border-primary/50"
                  >
                    {editingId === post.id ? "Editing" : "Edit"}
                  </button>
                  <button
                    type="button"
                    onClick={() => void removePost(post.id)}
                    className="inline-flex items-center gap-1 rounded-md border border-destructive/40 px-2 py-1 text-[0.7rem] font-semibold text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3 w-3" aria-hidden />
                    {t("admin.delete")}
                  </button>
                </div>
              </li>
            ))}        </ul>
      </section>
    </div>
  );
}

type ReleaseForm = {
  titleBn: string;
  titleEn: string;
  subheadlineBn: string;
  subheadlineEn: string;
  excerptBn: string;
  excerptEn: string;
  bodyBn: string;
  bodyEn: string;
  refNo: string;
  imageUrl: string;
};

const EMPTY_RELEASE_FORM: ReleaseForm = {
  titleBn: "",
  titleEn: "",
  subheadlineBn: "",
  subheadlineEn: "",
  excerptBn: "",
  excerptEn: "",
  bodyBn: "",
  bodyEn: "",
  refNo: "",
  imageUrl: "",
};

/**
 * Facebook press releases.
 *
 * Facebook usually answers server-side requests with a login wall, so the
 * preview is best-effort: when it fails the admin still gets the same form and
 * can type the headline and upload the thumbnail (Cloudinary in production,
 * object URL in demo mode) before publishing.
 */
function PressReleasePanel({
  releases,
  onPublished,
  onDeleted,
}: {
  releases: PressRelease[];
  onPublished: (release: PressRelease) => void;
  onDeleted?: (id: string) => void;
}) {
  const { t, lang, tx } = useI18n();
  const { settings, save } = useSiteSettings();
  const [url, setUrl] = useState("");
  const [removed, setRemoved] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingSlug, setEditingSlug] = useState("");
  function startEdit(release: PressRelease) {
    setEditingId(release.id);
    setEditingSlug(release.slug);
    setUrl(release.url);
    setForm({
      titleBn: release.title.bn,
      titleEn: release.title.en,
      subheadlineBn: release.subheadline?.bn ?? "",
      subheadlineEn: release.subheadline?.en ?? "",
      excerptBn: release.excerpt.bn,
      excerptEn: release.excerpt.en,
      bodyBn: release.body.map((paragraph) => paragraph.bn).join(String.fromCharCode(10, 10)),
      bodyEn: release.body.map((paragraph) => paragraph.en).join(String.fromCharCode(10, 10)),
      refNo: release.refNo ?? "",
      imageUrl: release.imageUrl,
    });
  }

  async function removeRelease(id: string) {
    if (!window.confirm(t("admin.delete.confirm"))) return;
    await save({ ...settings, deletedIds: { ...settings.deletedIds, releases: [...(settings.deletedIds?.releases ?? []), id] } });
    setRemoved((current) => [...current, id]);
    onDeleted?.(id);
  }
  const [form, setForm] = useState<ReleaseForm>(EMPTY_RELEASE_FORM);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [failed, setFailed] = useState(false);
  const [published, setPublished] = useState(false);

  async function fetchPreview() {
    setBusy(true);
    setFailed(false);
    setBlocked(false);
    setPublished(false);
    try {
      const response = await fetch("/api/link-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const payload = (await response.json()) as {
        ok: boolean;
        code?: string;
        data?: { title: string; description: string; image: string | null };
      };

      if (!payload.ok || !payload.data) {
        if (payload.code === "blocked" || response.status === 422) {
          setBlocked(true);
          setForm((current) => ({ ...current, imageUrl: current.imageUrl }));
        } else {
          setFailed(true);
        }
        return;
      }

      setForm({
        titleBn: payload.data.title,
        titleEn: payload.data.title,
        subheadlineBn: "",
        subheadlineEn: "",
        excerptBn: payload.data.description,
        excerptEn: payload.data.description,
        bodyBn: "",
        bodyEn: "",
        refNo: "",
        imageUrl: payload.data.image ?? "",
      });
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  async function handleUpload(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const uploaded = await uploadFile(file, "image");
      setForm((current) => ({ ...current, imageUrl: uploaded }));
    } finally {
      setUploading(false);
    }
  }

  async function publish(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const release: PressRelease = {
      id: editingId ?? `release-${Date.now()}`,
      slug: editingSlug || (form.titleEn || form.titleBn).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `statement-${Date.now()}`,
      title: { bn: form.titleBn || form.titleEn, en: form.titleEn || form.titleBn },
      subheadline: { bn: form.subheadlineBn || form.subheadlineEn, en: form.subheadlineEn || form.subheadlineBn },
      excerpt: { bn: form.excerptBn || form.excerptEn, en: form.excerptEn || form.excerptBn },
      body: (form.bodyBn || form.bodyEn)
        ? [{ bn: form.bodyBn || form.bodyEn, en: form.bodyEn || form.bodyBn }]
        : [{ bn: form.excerptBn || form.excerptEn, en: form.excerptEn || form.excerptBn }],
      refNo: form.refNo || undefined,
      url: url.trim(),
      imageUrl: form.imageUrl,
      publishedAt: new Date().toISOString(),
    };
    await addPressRelease(release);
    onPublished(release);
    setPublished(true);
    setForm(EMPTY_RELEASE_FORM);
    setUrl("");
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-card p-5 shadow-card">
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {t("admin.releases.title")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("admin.releases.subtitle")}</p>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Input
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://www.facebook.com/MediaVideoEditorsAssociation/posts/…"
            dir="ltr"
            aria-label={t("admin.releases.urlLabel")}
          />
          <Button onClick={() => void fetchPreview()} disabled={busy || !url.trim()} className="gap-2 sm:w-52">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <FacebookIcon className="h-4 w-4" />}
            {busy ? t("admin.releases.fetching") : t("admin.releases.fetch")}
          </Button>
        </div>

        {blocked ? (
          <p role="status" className="mt-3 rounded-md border border-secondary/40 bg-secondary/10 px-3 py-2 text-sm text-foreground">
            {t("admin.releases.blocked")}
          </p>
        ) : null}
        {failed ? (
          <p role="alert" className="mt-3 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {t("admin.press.error")}
          </p>
        ) : null}

        <form onSubmit={publish} className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="release-title-bn">{t("admin.releases.headlineBn")}</Label>
                <Input
                  id="release-title-bn"
                  value={form.titleBn}
                  onChange={(event) => setForm((current) => ({ ...current, titleBn: event.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="release-title-en">{t("admin.releases.headlineEn")}</Label>
                <Input
                  id="release-title-en"
                  value={form.titleEn}
                  onChange={(event) => setForm((current) => ({ ...current, titleEn: event.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="release-sub-bn">{t("admin.releases.subheadlineBn")}</Label>
                <Textarea id="release-sub-bn" rows={2} value={form.subheadlineBn} onChange={(event) => setForm((current) => ({ ...current, subheadlineBn: event.target.value }))} />
              </div>
              <div>
                <Label htmlFor="release-sub-en">{t("admin.releases.subheadlineEn")}</Label>
                <Textarea id="release-sub-en" rows={2} value={form.subheadlineEn} onChange={(event) => setForm((current) => ({ ...current, subheadlineEn: event.target.value }))} />
              </div>
              <div>
                <Label htmlFor="release-ref">{t("admin.releases.refNo")}</Label>
                <Input id="release-ref" value={form.refNo} onChange={(event) => setForm((current) => ({ ...current, refNo: event.target.value }))} placeholder="MVEA/PR/2026-03" dir="ltr" />
              </div>
              <div>
                <Label htmlFor="release-excerpt-bn">{t("admin.releases.excerptBn")}</Label>
                <Textarea
                  id="release-excerpt-bn"
                  rows={2}
                  value={form.excerptBn}
                  onChange={(event) => setForm((current) => ({ ...current, excerptBn: event.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="release-excerpt-en">{t("admin.releases.excerptEn")}</Label>
                <Textarea
                  id="release-excerpt-en"
                  rows={2}
                  value={form.excerptEn}
                  onChange={(event) => setForm((current) => ({ ...current, excerptEn: event.target.value }))}
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="release-body-bn">{t("admin.releases.bodyBn")}</Label>
                <Textarea id="release-body-bn" rows={6} value={form.bodyBn} onChange={(event) => setForm((current) => ({ ...current, bodyBn: event.target.value }))} />
              </div>
              <div>
                <Label htmlFor="release-body-en">{t("admin.releases.bodyEn")}</Label>
                <Textarea id="release-body-en" rows={6} value={form.bodyEn} onChange={(event) => setForm((current) => ({ ...current, bodyEn: event.target.value }))} />
              </div>
            </div>
            <div>
              <Label htmlFor="release-image">{t("admin.releases.image")}</Label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  id="release-image"
                  value={form.imageUrl}
                  onChange={(event) => setForm((current) => ({ ...current, imageUrl: event.target.value }))}
                  placeholder="/logo.svg"
                  dir="ltr"
                />
                <label className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md border border-border px-3 text-xs font-semibold text-foreground transition-colors hover:border-primary/50">
                  {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : <ImagePlus className="h-3.5 w-3.5" aria-hidden />}
                  {t("admin.releases.upload")}
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(event) => void handleUpload(event.target.files?.[0])}
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" disabled={busy || !form.titleBn.trim() || !url.trim()} className="gap-1.5">
                <Check className="h-3.5 w-3.5" aria-hidden />
                {t("admin.releases.publish")}
              </Button>
              {published ? <span className="text-xs font-semibold text-primary">{t("admin.releases.published")}</span> : null}
            </div>
          </div>

          <div>
            <span className="mb-1.5 block text-sm font-medium text-foreground">{t("admin.press.image")}</span>
            <div className="relative aspect-[16/9] overflow-hidden rounded-md border border-border bg-muted">
              {form.imageUrl ? (
                <Image src={form.imageUrl} alt="" fill sizes="220px" className="object-cover" unoptimized />
              ) : (
                <span className="grid h-full place-items-center">
                  <span className="grid h-16 w-16 place-items-center overflow-hidden rounded-full bg-white ring-1 ring-border">
                    <Image src={LOGO_SRC} alt="" width={64} height={64} className="h-16 w-16 object-contain p-[8%]" unoptimized />
                  </span>
                </span>
              )}
            </div>
          </div>
        </form>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {t("releases.title")}
        </h2>
        {releases.length === 0 ? (
          <p className="mt-3 rounded-lg border border-dashed border-border bg-card/60 px-5 py-8 text-center text-sm text-muted-foreground">
            {t("admin.releases.empty")}
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-border rounded-lg border border-border bg-card">
            {releases.filter((release) => !removed.includes(release.id)).map((release) => (
              <li key={release.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{tx(release.title)}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("releases.badge")} · {formatShortDate(release.publishedAt, lang)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={release.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    {t("releases.open")}
                    <ExternalLink className="h-3 w-3" aria-hidden />
                  </a>
                  <button
                    type="button"
                    onClick={() => startEdit(release)}
                    className="rounded-md border border-border px-2 py-1 text-[0.7rem] font-semibold text-foreground transition-colors hover:border-primary/50"
                  >
                    {editingId === release.id ? "Editing" : "Edit"}
                  </button>
                  <button
                    type="button"
                    onClick={() => void removeRelease(release.id)}
                    className="inline-flex items-center gap-1 rounded-md border border-destructive/40 px-2 py-1 text-[0.7rem] font-semibold text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3 w-3" aria-hidden />
                    {t("admin.delete")}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
/**
 * Member portrait management.
 *
 * Uploads go through the unsigned Cloudinary preset (`uploadFile`) and the
 * returned URL is written to Firestore `members/{slug}` with `merge: true`, so a
 * record that only exists in `seed.ts` gains a portrait document without losing
 * the rest of its data. The local photo context updates immediately, which is
 * what refreshes `/members`, the profile, the CV, `/committee` and the homepage
 * leadership cards.
 */
function MemberPhotosPanel({ members }: { members: Member[] }) {
  const { t, lang } = useI18n();
  const { setPhoto } = useMemberPhotos();
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [error, setError] = useState(false);

  async function upload(member: Member, file: File | undefined) {
    if (!file) return;
    setBusyId(member.id);
    setError(false);
    setSavedId(null);
    try {
      const url = await uploadFile(file, "image");
      await saveMemberPhoto({ key: member.slug, memberId: member.id, photoUrl: url });
      setPhoto(member.slug, url);
      setSavedId(member.id);
      window.setTimeout(() => setSavedId(null), 2000);
    } catch {
      setError(true);
    } finally {
      setBusyId(null);
    }
  }

  const needle = query.trim().toLowerCase();
  const list = needle
    ? members.filter((member) =>
        [member.fullNameEn, member.fullNameBn, member.mediaHouse].join(" ").toLowerCase().includes(needle),
      )
    : members;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {t("dashboard.field.photo")}
        </h2>
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("members.search")}
          aria-label={t("members.search")}
          className="h-9 w-full sm:w-64"
        />
      </div>

      {error ? (
        <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {t("dashboard.upload.error")}
        </p>
      ) : null}

      <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
        {list.map((member) => (
          <li key={member.id} className="flex flex-wrap items-center gap-3 px-4 py-2.5">
            <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted text-xs text-primary ring-1 ring-border">
              <Avatar
                name={lang === "bn" ? member.fullNameBn : member.fullNameEn}
                src={member.photoUrl}
                slug={member.slug}
                memberId={member.id}
                sizes="40px"
                textClassName="text-[0.65rem]"
              />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {lang === "bn" ? member.fullNameBn : member.fullNameEn}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {member.membershipId} · {member.mediaHouse}
              </p>
            </div>
            <label className="inline-flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-md border border-border px-2.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/50">
              {busyId === member.id ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
              ) : (
                <ImagePlus className="h-3.5 w-3.5" aria-hidden />
              )}
              {busyId === member.id ? t("dashboard.upload.busy") : t("dashboard.upload.choose")}
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                disabled={busyId !== null}
                onChange={(event) => void upload(member, event.target.files?.[0])}
              />
            </label>
            {savedId === member.id ? (
              <span className="text-xs font-semibold text-primary">{t("admin.ranking.saved")}</span>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
/** Recruiter requests: status workflow plus the official reply template. */
function HireRequestsPanel() {
  const { t, lang } = useI18n();
  const [items, setItems] = useState<HireRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void listHireRequests()
      .then((records) => {
        if (!cancelled) setItems(records);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function changeStatus(id: string, status: HireRequest["status"]) {
    await setHireStatus(id, status);
    setItems((current) => current.map((item) => (item.id === id ? { ...item, status } : item)));
  }

  function reply(item: HireRequest) {
    const subject = `MVEA verification - ${item.organization}`;
    const body = officialReplyBody(item);
    window.location.href = `mailto:${item.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  async function copy(item: HireRequest) {
    try {
      await navigator.clipboard.writeText(officialReplyBody(item));
      setCopiedId(item.id);
      window.setTimeout(() => setCopiedId(null), 1800);
    } catch {
      /* clipboard blocked */
    }
  }

  if (loading) {
    return (
      <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        {t("admin.loading")}
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-card/60 px-5 py-10 text-center text-sm text-muted-foreground">
        {t("admin.inquiries.empty")}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">{t("hire.cta")}</h2>
      {items.map((item) => (
        <article key={item.id} className="rounded-lg border border-border bg-card p-5 shadow-card">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">{item.organization}</p>
              <p className="text-xs text-muted-foreground">
                {item.requesterName} · {item.requesterRole} · {formatShortDate(item.createdAt, lang)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground" dir="ltr">
                {item.email} · {item.phone}
              </p>
            </div>
            <Select
              value={item.status}
              onChange={(event) => void changeStatus(item.id, event.target.value as HireRequest["status"])}
              aria-label={t("verify.status")}
              className="h-8 w-44 text-xs"
            >
              <option value="pending">Pending</option>
              <option value="availability-checked">Availability checked</option>
              <option value="email-sent">Official email sent</option>
            </Select>
          </div>

          <dl className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-muted-foreground">{t("hire.forMember")}</dt>
              <dd className="text-foreground">{item.memberName || "—"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-muted-foreground">{t("hire.engagement")}</dt>
              <dd className="text-foreground">{item.engagement}</dd>
            </div>
          </dl>

          {item.note ? <p className="mt-2 text-sm leading-relaxed text-foreground/90">{item.note}</p> : null}

          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border/70 pt-3">
            <Button size="sm" onClick={() => reply(item)} className="gap-1.5">
              <Send className="h-3.5 w-3.5" aria-hidden />
              Send official verification email
            </Button>
            <Button size="sm" variant="outline" onClick={() => void copy(item)} className="gap-1.5">
              {copiedId === item.id ? <Check className="h-3.5 w-3.5 text-primary" aria-hidden /> : <FileText className="h-3.5 w-3.5" aria-hidden />}
              {copiedId === item.id ? t("pressrelease.copied") : t("pressrelease.copy")}
            </Button>
            <span className="ml-auto font-mono text-[0.65rem] text-muted-foreground">{item.id}</span>
          </div>
        </article>
      ))}
    </div>
  );
}
