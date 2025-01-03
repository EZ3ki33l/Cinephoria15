import { getAllCinemas } from "@/app/_components/_maps copy/_components/getAllCinemas";
import ContactPage from "./page";

export default async function ContactLayout() {
  const cinemas = await getAllCinemas();

  return <ContactPage cinemas={cinemas} />;
} 