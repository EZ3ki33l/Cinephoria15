"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toggleLovedByTeam } from "./actions";
import { Heart, HeartCrack } from "lucide-react";

export function ActiveToggleDropdownItem({
  id,
  lovedByTeam,
}: {
  id: number;
  lovedByTeam: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await toggleLovedByTeam(id, !lovedByTeam);
          router.refresh();
        });
      }}
    >
      {lovedByTeam ? (
        <div className="flex justify-center items-center gap-2">
          Ne pas aimer <HeartCrack />
        </div>
      ) : (
        <div className="flex justify-center items-center gap-2">
          Aimer <Heart />
        </div>
      )}
    </DropdownMenuItem>
  );
}
