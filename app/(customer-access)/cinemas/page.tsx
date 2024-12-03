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
import { Maps } from "@/app/_components/_maps/maps";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAllCinemas } from "@/app/(private-access)/administrateur/cinemas/_components/actions"; // Vérifiez que le chemin est correct

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
  seats: Seat[];
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
  Address: {
    street: string;
    postalCode: number;
    city: string;
    lat: number;
    lng: number;
  };
  screens: {
    id: number;
    projectionType: string;
    soundSystemType: string;
    price: number;
    number: number;
    seats: {
      id: number;
      row: number;
      column: number;
    }[];
  }[];
  Equipment: {
    id: number;
    name: string;
    cinemaId: number | null;
  }[];
}

export default function CinemasPage() {
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const fetchedCinemas = await getAllCinemas();
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
            screens: Array.isArray(cinema.Screens)
              ? cinema.Screens.map((screen) => {
                  let seats = [];
                  if (typeof screen.Seats === "number") {
                    for (let i = 0; i < screen.Seats; i++) {
                      seats.push({
                        id: i + 1,
                        row: Math.floor(i / 10) + 1,
                        column: (i % 10) + 1,
                      });
                    }
                  } else {
                    seats = screen.Seats || [];
                  }

                  return {
                    id: screen.id,
                    projectionType: screen.ProjectionType.name,
                    soundSystemType: screen.SoundSystemType.name,
                    price: 0, // Optionnel
                    number: screen.number,
                    seats: seats,
                  };
                })
              : [],
            Equipment: cinema.Equipment || [],
          }));
          setCinemas(transformedCinemas);
          if (transformedCinemas.length > 0) {
            setSelectedCinema(transformedCinemas[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching cinemas:", error);
      } finally {
        setLoading(false);
      }
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
                    value={selectedCinema.id.toString()}
                    onValueChange={(value) => {
                      setSelectedCinema(
                        cinemas.find(
                          (cinema) => cinema.id === parseInt(value)
                        ) ?? null
                      );
                    }}
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
                        {selectedCinema.Equipment.length > 0 ? (
                          <ul className="list-disc ml-5">
                            {selectedCinema.Equipment.map(
                              (equipment, index) => (
                                <li key={index} className="text-base">
                                  {equipment.name}
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
                        {selectedCinema.screens.length > 0 && (
                          <ul className="list-disc list-inside ml-10">
                            {selectedCinema.screens.map((screen) => (
                              <Accordion
                                type="single"
                                collapsible
                                key={screen.id}
                              >
                                <AccordionItem value={`item-${screen.id}`}>
                                  <AccordionTrigger>
                                    Salle {screen.number} :
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <ul className="list-disc list-inside ml-5">
                                      <li>{screen.seats.length} sièges</li>
                                      <li>
                                        Type de projection :{" "}
                                        {screen.projectionType}
                                      </li>
                                      <li>
                                        Type de système audio :{" "}
                                        {screen.soundSystemType}
                                      </li>
                                    </ul>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            ))}
                          </ul>
                        )}
                      </div>
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
