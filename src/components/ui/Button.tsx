"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

/* ── Variantes CVA ───────────────────────────────────────── */
const buttonVariants = cva(
  // Base
  [
    "inline-flex items-center justify-center gap-2",
    "font-sans font-medium tracking-wider uppercase",
    "rounded-[var(--r)] border transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]",
    "disabled:pointer-events-none disabled:opacity-40",
    "active:scale-[0.98]",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-[var(--gold)] text-[var(--bg)] border-[var(--gold)]",
          "hover:bg-[var(--gold-2)] hover:border-[var(--gold-2)]",
          "hover:-translate-y-px hover:shadow-lg hover:shadow-[rgba(201,168,76,0.2)]",
        ],
        ghost: [
          "bg-transparent text-[var(--text)] border-[var(--border-2)]",
          "hover:border-[var(--gold)] hover:bg-(--gold)",
        ],
        danger: [
          "bg-[var(--accent)] text-white border-[var(--accent)]",
          "hover:bg-red-600 hover:border-red-600",
        ],
        outline: [
          "bg-transparent bg-(--gold) border-[var(--gold)]",
          "hover:bg-[rgba(201,168,76,0.08)]",
        ],
        subtle: [
          "bg-[var(--bg-3)] text-[var(--text)] border-[var(--border)]",
          "hover:bg-[var(--bg-4)] hover:border-[var(--border-2)]",
        ],
        whatsapp: [
          "bg-[#25D366] text-white border-[#25D366]",
          "hover:bg-[#1ebe5c] hover:border-[#1ebe5c]",
          "hover:-translate-y-px",
        ],
        link: [
          "bg-transparent border-transparent bg-(--gold) p-0 h-auto",
          "hover:text-[var(--gold-2)] underline-offset-4 hover:underline",
          "uppercase-off tracking-normal normal-case",
        ],
      },
      size: {
        xs: "h-7  px-3   text-[0.65rem] gap-1.5",
        sm: "h-8  px-4   text-[0.72rem]",
        md: "h-10 px-6   text-[0.8rem]",
        lg: "h-12 px-8   text-[0.85rem]",
        xl: "h-14 px-10  text-[0.9rem]",
        icon: "h-9 w-9 p-0 tracking-normal normal-case",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

/* ── Props ───────────────────────────────────────────────── */
export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  asChild?: boolean;
}

/* ── Composant ───────────────────────────────────────────── */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      loading = false,
      icon,
      iconRight,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : icon ? (
          <span className="shrink-0" aria-hidden="true">
            {icon}
          </span>
        ) : null}

        {children && <span>{children}</span>}

        {iconRight && !loading && (
          <span className="shrink-0" aria-hidden="true">
            {iconRight}
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
