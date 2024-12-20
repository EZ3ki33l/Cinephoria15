"use client";

import { useEffect, useState } from "react";
import { getUserTickets, cancelTicket } from "./_components/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { QrCode } from "lucide-react";

type Movie = {
  id: number;
  title: string;
  summary: string;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
  director: string;
  releaseDate: Date | null;
  trailer: string;
  images: string[];
  lovedByTeam: boolean | null;
};

type Ticket = {
  id: number;
  uid: string;
  paymentIntentId: string | null;
  qrCode: string | null;
  Booking: {
    id: number;
    pricePaid: number;
    Seat: {
      row: number;
      column: number;
    };
    Showtime: {
      id: number;
      startTime: Date;
      status: 'REPORTE' | 'ANNULE' | null;
      Movie: {
        title: string;
      };
      Screen: {
        number: number;
        Cinema: {
          name: string;
          Address: {
            city: string;
          };
        };
      };
    };
  }[];
};

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmationMessage, setConfirmationMessage] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedQRCode, setSelectedQRCode] = useState<string | null>(null);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const data = await getUserTickets();
      console.log("Tickets chargés :", data);
      setTickets(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des tickets");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelTicket = async (ticketId: number) => {
    try {
      const result = await cancelTicket(ticketId);
      if (result.success) {
        let message = "Votre demande d'annulation a bien été effectuée.";
        if (result.isRefundable && result.refundProcessed) {
          message += " Le remboursement a été initié et sera effectué selon les délais de votre banque (3 à 5 jours ouvrés).";
        } else if (!result.isRefundable) {
          message += " Aucun remboursement ne sera effectué, la séance étant dans moins de 24 heures.";
        }
        setConfirmationMessage(message);
        setShowConfirmation(true);
        loadTickets(); // Recharger la liste des tickets
      }
    } catch (error) {
      setConfirmationMessage("Une erreur est survenue lors de l'annulation.");
      setShowConfirmation(true);
    }
  };

  const isUpcoming = (date: Date) => {
    const now = new Date();
    const showtime = new Date(date);
    return showtime.getTime() > now.getTime();
  };

  const is24HoursBefore = (date: Date) => {
    const now = new Date();
    const showtime = new Date(date);
    const hoursDifference = (showtime.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursDifference > 24;
  };
  const upcomingTickets = tickets.filter(ticket => 
    ticket.Booking.some(booking => 
      isUpcoming(booking.Showtime.startTime) && booking.Showtime.status !== 'ANNULE'
    )
  );
  const pastTickets = tickets.filter(
    (ticket) => ticket.Booking.every(b => 
      !isUpcoming(b.Showtime.startTime) || b.Showtime.status === 'ANNULE'
    )
  );

  console.log("Tickets à venir :", upcomingTickets);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="flex flex-col">
      <AuroraBackground>
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="relative flex flex-col gap-4 items-center justify-center px-4"
        >
          <div className="text-xl md:text-3xl font-bold dark:text-white text-center">
            Gérez vos réservations
          </div>
          <div className="font-extralight text-base md:text-xl dark:text-neutral-200 py-4">
            Retrouvez ici l'ensemble de vos tickets et gérez vos réservations
          </div>
        </motion.div>
      </AuroraBackground>

      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Séances à venir</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {upcomingTickets.map((ticket) => (
            <div key={ticket.id} className="border p-4 rounded-lg">
              <div className="space-y-2">
                <h3 className="font-bold">{ticket.Booking[0].Showtime.Movie.title}</h3>
                <p>
                  {format(new Date(ticket.Booking[0].Showtime.startTime), "d MMMM yyyy 'à' HH:mm", {
                    locale: fr,
                  })}
                </p>
                <p className="text-sm">
                  Salle {ticket.Booking[0].Showtime.Screen.number}
                </p>
                <p className="text-sm">
                  Sièges : {ticket.Booking.map(booking => 
                    `${String.fromCharCode(64 + booking.Seat.row)}${booking.Seat.column}`
                  ).join(", ")}
                </p>
              </div>

              <div className="flex gap-2 mt-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <QrCode className="h-4 w-4" />
                      QR Code
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md flex flex-col items-center justify-center p-8">
                    <DialogTitle className="mb-4">QR Code de votre ticket</DialogTitle>
                    {ticket.qrCode && (
                      <Image
                        src={ticket.qrCode}
                        alt="QR Code du ticket"
                        width={250}
                        height={250}
                        className="rounded-lg"
                      />
                    )}
                  </DialogContent>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      Annuler
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {isUpcoming(ticket.Booking[0].Showtime.startTime) && is24HoursBefore(ticket.Booking[0].Showtime.startTime)
                          ? "Confirmation d'annulation"
                          : "⚠️ Attention : Annulation sans remboursement"}
                      </AlertDialogTitle>
                      <div className="space-y-4 text-sm text-muted-foreground">
                        {isUpcoming(ticket.Booking[0].Showtime.startTime) && is24HoursBefore(ticket.Booking[0].Showtime.startTime) ? (
                          <span>Une demande de remboursement va nous être envoyée.</span>
                        ) : (
                          <>
                            <span className="block font-semibold text-destructive">
                              Cette annulation ne donnera lieu à aucun remboursement car elle ne respecte pas les conditions d'annulation (24h avant la séance).
                            </span>
                            <span className="block">
                              Êtes-vous certain de vouloir annuler votre réservation ? Cette action est irréversible.
                            </span>
                          </>
                        )}
                      </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Retour</AlertDialogCancel>
                      <AlertDialogAction
                        className={!is24HoursBefore(ticket.Booking[0].Showtime.startTime) ? "bg-destructive hover:bg-destructive/90" : ""}
                        onClick={() => handleCancelTicket(ticket.id)}
                      >
                        {!is24HoursBefore(ticket.Booking[0].Showtime.startTime) 
                          ? "Je confirme l'annulation sans remboursement" 
                          : "Confirmer"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Historique</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pastTickets.map((ticket) => (
            <div key={ticket.id} className="border p-4 rounded-lg opacity-70">
              <div className="space-y-2">
                <h3 className="font-bold">{ticket.Booking[0].Showtime.Movie.title}</h3>
                <p>
                  {format(new Date(ticket.Booking[0].Showtime.startTime), "d MMMM yyyy 'à' HH:mm", {
                    locale: fr,
                  })}
                </p>
                <p className="text-sm">
                  Salle {ticket.Booking[0].Showtime.Screen.number}
                </p>
                <p className="text-sm">
                  Sièges : {ticket.Booking.map(booking => 
                    `${String.fromCharCode(64 + booking.Seat.row)}${booking.Seat.column}`
                  ).join(", ")}
                </p>
                <p className="text-sm mt-2">
                  {ticket.Booking[0].Showtime.status === 'ANNULE' ? 'Annulé' : 'Terminé'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alerte de confirmation */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmation</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmationMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowConfirmation(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
