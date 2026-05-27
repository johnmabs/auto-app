import { cn } from "@/lib/utils";
import { getCountryInfo } from "@/constants/countries";
import type { Country } from "@/types";

interface CountryBadgeProps {
  country: Country;
  size?: "sm" | "md" | "lg";
  variant?: "pill" | "flag" | "full";
  className?: string;
}

const SIZE_CLASSES = {
  sm: "text-[0.65rem] px-2 py-0.5 gap-1",
  md: "text-[0.72rem] px-2.5 py-1 gap-1.5",
  lg: "text-[0.8rem]  px-3   py-1.5 gap-2",
};

const FLAG_SIZES = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

export function CountryBadge({
  country,
  size = "md",
  variant = "pill",
  className,
}: CountryBadgeProps) {
  const info = getCountryInfo(country);

  if (variant === "flag") {
    return (
      <span
        className={cn(FLAG_SIZES[size], className)}
        title={info.name}
        aria-label={info.name}
      >
        {info.flag}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        "bg-[rgba(255,255,255,0.06)] border border-[rgba(201,168,76,0.2)]",
        "text-(--text) backdrop-blur-sm",
        SIZE_CLASSES[size],
        variant === "full" && "rounded-(--r)",
        className,
      )}
      title={`Importé depuis ${info.name}`}
    >
      <span aria-hidden="true">{info.flag}</span>
      {variant === "full" && (
        <span className="text-(--muted)">{info.name}</span>
      )}
    </span>
  );
}

/* ── Liste de pays ───────────────────────────────────────── */
export function CountryList({
  countries,
  size = "sm",
  className,
}: {
  countries: Country[];
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {countries.map((c) => (
        <CountryBadge key={c} country={c} size={size} variant="pill" />
      ))}
    </div>
  );
}
