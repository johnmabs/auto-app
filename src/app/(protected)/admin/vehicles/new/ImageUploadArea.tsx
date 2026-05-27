"use client";

import React from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import {
  uploadVehicleImage,
  type UploadedVehicleImage,
} from "@/actions/vehicle.actions";
import { cn } from "@/lib/utils";

/* ── Image upload area ───────────────────────────────────── */
export default function ImageUploadArea({
  images,
  onAdd,
  onRemove,
}: {
  images: UploadedVehicleImage[];
  onAdd: (images: UploadedVehicleImage[]) => void;
  onRemove: (i: number) => void;
}) {
  const [uploading, setUploading] = React.useState(false);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploaded: UploadedVehicleImage[] = [];

      for (const file of files) {
        const formData = new FormData();
        formData.set("file", file);

        const result = await uploadVehicleImage(formData);

        if (!result.success) {
          toast.error(result.error);
          continue;
        }

        uploaded.push({
          ...result.data,
          alt: file.name.replace(/\.[^.]+$/, ""),
        });
      }

      if (uploaded.length > 0) onAdd(uploaded);
    } catch (error) {
      console.error("[ImageUploadArea]", error);
      toast.error("Erreur lors de l'upload des images");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="space-y-3">
      {/* Upload zone */}
      <label
        className={cn(
          "flex flex-col items-center justify-center h-32 rounded-(--r-lg)",
          "border-2 border-dashed border-(--border) cursor-pointer",
          "hover:border-(--gold) hover:bg-[rgba(201,168,76,0.04)] transition-all",
          uploading && "opacity-50 pointer-events-none",
        )}
      >
        <Upload className="h-6 w-6 text-(--dim) mb-2" aria-hidden="true" />
        <p className="text-[0.82rem] text-(--muted)">
          {uploading
            ? "Upload en cours..."
            : "Glissez ou cliquez pour ajouter des photos"}
        </p>
        <p className="text-[0.7rem] text-(--dim) mt-0.5">
          JPG, PNG, WEBP · Max 10 Mo par image
        </p>
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFiles}
          disabled={uploading}
          aria-label="Sélectionner des images"
        />
      </label>

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, i) => (
            <div
              key={image.publicId}
              className="relative group aspect-video rounded-(--r) overflow-hidden border border-(--border) bg-(--bg-3)"
            >
              <Image
                src={image.url}
                alt={`Photo ${i + 1}`}
                fill
                className="object-cover"
              />

              {i === 0 && (
                <div className="absolute top-1 left-1 bg-(--gold) text-(--bg) text-[0.55rem] font-bold px-1.5 py-0.5 rounded z-10">
                  Principale
                </div>
              )}

              <button
                type="button"
                onClick={() => onRemove(i)}
                className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/70 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                aria-label={`Supprimer la photo ${i + 1}`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
