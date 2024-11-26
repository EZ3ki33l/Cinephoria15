import { z } from "zod";

// Schéma de validation pour le formulaire
export const cinemaSchema = z.object({
  name: z.string().min(1, "Le nom du cinéma est requis"),
  manager: z.object({
    id: z.string().min(1, "L'ID du manager est requis"), // Manager doit avoir un ID valide
  }),
  street: z.string().min(1, "Le numéro et nom de la rue sont requis"),
  postalCode: z
    .string()
    .regex(/^\d{5}$/, "Le code postal doit comporter exactement 5 chiffres")
    .transform((val) => Number(val)) // Transformer en nombre
    .refine((val) => val >= 10000 && val <= 99999, {
      message: "Le code postal doit être compris entre 10000 et 99999",
    }),
  city: z.string().min(1, "La ville est requise"),
  lat: z
    .string()
    .transform((val) => parseFloat(val)) // Convertir lat en nombre
    .refine((val) => !isNaN(val) && val >= -90 && val <= 90, {
      message: "La latitude doit être entre -90 et 90",
    }),
  lng: z
    .string()
    .transform((val) => parseFloat(val)) // Convertir lng en nombre
    .refine((val) => !isNaN(val) && val >= -180 && val <= 180, {
      message: "La longitude doit être entre -180 et 180",
    }),
  equipments: z.array(z.object({ id: z.string(), label: z.string() })),
  description: z.string().min(1, "La description est requise"),
  screens: z.array(
    z.object({
      number: z.number().min(1, "Le numéro de salle est requis"),
      rows: z
        .string()
        .transform((val) => parseInt(val)) // Transformer rows en nombre
        .refine((val) => !isNaN(val) && val > 0, {
          message: "Le nombre de rangées doit être un nombre positif",
        }),
      columns: z
        .string()
        .transform((val) => parseInt(val)) // Transformer columns en nombre
        .refine((val) => !isNaN(val) && val > 0, {
          message: "Le nombre de colonnes doit être un nombre positif",
        }),
      projectionType: z.string().min(1, "Le type de projection est requis"),
      soundSystemType: z.string().min(1, "Le type de son est requis"),
      price: z
        .string()
        .transform((val) => parseFloat(val)) // Transformer price en nombre
        .refine((val) => !isNaN(val) && val >= 0, {
          message: "Le prix doit être un nombre positif",
        }),
      seats: z.array(z.object({ row: z.number(), column: z.number() })),
    })
  ),
});
