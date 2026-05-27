import type { Metadata } from "next";
import { Suspense } from "react";

import { COMPANY_INFO } from "@/constants/company";
import { VehicleGridSkeleton } from "@/components/ui/Skeleton";
import HeroSection from "./components/Hero";
import Section from "./components/Section";
import RecentVehicles from "./components/RecentVehicles";
import TrustSection from "./components/TrustSection";
import FeaturedVehicles from "./components/FeaturedVehicles";
import CountriesSection from "./components/CountriesSection";
import ProcessSection from "./components/ProcessSection";
import TestimonialsSection from "./components/TestimonialsSection";
import CTASection from "./components/CTASection";

/* ── Metadata ────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: `${COMPANY_INFO.name} — Importateur de véhicules premium`,
  description:
    "Découvrez notre catalogue de véhicules d'exception importés depuis la Chine, Dubai, le Japon, l'Allemagne et plus. Qualité garantie, prix compétitifs.",
};

export default function Home() {
  return (
    <>
      <HeroSection />

      {/* Véhicules récents */}
      <Section
        tag="Catalogue"
        title={"VÉHICULES\nRÉCENTS"}
        viewAllHref="/catalog"
        className="pt-28"
      >
        <Suspense fallback={<VehicleGridSkeleton count={6} />}>
          <RecentVehicles />
        </Suspense>
      </Section>

      <TrustSection />

      {/* Véhicules coup de cœur */}
      <Section
        tag="Sélection"
        title={"COUPS DE\nCŒUR"}
        subtitle="Notre sélection de véhicules exceptionnels recommandés par nos experts."
        viewAllHref="/catalogue?featured=true"
        dark
      >
        <Suspense fallback={<VehicleGridSkeleton count={3} />}>
          <FeaturedVehicles />
        </Suspense>
      </Section>

      <CountriesSection />
      <ProcessSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
