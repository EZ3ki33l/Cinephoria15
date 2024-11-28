"use server";

import { prisma } from "@/db/db";

export async function getAllsoundSystemTypes() {
  return prisma.soundSystemType.findMany({});
}

export async function deletesoundSystemType(id: number) {
  const soundSystemType = await prisma.soundSystemType.delete({
    where: { id },
  });
  if (!soundSystemType) throw new Error("Type de son introuvable");
}

interface soundSystemTypeInput {
  name: string;
}

export async function createsoundSystemTypes(
  soundSystemTypes: soundSystemTypeInput[]
) {
  try {
    // Transformation des données d'entrée
    const soundSystemTypeData = soundSystemTypes.map((soundSystemType) => ({
      name: soundSystemType.name,
    }));

    // Création en masse avec Prisma
    const result = await prisma.soundSystemType.createMany({
      data: soundSystemTypeData,
      skipDuplicates: true, // Ignore les doublons pour éviter des erreurs si le même équipement existe déjà
    });

    return { success: true, result };
  } catch (error: any) {
    console.error("Erreur lors de la création des types de son :", error);
    return { success: false, error: error.message };
  }
}
