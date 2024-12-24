"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllCinemas } from "@/app/(private-access)/administrateur/cinemas/_components/actions";
import { DynamicMap } from "@/app/_components/maps/DynamicMap";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Typo } from "@/app/_components/_layout/typography";

export interface Cinema {
  id: number;
  name: string;
  Address: {
    street: string;
    postalCode: number;
    city: string;
    lat: number;
    lng: number;
  };
  screens: {
    id: number;
    number: number;
    seats: { id: number; row: number; column: number }[];
    projectionType?: string;
    soundSystemType?: string;
  }[]; // Structure des écrans
  Equipment: { id: number; name: string }[]; // Structure des équipements
}

export default function CinemasPage() {
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const fetchedCinemas = await getAllCinemas();
        const updatedCinemas = fetchedCinemas.map((cinema) => ({
          ...cinema,
          screens: Array.isArray(cinema.Screens)
            ? cinema.Screens.map((screen) => {
                let seats: { id: number; row: number; column: number }[] = [];
                if (typeof screen.Seats === "number") {
                  for (let i = 0; i < screen.Seats; i++) {
                    seats.push({
                      id: i + 1,
                      row: Math.floor(i / 10) + 1,
                      column: (i % 10) + 1,
                    });
                  }
                } else if (Array.isArray(screen.Seats)) {
                  seats = screen.Seats;
                }
                return {
                  ...screen,
                  seats,
                  projectionType: screen.ProjectionType?.name || "Inconnu",
                  soundSystemType: screen.SoundSystemType?.name || "Inconnu",
                };
              })
            : [],
        }));
        setCinemas(updatedCinemas);
      } catch (error) {
        console.error("Erreur lors de la récupération des cinémas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCinemas();
  }, []);

  const handleCinemaSelect = (cinemaId: number) => {
    const cinema = cinemas.find((c) => c.id === cinemaId);
    setSelectedCinema(cinema || null);
  };

  const handleMarkerClick = (cinema: Cinema) => {
    setSelectedCinema(cinema);
  };

  return (
    <div className="my-16 space-y-10">
      <Typo variant="h1">Nos cinémas :</Typo>

      {/* Sélecteur */}
      <div className="mb-5 w-[50%]">
        {loading ? (
          <div>Chargement des cinémas...</div>
        ) : (
          <Select
            value={selectedCinema?.id.toString() || ""}
            onValueChange={(value) => handleCinemaSelect(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un cinéma" />
            </SelectTrigger>
            <SelectContent>
              {cinemas.map((cinema) => (
                <SelectItem key={cinema.id} value={cinema.id.toString()}>
                  {cinema.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Conteneur principal */}
      <div className="flex w-full gap-5">
        {/* Section gauche - Card */}
        <div className="flex-1">
          {selectedCinema && (
            <Card className="h-full">
              <CardHeader>
                <CardTitle>
                  <Typo variant="h3">{selectedCinema.name}</Typo>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{selectedCinema.Address.street}</p>
                <p>
                  {selectedCinema.Address.postalCode}{" "}
                  {selectedCinema.Address.city}
                </p>
                <div>
                  <h3 className="text-lg font-semibold">Équipements :</h3>
                  {selectedCinema.Equipment.length > 0 ? (
                    <ul className="list-disc ml-5">
                      {selectedCinema.Equipment.map((equipment) => (
                        <li key={equipment.id}>{equipment.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <Typo variant="body-sm" component="p">
                      Aucun équipement disponible
                    </Typo>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Salles :</h3>
                  {selectedCinema.screens.map((screen) => (
                    <Accordion key={screen.id} type="single" collapsible>
                      <AccordionItem value={`screen-${screen.id}`}>
                        <AccordionTrigger>
                          Salle {screen.number}
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="list-disc ml-5">
                            <li>{screen.seats.length} sièges</li>
                            <li>Projection : {screen.projectionType}</li>
                            <li>Système audio : {screen.soundSystemType}</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Section droite - Carte */}
        <div className="flex-1">
          <div className="h-full">
            <DynamicMap
              cinemas={cinemas}
              selectedCinema={selectedCinema}
              onMarkerClick={handleMarkerClick}
            />
          </div>
        </div>
      </div>

      {/* Section pleine largeur */}
      <div className="w-full">
        <Typo variant="h1" component="h1">
          Les films en salle :
        </Typo>
        <Typo variant="body-base" component="p">
          Contenu additionnel ici.
        </Typo>
      </div>
    </div>
  );
}
