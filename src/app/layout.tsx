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
import { StickyCta } from "@/components/layout/StickyCta";
import { SkipLink } from "@/components/ui/SkipLink";
import { SITE, SOCIAL_ITEMS } from "@/lib/constants";
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
  alternates: {
    canonical: SITE.url,
  },
};

/**
 * Structured data — who this is and what they do, in the form search engines
 * read. Built from the same constants the page renders, so it cannot drift.
 */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.name,
  url: SITE.url,
  jobTitle: en.hero.roleLabel,
  description: en.meta.description,
  email: `mailto:${SITE.email}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ulaanbaatar",
    addressCountry: "MN",
  },
  knowsAbout: [
    "Full-stack development",
    "Web application development",
    "Mobile application development",
    "React",
    "Next.js",
    "React Native",
    "NestJS",
    "PostgreSQL",
    "API design",
    "Technical leadership",
  ],
  sameAs: SOCIAL_ITEMS.filter((item) => item.external).map((item) => item.href),
};

/**
 * The same thing said the other way round: Person answers "who is this",
 * ProfessionalService answers "what can I hire them for". The offers are read
 * straight off the Services section, so the two cannot say different things.
 */
const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: `${SITE.name} — ${en.hero.roleLabel}`,
  url: `${SITE.url}#services`,
  description: en.services.intro,
  provider: {
    "@type": "Person",
    name: SITE.name,
    url: SITE.url,
  },
  areaServed: {
    "@type": "Country",
    name: "Mongolia",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ulaanbaatar",
    addressCountry: "MN",
  },
  email: `mailto:${SITE.email}`,
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: en.services.headline,
    itemListElement: en.services.offers.map((offer) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: offer.title,
        description: offer.detail,
      },
    })),
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
        <script
          type="application/ld+json"
          // The payload is built from local constants, never user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
        />
        <AppProviders>
          <SkipLink />
          <ScrollProgress />
          <Navigation />
          <main
            id="main"
            tabIndex={-1}
            className="relative flex min-h-full flex-1 flex-col"
          >
            <PageTransition>{children}</PageTransition>
          </main>
          <StickyCta />
        </AppProviders>
      </body>
    </html>
  );
}
