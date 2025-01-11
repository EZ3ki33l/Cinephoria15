"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function MovieCardSkeleton() {
  return (
    <div className="relative w-[350px] h-[400px] max-w-full rounded-2xl overflow-hidden
      border border-slate-700/50 bg-gradient-to-b from-slate-800/50 to-slate-900/50">
      {/* Image skeleton */}
      <Skeleton className="absolute inset-0" />
      
      {/* Titre en bas */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
        <div className="absolute bottom-4 left-4">
          <Skeleton className="h-6 w-[200px]" />
        </div>
      </div>

      {/* Contenu au hover */}
      <div className="absolute inset-0 bg-black/80 p-6 flex flex-col opacity-0">
        <Skeleton className="h-6 w-[200px] mb-2" />
        <div className="flex flex-wrap gap-2 mb-4">
          <Skeleton className="h-6 w-[80px] rounded-full" />
          <Skeleton className="h-6 w-[100px] rounded-full" />
          <Skeleton className="h-6 w-[90px] rounded-full" />
        </div>
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-[180px]" />
          <Skeleton className="h-4 w-[160px]" />
        </div>
        <Skeleton className="flex-1 w-full" />
      </div>
    </div>
  );
}

export function MoviesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CinemaCardSkeleton() {
  return (
    <div className="space-y-4 p-6 border rounded-xl">
      {/* En-tête */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-[250px]" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>

      {/* Équipements */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-[120px]" />
        <ul className="space-y-1 ml-5">
          <li><Skeleton className="h-4 w-[180px]" /></li>
          <li><Skeleton className="h-4 w-[160px]" /></li>
          <li><Skeleton className="h-4 w-[170px]" /></li>
        </ul>
      </div>

      {/* Salles */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-[80px]" />
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-10 w-full rounded-lg" />
              <div className="hidden space-y-1 ml-5">
                <Skeleton className="h-4 w-[140px]" />
                <Skeleton className="h-4 w-[160px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CinemasGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <CinemaCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HomePageSkeleton() {
  return (
    <div className="flex flex-col space-y-6">
      {/* Hero avec Aurora */}
      <div className="relative h-[40vh] sm:h-[50vh] md:h-[60vh] overflow-hidden bg-gradient-to-b from-primary-light/20 to-transparent">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" 
            style={{
              backgroundImage: `
                linear-gradient(to right, rgb(var(--primary)) 1px, transparent 1px),
                linear-gradient(to bottom, rgb(var(--primary)) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary-light/20 to-transparent" />
        <div className="relative z-10 flex items-center justify-center h-full px-4">
          <div className="flex flex-col items-center gap-3 sm:gap-4 max-w-[90%] sm:max-w-[80%] md:max-w-[70%]">
            <Skeleton className="h-8 w-[600px]" />
            <Skeleton className="h-4 w-[800px]" />
          </div>
        </div>
      </div>

      {/* Section Films Récents */}
      <div className="flex flex-col py-5">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-[300px]" />
          <Skeleton className="h-10 w-[150px] rounded-lg" />
        </div>
        <div className="pt-5 overflow-hidden">
          <div className="flex gap-4">
            {[...Array(4)].map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Séparateur */}
      <div className="h-px bg-border my-10" />

      {/* Section Cinémas */}
      <div className="flex flex-col py-5">
        <div className="flex justify-between">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-10 w-[150px] rounded-lg" />
        </div>
        <div className="grid md:grid-cols-2">
          <div className="flex flex-col justify-center gap-y-3 pr-16">
            <Skeleton className="h-4 w-[300px]" />
            <Skeleton className="h-4 w-[250px]" />
            <div className="ml-5 space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-[100px]" />
              ))}
            </div>
            <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="h-[400px] rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function ContactPageSkeleton() {
  return (
    <div className="space-y-8">
      {/* Formulaire de contact */}
      <div className="p-6 border rounded-xl space-y-6">
        <Skeleton className="h-8 w-[250px]" />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        </div>
        <div className="flex justify-end">
          <Skeleton className="h-10 w-[120px] rounded-lg" />
        </div>
      </div>

      {/* Numéro de téléphone */}
      <div className="p-6 border rounded-xl space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-6 w-[150px]" />
        </div>
      </div>

      {/* Carte des cinémas */}
      <div className="p-6 border rounded-xl space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-6 w-[200px]" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-[250px]" />
                </div>
              </div>
            ))}
          </div>
          <Skeleton className="h-[400px] rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function CinemasPageSkeleton() {
  return (
    <div className="flex flex-col">
      {/* Hero avec Aurora */}
      <div className="flex flex-col">
        <div className="relative h-[300px] bg-gradient-to-b from-primary-light/20 to-transparent">
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0" 
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgb(var(--primary)) 1px, transparent 1px),
                  linear-gradient(to bottom, rgb(var(--primary)) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
              }}
            />
          </div>
          <div className="relative flex flex-col gap-4 items-center justify-center h-full px-4">
            <Skeleton className="h-8 w-[600px]" />
            <Skeleton className="h-4 w-[800px]" />
          </div>
        </div>
      </div>

      <div className="my-16 space-y-10">
        <Skeleton className="h-10 w-[200px]" />

        {/* Sélecteur */}
        <div className="mb-5 w-[50%]">
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>

        {/* Conteneur principal */}
        <div className="flex w-full gap-5">
          {/* Section gauche - Card */}
          <div className="flex-1">
            <div className="p-6 border rounded-xl space-y-4">
              <Skeleton className="h-8 w-[300px]" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-6 w-[150px]" />
                <div className="ml-5 space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-[180px]" />
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <Skeleton className="h-6 w-[100px]" />
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section droite - Carte */}
          <div className="flex-1">
            <Skeleton className="h-[500px] w-full rounded-xl" />
          </div>
        </div>

        {/* Section films */}
        <div className="w-full space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-[300px]" />
            <Skeleton className="h-10 w-[200px] rounded-lg" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border rounded-xl overflow-hidden">
                <Skeleton className="h-[300px] w-full" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-6 w-[250px]" />
                  <div className="flex gap-2 flex-wrap">
                    {[...Array(3)].map((_, j) => (
                      <Skeleton key={j} className="h-6 w-[80px] rounded-full" />
                    ))}
                  </div>
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-[100px]" />
                    <div className="flex flex-wrap gap-2">
                      {[...Array(4)].map((_, j) => (
                        <Skeleton key={j} className="h-10 w-[100px] rounded-lg" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MovieDetailsPageSkeleton() {
  return (
    <div className="flex flex-col gap-5 min-h-screen">
      {/* Hero avec Aurora */}
      <div className="flex flex-col">
        <div className="h-[70svh] relative overflow-hidden bg-gradient-to-b from-cyan-500/20 to-purple-500/20">
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0" 
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgb(var(--primary)) 1px, transparent 1px),
                  linear-gradient(to bottom, rgb(var(--primary)) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
              }}
            />
          </div>
          {/* Header */}
          <div className="relative z-10 flex items-center justify-center h-[10svh]">
            <Skeleton className="h-8 w-[400px]" />
          </div>
          {/* Image Slider */}
          <div className="h-[60svh] w-full relative">
            <Skeleton className="absolute inset-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          </div>
        </div>
      </div>

      {/* Informations du film */}
      <div className="px-10">
        <div className="space-y-6">
          <div className="flex gap-8">
            <div className="flex-1 space-y-4">
              <Skeleton className="h-8 w-[300px]" />
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-6 w-[100px] rounded-full" />
                ))}
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
              <Skeleton className="h-32 w-full max-w-2xl" />
            </div>
            <div className="w-[300px] space-y-4">
              <Skeleton className="h-40 w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[80%]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section commentaires */}
      <div className="px-10 py-6">
        <Skeleton className="h-8 w-[300px] mb-6" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 border rounded-xl space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* En-tête avec statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-6 border rounded-xl space-y-4">
            <Skeleton className="h-6 w-[120px]" />
            <Skeleton className="h-8 w-[100px]" />
            <Skeleton className="h-2 w-full" />
          </div>
        ))}
      </div>

      {/* Tableau de données */}
      <div className="border rounded-xl overflow-hidden">
        <div className="p-4 border-b bg-muted/50">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-[200px]" />
            <div className="flex gap-4">
              <Skeleton className="h-10 w-[120px] rounded-lg" />
              <Skeleton className="h-10 w-[120px] rounded-lg" />
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function BookingModalSkeleton() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-background p-6 rounded-xl w-full max-w-lg space-y-6">
      <div className="space-y-4">
        <Skeleton className="h-8 w-[300px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[...Array(9)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-6 w-[150px]" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Skeleton className="h-10 w-[100px] rounded-lg" />
          <Skeleton className="h-10 w-[100px] rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function MoviesPageSkeleton() {
  return (
    <div className="flex flex-col">
      {/* Hero avec Aurora */}
      <div className="relative h-[300px] bg-gradient-to-b from-primary-light/20 to-transparent">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" 
            style={{
              backgroundImage: `
                linear-gradient(to right, rgb(var(--primary)) 1px, transparent 1px),
                linear-gradient(to bottom, rgb(var(--primary)) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          />
        </div>
        <div className="relative flex flex-col gap-4 items-center justify-center h-full px-4">
          <Skeleton className="h-8 w-[600px]" />
          <Skeleton className="h-4 w-[800px]" />
        </div>
      </div>

      {/* Filtres */}
      <div className="my-16 px-8">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-[200px]" />
            <div className="flex gap-4">
              <Skeleton className="h-10 w-[150px] rounded-lg" />
              <Skeleton className="h-10 w-[150px] rounded-lg" />
            </div>
          </div>

          {/* Filtres supplémentaires */}
          <div className="flex flex-wrap gap-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-[120px] rounded-full" />
            ))}
          </div>

          {/* Grille de films */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ReservationPageSkeleton() {
  return (
    <div className="flex flex-col">
      {/* Hero avec Aurora */}
      <div className="relative h-[300px] bg-gradient-to-b from-primary-light/20 to-transparent">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" 
            style={{
              backgroundImage: `
                linear-gradient(to right, rgb(var(--primary)) 1px, transparent 1px),
                linear-gradient(to bottom, rgb(var(--primary)) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          />
        </div>
        <div className="relative flex flex-col gap-4 items-center justify-center h-full px-4">
          <Skeleton className="h-8 w-[600px]" />
          <Skeleton className="h-4 w-[800px]" />
        </div>
      </div>

      <div className="flex flex-col my-16 gap-6 px-8">
        <Skeleton className="h-10 w-[200px]" />

        <div className="flex gap-6">
          {/* Sélecteurs */}
          <div className="flex gap-4">
            <Skeleton className="h-10 w-[280px] rounded-lg" />
            <Skeleton className="h-10 w-[150px] rounded-lg" />
          </div>
        </div>

        {/* Grille des films et séances */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border rounded-xl overflow-hidden">
              <Skeleton className="h-[200px] w-full" />
              <div className="p-6 space-y-4">
                <Skeleton className="h-6 w-[250px]" />
                <div className="flex gap-2 flex-wrap">
                  {[...Array(3)].map((_, j) => (
                    <Skeleton key={j} className="h-6 w-[80px] rounded-full" />
                  ))}
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-4 w-[100px]" />
                  <div className="flex flex-wrap gap-2">
                    {[...Array(4)].map((_, j) => (
                      <Skeleton key={j} className="h-10 w-[100px] rounded-lg" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AboutPageSkeleton() {
  return (
    <div className="relative">
      <div className="flex flex-col">
        {/* Hero avec Aurora */}
        <div className="relative h-[300px] bg-gradient-to-b from-primary-light/20 to-transparent">
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0" 
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgb(var(--primary)) 1px, transparent 1px),
                  linear-gradient(to bottom, rgb(var(--primary)) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
              }}
            />
          </div>
          <div className="relative flex flex-col gap-4 items-center justify-center h-full px-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-8 w-[600px]" />
            <Skeleton className="h-4 w-[800px]" />
          </div>
        </div>
      </div>

      {/* Images grid */}
      <div className="grid grid-row-2 justify-center gap-10">
        <div className="col-span-1">
          <Skeleton className="h-[500px] w-[500px] rounded-2xl" />
          <div className="flex justify-center mt-2">
            <Skeleton className="h-4 w-[300px]" />
          </div>
        </div>
        <div className="col-start-2 col-span-1">
          <Skeleton className="h-[500px] w-[500px] rounded-2xl" />
          <div className="flex justify-center mt-2">
            <Skeleton className="h-4 w-[300px]" />
          </div>
        </div>
      </div>

      {/* Citation */}
      <div className="flex justify-center my-16 p-6 border rounded-2xl w-[80%] mx-auto">
        <div className="flex flex-col gap-5">
          <Skeleton className="h-24 w-full" />
          <div className="flex justify-end">
            <Skeleton className="h-4 w-[400px]" />
          </div>
        </div>
      </div>

      {/* Sections de texte */}
      <div className="my-16 space-y-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-6 w-[300px]" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            {i === 3 && (
              <div className="ml-5 space-y-2">
                {[...Array(4)].map((_, j) => (
                  <Skeleton key={j} className="h-4 w-[80%]" />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Call to action */}
      <div className="flex flex-col items-center gap-5 justify-center text-center mb-16 p-6 border rounded-2xl w-[80%] mx-auto">
        <Skeleton className="h-8 w-[600px]" />
        <Skeleton className="h-12 w-[200px] rounded-lg" />
      </div>
    </div>
  );
}

export function ProfilePageSkeleton() {
  return (
    <div className="flex flex-col">
      {/* Hero avec Aurora */}
      <div className="relative h-[300px] bg-gradient-to-b from-primary-light/20 to-transparent">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" 
            style={{
              backgroundImage: `
                linear-gradient(to right, rgb(var(--primary)) 1px, transparent 1px),
                linear-gradient(to bottom, rgb(var(--primary)) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          />
        </div>
        <div className="relative flex flex-col gap-4 items-center justify-center h-full px-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <Skeleton className="h-8 w-[300px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full px-4 py-8 space-y-8">
        {/* Informations personnelles */}
        <div className="border rounded-xl p-6 space-y-6">
          <Skeleton className="h-8 w-[200px]" />
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
        </div>

        {/* Préférences */}
        <div className="border rounded-xl p-6 space-y-6">
          <Skeleton className="h-8 w-[150px]" />
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-6 rounded" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-6 rounded" />
              <Skeleton className="h-4 w-[250px]" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-6 rounded" />
              <Skeleton className="h-4 w-[180px]" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Skeleton className="h-10 w-[120px] rounded-lg" />
          <Skeleton className="h-10 w-[120px] rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function TicketsPageSkeleton() {
  return (
    <div className="flex flex-col">
      {/* Hero avec Aurora */}
      <div className="relative h-[300px] bg-gradient-to-b from-primary-light/20 to-transparent">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" 
            style={{
              backgroundImage: `
                linear-gradient(to right, rgb(var(--primary)) 1px, transparent 1px),
                linear-gradient(to bottom, rgb(var(--primary)) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          />
        </div>
        <div className="relative flex flex-col gap-4 items-center justify-center h-full px-4">
          <Skeleton className="h-8 w-[400px]" />
          <Skeleton className="h-4 w-[600px]" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full px-4 py-8 space-y-8">
        {/* Filtres */}
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Skeleton className="h-10 w-[150px] rounded-lg" />
            <Skeleton className="h-10 w-[150px] rounded-lg" />
          </div>
          <Skeleton className="h-10 w-[200px] rounded-lg" />
        </div>

        {/* Liste des tickets */}
        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border rounded-xl p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Image du film */}
                <Skeleton className="h-[200px] w-[150px] rounded-lg" />

                {/* Informations */}
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-[300px]" />
                      <div className="flex gap-2">
                        {[...Array(2)].map((_, j) => (
                          <Skeleton key={j} className="h-6 w-[100px] rounded-full" />
                        ))}
                      </div>
                    </div>
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-6 w-[150px]" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-6 w-[150px]" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-6 w-[150px]" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-6 w-[150px]" />
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-24 w-24" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-10 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
} 