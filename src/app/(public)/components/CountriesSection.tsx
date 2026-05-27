import Link from "next/link";
import { cn } from "@/lib/utils";
import { COUNTRIES } from "@/constants/countries";
import Section from "./Section";

/* ── Countries Section ───────────────────────────────────── */
export default function CountriesSection() {
  return (
    <Section tag="Partenaires" title={"NOS PAYS\nPARTENAIRES"} dark>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {COUNTRIES.filter((c) => c.active).map((country) => (
          <Link
            key={country.code}
            href={`/catalogue?country=${country.code}`}
            className={cn(
              "group relative bg-(--bg-3) border border-(--border)",
              "rounded-(--r-lg) p-6 text-center",
              "transition-all duration-200 overflow-hidden",
              "hover:border-(--gold) hover:bg-(--bg-4)",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--gold)",
            )}
            aria-label={`Voir les véhicules importés de ${country.name}`}
          >
            {/* Gold top line on hover */}
            <div
              className="absolute top-0 left-0 right-0 h-0.5 bg-(--gold) scale-x-0 group-hover:scale-x-100 transition-transform"
              aria-hidden="true"
            />
            <div className="text-4xl mb-3" aria-hidden="true">
              {country.flag}
            </div>
            <p className="font-medium text-[0.9rem] mb-1">{country.name}</p>
            <p className="text-[0.72rem] text-(--muted) font-mono">
              {country.description.slice(0, 40)}…
            </p>
          </Link>
        ))}
      </div>
    </Section>
  );
}
