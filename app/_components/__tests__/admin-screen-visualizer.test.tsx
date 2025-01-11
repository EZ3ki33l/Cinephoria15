import { render, screen } from "@testing-library/react";
import { AdminScreenVisualizer } from "../AdminSeatVisualizer";

describe("AdminScreenVisualizer Component", () => {
  it("rend correctement une petite salle avec le minimum de sièges PMR", () => {
    render(<AdminScreenVisualizer rows={5} columns={10} />);
    
    // 50 sièges au total, donc minimum 4 sièges PMR (5%)
    const pmrSeats = screen.getAllByTitle(/Siège [A-Z]\d+ \(PMR\)/);
    expect(pmrSeats).toHaveLength(4);
    
    // Vérifie que l'écran est rendu
    expect(screen.getByText("Écran")).toBeInTheDocument();
    
    // Vérifie que la légende PMR est correcte
    expect(screen.getByText("PMR (4 sièges)")).toBeInTheDocument();
  });

  it("rend correctement une grande salle avec 8% de sièges PMR", () => {
    render(<AdminScreenVisualizer rows={20} columns={10} />);
    
    // 200 sièges au total, donc 8% = 16 sièges PMR
    const pmrSeats = screen.getAllByTitle(/Siège [A-Z]\d+ \(PMR\)/);
    expect(pmrSeats).toHaveLength(16);
    
    expect(screen.getByText("PMR (16 sièges)")).toBeInTheDocument();
  });

  it("génère les identifiants de sièges correctement", () => {
    render(<AdminScreenVisualizer rows={2} columns={2} />);
    
    // Vérifie que les identifiants sont générés dans le bon ordre
    expect(screen.getByText("A1")).toBeInTheDocument();
    expect(screen.getByText("A2")).toBeInTheDocument();
    expect(screen.getByText("B1")).toBeInTheDocument();
    expect(screen.getByText("B2")).toBeInTheDocument();
  });

  it("applique les styles appropriés aux sièges PMR", () => {
    render(<AdminScreenVisualizer rows={2} columns={4} />);
    
    const pmrSeat = screen.getByTitle("Siège A1 (PMR)");
    expect(pmrSeat).toHaveClass("text-blue-500");
    
    const regularSeat = screen.getByTitle("Siège B2");
    expect(regularSeat).toHaveClass("text-gray-700");
  });

  it("calcule correctement la taille de la grille", () => {
    render(<AdminScreenVisualizer rows={3} columns={4} />);
    
    const grid = document.querySelector(".grid");
    expect(grid).toHaveStyle({
      gridTemplateRows: "repeat(3, 1fr)",
      gridTemplateColumns: "repeat(4, 1fr)",
    });
  });

  it("place les sièges PMR dans les deux premières rangées", () => {
    render(<AdminScreenVisualizer rows={4} columns={4} />);
    
    const pmrSeats = screen.getAllByTitle(/Siège [A-Z]\d+ \(PMR\)/);
    pmrSeats.forEach(seat => {
      const identifier = seat.textContent;
      // Vérifie que les sièges PMR sont dans les rangées A ou B
      expect(identifier?.charAt(0)).toMatch(/[AB]/);
    });
  });

  it("place les sièges PMR sur les côtés des rangées", () => {
    render(<AdminScreenVisualizer rows={2} columns={6} />);
    
    // Pour une rangée de 6 sièges, les sièges PMR devraient être aux positions 1 et 6
    expect(screen.getByTitle("Siège A1 (PMR)")).toBeInTheDocument();
    expect(screen.getByTitle("Siège A6 (PMR)")).toBeInTheDocument();
    expect(screen.getByTitle("Siège B1 (PMR)")).toBeInTheDocument();
    expect(screen.getByTitle("Siège B6 (PMR)")).toBeInTheDocument();
  });
}); 