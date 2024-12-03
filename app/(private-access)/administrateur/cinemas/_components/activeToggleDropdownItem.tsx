"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { IsOpen } from "./actions";

export function ActiveToggleDropdownItem({
  id,
  isOpen,
}: {
  id: number;
  isOpen: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await IsOpen(id, !isOpen);
          router.refresh();
        });
      }}
    >
      {isOpen ? (
        <div className="flex justify-center items-center gap-2">Fermé</div>
      ) : (
        <div className="flex justify-center items-center gap-2">Ouvert</div>
      )}
    </DropdownMenuItem>
  );
}
