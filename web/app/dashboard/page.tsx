"use client";

import { Suspense } from "react";
import { ProfilePageSkeleton } from "@/app/_components/skeletons";
import { ProfileContent } from "@/app/dashboard/_components/ProfileContent";

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfilePageSkeleton />}>
      <ProfileContent />
    </Suspense>
  );
}
