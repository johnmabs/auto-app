/* ── WhatsApp ─────────────────────────────────────────────── */
export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+242060000000";

/* ── Company ─────────────────────────────────────────────── */
export const COMPANY_INFO = {
  name: "Autostore Congo",
  tagline: "L'excellence automobile mondiale",
  email: "contact@autostore-cg.com",
  phone: "+242 06 000 0000",
  whatsapp: WHATSAPP_NUMBER,
  address: "Avenue de l'Indépendance, Pointe-Noire, Congo",
  founded: 2023,
  stats: {
    vehiclesImported: "35+",
    countries: 8,
    satisfaction: "98%",
    yearsExperience: 3,
  },
  social: {
    facebook: "https://facebook.com/autostore",
    instagram: "https://instagram.com/autostore",
    linkedin: "https://linkedin.com/company/autostore",
    twitter: "https://twitter.com/autostore",
  },
} as const;
