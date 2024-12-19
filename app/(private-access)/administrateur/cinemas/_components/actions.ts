"use server";

import { prisma } from "@/db/db";

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

type ScreenInput = {
  number: number;
  rows: number;
  columns: number;
  projectionType: string;
  soundSystemType: string;
  price: number;
};

type EquipmentInput = {
  id: number;
};

function calculateHandicapSeats(totalSeats: number): number {
  const percentage = totalSeats >= 200 ? 0.08 : 0.05;
  const handicapSeats = Math.ceil(totalSeats * percentage);
  return Math.max(handicapSeats, 4);
}

function isHandicapSeat(row: number, column: number, columns: number, seatsPerSide: number): boolean {
  return (row === 0 || row === 1) && 
         (column <= seatsPerSide || column > columns - seatsPerSide);
}

export async function createCinemaAction(formData: FormData) {
  try {
    // Conversion des données brutes
    const rawData = Object.fromEntries(formData.entries());
    const cinemaData = {
      name: rawData.name as string,
      description: rawData.description as string,
      street: rawData.street as string,
      postalCode: rawData.postalCode as string,
      city: rawData.city as string,
      lat: rawData.lat as string,
      lng: rawData.lng as string,
      managerId: rawData.manager as string, // Assure-toi que cet ID est correct
      equipments: rawData.equipments
        ? JSON.parse(rawData.equipments as string)
        : [],
      screens: rawData.screens ? JSON.parse(rawData.screens as string) : [],
    };

    // Vérification que le manager existe dans la base de données
    const managerExists = await prisma.manager.findUnique({
      where: { id: cinemaData.managerId },
    });

    if (!managerExists) {
      throw new Error(
        `Le manager avec l'ID ${cinemaData.managerId} n'existe pas.`
      );
    }

    // Récupérer les IDs pour les ProjectionType et SoundSystemType
    const screensWithIds = await Promise.all(
      cinemaData.screens.map(async (screen: ScreenInput) => {
        const projectionType = await prisma.projectionType.findFirst({
          where: { name: screen.projectionType },
        });

        const soundSystemType = await prisma.soundSystemType.findFirst({
          where: { name: screen.soundSystemType },
        });

        if (!projectionType) {
          throw new Error(
            `Le type de projection '${screen.projectionType}' est introuvable.`
          );
        }

        if (!soundSystemType) {
          throw new Error(
            `Le type de son '${screen.soundSystemType}' est introuvable.`
          );
        }

        return {
          number: screen.number,
          price: screen.price,
          projectionTypeId: projectionType.id,
          soundSystemTypeId: soundSystemType.id,
          rows: screen.rows, // Utilisé pour créer les sièges
          columns: screen.columns, // Utilisé pour créer les sièges
        };
      })
    );

    // Création du cinéma avec Prisma
    const cinema = await prisma.cinema.create({
      data: {
        name: cinemaData.name,
        description: cinemaData.description,
        Address: {
          create: {
            street: cinemaData.street,
            postalCode: parseInt(cinemaData.postalCode),
            city: cinemaData.city,
            lat: parseFloat(cinemaData.lat),
            lng: parseFloat(cinemaData.lng),
          },
        },
        Manager: {
          connect: { id: cinemaData.managerId }, // Utilise l'ID du manager ici
        },
        Equipment: {
          connect: cinemaData.equipments.map((equipment: EquipmentInput) => ({
            id: equipment.id,
          })),
        },
        Screens: {
          create: screensWithIds.map((screen: any) => {
            const totalSeats = screen.rows * screen.columns;
            const handicapSeatsCount = calculateHandicapSeats(totalSeats);
            const seatsPerSide = Math.ceil(handicapSeatsCount / 4);

            return {
              number: screen.number,
              price: parseFloat(screen.price),
              projectionTypeId: screen.projectionTypeId,
              soundSystemTypeId: screen.soundSystemTypeId,
              Seats: {
                create: Array.from(
                  { length: screen.rows * screen.columns },
                  (_, index) => {
                    const row = Math.floor(index / screen.columns);
                    const column = (index % screen.columns) + 1;
                    
                    return {
                      row: row + 1,
                      column: column,
                      isHandicap: isHandicapSeat(row, column, screen.columns, seatsPerSide)
                    };
                  }
                ),
              },
            };
          }),
        },
      },
    });

    console.log("Cinéma créé :", cinema);
    return { success: true, cinema };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Erreur lors de la création du cinéma :", error.message);
      throw new Error(`Erreur inconnue : ${error.message}`);
    }
    console.error("Erreur inconnue de type 'unknown' :", error);
    throw new Error("Erreur inconnue.");
  }
}

export async function getAllCinemas() {
  const cinemas = await prisma.cinema.findMany({
    include: {
      Address: true,
      Manager: {
        include: {
          User: true, // Inclut les données de l'utilisateur liées
        },
      },
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

  return cinemas;
}

export async function IsOpen(id: number, isOpen: boolean) {
  await prisma.cinema.update({ where: { id }, data: { isOpen } });
}

export async function deleteCinema(id: number) {
  await prisma.cinema.delete({ where: { id } });
}
