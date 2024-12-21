"use server";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/db/db";
import { revalidatePath } from "next/cache";

interface PostData {
  content: string;
  movieId: number;
  parentId: string | null;
}

export async function createPost(data: PostData) {
  try {
    const user = await currentUser();
    if (!user) {
      return { success: false, error: "Non authentifié" };
    }

    const post = await prisma.post.create({
      data: {
        content: data.content,
        userId: user.id,
        movieId: data.movieId,
        parentId: data.parentId,
      },
      include: {
        user: {
          select: {
            firstName: true,
            userName: true,
            image: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
      },
    });

    revalidatePath(`/films/${data.movieId}`);
    return { success: true, data: post };
  } catch (error) {
    console.error("Erreur lors de la création du post:", error);
    return { success: false, error: "Erreur lors de la création du commentaire" };
  }
}

export async function updatePost(postId: string, content: string) {
  try {
    const user = await currentUser();
    if (!user) {
      return { success: false, error: "Non authentifié" };
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post || post.userId !== user.id) {
      return { success: false, error: "Non autorisé" };
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { content },
      include: {
        user: {
          select: {
            firstName: true,
            userName: true,
            image: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
      },
    });

    revalidatePath(`/films/${post.movieId}`);
    return { success: true, data: updatedPost };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du post:", error);
    return { success: false, error: "Erreur lors de la mise à jour du commentaire" };
  }
}

export async function deletePost(postId: string) {
  try {
    const user = await currentUser();
    if (!user) {
      return { success: false, error: "Non authentifié" };
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post || post.userId !== user.id) {
      return { success: false, error: "Non autorisé" };
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    revalidatePath(`/films/${post.movieId}`);
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression du post:", error);
    return { success: false, error: "Erreur lors de la suppression du commentaire" };
  }
}

export async function createRating(movieId: number, rating: number) {
  try {
    const user = await currentUser();
    if (!user) {
      return { success: false, error: "Non authentifié" };
    }

    if (rating < 0.5 || rating > 5) {
      return { success: false, error: "Note invalide" };
    }

    const newRating = await prisma.rating.create({
      data: {
        rating,
        movieId,
        userId: user.id,
      },
    });

    revalidatePath(`/films/${movieId}`);
    return { success: true, data: newRating };
  } catch (error) {
    console.error("Erreur lors de la création de la note:", error);
    return { success: false, error: "Erreur lors de la création de la note" };
  }
}

export async function updateRating(movieId: number, rating: number) {
  try {
    const user = await currentUser();
    if (!user) {
      return { success: false, error: "Non authentifié" };
    }

    if (rating < 0.5 || rating > 5) {
      return { success: false, error: "Note invalide" };
    }

    const updatedRating = await prisma.rating.update({
      where: {
        movieId_userId: {
          movieId,
          userId: user.id,
        },
      },
      data: {
        rating,
      },
    });

    revalidatePath(`/films/${movieId}`);
    return { success: true, data: updatedRating };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la note:", error);
    return { success: false, error: "Erreur lors de la mise à jour de la note" };
  }
}

export async function likePost(postId: string) {
  try {
    const user = await currentUser();
    if (!user) {
      return { success: false, error: "Non authentifié" };
    }

    const like = await prisma.like.create({
      data: {
        postId,
        userId: user.id,
      },
    });

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (post?.movieId) {
      revalidatePath(`/films/${post.movieId}`);
    }

    return { success: true, data: like };
  } catch (error) {
    console.error("Erreur lors de l'ajout du like:", error);
    return { success: false, error: "Erreur lors de l'ajout du like" };
  }
}

export async function unlikePost(postId: string) {
  try {
    const user = await currentUser();
    if (!user) {
      return { success: false, error: "Non authentifié" };
    }

    await prisma.like.delete({
      where: {
        id: `${user.id}_${postId}`
      },
    });

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (post?.movieId) {
      revalidatePath(`/films/${post.movieId}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression du like:", error);
    return { success: false, error: "Erreur lors de la suppression du like" };
  }
} 