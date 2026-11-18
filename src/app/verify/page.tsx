import type { Metadata } from "next";

import { VerifyIndexView } from "@/components/members/verify-index-view";

export const metadata: Metadata = {
  title: "Verify Member ID",
  description:
    "Verify a Media Video Editors Association membership ID and open the official verified member card.",
  alternates: { canonical: "/verify" },
};

export default function VerifyIndexPage() {
  return <VerifyIndexView />;
}