"use server";

import { prisma } from "@/db/db";
import { addDays, isBefore, addMinutes, isAfter } from "date-fns";

export async function GetMyCinemas(userId: string) {
  const cinemas = await prisma.cinema.findMany({
    where: {
      managerId: userId,
    },
    include: {
      Screens: true,
    },
  });
  return cinemas;
}

export const createShowtimes = async (userId: string, data: any) => {
  const { movie, screen, startDate, times } = data;

  // Récupération de l'écran et du film à partir de l'ID
  const selectedScreen = await prisma.screen.findUnique({
    where: { id: parseInt(screen) },
  });

  const selectedMovie = await prisma.movie.findUnique({
    where: { id: parseInt(movie) },
  });

  if (!selectedScreen || !selectedMovie) {
    throw new Error("Ecran ou film introuvable");
  }

  // Vérification que startDate.from est une date valide
  const startDateObj = new Date(startDate.from);
  const endDateObj = new Date(startDate.to);
  if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
    throw new Error("Date de début ou de fin invalide");
  }

  // Création des showtimes pour chaque jour dans la plage de dates
  const createdShowtimes = [];
  for (
    let currentDate = startDateObj;
    currentDate <= endDateObj;
    currentDate = addDays(currentDate, 1)
  ) {
    // Création des showtimes pour chaque horaire de la journée
    for (const time of times) {
      const timeParts = time.split(":");
      if (
        timeParts.length !== 2 ||
        isNaN(Number(timeParts[0])) ||
        isNaN(Number(timeParts[1]))
      ) {
        throw new Error(`Horaire invalide : ${time}`);
      }

      const startTime = new Date(currentDate); // On commence avec la date du jour
      startTime.setHours(Number(timeParts[0])); // On ajuste l'heure
      startTime.setMinutes(Number(timeParts[1])); // On ajuste les minutes

      if (isNaN(startTime.getTime())) {
        throw new Error(
          `Erreur lors de la création du showtime pour l'horaire : ${time}`
        );
      }

      // Vérifier si la séance est dans le passé
      if (isBefore(startTime, new Date())) {
        throw new Error("Impossible de créer une séance dans le passé");
      }

      // Vérifier le chevauchement avec les séances existantes
      const endTime = addMinutes(startTime, selectedMovie.duration);
      
      const overlappingShowtime = await prisma.showtime.findFirst({
        where: {
          screenId: selectedScreen.id,
          OR: [
            {
              AND: [
                { startTime: { lte: startTime } },
                {
                  startTime: {
                    gte: addMinutes(startTime, -selectedMovie.duration),
                  },
                },
              ],
            },
            {
              AND: [
                { startTime: { lte: endTime } },
                { startTime: { gte: startTime } },
              ],
            },
          ],
        },
      });

      if (overlappingShowtime) {
        throw new Error(`Chevauchement détecté pour la séance du ${startTime.toLocaleString()}`);
      }

      // Vérification si la séance existe déjà
      const existingShowtime = await prisma.showtime.findFirst({
        where: {
          startTime: startTime,
          screenId: selectedScreen.id,
        },
      });

      if (existingShowtime) {
        console.log(
          `La séance pour ${startTime} sur l'écran ${selectedScreen.id} existe déjà.`
        );
        continue; // Passer à la prochaine séance si elle existe déjà
      }

      // Création de la nouvelle séance
      const createdShowtime = await prisma.showtime.create({
        data: {
          startTime,
          movieId: selectedMovie.id,
          screenId: selectedScreen.id,
        },
      });

      createdShowtimes.push(createdShowtime);
    }
  }

  return createdShowtimes;
};
