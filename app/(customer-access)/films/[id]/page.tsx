"use client";

import { ImagesSlider } from "@/components/ui/image-slider";
import { Movie } from "@prisma/client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GetAMovie } from "@/app/(private-access)/administrateur/films/_components/actions";
import { Typo } from "@/app/_components/_layout/typography";
import { Button } from "@/app/_components/_layout/button";
import Link from "next/link";
import { Spinner } from "@/app/_components/_layout/spinner";
import { AuroraBackground } from "@/components/ui/aurora-background";

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h${remainingMinutes}min`;
}

interface MovieWithGenres extends Movie {
  genres: { name: string }[]; // Genres sous forme de tableau de chaînes
}

export default function MoviePage() {
  const { id } = useParams();
  const [movie, setMovie] = useState<MovieWithGenres | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovie() {
      try {
        setLoading(true);
        const fetchedMovie = await GetAMovie(Number(id)); // Appel pour récupérer un film spécifique
        setMovie({
          ...fetchedMovie,
          genres: fetchedMovie.genres.map((genre) => ({ name: genre.name })),
        });
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des informations du film :",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchMovie(); // Appeler la fonction si un ID est présent
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-svh">
        <Typo variant="h2" theme="primary">
          Chargement...
        </Typo>
        <Spinner size="large" />
      </div>
    ); // Indicateur de chargement
  }

  if (!movie) {
    return <div>Aucun film trouvé</div>; // Cas où aucun film n'est retourné
  }

  return (
    <div className="flex flex-col gap-5 min-h-screen">
      <div className="flex flex-col">
        <AuroraBackground className="h-[70svh] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/20 to-purple-500/20 mix-blend-overlay" />
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center tracking-tight relative py-10"
            animate={{
              x: [-2, 0, 2],
            }}
            transition={{
              duration: 0.1,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "linear",
            }}
          >
            <span className="absolute -inset-0.5 text-red-600/50 blur-[2px] animate-pulse py-10">
              {movie.title}
            </span>
            <span
              className="absolute -inset-0.5 text-cyan-600/50 blur-[2px] animate-pulse py-10"
              style={{ animationDelay: "0.1s" }}
            >
              {movie.title}
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-light to-primary animate-gradient">
              {movie.title}
            </span>
          </motion.h1>
          <ImagesSlider className="h-[60svh] w-full" images={movie.images}>
            <div className="absolute border-y  inset-0" />
          </ImagesSlider>
        </AuroraBackground>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 p-10 items-start gap-10 relative">
        <div className="col-span-1 pr-10 space-y-4 p-6 rounded-lg">
          <div className="flex gap-3 items-end">
            <Typo theme="primary" variant="body-lg">
              Réalisateur :
            </Typo>
            <Typo theme="secondary" variant="lead" weight="medium">
              {movie.director}
            </Typo>
          </div>
          <div className="flex gap-3">
            <Typo theme="primary" variant="body-lg">
              Durée :
            </Typo>
            <Typo theme="secondary" variant="lead" weight="medium">
              {formatDuration(movie.duration)}
            </Typo>
          </div>
          <div className="flex gap-3">
            <Typo theme="primary" variant="body-lg">
              Genre(s) :
            </Typo>
            <Typo theme="secondary" variant="lead" weight="medium">
              {movie.genres.map((genre) => genre.name).join(", ")}
            </Typo>
          </div>
          <div className="flex gap-3">
            <Typo theme="primary" variant="body-lg">
              Sorti le :
            </Typo>
            <Typo theme="secondary" variant="lead" weight="medium">
              {movie.releaseDate?.toLocaleDateString()}
            </Typo>
          </div>
          <Typo theme="primary" variant="body-lg">
            Résumé :
          </Typo>
          <Typo
            theme="secondary"
            variant="lead"
            weight="regular"
            className="text-justify"
          >
            {movie.summary}
          </Typo>
          <Link href={"#"} className="flex justify-center my-10">
            <Button
              size={"large"}
              className="text-white transition-all duration-300 hover:scale-105"
            >
              Réserver
            </Button>
          </Link>
        </div>

        <div className="col-span-1">
          {movie.trailer && (
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-secondary to-primary rounded-2xl blur-sm opacity-75" />
              <iframe
                width="100%"
                height="400"
                src={`https://www.youtube.com/embed/${
                  movie.trailer.split("v=")[1]
                }`}
                title={`trailer de ${movie.title}`}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="relative rounded-2xl"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
