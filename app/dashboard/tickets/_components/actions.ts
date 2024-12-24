"use server";

import { prisma } from "@/db/db";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

export async function getUserTickets() {
  const { userId } = await auth();
  if (!userId) throw new Error("Non autorisé");

  const tickets = await prisma.ticket.findMany({
    where: {
      uid: userId,
    },
    include: {
      Booking: {
        include: {
          Seat: true,
          Showtime: {
            include: {
              Movie: true,
              Screen: {
                include: {
                  Cinema: {
                    include: {
                      Address: true
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  return tickets;
}

export async function cancelTicket(ticketId: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Non autorisé");

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      Booking: {
        include: {
          Showtime: true,
        },
      },
    },
  });

  if (!ticket) throw new Error("Ticket non trouvé");
  if (ticket.uid !== userId) throw new Error("Non autorisé");

  // Vérifier toutes les séances
  const now = new Date();
  const allShowtimes = ticket.Booking.map(booking => {
    const showtime = new Date(booking.Showtime.startTime);
    return {
      id: booking.Showtime.id,
      hoursDifference: (showtime.getTime() - now.getTime()) / (1000 * 60 * 60)
    };
  });

  const allAreRefundable = allShowtimes.every(st => st.hoursDifference > 24);
  let refundStatus = false;

  // Remboursement si possible
  if (ticket.paymentIntentId && allAreRefundable) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        ticket.paymentIntentId
      );

      const refund = await stripe.refunds.create({
        payment_intent: ticket.paymentIntentId,
        amount: paymentIntent.amount,
      });

      if (refund.status === 'succeeded') {
        refundStatus = true;
      }
    } catch (error) {
      console.error("Erreur lors du remboursement:", error);
      throw new Error("Erreur lors du remboursement");
    }
  }

  // Supprimer toutes les réservations avant de supprimer le ticket
  await prisma.$transaction([
    ...ticket.Booking.map(booking => 
      prisma.booking.delete({
        where: { id: booking.id }
      })
    ),
    prisma.ticket.delete({
      where: { id: ticketId }
    })
  ]);

  return { 
    success: true,
    isRefundable: allAreRefundable,
    refundProcessed: refundStatus
  };
} 