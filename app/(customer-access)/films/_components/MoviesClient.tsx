'use client';

import { useState, useEffect } from "react";
import { Cinema, Genre, Movie } from "@prisma/client";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SelectItem } from "@radix-ui/react-select";
import { HoverEffect } from "@/components/ui/cardHoverEffect";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "framer-motion";
import { CinemaSelector } from "@/app/_components/CinemaSelector";
import { getUserFavoriteCinema } from "@/app/_actions/user";
import { Button } from "@/app/_components/_layout/button";
import { BookingModal } from "./BookingModal";

interface MovieWithGenres extends Movie {
  genres: Genre[];
}

interface MoviesClientProps {
  initialMovies: MovieWithGenres[];
  initialGenres: Genre[];
  cinemas: Cinema[];
}

export function MoviesClient({ initialMovies, initialGenres, cinemas }: MoviesClientProps) {
  const [movies] = useState<MovieWithGenres[]>(initialMovies);
  const [genres] = useState(initialGenres);
  const [selectedGenre, setSelectedGenre] = useState<string>("all-genres");
  const [isNew, setIsNew] = useState(false);
  const [favoriteCinemaId, setFavoriteCinemaId] = useState<number | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<MovieWithGenres | null>(null);

  useEffect(() => {
    async function loadFavoriteCinema() {
      const cinemaId = await getUserFavoriteCinema();
      if (typeof cinemaId === 'number') {
        setFavoriteCinemaId(cinemaId);
      }
    }
    loadFavoriteCinema();
  }, []);

  const isNewRelease = (releaseDate: Date | null) => {
    if (!releaseDate) return false;
    const now = new Date();
    const releaseDateObj = new Date(releaseDate);
    const diffInDays = (now.getTime() - releaseDateObj.getTime()) / (1000 * 3600 * 24);
    return diffInDays <= 7;
  };

  const filteredMovies = movies.filter((movie) => {
    const matchesGenre = selectedGenre === "all-genres" || movie.genres.some(g => g.name === selectedGenre);
    const matchesNew = isNew ? isNewRelease(movie.releaseDate) : true;
    return matchesGenre && matchesNew;
  });

  const hoverItems = filteredMovies.map((movie) => ({
    title: movie.title,
    description: movie.summary,
    images: [movie.images[0]],
    link: `/films/${movie.id}`,
    onReserve: () => setSelectedMovie(movie)
  }));

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
            Votre prochain coup de cœur se cache peut-être parmi ces affiches.
          </div>
          <div className="font-extralight text-base md:text-xl dark:text-neutral-200 py-4">
            Cliquez sur celle qui vous intrigue pour découvrir les séances, les
            bandes-annonces et réserver vos places en toute simplicité.
          </div>
        </motion.div>
      </AuroraBackground>

      <div className="flex flex-col justify-center my-16">
        <div className="flex justify-between items-center">
          <div className="flex gap-5">
            <Select onValueChange={setSelectedGenre} value={selectedGenre}>
              <SelectTrigger>
                <SelectValue>
                  {selectedGenre === "all-genres" ? "Tous les genres" : selectedGenre}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-genres">Tous les genres</SelectItem>
                {genres.map((genre) => (
                  <SelectItem key={genre.id} value={genre.name}>
                    {genre.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Label className="flex items-center gap-2">
              <Input
                type="checkbox"
                checked={isNew}
                onChange={(e) => setIsNew(e.target.checked)}
                className="w-6 h-6"
              />
              Nouveautés
            </Label>
          </div>

          <CinemaSelector
            cinemas={cinemas}
            currentCinemaId={favoriteCinemaId}
            onSelect={setFavoriteCinemaId}
          />
        </div>

        {filteredMovies.length === 0 ? (
          <div className="flex justify-center items-center h-40">
            <p>Aucun film ne correspond à vos critères</p>
          </div>
        ) : (
          <HoverEffect items={hoverItems} />
        )}
      </div>

      {selectedMovie && (
        <BookingModal
          isOpen={!!selectedMovie}
          onClose={() => setSelectedMovie(null)}
          movieId={selectedMovie.id}
          movieTitle={selectedMovie.title}
          cinemaId={favoriteCinemaId}
        />
      )}
    </div>
  );
} 