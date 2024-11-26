"use server";

import { prisma } from "@/db/db";
import { Genre } from "@prisma/client";
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

export async function createMovie(data: {
  title: string;
  genre: string[]; // tableau d'ID de genres
  director: string;
  duration: number;
  releaseDate: string;
  trailer: string;
  summary: string;
  images?: { url: string }[];
}) {
  return await prisma.movie.create({
    data: {
      title: data.title,
      genre: data.genre.map((genreLabel) => Genre[genreLabel as keyof typeof Genre])[0],
      director: data.director,
      duration: data.duration,
      releaseDate: new Date(data.releaseDate),
      trailer: data.trailer,
      summary: data.summary,
      images: data.images?.map((image) => image.url)
    },
  });
}
