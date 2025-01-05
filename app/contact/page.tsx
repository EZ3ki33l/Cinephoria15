import { ContactForm } from "./_components/ContactForm";
import { getAllCinemas } from "@/app/_components/_maps copy/_components/getAllCinemas";

export default async function ContactPage() {
  const cinemas = await getAllCinemas();
  return <ContactForm cinemas={cinemas} />;
}
