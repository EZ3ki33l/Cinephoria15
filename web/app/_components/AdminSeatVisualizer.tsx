import React from "react";
import { Armchair } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminScreenVisualizerProps = {
  rows: number;
  columns: number;
};

export const AdminScreenVisualizer: React.FC<AdminScreenVisualizerProps> = ({
  rows,
  columns,
}) => {
  // Calcul du nombre de sièges PMR
  const calculateHandicapSeats = (totalSeats: number): number => {
    // Si le nombre total de sièges est >= 200, on prend 8%, sinon 5%
    const percentage = totalSeats >= 200 ? 0.08 : 0.05;
    const handicapSeats = Math.ceil(totalSeats * percentage);
    return Math.max(handicapSeats, 4); // Minimum 4 sièges
  };

  const generateSeats = () => {
    const seats = [];
    const totalSeats = rows * columns;
    const handicapSeatsCount = calculateHandicapSeats(totalSeats);
    
    // Calcul du nombre de sièges PMR par côté par rangée
    const seatsPerSide = Math.ceil(handicapSeatsCount / 4); // Divise par 4 car 2 côtés * 2 rangées

    for (let row = 0; row < rows; row++) {
      for (let column = 1; column <= columns; column++) {
        // Vérifie si le siège est PMR :
        // - Dans les deux premières rangées (row === 0 ou row === 1)
        // - Et soit dans les premiers sièges (column <= seatsPerSide)
        // - Ou dans les derniers sièges (column > columns - seatsPerSide)
        const isHandicap = 
          (row === 0 || row === 1) && 
          (column <= seatsPerSide || column > columns - seatsPerSide);

        seats.push({
          row,
          column,
          identifier: `${String.fromCharCode(65 + row)}${column}`,
          isHandicap,
        });
      }
    }
    return seats.reverse();
  };

  const seats = generateSeats();
  const totalSeats = rows * columns;
  const handicapSeatsCount = calculateHandicapSeats(totalSeats);

  return (
    <div className="flex flex-col items-center gap-4 mt-4">
      <div className="relative" style={{ width: `${columns * 2.5}rem` }}>
        <div
          className="grid gap-2"
          style={{
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
          }}
        >
          {seats.map((seat) => (
            <div
              key={seat.identifier}
              className={cn(
                "flex items-center justify-center text-sm",
                seat.isHandicap ? "text-blue-500" : "text-gray-700"
              )}
              title={`Siège ${seat.identifier}${seat.isHandicap ? " (PMR)" : ""}`}
            >
              <div className="flex flex-col items-center">
                <Armchair 
                  size={20} 
                  className={cn(
                    seat.isHandicap && "fill-blue-500"
                  )}
                />
                <span className="text-xs mt-1">{seat.identifier}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full h-8 bg-black text-center text-white font-bold mt-4">
        Écran
      </div>

      <div className="flex gap-4 text-sm mt-2">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 text-blue-500">
            <Armchair size={16} className="fill-blue-500" />
          </div>
          <span>PMR ({handicapSeatsCount} sièges)</span>
        </div>
      </div>
    </div>
  );
}; 