import { z } from "zod";

export const NewsSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  categories: z.number().int().min(1, "Vous devez choisir une catégorie."),
  shortContent: z.string().min(10, "Le contenu est trop court"),
  content: z
    .object({
      type: z.literal("doc"),
      content: z.array(
        z.object({
          type: z.string(),
          content: z.array(z.any()).optional(), // La structure exacte dépend de vos besoins
        })
      ),
    })
    .refine((data) => data.content.length > 0, {
      message: "Le contenu ne peut pas être vide",
    }),
  images: z.array(z.string().url()).min(1, "Au moins une image est requise"),
});
