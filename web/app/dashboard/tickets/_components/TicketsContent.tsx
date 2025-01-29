"use client";

import { useEffect, useState } from "react";
import { getUserTickets, cancelTicket } from "./actions";
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
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { QrCode } from "lucide-react";
import { TicketsPageSkeleton } from "@/app/_components/skeletons";

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

export function TicketsContent() {
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

  const formatDate = (date: Date | string) => {
    try {
      // Si la date est déjà un objet Date
      if (date instanceof Date) {
        return {
          date: format(date, "d MMMM yyyy", { locale: fr }),
          time: format(date, "HH:mm", { locale: fr })
        };
      }
      
      // Si la date est une chaîne, essayer de la parser
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        // Si le parsing échoue, essayer de parser avec parseISO
        const isoParsedDate = parseISO(date);
        return {
          date: format(isoParsedDate, "d MMMM yyyy", { locale: fr }),
          time: format(isoParsedDate, "HH:mm", { locale: fr })
        };
      }
      
      return {
        date: format(parsedDate, "d MMMM yyyy", { locale: fr }),
        time: format(parsedDate, "HH:mm", { locale: fr })
      };
    } catch (error) {
      console.error("Erreur de formatage de date:", error, "Date reçue:", date);
      return { date: "Date invalide", time: "--:--" };
    }
  };

  const isUpcoming = (date: Date | string) => {
    try {
      const now = new Date();
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.getTime() > now.getTime();
    } catch {
      return false;
    }
  };

  const is24HoursBefore = (date: Date | string) => {
    try {
      const now = new Date();
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      const hoursDifference = (dateObj.getTime() - now.getTime()) / (1000 * 60 * 60);
      return hoursDifference > 24;
    } catch {
      return false;
    }
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

  if (isLoading) {
    return <TicketsPageSkeleton />;
  }

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] bg-gradient-to-b from-primary-light/20 to-transparent">
        <AuroraBackground>
          <motion.div
            initial={{ opacity: 0.0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="relative flex flex-col gap-4 items-center justify-center h-full px-4"
          >
            <div className="text-xl md:text-3xl font-bold dark:text-white text-center">
              Gérez vos réservations
            </div>
            <div className="font-extralight text-base md:text-xl dark:text-neutral-200">
              Retrouvez ici l'ensemble de vos tickets et gérez vos réservations
            </div>
          </motion.div>
        </AuroraBackground>
      </div>

      <div className="mx-auto w-full px-4 py-16 space-y-8">
        {/* Filtres */}
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Button variant="outline" size="lg">
              Séances à venir ({upcomingTickets.length})
            </Button>
            <Button variant="outline" size="lg">
              Historique ({pastTickets.length})
            </Button>
          </div>
          <Button variant="outline" size="lg" onClick={loadTickets}>
            Actualiser
          </Button>
        </div>

        {/* Liste des tickets */}
        <div className="grid gap-6">
          {upcomingTickets.map((ticket) => (
            <div key={ticket.id} className="border rounded-xl p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Image du film */}
                <div className="h-[200px] w-[150px] rounded-lg bg-muted" />

                {/* Informations */}
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">
                        {ticket.Booking[0].Showtime.Movie.title}
                      </h3>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-muted rounded-full text-sm">
                          {ticket.Booking[0].Showtime.Screen.Cinema.name}
                        </span>
                        <span className="px-3 py-1 bg-muted rounded-full text-sm">
                          {ticket.Booking[0].Showtime.Screen.Cinema.Address.city}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">Date</span>
                      <p className="font-medium">
                        {formatDate(ticket.Booking[0].Showtime.startTime).date}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">Heure</span>
                      <p className="font-medium">
                        {formatDate(ticket.Booking[0].Showtime.startTime).time}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">Salle</span>
                      <p className="font-medium">
                        N°{ticket.Booking[0].Showtime.Screen.number}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">Sièges</span>
                      <p className="font-medium">
                        {ticket.Booking.map(booking => 
                          `${String.fromCharCode(64 + booking.Seat.row)}${booking.Seat.column}`
                        ).join(", ")}
                      </p>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="flex items-center gap-4 mt-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-2">
                          <QrCode className="h-4 w-4" />
                          Voir QR Code
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
              </div>
            </div>
          ))}

          {/* Historique */}
          {pastTickets.map((ticket) => (
            <div key={ticket.id} className="border rounded-xl p-6 opacity-70">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Image du film */}
                <div className="h-[200px] w-[150px] rounded-lg bg-muted" />

                {/* Informations */}
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">
                        {ticket.Booking[0].Showtime.Movie.title}
                      </h3>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-muted rounded-full text-sm">
                          {ticket.Booking[0].Showtime.Screen.Cinema.name}
                        </span>
                        <span className="px-3 py-1 bg-muted rounded-full text-sm">
                          {ticket.Booking[0].Showtime.Screen.Cinema.Address.city}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {ticket.Booking[0].Showtime.status === 'ANNULE' ? 'Annulé' : 'Terminé'}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">Date</span>
                      <p className="font-medium">
                        {formatDate(ticket.Booking[0].Showtime.startTime).date}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">Heure</span>
                      <p className="font-medium">
                        {formatDate(ticket.Booking[0].Showtime.startTime).time}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">Salle</span>
                      <p className="font-medium">
                        N°{ticket.Booking[0].Showtime.Screen.number}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">Sièges</span>
                      <p className="font-medium">
                        {ticket.Booking.map(booking => 
                          `${String.fromCharCode(64 + booking.Seat.row)}${booking.Seat.column}`
                        ).join(", ")}
                      </p>
                    </div>
                  </div>
                </div>
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