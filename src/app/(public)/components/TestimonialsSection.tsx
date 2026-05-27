import Section from "./Section";

/* ── Testimonials ────────────────────────────────────────── */
export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Marc Kouassi",
      location: "Abidjan, Côte d'Ivoire",
      initials: "MK",
      color: "rgba(201,168,76,0.15)",
      textColor: "var(--gold)",
      rating: 5,
      text: "Importation depuis le Japon réalisée en 6 semaines. Le véhicule était exactement comme décrit, en parfait état. Service exceptionnel du début à la fin.",
      vehicle: "Toyota Land Cruiser",
    },
    {
      name: "Fatou Diallo",
      location: "Dakar, Sénégal",
      initials: "FD",
      color: "rgba(52,152,219,0.15)",
      textColor: "var(--blue)",
      rating: 5,
      text: "BMW X7 importée depuis l'Allemagne. Prix 40% moins cher qu'un concessionnaire local. Autostore a géré tout le dédouanement. Je recommande vivement.",
      vehicle: "BMW X7",
    },
    {
      name: "Ahmed Benzara",
      location: "Casablanca, Maroc",
      initials: "AB",
      color: "rgba(46,204,113,0.15)",
      textColor: "var(--green)",
      rating: 5,
      text: "Troisième véhicule commandé via Autostore. Toujours aussi professionnel et rapide. Mon BYD électrique est arrivé parfaitement conditionné depuis la Chine.",
      vehicle: "BYD Tang EV",
    },
  ];

  return (
    <Section tag="Avis clients" title={"ILS NOUS FONT\nCONFIANCE"} dark>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {testimonials.map((t) => (
          <figure
            key={t.name}
            className="bg-(--bg-3) border border-(--border) rounded-(--r-lg) p-7"
          >
            {/* Stars */}
            <div
              className="flex gap-0.5 mb-4"
              aria-label={`Note : ${t.rating} étoiles sur 5`}
            >
              {Array.from({ length: t.rating }).map((_, i) => (
                <span
                  key={i}
                  className="bg-(--gold) text-sm"
                  aria-hidden="true"
                >
                  ★
                </span>
              ))}
            </div>

            {/* Quote */}
            <blockquote>
              <p className="text-(--muted) text-[0.88rem] leading-[1.75] italic mb-5">
                {t.text}
              </p>
            </blockquote>

            {/* Author */}
            <figcaption className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-[0.82rem] font-bold shrink-0"
                style={{ background: t.color, color: t.textColor }}
                aria-hidden="true"
              >
                {t.initials}
              </div>
              <div>
                <p className="font-medium text-[0.88rem]">{t.name}</p>
                <p className="text-[0.72rem] text-(--dim)">
                  {t.location} · {t.vehicle}
                </p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
