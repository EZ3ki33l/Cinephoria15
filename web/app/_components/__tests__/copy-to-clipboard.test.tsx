import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CopyToClipboard } from "../copyToClipboard";
import { toast } from "sonner";

jest.mock("sonner");

describe("CopyToClipboard Component", () => {
  const mockText = "Texte à copier";
  let mockClipboard: { writeText: jest.Mock };
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockClipboard = { writeText: jest.fn(() => Promise.resolve()) };
    Object.defineProperty(navigator, "clipboard", {
      value: mockClipboard,
      configurable: true
    });
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("rend le texte fourni", () => {
    render(<CopyToClipboard text={mockText} />);
    expect(screen.getByText(mockText)).toBeInTheDocument();
  });

  it("copie le texte dans le presse-papiers lors du clic sur le bouton", async () => {
    render(<CopyToClipboard text={mockText} />);
    const button = screen.getByRole("button");
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockClipboard.writeText).toHaveBeenCalledWith(mockText);
      expect(toast.success).toHaveBeenCalledWith(`Texte : "${mockText}" copié.`);
    });
  });

  it("gère les erreurs de copie", async () => {
    const mockError = new Error("Failed to copy");
    mockClipboard.writeText.mockRejectedValueOnce(mockError);
    
    render(<CopyToClipboard text={mockText} />);
    const button = screen.getByRole("button");
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to copy text: ", mockError);
      expect(toast.error).toHaveBeenCalledWith("Impossible de copier le texte");
    });
  });

  it("désactive le bouton pendant la copie", async () => {
    mockClipboard.writeText.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<CopyToClipboard text={mockText} />);
    const button = screen.getByRole("button");
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(button).toHaveAttribute("aria-disabled", "true");
    });
    
    await waitFor(() => {
      expect(button).not.toHaveAttribute("aria-disabled");
    }, { timeout: 200 });
  });

  it("affiche une icône de chargement pendant la copie", async () => {
    mockClipboard.writeText.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<CopyToClipboard text={mockText} />);
    const button = screen.getByRole("button");
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    }, { timeout: 200 });
  });

  it("gère le cas où l'API Clipboard n'est pas disponible", async () => {
    Object.defineProperty(navigator, "clipboard", {
      value: undefined,
      configurable: true
    });
    
    render(<CopyToClipboard text={mockText} />);
    const button = screen.getByRole("button");
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("La fonctionnalité de copie n'est pas disponible sur votre navigateur");
    });
  });
}); 