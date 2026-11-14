import type { Metadata } from "next";

import { LoginView } from "@/components/auth/login-view";

export const metadata: Metadata = {
  title: "Member Login",
  description: "Log in to the Gonomadhyam Video Editor Association member portal.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <LoginView />;
}
