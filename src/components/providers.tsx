"use client";

import { ThemeProvider } from "next-themes";

import { AuthProvider } from "@/lib/auth/auth-provider";
import { SiteSettingsProvider } from "@/lib/cms/site-settings";
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
          <MemberPhotoProvider>
            <SiteSettingsProvider>{children}</SiteSettingsProvider>
          </MemberPhotoProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
