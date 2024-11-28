"use server";

import { prisma } from "@/db/db";
import { revalidatePath } from "@/hooks/revalidePath";
import { Prisma } from "@prisma/client";

export async function getAllEquipments() {
  try {
    const equipments = await prisma.equipment.findMany();
    return equipments;
  } catch (error) {
    console.error("Erreur lors de la récupération des équipements :", error);
    throw new Error("Impossible de récupérer les équipements");
  }
}

export async function fetchManagers() {
  const managers = await prisma.manager.findMany({
    include: {
      User: true, // Inclut les données de l'utilisateur liées
    },
  });

  return managers.map((manager) => ({
    id: manager.id,
    name: `${manager.User.firstName} ${manager.User.lastName}`,
  }));
}

export async function getAllProjectionType() {
  try {
    const projectionType = await prisma.projectionType.findMany();
    return projectionType;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des types de projection :",
      error
    );
    throw new Error("Impossible de récupérer les types de projection");
  }
}

export async function getAllSoundSystemType() {
  try {
    const soundSystemType = await prisma.soundSystemType.findMany();
    return soundSystemType;
  } catch (error) {
    console.error("Erreur lors de la récupération des types de son :", error);
    throw new Error("Impossible de récupérer les types de son");
  }
}

interface Address {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  street: string;
  postalCode: number;
  city: string;
  lat: number;
  lng: number;
}

export const createCinemaAction = async (formData: any) => {
  const { name, description, address, manager, equipments, screens } = formData;

  try {
    // Créer l'adresse
    const newAddress: Address = await prisma.address.create({
      data: {
        street: address.street,
        postalCode: address.postalCode,
        city: address.city,
        lat: address.lat,
        lng: address.lng,
      },
    });

    // Créer le cinéma
    const cinema = await prisma.cinema.create({
      data: {
        name,
        description,
        isOpen: false, // Définissez si le cinéma est ouvert ou non selon la logique de votre application
        addressId: address.id, // Lier l'adresse
        Managers: {
          create: [
            {
              id: manager.id, // Assurez-vous que l'ID du manager existe et est valide
            },
          ],
        },
        Equipment: {
          create: equipments.map((equipment: { name: string }) => ({
            name: equipment.name,
          })),
        },
        Screens: {
          create: screens.map((screen: any) => ({
            number: screen.number,
            price: screen.price,
            projectionTypeId: screen.projectionTypeId, // Assurez-vous que l'ID du type de projection existe
            soundSystemTypeId: screen.soundSystemTypeId, // Assurez-vous que l'ID du type de son existe
            Seats: {
              create: screen.seats.map((seat: any) => ({
                row: seat.row,
                column: seat.column,
                isHandicap: seat.isHandicap,
              })),
            },
            Showtimes: {
              create: screen.showtimes.map((showtime: any) => ({
                time: showtime.time,
                movie: showtime.movie, // Exemple : Assurez-vous que vous avez un film dans votre base de données
              })),
            },
          })),
        },
      },
    });

    // Revalidation de cache, si nécessaire
    revalidatePath("/");

    return cinema;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error creating cinema:", error);
      throw new Error("Error creating cinema: " + error.message);
    } else {
      console.error("An unknown error occurred:", error);
      throw error;
    }
  }
};
