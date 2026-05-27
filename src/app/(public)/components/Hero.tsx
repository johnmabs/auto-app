"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import SearchBar from "./HeroSearchBar";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Stat {
  value: string;
  label: string;
}

interface TrustBadge {
  icon: string;
  text: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const STATS: Stat[] = [
  { value: "100+", label: "Véhicules" },
  { value: "100+", label: "Clients" },
  { value: "10+", label: "Marques" },
];

const TRUST_BADGES: TrustBadge[] = [
  { icon: "✦", text: "Véhicules d'occasion certifiés" },
  { icon: "✦", text: "Estimation immédiate" },
  { icon: "✦", text: "Livraison en 24 heures" },
];

// ─── Subtle animated noise overlay ────────────────────────────────────────────

const NoiseOverlay = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 z-1 opacity-[0.035]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      backgroundRepeat: "repeat",
      backgroundSize: "128px 128px",
    }}
  />
);

// ─── Single animated stat ──────────────────────────────────────────────────────

const StatItem = ({ value, label, delay }: Stat & { delay: number }) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`
        transition-all duration-700
        ${visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
      `}
    >
      <p className="font-display text-3xl font-bold tracking-tight text-white lg:text-4xl">
        {value}
      </p>
      <p className="mt-1 text-xs font-medium uppercase tracking-widest text-white/40">
        {label}
      </p>
    </div>
  );
};

// ─── Main Hero Section ─────────────────────────────────────────────────────────

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger entrance animations after mount
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      aria-label="Présentation Autostore Congo"
      className="relative min-h-3/4 w-full overflow-hidden bg-gradient-hero"
    >
      {/* ── Radial ambient glow ─────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/4 h-175 w-175 -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(251,191,36,0.06) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-60 right-0 h-150 w-150 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(251,191,36,0.04) 0%, transparent 70%)",
        }}
      />

      {/* ── Subtle noise texture ────────────────────────────────────────── */}
      <NoiseOverlay />

      {/* ── Top gradient border ─────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(251,191,36,0.3), transparent)",
        }}
      />

      {/* ── Inner layout ────────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto grid min-h-screen max-w-350 grid-cols-1 gap-0 px-5 py-10 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-14 lg:py-0">
        {/* ── LEFT: Text content ──────────────────────────────────────── */}
        <div className="flex flex-col justify-center lg:py-24">
          {/* Badge */}
          <div
            className={`
              mb-8 inline-flex w-fit items-center gap-2 rounded-full
              border border-amber-400/20 bg-amber-400/[0.07] px-4 py-2
              transition-all duration-700 delay-100
              ${mounted ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"}
            `}
          >
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-amber-400"
            />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-400">
              Importateur certifié
            </span>
          </div>

          {/* Headline */}
          <h1
            className={`mb-6 font-display leading-[1.06] tracking-[-0.03em] text-(--text) text-[clamp(2.6rem,6vw,5rem)] font-bold transition-all duration-700 delay-200 ${mounted ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}
            `}
          >
            VOITURES{" "}
            <span
              className="relative inline-block"
              style={{
                background:
                  "linear-gradient(135deg, #fbbf24 20%, #f59e0b 60%, #d97706 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              D&apos;OCCASION
            </span>{" "}
            <br className="hidden sm:block" />
            IMPORTÉES
          </h1>

          {/* Supporting paragraph */}
          <p
            className={`mb-10 max-w-md text-base leading-relaxed text-(--text) transition-all duration-700 delay-300 ${mounted ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}
            `}
          >
            Des véhicules sélectionnés depuis la Chine, la Corée, le Japan,
            l&apos;Europe et les USA. Chaque voiture est vérifiée, documentée et
            livrée à Pointe-Noire.
          </p>

          {/* CTA Buttons */}
          <div
            className={`mb-10 flex flex-wrap gap-4 transition-all duration-700 delay-400 ${mounted ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}
          >
            {/* Primary CTA */}
            <Link
              href="/catalog"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl bg-amber-400 px-7 py-4 text-sm font-bold tracking-wide text-zinc-900 transition-all duration-300 hover:bg-amber-300 hover:shadow-[0_0_40px_rgba(251,191,36,0.35)] active:scale-95"
            >
              {/* shimmer sweep */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-500 group-hover:translate-x-full"
              />
              <span>Voir le catalogue</span>
              <svg
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>

            {/* Secondary CTA */}
            <a
              href="#"
              className="group inline-flex items-center gap-2 rounded-2xl border border-(--border) bg-(--bg-2) px-7 py-4 text-sm font-semibold tracking-wide text-white/70 backdrop-blur-sm transition-all duration-300 hover:border-(--border-2) hover:bg-(--bg-4) hover:text-white active:scale-95"
            >
              <span>Demander un devis</span>
              <svg
                aria-hidden="true"
                className="h-4 w-4 opacity-50 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Search bar */}
          <div
            className={`
              mb-12 transition-all duration-700 delay-500
              ${mounted ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}
            `}
          >
            <SearchBar />
          </div>

          {/* Stats row */}
          <div
            className={`flex items-start gap-10 border-t border-white/[0.07] pt-8 transition-all duration-700 delay-600 ${mounted ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}
          >
            {STATS.map((stat, i) => (
              <StatItem key={stat.label} {...stat} delay={700 + i * 120} />
            ))}
          </div>
        </div>

        {/* ── RIGHT: Vehicle visual ───────────────────────────────────── */}
        <div
          className={`
            relative flex items-center justify-center
            lg:py-16
            transition-all duration-1000 delay-300
            ${mounted ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}
          `}
        >
          {/* Outer glow ring */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-3xl"
            style={{
              background:
                "radial-gradient(ellipse at 60% 50%, rgba(251,191,36,0.07) 0%, transparent 65%)",
            }}
          />

          {/* Card container */}
          <div className="relative w-full max-w-165">
            {/* Main image card */}
            <div className="relative h-85 overflow-hidden rounded-3xl border border-white/[0.07] bg-dark-925 shadow-[0_40px_120px_rgba(0,0,0,0.6)] sm:h-105 lg:h-130">
              {/* Replace /car-hero.jpg with your actual image in /public */}
              <Image
                alt="Luxury sports car — the centrepiece of our premium vehicle marketplace"
                className="object-cover object-center"
                fill
                priority
                quality={90}
                sizes="(max-width: 768px) 100vw, 50vw"
                src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=85&auto=format&fit=crop"
              />

              {/* Dark gradient overlay at bottom */}
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(10,10,11,0.85) 0%, transparent 50%)",
                }}
              />

              {/* In-image vehicle badge */}
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-widest text-white/40">
                    À la une
                  </p>
                  <p className="mt-0.5 text-lg font-bold text-white">
                    Porsche 911 GT3 RS
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-medium uppercase tracking-widest text-white/40">
                    À partir de
                  </p>
                  <p className="mt-0.5 text-lg font-bold text-amber-400">
                    129,000,000 FCFA
                  </p>
                </div>
              </div>
            </div>

            {/* ── Floating trust-badge card ─────────────────────────── */}
            <div
              className="absolute -top-5 -left-4 sm:-left-8 flex flex-col gap-2.5 rounded-2xl border border-white/8 bg-[#13131a]/90 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl"
              style={{ minWidth: 192 }}
            >
              {TRUST_BADGES.map((badge) => (
                <div key={badge.text} className="flex items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className="text-[10px] text-amber-400"
                  >
                    {badge.icon}
                  </span>
                  <span className="text-[11px] font-medium text-white/60">
                    {badge.text}
                  </span>
                </div>
              ))}
            </div>

            {/* ── Floating availability card ────────────────────────── */}
            <div className="absolute -top-5 -right-4 sm:-right-8 flex items-center gap-3 rounded-2xl border border-white/8 bg-[#13131a]/90 px-4 py-3 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl">
              {/* Pulsing green dot */}
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
              <span className="text-[11px] font-medium text-white/60">
                <span className="font-bold text-white">5</span>nouvelles offres
                aujourd&apos;hui
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom fade ─────────────────────────────────────────────────── */}
      {/*       <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-24"
        style={{
          background:
            "linear-gradient(to top, rgba(10,10,11,0.6), transparent)",
        }}
      /> */}
    </section>
  );
}
