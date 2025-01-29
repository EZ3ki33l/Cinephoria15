import { render, screen, fireEvent } from "@testing-library/react";
import { LoginDialog } from "../LoginDialog";

// Mock des composants externes
jest.mock("@clerk/nextjs", () => ({
  SignInButton: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sign-in-button">{children}</div>
  ),
}));

describe("LoginDialog Component", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("ne rend pas le dialog quand isOpen est false", () => {
    render(<LoginDialog isOpen={false} onClose={mockOnClose} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("rend le dialog quand isOpen est true", () => {
    render(<LoginDialog isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("affiche le titre et la description", () => {
    render(<LoginDialog isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByText("Connexion requise")).toBeInTheDocument();
    expect(
      screen.getByText("Veuillez vous connecter pour continuer votre réservation.")
    ).toBeInTheDocument();
  });

  it("rend le bouton de connexion", () => {
    render(<LoginDialog isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByText("Se connecter")).toBeInTheDocument();
  });

  it("appelle onClose quand le bouton est cliqué", () => {
    render(<LoginDialog isOpen={true} onClose={mockOnClose} />);
    const button = screen.getByText("Se connecter");
    
    fireEvent.click(button);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("applique les styles appropriés au dialog", () => {
    render(<LoginDialog isOpen={true} onClose={mockOnClose} />);
    const dialogContent = screen.getByRole("dialog");
    
    expect(dialogContent.querySelector(".max-w-md")).toBeInTheDocument();
    expect(dialogContent.querySelector("[style*='z-index: 9999']")).toBeInTheDocument();
  });

  it("intègre correctement le SignInButton", () => {
    render(<LoginDialog isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByTestId("sign-in-button")).toBeInTheDocument();
  });
}); 