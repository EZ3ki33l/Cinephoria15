"use server";

import { prisma } from "@/db/db";

export async function getAllEquipments() {
  return prisma.equipment.findMany();
}

export async function deleteEquipment(id: number) {
  const equipment = await prisma.equipment.delete({ where: { id } });
  if (!equipment) throw new Error("Equipement introuvable");
}

interface EquipmentInput {
  name: string;
}

export async function createEquipments(equipments: EquipmentInput[]) {
  try {
    // Transformation des données d'entrée
    const equipmentData = equipments.map((equipment) => ({
      name: equipment.name,
    }));

    // Création en masse avec Prisma
    const result = await prisma.equipment.createMany({
      data: equipmentData,
      skipDuplicates: true, // Ignore les doublons pour éviter des erreurs si le même équipement existe déjà
    });

    return { success: true, result };
  } catch (error: any) {
    console.error("Erreur lors de la création des équipements :", error);
    return { success: false, error: error.message };
  }
}
