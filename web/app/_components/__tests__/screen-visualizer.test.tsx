import { render, screen, fireEvent } from "@testing-library/react";
import { ScreenVisualizer } from "../seatVisualizer";

// Mock des données de test
const mockSeats = [
  { row: 1, column: 1, identifier: "A1", isHandicap: false },
  { row: 1, column: 2, identifier: "A2", isHandicap: true },
  { row: 2, column: 1, identifier: "B1", isHandicap: false },
  { row: 2, column: 2, identifier: "B2", isHandicap: false },
];

describe("ScreenVisualizer Component", () => {
  const mockOnSeatSelect = jest.fn();
  const defaultProps = {
    seats: mockSeats,
    selectedSeats: [],
    bookedSeats: [],
    onSeatSelect: mockOnSeatSelect,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("rend tous les sièges", () => {
    render(<ScreenVisualizer {...defaultProps} />);
    
    mockSeats.forEach(seat => {
      expect(screen.getByText(seat.identifier)).toBeInTheDocument();
    });
  });

  it("rend l'écran", () => {
    render(<ScreenVisualizer {...defaultProps} />);
    expect(screen.getByText("Écran")).toBeInTheDocument();
  });

  it("rend la légende", () => {
    render(<ScreenVisualizer {...defaultProps} />);
    expect(screen.getByText("Non disponible")).toBeInTheDocument();
    expect(screen.getByText("PMR")).toBeInTheDocument();
  });

  it("applique les styles PMR aux sièges handicapés", () => {
    render(<ScreenVisualizer {...defaultProps} />);
    const handicapSeat = screen.getByTitle("Siège A2 (PMR)");
    expect(handicapSeat).toHaveClass("text-blue-500");
  });

  it("applique les styles aux sièges sélectionnés", () => {
    render(
      <ScreenVisualizer
        {...defaultProps}
        selectedSeats={["A1"]}
      />
    );
    const selectedSeat = screen.getByTitle("Siège A1");
    expect(selectedSeat).toHaveClass("text-primary");
  });

  it("applique les styles aux sièges réservés", () => {
    render(
      <ScreenVisualizer
        {...defaultProps}
        bookedSeats={["B1"]}
      />
    );
    const bookedSeat = screen.getByTitle("Siège B1 - Non disponible");
    expect(bookedSeat).toHaveClass("cursor-not-allowed", "opacity-50");
  });

  it("appelle onSeatSelect lors du clic sur un siège disponible", () => {
    render(<ScreenVisualizer {...defaultProps} />);
    const seat = screen.getByTitle("Siège A1");
    
    fireEvent.click(seat);
    
    expect(mockOnSeatSelect).toHaveBeenCalledWith({
      identifier: "A1",
      isHandicap: false,
    });
  });

  it("n'appelle pas onSeatSelect lors du clic sur un siège réservé", () => {
    render(
      <ScreenVisualizer
        {...defaultProps}
        bookedSeats={["A1"]}
      />
    );
    const bookedSeat = screen.getByTitle("Siège A1 - Non disponible");
    
    fireEvent.click(bookedSeat);
    
    expect(mockOnSeatSelect).not.toHaveBeenCalled();
  });

  it("calcule correctement la grille en fonction du nombre de sièges", () => {
    render(<ScreenVisualizer {...defaultProps} />);
    const grid = document.querySelector(".grid");
    
    expect(grid).toHaveStyle({
      gridTemplateRows: "repeat(2, 1fr)",
      gridTemplateColumns: "repeat(2, 1fr)",
    });
  });
}); 