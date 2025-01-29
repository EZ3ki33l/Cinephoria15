"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTransition } from "react";
import { deleteDiscount } from "./actions";

export function DeleteDropdownItem({
  id,
  onDelete,
}: {
  id: number;
  onDelete: (id: number) => void;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await deleteDiscount(id);
          onDelete(id);
        });
      }}
    >
      Supprimer
    </DropdownMenuItem>
  );
}
