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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { getAllCinemas } from "@/app/_components/_maps/_components/marker";
import { Maps } from "@/app/_components/_maps/maps";
import { Select } from "@/components/ui/select";

interface Seat {
  id: number;
  row: number;
  column: number;
}

interface Screen {
  id: number;
  number: number;
  projectionType: string;
  soundSystemType: string;
  price: number;
  seats: Seat[]; // Vérifiez que c'est un tableau
}

interface Address {
  street: string;
  postalCode: number;
  city: string;
  lat: number;
  lng: number;
}

interface Cinema {
  id: number;
  name: string;
  Address: Address;
  screens: Screen[];
  Equipment: string[];
}

export default function CinemasPage() {
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null);
  const [loading, setLoading] = useState(true); // Etat de chargement

  useEffect(() => {
    const fetchCinemas = async () => {
      const fetchedCinemas = await getAllCinemas();

      // Vérifier si les données sont valides
      if (fetchedCinemas && Array.isArray(fetchedCinemas)) {
        const transformedCinemas: Cinema[] = fetchedCinemas.map((cinema) => ({
          id: cinema.id,
          name: cinema.name,
          Address: {
            street: cinema.Address?.street || "Adresse inconnue",
            postalCode: cinema.Address?.postalCode || 0,
            city: cinema.Address?.city || "Ville inconnue",
            lat: cinema.Address?.lat || 0,
            lng: cinema.Address?.lng || 0,
          },
          screens: Array.isArray(cinema.screens)
            ? cinema.screens.map((screen) => {
                // Vérification si seats est un nombre (indiquant le nombre total de sièges)
                let seats = [];
                if (typeof screen.seats === "number") {
                  // Si seats est un nombre, créez un tableau avec un nombre de sièges correspondant
                  for (let i = 0; i < screen.seats; i++) {
                    seats.push({
                      id: i + 1,
                      row: Math.floor(i / 10) + 1,
                      column: (i % 10) + 1,
                    });
                  }
                } else {
                  // Si seats est déjà un tableau, laissez-le tel quel
                  seats = screen.seats || [];
                }

                return {
                  id: screen.id,
                  projectionType: screen.projectionType,
                  soundSystemType: screen.soundSystemType,
                  price: 0, // Optionnel
                  number: screen.number,
                  seats: seats,
                };
              })
            : [],
          Equipment: cinema.equipment || [],
        }));
        setCinemas(transformedCinemas);
        if (transformedCinemas.length > 0) {
          setSelectedCinema(transformedCinemas[0]);
        }
      }
      setLoading(false); // Mise à jour de l'état de chargement après récupération des données
    };
    fetchCinemas();
  }, []);

  return (
    <div className="my-16">
      <h1 className="font-h1 max-sm:text-2xl max-md:text-3xl text-5xl mb-5">
        Nos cinémas :
      </h1>
      <div className="grid grid-cols-2">
        <div className="col-span-1 relative space-y-10 px-5">
          <div className="space-y-2">
            <h2>Selectionnez un cinéma :</h2>
            <div>
              {loading ? (
                <div>Chargement des cinémas...</div>
              ) : selectedCinema ? (
                <div className="w-[50%]">
                  <Select
                    value={`${selectedCinema.id}`}
                    onValueChange={(value) => {
                      setSelectedCinema(
                        cinemas.find(
                          (cinema) => cinema.id === parseInt(value)
                        ) ?? null
                      );
                    }}
                  >
                    {cinemas.map((cinema) => (
                      <option key={cinema.id} value={cinema.id.toString()}>
                        {cinema.name}
                      </option>
                    ))}
                  </Select>
                </div>
              ) : (
                <div>Aucun cinéma disponible</div>
              )}
            </div>
          </div>
          <div>
            {selectedCinema && (
              <Card className=" w-[90%] p-10">
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
                    <div>
                      <div>
                        {/* Liste des équipements */}
                        {selectedCinema.Equipment &&
                        selectedCinema.Equipment.length > 0 ? (
                          <ul className="list-disc ml-5">
                            {selectedCinema.Equipment.map(
                              (equipment, index) => (
                                <li key={index} className="text-base">
                                  {equipment
                                    .replace("_", " ")
                                    .split(" ")
                                    .map(
                                      (word) =>
                                        word.charAt(0).toUpperCase() +
                                        word.slice(1).toLowerCase()
                                    )
                                    .join(" ")}{" "}
                                  {/* Affiche le nom de l'équipement */}
                                </li>
                              )
                            )}
                          </ul>
                        ) : (
                          <p>Aucun équipement disponible</p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-y-1">
                      <div className="text-base underline">Nos salles :</div>
                      <div>
                        <div className="flex items-center gap-2 ml-5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-clapperboard w-4 h-4"
                          >
                            <path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z" />
                            <path d="m6.2 5.3 3.1 3.9" />
                            <path d="m12.4 3.4 3.1 4" />
                            <path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
                          </svg>{" "}
                          <p className="text-sm">
                            Nombre de salles : {selectedCinema.screens.length}
                          </p>
                        </div>
                        <ul className="list-disc list-inside ml-10">
                          {selectedCinema?.screens?.map((screen) => {
                            if (!Array.isArray(screen.seats)) {
                              console.error(
                                "Seats array est invalide",
                                screen.seats
                              );
                              return (
                                <li key={screen.id}>
                                  Pas de sièges disponibles
                                </li>
                              );
                            }
                            return (
                              <Accordion type="single" collapsible>
                                <AccordionItem
                                  key={screen.id}
                                  value="item-1"
                                  className="text-xl"
                                >
                                  <AccordionTrigger>
                                    Salle {screen.number} : {""}
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <ul className="list-disc list-inside ml-5">
                                      <li>{screen.seats.length} sièges</li>
                                      <li>
                                        Type de projection :{" "}
                                        {screen.projectionType
                                          .replace("_", " ")
                                          .split(" ")
                                          .map(
                                            (word) =>
                                              word.charAt(0).toUpperCase() +
                                              word.slice(1).toLowerCase()
                                          )
                                          .join(" ")}
                                      </li>
                                      <li>
                                        Type de système audio :{" "}
                                        {screen.soundSystemType
                                          .replace("_", " ")
                                          .split(" ")
                                          .map(
                                            (word) =>
                                              word.charAt(0).toUpperCase() +
                                              word.slice(1).toLowerCase()
                                          )
                                          .join(" ")}
                                      </li>
                                    </ul>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            );
                          })}
                        </ul>
                      </div>{" "}
                    </div>
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
        </div>

        <div className="m-0">
          <div className="place-content-center h-full w-full">
            <Maps />
          </div>
        </div>
      </div>
    </div>
  );
}
