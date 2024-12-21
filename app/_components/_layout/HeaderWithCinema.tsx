'use client';

import { useState, useEffect } from "react";
import { Cinema } from "@prisma/client";
import { CinemaSelector } from "@/app/_components/CinemaSelector";
import { getUserFavoriteCinema } from "@/app/_actions/user";

interface HeaderWithCinemaProps {
  cinemas: Cinema[];
}

export function HeaderWithCinema({ cinemas }: HeaderWithCinemaProps) {
  const [favoriteCinemaId, setFavoriteCinemaId] = useState<number | null>(null);

  useEffect(() => {
    async function loadFavoriteCinema() {
      const cinemaId = await getUserFavoriteCinema();
      if (typeof cinemaId === 'number') {
        setFavoriteCinemaId(cinemaId);
      }
    }
    loadFavoriteCinema();
  }, []);

  return (
    <div className="flex justify-end p-4">
      <CinemaSelector
        cinemas={cinemas}
        currentCinemaId={favoriteCinemaId}
        onSelect={setFavoriteCinemaId}
      />
    </div>
  );
} 