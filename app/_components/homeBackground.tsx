"use client";

import React, { useEffect, useState } from "react";
import { BackgroundBeamsWithCollision } from "@/components/ui/backgroundBeamsWithColisions";
import { Typo } from "./_layout/typography";
import { Spinner } from "./_layout/spinner";

const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Vérifie si l'environnement est client
    if (typeof window === "undefined") return;

    const checkIsMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768); // Met à jour si largeur < 768
    };

    // Exécute une vérification initiale
    checkIsMobile();

    // Ajoute un listener pour les redimensionnements
    window.addEventListener("resize", checkIsMobile);

    // Nettoie le listener pour éviter des fuites mémoire
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return isMobile;
};

const ResponsiveComponent = () => {
  const isMobile = useIsMobile();
  const [isHydrated, setIsHydrated] = useState(false);

  // Assure que le composant attend l'hydratation
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Empêche tout affichage avant l'hydratation
  if (!isHydrated) {
    <Typo variant="body-lg" theme="primary">
      Chargement ... <Spinner />{" "}
    </Typo>; // Retourne rien tant que le client n'est pas hydraté
  }

  return (
    <div>
      {isMobile ? (
        <div className="flex items-center justify-center text-center border-b w-svh min-h-[30svh] max-h-[60svh]">
          <Typo
            variant="h1"
            component="h2"
            className="relative font-sans tracking-tight flex flex-col"
          >
            Évadez-vous le temps d'un film.
            <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
              <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-primary-light via-secondary-dark to-secondary-light [text-shadow:0_0_rgba(0,0,0,0.1)]">
                <span className="">Bienvenue chez Cinéphoria !</span>
              </div>
              <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-primary-light via-secondary-dark to-secondary-light py-4">
                <span className="">Bienvenue chez Cinéphoria !</span>
              </div>
            </div>
          </Typo>
        </div>
      ) : (
        <BackgroundBeamsWithCollision className="text-center border-b w-svh max-h-[60svh]">
          <Typo
            variant="h1"
            component="h2"
            className="relative font-sans tracking-tight flex flex-col"
          >
            Évadez-vous le temps d'un film.
            <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
              <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-primary-light via-secondary-dark to-secondary-light [text-shadow:0_0_rgba(0,0,0,0.1)]">
                <span className="">Bienvenue chez Cinéphoria !</span>
              </div>
              <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-primary-light via-secondary-dark to-secondary-light py-4">
                <span className="">Bienvenue chez Cinéphoria !</span>
              </div>
            </div>
          </Typo>
        </BackgroundBeamsWithCollision>
      )}
    </div>
  );
};

export default ResponsiveComponent;
