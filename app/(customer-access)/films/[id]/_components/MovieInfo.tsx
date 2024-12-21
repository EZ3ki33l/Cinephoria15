"use client";

import { motion } from "framer-motion";
import { Typo } from "@/app/_components/_layout/typography";
import { Star, User2, Clock, Calendar } from "lucide-react";

interface MovieInfoProps {
  movie: any;
  ratings: {
    average: number;
    total: number;
  };
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h${remainingMinutes}min`;
}

export function MovieInfo({ movie, ratings }: MovieInfoProps) {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 p-10 items-start gap-10 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <motion.div 
        className="col-span-1 space-y-6 p-8 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl"
        {...fadeInUp}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Star className="w-6 h-6 text-yellow-400" />
            <div>
              <Typo theme="primary" variant="body-lg">
                Note moyenne
              </Typo>
              {ratings.total > 0 ? (
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-yellow-400">
                    {ratings.average.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-400">
                    sur {ratings.total} avis
                  </span>
                </div>
              ) : (
                <Typo theme="secondary" variant="lead" weight="medium">
                  Pas encore d'avis
                </Typo>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <User2 className="w-6 h-6 text-primary" />
            <div>
              <Typo theme="primary" variant="body-lg">
                Réalisateur
              </Typo>
              <Typo theme="secondary" variant="lead" weight="medium">
                {movie.director}
              </Typo>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-primary" />
            <div>
              <Typo theme="primary" variant="body-lg">
                Durée
              </Typo>
              <Typo theme="secondary" variant="lead" weight="medium">
                {formatDuration(movie.duration)}
              </Typo>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-primary" />
            <div>
              <Typo theme="primary" variant="body-lg">
                Date de sortie
              </Typo>
              <Typo theme="secondary" variant="lead" weight="medium">
                {movie.releaseDate 
                  ? new Date(movie.releaseDate).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })
                  : 'Date non disponible'
                }
              </Typo>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {movie.genres.map((genre: any, index: number) => (
              <motion.span
                key={genre.id}
                className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {genre.name}
              </motion.span>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <Typo theme="primary" variant="body-lg" className="mb-2">
            Synopsis
          </Typo>
          <motion.p 
            className="text-gray-600 dark:text-gray-300 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {movie.summary}
          </motion.p>
        </div>
      </motion.div>

      <motion.div 
        className="col-span-1"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {movie.trailer && (
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-secondary to-primary rounded-2xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity" />
            <iframe
              width="100%"
              height="400"
              src={`https://www.youtube.com/embed/${movie.trailer.split("v=")[1]}`}
              title={`trailer de ${movie.title}`}
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="relative rounded-2xl transform group-hover:scale-[1.01] transition-transform"
            />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
} 