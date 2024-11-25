"use server";

import { prisma } from "@/db/db";

export async function getAllAdmins() {
  return prisma.admin.findMany({
    include: {
      User: true, // Inclut les données de l'utilisateur liées
    },
  });
}

export async function deleteAdmin(id: string) {
  const admin = await prisma.admin.delete({ where: { id } });
  if (!admin) throw new Error("admin introuvable");
}
