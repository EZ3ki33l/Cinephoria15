"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/app/_components/_layout/button";

interface Item {
  title: string;
  description: string;
  link: string;
  images: string[];
  onReserve?: () => void;
}

export const HoverEffect = ({
  items,
  className,
}: {
  items: Item[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10", className)}>
      {items.map((item, idx) => (
        <div 
          key={item.title + idx} 
          className="relative group block p-2 h-full w-full transition-all duration-300"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence mode="wait">
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-secondary-light/10 dark:bg-slate-800/[0.8] block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.3 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.3 },
                }}
              />
            )}
          </AnimatePresence>
          <Card className="flex overflow-hidden flex-col w-auto items-center h-[60svh] transition-all duration-300">
            <div className="relative w-[250px] h-[250px]">
              <Image
                src={item.images[0]}
                alt={`affiche de ${item.title}`}
                fill
                className="object-cover rounded-2xl"
              />
            </div>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
            <div className="flex gap-2 mt-2">
              <Link href={item.link}>
                <Button variant="secondary" size="small">
                  Plus d'infos
                </Button>
              </Link>
              <Button
                variant="primary" 
                size="small"
                onClick={(e) => {
                  e.preventDefault();
                  item.onReserve?.();
                }}
              >
                Réserver
              </Button>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl w-[300px] h-[500px] p-4 overflow-hidden bg-white dark:bg-black border border-transparent relative z-20",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4 flex flex-col items-center h-full">{children}</div>
      </div>
    </div>
  );
};

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4
      className={cn(
        "text-primary font-bold text-center text-xl h-[50px] line-clamp-2 tracking-wide mt-4",
        className
      )}
    >
      {children}
    </h4>
  );
};

export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "py-4 tracking-wide leading-relaxed text-sm h-[100px]",
        className
      )}
    >
      <p className="line-clamp-4 text-justify">{children}</p>
    </div>
  );
};
