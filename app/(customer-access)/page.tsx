"use client";

import { useState, useEffect } from "react";
import { getAllCinemas } from "@/app/(private-access)/administrateur/cinemas/_components/actions";
import { Separator } from "@/components/ui/separator";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Typo } from "../_components/_layout/typography";
import { DynamicMap } from "@/app/_components/maps/DynamicMap";
import { Button } from "../_components/_layout/button";
import { InfiniteExpandableCards } from "../_components/expandableMovieCard";
import { NewsCarousel } from "../_components/newsCarousel";
import { AnimationHome } from "@/components/ui/animationHome";
import { MapsCinema } from "../_components/maps/Maps";
import { HeaderWithCinema } from "@/app/_components/_layout/HeaderWithCinema";
import { Cinema } from "@prisma/client";

export default function HomePage() {
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [formattedCinemas, setFormattedCinemas] = useState<MapsCinema[]>([]);
  const [uniqueCities, setUniqueCities] = useState<string[]>([]);

  useEffect(() => {
    async function loadCinemas() {
      try {
        const fetchedCinemas = await getAllCinemas();
        setCinemas(fetchedCinemas);

        const cities = [
          ...new Set(fetchedCinemas.map((cinema) => cinema.Address.city)),
        ];
        setUniqueCities(cities);

        const formatted: MapsCinema[] = fetchedCinemas.map((cinema) => ({
          ...cinema,
          screens: cinema.Screens.map((screen) => ({
            id: screen.id,
            number: screen.number,
            seats: screen.Seats.map((seat) => ({
              id: seat.id,
              row: seat.row,
              column: seat.column,
            })),
            projectionType: screen.ProjectionType.name,
            soundSystemType: screen.SoundSystemType.name,
          })),
        }));
        setFormattedCinemas(formatted);
      } catch (error) {
        console.error("Erreur lors du chargement des cinémas:", error);
      }
    }
    loadCinemas();
  }, []);

  return (
    <div>
      <div className="flex flex-col space-y-6">
        <AnimationHome />
        <div className="flex flex-col py-5">
          <div className="flex justify-between items-center">
            <Typo variant="h1" component="h1">
              Les dernières sorties :
            </Typo>
            <Link href="/films">
              <Button variant="outline" size={"medium"}>
                Voir tous les films
              </Button>
            </Link>
          </div>

          <div className="pt-5">
            <InfiniteExpandableCards />
          </div>
        </div>
        <Separator className="my-10" />
        <div className="flex flex-col py-5">
          <div className="flex justify-between">
            <Typo variant="h1" component="h1">
              Nos cinémas :
            </Typo>
            <HeaderWithCinema cinemas={cinemas} />
          </div>
          <div className="grid md:grid-cols-2">
            <div className="flex flex-col justify-center gap-y-3 pr-16 text-justify">
              <Typo variant="body-base" component="p">
                <strong className="text-lg">Cinéphoria</strong>, c'est un réseau
                de cinémas où chaque projection est un{" "}
                <strong className="text-lg">moment unique</strong>.
              </Typo>
              <Typo variant="body-base" component="p">
                Retrouvez-nous à :
              </Typo>
              <ul className="list-disc list-inside ml-5 font-semibold">
                {uniqueCities.map((city, index) => (
                  <li key={index}>{city}</li>
                ))}
              </ul>
              <Typo variant="body-base" component="p">
                Nos salles{" "}
                <strong className="text-lg">modernes et conviviales</strong>{" "}
                vous offrent l’opportunité de vivre le cinéma sous toutes ses
                formes, des grands classiques aux nouveautés.
              </Typo>
            </div>
            <div className="">
              <DynamicMap cinemas={formattedCinemas} />
            </div>
          </div>
        </div>
        <Separator className="my-10" />
        <div className="grid md:grid-cols-6 py-5 mb-5">
          <div className="md:col-span-2">
            <Typo variant="h1" component="h1">
              Nous connaitre :
            </Typo>
            <div className="flex flex-col gap-3 text-justify px-3 ">
              <Typo variant="body-base" component="p" className="py-2">
                <span className="text-lg font-semibold">Cinéphoria :</span> Plus
                qu'un cinéma, une expérience.
              </Typo>
              <Typo variant="body-base" component="p">
                Dégustez de délicieux produits locaux, installez-vous dans nos
                fauteuils grand confort et laissez-vous emporter par des films
                soigneusement sélectionnés. Un engagement fort pour
                l'environnement vient compléter cette offre.
              </Typo>
            </div>
            <Link href="/a-propos" className="flex justify-center py-5">
              <Button
                variant="primary"
                iconPosition="right"
                icon={<ArrowRight className="h-4 w-4" />}
              >
                En voir plus
              </Button>
            </Link>
          </div>
          <div className="md:col-span-4 md:ml-10">
            <Typo variant="h1" component="h1">
              Nos actualités :
            </Typo>
            <div className="">
              <NewsCarousel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
