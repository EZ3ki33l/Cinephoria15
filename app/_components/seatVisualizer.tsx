import React from "react";
import { Armchair } from "lucide-react";

type ScreenVisualizerProps = {
  rows: number;
  columns: number;
  handicapSeats: number; // Nombre de sièges handicapés sur la première rangée
};

export const ScreenVisualizer: React.FC<ScreenVisualizerProps> = ({
  rows,
  columns,
  handicapSeats,
}) => {
  const generateSeats = () => {
    const seats = [];
    for (let row = 0; row < rows; row++) {
      for (let column = 1; column <= columns; column++) {
        seats.push({
          row,
          column,
          identifier: `${String.fromCharCode(65 + row)}${column}`, // Ex: A1, B2
          isHandicap: row === 0 && column <= handicapSeats, // 1ère rangée (A), colonnes handicapées
        });
      }
    }
    return seats.reverse(); // Inverse l'ordre pour mettre A en bas
  };

  const seats = generateSeats();

  return (
    <div className="flex flex-col items-center gap-4 mt-4">
      {/* Grille des sièges */}
      <div
        className="relative"
        style={{
          width: `${columns * 2.5}rem`,
        }}
      >
        <div
          className="grid gap-2"
          style={{
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
          }}
        >
          {seats.map((seat, index) => (
            <div
              key={index}
              className={`flex items-center justify-center text-sm ${
                seat.isHandicap ? "text-blue-500" : "text-gray-700"
              }`}
              title={`Siège ${seat.identifier}`}
            >
              <div className="flex flex-col items-center">
                <Armchair size={20} />
                <span className="text-xs mt-1">{seat.identifier}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Écran noir en bas */}
      <div className="w-full h-8 bg-black text-center text-white font-bold mt-4">
        Écran
      </div>
    </div>
  );
};
