"use server";

import { prisma } from "@/db/db";
import { movieSchema } from "./movieSchema";
import { z } from "zod";
import { UTApi } from "uploadthing/server";

export async function deleteMovieWithImage(movieId: number) {
  try {
    // Étape 1 : Récupérer le film à supprimer, incluant ses images
    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
      select: { images: true }, // Récupère uniquement les images
    });

    if (!movie) {
      throw new Error("Film introuvable");
    }

    console.log("Images à supprimer:", movie.images);

    // Étape 2 : Supprimer les images via Uploadthing
    if (movie.images && movie.images.length > 0) {
      const utapi = new UTApi(); // Instance Uploadthing

      for (const image of movie.images) {
        const fileId = image.substring(image.lastIndexOf("/") + 1); // Extraire l'identifiant
        console.log("Suppression du fichier :", fileId);
        await utapi.deleteFiles(fileId); // Supprimer le fichier
      }
    } else {
      console.log("Aucune image à supprimer pour ce film.");
    }

    // Étape 3 : Supprimer le film de la base de données
    await prisma.movie.delete({
      where: { id: movieId },
    });

    return { success: true, message: "Film et images supprimés avec succès" };
  } catch (error: any) {
    console.error("Erreur lors de la suppression du film :", error);
    throw new Error(error.message || "Erreur serveur");
  }
}

export async function getAllGenres() {
  try {
    const genres = await prisma.genre.findMany();
    return genres;
  } catch (error) {
    console.error("Erreur lors de la récupération des genres :", error);
    throw new Error("Impossible de récupérer les genres");
  }
}

export async function createMovieAction(data: any) {
  try {
    // Validation with Zod
    const validatedData = movieSchema.parse(data);

    // Create the movie and add the relations (genres)
    const movie = await prisma.movie.create({
      data: {
        title: validatedData.title,
        director: validatedData.director,
        duration: validatedData.duration,
        releaseDate: new Date(validatedData.releaseDate),
        trailer: validatedData.trailer,
        summary: validatedData.summary,
        images: validatedData.images,
        genres: {
          connect: validatedData.genre.map((id) => ({ id })),
        },
      },
    });

    return { success: true, movie };
  } catch (error) {
    console.error("Error during movie creation:", error);
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.flatten().fieldErrors };
    } else {
      return { success: false, message: "Internal server error" };
    }
  }
}

export async function toggleLovedByTeam(id: number, lovedByTeam: boolean) {
  await prisma.movie.update({ where: { id }, data: { lovedByTeam } });
}

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
          name: true,
        },
      },
    },
  });

  return movies;
}
