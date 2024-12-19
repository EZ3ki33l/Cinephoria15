import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScreenVisualizer } from "@/app/_components/seatVisualizer";
import { Button } from "@/app/_components/_layout/button";

interface SeatSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  showtime: {
    id: number;
    screen: {
      number: number;
    };
  };
  onSeatSelect: (seatId: string) => void;
}

export function SeatSelectionModal({
  isOpen,
  onClose,
  showtime,
  onSeatSelect,
}: SeatSelectionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            Sélectionnez votre siège - Salle {showtime.screen.number}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <ScreenVisualizer
            rows={8}
            columns={10}
            handicapSeats={2}
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={() => onSeatSelect("A1")}>
            Confirmer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 