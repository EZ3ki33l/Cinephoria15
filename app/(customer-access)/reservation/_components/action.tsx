"use server";

import { prisma } from "@/db/db";

interface ShowtimeWithDetails {
  id: number;
  Screen: {
    id: number;
    number: number;
    ProjectionType: { name: string };
    SoundSystemType: { name: string };
  };
  Movie: {
    id: number;
    title: string;
    duration: number;
    images: string[];
    genres: { id: number; name: string; }[];
  };
  startTime: Date;
}

export async function getScreensByCinema(cinemaId: number) {
  try {
    const screens = await prisma.screen.findMany({
      where: {
        cinemaId: cinemaId
      },
      include: {
        ProjectionType: true,
        SoundSystemType: true
      },
      orderBy: {
        number: 'asc'
      }
    });

    return {
      success: true,
      data: screens
    };

  } catch (error) {
    console.error("Erreur lors de la récupération des salles:", error);
    return {
      success: false, 
      error: "Une erreur est survenue lors de la récupération des salles"
    };
  }
}


export async function getShowtimesByScreen(cinemaId: number, date: Date) {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const showtimes = await prisma.showtime.findMany({
      where: {
        Screen: {
          cinemaId: cinemaId
        },
        startTime: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      include: {
        Screen: {
          include: {
            ProjectionType: true,
            SoundSystemType: true
          }
        },
        Movie: {
          select: {
            id: true,
            title: true,
            duration: true,
            images: true,
            genres: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: [
        {
          Screen: {
            number: 'asc'
          }
        },
        {
          startTime: 'asc'
        }
      ]
    });

    // Grouper les séances par salle
    const showtimesByScreen = showtimes.reduce((acc, showtime) => {
      if (!showtime.Screen || !showtime.Movie) return acc;
      
      const screenId = showtime.Screen.id;
      if (!acc[screenId]) {
        acc[screenId] = {
          screen: showtime.Screen,
          showtimes: []
        };
      }
      acc[screenId].showtimes.push(showtime);
      return acc;
    }, {} as Record<number, { 
      screen: ShowtimeWithDetails['Screen']; 
      showtimes: ShowtimeWithDetails[]; 
    }>);

    return {
      success: true,
      data: Object.values(showtimesByScreen)
    };

  } catch (error) {
    console.error("Erreur lors de la récupération des séances:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la récupération des séances"
    };
  }
}

