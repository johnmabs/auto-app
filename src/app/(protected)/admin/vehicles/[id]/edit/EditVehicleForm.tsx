"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import {
  updateVehicle,
  type UploadedVehicleImage,
} from "@/actions/vehicle.actions";
import { COUNTRIES } from "@/constants/countries";
import {
  FUEL_TYPE_OPTIONS,
  TRANSMISSION_OPTIONS,
  VEHICLE_MAKES,
  VEHICLE_STATUS_OPTIONS,
  VEHICLE_TYPE_OPTIONS,
} from "@/constants/vehicles";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Field from "../../new/Field";
import FeaturesInput from "../../new/FeaturesInput";
import ImageUploadArea from "../../new/ImageUploadArea";

type EditVehicleState = {
  make: string;
  model: string;
  variant: string;
  year: number;
  type: string;
  color: string;
  interiorColor: string;
  engine: string;
  power: string;
  torque: string;
  fuelType: string;
  transmission: string;
  mileage: string;
  doors: string;
  seats: string;
  acceleration: string;
  topSpeed: string;
  consumption: string;
  autonomy: string;
  price: string;
  comparePrice: string;
  status: string;
  stock: string;
  priceNegotiable: boolean;
  originCountry: string;
  customsCleared: boolean;
  chassisNumber: string;
  description: string;
  isFeatured: boolean;
  isPopular: boolean;
  features: string[];
  metaTitle: string;
  metaDescription: string;
};

export type EditableVehicle = {
  id: string;
  make: string;
  model: string;
  variant: string | null;
  year: number;
  type: string;
  color: string;
  interiorColor: string | null;
  engine: string | null;
  power: number | null;
  torque: number | null;
  fuelType: string;
  transmission: string;
  mileage: number;
  doors: number;
  seats: number;
  acceleration: number | null;
  topSpeed: number | null;
  consumption: number | null;
  autonomy: number | null;
  price: number;
  comparePrice: number | null;
  status: string;
  stock: number;
  priceNegotiable: boolean;
  originCountry: string;
  customsCleared: boolean;
  chassisNumber: string | null;
  description: string | null;
  isFeatured: boolean;
  isPopular: boolean;
  features: string[];
  metaTitle: string | null;
  metaDescription: string | null;
  images: UploadedVehicleImage[];
};

const inputCls =
  "w-full bg-[var(--bg-3)] border border-[var(--border)] rounded-[var(--r)] px-3 py-2.5 text-[0.88rem] text-[var(--text)] placeholder:text-[var(--dim)] outline-none focus:border-[var(--gold)] transition-colors";
const selectCls = inputCls + " cursor-pointer [&>option]:bg-[var(--bg-2)]";

function toState(vehicle: EditableVehicle): EditVehicleState {
  return {
    make: vehicle.make,
    model: vehicle.model,
    variant: vehicle.variant ?? "",
    year: vehicle.year,
    type: vehicle.type,
    color: vehicle.color,
    interiorColor: vehicle.interiorColor ?? "",
    engine: vehicle.engine ?? "",
    power: vehicle.power?.toString() ?? "",
    torque: vehicle.torque?.toString() ?? "",
    fuelType: vehicle.fuelType,
    transmission: vehicle.transmission,
    mileage: vehicle.mileage.toString(),
    doors: vehicle.doors.toString(),
    seats: vehicle.seats.toString(),
    acceleration: vehicle.acceleration?.toString() ?? "",
    topSpeed: vehicle.topSpeed?.toString() ?? "",
    consumption: vehicle.consumption?.toString() ?? "",
    autonomy: vehicle.autonomy?.toString() ?? "",
    price: vehicle.price.toString(),
    comparePrice: vehicle.comparePrice?.toString() ?? "",
    status: vehicle.status,
    stock: vehicle.stock.toString(),
    priceNegotiable: vehicle.priceNegotiable,
    originCountry: vehicle.originCountry,
    customsCleared: vehicle.customsCleared,
    chassisNumber: vehicle.chassisNumber ?? "",
    description: vehicle.description ?? "",
    isFeatured: vehicle.isFeatured,
    isPopular: vehicle.isPopular,
    features: vehicle.features,
    metaTitle: vehicle.metaTitle ?? "",
    metaDescription: vehicle.metaDescription ?? "",
  };
}

function optionalNumber(value: string) {
  return value ? Number(value) : undefined;
}

export default function EditVehicleForm({
  vehicle,
}: {
  vehicle: EditableVehicle;
}) {
  const router = useRouter();
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState(() => toState(vehicle));
  const [images, setImages] = React.useState<UploadedVehicleImage[]>(
    () => vehicle.images,
  );

  function set<K extends keyof EditVehicleState>(
    key: K,
    value: EditVehicleState[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateImageAlt(index: number, alt: string) {
    setImages((prev) =>
      prev.map((image, idx) => (idx === index ? { ...image, alt } : image)),
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    try {
      const result = await updateVehicle(
        vehicle.id,
        {
          make: form.make,
          model: form.model,
          variant: form.variant || undefined,
          year: Number(form.year),
          type: form.type as never,
          engine: form.engine || undefined,
          power: optionalNumber(form.power),
          torque: optionalNumber(form.torque),
          fuelType: form.fuelType as never,
          transmission: form.transmission as never,
          mileage: Number(form.mileage),
          color: form.color,
          interiorColor: form.interiorColor || undefined,
          doors: optionalNumber(form.doors),
          seats: optionalNumber(form.seats),
          acceleration: optionalNumber(form.acceleration),
          topSpeed: optionalNumber(form.topSpeed),
          consumption: optionalNumber(form.consumption),
          autonomy: optionalNumber(form.autonomy),
          price: Number(form.price),
          comparePrice: optionalNumber(form.comparePrice),
          priceNegotiable: form.priceNegotiable,
          status: form.status as never,
          stock: optionalNumber(form.stock),
          originCountry: form.originCountry as never,
          customsCleared: form.customsCleared,
          chassisNumber: form.chassisNumber || undefined,
          description: form.description || undefined,
          features: form.features,
          isFeatured: form.isFeatured,
          isPopular: form.isPopular,
          metaTitle: form.metaTitle || undefined,
          metaDescription: form.metaDescription || undefined,
        },
        images,
      );

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("Véhicule mis à jour");
      router.push("/admin/vehicules");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Link
            href="/admin/vehicules"
            className="inline-flex items-center gap-2 text-[0.78rem] text-(--muted) hover:text-(--gold) transition-colors mb-3"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Retour
          </Link>
          <h1 className="font-display text-[2.2rem] tracking-[0.04em]">
            MODIFIER LE VÉHICULE
          </h1>
          <p className="text-[0.82rem] text-(--muted) mt-1">
            {vehicle.make} {vehicle.model}
          </p>
        </div>
        <Button type="submit" loading={saving} icon={<Save className="h-4 w-4" />}>
          Enregistrer
        </Button>
      </div>

      <section className="bg-(--bg-2) border border-(--border) rounded-(--r-lg) p-7 space-y-4">
        <h2 className="font-semibold text-[0.95rem] pb-3 border-b border-(--border)">
          Identité
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Marque" required>
            <input
              list="edit-makes-list"
              value={form.make}
              onChange={(e) => set("make", e.target.value)}
              className={inputCls}
              required
            />
            <datalist id="edit-makes-list">
              {VEHICLE_MAKES.map((make) => (
                <option key={make} value={make} />
              ))}
            </datalist>
          </Field>
          <Field label="Modèle" required>
            <input
              value={form.model}
              onChange={(e) => set("model", e.target.value)}
              className={inputCls}
              required
            />
          </Field>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Version / Trim">
            <input
              value={form.variant}
              onChange={(e) => set("variant", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Année" required>
            <input
              type="number"
              value={form.year}
              onChange={(e) => set("year", Number(e.target.value))}
              min={1990}
              max={2030}
              className={inputCls}
              required
            />
          </Field>
          <Field label="Type" required>
            <select
              value={form.type}
              onChange={(e) => set("type", e.target.value)}
              className={selectCls}
            >
              {VEHICLE_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Couleur extérieure" required>
            <input
              value={form.color}
              onChange={(e) => set("color", e.target.value)}
              className={inputCls}
              required
            />
          </Field>
          <Field label="Couleur intérieure">
            <input
              value={form.interiorColor}
              onChange={(e) => set("interiorColor", e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>
      </section>

      <section className="bg-(--bg-2) border border-(--border) rounded-(--r-lg) p-7 space-y-4">
        <h2 className="font-semibold text-[0.95rem] pb-3 border-b border-(--border)">
          Technique
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Carburant" required>
            <select
              value={form.fuelType}
              onChange={(e) => set("fuelType", e.target.value)}
              className={selectCls}
            >
              {FUEL_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Transmission" required>
            <select
              value={form.transmission}
              onChange={(e) => set("transmission", e.target.value)}
              className={selectCls}
            >
              {TRANSMISSION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Moteur">
            <input
              value={form.engine}
              onChange={(e) => set("engine", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Puissance (ch)">
            <input
              type="number"
              value={form.power}
              onChange={(e) => set("power", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Couple (Nm)">
            <input
              type="number"
              value={form.torque}
              onChange={(e) => set("torque", e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Kilométrage" required>
            <input
              type="number"
              value={form.mileage}
              onChange={(e) => set("mileage", e.target.value)}
              className={inputCls}
              required
            />
          </Field>
          <Field label="Portes">
            <input
              type="number"
              value={form.doors}
              onChange={(e) => set("doors", e.target.value)}
              min={2}
              max={6}
              className={inputCls}
            />
          </Field>
          <Field label="Places">
            <input
              type="number"
              value={form.seats}
              onChange={(e) => set("seats", e.target.value)}
              min={1}
              max={9}
              className={inputCls}
            />
          </Field>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Field label="0-100 km/h (s)">
            <input
              type="number"
              step="0.1"
              value={form.acceleration}
              onChange={(e) => set("acceleration", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Vmax (km/h)">
            <input
              type="number"
              value={form.topSpeed}
              onChange={(e) => set("topSpeed", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Conso (L/100)">
            <input
              type="number"
              step="0.1"
              value={form.consumption}
              onChange={(e) => set("consumption", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Autonomie (km)">
            <input
              type="number"
              value={form.autonomy}
              onChange={(e) => set("autonomy", e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>
        <Field label="Équipements & Options">
          <FeaturesInput
            features={form.features}
            onChange={(features) => set("features", features)}
          />
        </Field>
        <Field label="Description">
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={5}
            className={cn(inputCls, "resize-none")}
          />
        </Field>
      </section>

      <section className="bg-(--bg-2) border border-(--border) rounded-(--r-lg) p-7 space-y-4">
        <h2 className="font-semibold text-[0.95rem] pb-3 border-b border-(--border)">
          Prix, stock et publication
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Prix de vente ($)" required>
            <input
              type="number"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              className={inputCls}
              required
            />
          </Field>
          <Field label="Prix barré ($)">
            <input
              type="number"
              value={form.comparePrice}
              onChange={(e) => set("comparePrice", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Stock">
            <input
              type="number"
              value={form.stock}
              onChange={(e) => set("stock", e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Statut">
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
              className={selectCls}
            >
              {VEHICLE_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Pays d'importation" required>
            <select
              value={form.originCountry}
              onChange={(e) => set("originCountry", e.target.value)}
              className={selectCls}
            >
              {COUNTRIES.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Numéro de châssis (VIN)">
          <input
            value={form.chassisNumber}
            onChange={(e) => set("chassisNumber", e.target.value)}
            maxLength={17}
            className={inputCls}
          />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(
            [
              { key: "priceNegotiable", label: "Prix négociable" },
              { key: "customsCleared", label: "Dédouanement effectué" },
              { key: "isFeatured", label: "Coup de cœur" },
              { key: "isPopular", label: "Populaire" },
            ] as const
          ).map((option) => (
            <label
              key={option.key}
              className="flex items-center gap-3 cursor-pointer text-[0.85rem]"
            >
              <input
                type="checkbox"
                checked={form[option.key]}
                onChange={(e) => set(option.key, e.target.checked)}
                className="w-4 h-4 accent-(--gold) rounded"
              />
              {option.label}
            </label>
          ))}
        </div>
      </section>

      <section className="bg-(--bg-2) border border-(--border) rounded-(--r-lg) p-7 space-y-4">
        <h2 className="font-semibold text-[0.95rem] pb-3 border-b border-(--border)">
          Photos
        </h2>
        <ImageUploadArea
          images={images}
          onAdd={(uploaded) => setImages((prev) => [...prev, ...uploaded])}
          onRemove={(index) =>
            setImages((prev) => prev.filter((_, idx) => idx !== index))
          }
        />
        <p className="text-[0.72rem] text-(--dim)">
          La première image de la liste sera utilisée comme photo principale.
        </p>
        {images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {images.map((image, index) => (
              <Field key={image.publicId} label={`Texte alternatif ${index + 1}`}>
                <input
                  value={image.alt ?? ""}
                  onChange={(event) => updateImageAlt(index, event.target.value)}
                  placeholder={`${form.make} ${form.model} - photo ${index + 1}`}
                  className={inputCls}
                />
              </Field>
            ))}
          </div>
        )}
      </section>

      <section className="bg-(--bg-2) border border-(--border) rounded-(--r-lg) p-7 space-y-4">
        <h2 className="font-semibold text-[0.95rem] pb-3 border-b border-(--border)">
          SEO
        </h2>
        <Field label="Titre SEO">
          <input
            value={form.metaTitle}
            onChange={(e) => set("metaTitle", e.target.value)}
            maxLength={70}
            className={inputCls}
          />
        </Field>
        <Field label="Description SEO">
          <textarea
            value={form.metaDescription}
            onChange={(e) => set("metaDescription", e.target.value)}
            maxLength={160}
            rows={3}
            className={cn(inputCls, "resize-none")}
          />
        </Field>
      </section>

      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Annuler
        </Button>
        <Button type="submit" loading={saving} icon={<Save className="h-4 w-4" />}>
          Enregistrer
        </Button>
      </div>
    </form>
  );
}
