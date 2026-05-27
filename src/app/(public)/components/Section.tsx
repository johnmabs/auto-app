import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Section wrapper ─────────────────────────────────────── */
export default function Section({
  tag,
  title,
  subtitle,
  children,
  className,
  viewAllHref,
  dark,
}: {
  tag: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  viewAllHref?: string;
  dark?: boolean;
}) {
  return (
    <section
      className={cn("py-24 px-6 lg:px-10", dark && "bg-(--bg-2)", className)}
      aria-labelledby={`section-${tag}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="section-tag mb-3" aria-hidden="true">
              {tag}
            </p>
            <h2
              id={`section-${tag}`}
              className="font-display text-[clamp(2.2rem,5vw,3rem)] tracking-[0.04em] leading-[1.02]"
            >
              {title}
            </h2>
            {subtitle && (
              <p className="text-[0.9rem] text-(--muted) mt-3 max-w-lg leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className={cn(
                "hidden sm:inline-flex items-center gap-2 shrink-0",
                "text-[0.78rem] font-medium uppercase tracking-widest",
                "border border-(--border-2) text-(--text) px-5 py-2.5 rounded-(--r)",
                "hover:border-(--gold) hover:bg-(--gold) transition-all",
              )}
            >
              Voir tout <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {children}
      </div>
    </section>
  );
}
