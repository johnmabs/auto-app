"use client";

import * as React from "react";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { submitContactForm } from "@/actions/contact.actions";
import { COMPANY_INFO } from "@/constants/company";
import { cn } from "@/lib/utils";

/* ── Input component ─────────────────────────────────────── */
function FormInput({
  label,
  id,
  required,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  id: string;
  error?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[0.68rem] uppercase tracking-widest text-(--dim) mb-1.5 font-medium"
      >
        {label}
        {required && <span className="text-(--accent) ml-0.5">*</span>}
      </label>
      <input
        id={id}
        required={required}
        className={cn(
          "w-full bg-(--bg-3) border rounded-(--r)",
          "px-4 py-3 text-[0.88rem] text-(--text) placeholder:text-(--dim)",
          "outline-none transition-colors duration-150",
          error
            ? "border-(--accent) focus:border-(--accent)"
            : "border-(--border) focus:border-(--gold)",
        )}
        {...props}
      />
      {error && <p className="text-[0.72rem] text-(--accent) mt-1">{error}</p>}
    </div>
  );
}

/* ── Contact card ────────────────────────────────────────── */
function ContactCard({
  icon,
  title,
  value,
  href,
  sub,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  href?: string;
  sub?: string;
}) {
  const content = (
    <div className="flex items-start gap-4">
      <div className="w-11 h-11 rounded-(--r-lg) bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.18)] flex items-center justify-center text-(--gold) shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[0.72rem] uppercase tracking-[0.08em] text-(--dim) mb-0.5">
          {title}
        </p>
        <p className="text-[0.9rem] font-medium">{value}</p>
        {sub && <p className="text-[0.75rem] text-(--muted) mt-0.5">{sub}</p>}
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block hover:opacity-80 transition-opacity">
        {content}
      </a>
    );
  }
  return <div>{content}</div>;
}

/* ── Contact form ────────────────────────────────────────── */
function ContactForm() {
  const [loading, setLoading] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const result = await submitContactForm({
        firstName: data.get("firstName") as string,
        lastName: data.get("lastName") as string,
        email: data.get("email") as string,
        phone: data.get("phone") as string,
        subject: data.get("subject") as string,
        message: data.get("message") as string,
        honeypot: data.get("website") as string,
      });

      if (result.success) {
        setSent(true);
        toast.success("Message envoyé !", {
          description: "Nous vous répondrons sous 24h.",
        });
        form.reset();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Erreur lors de l'envoi. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-[rgba(46,204,113,0.12)] border border-[rgba(46,204,113,0.3)] flex items-center justify-center text-(--green) text-2xl mb-5">
          ✓
        </div>
        <h3 className="font-display text-2xl tracking-wider mb-2">
          MESSAGE ENVOYÉ !
        </h3>
        <p className="text-[0.88rem] text-(--muted) mb-6">
          Merci ! Nous vous répondrons dans les 24 heures.
        </p>
        <button
          onClick={() => setSent(false)}
          className="text-[0.8rem] text-(--gold) hover:underline"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Honeypot */}
      <input
        type="text"
        name="website"
        className="hidden"
        tabIndex={-1}
        aria-hidden="true"
      />

      <div className="grid grid-cols-2 gap-4">
        <FormInput
          id="firstName"
          name="firstName"
          label="Prénom"
          placeholder="Jean"
          required
        />
        <FormInput
          id="lastName"
          name="lastName"
          label="Nom"
          placeholder="Dupont"
          required
        />
      </div>

      <FormInput
        id="email"
        name="email"
        type="email"
        label="Email"
        placeholder="jean@exemple.com"
        required
      />
      <FormInput
        id="phone"
        name="phone"
        type="tel"
        label="Téléphone / WhatsApp"
        placeholder="+242 06…"
        required
      />

      <div>
        <label
          htmlFor="subject"
          className="block text-[0.68rem] uppercase tracking-widest text-(--dim) mb-1.5 font-medium"
        >
          Sujet <span className="text-(--accent)">*</span>
        </label>
        <select
          id="subject"
          name="subject"
          required
          className="w-full bg-(--bg-3) border border-(--border) rounded-(--r) px-4 py-3 text-[0.88rem] text-(--text) outline-none focus:border-(--gold) transition-colors [&>option]:bg-(--bg-2)"
        >
          <option value="">Choisir un sujet</option>
          <option value="Demande de devis">Demande de devis</option>
          <option value="Renseignements véhicule">
            Renseignements véhicule
          </option>
          <option value="Importation personnalisée">
            Importation personnalisée
          </option>
          <option value="Service après-vente">Service après-vente</option>
          <option value="Partenariat">Partenariat</option>
          <option value="Autre">Autre</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-[0.68rem] uppercase tracking-widest text-(--dim) mb-1.5 font-medium"
        >
          Message <span className="text-(--accent)">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Décrivez votre projet en détail : modèle souhaité, budget, délai, pays de livraison…"
          className="w-full bg-(--bg-3) border border-(--border) rounded-(--r) px-4 py-3 text-[0.88rem] text-(--text) placeholder:text-(--dim) outline-none focus:border-(--gold) transition-colors resize-none"
        />
      </div>

      <Button
        type="submit"
        fullWidth
        size="lg"
        loading={loading}
        iconRight={<ArrowRight className="h-4 w-4" />}
      >
        Envoyer le message
      </Button>

      <p className="text-[0.72rem] text-(--dim) text-center">
        En soumettant ce formulaire, vous acceptez notre{" "}
        <a
          href="/politique-confidentialite"
          className="text-(--gold) hover:underline"
        >
          politique de confidentialité
        </a>
        .
      </p>
    </form>
  );
}

/* ── Page ────────────────────────────────────────────────── */
export default function ContactPage() {
  return (
    <div className="pt-(--nav-h)">
      {/* Hero */}
      <div className="bg-(--bg-2) border-b border-(--border) px-6 lg:px-10 py-16">
        <div className="max-w-7xl mx-auto">
          <p className="section-tag mb-4" aria-hidden="true">
            Contactez-nous
          </p>
          <h1 className="font-display text-[clamp(2.8rem,7vw,4rem)] tracking-[0.04em] leading-[0.95]">
            PARLONS DE
            <br />
            <span className="text-(--gold)">VOTRE PROJET</span>
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16">
          {/* Form */}
          <div>
            <h2 className="font-semibold text-[1rem] mb-6 pb-4 border-b border-(--border)">
              Envoyez-nous un message
            </h2>
            <ContactForm />
          </div>

          {/* Info */}
          <div className="space-y-6">
            {/* Coordinates */}
            <div className="bg-(--bg-2) border border-(--border) rounded-(--r-lg) p-6 space-y-5">
              <h2 className="font-semibold text-[0.88rem] pb-3 border-b border-(--border) uppercase tracking-[0.06em]">
                Coordonnées
              </h2>
              <ContactCard
                icon={<Phone className="h-5 w-5" />}
                title="Téléphone"
                value={COMPANY_INFO.phone}
                href={`tel:${COMPANY_INFO.phone}`}
                sub="Disponible Lun–Sam 8h–18h"
              />
              <ContactCard
                icon={<Mail className="h-5 w-5" />}
                title="Email"
                value={COMPANY_INFO.email}
                href={`mailto:${COMPANY_INFO.email}`}
                sub="Réponse sous 24h"
              />
              <ContactCard
                icon={<MapPin className="h-5 w-5" />}
                title="Adresse"
                value="Avenue de l'Indépendance"
                sub="Pointe-Noire, République du Congo"
              />
              <ContactCard
                icon={<Clock className="h-5 w-5" />}
                title="Horaires"
                value="Lun – Sam : 8h00 – 18h00"
                sub="Dimanche : fermé"
              />
            </div>

            {/* WhatsApp CTA */}
            <div className="bg-[rgba(37,211,102,0.06)] border border-[rgba(37,211,102,0.2)] rounded-(--r-lg) p-6">
              <div className="flex items-start gap-4 mb-4">
                <MessageCircle
                  className="h-8 w-8 text-[#25D366] shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <h3 className="font-semibold text-[0.95rem] mb-1">
                    WhatsApp Business
                  </h3>
                  <p className="text-[0.8rem] text-(--muted) leading-[1.6]">
                    La méthode la plus rapide ! Discutez directement avec un
                    conseiller expert en importation automobile.
                  </p>
                </div>
              </div>
              <a
                href={`https://wa.me/${COMPANY_INFO.whatsapp.replace(/\D/g, "")}?text=Bonjour+Autostore+!+Je+souhaite+un+renseignement.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-(--r) bg-[#25D366] text-white text-[0.85rem] font-semibold uppercase tracking-wider hover:bg-[#1ebe5c] transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                Ouvrir WhatsApp
              </a>
            </div>

            {/* FAQ rapide */}
            <div className="bg-(--bg-2) border border-(--border) rounded-(--r-lg) p-6">
              <h3 className="font-semibold text-[0.88rem] mb-4 uppercase tracking-[0.06em]">
                Questions fréquentes
              </h3>
              <div className="space-y-4">
                {[
                  {
                    q: "Quel est le délai d'importation ?",
                    a: "4 à 8 semaines selon le pays d'origine et les formalités douanières.",
                  },
                  {
                    q: "Le devis est-il gratuit ?",
                    a: "Oui, 100% gratuit et sans engagement.",
                  },
                  {
                    q: "Livrez-vous dans toute l'Afrique ?",
                    a: "Oui, nous livrons dans toute l'Afrique subsaharienne et au Maghreb.",
                  },
                ].map((item) => (
                  <div key={item.q}>
                    <p className="text-[0.82rem] font-medium mb-1">{item.q}</p>
                    <p className="text-[0.78rem] text-(--muted) leading-[1.6]">
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
