"use server";

import { prisma } from "@/db/db";

interface Screen {
  id: number;
  number: number;
  projectionType: string;
  soundSystemType: string;
}

interface Equipment {
  id: number;
  name: string;
}

interface Cinema {
  id: number;
  name: string;
  addressId: number; // champ manquant
  isOpen: boolean | null; // champ manquant
  managerId: string; // champ manquant
  description: string; // champ manquant
  createdAt: Date; // champ manquant
  updatedAt: Date; // champ manquant
  Address: {
    id: number;
    street: string;
    city: string;
    postalCode: number;
    lat: number;
    lng: number;
  };
  Equipment: Equipment[];
  Screens: Screen[];
}

export async function getAllCinemas(): Promise<Cinema[]> {
  try {
    const cinemas = await prisma.cinema.findMany({
      include: {
        Address: true, // Inclure l'adresse
        Equipment: true, // Inclure les équipements
        Screens: {
          include: {
            ProjectionType: true,
            SoundSystemType: true,
          },
        },
      },
    });

    return cinemas.map((cinema) => ({
      id: cinema.id,
      name: cinema.name,
      addressId: cinema.addressId, // Récupérer addressId depuis Prisma
      isOpen: cinema.isOpen, // Récupérer isOpen depuis Prisma
      managerId: cinema.managerId, // Récupérer managerId depuis Prisma
      description: cinema.description || "", // Récupérer description depuis Prisma
      createdAt: cinema.createdAt, // Récupérer createdAt depuis Prisma
      updatedAt: cinema.updatedAt, // Récupérer updatedAt depuis Prisma
      Address: {
        id: cinema.Address.id, // Add this line
        street: cinema.Address?.street || "",
        postalCode: cinema.Address?.postalCode || 0,
        city: cinema.Address?.city || "",
        lat: cinema.Address?.lat || 0,
        lng: cinema.Address?.lng || 0,
      },
      Equipment: cinema.Equipment.map((equipment) => ({
        id: equipment.id,
        name: equipment.name,
      })),
      Screens: cinema.Screens.map((screen) => ({
        id: screen.id,
        number: screen.number,
        projectionType: screen.ProjectionType.name,
        soundSystemType: screen.SoundSystemType.name,
      })),
    }));
  } catch (error) {
    console.error("Error fetching cinemas:", error);
    return [];
  }
}
