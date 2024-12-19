"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Typo } from "@/app/_components/_layout/typography";
import { useEffect } from "react";
import { Spinner } from "@/app/_components/_layout/spinner";
import { getAllCinemas } from "@/app/_components/_maps copy/_components/getAllCinemas";
import { getShowtimesByScreen } from "./_components/action";
import { Calendar } from "@/components/ui/calendar";
import { fr } from "date-fns/locale";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/app/_components/_layout/button";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "framer-motion";
import { SeatSelectionModal } from "./_components/SeatSelectionModal";

interface Cinema {
  id: number;
  name: string;
  Address: {
    city: string;
  };
}

interface Showtime {
  id: number;
  startTime: Date;
  Screen: {
    id: number;
    number: number;
    ProjectionType: { name: string };
    SoundSystemType: { name: string };
  };
  Movie: {
    id: number;
    title: string;
    duration: number;
    images: string[];
    genres: { id: number; name: string }[];
  };
}

interface Screen {
  id: number;
  number: number;
  ProjectionType: {
    name: string;
  };
  SoundSystemType: {
    name: string;
  };
}

interface ShowtimesByScreen {
  screen: Screen;
  showtimes: Showtime[];
}

function groupShowtimesByMovie(showtimesByScreen: ShowtimesByScreen[]) {
  const movieShowtimes = new Map<
    number,
    {
      movie: Showtime["Movie"];
      showtimes: Array<{
        id: number;
        startTime: Date;
        screen: Showtime["Screen"];
      }>;
    }
  >();

  showtimesByScreen.forEach(({ showtimes }) => {
    showtimes.forEach((showtime) => {
      if (!movieShowtimes.has(showtime.Movie.id)) {
        movieShowtimes.set(showtime.Movie.id, {
          movie: showtime.Movie,
          showtimes: [],
        });
      }
      movieShowtimes.get(showtime.Movie.id)?.showtimes.push({
        id: showtime.id,
        startTime: showtime.startTime,
        screen: showtime.Screen,
      });
    });
  });

  return Array.from(movieShowtimes.values());
}

export default function ShowtimePage() {
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [selectedCinema, setSelectedCinema] = useState<string>("");
  const [showtimesByScreen, setShowtimesByScreen] = useState<
    ShowtimesByScreen[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedShowtime, setSelectedShowtime] = useState<number | null>(null);
  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
  const [selectedShowtimeDetails, setSelectedShowtimeDetails] = useState<{
    id: number;
    screen: { number: number };
  } | null>(null);

  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const data = await getAllCinemas();
        setCinemas(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des cinémas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCinemas();
  }, []);

  useEffect(() => {
    const fetchShowtimes = async () => {
      if (!selectedCinema || !date) return;

      setLoading(true);
      try {
        const result = await getShowtimesByScreen(
          parseInt(selectedCinema),
          date
        );
        if (result.success) {
          setShowtimesByScreen(result.data || []);
        } else {
          console.error(result.error);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des séances:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShowtimes();
  }, [selectedCinema, date]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-svh">
        <Typo variant="h2" theme="primary">
          Chargement...
        </Typo>
        <Spinner size="large" />
      </div>
    );
  }

  return (
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
            Plongez dans l'univers du cinéma et réservez votre place pour une
            expérience inoubliable avec Cinéphoria !
          </div>
          <div className="font-extralight text-base md:text-xl dark:text-neutral-200 py-4">
            Choisissez, votre cinéma, votre film, votre séance et préparez-vous
            à vibrer devant le grand écran !
          </div>
        </motion.div>
      </AuroraBackground>
      <div className="flex flex-col my-16 gap-6 px-8">
        <Typo variant="h1" component="h1">
          Nos séances :
        </Typo>

        <div className="flex gap-6">
          <div>
            <Select onValueChange={setSelectedCinema} value={selectedCinema}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Choisissez un cinéma" />
              </SelectTrigger>
              <SelectContent>
                {cinemas.map((cinema) => (
                  <SelectItem key={cinema.id} value={cinema.id.toString()}>
                    {cinema.name} - {cinema.Address.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedCinema && (
          <div className="mt-8">
            <div className="flex items-center gap-4 mb-6">
              <Typo variant="h2" component="h2">
                Sélectionnez une date :
              </Typo>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button variant="icon" className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    {format(date, "dd MMMM yyyy", { locale: fr })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                      if (newDate) {
                        setDate(newDate);
                        setIsCalendarOpen(false);
                      }
                    }}
                    locale={fr}
                    disabled={{ before: new Date() }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-6">
              {groupShowtimesByMovie(showtimesByScreen).map(
                ({ movie, showtimes }) => (
                  <div
                    key={movie.id}
                    className="border rounded-lg p-6 bg-white shadow-sm"
                  >
                    <div className="flex gap-6">
                      <img
                        src={movie.images[0]}
                        alt={movie.title}
                        className="w-32 h-48 object-cover rounded"
                      />
                      <div className="flex-1">
                        <Typo variant="h3" component="h3" className="mb-2">
                          {movie.title}
                        </Typo>
                        <div className="flex gap-2 flex-wrap mb-4">
                          {movie.genres.map((genre) => (
                            <span
                              key={genre.id}
                              className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                            >
                              {genre.name}
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2 text-sm text-gray-600 mb-4">
                          <span>{movie.duration} minutes</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                          {showtimes
                            .sort(
                              (a, b) =>
                                a.startTime.getTime() - b.startTime.getTime()
                            )
                            .map((showtime) => {
                              const startTime = new Date(showtime.startTime);
                              const endTime = new Date(
                                startTime.getTime() + movie.duration * 60000
                              );
                              const isSelected =
                                selectedShowtime === showtime.id;

                              return (
                                <div
                                  key={showtime.id}
                                  className={`p-3 rounded-lg border text-left transition-colors ${
                                    isSelected
                                      ? "border-primary bg-primary/5"
                                      : "border-gray-200"
                                  }`}
                                >
                                  <div 
                                    className="cursor-pointer hover:bg-gray-50 p-2 rounded"
                                    onClick={() => setSelectedShowtime(showtime.id)}
                                  >
                                    <div className="font-medium flex items-center gap-2">
                                      {startTime.toLocaleTimeString("fr-FR", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                      <span className="text-gray-400">
                                        <ArrowRight />
                                      </span>
                                      {endTime.toLocaleTimeString("fr-FR", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      Salle {showtime.screen.number}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {showtime.screen.ProjectionType.name}
                                    </div>
                                  </div>
                                  
                                  <Button
                                    variant="outline"
                                    size="small"
                                    className="mt-2 w-full"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedShowtimeDetails(showtime);
                                      setIsSeatModalOpen(true);
                                    }}
                                  >
                                    Choisir mon siège
                                  </Button>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
      {selectedShowtimeDetails && (
        <SeatSelectionModal
          isOpen={isSeatModalOpen}
          onClose={() => setIsSeatModalOpen(false)}
          showtime={selectedShowtimeDetails}
          onSeatSelect={(seatId) => {
            console.log("Siège sélectionné:", seatId);
            setIsSeatModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
