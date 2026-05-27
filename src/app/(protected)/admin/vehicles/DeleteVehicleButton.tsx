"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteVehicle } from "@/actions/vehicle.actions";
import { Button } from "@/components/ui/Button";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/Modal";

export default function DeleteVehicleButton({
  id,
  label,
}: {
  id: string;
  label: string;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [pending, startTransition] = React.useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteVehicle(id);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("Véhicule supprimé");
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <button
        type="button"
        className="h-7 w-7 flex items-center justify-center rounded-(--r) border border-(--border) text-(--muted) hover:text-(--accent) hover:border-(--accent) transition-all"
        aria-label={`Supprimer ${label}`}
        title="Supprimer"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>

      <ModalContent size="sm">
        <ModalHeader>
          <ModalTitle className="text-xl">Supprimer le véhicule</ModalTitle>
          <ModalDescription>
            Cette action supprimera définitivement {label} et ses images.
          </ModalDescription>
        </ModalHeader>

        <ModalFooter className="justify-end">
          <ModalClose asChild>
            <Button type="button" variant="ghost" disabled={pending}>
              Annuler
            </Button>
          </ModalClose>
          <Button
            type="button"
            variant="danger"
            loading={pending}
            onClick={handleDelete}
          >
            Supprimer
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
