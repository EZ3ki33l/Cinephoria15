"use server";
import { prisma } from "@/db/db";

export async function getAllCinemas() {
  try {
    // Récupérer tous les cinémas avec leurs adresses et leurs écrans
    const cinemas = await prisma.cinema.findMany({
      include: {
        Address: true,
        Screens: {
          include: {
            Seats: true,
            ProjectionType: true,
            SoundSystemType: true,
          },
        },
        Equipment: true,
      },
    });
    if (!cinemas) return null;

    // Transformer chaque cinéma pour correspondre au type attendu
    return cinemas.map(cinema => ({
      id: cinema.id,
      name: cinema.name,
      Equipment: cinema.Equipment,
      Address: {
        street: cinema.Address.street,
        postalCode: cinema.Address.postalCode,
        city: cinema.Address.city,
        lat: cinema.Address.lat,
        lng: cinema.Address.lng,
      },
      screens: cinema.Screens.map(screen => ({
        id: screen.id,
        number : screen.number,
        projectionType: screen.ProjectionType?.name,
        soundSystemType: screen.SoundSystemType?.name,
        seats: screen.Seats.length,
      })),
    }));
  } catch (error) {
    console.error("Error fetching cinemas:", error);
    return null; // Retourne null en cas d'erreur
  }
}