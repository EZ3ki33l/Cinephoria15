"use server";

import { prisma } from "@/db/db";

export async function getAllProjectionTypes() {
  return prisma.projectionType.findMany({});
}

export async function deleteprojectionType(id: number) {
  const projectionType = await prisma.projectionType.delete({ where: { id } });
  if (!projectionType) throw new Error("Type de  projection introuvable");
}

interface projectionTypeInput {
  name: string;
}

export async function createprojectionTypes(
  projectionTypes: projectionTypeInput[]
) {
  try {
    // Transformation des données d'entrée
    const projectionTypeData = projectionTypes.map((projectionType) => ({
      name: projectionType.name,
    }));

    // Création en masse avec Prisma
    const result = await prisma.projectionType.createMany({
      data: projectionTypeData,
      skipDuplicates: true, // Ignore les doublons pour éviter des erreurs si le même équipement existe déjà
    });

    return { success: true, result };
  } catch (error: any) {
    console.error(
      "Erreur lors de la création des types de projection :",
      error
    );
    return { success: false, error: error.message };
  }
}
