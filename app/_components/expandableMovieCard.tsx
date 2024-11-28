"use client";

import React, { useState, useEffect, useId, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useOutsideClick } from "@/hooks/use-outside.click";
import { Spinner } from "./_layout/spinner";
import { Button } from "./_layout/button";
import {
  getAllMovies,
  GetRecentMovies,
} from "../(private-access)/administrateur/films/_components/actions";

type Movie = {
  id: number;
  genre: string;
  genres: { name: string }[];
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
};

export function ExpandableCard() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<Movie | null>(null);
  const [isCardLoading, setIsCardLoading] = useState(false);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  // Close on escape key or outside click
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }

    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  useEffect(() => {
    async function fetchMovies() {
      try {
        const fetchedMovies = await GetRecentMovies(); // Appel de l'action server
        setMovies(
          fetchedMovies.map((movie) => ({
            ...movie,
            id: Number(movie.id),
            genres: movie.genres.map((genre) => ({ name: genre.name })),
          }))
        );
        setLoading(false);
      } catch (error) {
        setError("Erreur de chargement des films.");
        setLoading(false);
      }
    }

    fetchMovies();
  }, []);

  // Loader
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spinner />
      </div>
    );
  }

  // Error message
  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  // Fonction pour afficher les valeurs par défaut si elles sont absentes
  const getDefaultValue = (
    value: string | null | undefined,
    fallback: string = "N/A"
  ) => {
    return value ? value : fallback;
  };

  return (
    <>
      {/* Affichage de la carte active avec animation simple */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20"
            style={{ height: "100vh" }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <div
              ref={ref}
              className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <Image
                priority
                width={320}
                height={320}
                src={active.images[0]}
                alt={active.title}
                className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-center"
              />
              <div className="p-4">
                <h3 className="text-2xl pt-4 pb-8 font-medium mx-auto text-center text-primary">
                  {active.title}
                </h3>
                <p className="text-base">
                  <span className="text-sm text-secondary">Réalisateur : </span>{" "}
                  {getDefaultValue(active.director)}
                </p>
                <p className="text-base">
                  <span className="text-sm text-secondary">Genre : </span>
                  {getDefaultValue(active.genre)}
                </p>
                <p className="text-base">
                  <span className="text-sm text-secondary">
                    Date de sortie :{" "}
                  </span>
                  {active.releaseDate &&
                    new Date(active.releaseDate).toLocaleDateString("fr", {
                      dateStyle: "long",
                    })}
                </p>
                <p className="text-justify text-base py-6">
                  {getDefaultValue(active.summary)}
                </p>
                <Link href={`/films/${active.id}`}>
                  <Button variant={"primary"} className="w-full text-white">
                    Voir le film
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </AnimatePresence>

      {/* Liste des films avec simplification */}
      <ul className="max-w-2xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 items-start gap-4">
        {movies.map((card) => (
          <div
            key={card.id}
            onClick={() => {
              setIsCardLoading(true);
              setActive(card);
              setTimeout(() => setIsCardLoading(false), 1000); // Simuler le délai
            }}
            className="p-4 flex flex-col hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
          >
            <Image
              width={240}
              height={240}
              src={card.images[0]}
              alt={card.title}
              className="h-60 w-full rounded-lg object-cover object-center"
            />
            <div className="flex justify-center items-center flex-col">
              <h3 className="text-2xl font-medium text-center text-primary py-2">
                {card.title}
              </h3>
              <p className="text-black text-justify text-base line-clamp-3">
                {card.summary}
              </p>
            </div>
          </div>
        ))}
      </ul>
    </>
  );
}
