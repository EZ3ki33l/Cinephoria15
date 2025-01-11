import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CheckoutButton } from "../CheckoutButton";
import { toast } from "sonner";

jest.mock("sonner");

describe("CheckoutButton Component", () => {
  const mockItems = [{ price: 'price_test', quantity: 1 }];
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("gère les erreurs de paiement", async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error("Erreur de paiement"));

    render(<CheckoutButton items={mockItems} />);
    const button = screen.getByRole("button");
    
    fireEvent.click(button);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Une erreur est survenue lors du paiement");
    });
  });

  it("désactive le bouton pendant le processus de paiement", async () => {
    global.fetch = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<CheckoutButton items={mockItems} />);
    const button = screen.getByRole("button");
    
    fireEvent.click(button);

    await waitFor(() => {
      expect(button).toHaveAttribute("disabled");
    });
    
    await waitFor(() => {
      expect(button).not.toHaveAttribute("disabled");
    }, { timeout: 200 });
  });

  it("affiche un message de chargement pendant le processus", async () => {
    global.fetch = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<CheckoutButton items={mockItems} />);
    const button = screen.getByRole("button");
    
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    }, { timeout: 200 });
  });
}); 