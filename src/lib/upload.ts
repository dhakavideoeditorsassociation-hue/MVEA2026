"use client";

import { cloudinaryConfig, isCloudinaryConfigured } from "@/lib/firebase";

export type UploadKind = "image" | "pdf";

const MAX_BYTES = 5 * 1024 * 1024;

export function isPdf(file: File): boolean {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

export function isImage(file: File): boolean {
  return file.type.startsWith("image/");
}

/**
 * Upload a file and return a URL.
 *
 * With Cloudinary configured the file goes to an unsigned upload preset
 * (`auto/upload`, so PDFs are supported). Without it, a browser object URL is
 * returned so the form stays usable — that URL only lives for this session and
 * the UI says so.
 */
export async function uploadFile(file: File, kind: UploadKind): Promise<string> {
  if (file.size > MAX_BYTES) throw new Error("file-too-large");
  if (kind === "pdf" && !isPdf(file)) throw new Error("invalid-type");
  if (kind === "image" && !isImage(file)) throw new Error("invalid-type");

  if (!isCloudinaryConfigured) {
    return URL.createObjectURL(file);
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/auto/upload`;
  const body = new FormData();
  body.append("file", file);
  body.append("upload_preset", cloudinaryConfig.uploadPreset);

  const response = await fetch(endpoint, { method: "POST", body });
  if (!response.ok) throw new Error("upload-failed");

  const payload = (await response.json()) as { secure_url?: string };
  if (!payload.secure_url) throw new Error("upload-failed");
  return payload.secure_url;
}
