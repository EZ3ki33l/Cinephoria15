"use server"

import { prisma } from "@/db/db";

export async function fetchCounts() {
  const adminCount = await prisma.admin.count();
  const managerCount = await prisma.manager.count();
  const userCount = await prisma.user.count();
  const movieCount = await prisma.movie.count();
  const cinemaCount = await prisma.cinema.count();

  return { adminCount, managerCount, userCount, movieCount, cinemaCount };
}

export async function fetchRevenueByMovies() {
  const movies = await prisma.movie.findMany({
    select: {
      title: true,
      Showtimes: {
        select: {
          Bookings: {
            select: {
              pricePaid: true,
            },
          },
        },
      },
    },
  });

  return movies.map((movie) => ({
    title: movie.title,
    revenue: movie.Showtimes.reduce(
      (sum, showtime) =>
        sum +
        showtime.Bookings.reduce((s, booking) => s + booking.pricePaid, 0),
      0
    ),
  }));
}

export async function fetchRevenueByCinemas() {
  const cinemas = await prisma.cinema.findMany({
    select: {
      name: true,
      Screens: {
        select: {
          Showtimes: {
            select: {
              Bookings: {
                select: {
                  pricePaid: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return cinemas.map((cinema) => ({
    name: cinema.name,
    revenue: cinema.Screens.reduce(
      (sum, screen) =>
        sum +
        screen.Showtimes.reduce(
          (s, showtime) =>
            s +
            showtime.Bookings.reduce((t, booking) => t + booking.pricePaid, 0),
          0
        ),
      0
    ),
  }));
}

export async function fetchRevenueByYear() {
  const bookings = await prisma.booking.groupBy({
    by: ["createdAt"],
    _sum: { pricePaid: true },
  });

  return bookings.reduce((acc, { createdAt, _sum }) => {
    const year = new Date(createdAt).getFullYear();
    acc[year] = (acc[year] || 0) + (_sum.pricePaid || 0);
    return acc;
  }, {} as Record<number, number>);
}

export async function getUsersByMonth() {
  const result = await prisma.user.groupBy({
    by: ["createdAt"],
    _count: {
      _all: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Regrouper les données par mois
  const usersByMonth = result.reduce((acc: Record<string, number>, item) => {
    const month = new Date(item.createdAt).toLocaleString("fr-FR", {
      month: "long",
      year: "numeric",
    });
    acc[month] = (acc[month] || 0) + item._count._all;
    return acc;
  }, {});

  // Convertir l'objet en tableau pour le graphique
  return Object.entries(usersByMonth).map(([month, count]) => ({
    month,
    count,
  }));
}
