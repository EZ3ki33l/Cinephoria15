"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTransition } from "react";
import { deleteAdmin } from "./actions";

export function DeleteDropdownItem({
  id,
  onDelete,
}: {
  id: string;
  onDelete: (id: string) => void; // Callback pour mettre à jour l'état
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await deleteAdmin(id);
          onDelete(id); // Met à jour l'état local après suppression
        });
      }}
    >
      Supprimer
    </DropdownMenuItem>
  );
}
