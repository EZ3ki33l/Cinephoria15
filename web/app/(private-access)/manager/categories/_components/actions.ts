"use server";

import { prisma } from "@/db/db";

export async function getAllcategories() {
  return prisma.category.findMany({});
}

export async function deletecategory(id: number) {
  const category = await prisma.category.delete({ where: { id } });
  if (!category) throw new Error("Catégorie introuvable");
}

interface categoryInput {
  name: string;
}

export async function createcategories(categories: categoryInput[]) {
  try {
    // Transformation des données d'entrée
    const categoryData = categories.map((category) => ({
      name: category.name,
    }));

    // Création en masse avec Prisma
    const result = await prisma.category.createMany({
      data: categoryData,
      skipDuplicates: true, // Ignore les doublons pour éviter des erreurs si le même équipement existe déjà
    });

    return { success: true, result };
  } catch (error: any) {
    console.error("Erreur lors de la création des catégories :", error);
    return { success: false, error: error.message };
  }
}
