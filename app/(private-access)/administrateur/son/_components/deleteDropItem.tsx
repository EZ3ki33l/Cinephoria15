"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTransition } from "react";
import { deletesoundSystemType } from "./actions";

export function DeleteDropdownItem({
  id,
  onDelete,
}: {
  id: number;
  onDelete: (id: number) => void; // Callback pour mettre à jour l'état
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await deletesoundSystemType(id);
          onDelete(id); // Met à jour l'état local après suppression
        });
      }}
    >
      Supprimer
    </DropdownMenuItem>
  );
}
