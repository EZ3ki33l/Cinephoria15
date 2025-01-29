import { Suspense } from "react";
import { AboutPageSkeleton } from "@/app/_components/skeletons";
import { AboutContent } from "@/app/a-propos/_components/AboutContent";

export default function AboutPage() {
  return (
    <Suspense fallback={<AboutPageSkeleton />}>
      <AboutContent />
    </Suspense>
  );
}
