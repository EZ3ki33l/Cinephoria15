"use server";

import { prisma } from "@/db/db";
import { revalidatePath } from "@/hooks/revalidePath";
import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import QRCode from "qrcode";

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
    genres: { id: number; name: string }[];
  };
  startTime: Date;
}

export async function getScreensByCinema(cinemaId: number) {
  try {
    const screens = await prisma.screen.findMany({
      where: {
        cinemaId: cinemaId,
      },
      include: {
        ProjectionType: true,
        SoundSystemType: true,
      },
      orderBy: {
        number: "asc",
      },
    });

    return {
      success: true,
      data: screens,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des salles:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la récupération des salles",
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
          cinemaId: cinemaId,
        },
        startTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        Screen: {
          include: {
            ProjectionType: true,
            SoundSystemType: true,
          },
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
                name: true,
              },
            },
          },
        },
      },
      orderBy: [
        {
          Screen: {
            number: "asc",
          },
        },
        {
          startTime: "asc",
        },
      ],
    });

    // Grouper les séances par salle
    const showtimesByScreen = showtimes.reduce(
      (acc, showtime) => {
        if (!showtime.Screen || !showtime.Movie) return acc;

        const screenId = showtime.Screen.id;
        if (!acc[screenId]) {
          acc[screenId] = {
            screen: showtime.Screen,
            showtimes: [],
          };
        }
        acc[screenId].showtimes.push(showtime);
        return acc;
      },
      {} as Record<
        number,
        {
          screen: ShowtimeWithDetails["Screen"];
          showtimes: ShowtimeWithDetails[];
        }
      >
    );

    return {
      success: true,
      data: Object.values(showtimesByScreen),
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des séances:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la récupération des séances",
    };
  }
}

interface CreateCheckoutSessionParams {
  seats: string[];
  totalAmount: number;
  showtimeId: number;
}

export async function createCheckoutSession({
  seats,
  totalAmount,
  showtimeId,
}: CreateCheckoutSessionParams) {
  if (!stripe) {
    return { success: false, error: "Configuration Stripe manquante" };
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100,
      currency: "eur",
      payment_method_types: ["card"],
      metadata: {
        showtimeId: showtimeId.toString(),
        seats: seats.join(","),
      },
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
    };
  } catch (error) {
    console.error("Erreur Stripe:", error);
    return {
      success: false,
      error: "Erreur lors de la création de la session de paiement",
    };
  }
}

export async function createBooking(data: {
  showtimeId: number;
  seats: string[];
  totalAmount: number;
  discounts: { seatId: string; type: string }[];
}) {
  try {
    const authData = await auth();
    if (!authData?.userId) {
      return { success: false, error: "Utilisateur non authentifié" };
    }

    // Récupérer la séance avec l'écran
    const showtime = await prisma.showtime.findUnique({
      where: { id: data.showtimeId },
      include: { Screen: true }
    });

    if (!showtime) {
      return { success: false, error: "Séance introuvable" };
    }

    console.log('Debug - Données initiales:', {
      showtimeId: data.showtimeId,
      screenId: showtime.screenId,
      requestedSeats: data.seats
    });

    // Vérifier que les sièges existent
    const foundSeats = await Promise.all(
      data.seats.map(async (seatId) => {
        const match = seatId.match(/([A-Z])(\d+)/);
        if (!match) return null;

        const row = match[1].charCodeAt(0) - 64;
        const column = parseInt(match[2], 10);

        const seat = await prisma.seat.findFirst({
          where: {
            screenId: showtime.screenId,
            row: row,
            column: column
          }
        });

        console.log('Recherche siège:', {
          seatId,
          row,
          column,
          found: seat ? true : false,
          seatDetails: seat
        });

        return seat;
      })
    );

    // Filtrer les sièges null et vérifier que tous les sièges ont été trouvés
    const seats = foundSeats.filter((seat): seat is NonNullable<typeof seat> => seat !== null);

    if (seats.length !== data.seats.length) {
      const foundIds = seats.map(s => `${String.fromCharCode(65 + s.row)}${s.column}`);
      const missingSeats = data.seats.filter(id => !foundIds.includes(id));

      console.log('Erreur sièges:', {
        requested: data.seats,
        found: foundIds,
        missing: missingSeats,
        screenId: showtime.screenId
      });

      return { 
        success: false, 
        error: "Certains sièges n'existent pas",
        debug: {
          requested: data.seats,
          found: foundIds,
          missing: missingSeats
        }
      };
    }

    // Vérifier les réservations existantes
    const existingBookings = await prisma.booking.findMany({
      where: {
        showtimeId: data.showtimeId,
        seatId: {
          in: seats.map(seat => seat.id)
        }
      }
    });

    if (existingBookings.length > 0) {
      return { success: false, error: "Certains sièges sont déjà réservés" };
    }

    // Créer le ticket et les réservations
    const result = await prisma.$transaction(async (tx) => {
      const ticket = await tx.ticket.create({
        data: {
          uid: authData.userId,
          qrCode: await QRCode.toDataURL(JSON.stringify({
            showtimeId: data.showtimeId,
            seats: data.seats,
            timestamp: new Date().toISOString(),
          }))
        }
      });

      const bookings = await Promise.all(
        seats.map(async (seat) => {
          const seatId = `${String.fromCharCode(65 + seat.row)}${seat.column}`;
          return tx.booking.create({
            data: {
              userId: authData.userId,
              showtimeId: data.showtimeId,
              seatId: seat.id,
              pricePaid: calculateSeatPrice(seatId, data.discounts),
              ticketId: ticket.id
            }
          });
        })
      );

      return { ticket, bookings };
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Debug - Erreur complète:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Une erreur est survenue" };
  }
}

function calculateSeatPrice(seatId: string, discounts: { seatId: string; type: string }[]) {
  const BASE_PRICE = 19;
  const DISCOUNT_AMOUNTS = {
    none: 0,
    young: 4,
    plus60: 4,
    handicap: 4,
    under12: 6,
  };
  
  const discount = discounts.find(d => d.seatId === seatId);
  return BASE_PRICE - (DISCOUNT_AMOUNTS[discount?.type as keyof typeof DISCOUNT_AMOUNTS] || 0);
}

export async function notifySelectedSeats(showtimeId: number, seats: string[]) {
  try {
    // Supprimer l'ancienne sélection pour cet utilisateur
    await prisma.temporarySelection.deleteMany({
      where: {
        showtimeId,
        createdAt: {
          lt: new Date(Date.now() - 5 * 60 * 1000)
        }
      }
    });

    // Créer la nouvelle sélection
    await prisma.temporarySelection.create({
      data: {
        showtimeId,
        seats,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000)
      }
    });

    revalidatePath('/reservation');
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la notification des sièges:', error);
    return { success: false };
  }
}

export async function getSelectedSeats(showtimeId: number) {
  try {
    // Nettoyer les sélections expirées
    await prisma.temporarySelection.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });

    // 1. Récupérer les sièges temporairement sélectionnés
    const temporarySelections = await prisma.temporarySelection.findMany({
      where: {
        showtimeId
      }
    });

    // 2. Récupérer les sièges déjà réservés
    const bookedSeats = await prisma.booking.findMany({
      where: {
        showtimeId
      },
      include: {
        Seat: true
      }
    });

    // Combiner les sièges temporaires et réservés
    const temporarySeats = temporarySelections.flatMap(s => s.seats);
    const reservedSeats = bookedSeats.map(booking => 
      `${String.fromCharCode(65 + booking.Seat.row)}${booking.Seat.column}`
    );

    return { 
      success: true, 
      seats: [...new Set([...temporarySeats, ...reservedSeats])] 
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des sièges:', error);
    return { success: false, seats: [] };
  }
}

export async function getScreenConfiguration(screenId: number) {
  try {
    const seats = await prisma.seat.findMany({
      where: {
        screenId: screenId
      },
      orderBy: [
        { row: 'asc' },
        { column: 'asc' }
      ]
    });

    // Calculer les dimensions de la salle
    const maxRow = Math.max(...seats.map(s => s.row));
    const maxColumn = Math.max(...seats.map(s => s.column));

    return {
      success: true,
      data: {
        seats: seats,
        dimensions: {
          rows: maxRow,
          columns: maxColumn
        }
      }
    };
  } catch (error) {
    console.error('Erreur lors de la récupération de la configuration:', error);
    return { success: false, error: "Impossible de récupérer la configuration de la salle" };
  }
} 