import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { SmoothScrollProvider } from "@/components/ui/smooth-scroll-provider";
import { IntroLoader } from "@/components/ui/intro-loader";
import { ChatWidget } from "@/components/ui/chat-widget";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Navbar } from "@/components/sections/navbar";
import { themeInitScript } from "@/lib/theme-script";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const SITE_URL = "https://revstay.com";
const TITLE =
  "Revstay — Grow Your Hotel's Bookings on Booking.com, Agoda, Expedia & More";
const DESCRIPTION =
  "Revstay helps hotels increase guest bookings by creating and optimizing their listings across Booking.com, Agoda, Expedia, Airbnb, Hotelbeds, Hotels.com, and Trip.com.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Revstay",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-ivory text-ink">
        <ThemeProvider>
          <IntroLoader />
          <SmoothScrollProvider>
            <Navbar />
            {children}
          </SmoothScrollProvider>
          <ChatWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}
