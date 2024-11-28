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
            <HoveredLink href="/administrateur">
              <Home />
            </HoveredLink>
            <HoveredLink href="/">
              <DoorOpen />
            </HoveredLink>
          </div>
          <div className="flex gap-4">
            <MenuItem
              setActive={setActive}
              active={active}
              item="Administrateurs"
            >
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/administrateur/administrateurs">
                  Dashboard
                </HoveredLink>
              </div>
            </MenuItem>
            <MenuItem setActive={setActive} active={active} item="Managers">
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/administrateur/managers">
                  Dashboard
                </HoveredLink>
              </div>
            </MenuItem>
            <MenuItem setActive={setActive} active={active} item="Cinémas">
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/administrateur/cinemas">
                  Dashboard
                </HoveredLink>
                <HoveredLink href="/administrateur/cinemas/nouveau">
                  Créer
                </HoveredLink>
              </div>
            </MenuItem>
            <MenuItem setActive={setActive} active={active} item="Films">
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/administrateur/films">
                  Dashboard
                </HoveredLink>
                <HoveredLink href="/administrateur/films/nouveau">
                  Créer
                </HoveredLink>
              </div>
            </MenuItem>
            <MenuItem setActive={setActive} active={active} item="Autres">
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/administrateur/equipments">
                  Equipements
                </HoveredLink>
                <HoveredLink href="/administrateur/genres">
                  Genres
                </HoveredLink>
              </div>
            </MenuItem>
          </div>
        </div>
      </Menu>
    </div>
  );
}
