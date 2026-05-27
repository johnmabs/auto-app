import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { COUNTRIES } from "@/constants/countries";
import { COMPANY_INFO } from "@/constants/company";

export const metadata: Metadata = {
  title: `À propos — ${COMPANY_INFO.name}`,
  description: `Découvrez l'histoire de ${COMPANY_INFO.name}, notre mission, nos valeurs et notre équipe d'experts en importation automobile depuis 2017.`,
};

/* ── Stat card ───────────────────────────────────────────── */
function StatCard({
  num,
  label,
  sub,
}: {
  num: string;
  label: string;
  sub?: string;
}) {
  return (
    <div className="bg-[var(--bg-3)] border border-[var(--border)] rounded-[var(--r-lg)] p-6 text-center">
      <p className="font-display text-[3rem] text-[var(--gold)] tracking-[0.04em] leading-none mb-2">
        {num}
      </p>
      <p className="font-medium text-[0.9rem] mb-1">{label}</p>
      {sub && <p className="text-[0.75rem] text-[var(--dim)]">{sub}</p>}
    </div>
  );
}

/* ── Value card ──────────────────────────────────────────── */
function ValueCard({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-4">
      <div
        className="shrink-0 w-12 h-12 rounded-[var(--r-lg)] bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.18)] flex items-center justify-center text-xl"
        aria-hidden="true"
      >
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-[0.95rem] mb-1.5">{title}</h3>
        <p className="text-[0.82rem] text-[var(--muted)] leading-[1.7]">
          {desc}
        </p>
      </div>
    </div>
  );
}

/* ── Team card ───────────────────────────────────────────── */
function TeamCard({
  name,
  role,
  bio,
  initials,
  color,
}: {
  name: string;
  role: string;
  bio: string;
  initials: string;
  color: string;
}) {
  return (
    <div className="bg-[var(--bg-2)] border border-[var(--border)] rounded-[var(--r-lg)] p-6">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mb-4 border border-[var(--border-2)]"
        style={{ background: color }}
        aria-hidden="true"
      >
        {initials}
      </div>
      <h3 className="font-semibold text-[1rem] mb-0.5">{name}</h3>
      <p className="text-[0.72rem] uppercase tracking-[0.08em] text-[var(--gold)] mb-3">
        {role}
      </p>
      <p className="text-[0.82rem] text-[var(--muted)] leading-[1.7]">{bio}</p>
    </div>
  );
}

/* ── Timeline item ───────────────────────────────────────── */
function TimelineItem({
  year,
  title,
  desc,
  last,
}: {
  year: string;
  title: string;
  desc: string;
  last?: boolean;
}) {
  return (
    <div className="flex gap-5">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full border border-[var(--border-2)] bg-[var(--bg-3)] flex items-center justify-center shrink-0">
          <span className="font-display text-[0.85rem] text-[var(--gold)]">
            {year.slice(2)}
          </span>
        </div>
        {!last && (
          <div
            className="w-px flex-1 bg-[var(--border)] mt-2"
            aria-hidden="true"
          />
        )}
      </div>
      <div className={cn("pb-8", last && "pb-0")}>
        <p className="text-[0.72rem] uppercase tracking-[0.1em] text-[var(--gold)] mb-1">
          {year}
        </p>
        <h3 className="font-semibold text-[0.95rem] mb-1.5">{title}</h3>
        <p className="text-[0.82rem] text-[var(--muted)] leading-[1.7]">
          {desc}
        </p>
      </div>
    </div>
  );
}

export default function AProposPage() {
  return (
    <div className="pt-[var(--nav-h)]">
      {/* ── Hero ─────────────────────────────────────── */}
      <div className="relative bg-[var(--bg-2)] border-b border-[var(--border)] px-6 lg:px-10 py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,rgba(201,168,76,0.05)_0%,transparent_60%)] pointer-events-none"
          aria-hidden="true"
        />
        <div className="max-w-7xl mx-auto relative">
          <p className="section-tag mb-4" aria-hidden="true">
            Notre histoire
          </p>
          <h1 className="font-display text-[clamp(2.8rem,7vw,4.5rem)] tracking-[0.04em] leading-[0.95] mb-6">
            À PROPOS
            <br />
            D&apos;<span className="text-[var(--gold)]">AUTOSTORE</span>
          </h1>
          <p className="text-[1rem] text-[var(--muted)] max-w-2xl leading-[1.85] font-light">
            Fondée en {COMPANY_INFO.founded} à Pointe-Noire, {COMPANY_INFO.name}
            est née d&apos;une conviction profonde : chacun mérite
            d&apos;accéder aux meilleurs véhicules du monde, sans intermédiaires
            inutiles et à des prix transparents.
          </p>
        </div>
      </div>

      {/* ── Stats ────────────────────────────────────── */}
      <section
        className="py-16 px-6 lg:px-10 border-b border-[var(--border)]"
        aria-label="Chiffres clés"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              num="1 200+"
              label="Véhicules importés"
              sub="Depuis notre création"
            />
            <StatCard num="8" label="Pays partenaires" sub="Sur 4 continents" />
            <StatCard
              num="98%"
              label="Clients satisfaits"
              sub="Taux de satisfaction 2024"
            />
            <StatCard
              num="7 ans"
              label="D'expertise"
              sub="Sur l'importation automobile"
            />
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ─────────────────────────── */}
      <section
        className="py-20 px-6 lg:px-10"
        aria-labelledby="mission-heading"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="section-tag mb-4" aria-hidden="true">
              Ce qui nous anime
            </p>
            <h2
              id="mission-heading"
              className="font-display text-[clamp(2rem,5vw,3rem)] tracking-[0.04em] mb-6"
            >
              NOTRE MISSION
            </h2>
            <div className="space-y-5 text-[0.9rem] text-[var(--muted)] leading-[1.85]">
              <p>
                Nous croyons que l&apos;accès à l&apos;excellence automobile ne
                devrait pas être un privilège réservé à quelques-uns. Notre
                mission est de démocratiser l&apos;importation de véhicules
                premium en offrant un service transparent, fiable et
                professionnel.
              </p>
              <p>
                En 7 ans, nous avons construit un réseau solide de partenaires
                dans 8 pays, permettant à nos clients de bénéficier des
                meilleures opportunités automobiles mondiales, livrées
                directement à leur porte.
              </p>
              <p>
                Notre vision est de devenir le leader de référence de
                l&apos;importation automobile en Afrique subsaharienne, synonyme
                de qualité, d&apos;intégrité et d&apos;innovation.
              </p>
            </div>

            <div className="mt-8">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-[var(--r)] bg-[var(--gold)] text-[var(--bg)] text-[0.85rem] font-semibold uppercase tracking-wider hover:bg-[var(--gold-2)] transition-colors"
              >
                Travailler avec nous <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Values */}
          <div className="space-y-6" role="list" aria-label="Nos valeurs">
            {[
              {
                icon: "🎯",
                title: "Transparence totale",
                desc: "Prix clairs, frais détaillés, aucune surprise. Vous savez exactement ce que vous payez et pourquoi.",
              },
              {
                icon: "🏆",
                title: "Excellence qualité",
                desc: "Chaque véhicule est inspecté selon notre protocole rigoureux de 120 points avant toute expédition.",
              },
              {
                icon: "🤝",
                title: "Partenariat durable",
                desc: "Nous construisons des relations de confiance à long terme. 60% de nos clients reviennent pour une deuxième commande.",
              },
              {
                icon: "⚡",
                title: "Réactivité",
                desc: "Réponse sous 24h garantie. Notre équipe est disponible 6j/7 pour accompagner votre projet.",
              },
            ].map((v) => (
              <div key={v.title} role="listitem">
                <ValueCard {...v} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Histoire / Timeline ───────────────────────── */}
      <section
        className="py-20 px-6 lg:px-10 bg-[var(--bg-2)] border-y border-[var(--border)]"
        aria-labelledby="histoire-heading"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <p className="section-tag mb-4" aria-hidden="true">
                Notre parcours
              </p>
              <h2
                id="histoire-heading"
                className="font-display text-[clamp(2rem,5vw,3rem)] tracking-[0.04em] mb-4"
              >
                L&apos;HISTOIRE
                <br />
                D&apos;AUTOSTORE
              </h2>
              <p className="text-[0.9rem] text-[var(--muted)] leading-[1.85]">
                De Pointe-Noire au monde, notre aventure en quelques étapes
                clés.
              </p>
            </div>

            <ol aria-label={`Chronologie ${COMPANY_INFO.name}`}>
              {[
                {
                  year: "2017",
                  title: "Fondation",
                  desc: `Création de ${COMPANY_INFO.name} à Pointe-Noire. Premiers partenariats avec des fournisseurs au Japon et en Allemagne.`,
                },
                {
                  year: "2018",
                  title: "Premières livraisons",
                  desc: "50 véhicules importés la première année. Lancement du service de dédouanement intégré.",
                },
                {
                  year: "2020",
                  title: "Expansion Chine & Dubai",
                  desc: "Ouverture de partenariats en Chine et à Dubai. Lancement du catalogue en ligne. +200% de croissance.",
                },
                {
                  year: "2022",
                  title: "Électrique & Innovation",
                  desc: "Intégration de véhicules électriques au catalogue. Partenariat avec BYD et NIO. Service de financement lancé.",
                },
                {
                  year: "2024",
                  title: "Plateforme digitale",
                  desc: "Lancement de la nouvelle plateforme web. 1 200 véhicules importés cumulés. Expansion vers 8 pays partenaires.",
                  last: true,
                },
              ].map((item) => (
                <li key={item.year}>
                  <TimelineItem {...item} />
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── Équipe ───────────────────────────────────── */}
      <section className="py-20 px-6 lg:px-10" aria-labelledby="equipe-heading">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="section-tag justify-center mb-3" aria-hidden="true">
              Derrière Autostore
            </p>
            <h2
              id="equipe-heading"
              className="font-display text-[clamp(2rem,5vw,3rem)] tracking-[0.04em]"
            >
              NOTRE ÉQUIPE
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <TeamCard
              name="Jean-Paul Mbemba"
              role="Fondateur & CEO"
              bio="15 ans dans l'industrie automobile. Passionné par la mobilité africaine et l'excellence internationale."
              initials="JM"
              color="rgba(201,168,76,0.15)"
            />
            <TeamCard
              name="Amina Touré"
              role="Directrice des opérations"
              bio="Experte en logistique internationale. Coordonne nos partenariats dans les 8 pays sources."
              initials="AT"
              color="rgba(52,152,219,0.15)"
            />
            <TeamCard
              name="Koffi Assiongbon"
              role="Expert douanier"
              bio="20 ans d'expérience en dédouanement. Garantit des importations conformes et sans surprises."
              initials="KA"
              color="rgba(46,204,113,0.15)"
            />
            <TeamCard
              name="Sophie Ngoma"
              role="Relations clients"
              bio="Multilingue (FR/EN/ZH). Votre point de contact de la commande à la livraison."
              initials="SN"
              color="rgba(230,57,70,0.15)"
            />
          </div>
        </div>
      </section>

      {/* ── Pays partenaires ──────────────────────────── */}
      <section
        className="py-20 px-6 lg:px-10 bg-[var(--bg-2)] border-t border-[var(--border)]"
        aria-labelledby="partenaires-heading"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="section-tag justify-center mb-3" aria-hidden="true">
              Notre réseau
            </p>
            <h2
              id="partenaires-heading"
              className="font-display text-[clamp(2rem,5vw,3rem)] tracking-[0.04em]"
            >
              NOS PAYS
              <br />
              PARTENAIRES
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {COUNTRIES.filter((c) => c.active).map((country) => (
              <div
                key={country.code}
                className="bg-[var(--bg-3)] border border-[var(--border)] rounded-[var(--r-lg)] p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl" aria-hidden="true">
                    {country.flag}
                  </span>
                  <div>
                    <p className="font-semibold text-[0.9rem]">
                      {country.name}
                    </p>
                    <p className="text-[0.7rem] text-[var(--dim)] uppercase tracking-[0.06em]">
                      {country.continent}
                    </p>
                  </div>
                </div>
                <p className="text-[0.78rem] text-[var(--muted)] leading-[1.65] mb-3">
                  {country.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {country.highlights.slice(0, 3).map((h) => (
                    <span
                      key={h}
                      className="text-[0.65rem] px-2 py-0.5 bg-[var(--bg-4)] border border-[var(--border)] rounded-full text-[var(--dim)]"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section
        className="py-20 px-6 lg:px-10 text-center"
        aria-label="Appel à l'action"
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-[clamp(2rem,5vw,3rem)] tracking-[0.04em] mb-5">
            PRÊT À FAIRE
            <br />
            <span className="text-[var(--gold)]">CONFIANCE À AUTOELITE ?</span>
          </h2>
          <p className="text-[0.95rem] text-[var(--muted)] mb-10 leading-relaxed">
            Rejoignez plus de 1 200 clients satisfaits qui nous ont fait
            confiance pour leur importation automobile.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-[var(--r)] bg-[var(--gold)] text-[var(--bg)] text-[0.85rem] font-semibold uppercase tracking-wider hover:bg-[var(--gold-2)] transition-colors"
            >
              Voir le catalogue <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-[var(--r)] border border-[var(--border-2)] text-[var(--text)] text-[0.85rem] font-medium uppercase tracking-wider hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
