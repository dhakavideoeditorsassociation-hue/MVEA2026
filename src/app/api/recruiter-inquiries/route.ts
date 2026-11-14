import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type InquiryPayload = {
  memberId?: unknown;
  memberName?: unknown;
  recruiterName?: unknown;
  company?: unknown;
  email?: unknown;
  phone?: unknown;
  message?: unknown;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/**
 * Recruiter hiring inquiries.
 *
 * Phase 1 validates and acknowledges the request. Phase 2 persists the record
 * to the Firestore `recruiter_inquiries` collection (and optionally emails the
 * member) using the same payload, so the client never changes.
 */
export async function POST(request: Request) {
  let body: InquiryPayload;
  try {
    body = (await request.json()) as InquiryPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const recruiterName = text(body.recruiterName, 120);
  const company = text(body.company, 160);
  const email = text(body.email, 160);
  const message = text(body.message, 4000);
  const phone = text(body.phone, 40);
  const memberId = text(body.memberId, 120);
  const memberName = text(body.memberName, 160);

  const errors: Record<string, string> = {};
  if (!recruiterName) errors.recruiterName = "required";
  if (!company) errors.company = "required";
  if (!EMAIL_RE.test(email)) errors.email = "invalid";
  if (message.length < 20) errors.message = "too_short";
  if (!memberId) errors.memberId = "required";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const inquiry = {
    id: randomUUID(),
    memberId,
    memberName,
    recruiterName,
    company,
    email,
    phone,
    message,
    status: "new" as const,
    createdAt: new Date().toISOString(),
  };

  // No durable store is configured in phase 1; log for the secretariat trail.
  console.info("[recruiter-inquiry]", JSON.stringify({ id: inquiry.id, memberId, company }));

  return NextResponse.json({ ok: true, id: inquiry.id }, { status: 201 });
}
