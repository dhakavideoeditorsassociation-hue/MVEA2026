"use client";

import { ThemeProvider } from "next-themes";

import { AuthProvider } from "@/lib/auth/auth-provider";
import { LanguageProvider } from "@/lib/i18n/provider";
import { MemberPhotoProvider } from "@/lib/photos/member-photos";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
      storageKey="gvea.theme"
    >
      <LanguageProvider>
        <AuthProvider>
          <MemberPhotoProvider>{children}</MemberPhotoProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
