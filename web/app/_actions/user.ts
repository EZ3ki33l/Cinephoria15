'use server'

import { prisma } from "@/db/db";
import { auth } from "@clerk/nextjs/server";

export async function updateFavoriteCinema(cinemaId: number) {
  const session = await auth();
  const userId = session?.userId;
  
  if (!userId) {
    throw new Error("Non autorisé");
  }

  return await prisma.user.update({
    where: { id: userId },
    data: { favoriteCinemaId: cinemaId }
  });
}

export async function getUserFavoriteCinema() {
  const session = await auth();
  const userId = session?.userId;
  
  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { favoriteCinemaId: true }
  });

  return user?.favoriteCinemaId;
} 