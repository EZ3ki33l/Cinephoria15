"use server";

import { z } from "zod";
import { resend } from "@/lib/resend-config";
import { prisma } from "@/db/db";

const contactFormSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  motif: z.string().min(1, "Veuillez sélectionner un motif"),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export async function submitContactForm(data: ContactFormData) {
  try {
    const validatedData = contactFormSchema.parse(data);

    // Enregistrer le message dans la base de données
    await prisma.contact.create({
      data: {
        nom: validatedData.nom,
        prenom: validatedData.prenom,
        email: validatedData.email,
        motif: validatedData.motif,
        message: validatedData.message,
      },
    });

    // Envoyer un email de confirmation
    await resend.emails.send({
      from: "contact@cinephoria.fr",
      to: validatedData.email,
      subject: "Confirmation de votre message",
      html: `
        <h1>Merci de nous avoir contacté !</h1>
        <p>Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.</p>
        <h2>Récapitulatif de votre message :</h2>
        <p><strong>Nom :</strong> ${validatedData.nom}</p>
        <p><strong>Prénom :</strong> ${validatedData.prenom}</p>
        <p><strong>Email :</strong> ${validatedData.email}</p>
        <p><strong>Motif :</strong> ${validatedData.motif}</p>
        <p><strong>Message :</strong></p>
        <p>${validatedData.message}</p>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Une erreur est survenue",
    };
  }
} 