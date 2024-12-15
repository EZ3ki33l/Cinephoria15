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
    <div className="flex flex-col gap-5">
      <div className="flex flex-col">
        <AuroraBackground className="h-[15svh]">
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
            <Typo className="font-bold text-xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-primary to-secondary py-4">
              {movie.title}
            </Typo>
          </motion.div>
        </AuroraBackground>
        <ImagesSlider className="h-[60svh] w-full" images={movie.images}>
          <motion.div
            initial={{
              opacity: 0,
              y: -80,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            className="z-50 flex flex-col justify-center items-center"
          ></motion.div>
        </ImagesSlider>
      </div>
      <div className="grid grid-cols-2 p-10 items-center">
        <div className="col-span-1 pr-10">
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
            <Button size={"large"}>Réserver</Button>
          </Link>
        </div>
        <div className="col-span-1">
          {movie.trailer && (
            <iframe
              width="100%"
              height="400"
              src={`https://www.youtube.com/embed/${
                movie.trailer.split("v=")[1]
              }`}
              title={`trailer de ${movie.title}`}
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-2xl"
            ></iframe>
          )}
        </div>
      </div>
    </div>
  );
}
