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
    href: "/reservation",
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
    <div className="flex flex-col space-y-3">
      {footerLinks.map((item) => (
        <Link
          href={item.href}
          key={item.id}
          className={cn(
            "transition-colors duration-200 hover:text-primary dark:hover:text-primary-light",
            location === item.href
              ? "text-primary dark:text-primary-light font-medium"
              : "text-muted-foreground"
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
    <div className="flex flex-col space-y-3">
      {accessLinks.map((item) => (
        <Link
          href={item.href}
          key={item.id}
          className={cn(
            "flex items-center space-x-2 transition-colors duration-200 hover:text-primary dark:hover:text-primary-light",
            location === item.href 
              ? "text-primary dark:text-primary-light font-medium" 
              : "text-muted-foreground"
          )}
        >
          {item.name}
          <Lock className="h-4 w-4 text-muted-foreground" />
        </Link>
      ))}
    </div>
  );
}