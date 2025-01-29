"use server";

import { prisma } from "@/db/db";

export async function getAllManagers() {
  return prisma.manager.findMany({
    include: {
      User: true,
      // Autres relations que vous souhaitez récupérer
    },
  });
}

export async function deleteManager(id: string) {
  const manager = await prisma.manager.delete({ where: { id } });
  if (!manager) throw new Error("Manager introuvable");
}
