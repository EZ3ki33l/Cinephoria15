"use server";

import { prisma } from "@/db/db";
import { Equipment } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

export async function fetchEquipments() {
  const enumValues = await prisma.$queryRaw<Array<{ value: string }>>`
    SELECT unnest(enum_range(NULL::"Equipment"))::text AS value
  `;

  // Formater les résultats avec des IDs uniques
  return enumValues.map((item) => ({
    id: uuidv4(),
    label: item.value,
  }));
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

export async function fetchProjectionTypes() {
  const projectionTypes = await prisma.$queryRaw<Array<{ value: string }>>`
      SELECT unnest(enum_range(NULL::"ProjectionType"))::text AS value
    `;

  return projectionTypes.map((type) => ({
    id: uuidv4(),
    label: type.value
      .replace("_", " ")
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase()),
  }));
}

export async function fetchSoundSystemTypes() {
  const soundSystemTypes = await prisma.$queryRaw<Array<{ value: string }>>`
      SELECT unnest(enum_range(NULL::"SoundSystemType"))::text AS value
    `;

  return soundSystemTypes.map((type) => ({
    id: uuidv4(),
    label: type.value
      .replace("_", " ")
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase()),
  }));
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
      Equipment: data.equipments.map((equipment: { label: string }) => equipment.label), // Adaptation ici
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
  } catch (error : any) {
    console.error("Erreur lors de la création du cinéma :", error);
    return { success: false, error: error.message };
  }
}