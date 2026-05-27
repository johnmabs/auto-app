import React from "react";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Input ───────────────────────────────────────────────── */
const inputCls =
  "w-full bg-[var(--bg-3)] border border-[var(--border)] rounded-[var(--r)] px-3 py-2.5 text-[0.88rem] text-[var(--text)] placeholder:text-[var(--dim)] outline-none focus:border-[var(--gold)] transition-colors";

/* ── Features input ──────────────────────────────────────── */
export default function FeaturesInput({
  features,
  onChange,
}: {
  features: string[];
  onChange: (f: string[]) => void;
}) {
  const [input, setInput] = React.useState("");

  function add() {
    const trimmed = input.trim();
    if (trimmed && !features.includes(trimmed)) {
      onChange([...features, trimmed]);
      setInput("");
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder="Ex: GPS, Caméra de recul, Toit panoramique..."
          className={cn(inputCls, "flex-1")}
          aria-label="Ajouter un équipement"
        />
        <button
          type="button"
          onClick={add}
          className="h-10 w-10 flex items-center justify-center rounded-(--r) bg-(--gold) text-(--bg) hover:bg-(--gold-2) transition-colors"
          aria-label="Ajouter"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      {features.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {features.map((f) => (
            <span
              key={f}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.72rem] bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.25)] text-(--gold)"
            >
              {f}
              <button
                type="button"
                onClick={() => onChange(features.filter((x) => x !== f))}
                aria-label={`Supprimer ${f}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
