"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { submitDevisForm } from "@/actions/contact.actions";
import {
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
} from "@/components/ui/Modal";

/* ── Devis Modal ─────────────────────────────────────────── */
export default function DevisModal({
  triggerLabel = "Devis gratuit",
  initialVehicle = "",
  fullWidth = false,
  size = "sm",
}: {
  triggerLabel?: string;
  initialVehicle?: string;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget as HTMLFormElement;
    const data = new FormData(form);

    try {
      const result = await submitDevisForm({
        firstName: String(data.get("firstName") ?? ""),
        lastName: String(data.get("lastName") ?? ""),
        email: String(data.get("email") ?? ""),
        phone: String(data.get("phone") ?? ""),
        desiredVehicle: String(data.get("desiredVehicle") ?? ""),
        preferredCountry:
          String(data.get("preferredCountry") ?? "") || undefined,
        budget: data.get("budget") ? Number(data.get("budget")) : undefined,
        message: String(data.get("message") ?? "") || undefined,
      });

      if (result.success) {
        toast.success("Demande envoyée", {
          description: "Nous vous répondrons sous 24h.",
        });
        form.reset();
        setOpen(false);
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Erreur lors de l'envoi de la demande");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button size={size} variant="primary" fullWidth={fullWidth}>
          {triggerLabel}
        </Button>
      </ModalTrigger>

      <ModalContent size="md">
        <ModalHeader>
          <ModalTitle>DEVIS GRATUIT</ModalTitle>
          <ModalDescription>
            Décrivez votre projet — nous vous répondons sous 24h.
          </ModalDescription>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <ModalField label="Prénom">
              <ModalInput name="firstName" placeholder="Votre prénom" required />
            </ModalField>
            <ModalField label="Nom">
              <ModalInput name="lastName" placeholder="Votre nom" required />
            </ModalField>
          </div>

          <ModalField label="Email">
            <ModalInput
              name="email"
              type="email"
              placeholder="email@exemple.com"
              required
            />
          </ModalField>
          <ModalField label="Téléphone / WhatsApp">
            <ModalInput
              name="phone"
              type="tel"
              placeholder="+242 06..."
              required
            />
          </ModalField>

          <ModalField label="Véhicule souhaité">
            <ModalInput
              name="desiredVehicle"
              defaultValue={initialVehicle}
              placeholder="Ex: BMW X7 2023, blanc, boîte auto"
              required
            />
          </ModalField>

          <div className="grid grid-cols-2 gap-3">
            <ModalField label="Pays préféré">
              <ModalSelect name="preferredCountry">
                <option value="">Pas de préférence</option>
                <option value="FRANCE">🇫🇷 France</option>
                <option value="JAPAN">🇯🇵 Japon</option>
                <option value="CHINA">🇨🇳 Chine</option>
                <option value="DUBAI">🇦🇪 Dubai</option>
                <option value="GERMANY">🇩🇪 Allemagne</option>
                <option value="SOUTH_KOREA">🇰🇷 Corée du Sud</option>
                <option value="USA">🇺🇸 États-Unis</option>
              </ModalSelect>
            </ModalField>
            <ModalField label="Budget max ($)">
              <ModalInput
                name="budget"
                type="number"
                placeholder="50 000"
                min={1000}
              />
            </ModalField>
          </div>

          <ModalField label="Message (optionnel)">
            <ModalTextarea
              name="message"
              rows={3}
              placeholder="Précisions, couleur, équipements souhaités..."
            />
          </ModalField>

          {/* Honeypot anti-spam */}
          <input type="text" name="website" className="hidden" tabIndex={-1} />

          <ModalFooter>
            <ModalClose asChild>
              <Button type="button" variant="subtle" fullWidth>
                Fermer
              </Button>
            </ModalClose>
            <Button type="submit" fullWidth loading={loading}>
              Envoyer la demande
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
