"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import db from "@/lib/db";
import {
  contactSchema,
  devisSchema,
  updateRequestSchema,
} from "@/lib/validations";
import type { ActionResult } from "@/types";
import type { ContactInput, DevisInput } from "@/lib/validations";
import { notifyNewLead } from "@/lib/notifications";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = (session.user as { role?: string }).role;
  if (!role || !["ADMIN", "SUPER_ADMIN", "EDITOR"].includes(role)) {
    redirect("/");
  }
}

/* ── Contact form ────────────────────────────────────────── */
export async function submitContactForm(
  rawData: ContactInput,
): Promise<ActionResult> {
  try {
    /* Anti-spam honeypot */
    if (rawData.honeypot) {
      return { success: true, data: undefined }; // fake success
    }

    const parsed = contactSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        success: false,
        error: "Formulaire invalide",
        fieldErrors: parsed.error.flatten().fieldErrors as Record<
          string,
          string[]
        >,
      };
    }

    const data = parsed.data;

    /* Enregistrer en DB */
    await db.customerRequest.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        message: `[${data.subject}] ${data.message}`,
        source: "form",
        status: "NEW",
      },
    });

    /* Envoyer email de notification (TODO: brancher nodemailer) */
    // await sendNotificationEmail({ to: process.env.ADMIN_EMAIL, data });

    void notifyNewLead({
      name: `${data.firstName} ${data.lastName}`,
      phone: data.phone,
      message: `[${data.subject}] ${data.message}`,
    });

    return { success: true, data: undefined };
  } catch (error) {
    console.error("[submitContactForm]", error);
    return { success: false, error: "Erreur lors de l'envoi du message" };
  }
}

/* ── Devis form ──────────────────────────────────────────── */
export async function submitDevisForm(
  rawData: DevisInput,
): Promise<ActionResult> {
  try {
    const parsed = devisSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        success: false,
        error: "Formulaire invalide",
        fieldErrors: parsed.error.flatten().fieldErrors as Record<
          string,
          string[]
        >,
      };
    }

    const data = parsed.data;

    await db.customerRequest.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        desiredModel: data.desiredVehicle,
        budget: data.budget ?? null,
        preferredCountry: (data.preferredCountry as never) ?? null,
        message: data.message ?? "",
        source: "form",
        status: "NEW",
      },
    });

    void notifyNewLead({
      name: `${data.firstName} ${data.lastName}`,
      phone: data.phone,
      message: `[Nouveau devis soumis] ${data.message}`,
    });

    return { success: true, data: undefined };
  } catch (error) {
    console.error("[submitDevisForm]", error);
    return { success: false, error: "Erreur lors de l'envoi de la demande" };
  }
}

/* ── Admin: update request status ───────────────────────── */
export async function updateRequestStatus(
  id: string,
  status: string,
  notes?: string,
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const parsed = updateRequestSchema.safeParse({
      status,
      adminNotes: notes,
    });

    if (!parsed.success || !parsed.data.status) {
      return { success: false, error: "Statut invalide" };
    }

    await db.customerRequest.update({
      where: { id },
      data: {
        status: parsed.data.status,
        adminNotes: parsed.data.adminNotes,
        contactedAt:
          parsed.data.status === "CONTACTED" ? new Date() : undefined,
        resolvedAt: ["DELIVERED", "CANCELLED"].includes(parsed.data.status)
          ? new Date()
          : undefined,
      },
    });

    return { success: true, data: undefined };
  } catch (error) {
    console.error("[updateRequestStatus]", error);
    return { success: false, error: "Erreur lors de la mise à jour" };
  }
}

/* ── Admin: get requests ─────────────────────────────────── */
export async function getRequests(
  params: {
    page?: number;
    limit?: number;
    status?: string[];
    search?: string;
  } = {},
) {
  await requireAdmin();

  const { page = 1, limit = 20, status = [], search } = params;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (status.length > 0) where.status = { in: status };

  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ];
  }

  const [requests, total] = await Promise.all([
    db.customerRequest.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        vehicle: {
          select: { id: true, make: true, model: true, slug: true },
        },
        assignee: {
          select: { id: true, name: true, email: true },
        },
      },
    }),
    db.customerRequest.count({ where }),
  ]);

  return {
    requests,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}
