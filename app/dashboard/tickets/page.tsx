"use client";

import { Suspense } from "react";
import { TicketsPageSkeleton } from "@/app/_components/skeletons";
import { TicketsContent } from "@/app/dashboard/tickets/_components/TicketsContent";

export default function TicketsPage() {
  return (
    <Suspense fallback={<TicketsPageSkeleton />}>
      <TicketsContent />
    </Suspense>
  );
}
