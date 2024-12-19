"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HoverButton } from "../hoverbutton";

export const navbarLinks = [
  {
    id: 0,
    name: "Accueil",
    href: "/",
  },
  {
    id: 1,
    name: "Films",
    href: "/films",
  },
  {
    id: 2,
    name: "Réservation",
    href: "/reservation",
  },
  {
    id: 3,
    name: "Cinémas",
    href: "/cinemas",
  },
];

export function NavbarLinks() {
  const location = usePathname();
  return (
    <div className="hidden md:flex justify-center items-center col-span-6 gap-x-1">
      {navbarLinks.map((item) => (
        <Link href={item.href} key={item.id}>
          <HoverButton isActive={location.startsWith(item.href) && item.href !== "/" || location === item.href}>
            {item.name}
          </HoverButton>
        </Link>
      ))}
    </div>
  );
}
