"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "framer-motion";
import { getShowtimesByScreen } from "@/app/reservation/_components/action";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/app/_components/_layout/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import Image from "next/image";
import { SeatSelectionModal } from "@/app/reservation/_components/SeatSelectionModal";
import { CinemasPageSkeleton } from "@/app/_components/skeletons";

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
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState<Date>(new Date());
  const [showtimesByScreen, setShowtimesByScreen] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedShowtime, setSelectedShowtime] = useState<any>(null);
  const [modalStep, setModalStep] = useState<
    "selection" | "payment" | "confirmation" | "error"
  >("selection");

  useEffect(() => {
    const fetchCinemas = async () => {
      setIsLoading(true);
      try {
        const fetchedCinemas = await getAllCinemas();
        const updatedCinemas = fetchedCinemas.map((cinema: any) => ({
          ...cinema,
          screens: Array.isArray(cinema.Screens)
            ? cinema.Screens.map((screen: any) => ({
                ...screen,
                seats: Array.isArray(screen.Seats) ? screen.Seats : [],
                projectionType: screen.ProjectionType?.name || "Inconnu",
                soundSystemType: screen.SoundSystemType?.name || "Inconnu",
              }))
            : [],
          Equipment: cinema.Equipment || []
        }));
        setCinemas(updatedCinemas);
      } catch (error) {
        console.error("Erreur lors du chargement des cinémas:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCinemas();
  }, []);

  useEffect(() => {
    const fetchShowtimes = async () => {
      if (!selectedCinema) return;

      try {
        const result = await getShowtimesByScreen(selectedCinema.id, date);
        if (result.success) {
          setShowtimesByScreen(result.data || []);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des séances:", error);
      }
    };

    fetchShowtimes();
  }, [selectedCinema, date]);

  const handleCinemaSelect = (cinemaId: number) => {
    const cinema = cinemas.find((c) => c.id === cinemaId);
    setSelectedCinema(cinema || null);
  };

  const handleMarkerClick = (cinema: Cinema) => {
    setSelectedCinema(cinema);
  };

  const handleOpenModal = (showtime: any) => {
    setSelectedShowtime(showtime);
    setModalOpen(true);
    setModalStep("selection");
  };

  const getShowtimesByMovie = () => {
    const movieMap = new Map();

    showtimesByScreen.forEach((screenData) => {
      screenData.showtimes.forEach((showtime: any) => {
        const movieId = showtime.Movie.id;
        if (!movieMap.has(movieId)) {
          movieMap.set(movieId, {
            movie: showtime.Movie,
            showtimes: [],
          });
        }
        movieMap.get(movieId).showtimes.push({
          ...showtime,
          screen: screenData.screen,
        });
      });
    });

    return Array.from(movieMap.values());
  };

  if (isLoading) {
    return <CinemasPageSkeleton />;
  }

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
              Explorez l'univers futuriste des cinémas Cinéphoria !
            </div>
            <div className="font-extralight text-base md:text-xl dark:text-neutral-200 text-center py-4">
              Sur cette page, retrouvez toutes les informations sur nos cinémas,
              y compris les coordonnées, les horaires des séances et les films à
              l'affiche, pour planifier votre prochaine sortie au cinéma en
              toute simplicité.
            </div>
          </motion.div>
        </AuroraBackground>
      </div>
      <div className="my-16 space-y-10">
        <Typo variant="h1">Nos cinémas :</Typo>

        {/* Sélecteur */}
        <div className="mb-5 w-[50%]">
          {isLoading ? (
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
          <div className="flex items-center justify-between mb-6">
            <Typo variant="h1" component="h1">
              Les films en salle :
            </Typo>

            {selectedCinema && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="icon" className="flex items-center gap-2">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(date, "d MMMM yyyy", { locale: fr })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => newDate && setDate(newDate)}
                    initialFocus
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>

          {!selectedCinema ? (
            <div className="text-center py-10 text-gray-500">
              Veuillez sélectionner un cinéma pour voir les séances disponibles
            </div>
          ) : getShowtimesByMovie().length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              Aucune séance n'est disponible pour ce cinéma à cette date
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getShowtimesByMovie().map(({ movie, showtimes }) => (
                <Card key={movie.id} className="overflow-hidden">
                  <div className="relative h-[300px] w-full">
                    <Image
                      src={movie.images?.[0] || "/placeholder-movie.jpg"}
                      alt={movie.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{movie.title}</CardTitle>
                    <div className="flex gap-2 flex-wrap">
                      {movie.genres?.map((genre: any) => (
                        <span
                          key={genre.id}
                          className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-500">
                        Durée : {Math.floor(movie.duration / 60)}h
                        {movie.duration % 60 ? `${movie.duration % 60}min` : ""}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {showtimes
                          .sort(
                            (a: any, b: any) =>
                              new Date(a.startTime).getTime() -
                              new Date(b.startTime).getTime()
                          )
                          .map((showtime: any) => (
                            <Button
                              key={showtime.id}
                              variant="outline"
                              onClick={() => handleOpenModal(showtime)}
                              className="flex-grow-0"
                            >
                              {format(new Date(showtime.startTime), "HH:mm", {
                                locale: fr,
                              })}
                              <span className="ml-1 text-xs text-gray-500">
                                (Salle {showtime.screen.number})
                              </span>
                            </Button>
                          ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedShowtime && (
        <SeatSelectionModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          showtime={{
            id: selectedShowtime.id,
            screen: {
              id: selectedShowtime.Screen.id,
              number: selectedShowtime.Screen.number,
            },
          }}
          onSeatSelect={() => {}}
          onStepChange={setModalStep}
          currentStep={modalStep}
        />
      )}
    </div>
  );
}
