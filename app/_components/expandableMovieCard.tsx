"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useOutsideClick } from "@/hooks/use-outside.click";
import { Spinner } from "./_layout/spinner";
import { Button } from "./_layout/button";
import { GetRecentMovies } from "../(private-access)/administrateur/films/_components/actions";

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

export const InfiniteExpandableCards = ({
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState<Movie | null>(null);
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const ref = useRef<HTMLDivElement>(null);

  // Fetch movies on component mount
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const fetchedMovies = await GetRecentMovies();
        setMovies(fetchedMovies);
      } catch (error) {
        console.error("Failed to fetch movies", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Duplicate the movie list for infinite scrolling
  const getDuplicatedMovies = () => {
    if (!movies) return [];
    return [...movies, ...movies];
  };

  // Handle animation speed and direction
  const getAnimationStyle = () => {
    const duration =
      speed === "fast" ? "20s" : speed === "normal" ? "40s" : "80s";
    return {
      animationDuration: duration,
      animationDirection: direction === "left" ? "normal" : "reverse",
    };
  };

  // Close modal on escape key or outside click
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

  return (
    <>
      <div
        ref={containerRef}
        className={cn(
          "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
          className
        )}
      >
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : (
          <ul
            ref={scrollerRef}
            className={cn(
              "flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap animate-scroll",
              pauseOnHover && "hover:[animation-play-state:paused]"
            )}
            style={getAnimationStyle()}
          >
            {getDuplicatedMovies().map((item, index) => (
              <li
                key={`${item.id}-${index}`}
                onClick={() => setActive(item)}
                className="relative w-[350px] h-[400px] max-w-full rounded-2xl flex-shrink-0 overflow-hidden group cursor-pointer
                  border border-slate-700/50 bg-gradient-to-b from-slate-800/50 to-slate-900/50
                  before:absolute before:inset-0 before:border-2 before:border-slate-400/20 before:rounded-2xl
                  before:transition-all before:duration-700 hover:before:scale-105 hover:before:border-primary/50
                  after:absolute after:inset-0 after:rounded-2xl after:shadow-[inset_0_0_30px_rgba(236,72,153,0.1)]
                  backdrop-blur-sm"
              >
                {/* Image de fond */}
                <Image
                  src={item.images[0]}
                  alt={item.title}
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay par défaut avec titre et effet néon */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                  <h3 className="absolute bottom-4 left-4 text-xl font-semibold text-white
                    drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]">
                    {item.title}
                  </h3>
                </div>

                {/* Contenu au hover avec effet glitch */}
                <div className="absolute inset-0 bg-black/80 p-6 flex flex-col opacity-0 transition-all duration-500
                  group-hover:opacity-100 group-hover:backdrop-blur-sm
                  before:absolute before:inset-0 before:border-2 before:border-primary/30 before:rounded-2xl
                  after:absolute after:inset-0 after:rounded-2xl after:shadow-[inset_0_0_50px_rgba(236,72,153,0.2)]">
                  <h3 className="text-xl font-semibold text-white mb-2 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]">
                    {item.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.genres?.map((genre, idx) => (
                      <span 
                        key={idx} 
                        className="text-sm px-2 py-1 bg-primary/10 rounded-full text-primary border border-primary/20
                          shadow-[0_0_10px_rgba(236,72,153,0.2)]"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-white/90 flex-grow overflow-y-auto mb-4 scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/50">
                    {item.summary}
                  </p>
                  <Link 
                    href={`/films/${item.id}`}
                    onClick={(e) => e.stopPropagation()} 
                    className="w-full"
                  >
                    <Button 
                      variant="primary" 
                      className="w-full bg-primary/20 hover:bg-primary/30 text-white border border-primary/50
                        shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(236,72,153,0.5)]"
                    >
                      Voir le film
                    </Button>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 z-[100]" onClick={() => setActive(null)}>
            {/* Overlay sombre */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-[90] backdrop-blur-sm"
            />
            {/* Contenu du modal */}
            <motion.div
              ref={ref}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 flex items-center justify-center z-[100] p-4"
            >
              <div 
                className="w-full max-w-[500px] max-h-[90vh] bg-black/90 sm:rounded-3xl overflow-hidden flex flex-col
                  border border-slate-700/50 backdrop-blur-md
                  before:absolute before:inset-0 before:border-2 before:border-primary/30 before:rounded-3xl
                  after:absolute after:inset-0 after:rounded-3xl after:shadow-[inset_0_0_50px_rgba(236,72,153,0.2)]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Container de l'image avec overlay */}
                <div className="relative h-[400px]">
                  <Image
                    priority
                    fill
                    src={active.images[0]}
                    alt={active.title}
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>

                {/* Contenu du modal */}
                <div className="p-6 text-white">
                  <h3 className="text-2xl font-semibold mb-4">
                    {active.title}
                  </h3>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {active.genres?.map((genre, idx) => (
                      <span 
                        key={idx} 
                        className="text-sm px-2 py-1 bg-white/10 rounded-full"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-3 mb-6">
                    <p className="text-gray-300">
                      <span className="text-gray-400">Réalisateur : </span>
                      {active.director || "N/A"}
                    </p>
                    <p className="text-gray-300">
                      <span className="text-gray-400">Date de sortie : </span>
                      {active.releaseDate
                        ? new Date(active.releaseDate).toLocaleDateString("fr", {
                            dateStyle: "long",
                          })
                        : "N/A"}
                    </p>
                    <p className="text-gray-200 leading-relaxed">
                      {active.summary}
                    </p>
                  </div>

                  <Link 
                    href={`/films/${active.id}`}
                    className="w-full block"
                  >
                    <Button 
                      variant="primary" 
                      className="w-full text-white"
                    >
                      Voir le film
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
