import { Typo } from "@/app/_components/_layout/typography";
import React, { Suspense } from "react";
import { Dashboard } from "./_components/dashboard";
import {
  fetchCounts,
  fetchRevenueByCinemas,
  fetchRevenueByMovies,
  fetchRevenueByYear,
  getUsersByMonth,
} from "./_components/actions";
import { AdminDashboardSkeleton } from "@/app/_components/skeletons";

export default async function page() {
  return (
    <Suspense fallback={<AdminDashboardSkeleton />}>
      <AdminContent />
    </Suspense>
  );
}

async function AdminContent() {
  const counts = await fetchCounts();
  const revenueByMovies = await fetchRevenueByMovies();
  const revenueByCinemas = await fetchRevenueByCinemas();
  const revenueByYear = await fetchRevenueByYear();
  const usersByMonth = await getUsersByMonth();

  const revenueByYearData = Object.entries(revenueByYear).map(
    ([year, revenue]) => ({
      year: Number(year),
      revenue,
    })
  );

  return (
    <div>
      <div className="h-auto w-full relative flex justify-center">
        <div className="flex flex-col">
          <Typo
            variant="h3"
            className="relative z-20 bg-clip-text text-center text-transparent bg-gradient-to-r from-primary-light/50 via-primary-dark/80 to-primary-light py-8"
          >
            Dashboard
          </Typo>
          <Dashboard
            counts={counts}
            revenueByMovies={revenueByMovies}
            revenueByCinemas={revenueByCinemas}
            revenueByYearData={revenueByYearData}
            usersByMonth={usersByMonth}
          />
        </div>
      </div>
    </div>
  );
}
