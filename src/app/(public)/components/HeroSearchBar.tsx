import { useState } from "react";

// ─── Floating search card ──────────────────────────────────────────────────────
export default function SearchBar() {
  const [focused, setFocused] = useState(false);
  return (
    <div
      className={`
        relative flex items-center gap-3 rounded-2xl border px-5 py-4
        transition-all duration-300
        ${
          focused
            ? "border-amber-400/50 bg-white/10 shadow-[0_0_0_4px_rgba(251,191,36,0.08)]"
            : "border-black/15 bg-white/5"
        }
      `}
    >
      {/* Search icon */}
      <svg
        aria-hidden="true"
        className="h-5 w-5 shrink-0 text-black/40"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>

      <input
        aria-label="Rechercher des véhicules par marque, modèle ou mot-clé"
        className="w-full bg-transparent text-sm text-(--text) placeholder-(dark-800)/30 outline-none"
        onBlur={() => setFocused(false)}
        onFocus={() => setFocused(true)}
        placeholder="Rechercher des véhicules par marque, modèle ou mot-clé"
        type="search"
      />

      <button
        aria-label="Lancer une recherche de véhicule"
        className="shrink-0 rounded-xl bg-amber-400 px-4 py-2 text-xs font-semibold tracking-wide text-zinc-900 transition-all duration-200 hover:bg-amber-300 hover:shadow-[0_0_20px_rgba(251,191,36,0.4)] active:scale-95"
      >
        Rechercher
      </button>
    </div>
  );
}
