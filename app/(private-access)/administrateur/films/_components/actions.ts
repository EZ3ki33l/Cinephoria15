"use server";

import { prisma } from "@/db/db";
import { v4 as uuidv4 } from "uuid";

export async function fetchGenres() {
  const enumValues = await prisma.$queryRaw<Array<{ value: string }>>`
    SELECT unnest(enum_range(NULL::"Genre"))::text AS value
  `;

  // Formater les résultats avec des IDs uniques
  return enumValues.map((item) => ({
    id: uuidv4(),
    label: item.value,
  }));
}
