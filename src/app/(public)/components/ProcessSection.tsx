import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

import Section from "./Section";

/* ── Process Section ─────────────────────────────────────── */
export default function ProcessSection() {
  const steps = [
    {
      num: "01",
      title: "Sélection",
      desc: "Choisissez dans notre catalogue ou faites une demande personnalisée.",
    },
    {
      num: "02",
      title: "Devis",
      desc: "Recevez un devis complet incluant tous les frais d'importation.",
    },
    {
      num: "03",
      title: "Inspection",
      desc: "Inspection rigoureuse par nos techniciens certifiés avant expédition.",
    },
    {
      num: "04",
      title: "Dédouanement",
      desc: "Nous gérons toutes les formalités douanières et administratives.",
    },
    {
      num: "05",
      title: "Livraison",
      desc: "Votre véhicule livré chez vous, clé en main, prêt à rouler.",
    },
  ];

  return (
    <Section
      tag="Comment ça marche"
      title={"PROCESSUS\nD'IMPORTATION"}
      subtitle="Un accompagnement complet de la sélection à la livraison."
    >
      <div className="relative">
        {/* Connecting line */}
        <div
          className="absolute top-7 left-[10%] right-[10%] h-px bg-linear-to-r from-transparent via-(--border-2) to-transparent hidden lg:block"
          aria-hidden="true"
        />

        <ol className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          {steps.map((step) => (
            <li
              key={step.num}
              className="flex flex-col items-center text-center"
            >
              {/* Number circle */}
              <div
                className={cn(
                  "relative z-10 w-14 h-14 rounded-full border border-(--border-2)",
                  "flex items-center justify-center mb-5",
                  "bg-(--bg) font-display text-[1.4rem] tracking-[0.04em]",
                )}
                aria-hidden="true"
              >
                {step.num}
                <div
                  className="absolute -inset-1.25 rounded-full border border-[rgba(201,168,76,0.15)]"
                  aria-hidden="true"
                />
              </div>
              <h3 className="font-semibold text-[0.9rem] mb-2 tracking-[0.02em]">
                {step.title}
              </h3>
              <p className="text-[0.78rem] text-(--dim) leading-[1.65]">
                {step.desc}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {/* CTA */}
      <div className="text-center mt-14">
        <Link href="/services">
          <Button
            variant="ghost"
            iconRight={<ArrowRight className="h-4 w-4" />}
          >
            En savoir plus sur nos services
          </Button>
        </Link>
      </div>
    </Section>
  );
}
