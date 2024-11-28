import { z } from "zod";

export const movieSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  director: z.string().min(1, "Le réalisateur est requis"),
  genre: z.array(z.number().positive()).min(1, "Au moins un genre est requis"),
  duration: z.preprocess(
    (value) => Number(value), // Convertir en nombre
    z.number().min(1, "La durée doit être supérieure à 0")
  ),
  releaseDate: z.string().min(1, "La date de sortie est requise"),
  trailer: z.string().url("L'URL de la bande-annonce doit être valide"),
  summary: z.string().min(10, "Le résumé est trop court"),
  images: z.array(z.string().url()).min(1, "Au moins une image est requise"),
});
