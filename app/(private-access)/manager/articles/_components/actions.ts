"use server";

import { prisma } from "@/db/db";
import { UTApi } from "uploadthing/server";
import { NewsSchema } from "./newsSchema";
import { z } from "zod";

export async function deleteNewsWithImage(id: number) {
  try {
    // Étape 1 : Récupérer le film à supprimer, incluant ses images
    const news = await prisma.news.findUnique({
      where: { id: id },
      select: { images: true }, // Récupère uniquement les images
    });

    if (!news) {
      throw new Error("Article introuvable");
    }

    console.log("Images à supprimer:", news.images);

    // Étape 2 : Supprimer les images via Uploadthing
    if (news.images && news.images.length > 0) {
      const utapi = new UTApi(); // Instance Uploadthing

      for (const image of news.images) {
        const fileId = image.substring(image.lastIndexOf("/") + 1); // Extraire l'identifiant
        console.log("Suppression du fichier :", fileId);
        await utapi.deleteFiles(fileId); // Supprimer le fichier
      }
    } else {
      console.log("Aucune image à supprimer pour ce film.");
    }

    // Étape 3 : Supprimer le film de la base de données
    await prisma.news.delete({
      where: { id: id },
    });

    return { success: true, message: "Film et images supprimés avec succès" };
  } catch (error: any) {
    console.error("Erreur lors de la suppression du film :", error);
    throw new Error(error.message || "Erreur serveur");
  }
}

export async function CreateNews(data: any) {
  try {
    // Validation with Zod
    const validatedData = NewsSchema.parse(data);

    // Create the movie and add the relations (genres)
    const news = await prisma.news.create({
      data: {
        title: validatedData.title,
        category: {
          connect: {
            id: validatedData.categories,
          },
        },
        shortContent: validatedData.shortContent,
        content: validatedData.content,
        images: validatedData.images,
      },
    });

    return { success: true, news };
  } catch (error) {
    console.error("Error during movie creation:", error);
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.flatten().fieldErrors };
    } else {
      return { success: false, message: "Internal server error" };
    }
  }
}

export async function getAllNews() {
  return prisma.news.findMany({
    include: {
      category: true,
    },
  });
}
