import { CinemaSelector } from "@/app/_components/CinemaSelector";
import { prisma } from "@/db/db";
import { MoviesClient } from "./_components/MoviesClient";

export default async function MoviesPage() {
  const cinemas = await prisma.cinema.findMany();
  const movies = await prisma.movie.findMany({
    include: {
      genres: true
    }
  });
  const genres = await prisma.genre.findMany();

  return (
    <MoviesClient 
      initialMovies={movies}
      initialGenres={genres}
      cinemas={cinemas}
    />
  );
}
