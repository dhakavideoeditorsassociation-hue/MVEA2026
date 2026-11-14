"use client";

import Image from "next/image";

import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

type AvatarProps = {
  name: string;
  src?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Extra classes for the initials fallback type scale. */
  textClassName?: string;
};

/**
 * Portrait with a deterministic initials fallback.
 * Members of the association have not all supplied photographs yet, so the
 * directory must look intentional without one.
 */
export function Avatar({ name, src, className, sizes = "96px", priority = false, textClassName }: AvatarProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", className)}
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
