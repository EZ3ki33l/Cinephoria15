"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Cinema } from "@prisma/client";
import {
  updateFavoriteCinema,
  getUserFavoriteCinema,
} from "@/app/_actions/user";
import { Button } from "./_layout/button";

interface CinemaSelectorProps {
  cinemas: Cinema[];
  currentCinemaId: number | null;
  onSelect?: (cinemaId: number) => void;
}

export function CinemaSelector({
  cinemas,
  currentCinemaId = null,
  onSelect,
}: CinemaSelectorProps) {
  const [open, setOpen] = useState(false);
  const [selectedCinema, setSelectedCinema] = useState<number | null>(
    currentCinemaId
  );

  useEffect(() => {
    async function loadFavoriteCinema() {
      const favoriteCinemaId = await getUserFavoriteCinema();
      if (typeof favoriteCinemaId === "number") {
        setSelectedCinema(favoriteCinemaId);
      }
    }
    loadFavoriteCinema();
  }, []);

  const handleSelect = async (cinemaId: number) => {
    await updateFavoriteCinema(cinemaId);
    setSelectedCinema(cinemaId);
    onSelect?.(cinemaId);
    setOpen(false);
  };

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)} className="gap-2" size={"medium"}>
        <span>Choisir mon cinéma</span>
        {selectedCinema && (
          <span className="text-sm text-muted-foreground">
            ({cinemas.find((c) => c.id === selectedCinema)?.name})
          </span>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Choisissez votre cinéma</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {cinemas.map((cinema) => (
              <Button
                key={cinema.id}
                variant={selectedCinema === cinema.id ? "primary" : "outline"}
                onClick={() => handleSelect(cinema.id)}
                className="w-full justify-start"
              >
                {cinema.name}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
