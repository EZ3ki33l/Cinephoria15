import { render, screen } from "@testing-library/react";
import { HoverButton } from "../hoverbutton";

describe("HoverButton Component", () => {
  it("rend le contenu avec les styles de base", () => {
    render(<HoverButton>Cliquez-moi</HoverButton>);
    const button = screen.getByRole("button", { name: "Cliquez-moi" });
    
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass(
      "relative",
      "px-6",
      "py-2",
      "rounded-full",
      "font-medium",
      "transition-all",
      "duration-500",
      "bg-transparent",
      "hover:bg-transparent",
      "text-neutral-900"
    );
  });

  it("applique les styles de la variante primary", () => {
    render(<HoverButton variant="primary">Bouton Primary</HoverButton>);
    const button = screen.getByRole("button", { name: "Bouton Primary" });
    
    expect(button).toHaveClass(
      "hover:shadow-[0_0_2px_hsl(var(--primary))]",
      "before:shadow-[0_0_2px_hsl(var(--primary))]"
    );
  });

  it("applique les styles de la variante secondary", () => {
    render(<HoverButton variant="secondary">Bouton Secondary</HoverButton>);
    const button = screen.getByRole("button", { name: "Bouton Secondary" });
    
    expect(button).toHaveClass(
      "hover:shadow-[0_0_2px_hsl(var(--secondary))]",
      "before:shadow-[0_0_2px_hsl(var(--secondary))]"
    );
  });

  it("applique les styles actifs pour la variante primary", () => {
    render(
      <HoverButton variant="primary" isActive>
        Bouton Primary Actif
      </HoverButton>
    );
    const button = screen.getByRole("button", { name: "Bouton Primary Actif" });
    
    expect(button).toHaveClass(
      "text-primary",
      "after:absolute",
      "after:inset-0",
      "after:rounded-full",
      "after:bg-primary/10",
      "after:-z-10",
      "font-semibold"
    );
  });

  it("applique les styles actifs pour la variante secondary", () => {
    render(
      <HoverButton variant="secondary" isActive>
        Bouton Secondary Actif
      </HoverButton>
    );
    const button = screen.getByRole("button", { name: "Bouton Secondary Actif" });
    
    expect(button).toHaveClass(
      "text-secondary",
      "after:absolute",
      "after:inset-0",
      "after:rounded-full",
      "after:bg-secondary/10",
      "after:-z-10",
      "font-semibold"
    );
  });

  it("accepte et applique des classes supplémentaires", () => {
    const customClass = "custom-class";
    render(
      <HoverButton className={customClass}>Bouton avec classe</HoverButton>
    );
    const button = screen.getByRole("button", { name: "Bouton avec classe" });
    
    expect(button).toHaveClass(customClass);
  });

  it("transmet les props HTML supplémentaires", () => {
    render(
      <HoverButton data-testid="hover-button" aria-label="bouton spécial">
        Bouton avec props
      </HoverButton>
    );
    const button = screen.getByTestId("hover-button");
    
    expect(button).toHaveAttribute("aria-label", "bouton spécial");
  });
}); 