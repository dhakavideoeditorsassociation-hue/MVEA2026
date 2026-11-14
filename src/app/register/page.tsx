import type { Metadata } from "next";

import { RegisterView } from "@/components/auth/register-view";

export const metadata: Metadata = {
  title: "Create a Member Account",
  description: "Register for the Gonomadhyam Video Editor Association member portal and submit your membership application.",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return <RegisterView />;
}
