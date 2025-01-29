'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { fr } from "date-fns/locale";
import { format } from "date-fns";
import { Button } from "@/app/_components/_layout/button";
import { getShowtimesByScreen } from "../../reservation/_components/action";
import { Spinner } from "@/app/_components/_layout/spinner";
import { SeatSelectionModal } from "../../reservation/_components/SeatSelectionModal";
import { useAuth } from "@clerk/nextjs";
import { LoginDialog } from "@/app/_components/LoginDialog";
import { CinemaSelector } from "@/app/_components/CinemaSelector";
import { getUserFavoriteCinema } from "@/app/_actions/user";
import { getAllCinemas } from "@/app/_components/_maps copy/_components/getAllCinemas";
import { createCheckoutSession } from "../../reservation/_components/action";
import { getStripe } from "@/app/config/stripe";
import { createBooking } from "../../reservation/_components/action";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  movieId: number;
  movieTitle: string;
  cinemaId?: number | null;
}

type Step = 'selection' | 'payment' | 'confirmation' | 'error';

interface Screen {
  id: number;
  number: number;
  price: number;
}

interface Showtime {
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

export function BookingModal({ isOpen, onClose, movieId, movieTitle }: BookingModalProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [showSeatSelection, setShowSeatSelection] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [modalStep, setModalStep] = useState<Step>('selection');
  const { userId, isSignedIn } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [selectedCinemaId, setSelectedCinemaId] = useState<number | null>(null);
  const [cinemas, setCinemas] = useState<any[]>([]);

  useEffect(() => {
    async function loadFavoriteCinema() {
      const cinemaId = await getUserFavoriteCinema();
      if (typeof cinemaId === 'number') {
        setSelectedCinemaId(cinemaId);
      }
    }
    loadFavoriteCinema();
  }, []);

  useEffect(() => {
    async function loadCinemas() {
      const fetchedCinemas = await getAllCinemas();
      setCinemas(fetchedCinemas);
    }
    loadCinemas();
  }, []);

  useEffect(() => {
    if (isOpen && selectedCinemaId) {
      setLoading(true);
      const timer = setTimeout(() => {
        loadShowtimes();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, selectedCinemaId, date]);

  const loadShowtimes = async () => {
    if (!selectedCinemaId) return;
    
    try {
      const result = await getShowtimesByScreen(selectedCinemaId, date);
      if (result.success && result.data) {
        const filteredShowtimes = result.data.flatMap(screen => 
          screen.showtimes.filter(showtime => showtime.Movie.id === movieId)
        );
        setShowtimes(filteredShowtimes);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des séances:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeatSelect = (seatIds: string[]) => {
    if (!isSignedIn) {
      setShowLoginDialog(true);
      return;
    }
    setSelectedSeats(seatIds);
    setModalStep('payment');
  };

  const isShowtimeDisabled = (showtimeDate: Date) => {
    const now = new Date();
    const selectedDate = new Date(date);
    
    if (selectedDate > now) return false;
    
    if (selectedDate.toDateString() === now.toDateString()) {
      return showtimeDate < now;
    }
    
    return true;
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      setLoading(true);
    }
  };

  if (showLoginDialog) {
    return <LoginDialog isOpen={showLoginDialog} onClose={() => setShowLoginDialog(false)} />;
  }

  if (showSeatSelection && selectedShowtime) {
    return (
      <SeatSelectionModal
        isOpen={showSeatSelection}
        onClose={() => {
          setShowSeatSelection(false);
          setSelectedShowtime(null);
          setModalStep('selection');
        }}
        showtime={{
          id: selectedShowtime.id,
          screen: {
            id: selectedShowtime.screen.id,
            number: selectedShowtime.screen.number,
            price: selectedShowtime.screen.price
          }
        }}
        onSeatSelect={handleSeatSelect}
        bookedSeats={[]}
        currentStep={modalStep}
        onStepChange={setModalStep}
      />
    );
  }

  if (modalStep === 'payment' && selectedSeats.length > 0 && selectedShowtime) {
    const seatPrice = selectedShowtime.screen.price;
    const total = selectedSeats.length * seatPrice;
    
    return (
      <Dialog open={true} onOpenChange={() => setModalStep('selection')}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Paiement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Nombre de places sélectionnées : {selectedSeats.length}</p>
            <p>Prix par place : {seatPrice}€</p>
            <p>Total : {total}€</p>
            <Button
              onClick={async () => {
                try {
                  const checkoutResult = await createCheckoutSession({
                    seats: selectedSeats,
                    totalAmount: selectedSeats.length * seatPrice,
                    showtimeId: selectedShowtime.id,
                    discounts: []
                  });

                  if (!checkoutResult.success || !checkoutResult.clientSecret) {
                    throw new Error(checkoutResult.error || "Échec de la création de la session de paiement");
                  }

                  const result = await createBooking({
                    showtimeId: selectedShowtime.id,
                    seats: selectedSeats,
                    totalAmount: selectedSeats.length * seatPrice,
                    discounts: [],
                    paymentIntentId: checkoutResult.clientSecret.split('_secret_')[0]
                  });

                  if (!result.success) {
                    throw new Error(result.error || "Échec de la création de la réservation");
                  }

                  const stripe = await getStripe();
                  await stripe.confirmPayment({
                    clientSecret: checkoutResult.clientSecret,
                    confirmParams: {
                      return_url: window.location.origin + '/payment/success',
                      payment_method: 'card'
                    }
                  });
                } catch (error) {
                  console.error("Erreur lors de la création de la réservation:", error);
                  setModalStep('error');
                }
              }}
              variant="secondary"
            >
              Payer {total}€
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Réserver pour {movieTitle}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div>
            <h3 className="mb-2 font-medium">Choisissez un cinéma :</h3>
            <CinemaSelector
              cinemas={cinemas}
              currentCinemaId={selectedCinemaId}
              onSelect={setSelectedCinemaId}
            />
          </div>

          <div>
            <h3 className="mb-2 font-medium">Choisissez une date :</h3>
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              locale={fr}
              disabled={{ before: new Date() }}
              className="rounded-md border"
            />
          </div>

          {!selectedCinemaId ? (
            <div className="text-center text-muted-foreground">
              Veuillez d'abord sélectionner un cinéma
            </div>
          ) : loading ? (
            <div className="flex justify-center">
              <Spinner size="large" />
            </div>
          ) : showtimes.length === 0 ? (
            <div className="text-center text-muted-foreground">
              Aucune séance disponible à cette date
            </div>
          ) : (
            <div className="grid gap-2">
              <h3 className="font-medium">Séances disponibles :</h3>
              <div className="grid grid-cols-3 gap-2">
                {showtimes.map((showtime) => {
                  const showtimeDate = new Date(showtime.startTime);
                  const isDisabled = isShowtimeDisabled(showtimeDate);

                  return (
                    <Button
                      key={showtime.id}
                      variant="outline"
                      disabled={isDisabled}
                      className={isDisabled ? "opacity-50" : ""}
                      onClick={() => {
                        if (!isDisabled) {
                          setSelectedShowtime(showtime);
                          setShowSeatSelection(true);
                        }
                      }}
                    >
                      {format(showtimeDate, 'HH:mm')}
                      <span className="ml-2 text-sm text-muted-foreground">
                        Salle {showtime.screen.number}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 