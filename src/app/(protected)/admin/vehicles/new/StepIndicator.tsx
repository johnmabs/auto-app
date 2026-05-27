import React from "react";
import { cn } from "@/lib/utils";

/* ── Step indicator ──────────────────────────────────────── */
export default function StepIndicator({
  current,
  steps,
}: {
  current: number;
  steps: string[];
}) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((step, i) => (
        <React.Fragment key={step}>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-[0.72rem] font-bold border transition-all",
                i < current && "bg-(--gold) border-(--gold) text-(--bg)",
                i === current &&
                  "bg-[rgba(201,168,76,0.15)] border-(--gold) text-(--gold)",
                i > current && "bg-(--bg-3) border-(--border) text-(--dim)",
              )}
            >
              {i < current ? "✓" : i + 1}
            </div>
            <span
              className={cn(
                "text-[0.75rem] font-medium hidden sm:block",
                i === current
                  ? "text-(--gold)"
                  : i < current
                    ? "text-(--muted)"
                    : "text-(--dim)",
              )}
            >
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                "flex-1 h-px mx-3",
                i < current ? "bg-(--gold)" : "bg-(--border)",
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
