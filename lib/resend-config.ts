import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
if (!resendApiKey) {
  throw new Error("RESEND_API_KEY is not defined");
}

export const resend = new Resend(resendApiKey);

export interface SendContactEmailParams {
  nom: string;
  prenom: string;
  email: string;
  motif: string;
  message: string;
  demandeId: string;
} 