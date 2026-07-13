import type { Metadata, Viewport } from "next";
import {
  clashDisplay,
  inter,
  jetbrainsMono,
  manrope,
} from "@/lib/fonts";
import { AppProviders } from "@/components/providers/AppProviders";
import { PageTransition } from "@/components/providers/PageTransition";
import { Navigation } from "@/components/layout/Navigation";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { SITE } from "@/lib/constants";
import en from "../../messages/en.json";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: en.meta.title,
    template: `%s · ${SITE.name}`,
  },
  description: en.meta.description,
  metadataBase: new URL(SITE.url),
  openGraph: {
    title: en.meta.title,
    description: en.meta.description,
    locale: "en_US",
    type: "website",
    siteName: SITE.name,
  },
  twitter: {
    card: "summary_large_image",
    title: en.meta.title,
    description: en.meta.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${clashDisplay.variable} ${manrope.variable} ${inter.variable} ${jetbrainsMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="grain min-h-full bg-background font-sans text-foreground antialiased">
        <AppProviders>
          <ScrollProgress />
          <Navigation />
          <main id="main" className="relative flex min-h-full flex-1 flex-col">
            <PageTransition>{children}</PageTransition>
          </main>
        </AppProviders>
      </body>
    </html>
  );
}
