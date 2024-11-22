import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Home } from "lucide-react";
import Link from "next/link";

export const AdminMenu = () => {
  return (
    <Menubar className="flex absolute top-36 left-1/2 -translate-x-1/2">
      <MenubarMenu>
        <MenubarTrigger>
          <Link href="/administrateur">
            <Home className="w-4 h-4" />
          </Link>
        </MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Cinémas</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Link href="/administrateur/cinemas">Dashboard cinémas</Link>
          </MenubarItem>
          <MenubarItem>
            <Link href="/administrateur/cinemas/nouveau">Créer un cinéma</Link>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Films</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Link href="/administrateur/films">Dashboard films</Link>
          </MenubarItem>
          <MenubarItem>
            <Link href="/administrateur/films/nouveau">Créer un film</Link>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Administrateurs</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Link href="/administrateur/admins">Dashboard administrateur</Link>
          </MenubarItem>
          <MenubarItem>
            <Link href="/administrateur/admins/nouveau">
              Nouveau administrateur
            </Link>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Managers</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Link href="/administrateur/managers">Dashboard manager</Link>
          </MenubarItem>
          <MenubarItem>
            <Link href="/administrateur/managers/nouveau">
              Créer un manager
            </Link>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export const AdminMenuMobile = () => {
  return (
    <div className="flex flex-col w-full max-w-xs gap-2">
      <Link href="/administrateur">
        <Home className="w-4 h-4" />
      </Link>
      <Link href="/administrateur/cinemas">Dashboard cinémas</Link>
      <Link href="/administrateur/cinemas/nouveau" className="pl-4">
        Créer un cinéma
      </Link>
      <Link href="/administrateur/films">Dashboard films</Link>
      <Link href="/administrateur/films/nouveau" className="pl-4">
        Créer un film
      </Link>
      <Link href="/administrateur/admins">Dashboard administrateur</Link>
      <Link href="/administrateur/admins" className="pl-4">
        Nouveau administrateur
      </Link>
      <Link href="/administrateur/managers">Dashboard manager</Link>
      <Link href="/administrateur/managers" className="pl-4">
        Créer un manager
      </Link>
    </div>
  );
};
