"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

interface SidebarProps {
  children: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const Sidebar = ({ children, open, setOpen }: SidebarProps) => {
  return (
    <motion.div
      animate={{
        width: open ? "240px" : "64px",
        transition: { duration: 0.3 },
      }}
      className={cn(
        "relative h-screen border-r border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800",
        "flex flex-col p-2"
      )}
    >
      <button
        onClick={() => setOpen(!open)}
        className="absolute -right-3 top-5 z-40 h-6 w-6 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex items-center justify-center"
      >
        <motion.div
          animate={{
            rotate: open ? 180 : 0,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </motion.div>
      </button>
      {children}
    </motion.div>
  );
};

interface SidebarBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const SidebarBody = ({ children, className }: SidebarBodyProps) => {
  return (
    <div className={cn("flex h-full flex-col", className)}>{children}</div>
  );
};

interface SidebarLinkProps {
  link: {
    label: string;
    href: string;
    icon?: React.ReactNode;
  };
}

export const SidebarLink = ({ link }: SidebarLinkProps) => {
  return (
    <Link
      href={link.href}
      className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
    >
      {link.icon}
      <span className="truncate">{link.label}</span>
    </Link>
  );
}; 