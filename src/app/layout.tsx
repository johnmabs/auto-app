import type { Metadata, Viewport } from "next";
import { dmSans, dmMono, bebasNeue, playfairDisplay } from "@/lib/fonts";
import "@/styles/globals.css";
import { COMPANY_INFO } from "@/constants/company";
import { Toaster } from "sonner";

/* Metadata */
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://autostore-cg.com",
  ),
  title: {
    default: `${COMPANY_INFO.name} — Importateur de véhicules premium`,
    template: `%s | ${COMPANY_INFO.name}`,
  },
  description:
    "Importateur certifié de véhicules premium depuis la Chine, Dubai, le Japon, l'Allemagne et 5 autres pays. Plus de 1 200 véhicules importés. Qualité garantie.",
  keywords: [
    "importation et vente de voiture d'occasion",
    "véhicule importé",
    "voiture chine",
    "voiture dubai",
    "voiture japon",
    "voiture france",
    "voiture italie",
    "voiture allemagne",
    "importation automobile",
    "concessionnaire auto",
    "SUV importé",
    "voiture luxe importée",
    "Autostore Congo",
  ],
  authors: [{ name: COMPANY_INFO.name }],
  creator: COMPANY_INFO.name,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://autostore-cg.com",
    siteName: COMPANY_INFO.name,
    title: `${COMPANY_INFO.name} — Importateur automobile premium`,
    description:
      "Véhicules d'exception importés depuis le monde entier. Chine, Dubai, Korea du sud, Japon, Allemagne et plus.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${COMPANY_INFO.name} — Importateur automobile`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${COMPANY_INFO.name} — Importateur automobile premium`,
    description: "Véhicules d'exception importés depuis le monde entier.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0b",
};

/* ── JSON-LD Structured Data ─────────────────────────────── */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  name: COMPANY_INFO.name,
  description: "Importateur certifié de véhicules premium internationaux",
  url: "https://autostore-cg.com",
  telephone: COMPANY_INFO.phone,
  email: COMPANY_INFO.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Avenue de l'Indépendance",
    addressLocality: "Pointe-Noire",
    addressCountry: "CG",
  },
  openingHours: "Mo-Fr 08:00-18:00",
  priceRange: "$$$$",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={` 
        ${dmSans.variable} 
        ${dmMono.variable} 
        ${bebasNeue.variable} 
        ${playfairDisplay.variable}
        light
        antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        {/* Toast notifications */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#1a1a1f",
              border: "1px solid #3a3a46",
              color: "#f8f6f2",
              fontFamily: "var(--font-sans)",
              fontSize: "0.85rem",
              borderRadius: "10px",
            },
          }}
          richColors
        />
      </body>
    </html>
  );
}
