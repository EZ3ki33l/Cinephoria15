"use client";

import { useEffect, useState } from "react";
import { Genre } from "@prisma/client";
import {
  getAllGenres,
  getAllMovies,
} from "@/app/(private-access)/administrateur/films/_components/actions";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SelectItem } from "@radix-ui/react-select";
import { HoverEffect } from "@/components/ui/cardHoverEffect";
import { Spinner } from "@/app/_components/_layout/spinner";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "framer-motion";
import { Typo } from "@/app/_components/_layout/typography";

type Movie = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  director: string;
  duration: number;
  releaseDate: Date | null;
  summary: string;
  trailer: string;
  images: string[];
  lovedByTeam: boolean | null;
  genreNames: string[];
};

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>("all-genres");
  const [isNew, setIsNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadMovies() {
      setIsLoading(true); // Début du chargement
      try {
        const allMovies = await getAllMovies();
        const allGenres = await getAllGenres();
        setMovies(allMovies);
        setGenres(allGenres);
      } catch (error) {
        console.error("Erreur lors du chargement :", error);
      } finally {
        setIsLoading(false); // Fin du chargement
      }
    }
    loadMovies();
  }, []);

  const isNewRelease = (releaseDate: Date | null) => {
    if (!releaseDate) return false;
    const now = new Date();
    const releaseDateObj = new Date(releaseDate);
    const diffInTime = now.getTime() - releaseDateObj.getTime();
    const diffInDays = diffInTime / (1000 * 3600 * 24);
    return diffInDays <= 7;
  };

  const filteredMovies = movies.filter((movie) => {
    const matchesGenre =
      selectedGenre === "all-genres" ||
      movie.genreNames.includes(selectedGenre);
    const matchesNew = isNew ? isNewRelease(movie.releaseDate) : true;
    return matchesGenre && matchesNew;
  });

  const hoverItems = filteredMovies.map((movie) => ({
    title: movie.title,
    description: movie.summary,
    images: [movie.images[0]],
    link: `/films/${movie.id}`,
  }));

  if (isLoading) {
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
            Votre prochain coup de cœur se cache peut-être parmi ces affiches.
          </div>
          <div className="font-extralight text-base md:text-xl dark:text-neutral-200 py-4">
            Cliquez sur celle qui vous intrigue pour découvrir les séances, les
            bandes-annonces et réserver vos places en toute simplicité.
          </div>
        </motion.div>
      </AuroraBackground>

      <div className="flex flex-col justify-center my-16">
        <div className="flex flex-col gap-y-3">
          <h1 className="font-h1 max-sm:text-2xl max-md:text-3xl text-5xl mb-5">
            Nos films :
          </h1>
        </div>

        <div className="flex gap-5 pt-16">
          <Select
            onValueChange={(value) => setSelectedGenre(value)}
            value={selectedGenre}
          >
            <SelectTrigger>
              <SelectValue>
                {selectedGenre === "all-genres"
                  ? "Tous les genres"
                  : selectedGenre}
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

          <Label htmlFor="isNew" className="flex flex-col items-center gap-2">
            <Input
              type="checkbox"
              checked={isNew}
              onChange={() => setIsNew(!isNew)}
              className="w-6 h-6"
            />
            Nouveautés
          </Label>
        </div>

        {selectedGenre !== "all-genres" && filteredMovies.length === 0 ? (
          <div className="flex flex-col gap-3 justify-center items-center min-h-[15svh]">
            <p>Pas de film actuellement</p>
          </div>
        ) : (
          <HoverEffect items={hoverItems} />
        )}
      </div>
    </div>
  );
}
