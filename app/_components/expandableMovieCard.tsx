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
import { ImagesSlider } from "@/components/ui/image-slider";
import { BookingModal } from "@/app/(customer-access)/films/_components/BookingModal";

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
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedMovieForBooking, setSelectedMovieForBooking] = useState<Movie | null>(null);
  const [duplicatedMovies, setDuplicatedMovies] = useState<Movie[]>([]);

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

  // Vérifier si l'animation est nécessaire
  useEffect(() => {
    const checkIfShouldAnimate = () => {
      if (scrollerRef.current && containerRef.current && movies) {
        const containerWidth = containerRef.current.offsetWidth;
        const itemWidth = 350 + 16; // largeur de la carte + gap
        const totalContentWidth = movies.length * itemWidth;

        const shouldScroll = totalContentWidth > containerWidth;
        setShouldAnimate(shouldScroll);

        if (shouldScroll) {
          // Augmenter le nombre de duplications pour une transition plus fluide
          const itemsNeeded = Math.ceil((containerWidth * 3) / itemWidth); // Multiplié par 3 au lieu de 2
          const duplicates = [...movies, ...movies, ...movies].slice(0, itemsNeeded);
          setDuplicatedMovies(duplicates);
        } else {
          setDuplicatedMovies([]);
        }
      }
    };

    if (movies) {
      checkIfShouldAnimate();
    }
  }, [movies]);

  // Modifier la fonction getAnimationStyle pour une animation plus fluide
  const getAnimationStyle = () => {
    const duration = speed === "fast" ? "40s" : speed === "normal" ? "60s" : "100s";
    return {
      animationDuration: duration,
      animationDirection: direction === "left" ? "normal" : "reverse",
    };
  };

  // Gérer le clic sur une carte uniquement si la modale n'est pas déjà ouverte
  const handleCardClick = (movie: Movie) => {
    if (!active) {
      setActive(movie);
    }
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
              "flex gap-4 py-4 w-max flex-nowrap",
              shouldAnimate ? "animate-scroll" : "mx-auto justify-center",
              pauseOnHover && "hover:[animation-play-state:paused]"
            )}
            style={shouldAnimate ? getAnimationStyle() : undefined}
            onAnimationIteration={() => {
              // Réinitialiser la position au début de l'animation
              if (scrollerRef.current) {
                scrollerRef.current.style.transform = 'translateX(0)';
              }
            }}
          >
            {(shouldAnimate ? duplicatedMovies : movies)?.map((item, index) => (
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
                {/* Image de fond et overlay de base */}
                <div
                  className="absolute inset-0"
                  onClick={() => handleCardClick(item)}
                >
                  <Image
                    src={item.images[0]}
                    alt={item.title}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                    <h3
                      className="absolute bottom-4 left-4 text-xl font-semibold text-white
                      drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]"
                    >
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Contenu au hover avec effet glitch */}
                <div
                  className="absolute inset-0 bg-black/80 p-6 flex flex-col opacity-0 transition-all duration-500
                  group-hover:opacity-100 group-hover:backdrop-blur-sm
                  before:absolute before:inset-0 before:border-2 before:border-primary/30 before:rounded-2xl
                  after:absolute after:inset-0 after:rounded-2xl after:shadow-[inset_0_0_50px_rgba(236,72,153,0.2)]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Zone cliquable pour la modale */}
                  <div
                    className="flex-1"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCardClick(item);
                    }}
                  >
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
                    <p className="text-sm text-white/90 mb-1">
                      <span className="font-semibold">Réalisateur : </span>
                      {item.director || "N/A"}
                    </p>
                    <p className="text-sm text-white/90 mb-4">
                      <span className="font-semibold">Date de sortie : </span>
                      {item.releaseDate
                        ? new Date(item.releaseDate).toLocaleDateString("fr", {
                            dateStyle: "long",
                          })
                        : "N/A"}
                    </p>
                    <p className="text-sm text-white/90 flex-grow overflow-y-auto mb-4 scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/50">
                      {item.summary}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <AnimatePresence>
        {active && (
          <div
            className="fixed inset-0 z-[100]"
            onClick={() => setActive(null)}
          >
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
                  border border-slate-700/50 backdrop-blur-md relative
                  before:absolute before:inset-0 before:border-2 before:border-primary/30 before:rounded-3xl
                  after:absolute after:inset-0 after:rounded-3xl after:shadow-[inset_0_0_50px_rgba(236,72,153,0.2)]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Remplacer l'image unique par le composant ImagesSlider */}
                {active.images && active.images.length > 0 ? (
                  <ImagesSlider images={active.images}>
                    <div className="relative h-[400px]">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    </div>
                  </ImagesSlider>
                ) : (
                  <div className="flex items-center justify-center h-[400px] text-white">
                    Aucune image disponible
                  </div>
                )}

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
                        ? new Date(active.releaseDate).toLocaleDateString(
                            "fr",
                            {
                              dateStyle: "long",
                            }
                          )
                        : "N/A"}
                    </p>
                    <p className="text-gray-200 leading-relaxed">
                      {active.summary}
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Link
                      href={`/films/${active.id}`}
                      className="flex-1 block"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Button
                        type="button"
                        variant="primary"
                        className="w-full text-white relative z-50"
                      >
                        Voir le film
                      </Button>
                    </Link>

                    <Button
                      type="button"
                      variant="primary"
                      className="flex-1 text-white relative z-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActive(null);
                        setSelectedMovieForBooking(active);
                        setShowBookingModal(true);
                      }}
                    >
                      Réserver
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {selectedMovieForBooking && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedMovieForBooking(null);
          }}
          movieId={selectedMovieForBooking.id}
          movieTitle={selectedMovieForBooking.title}
        />
      )}
    </>
  );
};
