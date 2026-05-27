import { cn } from "@/lib/utils";

interface PriceTagProps {
  price: number;
  comparePrice?: number;
  size?: "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
  label?: string;
  className?: string;
}

const SIZE_CLASSES = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-4xl",
  xl: "text-5xl",
};

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XAF",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function PriceTag({
  price,
  comparePrice,
  size = "md",
  showLabel = true,
  label = "Prix TTC",
  className,
}: PriceTagProps) {
  const hasDiscount = comparePrice !== undefined && comparePrice > price;
  const discount = hasDiscount
    ? Math.round(((comparePrice - price) / comparePrice) * 100)
    : 0;

  return (
    <div className={cn("flex flex-col", className)}>
      {showLabel && (
        <span className="text-[0.65rem] uppercase tracking-widest text-(--dim) mb-1">
          {label}
        </span>
      )}

      <div className="flex items-baseline gap-2 flex-wrap">
        <span
          className={cn(
            "font-display text-(--gold) leading-none",
            SIZE_CLASSES[size],
          )}
        >
          {formatPrice(price)}
        </span>

        {hasDiscount && (
          <>
            <span className="text-sm text-(--dim) line-through">
              {formatPrice(comparePrice)}
            </span>
            <span className="text-xs font-semibold text-(--green) bg-[rgba(46,204,113,0.1)] border border-[rgba(46,204,113,0.25)] px-1.5 py-0.5 rounded-full">
              -{discount}%
            </span>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Compact inline price ────────────────────────────────── */
export function PriceInline({
  price,
  className,
}: {
  price: number;
  className?: string;
}) {
  return (
    <span className={cn("font-display text-(--gold)", className)}>
      {formatPrice(price)}
    </span>
  );
}
