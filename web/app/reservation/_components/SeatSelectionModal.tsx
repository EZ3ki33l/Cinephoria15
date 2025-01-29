"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScreenVisualizer } from "@/app/_components/seatVisualizer";
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@clerk/nextjs";
import { LoginDialog } from "@/app/_components/LoginDialog";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { getStripe } from "@/app/config/stripe";
import { TouchScrollContainer } from "@/app/_components/TouchScrollContainer";
import { RoundedLogo } from "@/app/_components/_layout/logo";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "react-use";
import {
  createBooking,
  createCheckoutSession,
  getSelectedSeats,
  notifySelectedSeats,
  getScreenConfiguration,
  getActivePromotions
} from "./action";
import { Button } from "@/app/_components/_layout/button";

interface Seat {
  id: number;
  screenId: number;
  row: number;
  column: number;
  isHandicap: boolean;
}

interface SeatDiscount {
  seatId: string;
  type: string;
  discountId?: number;
}

interface Discount {
  id: number;
  name: string;
  amount: number;
  isActive: boolean;
  isRecurrent: boolean;
  startDate: Date | null;
  endDate: Date | null;
}

interface SeatSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  showtime: {
    id: number;
    screen: {
      id: number;
      number: number;
      price: number;
    };
  };
  onSeatSelect: (seatIds: string[]) => void;
  bookedSeats?: string[];
  onStepChange: (step: Step) => void;
  currentStep: Step;
}

// Composant pour le formulaire de paiement
function CheckoutForm({
  onSuccess,
  onError,
  onCancel,
}: {
  onSuccess: () => void;
  onError: () => void;
  onCancel: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError("Le service de paiement n'est pas disponible.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { paymentIntent, error } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (error) {
        setError(error.message || "Une erreur est survenue");
        onError();
        return;
      }

      if (!paymentIntent) {
        setError("Erreur lors du paiement");
        onError();
        return;
      }

      // Attendre un court instant pour s'assurer que le paiement est traité
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (paymentIntent.status === "succeeded") {
        onSuccess();
      } else {
        setError(`Le paiement n'a pas été confirmé (status: ${paymentIntent.status})`);
        onError();
      }
    } catch (error: any) {
      console.error("Erreur de paiement:", error);
      setError(error?.message || "Une erreur est survenue lors du paiement");
      onError();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      <div className="flex justify-end gap-2 mt-4">
        <Button
          variant="outline"
          type="button"
          onClick={onCancel}
          disabled={isProcessing}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isProcessing}>
          {isProcessing ? "Traitement..." : "Payer"}
        </Button>
      </div>
    </form>
  );
}

type Step = "selection" | "payment" | "confirmation" | "error";

export function SeatSelectionModal({
  isOpen,
  onClose,
  showtime,
  onSeatSelect,
  bookedSeats = [],
  onStepChange,
  currentStep,
}: SeatSelectionModalProps) {
  console.log("SeatSelectionModal props:", {
    showtime,
    currentStep,
    price: showtime?.screen?.price
  });
  
  if (!showtime?.screen?.price) {
    console.error("Prix manquant dans les props du modal:", showtime);
    return null;
  }

  const { userId } = useAuth();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [showHandicapWarning, setShowHandicapWarning] = useState(false);
  const [seatDiscounts, setSeatDiscounts] = useState<SeatDiscount[]>([]);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [savedSelections, setSavedSelections] = useState<{
    seats: string[];
    discounts: SeatDiscount[];
  } | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const { width, height } = useWindowSize();
  const [temporaryBookedSeats, setTemporaryBookedSeats] = useState<string[]>(
    []
  );
  const [confirmationData, setConfirmationData] = useState<{
    seats: string[];
    total: number;
  } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [screenConfig, setScreenConfig] = useState<{
    seats: Seat[];
    dimensions: { rows: number; columns: number };
  } | null>(null);
  const [availableDiscounts, setAvailableDiscounts] = useState<Discount[]>([]);
  const [isLoadingDiscounts, setIsLoadingDiscounts] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Surveiller les changements d'authentification
  useEffect(() => {
    if (userId && savedSelections) {
      // Restaurer les sélections et rouvrir la modal
      setSelectedSeats(savedSelections.seats);
      setSeatDiscounts(savedSelections.discounts);
      setSavedSelections(null);
      setShowLoginDialog(false);
    }
  }, [userId]);

  // Réinitialiser l'état du paiement quand on ferme la modal
  useEffect(() => {
    if (!isOpen) {
      setPaymentStatus("idle");
      setClientSecret(null);
    }
  }, [isOpen]);

  // Charger la configuration au montage
  useEffect(() => {
    const loadScreenConfig = async () => {
      const config = await getScreenConfiguration(showtime.screen.id);
      if (config.success && config.data) {
        setScreenConfig(config.data);
      }
    };
    loadScreenConfig();
  }, [showtime.screen.id]);

  // Charger les promotions disponibles
  useEffect(() => {
    const fetchDiscounts = async () => {
      setIsLoadingDiscounts(true);
      try {
        const result = await getActivePromotions();
        if (result.success && result.data) {
          setAvailableDiscounts(result.data as Discount[]);
        } else {
          console.error(result.error);
          setAvailableDiscounts([]);
        }
      } catch (error) {
        console.error('Erreur:', error);
        setAvailableDiscounts([]);
      } finally {
        setIsLoadingDiscounts(false);
      }
    };

    fetchDiscounts();
  }, []);

  // Modifier generateSeats pour utiliser la configuration
  const generateSeats = () => {
    if (!screenConfig) return [];

    const seats = [];
    for (let row = 1; row <= screenConfig.dimensions.rows; row++) {
      for (
        let column = 1;
        column <= screenConfig.dimensions.columns;
        column++
      ) {
        const dbSeat = screenConfig.seats.find(
          (s) => s.row === row && s.column === column
        );
        if (dbSeat) {
          seats.push({
            row: dbSeat.row,
            column: dbSeat.column,
            identifier: `${String.fromCharCode(64 + dbSeat.row)}${
              dbSeat.column
            }`,
            isHandicap: dbSeat.isHandicap,
          });
        }
      }
    }
    return seats.reverse();
  };

  const seats = generateSeats();

  const handleSeatSelect = async (seat: {
    identifier: string;
    isHandicap: boolean;
  }) => {
    if (showLoginDialog) return;

    const isReservedByOthers =
      temporaryBookedSeats.includes(seat.identifier) &&
      !selectedSeats.includes(seat.identifier);

    if (isReservedByOthers) {
      return;
    }

    if (seat.isHandicap) {
      setShowHandicapWarning(true);
    }

    const newSelectedSeats = selectedSeats.includes(seat.identifier)
      ? selectedSeats.filter((id) => id !== seat.identifier)
      : [...selectedSeats, seat.identifier];

    setSelectedSeats(newSelectedSeats);

    setSeatDiscounts((prevDiscounts) => {
      const newDiscounts = prevDiscounts.filter(
        (d) => d.seatId !== seat.identifier
      );
      if (!selectedSeats.includes(seat.identifier) && seat.isHandicap) {
        const pmrDiscount = availableDiscounts.find(d => d.name.toLowerCase().includes('pmr'));
        if (pmrDiscount) {
          newDiscounts.push({
            seatId: seat.identifier,
            type: pmrDiscount.name,
            discountId: pmrDiscount.id
          });
        }
      }
      return newDiscounts;
    });

    if (selectedSeats.includes(seat.identifier) && seat.isHandicap) {
      const remainingPMRSeats = newSelectedSeats.filter((id) =>
        seats.find((s) => s.identifier === id && s.isHandicap)
      );
      if (remainingPMRSeats.length === 0) {
        setShowHandicapWarning(false);
      }
    }

    await notifySelectedSeats(showtime.id, newSelectedSeats);
  };

  const handleDiscountChange = (seatId: string, discountId: number | null) => {
    setSeatDiscounts((prev) => {
      if (!discountId) {
        return prev.filter((d) => d.seatId !== seatId);
      }
      const discount = availableDiscounts.find(d => d.id === discountId);
      if (!discount) return prev;
      
      const existing = prev.find((d) => d.seatId === seatId);
      if (existing) {
        return prev.map((d) => 
          d.seatId === seatId ? { ...d, type: discount.name, discountId: discountId } : d
        );
      }
      return [...prev, { seatId, type: discount.name, discountId: discountId }];
    });
  };

  const calculateTotal = () => {
    if (!showtime?.screen?.price) {
      console.error("Prix de base non défini:", showtime);
      return 0;
    }
    return selectedSeats.reduce((total, seatId) => {
      return total + calculateSeatPrice(seatId);
    }, 0);
  };

  const calculateSeatPrice = (seatId: string) => {
    if (!showtime?.screen?.price) {
      console.error("Prix de base non défini:", showtime);
      return 0;
    }
    const basePrice = showtime.screen.price;
    const discount = seatDiscounts.find((d) => d.seatId === seatId);
    if (!discount?.discountId) return basePrice;
    
    const discountInfo = availableDiscounts.find(d => d.id === discount.discountId);
    return basePrice - (discountInfo?.amount || 0);
  };

  // Ajouter une fonction pour vérifier si des réductions sont appliquées
  const hasDiscounts = () => {
    return seatDiscounts.some(
      (discount) => discount.type !== "discount"
    );
  };

  const checkSeatsAlignment = () => {
    if (selectedSeats.length <= 1)
      return { adjacent: true, sameRow: true, hasAvailableAdjacent: true };

    // Convertir les identifiants en objets avec rangée et numéro
    const seatPositions = selectedSeats.map((seatId) => ({
      row: seatId.charAt(0),
      number: parseInt(seatId.slice(1)),
    }));

    // Vérifier si les sièges sont dans la même rangée
    const sameRow = seatPositions.every(
      (seat) => seat.row === seatPositions[0].row
    );

    // Vérifier si les sièges sont adjacents
    const isAdjacent = seatPositions.every((seat) => {
      return seatPositions.some(
        (other) =>
          seat !== other &&
          Math.abs(seat.number - other.number) === 1 &&
          seat.row === other.row
      );
    });

    // Vérifier si des sièges adjacents sont disponibles
    const hasAvailableAdjacent = seatPositions.every((seat) => {
      const leftSeat = `${seat.row}${seat.number - 1}`;
      const rightSeat = `${seat.row}${seat.number + 1}`;
      const adjacentAvailable = [leftSeat, rightSeat].some(
        (adjacentId) =>
          !bookedSeats.includes(adjacentId) && // Pas déjà réservé
          !selectedSeats.includes(adjacentId) && // Pas déjà sélectionné
          seats.some((s) => s.identifier === adjacentId) // Existe dans la salle
      );
      return adjacentAvailable || isAdjacent;
    });

    return { adjacent: isAdjacent, sameRow, hasAvailableAdjacent };
  };

  const resetAllStates = () => {
    setSelectedSeats([]);
    setSeatDiscounts([]);
    setShowHandicapWarning(false);
    setPaymentStatus("idle");
    setClientSecret(null);
    setSavedSelections(null);
  };

  // Réinitialiser tous les états quand on ferme la modal
  useEffect(() => {
    if (!isOpen && !showLoginDialog) {
      resetAllStates();
    }
  }, [isOpen, showLoginDialog]);

  const handleConfirm = async () => {
    if (!userId) {
      setSavedSelections({
        seats: selectedSeats,
        discounts: seatDiscounts,
      });
      setShowLoginDialog(true);
      onClose();
      return;
    }

    try {
      const result = await createCheckoutSession({
        seats: selectedSeats,
        totalAmount: calculateTotal(),
        showtimeId: showtime.id,
        discounts: seatDiscounts
      });

      if (!result.success || !result.clientSecret) {
        console.error("Erreur lors de la création de la session:", result.error);
        onStepChange("error");
        return;
      }

      setClientSecret(result.clientSecret);
      onStepChange("payment");
    } catch (error) {
      console.error("Erreur lors de la création de la session:", error);
      onStepChange("error");
    }
  };

  const handlePaymentSuccess = async () => {
    if (!clientSecret) {
      console.error("Pas de client secret");
      onStepChange("error");
      return;
    }

    try {
      // Extraire l'ID du PaymentIntent du client secret
      const paymentIntentId = clientSecret.split('_secret_')[0];
      
      const bookingData = {
        showtimeId: showtime.id,
        seats: selectedSeats,
        totalAmount: calculateTotal(),
        discounts: seatDiscounts,
        paymentIntentId: paymentIntentId
      };

      const bookingResult = await createBooking(bookingData);
      if (!bookingResult) {
        throw new Error("Pas de réponse du serveur");
      }

      if (bookingResult.success) {
        setConfirmationData({
          seats: selectedSeats,
          total: calculateTotal(),
        });

        if (onSeatSelect) {
          onSeatSelect([...bookedSeats, ...selectedSeats]);
        }

        onStepChange("confirmation");
        setShowConfetti(true);
      } else {
        throw new Error(bookingResult.error || "Erreur inconnue");
      }
    } catch (error: any) {
      console.error(
        "Erreur lors de la création de la réservation:",
        error?.message || error
      );
      onStepChange("error");
    }
  };

  const getStepCount = () => {
    return 2; // Nombre total d'étapes (sélection, paiement)
  };

  const getCurrentStepIndex = () => {
    switch (currentStep) {
      case "selection":
        return 1;
      case "payment":
        return 2;
      case "confirmation":
        return 0; // Ne pas compter comme une étape à part entière
      default:
        return 0;
    }
  };

  const renderStepContent = () => {
    const totalSteps = getStepCount();
    const currentStepIndex = getCurrentStepIndex();

    switch (currentStep) {
      case "selection":
        const { adjacent, sameRow } = checkSeatsAlignment();
        const showSeatingAdvice =
          selectedSeats.length > 1 && (!adjacent || !sameRow);

        return (
          <>
            <DialogHeader className="sticky top-0 bg-white z-10 pb-4 pr-8">
              <DialogTitle className="flex items-center relative gap-10">
                <RoundedLogo size="small" />
                <div className="flex flex-col gap-y-2">
                  <div>
                    Étape {currentStepIndex} sur {totalSteps} - Sélectionnez
                    votre siège
                  </div>
                  <DialogDescription className="text-sm font-light text-gray-500">
                    Places sélectionnées : {selectedSeats.length}
                  </DialogDescription>
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 px-4">
              <div className="flex justify-center">
                <ScreenVisualizer
                  seats={seats}
                  selectedSeats={selectedSeats}
                  bookedSeats={[...bookedSeats, ...temporaryBookedSeats]}
                  onSeatSelect={handleSeatSelect}
                />
              </div>

              {selectedSeats.length > 0 && (
                <div className="space-y-4 mt-6">
                  {showSeatingAdvice && (
                    <Alert className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <AlertDescription>
                        Pour une meilleure expérience, nous vous conseillons de
                        choisir des places côte à côte.
                      </AlertDescription>
                    </Alert>
                  )}

                  {showHandicapWarning && (
                    <Alert
                      variant="warning"
                      className="bg-yellow-50 border-yellow-500 text-yellow-800 flex items-center gap-2"
                    >
                      <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                      <AlertDescription>
                        Ces places sont exclusivement réservées aux personnes à
                        mobilité réduite. Si vous n'êtes pas concerné, veuillez
                        sélectionner d'autres places.
                      </AlertDescription>
                    </Alert>
                  )}

                  <h3 className="font-medium">Réductions applicables</h3>
                  {selectedSeats.map((seatId) => {
                    const seat = seats.find(s => s.identifier === seatId);
                    const isPMR = seat?.isHandicap;
                    return (
                      <div key={seatId} className="flex items-center justify-between p-2 border-b">
                        <span>Siège {seatId}</span>
                        {isPMR ? (
                          <div className="text-sm text-gray-600">Tarif PMR appliqué</div>
                        ) : (
                          <Select
                            value={seatDiscounts.find((d) => d.seatId === seatId)?.discountId?.toString() || "none"}
                            onValueChange={(value) => handleDiscountChange(seatId, value === "none" ? null : parseInt(value))}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Sélectionner une réduction" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Tarif normal</SelectItem>
                              {availableDiscounts
                                .filter(discount => !discount.name.toLowerCase().includes('pmr'))
                                .map((discount) => (
                                  <SelectItem key={discount.id} value={discount.id.toString()}>
                                    {discount.name} (-{discount.amount}€)
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    );
                  })}

                  {hasDiscounts() && (
                    <Alert
                      variant="destructive"
                      className="flex items-center gap-2"
                    >
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <AlertDescription>
                        Un justificatif sera demandé à l'entrée du cinéma pour
                        toute place bénéficiant d'une réduction.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-white pt-4 mt-4 border-t p-4">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Prix total : {calculateTotal()}€
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={onClose}>
                    Annuler
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    disabled={selectedSeats.length === 0}
                  >
                    Passer au paiement
                  </Button>
                </div>
              </div>
            </div>
          </>
        );

      case "payment":
        return (
          <>
            <DialogHeader className="text-center">
              <div className="flex justify-center mb-4">
                <RoundedLogo size="small" />
              </div>
              <DialogTitle>
                Étape {currentStepIndex} sur {totalSteps} - Paiement Cinéphoria
              </DialogTitle>
              <DialogDescription>
                Montant total : {calculateTotal()}€
              </DialogDescription>
            </DialogHeader>
            <div className="w-full max-w-[425px] mx-auto">
              <Elements
                stripe={getStripe()}
                options={{
                  clientSecret: clientSecret || undefined,
                  appearance: { theme: "stripe" as const },
                  loader: "never",
                  locale: "fr",
                }}
              >
                <CheckoutForm
                  onSuccess={handlePaymentSuccess}
                  onError={() => onStepChange("error")}
                  onCancel={() => onStepChange("selection")}
                />
              </Elements>
            </div>
          </>
        );

      case "confirmation":
        if (!confirmationData) return null;

        return (
          <div className="relative">
            <DialogHeader>
              <div className="flex justify-center mb-4">
                <RoundedLogo size="small" />
              </div>
              <DialogTitle className="text-2xl font-bold text-green-600">
                Confirmation de votre réservation
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-6">
              <p className="font-medium">Votre réservation a été confirmée.</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Récapitulatif :</h3>
                <p>Places : {confirmationData.seats.join(", ")}</p>
                <p className="mt-2">
                  Montant total : {confirmationData.total}€
                </p>
              </div>
              <p className="text-sm text-gray-600">
                Un email de confirmation vous a été envoyé.
              </p>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleClose}>Fermer</Button>
            </div>
          </div>
        );

      case "error":
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-red-600">
                Paiement échoué
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-6">
              <p className="font-medium">
                Une erreur est survenue lors du paiement.
              </p>
              <p className="text-sm text-gray-600">
                Veuillez réessayer ou contacter le support si le problème
                persiste.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button
                onClick={async () => {
                  const result = await createCheckoutSession({
                    seats: selectedSeats,
                    totalAmount: calculateTotal(),
                    showtimeId: showtime.id,
                    discounts: seatDiscounts
                  });

                  if (result.success && result.clientSecret) {
                    setClientSecret(result.clientSecret);
                    onStepChange("payment");
                  } else {
                    console.error(
                      "Erreur lors de la création de la session:",
                      result.error
                    );
                  }
                }}
              >
                Réessayer
              </Button>
            </div>
          </>
        );
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const result = await getSelectedSeats(showtime.id);
      if (result.success) {
        // Filtrer pour exclure nos propres sélections des sièges temporairement réservés
        const otherBookedSeats = result.seats.filter(
          (seatId) => !selectedSeats.includes(seatId)
        );
        setTemporaryBookedSeats(otherBookedSeats);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [showtime.id, selectedSeats]);

  const handleClose = () => {
    if (currentStep === "confirmation") {
      resetAllStates();
      onStepChange("selection");
      onClose();
    } else if (currentStep === "selection") {
      onClose();
    }
    // Ne rien faire pour les autres étapes (payment et error)
  };

  return (
    <>
      {!showLoginDialog && (
        <Dialog
          open={isOpen}
          onOpenChange={(open) => {
            if (!open && currentStep === "selection") {
              handleClose();
            }
          }}
          modal
        >
          <DialogContent className="max-w-3xl overflow-hidden">
            {showConfetti && currentStep === "confirmation" && (
              <ReactConfetti
                width={width}
                height={height}
                recycle={false}
                numberOfPieces={200}
                onConfettiComplete={() => setShowConfetti(false)}
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                }}
              />
            )}
            <TouchScrollContainer className="max-h-[90vh] overflow-y-auto pr-6">
              {renderStepContent()}
            </TouchScrollContainer>
          </DialogContent>
        </Dialog>
      )}

      <LoginDialog
        isOpen={showLoginDialog}
        onClose={() => {
          setShowLoginDialog(false);
          if (!userId && savedSelections) {
            setSavedSelections(null);
          }
        }}
      />
    </>
  );
}
