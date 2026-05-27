"use client";

import { cn, buildWhatsAppUrl, buildVehicleWhatsAppMessage } from "@/lib/utils";
import { COMPANY_INFO, WHATSAPP_NUMBER } from "@/constants/company";
import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  message?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: number;
  vehicleUrl?: string;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const SIZE_CLASSES = {
  sm: "h-9  px-4 text-xs  gap-1.5",
  md: "h-11 px-6 text-sm  gap-2",
  lg: "h-13 px-8 text-base gap-2.5",
};

const ICON_SIZES = {
  sm: "h-3.5 w-3.5",
  md: "h-4   w-4",
  lg: "h-5   w-5",
};

export function WhatsAppButton({
  message,
  vehicleMake,
  vehicleModel,
  vehicleYear,
  vehicleUrl,
  size = "md",
  fullWidth = false,
  className,
  children,
}: WhatsAppButtonProps) {
  const finalMessage =
    message ??
    (vehicleMake && vehicleModel && vehicleYear && vehicleUrl
      ? buildVehicleWhatsAppMessage(
          vehicleMake,
          vehicleModel,
          vehicleYear,
          vehicleUrl,
        )
      : `Bonjour ${COMPANY_INFO.name} ! Je souhaite des informations sur vos véhicules.`);

  const href = buildWhatsAppUrl(WHATSAPP_NUMBER, finalMessage);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center rounded-(--r)",
        "bg-[#25D366] text-white font-medium font-sans uppercase tracking-wider",
        "border border-[#25D366]",
        "transition-all duration-200",
        "hover:bg-[#1ebe5c] hover:border-[#1ebe5c] hover:-translate-y-px",
        "active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2",
        SIZE_CLASSES[size],
        fullWidth && "w-full",
        className,
      )}
      aria-label="Contacter sur WhatsApp"
    >
      <MessageCircle
        className={cn(ICON_SIZES[size], "shrink-0")}
        aria-hidden="true"
      />
      <span>{children ?? "Contacter sur WhatsApp"}</span>
    </a>
  );
}
