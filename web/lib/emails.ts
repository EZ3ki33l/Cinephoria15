"use server";

import { resend } from "./resend-config";
import type { SendContactEmailParams } from "./resend-config";

export async function sendContactEmails({
  nom,
  prenom,
  email,
  motif,
  message,
  demandeId,
}: SendContactEmailParams) {
  const PLATFORM_NAME = "Cinéphoria";
  const PLATFORM_EMAIL_FROM = "onboarding@resend.dev";
  const PLATFORM_EMAIL_TEAM = "rrousset.dev@gmail.com";

  console.log("Sending emails with params:", {
    nom,
    prenom,
    email,
    motif,
    demandeId,
    PLATFORM_EMAIL_FROM,
    PLATFORM_EMAIL_TEAM
  });

  try {
    // Email à l'utilisateur
    const userEmailResult = await resend.emails.send({
      from: PLATFORM_EMAIL_FROM,
      to: email,
      subject: "Confirmation de votre demande de contact",
      html: `
        <h1>Confirmation de votre demande</h1>
        <p>Bonjour ${prenom} ${nom},</p>
        <p>Nous avons bien reçu votre demande de contact. Voici un récapitulatif :</p>
        <ul>
          <li><strong>Numéro de demande :</strong> ${demandeId}</li>
          <li><strong>Motif :</strong> ${motif}</li>
          <li><strong>Message :</strong> ${message}</li>
        </ul>
        <p>Nous vous répondrons dans les plus brefs délais.</p>
        <p>Cordialement,<br>L'équipe ${PLATFORM_NAME}</p>
      `,
    });

    console.log("User email sent:", userEmailResult);

    // Email à l'équipe
    const teamEmailResult = await resend.emails.send({
      from: PLATFORM_EMAIL_FROM,
      to: PLATFORM_EMAIL_TEAM,
      subject: `Nouvelle demande de contact - ${motif}`,
      html: `
        <h1>Nouvelle demande de contact</h1>
        <ul>
          <li><strong>Numéro de demande :</strong> ${demandeId}</li>
          <li><strong>Nom :</strong> ${prenom} ${nom}</li>
          <li><strong>Email :</strong> ${email}</li>
          <li><strong>Motif :</strong> ${motif}</li>
          <li><strong>Message :</strong> ${message}</li>
        </ul>
      `,
    });

    console.log("Team email sent:", teamEmailResult);

    return { success: true };
  } catch (error) {
    console.error("Error sending emails:", error);
    throw error;
  }
} 