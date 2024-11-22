"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  duration = 0.5,
  clockwise = false,
  ...props
}: React.PropsWithChildren<
  {
    as?: React.ElementType;
    containerClassName?: string;
    className?: string;
    duration?: number;
    clockwise?: boolean;
  } & React.HTMLAttributes<HTMLElement>
>) {
  const [hovered, setHovered] = useState(false);
  const [currentDirection, setCurrentDirection] = useState<Direction>("TOP");

  const directions: Direction[] = ["TOP", "LEFT", "BOTTOM", "RIGHT"];

  // Utilisation de useMemo pour mémoriser le calcul de la prochaine direction
  const getNextDirection = useMemo(
    () =>
      (current: Direction): Direction => {
        const index = directions.indexOf(current);
        const nextIndex = clockwise
          ? (index + 1) % directions.length // Sens horaire
          : (index - 1 + directions.length) % directions.length; // Sens antihoraire
        return directions[nextIndex];
      },
    [clockwise] // Dépendance uniquement sur clockwise
  );

  const movingMap: Record<Direction, string> = {
    TOP: "radial-gradient(20.7% 50% at 50% 0%, hsl(var(--primary)) 0%, rgba(255, 255, 255, 0) 100%)",
    LEFT: "radial-gradient(16.6% 43.1% at 0% 50%, hsl(var(--primary)) 0%, rgba(255, 255, 255, 0) 100%)",
    BOTTOM:
      "radial-gradient(20.7% 50% at 50% 100%, hsl(var(--primary)) 0%, rgba(255, 255, 255, 0) 100%)",
    RIGHT:
      "radial-gradient(16.2% 41.2% at 100% 50%, hsl(var(--primary)) 0%, rgba(255, 255, 255, 0) 100%)",
  };

  useEffect(() => {
    if (hovered) {
      const interval = setInterval(() => {
        setCurrentDirection((prev) => getNextDirection(prev));
      }, duration * 1000);
      return () => clearInterval(interval);
    }
  }, [hovered, duration, getNextDirection]); // Dépendance de getNextDirection

  return (
    <Tag
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex items-center justify-center rounded-full transition-all duration-500",
        containerClassName
      )}
      {...props}
    >
      {/* Contenu principal */}
      <div
        className={cn(
          "relative z-10 px-2 py-2 bg-black text-white rounded-[inherit]",
          className
        )}
      >
        {children}
      </div>

      {/* Gradient dynamique avec mouvement et bordure */}
      <motion.div
        className="absolute inset-0 rounded-[inherit] z-0"
        style={{
          filter: "blur(4px)",
          width: "100%",
          height: "100%",
        }}
        initial={{
          opacity: 0, // On cache l'effet au départ
          background: movingMap[currentDirection], // Gradient de départ
        }}
        animate={{
          opacity: hovered ? 1 : 0, // On affiche l'effet uniquement au survol
          background: hovered
            ? movingMap[currentDirection]
            : movingMap[currentDirection], // Animation du fond
        }}
        transition={{
          opacity: { duration: 0 }, // Pas de délai pour l'opacité
          background: { duration: duration, ease: "linear" }, // L'animation du fond est linéaire sans délai
        }}
      />
    </Tag>
  );
}
