import type { Metadata } from "next";
import { COMPANY_INFO } from "@/constants/company";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://autostore-cg.com";

/* ── Base metadata ───────────────────────────────────────── */
export function generateBaseMetadata(
  overrides: Partial<Metadata> = {},
): Metadata {
  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: `${COMPANY_INFO.name} — Importateur de véhicules premium`,
      template: `%s | ${COMPANY_INFO.name}`,
    },
    description:
      "Importateur certifié de véhicules premium depuis la Chine, Dubai, le Japon, l'Allemagne et 4 autres pays. Qualité garantie, prix compétitifs.",
    authors: [{ name: COMPANY_INFO.name }],
    creator: COMPANY_INFO.name,
    robots: { index: true, follow: true },
    ...overrides,
  };
}

/* ── Vehicle metadata ────────────────────────────────────── */
export function generateVehicleMetadata({
  make,
  model,
  year,
  price,
  color,
  originCountry,
  imageUrl,
  slug,
  description,
}: {
  make: string;
  model: string;
  year: number;
  price: number;
  color: string;
  originCountry: string;
  imageUrl?: string;
  slug: string;
  description?: string;
}): Metadata {
  const title = `${make} ${model} ${year} — ${COMPANY_INFO.name}`;
  const desc =
    description ??
    `${make} ${model} ${year}, ${color}, importé depuis ${originCountry}. Prix : $${price.toLocaleString("fr-FR")}. Dédouanement inclus, livraison garantie.`;
  const url = `${BASE_URL}/vehicules/${slug}`;

  return {
    title,
    description: desc,
    openGraph: {
      type: "website",
      url,
      title,
      description: desc,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: imageUrl ? [imageUrl] : [],
    },
    alternates: { canonical: url },
  };
}

/* ── JSON-LD for vehicle ─────────────────────────────────── */
export function generateVehicleJsonLd({
  name,
  description,
  price,
  imageUrl,
  slug,
  isAvailable,
}: {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  slug: string;
  isAvailable: boolean;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: imageUrl,
    url: `${BASE_URL}/vehicules/${slug}`,
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: "XAF",
      availability: isAvailable
        ? "https://schema.org/InStock"
        : "https://schema.org/PreOrder",
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      seller: {
        "@type": "Organization",
        name: COMPANY_INFO.name,
        url: BASE_URL,
      },
    },
  };
}

/* ── JSON-LD for organization ────────────────────────────── */
export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: COMPANY_INFO.name,
    description: "Importateur certifié de véhicules premium internationaux",
    url: BASE_URL,
    telephone: COMPANY_INFO.phone,
    email: COMPANY_INFO.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Avenue de l'Indépendance",
      addressLocality: "Pointe-Noire",
      addressCountry: "CG",
    },
    sameAs: Object.values(COMPANY_INFO.social),
    openingHours: "Mo-Sa 08:00-18:00",
    priceRange: "$$$$",
    foundingDate: String(COMPANY_INFO.founded),
  };
}
