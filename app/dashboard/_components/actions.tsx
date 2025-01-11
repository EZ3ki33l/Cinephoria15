"use server";

import { prisma } from "@/db/db";

// Récupérer le profil utilisateur
export async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return null;
  }

  return {
    userName: user.userName,
    firstName: user.firstName,
    lastName: user.lastName,
    genreId: user.genreId,
    imageUrl: user.image,
    createdAt: user.createdAt,
  };
}

// Récupérer les genres disponibles
export async function getGenres() {
  const genres = await prisma.genre.findMany();
  return genres;
}

// Récupérer les posts d'un utilisateur
export async function getUserPosts(userId: string) {
  const posts = await prisma.post.findMany({
    where: { userId },
    include: {
      likes: true, // Inclure les likes pour chaque post
    },
  });
  return posts;
}

// Récupérer les likes d'un utilisateur
export async function getUserLikes(userId: string) {
  const likes = await prisma.like.findMany({
    where: { userId },
    include: {
      post: true, // Inclure les informations du post
    },
  });
  return likes;
}

// Mettre à jour la photo de profil de l'utilisateur
export async function updateUserProfileImage(
  userId: string,
  newImageUrl: string
) {
  await prisma.user.update({
    where: { id: userId },
    data: { image: newImageUrl },
  });
}

export async function updateUserProfile({
  userId,
  userName,
  firstName,
  lastName,
  genreId,
  newImageUrl,
}: {
  userId: string;
  userName: string | null;
  firstName: string;
  lastName: string;
  genreId: number;
  newImageUrl?: string | null;
}) {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new Error("Utilisateur introuvable");
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // Vérification et suppression de l'ancienne image uniquement si une nouvelle image est fournie
  if (newImageUrl && newImageUrl !== user.image) {
    if (user.image && !user.image.includes("clerk")) {
      try {
        await fetch(`${baseUrl}/api/uploadthing`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: user.image }),
          cache: "no-store",
        });
      } catch (error) {
        console.error(
          "Erreur lors de la suppression de l'ancienne image :",
          error
        );
      }
    }
  }

  // Préparer les données pour la mise à jour
  const updateData: any = {
    firstName,
    lastName,
    genreId,
    userName: userName || undefined, // Ne pas passer `null` pour les champs inutilisés
  };

  // Si une nouvelle image est fournie et qu'elle est différente de l'ancienne, mettre à jour l'image
  if (newImageUrl !== undefined && newImageUrl !== null) {
    updateData.image = newImageUrl || user.image; // Conserver l'ancienne image si nouvelle image est vide
  }

  // Mise à jour de l'utilisateur
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  return {
    userName: updatedUser.userName,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    genreId: updatedUser.genreId,
    imageUrl: updatedUser.image,
  };
}

// Supprimer le compte utilisateur
export async function deleteUserAccount(userId: string) {
  await prisma.user.delete({
    where: { id: userId },
  });
}
