import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { LocaleProvider } from "@/lib/i18n";
import { personal } from "@/lib/data";
import "./globals.css";

// Primary sans — used for everything except technical labels.
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

// Mono — for technical metadata: tags, version stamps, code, numbers.
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://hugolima.dev";

export const metadata: Metadata = {
  title: {
    default: `${personal.name} — Portafolio`,
    template: `%s — ${personal.name}`,
  },
  description:
    "Portafolio profesional de Hugo Alexander Lima Bastidas. Desarrollador Front-End e Ingeniero en Tecnologías de la Información — Next.js, Laravel, Angular, AWS.",
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  authors: [{ name: personal.name, url: personal.linkedin }],
  keywords: [
    "Hugo Lima",
    "Hugo Alexander Lima",
    "Desarrollador Front-End",
    "Front-End Developer",
    "Next.js",
    "Laravel",
    "Angular",
    "Flutter",
    "AWS",
    "Ecuador",
    "Portafolio",
  ],
  openGraph: {
    title: `${personal.name} — Portafolio`,
    description:
      "Desarrollador Front-End e Ingeniero en TI. Next.js, Angular, Laravel y AWS.",
    type: "website",
    locale: "es_EC",
    siteName: personal.name,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: `${personal.name} — Portafolio`,
    description: "Desarrollador Front-End e Ingeniero en TI.",
  },
  robots: { index: true, follow: true },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: personal.name,
  jobTitle: personal.role.es,
  email: `mailto:${personal.email}`,
  telephone: personal.phone,
  url: SITE_URL,
  sameAs: [personal.linkedin],
  address: {
    "@type": "PostalAddress",
    addressCountry: "EC",
    addressLocality: personal.location.es,
  },
  knowsAbout: [
    "Next.js",
    "TypeScript",
    "Laravel",
    "Angular",
    "Flutter",
    "MySQL",
    "PostgreSQL",
    "AWS",
    "REST APIs",
    "SCRUM",
    "SOLID",
  ],
  alumniOf: [
    {
      "@type": "CollegeOrUniversity",
      name: "Universidad Internacional del Ecuador (UIDE)",
    },
    {
      "@type": "CollegeOrUniversity",
      name: "Universidad Europea",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="bg-surface text-fg font-sans antialiased">
        <a
          href="#inicio"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-accent focus:px-3 focus:py-2 focus:text-sm focus:text-surface"
        >
          Saltar al contenido
        </a>
        <LocaleProvider>{children}</LocaleProvider>
        <Analytics />
      </body>
    </html>
  );
}
