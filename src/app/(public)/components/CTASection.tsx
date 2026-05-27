import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

/* ── Final CTA ───────────────────────────────────────────── */
export default function CTASection() {
  return (
    <section
      className="relative py-28 px-6 lg:px-10 text-center overflow-hidden"
      aria-label="Appel à l'action final"
    >
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.06)_0%,transparent_65%)] pointer-events-none"
        aria-hidden="true"
      />
      <div className="max-w-3xl mx-auto relative">
        <p className="section-tag justify-center mb-5" aria-hidden="true">
          Démarrez maintenant
        </p>
        <h2 className="font-display text-[clamp(2.5rem,6vw,4rem)] tracking-wider leading-[0.95] mb-5">
          VOTRE PROCHAINE
          <br />
          VOITURE DE RÊVE
          <br />
          <span className="bg-(--gold)">VOUS ATTEND</span>
        </h2>
        <p className="text-[0.95rem] text-(--muted) mb-10 leading-relaxed">
          Contactez-nous aujourd&apos;hui et obtenez votre devis personnalisé
          gratuit sous 24h. Nos experts vous accompagnent de la sélection à la
          livraison.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/contact">
            <Button size="lg" iconRight={<ArrowRight className="h-4 w-4" />}>
              Demander un devis gratuit
            </Button>
          </Link>
          <Link href="/catalogue">
            <Button size="lg" variant="ghost">
              Voir le catalogue
            </Button>
          </Link>
        </div>

        {/* Social proof */}
        <p className="mt-10 text-[0.75rem] text-(--dim)">
          ✓ Réponse sous 24h &nbsp;·&nbsp; ✓ Devis gratuit et sans engagement
          &nbsp;·&nbsp; ✓ +1 200 clients satisfaits
        </p>
      </div>
    </section>
  );
}
