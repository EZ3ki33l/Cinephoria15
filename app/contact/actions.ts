"use server";

import { v4 as uuidv4 } from "uuid";
import { sendContactEmails } from "@/lib/emails";
import { z } from "zod";

const formSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  motif: z.string().min(1, "Veuillez sélectionner un motif"),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
});

export type ContactFormData = z.infer<typeof formSchema>;

export async function submitContactForm(data: ContactFormData) {
  try {
    console.log("Submitting contact form with data:", data);
    
    const validatedData = formSchema.parse(data);
    const demandeId = uuidv4().slice(0, 10);

    try {
      await sendContactEmails({
        ...validatedData,
        demandeId,
      });

      return { success: true, demandeId };
    } catch (error) {
      console.error("Error in sendContactEmails:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Une erreur est survenue lors de l'envoi des emails" 
      };
    }
  } catch (error) {
    console.error("Error in form validation:", error);
    return { 
      success: false, 
      error: "Une erreur est survenue lors de la validation du formulaire" 
    };
  }
} 