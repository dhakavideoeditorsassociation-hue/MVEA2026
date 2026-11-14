import type { Metadata } from "next";

import { DashboardView } from "@/components/dashboard/dashboard-view";

export const metadata: Metadata = {
  title: "Member Dashboard",
  description: "Manage your membership application, CV and public profile.",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return <DashboardView />;
}
