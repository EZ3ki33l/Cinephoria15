"use client";

import React, { useState } from "react";
import { RoundedLogo } from "@/app/_components/_layout/logo";
import {
  Home,
  DoorOpen,
  FileText,
  Calendar,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebarAcertiny";
import { UserButton } from "@clerk/nextjs";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export function Navbar({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  const mainLinks = [
    {
      label: "Accueil Manager",
      href: "/manager",
      icon: <Home className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Retour Site",
      href: "/",
      icon: <DoorOpen className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
  ];

  const managerLinks = [
    {
      label: "Articles",
      href: "/manager/articles",
      icon: <FileText className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
      subLinks: [
        { label: "Dashboard", href: "/manager/articles" },
        { label: "Créer un article", href: "/manager/articles/nouveau" },
      ],
    },
    {
      label: "Séances",
      href: "/manager/seances",
      icon: <Calendar className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
      subLinks: [
        { label: "Dashboard", href: "/manager/seances" },
        { label: "Créer une séance", href: "/manager/seances/nouvelle" },
      ],
    },
    {
      label: "Paramètres",
      href: "#",
      icon: <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
      subLinks: [
        { label: "Catégories", href: "/manager/categories" },
      ],
    },
  ];

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className={cn("fixed inset-y-0 left-0 z-40", className)}>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            
            {/* Liens principaux */}
            <div className="mt-8 flex flex-col gap-2">
              {mainLinks.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>

            {/* Séparateur */}
            <div className="my-4 border-t border-neutral-200 dark:border-neutral-700" />

            {/* Liens manager */}
            <div className="flex flex-col gap-2">
              {managerLinks.map((link, idx) => (
                <div key={idx}>
                  <SidebarLink link={link} />
                  {open && link.subLinks && (
                    <div className="ml-6 mt-2 flex flex-col gap-2">
                      {link.subLinks.map((subLink, subIdx) => (
                        <Link
                          key={subIdx}
                          href={subLink.href}
                          className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                        >
                          {subLink.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section utilisateur et déconnexion */}
          <div className="mt-auto pt-4 border-t border-neutral-200 dark:border-neutral-700">
            {user && (
              <div className="flex items-center gap-2 px-2 py-3">
                <UserButton afterSignOutUrl="/" />
                {open && (
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {user.fullName || user.username}
                    </span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      {user.primaryEmailAddress?.emailAddress}
                    </span>
                  </div>
                )}
              </div>
            )}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-2 py-2 text-sm hover:bg-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {open && <span>Déconnexion</span>}
            </button>
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  );
}

const Logo = () => {
  return (
    <Link href="/manager" className="flex items-center space-x-2 px-2">
      <RoundedLogo size="extra-small" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Cinéphoria
      </motion.span>
    </Link>
  );
};

const LogoIcon = () => {
  return (
    <Link href="/manager" className="px-2">
      <RoundedLogo size="small" />
    </Link>
  );
};
