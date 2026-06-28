import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getSiteUrl } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = getSiteUrl();

const description =
  "Syahrial Danu is a Software Engineer building web, mobile, and AI-powered products with Next.js, Flutter, NestJS, React Native, and AI integrations.";

export const metadata: Metadata = {
  title: {
    default: "Syahrial Danu — Software Engineer",
    template: "%s | Syahrial Danu",
  },
  description,
  metadataBase: new URL(siteUrl),
  applicationName: "Syahrial Danu Portfolio",
  authors: [{ name: "Syahrial Danu Wardhana", url: siteUrl }],
  creator: "Syahrial Danu Wardhana",
  keywords: [
    "Syahrial Danu",
    "Syahrial Danu Wardhana",
    "Software Engineer",
    "Fullstack Developer",
    "Next.js",
    "Flutter",
    "NestJS",
    "React Native",
    "AI Developer",
    "Portfolio Indonesia",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    title: "Syahrial Danu — Software Engineer",
    description,
    url: siteUrl,
    siteName: "Syahrial Danu Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Syahrial Danu — Software Engineer",
    description,
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Syahrial Danu Wardhana",
  alternateName: "Syahrial Danu",
  url: siteUrl,
  jobTitle: "Software Engineer",
  description,
  worksFor: { "@type": "Organization", name: "Sprout Digital Labs" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Universitas Budi Luhur" },
  knowsAbout: [
    "Next.js",
    "React",
    "Flutter",
    "NestJS",
    "React Native",
    "TypeScript",
    "AI Integration",
  ],
  sameAs: [
    "https://github.com/Dhanuuwrdhn",
    "https://linkedin.com/in/dhanuwardhana",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
