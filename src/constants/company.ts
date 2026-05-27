/* ── WhatsApp ─────────────────────────────────────────────── */
export const WHATSAPP_NUMBER =
  process.env.WHATSAPP_PHONE_NUMBER ?? "+242060000000";

/* ── Company ─────────────────────────────────────────────── */
export const COMPANY_INFO = {
  name: "Autostore Congo",
  tagline: "L'excellence automobile mondiale",
  email: "contact@autostore-cg.com",
  phone: WHATSAPP_NUMBER,
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
