import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/db/db";
import { Post } from "@prisma/client";

interface ExtendedPost extends Post {
  user: {
    firstName: string;
    userName: string | null;
    image: string | null;
  };
  likes: { userId: string }[];
  replies?: ExtendedPost[];
}

export async function getMovieData(movieId: number) {
  const user = await currentUser();

  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
    include: {
      genres: true,
      ratings: {
        select: {
          rating: true,
          userId: true,
        },
      },
      Post: {
        where: {
          parentId: null,
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
          replies: {
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
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!movie) {
    throw new Error("Film non trouvé");
  }

  const ratings = movie.ratings;
  const averageRating =
    ratings.length > 0
      ? ratings.reduce((acc: number, curr: { rating: number }) => acc + curr.rating, 0) / ratings.length
      : 0;

  const userRating = user
    ? ratings.find((r: { userId: string }) => r.userId === user.id)?.rating ?? null
    : null;

  return {
    movie,
    posts: movie.Post as ExtendedPost[],
    ratings: {
      average: averageRating,
      total: ratings.length,
      userRating,
      userRatings: ratings,
    },
  };
} 