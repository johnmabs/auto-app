"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Root ─────────────────────────────────────────────────── */
const Modal = Dialog.Root;
const ModalTrigger = Dialog.Trigger;
const ModalClose = Dialog.Close;

/* ── Portal + Overlay ─────────────────────────────────────── */
const ModalPortal = ({ children }: { children: React.ReactNode }) => (
  <Dialog.Portal>{children}</Dialog.Portal>
);

const ModalOverlay = React.forwardRef<
  React.ComponentRef<typeof Dialog.Overlay>,
  React.ComponentPropsWithoutRef<typeof Dialog.Overlay>
>(({ className, ...props }, ref) => (
  <Dialog.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50",
      "bg-black/70 backdrop-blur-sm",
      // Animations Radix data-state
      "data-[state=open]:animate-fade-in",
      "data-[state=closed]:animate-[fade-in_0.15s_ease_reverse]",
      className,
    )}
    {...props}
  />
));
ModalOverlay.displayName = "ModalOverlay";

/* ── Content ─────────────────────────────────────────────── */
interface ModalContentProps extends React.ComponentPropsWithoutRef<
  typeof Dialog.Content
> {
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showClose?: boolean;
}

const SIZES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
  full: "max-w-5xl",
};

const ModalContent = React.forwardRef<
  React.ComponentRef<typeof Dialog.Content>,
  ModalContentProps
>(({ className, children, size = "md", showClose = true, ...props }, ref) => (
  <ModalPortal>
    <ModalOverlay />
    <Dialog.Content
      ref={ref}
      className={cn(
        // Position
        "fixed left-1/2 top-1/2 z-50",
        "-translate-x-1/2 -translate-y-1/2",
        // Sizing
        "w-[calc(100vw-2rem)]",
        SIZES[size],
        // Style
        "bg-(--bg-2) border border-(--border-2) rounded-(--r-xl)",
        "shadow-[0_40px_100px_rgba(0,0,0,0.6)]",
        "p-8",
        // Animations
        "data-[state=open]:animate-scale-in",
        "data-[state=closed]:animate-[scale-in_0.15s_ease_reverse]",
        // Scrollable si contenu long
        "max-h-[90vh] overflow-y-auto",
        className,
      )}
      {...props}
    >
      {children}

      {showClose && (
        <Dialog.Close
          className={cn(
            "absolute right-5 top-5",
            "h-8 w-8 rounded-(--r)",
            "flex items-center justify-center",
            "text-(--muted) hover:text-(--text) hover:bg-(--bg-4)",
            "transition-all duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--gold)",
          )}
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </Dialog.Close>
      )}
    </Dialog.Content>
  </ModalPortal>
));
ModalContent.displayName = "ModalContent";

/* ── Header ──────────────────────────────────────────────── */
const ModalHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mb-6 pr-8", className)} {...props} />
);

/* ── Title ───────────────────────────────────────────────── */
const ModalTitle = React.forwardRef<
  React.ComponentRef<typeof Dialog.Title>,
  React.ComponentPropsWithoutRef<typeof Dialog.Title>
>(({ className, ...props }, ref) => (
  <Dialog.Title
    ref={ref}
    className={cn(
      "font-display text-3xl tracking-wider text-(--text) mb-2",
      className,
    )}
    {...props}
  />
));
ModalTitle.displayName = "ModalTitle";

/* ── Description ─────────────────────────────────────────── */
const ModalDescription = React.forwardRef<
  React.ComponentRef<typeof Dialog.Description>,
  React.ComponentPropsWithoutRef<typeof Dialog.Description>
>(({ className, ...props }, ref) => (
  <Dialog.Description
    ref={ref}
    className={cn("text-sm text-(--muted) leading-relaxed", className)}
    {...props}
  />
));
ModalDescription.displayName = "ModalDescription";

/* ── Footer ──────────────────────────────────────────────── */
const ModalFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex gap-3 mt-8 pt-6 border-t border-(--border)", className)}
    {...props}
  />
);

/* ── Field (formulaire) ───────────────────────────────────── */
const ModalField = ({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("space-y-1.5 mb-4", className)}>
    <label className="block text-[0.68rem] uppercase tracking-widest text-(--dim) font-medium">
      {label}
    </label>
    {children}
    {error && <p className="text-[0.72rem] text-(--accent) mt-1">{error}</p>}
  </div>
);

/* ── Input standard ──────────────────────────────────────── */
const ModalInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full bg-(--bg-3) border border-(--border) rounded-(--r)",
      "px-4 py-2.5 text-[0.88rem] text-(--text) placeholder:text-(--dim)",
      "outline-none transition-colors duration-150",
      "focus:border-(--gold)",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      className,
    )}
    {...props}
  />
));
ModalInput.displayName = "ModalInput";

/* ── Textarea standard ───────────────────────────────────── */
const ModalTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full bg-(--bg-3) border border-(--border) rounded-(--r)",
      "px-4 py-2.5 text-[0.88rem] text-(--text) placeholder:text-(--dim)",
      "outline-none transition-colors duration-150 resize-none",
      "focus:border-(--gold)",
      className,
    )}
    {...props}
  />
));
ModalTextarea.displayName = "ModalTextarea";

/* ── Select standard ─────────────────────────────────────── */
const ModalSelect = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "w-full bg-(--bg-3) border border-(--border) rounded-(--r)",
      "px-4 py-2.5 text-[0.88rem] text-(--text)",
      "outline-none transition-colors duration-150 cursor-pointer",
      "focus:border-(--gold)",
      "[&>option]:bg-(--bg-2)",
      className,
    )}
    {...props}
  />
));
ModalSelect.displayName = "ModalSelect";

export {
  Modal,
  ModalTrigger,
  ModalClose,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalField,
  ModalInput,
  ModalTextarea,
  ModalSelect,
};
