import React from "react";
import { Armchair } from "lucide-react";
import { cn } from "@/lib/utils";

interface Seat {
  row: number;
  column: number;
  identifier: string;
  isHandicap: boolean;
}

interface ScreenVisualizerProps {
  seats: Seat[];
  selectedSeats: string[];
  bookedSeats: string[];
  onSeatSelect: (seat: { identifier: string; isHandicap: boolean }) => void;
}

export const ScreenVisualizer: React.FC<ScreenVisualizerProps> = ({
  seats,
  selectedSeats,
  bookedSeats,
  onSeatSelect,
}) => {
  // Calculer le nombre de colonnes et de rangées
  const maxColumn = Math.max(...seats.map(seat => seat.column));
  const maxRow = Math.max(...seats.map(seat => seat.row));

  return (
    <div className="flex flex-col items-center gap-4 mt-4">
      <div className="relative" style={{ width: `${maxColumn * 2.5}rem` }}>
        <div
          className="grid gap-2"
          style={{
            gridTemplateRows: `repeat(${maxRow}, 1fr)`,
            gridTemplateColumns: `repeat(${maxColumn}, 1fr)`,
          }}
        >
          {seats.map((seat) => {
            const isBooked = bookedSeats.includes(seat.identifier);
            return (
              <div
                key={seat.identifier}
                onClick={() => !isBooked && onSeatSelect(seat)}
                className={cn(
                  "flex items-center justify-center text-sm transition-colors",
                  isBooked 
                    ? "cursor-not-allowed opacity-50 bg-gray-100" 
                    : "cursor-pointer",
                  seat.isHandicap ? "text-blue-500" : "text-gray-700",
                  selectedSeats.includes(seat.identifier) && "text-primary"
                )}
                title={`Siège ${seat.identifier}${
                  seat.isHandicap ? " (PMR)" : ""
                }${isBooked ? " - Non disponible" : ""}`}
              >
                <div className="flex flex-col items-center">
                  <Armchair
                    size={20}
                    className={cn(
                      "transition-transform",
                      !isBooked && "hover:scale-110",
                      selectedSeats.includes(seat.identifier) && "fill-primary",
                      isBooked && "fill-gray-400"
                    )}
                  />
                  <span className="text-xs mt-1">{seat.identifier}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full h-8 bg-black text-center text-white font-bold mt-4">
        Écran
      </div>

      <div className="flex gap-4 text-sm mt-2">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-gray-100 rounded-sm border border-gray-300"></div>
          <span>Non disponible</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 text-blue-500">
            <Armchair size={16} />
          </div>
          <span>PMR</span>
        </div>
      </div>
    </div>
  );
};
