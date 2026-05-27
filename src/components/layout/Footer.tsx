import Link from "next/link";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { COMPANY_INFO } from "@/constants/company";
import { COUNTRIES } from "@/constants/countries";

const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "/services", label: "Services" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

const SERVICE_LINKS = [
  "Importation personnalisée",
  "Transport & livraison",
  "Dédouanement",
  "Inspection technique",
  "Assurance transit",
  "Financement",
];

const SOCIAL_LINKS = [
  { label: "Facebook", href: COMPANY_INFO.social.facebook, icon: "f" },
  { label: "Instagram", href: COMPANY_INFO.social.instagram, icon: "ig" },
  { label: "LinkedIn", href: COMPANY_INFO.social.linkedin, icon: "in" },
  { label: "Twitter", href: COMPANY_INFO.social.twitter, icon: "𝕏" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-(--bg-2) border-t border-(--border) mt-20"
      role="contentinfo"
      aria-label="Pied de page"
    >
      {/* ── Main footer ───────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-4">
              <span className="font-display text-[1.5rem] tracking-[0.08em] text-(--gold) leading-none">
                <span className="text-(--dim) opacity-60 mx-0.5"></span>
                <span className="text-(--text)">AUTO</span>STORE
              </span>
            </div>

            <p className="text-[0.83rem] text-(--dim) leading-7 mb-6 max-w-70">
              Spécialiste de l&apos;importation de véhicules d&apos;occasion
              depuis la Chine, l&apos;Europe et le Japan.
            </p>

            {/* Contact info */}
            <ul className="space-y-2.5" aria-label="Coordonnées">
              <li>
                <a
                  href={`tel:${COMPANY_INFO.phone}`}
                  className="flex items-center gap-2.5 text-[0.8rem] text-(--dim) hover:bg-(--gold) transition-colors group"
                >
                  <Phone
                    className="h-3.5 w-3.5 shrink-0 group-hover:bg-(--gold)"
                    aria-hidden="true"
                  />
                  <span className="font-mono">{COMPANY_INFO.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${COMPANY_INFO.email}`}
                  className="flex items-center gap-2.5 text-[0.8rem] text-(--dim) hover:bg-(--gold) transition-colors group"
                >
                  <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{COMPANY_INFO.email}</span>
                </a>
              </li>
              <li>
                <address className="not-italic flex items-start gap-2.5 text-[0.8rem] text-(--dim)">
                  <MapPin
                    className="h-3.5 w-3.5 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>{COMPANY_INFO.address}</span>
                </address>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-(--muted) mb-5">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[0.83rem] text-(--dim) hover:bg-(--gold) transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-(--muted) mb-5">
              Services
            </h3>
            <ul className="space-y-2.5">
              {SERVICE_LINKS.map((service) => (
                <li key={service}>
                  <Link
                    href="/services"
                    className="text-[0.83rem] text-(--dim) hover:bg-(--gold) transition-colors"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pays partenaires */}
          <div>
            <h3 className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-(--muted) mb-5">
              Pays partenaires
            </h3>
            <ul className="space-y-2">
              {COUNTRIES.filter((c) => c.active).map((country) => (
                <li key={country.code}>
                  <Link
                    href={`/catalogue?country=${country.code}`}
                    className="flex items-center gap-2 text-[0.83rem] text-(--dim) hover:bg-(--gold) transition-colors"
                  >
                    <span aria-hidden="true">{country.flag}</span>
                    <span>{country.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── WhatsApp CTA ─────────────────────────────── */}
        <div className="bg-[rgba(37,211,102,0.06)] border border-[rgba(37,211,102,0.2)] rounded-(--r-lg) p-5 mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <MessageCircle
            className="h-8 w-8 text-[#25D366] shrink-0"
            aria-hidden="true"
          />
          <div className="flex-1 min-w-0">
            <p className="text-[0.88rem] font-medium mb-0.5">
              Discutez avec un conseiller sur WhatsApp
            </p>
            <p className="text-[0.78rem] text-(--muted)">
              Réponse rapide en heures ouvrables · Lun–Sam 8h–18h
            </p>
          </div>
          <a
            href={`https://wa.me/${COMPANY_INFO.whatsapp.replace(/\D/g, "")}?text=Bonjour+Autostore+!+Je+souhaite+des+informations.`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-(--r)",
              "bg-[#25D366] text-white text-[0.8rem] font-medium uppercase tracking-wider",
              "hover:bg-[#1ebe5c] transition-colors",
            )}
          >
            Ouvrir WhatsApp
          </a>
        </div>

        {/* ── Bottom bar ───────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-(--border)">
          <p className="text-[0.75rem] text-(--dim)">
            © {currentYear} {COMPANY_INFO.name}. Tous droits réservés.{" "}
            Importateur certifié international.
          </p>

          {/* Social links */}
          <div
            className="flex items-center gap-2"
            role="list"
            aria-label="Réseaux sociaux"
          >
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "h-8 w-8 flex items-center justify-center rounded-(--r)",
                  "border border-(--border) text-(--dim)",
                  "text-[0.75rem] font-medium",
                  "hover:border-(--gold) hover:bg-(--gold) transition-all",
                )}
                aria-label={social.label}
                role="listitem"
              >
                {social.icon}
              </a>
            ))}
          </div>

          {/* Legal */}
          <div className="flex items-center gap-4 text-[0.72rem] text-(--dim)">
            <Link
              href="/mentions-legales"
              className="hover:bg-(--gold) transition-colors"
            >
              Mentions légales
            </Link>
            <Link
              href="/politique-confidentialite"
              className="hover:bg-(--gold) transition-colors"
            >
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
