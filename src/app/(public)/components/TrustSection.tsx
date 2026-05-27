import { Shield, Star, Truck, Clock } from "lucide-react";

/* ── Trust Badges ────────────────────────────────────────── */
export default function TrustSection() {
  const badges = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Qualité garantie",
      desc: "Inspection technique complète avant expédition",
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Livraison sécurisée",
      desc: "Transport assuré de porte à porte",
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "98% satisfaction",
      desc: "Plus de 1 200 clients satisfaits depuis 2017",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Délais maîtrisés",
      desc: "4 à 8 semaines en moyenne selon l'origine",
    },
  ];

  return (
    <section
      className="py-16 px-6 lg:px-10 bg-[rgba(201,168,76,0.04)] border-y border-(--border)"
      aria-label="Nos engagements"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((b) => (
            <div key={b.title} className="flex items-start gap-4">
              <div
                className="shrink-0 w-11 h-11 rounded-(--r-lg) bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.2)] flex items-center justify-center"
                aria-hidden="true"
              >
                {b.icon}
              </div>
              <div>
                <p className="font-semibold text-[0.88rem] mb-1">{b.title}</p>
                <p className="text-[0.75rem] text-(--dim) leading-[1.6]">
                  {b.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
