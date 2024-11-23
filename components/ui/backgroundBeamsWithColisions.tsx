"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

export const BackgroundBeamsWithCollision = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile(); // Détecte si l'utilisateur est sur mobile

  const beams = [
    {
      initialX: 10,
      translateX: 10,
      duration: 7,
      repeatDelay: 3,
      delay: 2,
    },
    {
      initialX: 600,
      translateX: 600,
      duration: 3,
      repeatDelay: 3,
      delay: 4,
    },
    // Réduire le nombre d'animations sur mobile
    ...(isMobile
      ? []
      : [
          {
            initialX: 100,
            translateX: 100,
            duration: 7,
            repeatDelay: 7,
            className: "h-6",
          },
          {
            initialX: 400,
            translateX: 400,
            duration: 5,
            repeatDelay: 14,
            delay: 4,
          },
        ]),
  ];

  return (
    <div
      ref={parentRef}
      className={cn(
        "h-96 md:h-[40rem] bg-gradient-to-b from-primary-light/5 to-white dark:from-neutral-950 dark:to-neutral-800 relative flex items-center justify-center overflow-hidden",
        className
      )}
    >
      {beams.map((beam, idx) => (
        <CollisionMechanism
          key={`${beam.initialX}-beam-${idx}`}
          beamOptions={beam}
          containerRef={containerRef}
          parentRef={parentRef}
          isMobile={isMobile} // Passer l'état mobile au mécanisme
        />
      ))}

      {children}

      {/* Ajouter une classe spécifique pour mobile */}
      <div
        ref={containerRef}
        className={cn(
          "absolute bottom-0 bg-neutral-100 w-full inset-x-0 pointer-events-none",
          isMobile && "h-24"
        )}
        style={{
          boxShadow:
            "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset",
        }}
      ></div>
    </div>
  );
};

const CollisionMechanism = React.forwardRef< // Composant qui gère la collision des beams
  HTMLDivElement,
  {
    containerRef: React.RefObject<HTMLDivElement>;
    parentRef: React.RefObject<HTMLDivElement>;
    beamOptions?: {
      initialX?: number;
      translateX?: number;
      initialY?: number;
      translateY?: number;
      rotate?: number;
      className?: string;
      duration?: number;
      delay?: number;
      repeatDelay?: number;
    };
    isMobile?: boolean;
  }
>(({ parentRef, containerRef, beamOptions = {}, isMobile = false }, ref) => {
  const beamRef = useRef<HTMLDivElement>(null);

  // Désactiver les animations complexes sur mobile
  if (isMobile) {
    return (
      <div
        ref={beamRef}
        className={cn(
          "absolute left-0 top-20 m-auto h-8 w-px rounded-full bg-primary-light",
          beamOptions.className
        )}
      ></div>
    );
  }

  return (
    <motion.div
      ref={beamRef}
      animate="animate"
      initial={{
        translateY: beamOptions.initialY || "-200px",
        translateX: beamOptions.initialX || "0px",
        rotate: beamOptions.rotate || 0,
      }}
      variants={{
        animate: {
          translateY: beamOptions.translateY || "1800px",
          translateX: beamOptions.translateX || "0px",
          rotate: beamOptions.rotate || 0,
        },
      }}
      transition={{
        duration: beamOptions.duration || 8,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        delay: beamOptions.delay || 0,
        repeatDelay: beamOptions.repeatDelay || 0,
      }}
      className={cn(
        "absolute left-0 top-20 m-auto h-14 w-px rounded-full bg-gradient-to-t from-primary-light via-secondary to-transparent",
        beamOptions.className
      )}
    />
  );
});

CollisionMechanism.displayName = "CollisionMechanism";
