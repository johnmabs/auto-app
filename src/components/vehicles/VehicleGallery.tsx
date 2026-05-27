"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VehicleImage } from "@/types/index";

interface VehicleGalleryProps {
  images: VehicleImage[];
  vehicleName: string;
}

export function VehicleGallery({ images, vehicleName }: VehicleGalleryProps) {
  const [current, setCurrent] = React.useState(0);
  const [lightboxOpen, setLightbox] = React.useState(false);

  const sorted = React.useMemo(
    () =>
      [...images].sort((a, b) => {
        if (a.isPrimary && !b.isPrimary) return -1;
        if (!a.isPrimary && b.isPrimary) return 1;
        return a.order - b.order;
      }),
    [images],
  );

  const totalImages = sorted.length;
  const currentImage = sorted[current];

  /* Keyboard navigation */
  React.useEffect(() => {
    if (!lightboxOpen) return;

    function handler(e: KeyboardEvent) {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") setLightbox(false);
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, current]);

  function next() {
    setCurrent((v) => (v + 1) % totalImages);
  }
  function prev() {
    setCurrent((v) => (v - 1 + totalImages) % totalImages);
  }

  if (!currentImage) {
    return (
      <div className="h-105 bg-(--bg-3) rounded-(--r-lg) border border-(--border) flex items-center justify-center">
        <span className="text-7xl opacity-20" aria-hidden="true">
          🚗
        </span>
      </div>
    );
  }

  return (
    <>
      {/* ── Main view ────────────────────────────────── */}
      <div
        className={cn(
          "relative h-105 rounded-(--r-lg) overflow-hidden",
          "bg-(--bg-3) border border-(--border) group",
        )}
        role="img"
        aria-label={`${vehicleName} — Photo ${current + 1} sur ${totalImages}`}
      >
        <Image
          src={currentImage.url}
          alt={currentImage.alt ?? `${vehicleName} — photo ${current + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover transition-opacity duration-300"
          priority
        />

        {/* Counter */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1 text-[0.7rem] font-mono text-white">
          {current + 1} / {totalImages}
        </div>

        {/* Zoom button */}
        <button
          onClick={() => setLightbox(true)}
          className={cn(
            "absolute bottom-3 right-3",
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full",
            "bg-black/60 backdrop-blur-sm text-white text-[0.72rem]",
            "opacity-0 group-hover:opacity-100 transition-opacity",
            "hover:bg-(--gold) hover:text-(--bg)",
          )}
          aria-label="Agrandir l'image"
        >
          <ZoomIn className="h-3.5 w-3.5" aria-hidden="true" />
          Zoom
        </button>

        {/* Prev / Next */}
        {totalImages > 1 && (
          <>
            <button
              onClick={prev}
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2",
                "h-9 w-9 rounded-full bg-black/60 backdrop-blur-sm",
                "flex items-center justify-center text-white",
                "opacity-0 group-hover:opacity-100 transition-opacity",
                "hover:bg-(--gold) hover:text-(--bg)",
              )}
              aria-label="Photo précédente"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              onClick={next}
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2",
                "h-9 w-9 rounded-full bg-black/60 backdrop-blur-sm",
                "flex items-center justify-center text-white",
                "opacity-0 group-hover:opacity-100 transition-opacity",
                "hover:bg-(--gold) hover:text-(--bg)",
              )}
              aria-label="Photo suivante"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      {/* ── Thumbnails ───────────────────────────────── */}
      {totalImages > 1 && (
        <div
          className="flex gap-2.5 mt-3 overflow-x-auto pb-1 scrollbar-hide"
          role="tablist"
          aria-label="Vignettes de photos"
        >
          {sorted.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setCurrent(i)}
              role="tab"
              aria-selected={i === current}
              aria-label={`Photo ${i + 1}`}
              className={cn(
                "relative shrink-0 h-14.5 w-20.5 rounded-(--r) overflow-hidden",
                "border-2 transition-all duration-200",
                i === current
                  ? "border-(--gold) shadow-gold"
                  : "border-(--border) hover:border-(--border-2) opacity-60 hover:opacity-100",
              )}
            >
              <Image
                src={img.url}
                alt={img.alt ?? `Vignette ${i + 1}`}
                fill
                sizes="82px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* ── Lightbox ─────────────────────────────────── */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-sm"
          onClick={() => setLightbox(false)}
          role="dialog"
          aria-modal
          aria-label={`Visionneuse — ${vehicleName}`}
        >
          {/* Close */}
          <button
            onClick={() => setLightbox(false)}
            className={cn(
              "absolute top-4 right-4 z-10",
              "h-10 w-10 rounded-full bg-white/10 flex items-center justify-center",
              "text-white hover:bg-white/20 transition-colors",
            )}
            aria-label="Fermer la visionneuse"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[0.8rem] font-mono text-white/60">
            {current + 1} / {totalImages}
          </div>

          {/* Image */}
          <div
            className="relative w-full max-w-5xl max-h-[85vh] aspect-video mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={currentImage.url}
              alt={currentImage.alt ?? vehicleName}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>

          {/* Prev / Next lightbox */}
          {totalImages > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute left-4 h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                aria-label="Photo précédente"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute right-4 h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                aria-label="Photo suivante"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
