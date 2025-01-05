"use client";

import React from "react";
import { Typo } from "../_components/_layout/typography";
import Link from "next/link";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default function PlanDuSite() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        <AuroraBackground>
          <motion.div
            initial={{ opacity: 0.0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="relative flex flex-col gap-4 items-center justify-center px-4"
          >
            <div className="text-xl md:text-3xl font-bold dark:text-white text-center">
              Explorez l'univers fascinant de Cinéphoria !
            </div>
            <div className="font-extralight text-base md:text-xl dark:text-neutral-200 text-center py-4">
              Naviguez facilement à travers notre site et découvrez un monde
              de films captivants, d'informations sur nos cinémas et bien plus
              encore. Préparez-vous à vivre une expérience cinématographique
              inoubliable et plongez directement dans l'action dès maintenant
              !
            </div>
          </motion.div>
        </AuroraBackground>
      </div>
      <div className="my-16 space-y-10">
        <Typo variant="h1" component="h1" className="mb-8">
          Plan du Site
        </Typo>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Pages Principales */}
          <section>
            <Typo variant="h3" component="h2" className="mb-4 text-primary">
              Pages Principales
            </Typo>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-700 hover:text-primary transition-colors"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  href="/a-propos"
                  className="text-gray-700 hover:text-primary transition-colors"
                >
                  À propos de nous
                </Link>
              </li>
              <li>
                <Link
                  href="/cinemas"
                  className="text-gray-700 hover:text-primary transition-colors"
                >
                  Nos cinémas
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-700 hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </section>

          {/* Réservation et Films */}
          <section>
            <Typo variant="h3" component="h2" className="mb-4 text-primary">
              Réservation et Films
            </Typo>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/reservation"
                  className="text-gray-700 hover:text-primary transition-colors"
                >
                  Réserver une séance
                </Link>
              </li>
              <li>
                <Link
                  href="/films"
                  className="text-gray-700 hover:text-primary transition-colors"
                >
                  Films à l&apos;affiche
                </Link>
              </li>
            </ul>
          </section>

          {/* Espace Privé */}
          <section>
            <Typo variant="h3" component="h2" className="mb-4 text-primary">
              Espace Privé
            </Typo>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/administrateur"
                  className="text-gray-700 hover:text-primary transition-colors"
                >
                  Administrateur
                </Link>
              </li>
              <li>
                <Link
                  href="/manager"
                  className="text-gray-700 hover:text-primary transition-colors"
                >
                  Manager
                </Link>
              </li>
            </ul>
          </section>

          {/* Informations Légales */}
          <section>
            <Typo variant="h3" component="h2" className="mb-4 text-primary">
              Informations Légales
            </Typo>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/mentions-legales"
                  className="text-gray-700 hover:text-primary transition-colors"
                >
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link
                  href="/politique-confidentialite"
                  className="text-gray-700 hover:text-primary transition-colors"
                >
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link
                  href="/cgv"
                  className="text-gray-700 hover:text-primary transition-colors"
                >
                  CGV
                </Link>
              </li>
            </ul>
          </section>

          {/* Réseaux Sociaux */}
          <section>
            <Typo variant="h3" component="h2" className="mb-4 text-primary">
              Réseaux Sociaux
            </Typo>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://facebook.com"
                  target="_blank"
                  className="text-gray-700 hover:text-primary transition-colors"
                >
                  Facebook
                </Link>
              </li>
              <li>
                <Link
                  href="https://twitter.com"
                  target="_blank"
                  className="text-gray-700 hover:text-primary transition-colors"
                >
                  Twitter
                </Link>
              </li>
              <li>
                <Link
                  href="https://instagram.com"
                  target="_blank"
                  className="text-gray-700 hover:text-primary transition-colors"
                >
                  Instagram
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
