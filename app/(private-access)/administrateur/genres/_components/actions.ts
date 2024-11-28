"use server";

import { prisma } from "@/db/db";

export async function getAllGenres() {
  return prisma.genre.findMany({});
}

export async function deleteGenre(id: number) {
  const genre = await prisma.genre.delete({ where: { id } });
  if (!genre) throw new Error("Genre introuvable");
}

interface genreInput {
  name: string;
}

export async function createGenres(genres: genreInput[]) {
  try {
    // Transformation des données d'entrée
    const genreData = genres.map((genre) => ({
      name: genre.name,
    }));

    // Création en masse avec Prisma
    const result = await prisma.genre.createMany({
      data: genreData,
      skipDuplicates: true, // Ignore les doublons pour éviter des erreurs si le même équipement existe déjà
    });

    return { success: true, result };
  } catch (error: any) {
    console.error("Erreur lors de la création des équipements :", error);
    return { success: false, error: error.message };
  }
}
