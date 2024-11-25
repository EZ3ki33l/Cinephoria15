"use server";

import { prisma } from "@/db/db";
import { revalidatePath } from "@/hooks/revalidePath";
import { notFound } from "next/navigation";

export async function getAllManagers() {
  return prisma.manager.findMany({
    include: {
      User: true, // Inclut les données de l'utilisateur liées
    },
  });
}

export async function deleteManager(id: string) {
  const manager = await prisma.manager.delete({ where: { id } });
  if (!manager) throw new Error("Manager introuvable");
}
