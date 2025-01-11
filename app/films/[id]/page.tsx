import { ImagesSlider } from "@/components/ui/image-slider";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { MovieDiscussion } from "./_components/MovieDiscussion";
import { getMovieData } from "./_components/getMovieData";
import { MovieHeader } from "./_components/MovieHeader";
import { MovieInfo } from "./_components/MovieInfo";
import { prisma } from "@/db/db";
import { currentUser } from "@clerk/nextjs/server";
import { Suspense } from "react";
import { MovieDetailsPageSkeleton } from "@/app/_components/skeletons";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MoviePage({
  params,
}: PageProps) {
  return (
    <Suspense fallback={<MovieDetailsPageSkeleton />}>
      <MovieContent params={params} />
    </Suspense>
  );
}

async function MovieContent({
  params,
}: PageProps) {
  // Attendre la résolution des paramètres
  const resolvedParams = await params;
  const movieId = parseInt(resolvedParams.id);
  
  const user = await currentUser();
  const userDetails = user ? await prisma.admin.findUnique({
    where: { id: user.id }
  }) : null;

  const isAdmin = !!userDetails;
  
  const { movie, posts, ratings } = await getMovieData(movieId);

  return (
    <div className="flex flex-col gap-5 min-h-screen">
      <div className="flex flex-col">
        <AuroraBackground className="h-[70svh] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/20 to-purple-500/20 mix-blend-overlay" />
          <MovieHeader title={movie.title} />
          <ImagesSlider className="h-[60svh] w-full" images={movie.images}>
            <div className="absolute border-y inset-0" />
          </ImagesSlider>
        </AuroraBackground>
      </div>

      <MovieInfo movie={movie} ratings={ratings} />

      <div className="px-10 py-6">
        <h2 className="text-2xl font-bold mb-4">Avis et commentaires</h2>
        <MovieDiscussion
          movieId={movieId}
          initialPosts={posts}
          initialRating={ratings.userRating}
          averageRating={ratings.average}
          totalRatings={ratings.total}
          userRatings={ratings.userRatings}
          isAdmin={isAdmin}
        />
      </div>
    </div>
  );
}
