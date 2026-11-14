"use client";

import Image from "next/image";

import { initials } from "@/lib/format";
import { resolvePhoto, useMemberPhotos } from "@/lib/photos/member-photos";
import { cn } from "@/lib/utils";

type AvatarProps = {
  name: string;
  /** Portrait from the content record (may be empty). */
  src?: string;
  /** Member slug — the key an admin-uploaded portrait is stored under. */
  slug?: string;
  memberId?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Extra classes for the initials fallback type scale. */
  textClassName?: string;
};

/**
 * Portrait with a deterministic initials fallback.
 *
 * Admin-uploaded photos (Firestore or local override) take precedence over the
 * record's own `photoUrl`, so a new portrait appears everywhere immediately.
 */
export function Avatar({ name, src, slug, memberId, className, sizes = "96px", priority = false, textClassName }: AvatarProps) {
  const { photos } = useMemberPhotos();
  const resolved = resolvePhoto(photos, { slug, memberId }, src);

  if (resolved) {
    return (
      <Image
        src={resolved}
        alt={name}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized
        className={cn("object-cover object-top", className)}
      />
    );
  }

  return (
    <span
      aria-hidden
      className={cn(
        "grid h-full w-full place-items-center bg-gradient-to-br from-primary/15 via-card to-secondary/10 font-bold uppercase tracking-wide text-primary",
        textClassName ?? "text-lg",
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
