import { Typo } from "@/app/_components/_layout/typography";
import React from "react";
import { Dashboard } from "./_components/dashboard";
import {
  fetchCounts,
  fetchRevenueByCinemas,
  fetchRevenueByMovies,
  fetchRevenueByYear,
  getUsersByMonth,
} from "./_components/actions";

export default async function page() {
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
      <div className="h-auto w-full dark:bg-black bg-white  dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex justify-center">
        {/* Radial gradient for the container to give a faded look */}
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
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
