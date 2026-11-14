import type { Metadata, Viewport } from "next";
import { Hind_Siliguri, Inter } from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Providers } from "@/components/providers";
import { repo } from "@/lib/data";

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
const SITE_NAME_EN = "Gonomadhyam Video Editor Association";

export const metadata: Metadata = {
  metadataBase: new URL("https://gonomadhyam-editors.vercel.app"),
  title: {
    default: `${SITE_NAME} | ${SITE_NAME_EN}`,
    template: `%s | ${SITE_NAME_EN}`,
  },
  description:
    "The professional association for television, broadcast and multimedia video editors in Bangladesh. Verified member directory, workshops, ethics code and press coverage.",
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
      "Verified video editors, hands-on workshops and a shared ethics code for Bangladeshi broadcast newsrooms.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: SITE_NAME_EN,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | ${SITE_NAME_EN}`,
    description: "Verified video editors, workshops and ethics guidance for Bangladeshi broadcast media.",
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
  const association = await repo.getAssociation();

  return (
    <html lang="bn" className={`${inter.variable} ${hindSiliguri.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          <a href="#main" className="skip-link">
            Skip to content / মূল কনটেন্টে যান
          </a>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main id="main" className="flex-1">
              {children}
            </main>
            <SiteFooter association={association} />
          </div>
        </Providers>
      </body>
    </html>
  );
}
