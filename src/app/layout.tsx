import type { Metadata, Viewport } from "next";
import { Hind_Siliguri, Inter } from "next/font/google";

import { AnnouncementTicker } from "@/components/layout/announcement-ticker";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Providers } from "@/components/providers";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-hind-siliguri",
});

const SITE_NAME = "গণমাধ্যম ভিডিও এডিটরস অ্যাসোসিয়েশন";
const SITE_NAME_EN = "Media Video Editors Association";

export const metadata: Metadata = {
  metadataBase: new URL("https://mveabd.vercel.app"),
  title: {
    default: `${SITE_NAME} | ${SITE_NAME_EN}`,
    template: `%s | ${SITE_NAME_EN}`,
  },
  description:
    "The national platform for media video editors and visualizers in Bangladesh: verified member directory, newsroom labs, visual journalism ethics and press coverage.",
  keywords: [
    "video editor association Bangladesh",
    "broadcast editor",
    "Gonomadhyam",
    "গণমাধ্যম ভিডিও এডিটর",
    "news editor Dhaka",
  ],
  authors: [{ name: SITE_NAME_EN }],
  openGraph: {
    type: "website",
    locale: "bn_BD",
    alternateLocale: ["en_US"],
    siteName: SITE_NAME_EN,
    title: `${SITE_NAME} | ${SITE_NAME_EN}`,
    description:
      "Verified video editors, newsroom labs and a shared ethics code for Bangladeshi broadcast and digital newsrooms.",
    images: [
      {
        url: "/logo.png",
        width: 1250,
        height: 1250,
        alt: SITE_NAME_EN,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | ${SITE_NAME_EN}`,
    description: "Verified video editors, newsroom labs and ethics guidance for Bangladeshi broadcast and digital media.",
  },
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/logo.png", sizes: "180x180" }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0B0F19" },
    { media: "(prefers-color-scheme: light)", color: "#FAFBFC" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" className={`${inter.variable} ${hindSiliguri.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          <a href="#main" className="skip-link">
            Skip to content / মূল কনটেন্টে যান
          </a>
          <div className="flex min-h-screen flex-col">
            <AnnouncementTicker />
            <SiteHeader />
            <main id="main" className="flex-1">
              {children}
            </main>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
