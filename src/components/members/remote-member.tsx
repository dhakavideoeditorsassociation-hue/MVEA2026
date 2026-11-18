"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { MemberCvView } from "@/components/members/member-cv-view";
import { MemberProfileView } from "@/components/members/member-profile-view";
import { VerifyView } from "@/components/members/verify-view";
import { fetchRemoteMemberByMembershipId, fetchRemoteMemberBySlug } from "@/lib/store/public-members";
import type { Member } from "@/lib/types";

/**
 * Runtime loaders for members created from `/admin`.
 *
 * The seeded members are pre-rendered; anything added later is fetched from
 * Firestore on the client so the profile, CV and verification card work without
 * a redeploy.
 */

function Loading() {
  return (
    <div className="container flex min-h-[40vh] items-center justify-center py-20">
      <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        Loading member…
      </span>
    </div>
  );
}

function Missing({ label }: { label: string }) {
  return (
    <div className="container max-w-lg py-24 text-center">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">{label}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        This record is not in the public directory. It may not be approved yet.
      </p>
    </div>
  );
}

export function RemoteMemberProfile({ slug }: { slug: string }) {
  const [state, setState] = useState<{ status: "loading" | "ready" | "missing"; member?: Member }>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    void fetchRemoteMemberBySlug(slug)
      .then((member) => {
        if (!cancelled) setState(member ? { status: "ready", member } : { status: "missing" });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "missing" });
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (state.status === "loading") return <Loading />;
  if (state.status === "missing" || !state.member) return <Missing label="Member not found" />;
  return <MemberProfileView member={state.member} />;
}

export function RemoteMemberCv({ slug }: { slug: string }) {
  const [member, setMember] = useState<Member | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    void fetchRemoteMemberBySlug(slug)
      .then((record) => {
        if (!cancelled) setMember(record);
      })
      .catch(() => {
        if (!cancelled) setMember(null);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (member === undefined) return <Loading />;
  if (!member) return <Missing label="CV not found" />;
  return <MemberCvView member={member} />;
}

export function RemoteVerify({ memberId }: { memberId: string }) {
  const [state, setState] = useState<{ status: "loading" | "ready" | "missing"; member?: Member }>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    void fetchRemoteMemberByMembershipId(memberId)
      .then((member) => {
        if (!cancelled) setState(member ? { status: "ready", member } : { status: "missing" });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "missing" });
      });
    return () => {
      cancelled = true;
    };
  }, [memberId]);

  if (state.status === "loading") return <Loading />;
  return <VerifyView member={state.member ?? null} memberId={memberId} />;
}
