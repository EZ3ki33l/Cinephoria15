"use server";

import { prisma } from "@/db/db"; // Ajustez le chemin selon votre structure

export async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  // Si aucun utilisateur n'est trouvé, on retourne null
  if (!user) {
    return null;
  }

  return {
    firstName: user.firstName,
    lastName: user.lastName,
    genreId: user.genreId,
  };
}

export async function getGenres() {
  // Récupérer les genres depuis la base de données
  const genres = await prisma.genre.findMany();

  return genres.map((genre) => ({
    id: genre.id,
    name: genre.name,
  }));
}
