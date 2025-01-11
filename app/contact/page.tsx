import { ContactForm } from "./_components/ContactForm";
import { getAllCinemas } from "@/app/_components/_maps copy/_components/getAllCinemas";
import { Suspense } from "react";
import { ContactPageSkeleton } from "@/app/_components/skeletons";

export default async function ContactPage() {
  return (
    <Suspense fallback={<ContactPageSkeleton />}>
      <ContactContent />
    </Suspense>
  );
}

async function ContactContent() {
  const cinemas = await getAllCinemas();
  return <ContactForm cinemas={cinemas} />;
}
