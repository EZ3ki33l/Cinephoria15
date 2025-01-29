"use server";

import { prisma } from "../../../db/db";
import { revalidatePath } from "../../../hooks/revalidePath";
import { stripe } from "../../../lib/stripe";
import { auth } from "@clerk/nextjs/server";
import QRCode from "qrcode";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ShowtimeWithDetails {
  id: number;
  startTime: Date;
  screen: {
    id: number;
    number: number;
    price: number;
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
}
export async function getActivePromotions() {
  try {
    const now = new Date();
    const promotions = await prisma.discount.findMany({
      where: {
        isActive: true,
        OR: [
          { isRecurrent: true },
          {
            AND: [
              { startDate: { lte: now } },
              { endDate: { gte: now } }
            ]
          }
        ]
      },
      select: {
        id: true,
        name: true,
        amount: true,
        isActive: true,
        isRecurrent: true,
        startDate: true,
        endDate: true
      }
    });
    
    return { success: true, data: promotions };
  } catch (error) {
    console.error("Erreur lors de la récupération des promotions:", error);
    return { success: false, error: "Erreur lors de la récupération des promotions" };
  }
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
          select: {
            id: true,
            number: true,
            price: true,
            ProjectionType: {
              select: {
                name: true
              }
            },
            SoundSystemType: {
              select: {
                name: true
              }
            }
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

    console.log("Showtimes with prices:", showtimes.map(s => ({
      id: s.id,
      screenId: s.Screen?.id,
      screenNumber: s.Screen?.number,
      price: s.Screen?.price
    })));

    // Grouper les séances par salle
    const showtimesByScreen = showtimes.reduce(
      (acc, showtime) => {
        if (!showtime.Screen || !showtime.Movie) return acc;

        const screenId = showtime.Screen.id;
        if (!acc[screenId]) {
          acc[screenId] = {
            screen: {
              id: showtime.Screen.id,
              number: showtime.Screen.number,
              price: showtime.Screen.price,
              ProjectionType: showtime.Screen.ProjectionType,
              SoundSystemType: showtime.Screen.SoundSystemType
            },
            showtimes: [],
          };
        }
        acc[screenId].showtimes.push({
          id: showtime.id,
          startTime: showtime.startTime,
          screen: showtime.Screen,
          Movie: showtime.Movie
        });
        return acc;
      },
      {} as Record<
        number,
        {
          screen: ShowtimeWithDetails["screen"];
          showtimes: ShowtimeWithDetails[];
        }
      >
    );

    console.log("Grouped showtimes with prices:", Object.values(showtimesByScreen).map(group => ({
      screenId: group.screen.id,
      screenNumber: group.screen.number,
      price: group.screen.price,
      showtimesCount: group.showtimes.length
    })));

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

export async function createCheckoutSession({
  seats,
  totalAmount,
  showtimeId,
  discounts
}: {
  seats: string[];
  totalAmount: number;
  showtimeId: number;
  discounts: { seatId: string; type: string; discountId?: number }[];
}) {
  try {
    const session = await auth();
    if (!session?.userId) {
      return { success: false, error: "Utilisateur non authentifié" };
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100,
      currency: "eur",
      metadata: {
        userId: session.userId,
        showtimeId: showtimeId.toString(),
        seats: JSON.stringify(seats),
        discounts: JSON.stringify(discounts)
      },
    });

    if (!paymentIntent.client_secret) {
      throw new Error("Pas de client secret généré");
    }

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
    };
  } catch (error) {
    console.error("Erreur lors de la création de la session:", error);
    return { success: false, error: "Erreur lors de la création de la session" };
  }
}

async function getDiscountAmount(discountId: number): Promise<number> {
  const discount = await prisma.discount.findUnique({
    where: { id: discountId },
    select: { amount: true }
  });
  return discount?.amount || 0;
}

async function calculateTotalPrice(basePrice: number, discounts: { seatId: string; type: string; discountId?: number }[], totalSeats: number): Promise<number> {
  let total = basePrice * totalSeats; // Prix de base pour tous les sièges
  
  // Soustraire les réductions
  for (const discount of discounts) {
    if (discount.discountId) {
      const discountAmount = await getDiscountAmount(discount.discountId);
      total -= discountAmount;
    }
  }
  
  return total;
}

export async function createBooking(data: {
  showtimeId: number;
  seats: string[];
  totalAmount: number;
  discounts: { seatId: string; type: string; discountId?: number }[];
  paymentIntentId?: string;
}) {
  try {
    console.log('Debug - createBooking - Données reçues:', {
      ...data,
      paymentIntentId: data.paymentIntentId
    });

    const authData = await auth();
    if (!authData?.userId) {
      return { success: false, error: "Utilisateur non authentifié" };
    }

    // Récupérer la séance avec l'écran
    const showtime = await prisma.showtime.findUnique({
      where: { id: data.showtimeId },
      include: {
        Screen: {
          include: {
            Cinema: {
              include: {
                Address: true
              }
            }
          }
        },
        Movie: {
          select: {
            title: true
          }
        }
      }
    });

    if (!showtime || !showtime.Screen) {
      return { success: false, error: "Séance ou salle introuvable" };
    }

    // Récupérer le prix de la salle
    const screen = await prisma.screen.findUnique({
      where: { id: showtime.Screen.id },
      select: { price: true }
    });

    if (!screen?.price) {
      return { success: false, error: "Prix de la salle non trouvé" };
    }

    const basePrice = screen.price;
    const calculatedTotal = await calculateTotalPrice(basePrice, data.discounts, data.seats.length);
    
    if (Math.abs(calculatedTotal - data.totalAmount) > 0.01) {
      return { success: false, error: "Le montant total ne correspond pas au prix calculé" };
    }

    // Vérifier si la séance n'est pas passée
    const now = new Date();
    const showtimeDate = new Date(showtime.startTime);
    
    if (showtimeDate < now) {
      return { success: false, error: "Cette séance est déjà passée" };
    }

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
            column: column,
          },
        });

        return seat;
      })
    );

    // Filtrer les sièges null et vérifier que tous les sièges ont été trouvés
    const seats = foundSeats.filter(
      (seat): seat is NonNullable<typeof seat> => seat !== null
    );

    if (seats.length !== data.seats.length) {
      return { success: false, error: "Certains sièges n'existent pas" };
    }

    // Vérifier les réservations existantes
    const existingBookings = await prisma.booking.findMany({
      where: {
        showtimeId: data.showtimeId,
        seatId: {
          in: seats.map((seat) => seat.id),
        },
      },
    });

    if (existingBookings.length > 0) {
      return { success: false, error: "Certains sièges sont déjà réservés" };
    }

    // Préparer les données du QR code
    const qrCodeData = {
      cinema: {
        name: showtime.Screen.Cinema.name,
        city: showtime.Screen.Cinema.Address.city,
      },
      screen: {
        number: showtime.Screen.number,
      },
      movie: {
        title: showtime.Movie.title,
      },
      showtime: {
        id: showtime.id,
        startTime: format(new Date(showtime.startTime), "d MMMM yyyy 'à' HH:mm", {
          locale: fr,
        }),
      },
      seats: seats.map(seat => ({
        id: seat.id,
        label: `${String.fromCharCode(64 + seat.row)}${seat.column}`
      })),
    };

    console.log('Debug - QR Code Data:', qrCodeData);

    // Créer le QR code
    let qrCodeUrl: string;
    try {
      qrCodeUrl = await new Promise<string>((resolve, reject) => {
        QRCode.toDataURL(JSON.stringify(qrCodeData), (err, url) => {
          if (err) reject(err);
          else resolve(url);
        });
      });
    } catch (error) {
      console.error('Erreur lors de la création du QR code:', error);
      qrCodeUrl = 'ERROR_GENERATING_QR';
    }

    try {
      // Créer d'abord le ticket
      const ticket = await prisma.ticket.create({
        data: {
          uid: authData.userId,
          paymentIntentId: data.paymentIntentId,
          qrCode: qrCodeUrl,
        },
      });

      console.log('Debug - Ticket créé:', ticket);

      // Créer ensuite les réservations
      const bookings = await Promise.all(
        seats.map(async (seat) => {
          const seatId = `${String.fromCharCode(64 + seat.row)}${seat.column}`;
          const discount = data.discounts.find(d => d.seatId === seatId);
          const discountAmount = discount?.discountId ? await getDiscountAmount(discount.discountId) : 0;
          const priceInEuros = basePrice - discountAmount;
          const priceInCents = Math.round(priceInEuros * 100);

          return prisma.booking.create({
            data: {
              userId: authData.userId,
              showtimeId: data.showtimeId,
              seatId: seat.id,
              pricePaid: priceInCents,
              ticketId: ticket.id,
              discountId: discount?.discountId
            },
          });
        })
      );

      console.log('Debug - Réservations créées:', bookings);

      return { success: true, data: { ticket, bookings } };
    } catch (error) {
      console.error('Debug - Erreur lors de la création:', error);
      return { success: false, error: error instanceof Error ? error.message : "Une erreur est survenue" };
    }
  } catch (error) {
    console.error("Debug - Erreur complète:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Une erreur est survenue" };
  }
}

export async function notifySelectedSeats(showtimeId: number, seats: string[]) {
  try {
    // Supprimer l'ancienne sélection pour cet utilisateur
    await prisma.temporarySelection.deleteMany({
      where: {
        showtimeId,
        createdAt: {
          lt: new Date(Date.now() - 5 * 60 * 1000),
        },
      },
    });

    // Créer la nouvelle sélection
    await prisma.temporarySelection.create({
      data: {
        showtimeId,
        seats,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    revalidatePath("/reservation");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la notification des sièges:", error);
    return { success: false };
  }
}

export async function getSelectedSeats(showtimeId: number) {
  try {
    // Nettoyer les sélections expirées
    await prisma.temporarySelection.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    // 1. Récupérer les sièges temporairement sélectionnés
    const temporarySelections = await prisma.temporarySelection.findMany({
      where: {
        showtimeId,
      },
    });

    // 2. Récupérer les sièges déjà réservés
    const bookedSeats = await prisma.booking.findMany({
      where: {
        showtimeId,
      },
      include: {
        Seat: true,
      },
    });

    // Combiner les sièges temporaires et réservés
    const temporarySeats = temporarySelections.flatMap((s) => s.seats);
    const reservedSeats = bookedSeats.map(
      (booking) =>
        `${String.fromCharCode(65 + booking.Seat.row)}${booking.Seat.column}`
    );

    return {
      success: true,
      seats: [...new Set([...temporarySeats, ...reservedSeats])],
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des sièges:", error);
    return { success: false, seats: [] };
  }
}

export async function getScreenConfiguration(screenId: number) {
  try {
    const seats = await prisma.seat.findMany({
      where: {
        screenId: screenId,
      },
      orderBy: [{ row: "asc" }, { column: "asc" }],
    });

    // Calculer les dimensions de la salle
    const maxRow = Math.max(...seats.map((s) => s.row));
    const maxColumn = Math.max(...seats.map((s) => s.column));

    return {
      success: true,
      data: {
        seats: seats,
        dimensions: {
          rows: maxRow,
          columns: maxColumn,
        },
      },
    };
  } catch (error) {
    console.error("Erreur lors de la récupération de la configuration:", error);
    return {
      success: false,
      error: "Impossible de récupérer la configuration de la salle",
    };
  }
}
