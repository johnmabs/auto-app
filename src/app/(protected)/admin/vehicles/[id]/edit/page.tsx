import type { Metadata } from "next";
import { notFound } from "next/navigation";
import db from "@/lib/db";
import EditVehicleForm from "./EditVehicleForm";

export const metadata: Metadata = { title: "Modifier un véhicule" };

export default async function EditVehiclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vehicle = await db.vehicle.findUnique({
    where: { id },
    select: {
      id: true,
      make: true,
      model: true,
      variant: true,
      year: true,
      type: true,
      color: true,
      interiorColor: true,
      engine: true,
      power: true,
      torque: true,
      fuelType: true,
      transmission: true,
      mileage: true,
      doors: true,
      seats: true,
      acceleration: true,
      topSpeed: true,
      consumption: true,
      autonomy: true,
      price: true,
      comparePrice: true,
      status: true,
      stock: true,
      priceNegotiable: true,
      originCountry: true,
      customsCleared: true,
      chassisNumber: true,
      description: true,
      isFeatured: true,
      isPopular: true,
      features: true,
      metaTitle: true,
      metaDescription: true,
      images: {
        orderBy: { order: "asc" },
        select: {
          url: true,
          publicId: true,
          width: true,
          height: true,
          alt: true,
        },
      },
    },
  });

  if (!vehicle) {
    notFound();
  }

  return (
    <EditVehicleForm
      vehicle={{
        ...vehicle,
        images: vehicle.images.map((image) => ({
          url: image.url,
          publicId: image.publicId,
          width: image.width ?? undefined,
          height: image.height ?? undefined,
          alt: image.alt ?? undefined,
        })),
      }}
    />
  );
}
