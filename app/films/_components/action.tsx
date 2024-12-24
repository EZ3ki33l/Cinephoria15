"use server";

import { prisma } from "@/db/db";

export async function getAllMovies() {
  const movies = await prisma.movie.findMany({
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      title: true,
      director: true,
      duration: true,
      releaseDate: true,
      summary: true,
      trailer: true,
      images: true,
      lovedByTeam: true,
      genres: {
        select: {
          name: true, // Accède aux noms des genres
        },
      },
    },
  });

  // Transformation des films pour inclure les noms des genres
  const transformedMovies = movies.map((movie) => ({
    ...movie,
    genreNames: movie.genres.map((genre) => genre.name), // Crée un tableau de noms de genres
  }));

  return transformedMovies;
}
