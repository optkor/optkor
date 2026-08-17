import type { Metadata } from "next";
import { Fraunces, Inter, Cairo } from "next/font/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import { ThemeScript } from "@/components/theme/ThemeScript";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { GsapLenisSync } from "@/components/providers/GsapLenisSync";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { dirForLocale } from "@/lib/i18n/config";
import { getSiteSettings } from "@/lib/queries/settings";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await getSiteSettings();

  const title = settings.seo_title ?? "OPTKOR — Visual Production Company";
  const description =
    settings.seo_description ??
    "OPTKOR is a B2B visual production partner for marketing agencies and brands.";

  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s — OPTKOR` },
    description,
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: "OPTKOR",
      images: settings.og_image ? [settings.og_image] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: settings.og_image ? [settings.og_image] : [],
    },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { locale } = await getDictionary();
  const dir = dirForLocale(locale);

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${fraunces.variable} ${inter.variable} ${cairo.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-full flex-col bg-ink text-paper">
        <MotionConfig reducedMotion="user">
          <SmoothScrollProvider />
          <GsapLenisSync />
          <ToastProvider>{children}</ToastProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
