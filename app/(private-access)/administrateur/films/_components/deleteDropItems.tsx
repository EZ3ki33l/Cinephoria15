// app/_components/deleteDropItems.tsx
"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTransition } from "react";
import { deleteMovieWithImage } from "./actions";

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
          try {
            // Appeler l'action server pour supprimer le film
            await deleteMovieWithImage(id);
            onDelete(id); // Met à jour l'état local après suppression
          } catch (error) {
            console.error("Erreur lors de la suppression :", error);
            // Optionnel : Ajouter un toast pour l'erreur ou une autre gestion d'erreur
          }
        });
      }}
    >
      Supprimer
    </DropdownMenuItem>
  );
}
