import type { Metadata } from "next";
import Link from "next/link";
import {
  Globe,
  Ship,
  FileCheck,
  Search,
  Shield,
  CreditCard,
  FileText,
  Wrench,
  Smartphone,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Services — Importation automobile internationale",
  description:
    "Découvrez nos services complets : importation personnalisée, transport, dédouanement, inspection technique, assurance, financement et accompagnement administratif.",
};

const SERVICES = [
  {
    icon: <Globe className="h-7 w-7" />,
    title: "Importation personnalisée",
    desc: "Vous ne trouvez pas votre véhicule idéal dans notre catalogue ? Nous sourceons directement auprès de nos partenaires dans 8 pays selon vos critères précis.",
    features: [
      "Recherche sur mesure",
      "Négociation prix fournisseur",
      "Vérification authenticité",
      "Rapport complet avant achat",
    ],
    badge: "Service phare",
    badgeColor: "rgba(201,168,76,0.12)",
    badgeTextColor: "var(--gold)",
    badgeBorderColor: "rgba(201,168,76,0.3)",
  },
  {
    icon: <Ship className="h-7 w-7" />,
    title: "Transport & Livraison",
    desc: "Nous gérons le transport maritime et terrestre de votre véhicule depuis le pays d'origine jusqu'à votre porte. Suivi GPS en temps réel inclus.",
    features: [
      "Transport maritime sécurisé",
      "Suivi temps réel",
      "Assurance transit",
      "Livraison à domicile",
    ],
    badge: null,
    badgeColor: "",
    badgeTextColor: "",
    badgeBorderColor: "",
  },
  {
    icon: <FileCheck className="h-7 w-7" />,
    title: "Dédouanement",
    desc: "Notre équipe d'experts douaniers prend en charge toutes les formalités administratives. Zéro tracas, zéro complication.",
    features: [
      "Déclaration douanière complète",
      "Paiement des droits",
      "Homologation",
      "Documents de circulation",
    ],
    badge: "Clé en main",
    badgeColor: "rgba(46,204,113,0.1)",
    badgeTextColor: "var(--green)",
    badgeBorderColor: "rgba(46,204,113,0.25)",
  },
  {
    icon: <Search className="h-7 w-7" />,
    title: "Inspection technique",
    desc: "Chaque véhicule est inspecté rigoureusement par nos techniciens certifiés avant expédition. Rapport photographique et technique fourni.",
    features: [
      "Inspection mécanique 120 points",
      "Contrôle carrosserie",
      "Vérification électronique",
      "Rapport photographique HD",
    ],
    badge: null,
    badgeColor: "",
    badgeTextColor: "",
    badgeBorderColor: "",
  },
  {
    icon: <Shield className="h-7 w-7" />,
    title: "Assurance transit",
    desc: "Protection complète de votre investissement pendant toute la durée du transport. Couverture tous risques incluse dans nos forfaits premium.",
    features: [
      "Couverture tous risques",
      "Valeur à neuf",
      "Déclaration simplifiée",
      "Remboursement rapide",
    ],
    badge: null,
    badgeColor: "",
    badgeTextColor: "",
    badgeBorderColor: "",
  },
  {
    icon: <CreditCard className="h-7 w-7" />,
    title: "Financement",
    desc: "Solutions de financement flexibles adaptées à votre budget. Partenariats avec les meilleures institutions financières de la région.",
    features: [
      "Crédit auto sur mesure",
      "Apport minimum",
      "Taux compétitifs",
      "Réponse sous 48h",
    ],
    badge: "Nouveau",
    badgeColor: "rgba(52,152,219,0.1)",
    badgeTextColor: "var(--blue)",
    badgeBorderColor: "rgba(52,152,219,0.25)",
  },
  {
    icon: <FileText className="h-7 w-7" />,
    title: "Accompagnement administratif",
    desc: "Immatriculation, carte grise, contrôle technique, assurance locale… Nous vous accompagnons dans toutes les démarches post-importation.",
    features: [
      "Immatriculation",
      "Carte grise",
      "Contrôle technique",
      "Mise en circulation",
    ],
    badge: null,
    badgeColor: "",
    badgeTextColor: "",
    badgeBorderColor: "",
  },
  {
    icon: <Wrench className="h-7 w-7" />,
    title: "Garantie & SAV",
    desc: "Service après-vente réactif avec garantie sur les véhicules. Réseau de partenaires mécaniciens certifiés dans toute la région.",
    features: [
      "Garantie 6 mois minimum",
      "Réseau de réparateurs",
      "Pièces détachées",
      "Assistance téléphonique",
    ],
    badge: null,
    badgeColor: "",
    badgeTextColor: "",
    badgeBorderColor: "",
  },
  {
    icon: <Smartphone className="h-7 w-7" />,
    title: "Suivi en ligne",
    desc: "Tableau de bord client pour suivre votre commande en temps réel, de l'achat jusqu'à la livraison. Notifications WhatsApp automatiques.",
    features: [
      "Dashboard client",
      "Notifications WhatsApp",
      "Documents en ligne",
      "Historique complet",
    ],
    badge: null,
    badgeColor: "",
    badgeTextColor: "",
    badgeBorderColor: "",
  },
];

const PROCESS = [
  {
    step: "1",
    title: "Consultation gratuite",
    desc: "Discutez de votre projet avec l'un de nos experts.",
  },
  {
    step: "2",
    title: "Recherche & sélection",
    desc: "Nous sélectionnons les meilleures options selon vos critères.",
  },
  {
    step: "3",
    title: "Devis détaillé",
    desc: "Recevez un devis transparent sans frais cachés.",
  },
  {
    step: "4",
    title: "Achat & inspection",
    desc: "Achat sécurisé et inspection complète avant expédition.",
  },
  {
    step: "5",
    title: "Transport & dédouanement",
    desc: "Gestion complète de la logistique et des douanes.",
  },
  {
    step: "6",
    title: "Livraison clé en main",
    desc: "Votre véhicule livré prêt à rouler, documents inclus.",
  },
];

export default function ServicesPage() {
  return (
    <div className="pt-(--nav-h)">
      {/* ── Hero ─────────────────────────────────────── */}
      <div className="bg-(--bg-2) border-b border-(--border) px-6 lg:px-10 py-16">
        <div className="max-w-7xl mx-auto">
          <p className="section-tag mb-4" aria-hidden="true">
            Notre offre
          </p>
          <h1 className="font-display text-[clamp(2.8rem,7vw,4.5rem)] tracking-[0.04em] leading-[0.95] mb-5">
            NOS SERVICES
            <br />
            <span className="text-(--gold)">PREMIUM</span>
          </h1>
          <p className="text-[1rem] text-(--muted) max-w-2xl leading-[1.8] font-light">
            Un accompagnement complet et transparent, de la sélection du
            véhicule jusqu&apos;à sa livraison chez vous. Nous gérons chaque
            étape pour vous.
          </p>
        </div>
      </div>

      {/* ── Services grid ────────────────────────────── */}
      <section
        className="max-w-7xl mx-auto px-6 lg:px-10 py-20"
        aria-labelledby="services-heading"
      >
        <h2 id="services-heading" className="sr-only">
          Liste de nos services
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((service) => (
            <article
              key={service.title}
              className={cn(
                "group relative bg-(--bg-2) border border-(--border)",
                "rounded-(--r-lg) p-7 overflow-hidden",
                "transition-all duration-250",
                "hover:border-(--gold) hover:-translate-y-1",
                "hover:shadow-[0_16px_40px_rgba(0,0,0,0.3)]",
              )}
            >
              {/* Gold top accent on hover */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5 bg-(--gold) scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                aria-hidden="true"
              />

              {/* Icon */}
              <div
                className="w-14 h-14 rounded-(--r-lg) bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.18)]
                           flex items-center justify-center text-(--gold) mb-5 shrink-0"
                aria-hidden="true"
              >
                {service.icon}
              </div>

              {/* Badge */}
              {service.badge && (
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.65rem] font-semibold border mb-3"
                  style={{
                    background: service.badgeColor,
                    color: service.badgeTextColor,
                    borderColor: service.badgeBorderColor,
                  }}
                >
                  {service.badge}
                </span>
              )}

              <h3 className="font-semibold text-[1rem] mb-3 tracking-[0.02em] leading-snug">
                {service.title}
              </h3>
              <p className="text-[0.82rem] text-(--muted) leading-[1.7] mb-5">
                {service.desc}
              </p>

              {/* Features */}
              <ul className="space-y-1.5">
                {service.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-[0.78rem] text-(--dim)"
                  >
                    <CheckCircle2
                      className="h-3.5 w-3.5 text-(--green) shrink-0"
                      aria-hidden="true"
                    />
                    {f}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* ── Process ──────────────────────────────────── */}
      <section
        className="bg-(--bg-2) border-y border-(--border) py-20 px-6 lg:px-10"
        aria-labelledby="process-heading"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="section-tag justify-center mb-3" aria-hidden="true">
              Étape par étape
            </p>
            <h2
              id="process-heading"
              className="font-display text-[clamp(2rem,5vw,3rem)] tracking-[0.04em]"
            >
              COMMENT ÇA MARCHE
            </h2>
          </div>

          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROCESS.map((step) => (
              <li
                key={step.step}
                className="flex gap-4 bg-(--bg-3) border border-(--border) rounded-(--r-lg) p-6"
              >
                <div
                  className="shrink-0 w-10 h-10 rounded-full border border-(--border-2)
                             flex items-center justify-center font-display text-[1.1rem] text-(--gold)"
                  aria-hidden="true"
                >
                  {step.step}
                </div>
                <div>
                  <h3 className="font-semibold text-[0.9rem] mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-[0.78rem] text-(--dim) leading-[1.65]">
                    {step.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="py-20 px-6 lg:px-10 text-center" aria-label="Contact">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-[clamp(2rem,5vw,3rem)] tracking-[0.04em] mb-5">
            PRÊT À DÉMARRER
            <br />
            <span className="text-(--gold)">VOTRE PROJET ?</span>
          </h2>
          <p className="text-[0.95rem] text-(--muted) mb-10 leading-relaxed">
            Contactez-nous pour une consultation gratuite et obtenez un devis
            personnalisé adapté à votre situation.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-(--r)
                         bg-(--gold) text-(--bg) text-[0.85rem] font-semibold uppercase tracking-wider
                         hover:bg-(--gold-2) transition-colors"
            >
              Consultation gratuite <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-(--r)
                         border border-(--border-2) text-(--text) text-[0.85rem] font-medium uppercase tracking-wider
                         hover:border-(--gold) hover:text-(--gold) transition-all"
            >
              Voir le catalogue
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
