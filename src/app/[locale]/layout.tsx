import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Playfair_Display, Inter, Amiri, IBM_Plex_Sans_Arabic } from "next/font/google";
import { SmoothScrollProvider } from "@/components/ui/smooth-scroll-provider";
import { IntroLoader } from "@/components/ui/intro-loader";
import { ChatWidget } from "@/components/ui/chat-widget";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Navbar } from "@/components/sections/navbar";
import { themeInitScript } from "@/lib/theme-script";
import { routing } from "@/i18n/routing";
import "../globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Premium Arabic pairing: Amiri (Naskh serif) for headlines, IBM Plex
// Sans Arabic for body — matching the Playfair/Inter split in English.
const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
});

const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-plex-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

const SITE_URL = "https://revstay.com";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const title = t("title");
  const description = t("description");

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        ar: "/ar",
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}`,
      siteName: "Revstay",
      locale: locale === "ar" ? "ar_EG" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const isRtl = locale === "ar";
  const fontVars = `${playfair.variable} ${inter.variable} ${amiri.variable} ${plexArabic.variable}`;

  return (
    <html
      lang={locale}
      dir={isRtl ? "rtl" : "ltr"}
      suppressHydrationWarning
      className={`${fontVars} h-full antialiased ${isRtl ? "font-ar" : ""}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-ivory text-ink">
        <NextIntlClientProvider>
          <ThemeProvider>
            <IntroLoader />
            <SmoothScrollProvider>
              <Navbar />
              {children}
            </SmoothScrollProvider>
            <ChatWidget />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
