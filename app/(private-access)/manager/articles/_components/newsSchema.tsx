import { z } from "zod";

export const NewsSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  category: z
    .array(z.number().positive())
    .min(1, "Au moins une catégorie est requise"),
  shortContent: z.string().min(10, "Le contenu est trop court"),
  content: z.any(), // Change the type of content to any
  images: z.array(z.string().url()).min(1, "Au moins une image est requise"),
});
