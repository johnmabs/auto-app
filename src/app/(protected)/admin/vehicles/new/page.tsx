"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import {
  createVehicle,
  type UploadedVehicleImage,
} from "@/actions/vehicle.actions";
import { COUNTRIES } from "@/constants/countries";
import {
  VEHICLE_MAKES,
  VEHICLE_TYPE_OPTIONS,
  FUEL_TYPE_OPTIONS,
  TRANSMISSION_OPTIONS,
  VEHICLE_STATUS_OPTIONS,
} from "@/constants/vehicles";
import { cn } from "@/lib/utils";
import StepIndicator from "./StepIndicator";
import Field from "./Field";
import FeaturesInput from "./FeaturesInput";
import ImageUploadArea from "./ImageUploadArea";

/* ── Types ───────────────────────────────────────────────── */
interface FormState {
  // Identité
  make: string;
  model: string;
  variant: string;
  year: number;
  type: string;
  color: string;
  interiorColor: string;
  // Technique
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
  // Prix & stock
  price: string;
  comparePrice: string;
  status: string;
  stock: string;
  priceNegotiable: boolean;
  originCountry: string;
  customsCleared: boolean;
  chassisNumber: string;
  // Contenu
  description: string;
  isFeatured: boolean;
  isPopular: boolean;
  features: string[];
  // SEO
  metaTitle: string;
  metaDescription: string;
}

const INITIAL_FORM: FormState = {
  make: "",
  model: "",
  variant: "",
  year: new Date().getFullYear(),
  type: "SUV",
  color: "",
  interiorColor: "",
  engine: "",
  power: "",
  torque: "",
  fuelType: "GASOLINE",
  transmission: "AUTOMATIC",
  mileage: "0",
  doors: "4",
  seats: "5",
  acceleration: "",
  topSpeed: "",
  consumption: "",
  autonomy: "",
  price: "",
  comparePrice: "",
  status: "DRAFT",
  stock: "1",
  priceNegotiable: false,
  originCountry: "CHINA",
  customsCleared: false,
  chassisNumber: "",
  description: "",
  isFeatured: false,
  isPopular: false,
  features: [],
  metaTitle: "",
  metaDescription: "",
};

type StringFormField = {
  [K in keyof FormState]: FormState[K] extends string ? K : never;
}[keyof FormState];

type BooleanFormField = {
  [K in keyof FormState]: FormState[K] extends boolean ? K : never;
}[keyof FormState];

const STRING_FORM_FIELDS: readonly StringFormField[] = [
  "make",
  "model",
  "variant",
  "type",
  "color",
  "interiorColor",
  "engine",
  "power",
  "torque",
  "fuelType",
  "transmission",
  "mileage",
  "doors",
  "seats",
  "acceleration",
  "topSpeed",
  "consumption",
  "autonomy",
  "price",
  "comparePrice",
  "status",
  "stock",
  "originCountry",
  "chassisNumber",
  "description",
  "metaTitle",
  "metaDescription",
];

const BOOLEAN_FORM_FIELDS: readonly BooleanFormField[] = [
  "priceNegotiable",
  "customsCleared",
  "isFeatured",
  "isPopular",
];

const STEPS = ["Identité", "Technique", "Prix & Stock", "Médias", "SEO"];
const STORAGE_KEY = "nouveau-vehicule-draft";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseSavedForm(saved: string): FormState | null {
  const parsed: unknown = JSON.parse(saved);

  if (!isRecord(parsed)) {
    return null;
  }

  const restored: FormState = { ...INITIAL_FORM };

  for (const key of STRING_FORM_FIELDS) {
    const value = parsed[key];
    if (typeof value === "string") {
      restored[key] = value;
    }
  }

  for (const key of BOOLEAN_FORM_FIELDS) {
    const value = parsed[key];
    if (typeof value === "boolean") {
      restored[key] = value;
    }
  }

  if (typeof parsed.year === "number" && Number.isFinite(parsed.year)) {
    restored.year = parsed.year;
  } else if (typeof parsed.year === "string" && parsed.year.trim() !== "") {
    const year = Number(parsed.year);
    if (Number.isFinite(year)) {
      restored.year = year;
    }
  }

  if (Array.isArray(parsed.features)) {
    restored.features = parsed.features.filter(
      (feature): feature is string => typeof feature === "string",
    );
  }

  return restored;
}

function removeSavedFormDraft() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

function readSavedFormDraft(): FormState | null {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return null;
    }

    return parseSavedForm(saved);
  } catch {
    return null;
  }
}

function subscribeToHydrationStore() {
  return () => {};
}

function getClientHydrationSnapshot() {
  return true;
}

function getServerHydrationSnapshot() {
  return false;
}

/* ── Input ───────────────────────────────────────────────── */
const inputCls =
  "w-full bg-[var(--bg-3)] border border-[var(--border)] rounded-[var(--r)] px-3 py-2.5 text-[0.88rem] text-[var(--text)] placeholder:text-[var(--dim)] outline-none focus:border-[var(--gold)] transition-colors";
const selectCls = inputCls + " cursor-pointer [&>option]:bg-[var(--bg-2)]";

/* ── Page ────────────────────────────────────────────────── */
export default function NouveauVehiculePage() {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [saving, setSaving] = React.useState(false);
  const [images, setImages] = React.useState<UploadedVehicleImage[]>([]);
  const hydrated = React.useSyncExternalStore(
    subscribeToHydrationStore,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  );

  const savedForm = React.useMemo(
    () => (hydrated ? readSavedFormDraft() : null),
    [hydrated],
  );
  const [editedForm, setEditedForm] = React.useState<FormState | null>(null);
  const form = editedForm ?? savedForm ?? INITIAL_FORM;

  // FIX: Persistance automatique à chaque changement de formulaire
  React.useEffect(() => {
    if (!hydrated) {
      return;
    }

    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    } catch {
      // sessionStorage indisponible (ex: mode privé saturé) — on continue sans planter
    }
  }, [form, hydrated]);

  // FIX: set() est maintenant strictement typé — une clé invalide est une erreur TypeScript
  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setEditedForm((prev) => ({ ...(prev ?? form), [key]: value }));
  }

  function clearDraft() {
    removeSavedFormDraft();
  }

  async function handleSubmit(statusOverride?: "AVAILABLE" | "DRAFT") {
    setSaving(true);
    try {
      const status = statusOverride ?? form.status;
      const result = await createVehicle(
        {
          make: form.make,
          model: form.model,
          variant: form.variant || undefined,
          year: Number(form.year),
          type: form.type as never,
          engine: form.engine || undefined,
          power: form.power ? Number(form.power) : undefined,
          torque: form.torque ? Number(form.torque) : undefined,
          fuelType: form.fuelType as never,
          transmission: form.transmission as never,
          mileage: Number(form.mileage),
          color: form.color,
          interiorColor: form.interiorColor || undefined,
          doors: Number(form.doors),
          seats: Number(form.seats),
          acceleration: form.acceleration
            ? Number(form.acceleration)
            : undefined,
          topSpeed: form.topSpeed ? Number(form.topSpeed) : undefined,
          consumption: form.consumption ? Number(form.consumption) : undefined,
          autonomy: form.autonomy ? Number(form.autonomy) : undefined,
          price: Number(form.price),
          comparePrice: form.comparePrice
            ? Number(form.comparePrice)
            : undefined,
          priceNegotiable: form.priceNegotiable,
          status: status as never,
          stock: Number(form.stock),
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

      if (result.success) {
        clearDraft();
        toast.success("Véhicule créé avec succès !");
        router.push("/admin/vehicules");
      } else {
        console.log(result.fieldErrors);
        toast.error(result.error);
      }
    } catch {
      toast.error("Erreur lors de la création");
    } finally {
      setSaving(false);
    }
  }

  // FIX: retourne un booléen explicite, plus de valeur implicite de la dernière expression
  function canNext(): boolean {
    if (step === 0) {
      return !!(
        form.make &&
        form.model &&
        form.year &&
        form.type &&
        form.color
      );
    }
    if (step === 2) {
      return !!(form.price && form.originCountry);
    }
    return true;
  }

  // FIX: navigation bornée des deux côtés
  function goNext() {
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  }
  function goPrev() {
    setStep((s) => Math.max(0, s - 1));
  }

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-[2.2rem] tracking-[0.04em]">
          AJOUTER UN VÉHICULE
        </h1>
        <p className="text-[0.82rem] text-(--muted) mt-1">
          Remplissez les informations étape par étape
        </p>
      </div>

      {/* Step indicator */}
      <StepIndicator current={step} steps={STEPS} />

      {/* Form card */}
      <div className="bg-(--bg-2) border border-(--border) rounded-(--r-lg) p-7">
        {/* ── Step 0: Identité ────────────────────────── */}
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-[0.95rem] mb-5 pb-3 border-b border-(--border)">
              Identité du véhicule
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Marque" required>
                <input
                  list="makes-list"
                  value={form.make}
                  onChange={(e) => set("make", e.target.value)}
                  placeholder="BMW"
                  className={inputCls}
                  required
                />
                <datalist id="makes-list">
                  {VEHICLE_MAKES.map((m) => (
                    <option key={m} value={m} />
                  ))}
                </datalist>
              </Field>
              <Field label="Modèle" required>
                <input
                  value={form.model}
                  onChange={(e) => set("model", e.target.value)}
                  placeholder="X7"
                  className={inputCls}
                  required
                />
              </Field>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Version / Trim">
                <input
                  value={form.variant}
                  onChange={(e) => set("variant", e.target.value)}
                  placeholder="M50i"
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
                  {VEHICLE_TYPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Couleur extérieure" required>
                <input
                  value={form.color}
                  onChange={(e) => set("color", e.target.value)}
                  placeholder="Blanc Alpine"
                  className={inputCls}
                  required
                />
              </Field>
              <Field label="Couleur intérieure">
                <input
                  value={form.interiorColor}
                  onChange={(e) => set("interiorColor", e.target.value)}
                  placeholder="Cuir noir"
                  className={inputCls}
                />
              </Field>
            </div>
          </div>
        )}

        {/* ── Step 1: Technique ───────────────────────── */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-[0.95rem] mb-5 pb-3 border-b border-(--border)">
              Caractéristiques techniques
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Carburant" required>
                <select
                  value={form.fuelType}
                  onChange={(e) => set("fuelType", e.target.value)}
                  className={selectCls}
                >
                  {FUEL_TYPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
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
                  {TRANSMISSION_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Moteur">
                <input
                  value={form.engine}
                  onChange={(e) => set("engine", e.target.value)}
                  placeholder="4.4L V8 Biturbo"
                  className={inputCls}
                />
              </Field>
              <Field label="Puissance (ch)">
                <input
                  type="number"
                  value={form.power}
                  onChange={(e) => set("power", e.target.value)}
                  placeholder="530"
                  className={inputCls}
                />
              </Field>
              <Field label="Couple (Nm)">
                <input
                  type="number"
                  value={form.torque}
                  onChange={(e) => set("torque", e.target.value)}
                  placeholder="750"
                  className={inputCls}
                />
              </Field>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Kilométrage" required>
                <input
                  type="number"
                  value={form.mileage}
                  onChange={(e) => set("mileage", e.target.value)}
                  min={0}
                  placeholder="18200"
                  className={inputCls}
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
            <div className="grid grid-cols-4 gap-4">
              <Field label="0-100 km/h (s)">
                <input
                  type="number"
                  step="0.1"
                  value={form.acceleration}
                  onChange={(e) => set("acceleration", e.target.value)}
                  placeholder="5.4"
                  className={inputCls}
                />
              </Field>
              <Field label="Vmax (km/h)">
                <input
                  type="number"
                  value={form.topSpeed}
                  onChange={(e) => set("topSpeed", e.target.value)}
                  placeholder="250"
                  className={inputCls}
                />
              </Field>
              <Field label="Conso (L/100)">
                <input
                  type="number"
                  step="0.1"
                  value={form.consumption}
                  onChange={(e) => set("consumption", e.target.value)}
                  placeholder="9.5"
                  className={inputCls}
                />
              </Field>
              <Field label="Autonomie (km)">
                <input
                  type="number"
                  value={form.autonomy}
                  onChange={(e) => set("autonomy", e.target.value)}
                  placeholder="600"
                  className={inputCls}
                />
              </Field>
            </div>
            <Field
              label="Équipements & Options"
              hint="Appuyez sur Entrée pour ajouter"
            >
              <FeaturesInput
                features={form.features}
                onChange={(f) => set("features", f)}
              />
            </Field>
            <Field label="Description">
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={4}
                placeholder="Description détaillée du véhicule..."
                className={cn(inputCls, "resize-none")}
              />
            </Field>
          </div>
        )}

        {/* ── Step 2: Prix & Stock ─────────────────────── */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-[0.95rem] mb-5 pb-3 border-b border-(--border)">
              Prix, stock et importation
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Prix de vente ($)" required>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  placeholder="75000"
                  className={inputCls}
                  required
                />
              </Field>
              <Field label="Prix barré / comparaison ($)">
                <input
                  type="number"
                  value={form.comparePrice}
                  onChange={(e) => set("comparePrice", e.target.value)}
                  placeholder="95000"
                  className={inputCls}
                />
              </Field>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Statut">
                <select
                  value={form.status}
                  onChange={(e) => set("status", e.target.value)}
                  className={selectCls}
                >
                  {VEHICLE_STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Stock">
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => set("stock", e.target.value)}
                  min={0}
                  className={inputCls}
                />
              </Field>
              <Field label="Pays d'importation" required>
                <select
                  value={form.originCountry}
                  onChange={(e) => set("originCountry", e.target.value)}
                  className={selectCls}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Numéro de châssis (VIN)">
              <input
                value={form.chassisNumber}
                onChange={(e) => set("chassisNumber", e.target.value)}
                placeholder="WBA7G4C51KG123456"
                className={inputCls}
                maxLength={17}
              />
            </Field>
            <div className="flex flex-col gap-3 pt-2">
              {(
                [
                  { key: "priceNegotiable", label: "Prix négociable" },
                  { key: "customsCleared", label: "Dédouanement effectué" },
                  { key: "isFeatured", label: "Coup de cœur (mis en avant)" },
                  { key: "isPopular", label: "Marquer comme populaire" },
                ] as const
              ).map((opt) => (
                <label
                  key={opt.key}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={form[opt.key]}
                    onChange={(e) => set(opt.key, e.target.checked)}
                    className="w-4 h-4 accent-(--gold) rounded"
                  />
                  <span className="text-[0.85rem]">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 3: Médias ──────────────────────────── */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-[0.95rem] mb-5 pb-3 border-b border-(--border)">
              Photos du véhicule
            </h2>
            <ImageUploadArea
              images={images}
              onAdd={(urls) => setImages((p) => [...p, ...urls])}
              onRemove={(i) =>
                setImages((p) => p.filter((_, idx) => idx !== i))
              }
            />
            <p className="text-[0.72rem] text-(--dim)">
              La première image sera utilisée comme photo principale. Recommandé
              : minimum 4 photos.
            </p>
          </div>
        )}

        {/* ── Step 4: SEO ─────────────────────────────── */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-[0.95rem] mb-5 pb-3 border-b border-(--border)">
              Référencement (SEO)
            </h2>
            <Field label="Titre SEO" hint="70 caractères maximum recommandés">
              <input
                value={form.metaTitle}
                onChange={(e) => set("metaTitle", e.target.value)}
                placeholder={`${form.make} ${form.model} ${form.year} — Autostore Congo`}
                maxLength={70}
                className={inputCls}
              />
              <p className="text-[0.65rem] text-(--dim) mt-0.5">
                {form.metaTitle.length}/70
              </p>
            </Field>
            <Field
              label="Description SEO"
              hint="160 caractères maximum recommandés"
            >
              <textarea
                value={form.metaDescription}
                onChange={(e) => set("metaDescription", e.target.value)}
                placeholder={`${form.make} ${form.model} ${form.year} importé depuis ${form.originCountry}...`}
                maxLength={160}
                rows={3}
                className={cn(inputCls, "resize-none")}
              />
              <p className="text-[0.65rem] text-(--dim) mt-0.5">
                {form.metaDescription.length}/160
              </p>
            </Field>

            {/* Summary */}
            <div className="mt-6 bg-(--bg-3) border border-(--border) rounded-(--r-lg) p-5">
              <h3 className="font-medium text-[0.85rem] mb-3">
                Résumé avant publication
              </h3>
              <div className="grid grid-cols-2 gap-2 text-[0.78rem]">
                <div>
                  <span className="text-(--dim)">Véhicule :</span>{" "}
                  <span>
                    {form.make} {form.model} {form.year}
                  </span>
                </div>
                <div>
                  <span className="text-(--dim)">Prix :</span>{" "}
                  <span className="text-(--gold)">
                    ${Number(form.price).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-(--dim)">Statut :</span>{" "}
                  <span>{form.status}</span>
                </div>
                <div>
                  <span className="text-(--dim)">Pays :</span>{" "}
                  <span>{form.originCountry}</span>
                </div>
                <div>
                  <span className="text-(--dim)">Photos :</span>{" "}
                  <span>
                    {images.length} image{images.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div>
                  <span className="text-(--dim)">Équipements :</span>{" "}
                  <span>{form.features.length}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between mt-5">
        <Button variant="ghost" onClick={goPrev} disabled={step === 0}>
          ← Précédent
        </Button>

        <span className="text-[0.75rem] text-(--dim)">
          Étape {step + 1} / {STEPS.length}
        </span>

        {step < STEPS.length - 1 ? (
          <Button onClick={goNext} disabled={!canNext()}>
            Suivant →
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              loading={saving}
              onClick={() => handleSubmit("DRAFT")}
            >
              Enregistrer brouillon
            </Button>
            <Button loading={saving} onClick={() => handleSubmit("AVAILABLE")}>
              Publier le véhicule
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
