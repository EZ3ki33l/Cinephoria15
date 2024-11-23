"use client";

import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Typo } from "./typography";

export const footerLinks = [
  {
    id: 0,
    name: "A propos de nous",
    href: "/a-propos",
  },
  {
    id: 1,
    name: "Nos cinémas",
    href: "/cinemas",
  },
  {
    id: 2,
    name: "Réservation",
    href: "/seances",
  },
];

export const accessLinks = [
  {
    id: 0,
    name: "Administrateur",
    href: "/administrateur",
  },
  {
    id: 1,
    name: "Manager",
    href: "/manager",
  },
];

export function FooterLinks() {
  const location = usePathname();
  return (
    <div className="flex flex-col justify-center items-center gap-x-2">
      {footerLinks.map((item) => (
        <Link
          href={item.href}
          key={item.id}
          className={cn(
            location === item.href
              ? "bg-muted"
              : "hover:bg-muted hover:bg-opacity-75",
            "group flex items-center px-2 py-2 font-medium rounded-md"
          )}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}

export function AccessLinks() {
  const location = usePathname();
  return (
    <div className="flex flex-col justify-center items-center gap-x-2">
      {accessLinks.map((item) => (
        <Link
          href={item.href}
          key={item.id}
          className={cn(
            location === item.href
              ? "bg-muted"
              : "hover:bg-muted hover:bg-opacity-75",
            "group flex items-center px-2 py-2 font-medium rounded-md"
          )}
        >
          <div className="flex gap-x-1 items-center">
            <Typo variant="body-base" component="div">
              {item.name}
            </Typo>
            <div>
              <Lock className="h-3 w-3 text-muted-foreground" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
