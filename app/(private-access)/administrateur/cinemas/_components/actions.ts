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

export async function createCinema(data: any) {
  console.log("Données reçues par l'action server :", data);

  try {
    // Préparation des données pour Prisma
    const transformedData = {
      name: data.name,
      description: data.description,
      Address: {
        create: {
          street: data.street,
          postalCode: data.postalCode,
          city: data.city,
          lat: data.lat,
          lng: data.lng,
        },
      },
      Managers: {
        connect: [{ id: data.manager.id }],
      },
      Equipment: data.equipments.map(
        (equipment: { label: string }) => equipment.label
      ), // Adaptation ici
      Screens: {
        create: data.screens.map((screen: any) => ({
          number: screen.number,
          rows: screen.rows,
          columns: screen.columns,
          projectionType: screen.projectionType,
          soundSystemType: screen.soundSystemType,
          price: screen.price,
          Seats: {
            create: screen.seats.map((seat: any) => ({
              row: seat.row,
              column: seat.column,
              isHandicap: seat.isHandicap || false,
            })),
          },
        })),
      },
    };

    console.log("Données transformées pour Prisma :", transformedData);

    // Création du cinéma
    const result = await prisma.cinema.create({
      data: transformedData,
    });

    return { success: true, result };
  } catch (error: any) {
    console.error("Erreur lors de la création du cinéma :", error);
    return { success: false, error: error.message };
  }
}
