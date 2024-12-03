"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllCinemas } from "@/app/(private-access)/administrateur/cinemas/_components/actions";
import { Maps2 } from "@/app/_components/_maps copy/maps"; // Ajuste le chemin en fonction de la structure de ton projet

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
  screens: any[]; // Définir le type des écrans plus précisément si possible
  Equipment: any[]; // Définir le type des équipements plus précisément si possible
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
          screens: cinema.Screens.map((screen) => ({
            ...screen,
            Seats: screen.Seats.map((seat) => ({
              ...seat,
              screenId: screen.id,
            })),
          })),
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
    <div className="my-16">
      <h1 className="font-h1 max-sm:text-2xl max-md:text-3xl text-5xl mb-5">
        Nos cinémas :
      </h1>
      <div className="grid grid-cols-2">
        {/* Section gauche */}
        <div className="col-span-1 relative space-y-10 px-5">
          <div className="space-y-2">
            <h2>Selectionnez un cinéma :</h2>
            <div>
              {loading ? (
                <div>Chargement des cinémas...</div>
              ) : (
                <div className="w-[50%]">
                  <Select
                    value={selectedCinema?.id.toString() || ""}
                    onValueChange={(value) =>
                      handleCinemaSelect(parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un cinéma" />
                    </SelectTrigger>
                    <SelectContent>
                      {cinemas.map((cinema) => (
                        <SelectItem
                          key={cinema.id}
                          value={cinema.id.toString()}
                        >
                          {cinema.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          {/* Informations sur le cinéma sélectionné */}
          {selectedCinema && (
            <Card className="w-[90%] p-10">
              <CardHeader>
                <CardTitle>
                  <div className="text-2xl">{selectedCinema.name}</div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-col">
                  <div className="text-muted-foreground">
                    <p>{selectedCinema.Address.street}</p>
                    <p>
                      {selectedCinema.Address.postalCode}{" "}
                      {selectedCinema.Address.city}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-y-2">
                  <h2 className="text-lg font-semibold">Les équipements :</h2>
                  {selectedCinema.Equipment.length > 0 ? (
                    <ul className="list-disc ml-5">
                      {selectedCinema.Equipment.map((equipment: any) => (
                        <li key={equipment.id} className="text-base">
                          {equipment.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Aucun équipement disponible</p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/cinemas/${selectedCinema.id}`}>
                  <Button>Voir les séances</Button>
                </Link>
              </CardFooter>
            </Card>
          )}
        </div>

        {/* Section droite - Carte */}
        <div className="m-0">
          <div className="place-content-center h-full w-full">
            <Maps2
              cinemas={cinemas}
              selectedCinema={selectedCinema}
              onMarkerClick={handleMarkerClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
