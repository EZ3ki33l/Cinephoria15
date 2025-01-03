"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "../_components/_layout/button";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "framer-motion";

export default function page() {
  return (
    <div className="relative">
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
            Bienvenue dans l'univers Cinéphoria.
          </div>
          <div className="font-extralight text-base md:text-xl dark:text-neutral-200 py-4">
            Découvrez notre histoire, notre engagement pour l'environnement et
            notre passion pour le cinéma.
          </div>
        </motion.div>
      </AuroraBackground>
      </div>
      <div className="grid grid-row-2 justify-center gap-10">
        <div className="col-span-1">
          <Image
            src="/images/cinephoria-employé.jpg"
            alt="photo d'une partie des employés"
            width={500}
            height={500}
            className="rounded-2xl overflow-hidden shadow-md"
          />
          <legend className="flex text-muted-foreground text-xs justify-center">
            Une partie de l'équipe Cinéphoria lors de la soirée des 20ans
          </legend>
        </div>
        <div className="col-start-2 col-span-1">
          <Image
            src="/images/cinephoria-patron.jpg"
            alt="photo des créateurs"
            width={500}
            height={500}
            className="rounded-2xl overflow-hidden shadow-md"
          />
          <legend className="flex text-muted-foreground text-xs justify-center">
            Amandine, Romain et JoanForial, créateurs de Cinéphoria
          </legend>
        </div>
      </div>
      <div className="flex justify-center text-2xl my-16 p-6 border rounded-2xl w-[80%] mx-auto ">
        <div className="flex flex-col gap-5">
          <p className="text-justify">
            <span className="text-3xl text-primary mr-2">"</span>Plongez avec
            nous au cœur de l'émotion cinématographique. Cinéphoria, c'est
            l'assurance de vivre une expérience unique, où le plaisir du grand
            écran se conjugue avec un engagement fort pour l'environnement.
            <span className="text-3xl text-primary ml-2">"</span>
          </p>
          <legend className="flex text-muted-foreground text-xs justify-end">
            Phrase d'introduction de Joan Forial lors de la présentation du
            dernier cinéma Cinéphoria à Liège
          </legend>
        </div>
      </div>
      <div className="my-16 space-y-5 text-justify">
        <p>
          <strong className="text-primary text-lg font-extrabold">
            Une histoire d'amour pour le cinéma :
          </strong>
          <br />
          Fondée par des passionnés, Cinéphoria a su se faire une place de choix
          dans le paysage cinématographique français. Depuis plus de 20 ans,
          nous vous proposons une programmation riche et variée, des dernières
          sorties aux classiques du cinéma.
        </p>
        <p>
          <strong className="text-primary text-lg font-extrabold">
            Un engagement fort pour l'environnement :
          </strong>
          <br />
          Chez Cinéphoria, nous croyons en un cinéma responsable. C'est pourquoi
          nous reversons 20% de notre chiffre d'affaires annuel à des
          initiatives écologiques. En choisissant Cinéphoria, vous contribuez à
          un monde plus vert.
        </p>
        <p>
          <strong className="text-primary text-lg font-extrabold">
            Un réseau de cinémas d'exception :
          </strong>
          <br />
          Avec 7 cinémas répartis en France (Nantes, Bordeaux, Paris, Toulouse,
          Lille) et en Belgique (Charleroi, Liège), nous sommes proches de chez
          vous. Nos salles, conçues pour vous offrir le meilleur confort, sont
          équipées des dernières technologies en matière de projection et de
          son.
        </p>
        <div>
          <p>
            <strong className="text-primary text-lg font-extrabold">
              Une expérience sur mesure :
            </strong>
            <br />
          </p>
          <ul className="list-disc list-inside ml-5">
            <li>
              Des fauteuils grand confort : Pour vous détendre et profiter
              pleinement de votre séance.
            </li>
            <li>
              Une programmation variée : Des avant-premières, des films
              d'auteur, des ciné-clubs... il y en a pour tous les goûts.
            </li>
            <li>
              Des événements spéciaux : Soirées à thème, ciné-concerts,
              rencontres avec des réalisateurs...
            </li>
            <li>
              Une restauration de qualité : Des produits frais et locaux pour
              satisfaire toutes vos envies.
            </li>
          </ul>
          <div className="mt-5">
            <strong className="text-primary text-lg font-extrabold">
              Rejoignez la communauté Cinéphoria :
            </strong>
            <br /> En devenant membre de notre programme de fidélité, vous
            bénéficiez de nombreux avantages : préventes, réductions,
            invitations...
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-5 justify-center text-center text-2xl mb-16 p-6 border rounded-2xl w-[80%] mx-auto ">
        Réservez dès maintenant votre place et vivez une expérience
        cinématographique inoubliable !
        <Link href="/films">
          <Button size="large">Accéder à nos derniers films</Button>
        </Link>
      </div>
    </div>
  );
}
