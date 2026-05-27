"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import db from "@/lib/db";
import { deleteImage, uploadImage } from "@/lib/cloudinary";
import { vehicleSchema } from "@/lib/validations";
import { generateVehicleSlug } from "@/lib/utils";
import type { ActionResult } from "@/types";
import type { VehicleInput } from "@/lib/validations";

export type UploadedVehicleImage = {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  alt?: string;
};

const VEHICLE_STATUSES = [
  "AVAILABLE",
  "TRANSIT",
  "RESERVED",
  "SOLD",
  "DRAFT",
] as const;
const VEHICLE_TYPES = [
  "SUV",
  "SEDAN",
  "COUPE",
  "PICKUP",
  "MINIVAN",
  "CONVERTIBLE",
  "WAGON",
  "HATCHBACK",
  "LUXURY",
  "SPORT",
] as const;
const FUEL_TYPES = [
  "GASOLINE",
  "DIESEL",
  "ELECTRIC",
  "HYBRID",
  "PLUGIN_HYBRID",
  "HYDROGEN",
] as const;
const TRANSMISSION_TYPES = [
  "AUTOMATIC",
  "MANUAL",
  "CVT",
  "DCT",
  "PDK",
] as const;
const COUNTRIES = [
  "CHINA",
  "DUBAI",
  "JAPAN",
  "GERMANY",
  "FRANCE",
  "SOUTH_KOREA",
  "USA",
  "EUROPE",
] as const;
const SORT_KEYS = [
  "price",
  "year",
  "mileage",
  "createdAt",
  "publishedAt",
] as const;

function keepAllowed<T extends readonly string[]>(values: string[], allowed: T) {
  return values.filter((value): value is T[number] =>
    (allowed as readonly string[]).includes(value),
  );
}

/* ── Guard admin ─────────────────────────────────────────── */
async function requireAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const role = (session.user as { role?: string }).role;
  if (!role || !["ADMIN", "SUPER_ADMIN", "EDITOR"].includes(role)) {
    redirect("/");
  }
  return session.user;
}

function isCloudinaryTimeout(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    ("http_code" in error || "name" in error) &&
    ((error as { http_code?: unknown }).http_code === 499 ||
      (error as { name?: unknown }).name === "TimeoutError")
  );
}

/* ── CREATE ──────────────────────────────────────────────── */
export async function createVehicle(
  rawData: VehicleInput,
  images: UploadedVehicleImage[] = [],
): Promise<ActionResult<{ id: string; slug: string }>> {
  try {
    const user = await requireAdmin();

    const parsed = vehicleSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        success: false,
        error: "Données invalides",
        fieldErrors: parsed.error.flatten().fieldErrors as Record<
          string,
          string[]
        >,
      };
    }

    const data = parsed.data;

    /* Générer un slug unique */
    const tempId = crypto.randomUUID();
    const slug = generateVehicleSlug(data.make, data.model, data.year, tempId);

    const vehicle = await db.vehicle.create({
      data: {
        ...data,
        slug,
        features: data.features ?? [],
        publishedAt: data.status === "AVAILABLE" ? new Date() : null,
        createdById: (user as { id?: string }).id,
      },
    });

    /* Mettre à jour le slug avec l'ID réel */
    const finalSlug = generateVehicleSlug(
      data.make,
      data.model,
      data.year,
      vehicle.id,
    );
    await db.vehicle.update({
      where: { id: vehicle.id },
      data: { slug: finalSlug },
    });

    if (images.length > 0) {
      await db.vehicleImage.createMany({
        data: images.map((image, index) => ({
          vehicleId: vehicle.id,
          url: image.url,
          publicId: image.publicId,
          width: image.width,
          height: image.height,
          alt:
            image.alt ??
            `${data.make} ${data.model} ${data.year} - photo ${index + 1}`,
          order: index,
          isPrimary: index === 0,
        })),
      });
    }

    revalidatePath("/");
    revalidatePath("/catalogue");
    revalidatePath("/admin/vehicules");
    revalidateTag("vehicles", "max");

    return { success: true, data: { id: vehicle.id, slug: finalSlug } };
  } catch (error) {
    console.error("[createVehicle]", error);
    return { success: false, error: "Erreur lors de la création du véhicule" };
  }
}

/* ── UPLOAD IMAGE ────────────────────────────────────────── */
export async function uploadVehicleImage(
  formData: FormData,
): Promise<ActionResult<UploadedVehicleImage>> {
  try {
    await requireAdmin();

    const file = formData.get("file");
    if (!(file instanceof File)) {
      return { success: false, error: "Image manquante" };
    }

    if (!file.type.startsWith("image/")) {
      return { success: false, error: "Format d'image invalide" };
    }

    if (file.size > 10 * 1024 * 1024) {
      return { success: false, error: "Image trop lourde. Maximum 10 Mo." };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadImage(buffer, "autostore/vehicles");

    return {
      success: true,
      data: {
        url: result.url,
        publicId: result.publicId,
        width: result.width,
        height: result.height,
      },
    };
  } catch (error) {
    console.error("[uploadVehicleImage]", error);

    if (isCloudinaryTimeout(error)) {
      return {
        success: false,
        error: "Cloudinary a mis trop de temps à répondre. Réessayez avec une image plus légère.",
      };
    }

    return { success: false, error: "Erreur lors de l'upload de l'image" };
  }
}

/* ── UPDATE ──────────────────────────────────────────────── */
export async function updateVehicle(
  id: string,
  rawData: Partial<VehicleInput>,
  images?: UploadedVehicleImage[],
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();

    const parsed = vehicleSchema.partial().safeParse(rawData);
    if (!parsed.success) {
      return {
        success: false,
        error: "Données invalides",
        fieldErrors: parsed.error.flatten().fieldErrors as Record<
          string,
          string[]
        >,
      };
    }

    const existing = await db.vehicle.findUnique({
      where: { id },
      include: { images: true },
    });
    if (!existing) {
      return { success: false, error: "Véhicule introuvable" };
    }

    const data = parsed.data;
    const nextMake = data.make ?? existing.make;
    const nextModel = data.model ?? existing.model;
    const nextYear = data.year ?? existing.year;
    const slug =
      nextMake !== existing.make ||
      nextModel !== existing.model ||
      nextYear !== existing.year
        ? generateVehicleSlug(nextMake, nextModel, nextYear, existing.id)
        : existing.slug;
    const publishedAt =
      data.status === undefined
        ? existing.publishedAt
        : data.status === "AVAILABLE"
          ? (existing.publishedAt ?? new Date())
          : null;

    await db.$transaction(async (tx) => {
      await tx.vehicle.update({
        where: { id },
        data: {
          ...data,
          slug,
          features: data.features ?? existing.features,
          publishedAt,
        },
      });

      if (images) {
        await tx.vehicleImage.deleteMany({ where: { vehicleId: id } });

        if (images.length > 0) {
          await tx.vehicleImage.createMany({
            data: images.map((image, index) => ({
              vehicleId: id,
              url: image.url,
              publicId: image.publicId,
              width: image.width,
              height: image.height,
              alt:
                image.alt ??
                `${nextMake} ${nextModel} ${nextYear} - photo ${index + 1}`,
              order: index,
              isPrimary: index === 0,
            })),
          });
        }
      }
    });

    if (images) {
      const nextPublicIds = new Set(images.map((image) => image.publicId));
      await Promise.all(
        existing.images
          .filter((image) => image.publicId && !nextPublicIds.has(image.publicId))
          .map((image) => deleteImage(image.publicId)),
      );
    }

    revalidatePath("/");
    revalidatePath("/catalogue");
    revalidatePath(`/vehicules/${existing.slug}`);
    if (slug !== existing.slug) {
      revalidatePath(`/vehicules/${slug}`);
    }
    revalidatePath("/admin/vehicules");
    revalidateTag("vehicles", "max");

    return { success: true, data: { id } };
  } catch (error) {
    console.error("[updateVehicle]", error);
    return { success: false, error: "Erreur lors de la mise à jour" };
  }
}

/* ── DELETE ──────────────────────────────────────────────── */
export async function deleteVehicle(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();

    const vehicle = await db.vehicle.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!vehicle) return { success: false, error: "Véhicule introuvable" };

    await Promise.all(
      vehicle.images
        .filter((image) => image.publicId)
        .map((image) => deleteImage(image.publicId)),
    );

    await db.customerRequest.updateMany({
      where: { vehicleId: id },
      data: { vehicleId: null },
    });

    await db.vehicle.delete({ where: { id } });

    revalidatePath("/catalogue");
    revalidatePath("/admin/vehicules");
    revalidateTag("vehicles", "max");

    return { success: true, data: undefined };
  } catch (error) {
    console.error("[deleteVehicle]", error);
    return { success: false, error: "Erreur lors de la suppression" };
  }
}

/* ── TOGGLE PUBLISH ──────────────────────────────────────── */
export async function toggleVehiclePublish(
  id: string,
  published: boolean,
): Promise<ActionResult> {
  try {
    await requireAdmin();

    await db.vehicle.update({
      where: { id },
      data: {
        status: published ? "AVAILABLE" : "DRAFT",
        publishedAt: published ? new Date() : null,
      },
    });

    revalidatePath("/catalogue");
    revalidatePath("/admin/vehicules");
    revalidateTag("vehicles", "max");

    return { success: true, data: undefined };
  } catch (error) {
    console.error("[toggleVehiclePublish]", error);
    return { success: false, error: "Erreur lors de la mise à jour du statut" };
  }
}

/* ── GET VEHICLES (catalogue) ────────────────────────────── */
export async function getVehicles(params: {
  page?: number;
  limit?: number;
  country?: string[];
  type?: string[];
  fuel?: string[];
  transmission?: string[];
  make?: string[];
  status?: string[];
  minYear?: number;
  maxYear?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  featuredOnly?: boolean;
}) {
  const {
    page = 1,
    limit = 12,
    country = [],
    type = [],
    fuel = [],
    transmission = [],
    make = [],
    status = ["AVAILABLE", "TRANSIT"],
    minYear,
    maxYear,
    maxPrice,
    search,
    sortBy = "createdAt",
    sortOrder = "desc",
    featuredOnly = false,
  } = params;

  const skip = (page - 1) * limit;
  const safeStatus = keepAllowed(status, VEHICLE_STATUSES);
  const safeSortBy = (SORT_KEYS as readonly string[]).includes(sortBy)
    ? sortBy
    : "createdAt";
  const safeSortOrder = sortOrder === "asc" ? "asc" : "desc";

  /* Build where clause */
  const where: Record<string, unknown> = {
    status: {
      in: safeStatus.length > 0 ? safeStatus : ["AVAILABLE", "TRANSIT"],
    },
  };

  const safeCountries = keepAllowed(country, COUNTRIES);
  const safeTypes = keepAllowed(type, VEHICLE_TYPES);
  const safeFuel = keepAllowed(fuel, FUEL_TYPES);
  const safeTransmissions = keepAllowed(transmission, TRANSMISSION_TYPES);

  if (safeCountries.length > 0) where.originCountry = { in: safeCountries };
  if (safeTypes.length > 0) where.type = { in: safeTypes };
  if (safeFuel.length > 0) where.fuelType = { in: safeFuel };
  if (safeTransmissions.length > 0) {
    where.transmission = { in: safeTransmissions };
  }
  if (make.length > 0) where.make = { in: make };
  if (maxPrice) where.price = { lte: maxPrice };
  if (minYear || maxYear) {
    where.year = {
      ...(minYear ? { gte: minYear } : {}),
      ...(maxYear ? { lte: maxYear } : {}),
    };
  }
  if (featuredOnly) where.isFeatured = true;

  if (search) {
    where.OR = [
      { make: { contains: search, mode: "insensitive" } },
      { model: { contains: search, mode: "insensitive" } },
      { variant: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const [vehicles, total] = await Promise.all([
    db.vehicle.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [safeSortBy]: safeSortOrder },
      select: {
        id: true,
        slug: true,
        make: true,
        model: true,
        variant: true,
        year: true,
        type: true,
        fuelType: true,
        transmission: true,
        mileage: true,
        color: true,
        price: true,
        comparePrice: true,
        status: true,
        originCountry: true,
        isFeatured: true,
        isPopular: true,
        images: {
          where: { isPrimary: true },
          take: 1,
          select: { url: true, alt: true, isPrimary: true },
        },
      },
    }),
    db.vehicle.count({ where }),
  ]);

  return {
    vehicles,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1,
  };
}

/* ── GET SINGLE VEHICLE ──────────────────────────────────── */
export async function getVehicleBySlug(slug: string) {
  return db.vehicle.findUnique({
    where: { slug },
    include: { images: { orderBy: [{ isPrimary: "desc" }, { order: "asc" }] } },
  });
}

/* ── GET SIMILAR VEHICLES ────────────────────────────────── */
export async function getSimilarVehicles(
  vehicleId: string,
  type: string,
  limit = 3,
) {
  return db.vehicle.findMany({
    where: {
      id: { not: vehicleId },
      type: type as never,
      status: { in: ["AVAILABLE", "TRANSIT"] },
    },
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      make: true,
      model: true,
      variant: true,
      year: true,
      type: true,
      fuelType: true,
      transmission: true,
      mileage: true,
      color: true,
      price: true,
      comparePrice: true,
      status: true,
      originCountry: true,
      isFeatured: true,
      isPopular: true,
      images: {
        where: { isPrimary: true },
        take: 1,
        select: { url: true, alt: true, isPrimary: true },
      },
    },
  });
}
