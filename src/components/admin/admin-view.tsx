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
  ShieldAlert,
  Users,
  X,
} from "lucide-react";

import { FacebookIcon } from "@/components/brand-icons";
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
import { uploadFile } from "@/lib/upload";
import {
  addPost,
  addPressArticle,
  addPressRelease,
  listApplications,
  listPressReleases,
  listInquiries,
  nextMembershipId,
  readHeroOverrides,
  readPostOverrides,
  readPressOverrides,
  readRankOverrides,
  reviewApplication,
  setHeroVisibility as persistHeroVisibility,
  setMemberRank,
} from "@/lib/store/admin-store";
import type {
  CmsPost,
  HeroSlide,
  Member,
  MembershipApplication,
  PressArticle,
  PressRelease,
  RecruiterInquiry,
} from "@/lib/types";
import { cn } from "@/lib/utils";

type Tab = "overview" | "applications" | "ranking" | "press" | "releases" | "inquiries" | "hero" | "posts";

const TABS: Array<{ id: Tab; key: TranslationKey }> = [
  { id: "overview", key: "admin.tab.overview" },
  { id: "applications", key: "admin.tab.applications" },
  { id: "ranking", key: "admin.tab.ranking" },
  { id: "press", key: "admin.tab.press" },
  { id: "releases", key: "admin.tab.releases" },
  { id: "inquiries", key: "admin.tab.inquiries" },
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
  const { t, lang } = useI18n();
  const { user, ready, logout, mode } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");

  const [applications, setApplications] = useState<MembershipApplication[]>([]);
  const [inquiries, setInquiries] = useState<RecruiterInquiry[]>([]);
  const [pressOverrides, setPressOverrides] = useState<PressArticle[]>([]);
  const [releaseOverrides, setReleaseOverrides] = useState<PressRelease[]>([]);
  const [postOverrides, setPostOverrides] = useState<CmsPost[]>([]);
  const [rankOverrides, setRankOverrides] = useState<Record<string, number>>({});
  const [heroVisibility, setHeroVisibility] = useState<Record<string, boolean>>({});
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
      setHeroVisibility(readHeroOverrides().visibility);
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
            <RankingPanel members={rankedMembers} onRanksChanged={setRankOverrides} />
          ) : null}

          {tab === "press" ? (
            <PressPanel
              articles={allPress}
              onPublished={(article) => setPressOverrides((current) => [article, ...current])}
            />
          ) : null}

          {tab === "releases" ? (
            <PressReleasePanel
              releases={[...releaseOverrides]}
              onPublished={(release) => setReleaseOverrides((current) => [release, ...current])}
            />
          ) : null}

          {tab === "inquiries" ? <InquiriesPanel inquiries={inquiries} /> : null}

          {tab === "hero" ? (
            <HeroPanel
              slides={heroSlides}
              visibility={heroVisibility}
              onToggle={async (id, visible) => {
                await persistHeroVisibility(id, visible);
                setHeroVisibility((current) => ({ ...current, [id]: visible }));
              }}
              lang={lang}
            />
          ) : null}

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
}: {
  articles: PressArticle[];
  onPublished: (article: PressArticle) => void;
}) {
  const { t, lang, tx } = useI18n();
  const [url, setUrl] = useState("");
  const [preview, setPreview] = useState<OgPreview | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [published, setPublished] = useState(false);

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
    } catch {
      setPreview(null);
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  async function publish() {
    if (!preview) return;
    const article: PressArticle = {
      id: `press-${Date.now()}`,
      title: { bn: preview.title, en: preview.title },
      excerpt: { bn: preview.description, en: preview.description },
      source: preview.siteName,
      url: preview.url,
      imageUrl: preview.image ?? "",
      publishedAt: preview.publishedAt ?? new Date().toISOString(),
      featured: false,
    };
    await addPressArticle(article);
    onPublished(article);
    setPublished(true);
    setPreview(null);
    setUrl("");
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
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                {t("coverage.readOriginal")}
                <ExternalLink className="h-3 w-3" aria-hidden />
              </a>
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

function HeroPanel({
  slides,
  visibility,
  onToggle,
  lang,
}: {
  slides: HeroSlide[];
  visibility: Record<string, boolean>;
  onToggle: (id: string, visible: boolean) => Promise<void>;
  lang: "bn" | "en";
}) {
  const { t, tx } = useI18n();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">{t("admin.hero.title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("admin.hero.subtitle")}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {slides.map((slide) => {
          const visible = visibility[slide.id] ?? slide.visible;
          return (
            <article key={slide.id} className="overflow-hidden rounded-lg border border-border bg-card shadow-card">
              <div className="relative aspect-[16/9] bg-muted">
                <Image src={slide.imageUrl} alt="" fill sizes="400px" className="object-cover" />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold leading-snug text-foreground">{tx(slide.title)}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{tx(slide.subtitle)}</p>
                <div className="mt-3 flex items-center justify-between">
                  <Badge variant={visible ? "default" : "outline"}>
                    {visible ? t("admin.hero.visible") : t("admin.hero.hidden")}
                  </Badge>
                  <Button size="sm" variant="outline" onClick={() => void onToggle(slide.id, !visible)}>
                    {visible ? t("admin.hero.hidden") : t("admin.hero.visible")}
                  </Button>
                </div>
                <p className="mt-2 text-[0.7rem] text-muted-foreground" lang={lang === "bn" ? "bn" : "en"}>
                  #{slide.order}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function PostsPanel({ posts, onPublished }: { posts: CmsPost[]; onPublished: (post: CmsPost) => void }) {
  const { t, lang, tx } = useI18n();
  const [busy, setBusy] = useState(false);
  const [published, setPublished] = useState(false);
  const [form, setForm] = useState({
    category: POST_CATEGORIES[0],
    titleBn: "",
    titleEn: "",
    excerptBn: "",
    excerptEn: "",
    bodyBn: "",
    bodyEn: "",
  });

  async function publish(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    try {
      const post: CmsPost = {
        id: `post-${Date.now()}`,
        slug: `${form.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "resource"}-${Date.now()
          .toString()
          .slice(-4)}`,
        category: form.category,
        title: { bn: form.titleBn || form.titleEn, en: form.titleEn || form.titleBn },
        excerpt: { bn: form.excerptBn || form.excerptEn, en: form.excerptEn || form.excerptBn },
        body: [
          { bn: form.bodyBn || form.bodyEn, en: form.bodyEn || form.bodyBn },
        ].filter((paragraph) => paragraph.en.trim().length > 0),
        coverImageUrl: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1600&q=80",
        author: "Association secretariat",
        publishedAt: new Date().toISOString(),
        readingMinutes: 3,
        tags: [form.category],
        featured: false,
      };
      await addPost(post);
      onPublished(post);
      setPublished(true);
      setForm({ category: POST_CATEGORIES[0], titleBn: "", titleEn: "", excerptBn: "", excerptEn: "", bodyBn: "", bodyEn: "" });
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
            <div>
              <Label htmlFor="bodyBn">{t("admin.posts.bodyB")}</Label>
              <Textarea
                id="bodyBn"
                rows={4}
                value={form.bodyBn}
                onChange={(event) => setForm((current) => ({ ...current, bodyBn: event.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="bodyEn">{t("admin.posts.bodyE")}</Label>
              <Textarea
                id="bodyEn"
                rows={4}
                value={form.bodyEn}
                onChange={(event) => setForm((current) => ({ ...current, bodyEn: event.target.value }))}
              />
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
          {posts.map((post) => (
            <li key={post.id} className="px-4 py-3">
              <p className="text-sm font-medium text-foreground">{tx(post.title)}</p>
              <p className="text-xs text-muted-foreground">
                {t(categoryKey(post.category))} · {formatShortDate(post.publishedAt, lang)}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

type ReleaseForm = {
  titleBn: string;
  titleEn: string;
  excerptBn: string;
  excerptEn: string;
  imageUrl: string;
};

const EMPTY_RELEASE_FORM: ReleaseForm = {
  titleBn: "",
  titleEn: "",
  excerptBn: "",
  excerptEn: "",
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
}: {
  releases: PressRelease[];
  onPublished: (release: PressRelease) => void;
}) {
  const { t, lang, tx } = useI18n();
  const [url, setUrl] = useState("");
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
        excerptBn: payload.data.description,
        excerptEn: payload.data.description,
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
      id: `release-${Date.now()}`,
      title: { bn: form.titleBn || form.titleEn, en: form.titleEn || form.titleBn },
      excerpt: { bn: form.excerptBn || form.excerptEn, en: form.excerptEn || form.excerptBn },
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
            {releases.map((release) => (
              <li key={release.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{tx(release.title)}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("releases.badge")} · {formatShortDate(release.publishedAt, lang)}
                  </p>
                </div>
                <a
                  href={release.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  {t("releases.open")}
                  <ExternalLink className="h-3 w-3" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}