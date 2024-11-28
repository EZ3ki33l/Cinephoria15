"use client";

import { RoundedLogo } from "@/app/_components/_layout/logo";
import {
  HoveredLink,
  Menu,
  MenuItem,
} from "@/app/_components/_layout/navBarMenu";
import { cn } from "@/lib/utils";
import { DoorOpen, Home } from "lucide-react";
import { useState } from "react";

export function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
      className={cn(
        "fixed top-10 inset-x-0 max-w-3xl mx-auto z-40 bg-transparent",
        className
      )}
    >
      <Menu setActive={setActive}>
        <div className="flex justify-between items-center px-5 w-full">
          <div className="flex justify-center items-center gap-4">
            <RoundedLogo size="small" />
            <HoveredLink href="/manager">
              <Home />
            </HoveredLink>
            <HoveredLink href="/">
              <DoorOpen />
            </HoveredLink>
          </div>
          <div className="flex gap-4">
            <MenuItem setActive={setActive} active={active} item="Articles">
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/manager/articles">Dashboard</HoveredLink>
                <HoveredLink href="/manager/articles/nouveau">
                  Créer un article
                </HoveredLink>
              </div>
            </MenuItem>
            <MenuItem setActive={setActive} active={active} item="Séances">
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/manager/seances">Dashboard</HoveredLink>
                <HoveredLink href="/manager/seances/nouvelle">
                  Créer une séance
                </HoveredLink>
              </div>
            </MenuItem>
            <MenuItem setActive={setActive} active={active} item="Autres">
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/manager/categories">Catégories</HoveredLink>
              </div>
            </MenuItem>
          </div>
        </div>
      </Menu>
    </div>
  );
}
