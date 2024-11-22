"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HoverBorderGradient } from "./hover-border-gradient";

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
          <HoverBorderGradient
            key={item.id}
            as="button"
            className={cn(
              location === item.href
                ? "dark:bg-black bg-white text-primary-light dark:text-primary-light text-xl font-bold"
                : "dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
            )}
            containerClassName="rounded-full"
          >
            {item.name}
          </HoverBorderGradient>
        </Link>
      ))}
    </div>
  );
}
